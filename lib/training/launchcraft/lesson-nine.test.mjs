import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getNextTrainingModuleRoute, isValidLessonCompletion, moduleLessonIds, planLessonTotals } from "../catalog.ts";
import { getLaunchCraftQuiz, launchCraftLessonNineQuiz } from "./quizzes.ts";
import { calculateObjectiveQuizScore } from "./quiz-score.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la leçon 09 exige api-08-calendar complet et daté", () => {
  const page = read("app/formation/api-ia/[lesson]/page.tsx");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.deepEqual(moduleLessonIds[7].slice(-2), ["api-08-calendar", "api-09-security"]);
  assert.match(page, /isValidLessonCompletion/);
  assert.match(route, /getPreviousOfficialLessonId/);
  assert.match(route, /data\?\.completed !== true/);
  assert.match(route, /data\.completed_at\.length === 0/);
});

test("la leçon 09 reste verrouillée tant que 08 n'est pas complet et daté", () => {
  assert.equal(isValidLessonCompletion({ lesson_id: "api-08-calendar", completed: false, completed_at: null }, "api-08-calendar"), false);
  assert.equal(isValidLessonCompletion({ lesson_id: "api-08-calendar", completed: true, completed_at: null }, "api-08-calendar"), false);
  assert.equal(isValidLessonCompletion({ lesson_id: "api-08-calendar", completed: true, completed_at: "2026-08-27T10:00:00.000Z" }, "api-08-calendar"), true);
});

test("le QCM 09 est sécurisé et absent du bundle public", () => {
  assert.equal(launchCraftLessonNineQuiz.lessonId, "api-09-security");
  assert.equal(getLaunchCraftQuiz("api-09-security"), launchCraftLessonNineQuiz);
  assert.equal(launchCraftLessonNineQuiz.questions.length, 4);
  assert.equal(launchCraftLessonNineQuiz.questions.every((question) => question.choices.length === 3), true);
  const quizzes = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  assert.doesNotMatch(quizzes, /correctAnswer|"api-09-security": \[2, 0, 1, 2\]/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /"api-09-security": \[2, 0, 1, 2\]/);
});

test("le moteur produit réussite à 75 et échec à 50", () => {
  assert.deepEqual(calculateObjectiveQuizScore([2, 0, 1, 0], [2, 0, 1, 2], 70), { score: 75, correctCount: 3, passed: true });
  assert.deepEqual(calculateObjectiveQuizScore([2, 0, 0, 0], [2, 0, 1, 2], 70), { score: 50, correctCount: 2, passed: false });
});

test("08 ouvre 09 et le succès 09 ouvre le vrai module 8 du catalogue", () => {
  const exercise = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  assert.match(exercise, /moduleLessonIds\[7\]\[lessonIndex\]/);
  assert.match(exercise, /getNextTrainingModuleRoute\(7\)/);
  assert.equal(getNextTrainingModuleRoute(7), "/formation/supabase");
});

test("le module reste incomplet à huit validations et complet à neuf validations datées", () => {
  const eight = new Set(moduleLessonIds[7].slice(0, 8));
  const nine = new Set(moduleLessonIds[7]);
  assert.equal(moduleLessonIds[7].every((id) => eight.has(id)), false);
  assert.equal(moduleLessonIds[7].every((id) => nine.has(id)), true);
  assert.equal(moduleLessonIds[7].every((id) => isValidLessonCompletion({ lesson_id: id, completed: true, completed_at: "2026-08-27T10:00:00.000Z" }, id)), true);
});

test("le module 8 contrôle toujours les neuf validations datées", () => {
  const nextModule = read("app/formation/supabase/page.tsx");
  assert.match(nextModule, /previousModuleLessons = moduleLessonIds\[7\]/);
  assert.match(nextModule, /isValidLessonCompletion/);
  assert.match(nextModule, /previousModuleLessons\.every/);
});

test("aucune progression artificielle et 84 checkpoints officiels", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonNine.tsx");
  assert.doesNotMatch(lesson, /lesson_progress|upsert\(|insert\(/);
  assert.equal(planLessonTotals.complet, 84);
});

test("la leçon possède son contexte Coach et sa checklist finale", () => {
  const context = read("lib/training/coach/contexts.server.ts");
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonNine.tsx");
  assert.match(context, /"api-09-security"/);
  assert.match(lesson, /LessonCoach lessonId="api-09-security"/);
  assert.match(lesson, /Checklist finale/);
  assert.match(lesson, /n’écrivent rien dans AI Academy/);
});
