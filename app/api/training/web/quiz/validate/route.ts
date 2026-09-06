import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireTrainingAccess } from "@/lib/training/access";
import { getPreviousOfficialLessonId } from "@/lib/training/catalog";
import { scoreWebQuiz, webQuizPassingScore } from "@/lib/training/web/answers.server";
import { parseWebQuizSubmission } from "@/lib/training/web/submission";

type Progress = { completed: boolean | null; completed_at: string | null; score: number | null };

const invalid = (error: string) => NextResponse.json({ error }, { status: 400 });

async function readProgress(admin: ReturnType<typeof createAdminClient>, userId: string, lessonId: string) {
  return admin.from("lesson_progress").select("completed, completed_at, score")
    .eq("user_id", userId).eq("lesson_id", lessonId).maybeSingle<Progress>();
}

export async function POST(request: Request) {
  const access = await requireTrainingAccess("complet");
  if (!access.authorized) return access.response;

  let body: unknown;
  try { body = await request.json(); } catch { return invalid("Requête JSON invalide."); }
  const submission = parseWebQuizSubmission(body);
  if (!submission.valid && submission.reason === "shape") {
    return invalid("Seuls lesson_id et answers sont acceptés.");
  }
  if (!submission.valid && submission.reason === "lesson") {
    return invalid("lesson_id inconnu pour cette validation.");
  }
  if (!submission.valid) {
    return invalid("Les réponses choisies sont mal formées.");
  }

  const { quiz, answers } = submission;
  const validatedLessonId = quiz.lessonId;

  const admin = createAdminClient();
  const previousLessonId = getPreviousOfficialLessonId(validatedLessonId);
  if (previousLessonId) {
    const { data, error } = await readProgress(admin, access.userId, previousLessonId);
    if (error) {
      console.error("Erreur vérification prérequis QCM web :", error.message);
      return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
    if (data?.completed !== true || typeof data.completed_at !== "string") {
      return NextResponse.json({ error: "La leçon précédente doit d’abord être terminée." }, { status: 409 });
    }
  }

  const result = scoreWebQuiz(validatedLessonId, answers);
  if (!result) return invalid("Aucun corrigé sécurisé pour cette leçon.");
  const { data: existing, error: readError } = await readProgress(admin, access.userId, validatedLessonId);
  if (readError) {
    console.error("Erreur lecture progression QCM web :", readError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  if (!result.passed) {
    return NextResponse.json({ lesson_id: validatedLessonId, score: result.score, passed: false,
      completed: existing?.completed === true, correct_count: result.correctCount,
      total_questions: quiz.questions.length, passing_score: webQuizPassingScore,
      best_score: existing?.score ?? null });
  }

  const now = new Date().toISOString();
  const bestScore = Math.max(existing?.score ?? -1, result.score);
  let writeError;
  if (existing) {
    const response = await admin.from("lesson_progress").update({ completed: true, score: bestScore,
      completed_at: existing.completed_at ?? now, last_viewed_at: now })
      .eq("user_id", access.userId).eq("lesson_id", validatedLessonId);
    writeError = response.error;
  } else {
    const response = await admin.from("lesson_progress").insert({ user_id: access.userId,
      lesson_id: validatedLessonId, completed: true, score: result.score, completed_at: now, last_viewed_at: now });
    writeError = response.error;
    if (writeError?.code === "23505") {
      const { data: concurrent, error: concurrentError } = await readProgress(
        admin,
        access.userId,
        validatedLessonId
      );
      if (concurrentError || !concurrent) {
        console.error(
          "Erreur lecture concurrente QCM web :",
          concurrentError?.message ?? "progression absente"
        );
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
      }
      const retry = await admin.from("lesson_progress").update({ completed: true, score: result.score,
        completed_at: concurrent.completed_at ?? now, last_viewed_at: now }).eq("user_id", access.userId).eq("lesson_id", validatedLessonId)
        .or(`score.is.null,score.lt.${result.score}`);
      writeError = retry.error;
    }
  }
  if (writeError) {
    console.error("Erreur validation QCM web :", writeError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
  return NextResponse.json({ lesson_id: validatedLessonId, score: result.score, passed: true, completed: true,
    correct_count: result.correctCount, total_questions: quiz.questions.length,
    passing_score: webQuizPassingScore, best_score: bestScore });
}
