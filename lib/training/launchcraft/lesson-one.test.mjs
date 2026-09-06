import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { launchCraftLessonOneQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la première leçon conserve son identifiant officiel et propose quatre questions", () => {
  assert.equal(launchCraftLessonOneQuiz.lessonId, "api-01-intro");
  assert.equal(launchCraftLessonOneQuiz.questions.length, 4);
  assert.equal(
    launchCraftLessonOneQuiz.questions.every(
      (question) => question.choices.length === 3
    ),
    true
  );
});

test("le corrigé reste server-only et ses positions ne suivent pas un motif trivial", () => {
  const publicQuiz = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  assert.doesNotMatch(publicQuiz, /lessonOneAnswers|correctAnswer/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /\[1, 2, 0, 1\]/);
  assert.doesNotMatch(answers, /\[0, 0, 0, 0\]|\[1, 1, 1, 1\]|\[2, 2, 2, 2\]/);
});

test("la route contrôle abonnement, corps, prérequis et score serveur", () => {
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(route, /requireTrainingAccess\("complet"\)/);
  assert.match(route, /Object\.keys\(body\)\.length !== 2/);
  assert.match(route, /getPreviousOfficialLessonId\(quiz\.lessonId\)/);
  assert.match(route, /scoreLaunchCraftQuiz\(lessonId, answers\)/);
  assert.match(route, /completed_at: existing\.completed_at \?\? now/);
});

test("le contenu fournit chaque fichier complet et le QCM mène à la leçon 02", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonOne.tsx");
  for (const path of [
    "app/globals.css",
    "app/layout.tsx",
    "components/AppShell.tsx",
    "components/Sidebar.tsx",
    "components/MobileHeader.tsx",
    "app/dashboard/page.tsx",
    "app/page.tsx",
  ]) {
    assert.match(lesson, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(lesson, /href="\/formation\/api-ia\/01\/exercice"/);
  assert.match(lesson, /href="\/formation\/api-ia\/02"/);
  assert.match(lesson, /<LessonCoach lessonId="api-01-intro"/);
});

test("l’ancien corrigé client de la leçon 01 a disparu", () => {
  const exercisePage = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  assert.doesNotMatch(exercisePage, /Quel est le rôle principal d’une API/);
  assert.match(exercisePage, /validationEndpoint="\/api\/training\/launchcraft\/quiz\/validate"/);
});
