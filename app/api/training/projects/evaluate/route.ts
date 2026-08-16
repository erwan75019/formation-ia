import { createHash } from "crypto";
import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getOfficialLessonMinimumPlan, requireTrainingAccess } from "@/lib/training/access";
import {
  isFundamentalsProjectId,
  projectPrerequisites,
} from "@/lib/training/projects/catalog";
import { projectDefinitions } from "@/lib/training/projects/definitions.server";
import {
  evaluateProject,
} from "@/lib/training/projects/evaluator.server";
import { validateProjectWork } from "@/lib/training/projects/validation";

const COOLDOWN_MS = 60_000;

async function preserveBestProgress(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  lessonId: string,
  score: number
) {
  const now = new Date().toISOString();
  const { data: current, error: readError } = await admin
    .from("lesson_progress")
    .select("score, completed, completed_at")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (readError) return readError;

  if (!current) {
    const { error } = await admin.from("lesson_progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      score,
      completed_at: now,
      last_viewed_at: now,
    });
    if (!error || error.code !== "23505") return error;
    return preserveBestProgress(admin, userId, lessonId, score);
  }

  const currentScore = current.score ?? -1;
  const payload = {
    completed: true,
    score: Math.max(currentScore, score),
    completed_at: current.completed_at ?? now,
    last_viewed_at: now,
  };
  const query = admin
    .from("lesson_progress")
    .update(payload)
    .eq("user_id", userId)
    .eq("lesson_id", lessonId);
  const { error } = currentScore >= score
    ? await query
    : await query.or(`score.is.null,score.lt.${score}`);
  return error;
}

function jsonError(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error }, { status, headers });
}

export async function POST(request: Request) {
  const access = await requireTrainingAccess("fondamentaux");
  if (!access.authorized) return access.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête JSON invalide.", 400);
  }

  if (
    typeof body !== "object" || body === null || Array.isArray(body) ||
    Object.keys(body).length !== 2 || !("lesson_id" in body) || !("work" in body)
  ) {
    return jsonError("Seuls lesson_id et work sont acceptés.", 400);
  }

  const { lesson_id: lessonId, work } = body as {
    lesson_id?: unknown;
    work?: unknown;
  };
  if (!isFundamentalsProjectId(lessonId)) {
    if (getOfficialLessonMinimumPlan(lessonId) === "complet") {
      return jsonError("Ce projet est hors du forfait Fondamentaux.", 403);
    }
    return jsonError("lesson_id inconnu.", 400);
  }

  const definition = projectDefinitions[lessonId];
  const validated = validateProjectWork(definition, work);
  if (!validated.valid) return jsonError(validated.error, 400);

  const admin = createAdminClient();
  const prerequisites = projectPrerequisites[lessonId];
  const { data: progress, error: prerequisiteError } = await admin
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", access.userId)
    .in("lesson_id", [...prerequisites]);

  if (prerequisiteError) {
    return jsonError("Impossible de vérifier les prérequis.", 500);
  }
  const completed = new Set(
    (progress ?? [])
      .filter((item) => item.completed === true && typeof item.completed_at === "string")
      .map((item) => item.lesson_id)
  );
  if (prerequisites.some((id) => !completed.has(id))) {
    return jsonError("Les leçons précédentes doivent être terminées.", 409);
  }

  const canonical = JSON.stringify(
    Object.fromEntries(definition.fields.map(({ key }) => [key, validated.work[key]]))
  );
  const contentHash = createHash("sha256")
    .update(`${lessonId}:${definition.version}:${canonical}`)
    .digest("hex");

  const { data: existing } = await admin
    .from("project_evaluation_attempts")
    .select("id, status, score, passed, rubric_details, improvements, created_at")
    .eq("user_id", access.userId)
    .eq("lesson_id", lessonId)
    .eq("subject_version", definition.version)
    .eq("content_hash", contentHash)
    .maybeSingle();

  if (existing?.status === "completed") {
    if (existing.passed && typeof existing.score === "number") {
      const progressError = await preserveBestProgress(
        admin,
        access.userId,
        lessonId,
        existing.score
      );
      if (progressError) return jsonError("Impossible d’enregistrer la progression.", 500);
    }
    return NextResponse.json({
      cached: true,
      score: existing.score,
      passed: existing.passed,
      criteria: existing.rubric_details,
      improvements: existing.improvements,
    });
  }
  if (existing?.status === "processing") {
    return jsonError("Cette soumission est déjà en cours d’évaluation.", 409);
  }

  const { data: latest } = await admin
    .from("project_evaluation_attempts")
    .select("created_at")
    .eq("user_id", access.userId)
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const retryAfter = latest
    ? Math.ceil((COOLDOWN_MS - (Date.now() - new Date(latest.created_at).getTime())) / 1000)
    : 0;
  if (retryAfter > 0) {
    return jsonError("Veuillez patienter avant une nouvelle tentative.", 429, {
      "Retry-After": String(retryAfter),
    });
  }

  const attemptPayload = {
    user_id: access.userId,
    lesson_id: lessonId,
    subject_version: definition.version,
    content_hash: contentHash,
    status: "processing",
  };
  const reservation = existing
    ? await admin.from("project_evaluation_attempts").update(attemptPayload).eq("id", existing.id).select("id").single()
    : await admin.from("project_evaluation_attempts").insert(attemptPayload).select("id").single();

  if (reservation.error || !reservation.data) {
    if (reservation.error?.code === "23505") {
      return jsonError("Cette soumission est déjà en cours d’évaluation.", 409);
    }
    return jsonError("Impossible d’enregistrer la tentative.", 500);
  }

  let evaluation;
  try {
    evaluation = await evaluateProject(definition, validated.work);
  } catch {
    await admin
      .from("project_evaluation_attempts")
      .update({ status: "failed", score: null, passed: false })
      .eq("id", reservation.data.id);
    return jsonError("L’évaluateur est indisponible ou sa réponse est invalide.", 503);
  }

  const { error: attemptError } = await admin
    .from("project_evaluation_attempts")
    .update({
      status: "completed",
      score: evaluation.score,
      passed: evaluation.passed,
      rubric_details: evaluation.criteria,
      improvements: evaluation.improvements,
      evaluated_at: new Date().toISOString(),
    })
    .eq("id", reservation.data.id);
  if (attemptError) return jsonError("Impossible d’enregistrer l’évaluation.", 500);

  if (evaluation.passed) {
    const progressError = await preserveBestProgress(
      admin,
      access.userId,
      lessonId,
      evaluation.score
    );
    if (progressError) return jsonError("Impossible d’enregistrer la progression.", 500);
  }

  return NextResponse.json({
    cached: false,
    score: evaluation.score,
    passed: evaluation.passed,
    criteria: evaluation.criteria,
    improvements: evaluation.improvements,
  });
}
