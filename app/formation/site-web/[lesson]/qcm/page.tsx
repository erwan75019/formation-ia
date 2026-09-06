import { notFound } from "next/navigation";

import SecureWebQuiz from "@/components/formation/web/SecureWebQuiz";
import {
  getWebLessonIdFromSlug,
  getWebQuizContinuation,
} from "@/lib/training/web/navigation";
import { getWebQuiz } from "@/lib/training/web/quizzes";

export default async function SiteWebQuizPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const quiz = getWebQuiz(getWebLessonIdFromSlug(slug));
  if (!quiz) notFound();
  const continuation = getWebQuizContinuation(quiz.lessonId);
  if (!continuation) notFound();

  return (
    <SecureWebQuiz quiz={quiz} slug={slug} continuation={continuation} />
  );
}
