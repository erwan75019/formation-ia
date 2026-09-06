import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getLaunchCraftQuiz, launchCraftLessonTwoQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la leçon 02 conserve api-02-http et possède quatre questions publiques", () => {
  assert.equal(launchCraftLessonTwoQuiz.lessonId, "api-02-http");
  assert.equal(getLaunchCraftQuiz("api-02-http"), launchCraftLessonTwoQuiz);
  assert.equal(launchCraftLessonTwoQuiz.questions.length, 4);
  assert.equal(
    launchCraftLessonTwoQuiz.questions.every((question) => question.choices.length === 3),
    true
  );
});

test("le corrigé 02 reste uniquement dans le fichier server-only", () => {
  const publicQuiz = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  assert.doesNotMatch(publicQuiz, /correctAnswer|"api-02-http": \[2, 0, 1, 0\]/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /"api-02-http": \[2, 0, 1, 0\]/);
});

test("la page et la route exigent une progression api-01-intro complète et datée", () => {
  const catalog = read("lib/training/catalog.ts");
  const page = read("app/formation/api-ia/[lesson]/page.tsx");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");

  assert.match(catalog, /"api-01-intro",\s*"api-02-http"/);
  assert.match(page, /filter\(\(item\) => isValidLessonCompletion\(item\)\)/);
  assert.match(route, /getPreviousOfficialLessonId\(quiz\.lessonId\)/);
  assert.match(route, /data\.completed_at\.length === 0/);
  assert.match(route, /requireTrainingAccess\("complet"\)/);
});

test("la route partagée refuse les champs supplémentaires et conserve le meilleur score et la première date", () => {
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(route, /Object\.keys\(body\)\.length !== 2/);
  assert.match(route, /answers\.length !== quiz\.questions\.length/);
  assert.match(route, /Math\.max\(existing\?\.score \?\? -1, result\.score\)/);
  assert.match(route, /completed_at: existing\.completed_at \?\? now/);
});

test("la leçon fournit les trois fichiers complets et mène au QCM puis à la leçon 03", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonTwo.tsx");
  for (const path of [
    "types/launchcraft.ts",
    "supabase/migrations/202608220001_initial_launchcraft.sql",
    "public/database-schema.svg",
  ]) {
    assert.match(lesson, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(lesson, /create table public\.profiles/);
  assert.match(lesson, /create table public\.projects/);
  assert.match(lesson, /create table public\.objectives/);
  assert.match(lesson, /create table public\.tasks/);
  assert.match(lesson, /enable row level security/);
  assert.match(lesson, /href="\/formation\/api-ia\/02\/exercice"/);
  assert.match(lesson, /href="\/formation\/api-ia\/03"/);
  assert.match(lesson, /<LessonCoach lessonId="api-02-http"/);
});

test("l’ancien exercice HTTP client a disparu", () => {
  const exercise = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  assert.doesNotMatch(exercise, /Quelle méthode HTTP est généralement utilisée/);
  assert.match(exercise, /moduleLessonIds\[7\]\[lessonIndex\]/);
  assert.match(exercise, /validationEndpoint="\/api\/training\/launchcraft\/quiz\/validate"/);
});
