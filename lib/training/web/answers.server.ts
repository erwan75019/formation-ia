import "server-only";

import type { WebLessonId } from "./quizzes";
import { getWebQuiz } from "./quizzes";

export const webQuizPassingScore = 70;

const correctAnswers: Record<WebLessonId, readonly number[]> = {
  "web-01-projet-vscode": [1, 0, 2, 1],
  "web-02-nextjs": [0, 2, 1, 0],
  "web-03-structure": [2, 1, 0, 2],
  "web-04-tailwind": [1, 2, 0, 1],
  "web-05-donnees": [0, 1, 2, 0],
  "web-06-composants": [2, 0, 1, 2],
  "web-07-cartes": [2, 0, 1, 0],
  "web-08-recherche": [0, 2, 1, 2],
  "web-09-matching": [1, 2, 0, 2],
  "web-10-fiches": [1, 0, 2, 0],
  "web-11-favoris": [2, 1, 0, 1],
  "web-12-publication": [0, 2, 1, 1],
};

export function scoreWebQuiz(lessonId: WebLessonId, answers: readonly number[]) {
  const quiz = getWebQuiz(lessonId);
  const expected = correctAnswers[lessonId];
  if (!quiz || answers.length !== expected.length) return null;
  const correctCount = answers.filter((answer, index) => answer === expected[index]).length;
  const score = Math.round((correctCount / expected.length) * 100);
  return { score, correctCount, passed: score >= webQuizPassingScore };
}
