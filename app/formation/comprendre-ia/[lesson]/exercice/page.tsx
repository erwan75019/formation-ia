"use client";

import { useParams } from "next/navigation";

import SecureQuizExercise from "@/components/formation/SecureQuizExercise";
import { getModules2To5Quiz } from "@/lib/training/quizzes/catalog";

export default function FilesExercisePage() {
  const { lesson = "" } = useParams<{ lesson: string }>();
  const lessonNumber = Number(lesson);
  const nextLesson =
    lessonNumber < 6 ? String(lessonNumber + 1).padStart(2, "0") : null;

  return (
    <SecureQuizExercise
      quiz={getModules2To5Quiz("fichiers", lesson)}
      lessonSlug={lesson}
      lessonHref={`/formation/comprendre-ia/${lesson}`}
      nextLessonHref={
        nextLesson ? `/formation/comprendre-ia/${nextLesson}` : null
      }
      moduleHref="/formation/comprendre-ia"
    />
  );
}
