"use client";

import { useParams } from "next/navigation";

import SecureQuizExercise from "@/components/formation/SecureQuizExercise";
import { getModules2To5Quiz } from "@/lib/training/quizzes/catalog";

export default function AutomationExercisePage() {
  const { lesson = "" } = useParams<{ lesson: string }>();
  const lessonNumber = Number(lesson);
  const nextLesson =
    lessonNumber < 7 ? String(lessonNumber + 1).padStart(2, "0") : null;

  return (
    <SecureQuizExercise
      quiz={getModules2To5Quiz("automation", lesson)}
      lessonSlug={lesson}
      lessonHref={`/formation/automatisation/${lesson}`}
      nextLessonHref={
        nextLesson ? `/formation/automatisation/${nextLesson}` : null
      }
      moduleHref="/formation/automatisation"
    />
  );
}
