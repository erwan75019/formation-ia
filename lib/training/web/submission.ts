import { getWebQuiz, type WebQuiz, type WebLessonId } from "./quizzes.ts";

export type WebQuizAnswer = number | null;

export type WebQuizSubmission = {
  lesson_id: WebLessonId;
  answers: number[];
};

type ParsedWebQuizSubmission =
  | { valid: true; quiz: WebQuiz; answers: number[] }
  | { valid: false; reason: "shape" | "lesson" | "answers" };

export function createEmptyWebQuizAnswers(questionCount: number) {
  return Array.from<WebQuizAnswer>({ length: questionCount }).fill(null);
}

export function toWebQuizAnswerIndex(value: string) {
  const answer = Number(value);
  return Number.isInteger(answer) && answer >= 0 && answer <= 2
    ? answer
    : null;
}

export function buildWebQuizSubmission(
  quiz: WebQuiz,
  answers: readonly WebQuizAnswer[]
): WebQuizSubmission | null {
  if (
    answers.length !== quiz.questions.length ||
    answers.some(
      (answer, index) =>
        !Number.isInteger(answer) ||
        answer === null ||
        answer < 0 ||
        answer >= quiz.questions[index].choices.length
    )
  ) {
    return null;
  }

  return {
    lesson_id: quiz.lessonId,
    answers: answers.map((answer) => answer as number),
  };
}

export function parseWebQuizSubmission(
  body: unknown
): ParsedWebQuizSubmission {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body) ||
    Object.keys(body).length !== 2 ||
    !("lesson_id" in body) ||
    !("answers" in body)
  ) {
    return { valid: false, reason: "shape" };
  }

  const { lesson_id: lessonId, answers } = body as {
    lesson_id?: unknown;
    answers?: unknown;
  };
  const quiz = getWebQuiz(lessonId);
  if (!quiz) return { valid: false, reason: "lesson" };

  if (
    !Array.isArray(answers) ||
    answers.length !== quiz.questions.length ||
    answers.some(
      (answer, index) =>
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer >= quiz.questions[index].choices.length
    )
  ) {
    return { valid: false, reason: "answers" };
  }

  return { valid: true, quiz, answers };
}
