import "server-only";

import type { Module1LessonId } from "@/lib/training/module1/quizzes";

const correctAnswers = {
  "chatgpt-01-intro": [1, 2, 0],
  "chatgpt-02-interface": [1, 0, 1],
  "chatgpt-03-prompt": [2, 0, 1],
  "chatgpt-04-contexte": [1, 2, 0],
  "chatgpt-05-format": [1, 3, 0],
} as const satisfies Record<Module1LessonId, readonly number[]>;

export const module1PassingScore = 70;

export function scoreModule1Quiz(
  lessonId: Module1LessonId,
  answers: readonly number[]
) {
  const expectedAnswers = correctAnswers[lessonId];
  const correctCount = answers.reduce(
    (total, answer, index) =>
      total + (answer === expectedAnswers[index] ? 1 : 0),
    0
  );
  const score = Math.round((correctCount / expectedAnswers.length) * 100);

  return {
    correctCount,
    score,
    passed: score >= module1PassingScore,
  };
}
