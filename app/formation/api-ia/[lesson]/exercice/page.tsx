"use client";

import { useParams } from "next/navigation";

import SecureQuizExercise from "@/components/formation/SecureQuizExercise";
import {
  getNextTrainingModuleRoute,
  moduleLessonIds,
} from "@/lib/training/catalog";
import { getLaunchCraftQuiz } from "@/lib/training/launchcraft/quizzes";

export default function APIExercisePage() {
  const { lesson: lessonSlug } = useParams<{ lesson: string }>();
  const lessonNumber = Number(lessonSlug);
  const lessonIndex = Number.isInteger(lessonNumber) ? lessonNumber - 1 : -1;
  const lessonId = moduleLessonIds[7][lessonIndex] ?? null;
  const quiz = getLaunchCraftQuiz(lessonId);
  const hasNextLesson =
    lessonIndex >= 0 && lessonIndex < moduleLessonIds[7].length - 1;
  const destination = hasNextLesson
    ? `/formation/api-ia/${String(lessonNumber + 1).padStart(2, "0")}`
    : getNextTrainingModuleRoute(7);

  return (
    <SecureQuizExercise
      quiz={quiz ?? undefined}
      lessonSlug={lessonSlug}
      lessonHref={`/formation/api-ia/${lessonSlug}`}
      nextLessonHref={destination}
      moduleHref="/formation/api-ia"
      validationEndpoint="/api/training/launchcraft/quiz/validate"
    />
  );
}
