import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireTrainingAccess } from "@/lib/training/access";
import {
  launchCraftQuizPassingScore,
  scoreLaunchCraftQuiz,
} from "@/lib/training/launchcraft/answers.server";
import { getLaunchCraftQuiz } from "@/lib/training/launchcraft/quizzes";
import { getPreviousOfficialLessonId } from "@/lib/training/catalog";

type Progress = {
  completed: boolean | null;
  completed_at: string | null;
  score: number | null;
};

function invalid(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function readProgress(userId: string, lessonId: string) {
  return createAdminClient()
    .from("lesson_progress")
    .select("completed, completed_at, score")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle<Progress>();
}

export async function POST(request: Request) {
  const access = await requireTrainingAccess("complet");
  if (!access.authorized) return access.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalid("Requête invalide.");
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length !== 2 ||
    !("lesson_id" in body) ||
    !("answers" in body)
  ) {
    return invalid("Seuls lesson_id et answers sont acceptés.");
  }

  const { lesson_id: lessonId, answers } = body as {
    lesson_id?: unknown;
    answers?: unknown;
  };
  const quiz = getLaunchCraftQuiz(lessonId);

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
    return invalid("Les réponses choisies sont mal formées.");
  }

  const previousLessonId = getPreviousOfficialLessonId(quiz.lessonId);
  if (previousLessonId) {
    const { data, error } = await readProgress(access.userId, previousLessonId);
    if (error) {
      console.error("Erreur vérification prérequis LaunchCraft :", error.message);
      return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
    if (
      data?.completed !== true ||
      typeof data.completed_at !== "string" ||
      data.completed_at.length === 0
    ) {
      return NextResponse.json(
        { error: `La leçon précédente (${previousLessonId}) doit d’abord être terminée.` },
        { status: 409 }
      );
    }
  }

  const result = scoreLaunchCraftQuiz(lessonId, answers);
  if (!result) return invalid("Aucun corrigé sécurisé pour cette leçon.");

  const { data: existing, error: readError } = await readProgress(
    access.userId,
    quiz.lessonId
  );
  if (readError) {
    console.error("Erreur lecture progression LaunchCraft :", readError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  if (!result.passed) {
    return NextResponse.json({
      lesson_id: quiz.lessonId,
      score: result.score,
      passed: false,
      completed: existing?.completed === true,
      correct_count: result.correctCount,
      total_questions: quiz.questions.length,
      passing_score: launchCraftQuizPassingScore,
      best_score: existing?.score ?? null,
    });
  }

  const now = new Date().toISOString();
  const bestScore = Math.max(existing?.score ?? -1, result.score);
  const admin = createAdminClient();
  let writeError;

  if (existing) {
    const response = await admin
      .from("lesson_progress")
      .update({
        completed: true,
        score: bestScore,
        completed_at: existing.completed_at ?? now,
        last_viewed_at: now,
      })
      .eq("user_id", access.userId)
      .eq("lesson_id", quiz.lessonId);
    writeError = response.error;
  } else {
    const response = await admin.from("lesson_progress").insert({
      user_id: access.userId,
      lesson_id: quiz.lessonId,
      completed: true,
      score: result.score,
      completed_at: now,
      last_viewed_at: now,
    });
    writeError = response.error;

    if (writeError?.code === "23505") {
      const { data: concurrent, error: concurrentReadError } =
        await readProgress(access.userId, quiz.lessonId);
      if (concurrentReadError || !concurrent) {
        console.error(
          "Erreur lecture concurrente LaunchCraft :",
          concurrentReadError?.message ?? "progression absente"
        );
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
      }

      const retry = await admin
        .from("lesson_progress")
        .update({
          completed: true,
          score: Math.max(concurrent.score ?? -1, result.score),
          completed_at: concurrent.completed_at ?? now,
          last_viewed_at: now,
        })
        .eq("user_id", access.userId)
        .eq("lesson_id", quiz.lessonId)
        .or(`score.is.null,score.lt.${result.score}`);
      writeError = retry.error;
    }
  }

  if (writeError) {
    console.error("Erreur validation QCM LaunchCraft :", writeError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({
    lesson_id: quiz.lessonId,
    score: result.score,
    passed: true,
    completed: true,
    correct_count: result.correctCount,
    total_questions: quiz.questions.length,
    passing_score: launchCraftQuizPassingScore,
    best_score: bestScore,
  });
}
