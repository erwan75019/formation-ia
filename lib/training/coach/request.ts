export const COACH_MAX_QUESTION_LENGTH = 800;

export type CoachRequest = {
  lesson_id: string;
  question: string;
};

export type CoachRequestError = "invalid_body" | "invalid_lesson" | "empty_question" | "question_too_long";

export function parseCoachRequest(value: unknown):
  | { ok: true; data: CoachRequest }
  | { ok: false; error: CoachRequestError } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "invalid_body" };
  }

  const body = value as Record<string, unknown>;
  const keys = Object.keys(body).sort();

  if (keys.length !== 2 || keys[0] !== "lesson_id" || keys[1] !== "question") {
    return { ok: false, error: "invalid_body" };
  }

  if (typeof body.lesson_id !== "string" || body.lesson_id.trim() !== body.lesson_id || body.lesson_id.length === 0) {
    return { ok: false, error: "invalid_lesson" };
  }

  if (typeof body.question !== "string" || body.question.trim().length === 0) {
    return { ok: false, error: "empty_question" };
  }

  const question = body.question.trim();
  if (question.length > COACH_MAX_QUESTION_LENGTH) {
    return { ok: false, error: "question_too_long" };
  }

  return { ok: true, data: { lesson_id: body.lesson_id, question } };
}

export function isQuizAnswerRequest(question: string) {
  return /(corrig[ée]|r[ée]ponse[s]? (?:du|au) qcm|bonne[s]? r[ée]ponse[s]?|donne.{0,20}r[ée]ponse[s]?|answer key)/iu.test(question);
}
