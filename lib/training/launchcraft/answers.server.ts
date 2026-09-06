import "server-only";

import { getLaunchCraftQuiz } from "./quizzes";
import { calculateObjectiveQuizScore } from "./quiz-score";

export const launchCraftQuizPassingScore = 70;
const correctAnswers = {
  "api-01-intro": [1, 2, 0, 1],
  "api-02-http": [2, 0, 1, 0],
  "api-03-requests": [1, 2, 0, 1],
  "api-04-status": [2, 0, 1, 2],
  "api-05-keys-env": [1, 0, 2, 1],
  "api-06-ai-call": [1, 0, 2, 0],
  "api-07-project": [1, 0, 1, 2],
  "api-08-calendar": [1, 2, 0, 1],
  "api-09-security": [2, 0, 1, 2],
} as const;

export function scoreLaunchCraftQuiz(
  lessonId: unknown,
  answers: readonly number[]
) {
  const quiz = getLaunchCraftQuiz(lessonId);
  if (!quiz) return null;
  const expected = correctAnswers[quiz.lessonId];
  if (answers.length !== expected.length) return null;

  return calculateObjectiveQuizScore(
    answers,
    expected,
    launchCraftQuizPassingScore
  );
}
