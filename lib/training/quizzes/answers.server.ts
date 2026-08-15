import "server-only";

import { scoreModule1Quiz } from "@/lib/training/module1/answers.server";
import { isModule1LessonId } from "@/lib/training/module1/quizzes";
import type { FundamentalsLessonId } from "@/lib/training/quizzes/catalog";

const modules2To5CorrectAnswers = {
  "prompts-01-structure": [
    0,
    1,
    0
  ],
  "prompts-02-role": [
    0,
    0,
    1
  ],
  "prompts-03-templates": [
    0,
    1,
    0
  ],
  "prompts-04-iteration": [
    0,
    0,
    0
  ],
  "prompts-05-project": [
    0,
    0,
    0
  ],
  "quotidien-01-travail": [
    1,
    2,
    1,
    1
  ],
  "quotidien-02-etudes": [
    2,
    1,
    1,
    0
  ],
  "quotidien-03-recherche": [
    2,
    0,
    2,
    2
  ],
  "quotidien-04-documents": [
    0,
    1,
    2,
    1
  ],
  "quotidien-05-mission": [
    2,
    0,
    1,
    1
  ],
  "fichiers-01-comprendre": [
    0,
    0,
    1,
    2
  ],
  "fichiers-02-questions": [
    1,
    1,
    0,
    1
  ],
  "fichiers-03-organiser": [
    0,
    0,
    1,
    0
  ],
  "fichiers-04-dashboard": [
    1,
    0,
    0,
    0
  ],
  "fichiers-05-decisions": [
    1,
    1,
    2,
    0
  ],
  "fichiers-06-projet": [
    0,
    0,
    0,
    0
  ],
  "automation-01-logic": [
    0,
    1,
    2,
    0
  ],
  "automation-02-tri": [
    0,
    1,
    1,
    2
  ],
  "automation-03-extraction": [
    0,
    0,
    2,
    0
  ],
  "automation-04-email": [
    0,
    1,
    0,
    1
  ],
  "automation-05-control": [
    2,
    0,
    2,
    0
  ],
  "automation-06-workflow": [
    0,
    0,
    0,
    0
  ],
  "automation-07-project": [
    0,
    2,
    1,
    1
  ]
} as const;

export function getModules2To5CorrectAnswers(lessonId: string): readonly number[] | null {
  return modules2To5CorrectAnswers[lessonId as keyof typeof modules2To5CorrectAnswers] ?? null;
}

export const secureQuizPassingScore = 70;

export function scoreSecureQuiz(
  lessonId: FundamentalsLessonId,
  answers: readonly number[]
) {
  if (isModule1LessonId(lessonId)) {
    return scoreModule1Quiz(lessonId, answers);
  }

  const expectedAnswers = getModules2To5CorrectAnswers(lessonId);

  if (!expectedAnswers) {
    return null;
  }

  const correctCount = answers.reduce(
    (total, answer, index) =>
      total + (answer === expectedAnswers[index] ? 1 : 0),
    0
  );
  const score = Math.round((correctCount / expectedAnswers.length) * 100);

  return {
    correctCount,
    score,
    passed: score >= secureQuizPassingScore,
  };
}
