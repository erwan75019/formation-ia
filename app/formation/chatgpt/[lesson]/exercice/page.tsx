"use client";

import { useParams } from "next/navigation";

import SecureQuizExercise from "@/components/formation/SecureQuizExercise";
import { module1Quizzes } from "@/lib/training/module1/quizzes";

export default function ChatGptExercisePage() {
  const { lesson = "" } = useParams<{ lesson: string }>();
  const quiz = module1Quizzes[lesson as keyof typeof module1Quizzes];
  const lessonNumber = Number(lesson);
  const nextLesson =
    lessonNumber < 5 ? String(lessonNumber + 1).padStart(2, "0") : null;

  return (
    <SecureQuizExercise
      quiz={quiz ? { ...quiz, validation: "objective_quiz" } : undefined}
      lessonSlug={lesson}
      lessonHref={`/formation/chatgpt/${lesson}`}
      nextLessonHref={
        nextLesson ? `/formation/chatgpt/${nextLesson}` : null
      }
      moduleHref="/formation/chatgpt"
    />
  );
}
