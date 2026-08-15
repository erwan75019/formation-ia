import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  getOfficialLessonMinimumPlan,
  requireTrainingAccess,
} from "@/lib/training/access";
import {
  module1PassingScore,
  scoreModule1Quiz,
} from "@/lib/training/module1/answers.server";
import {
  getModule1QuizByLessonId,
  isModule1LessonId,
  module1LessonIds,
  type Module1LessonId,
} from "@/lib/training/module1/quizzes";

type Progress = {
  completed: boolean | null;
  completed_at: string | null;
  score: number | null;
};

function invalidRequest(message = "Requête invalide.") {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function readProgress(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  lessonId: Module1LessonId
) {
  return admin
    .from("lesson_progress")
    .select("completed, completed_at, score")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle<Progress>();
}

async function preserveBestSuccessfulAttempt(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  lessonId: Module1LessonId,
  score: number
) {
  const { data: existing, error: readError } = await readProgress(
    admin,
    userId,
    lessonId
  );

  if (readError) {
    return { progress: null, error: readError };
  }

  if (existing && (existing.score ?? -1) >= score && existing.completed) {
    return { progress: existing, error: null };
  }

  const attemptedAt = new Date().toISOString();

  if (existing) {
    const { data, error } = await admin
      .from("lesson_progress")
      .update({
        completed: true,
        score,
        completed_at: existing.completed_at ?? attemptedAt,
        last_viewed_at: attemptedAt,
      })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .or(`score.is.null,score.lt.${score}`)
      .select("completed, completed_at, score")
      .maybeSingle<Progress>();

    if (error) {
      return { progress: null, error };
    }

    if (data) {
      return { progress: data, error: null };
    }

    return readProgress(admin, userId, lessonId).then(({ data, error }) => ({
      progress: data,
      error,
    }));
  }

  const { data, error } = await admin
    .from("lesson_progress")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      score,
      completed_at: attemptedAt,
      last_viewed_at: attemptedAt,
    })
    .select("completed, completed_at, score")
    .single<Progress>();

  if (!error) {
    return { progress: data, error: null };
  }

  if (error.code !== "23505") {
    return { progress: null, error };
  }

  const { data: concurrentProgress, error: concurrentReadError } =
    await readProgress(admin, userId, lessonId);

  if (concurrentReadError || !concurrentProgress) {
    return { progress: null, error: concurrentReadError ?? error };
  }

  if ((concurrentProgress.score ?? -1) >= score) {
    return { progress: concurrentProgress, error: null };
  }

  const { data: updated, error: updateError } = await admin
    .from("lesson_progress")
    .update({
      completed: true,
      score,
      completed_at: concurrentProgress.completed_at ?? attemptedAt,
      last_viewed_at: attemptedAt,
    })
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .or(`score.is.null,score.lt.${score}`)
    .select("completed, completed_at, score")
    .maybeSingle<Progress>();

  if (updateError) {
    return { progress: null, error: updateError };
  }

  if (updated) {
    return { progress: updated, error: null };
  }

  return readProgress(admin, userId, lessonId).then(({ data, error }) => ({
    progress: data,
    error,
  }));
}

export async function POST(request: Request) {
  const access = await requireTrainingAccess("fondamentaux");

  if (!access.authorized) {
    return access.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return invalidRequest();
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body) ||
    Object.keys(body).length !== 2 ||
    !("lesson_id" in body) ||
    !("answers" in body)
  ) {
    return invalidRequest(
      "Seuls lesson_id et les réponses choisies sont acceptés."
    );
  }

  const { lesson_id: lessonId, answers } = body as {
    lesson_id?: unknown;
    answers?: unknown;
  };

  if (!isModule1LessonId(lessonId)) {
    if (getOfficialLessonMinimumPlan(lessonId) === "complet") {
      return NextResponse.json(
        { error: "Cette leçon nécessite l’offre Complet." },
        { status: 403 }
      );
    }

    return invalidRequest("lesson_id inconnu pour le module 1.");
  }

  const quiz = getModule1QuizByLessonId(lessonId);

  if (
    !quiz ||
    !Array.isArray(answers) ||
    answers.length !== quiz.questions.length ||
    answers.some(
      (answer, index) =>
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer >= quiz.questions[index].choices.length
    )
  ) {
    return invalidRequest("Les réponses choisies sont mal formées.");
  }

  const admin = createAdminClient();
  const lessonIndex = module1LessonIds.indexOf(lessonId);

  if (lessonIndex > 0) {
    const previousLessonId = module1LessonIds[lessonIndex - 1];
    const { data: previousProgress, error: previousError } = await readProgress(
      admin,
      access.userId,
      previousLessonId
    );

    if (previousError) {
      console.error(
        "Erreur vérification ordre module 1 :",
        previousError.message
      );
      return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }

    if (
      previousProgress?.completed !== true ||
      typeof previousProgress.completed_at !== "string"
    ) {
      return NextResponse.json(
        { error: "La leçon précédente doit d’abord être terminée." },
        { status: 409 }
      );
    }
  }

  const result = scoreModule1Quiz(lessonId, answers);

  if (!result.passed) {
    const { data: existing, error: existingError } = await readProgress(
      admin,
      access.userId,
      lessonId
    );

    if (existingError) {
      console.error("Erreur lecture score module 1 :", existingError.message);
      return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }

    return NextResponse.json({
      lesson_id: lessonId,
      score: result.score,
      passed: false,
      completed: existing?.completed === true,
      correct_count: result.correctCount,
      total_questions: quiz.questions.length,
      passing_score: module1PassingScore,
      best_score: existing?.score ?? null,
    });
  }

  const { progress, error: writeError } = await preserveBestSuccessfulAttempt(
    admin,
    access.userId,
    lessonId,
    result.score
  );

  if (writeError || !progress) {
    console.error(
      "Erreur validation module 1 :",
      writeError?.message ?? "progression absente"
    );
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({
    lesson_id: lessonId,
    score: result.score,
    passed: true,
    completed: true,
    correct_count: result.correctCount,
    total_questions: quiz.questions.length,
    passing_score: module1PassingScore,
    best_score: progress.score,
  });
}
