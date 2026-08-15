"use client";

import { useParams } from "next/navigation";

import SecureQuizExercise from "@/components/formation/SecureQuizExercise";
import { getModules2To5Quiz } from "@/lib/training/quizzes/catalog";

export default function QuotidienExercisePage() {
  const { lesson = "" } = useParams<{ lesson: string }>();
  const lessonNumber = Number(lesson);
  const nextLesson =
    lessonNumber < 5 ? String(lessonNumber + 1).padStart(2, "0") : null;

  return (
    <SecureQuizExercise
      quiz={getModules2To5Quiz("quotidien", lesson)}
      lessonSlug={lesson}
      lessonHref={`/formation/quotidien/${lesson}`}
      nextLessonHref={nextLesson ? `/formation/quotidien/${nextLesson}` : null}
      moduleHref="/formation/quotidien"
    />
  );
}
