import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { calculateLaunchCraftObjectiveProgress } from "./objective-progress.ts";
import { getLaunchCraftQuiz, launchCraftLessonFiveQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("api-05-keys-env exige api-04-status complet et daté", () => {
  const catalog = read("lib/training/catalog.ts");
  const page = read("app/formation/api-ia/[lesson]/page.tsx");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(catalog, /"api-04-status",\s*"api-05-keys-env"/);
  assert.match(page, /filter\(\(item\) => isValidLessonCompletion\(item\)\)/);
  assert.match(route, /getPreviousOfficialLessonId\(quiz\.lessonId\)/);
  assert.match(route, /data\?\.completed !== true/);
  assert.match(route, /data\.completed_at\.length === 0/);
});

test("le QCM 05 reste public sans corrigé et utilise le moteur partagé", () => {
  assert.equal(launchCraftLessonFiveQuiz.lessonId, "api-05-keys-env");
  assert.equal(getLaunchCraftQuiz("api-05-keys-env"), launchCraftLessonFiveQuiz);
  assert.equal(launchCraftLessonFiveQuiz.questions.length, 4);
  assert.equal(launchCraftLessonFiveQuiz.questions.every((question) => question.choices.length === 3), true);
  const quizzes = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  const exercise = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  assert.doesNotMatch(quizzes, /correctAnswer|"api-05-keys-env": \[1, 0, 2, 1\]/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /"api-05-keys-env": \[1, 0, 2, 1\]/);
  assert.match(exercise, /moduleLessonIds\[7\]\[lessonIndex\]/);
  assert.match(exercise, /validationEndpoint="\/api\/training\/launchcraft\/quiz\/validate"/);
});

test("les formulaires navigateur n'envoient ni user_id ni project_id", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFive.tsx");
  const clientStart = lesson.indexOf('path: "components/ObjectiveForm.tsx"');
  const clientEnd = lesson.indexOf('path: "components/ProjectCard.tsx"');
  const clientCode = lesson.slice(clientStart, clientEnd);
  assert.doesNotMatch(clientCode, /name=\\?"(?:user_id|project_id)\\?"/);
  assert.doesNotMatch(clientCode, /formData\.get\(\\?"(?:user_id|project_id)\\?"/);
});

test("UUID, champs et limites suivent exactement le schéma objectives", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFive.tsx");
  assert.match(lesson, /UUID_PATTERN/);
  assert.match(lesson, /title\.length < 3 \|\| title\.length > 160/);
  assert.match(lesson, /description\.length > 1000/);
  assert.match(lesson, /\^\\\\d\{4\}-\\\\d\{2\}-\\\\d\{2\}\$/);
  assert.match(lesson, /keys\.length !== OBJECTIVE_FIELDS\.length/);
});

test("chaque mutation vérifie le parent et filtre objectif, projet et propriétaire", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFive.tsx");
  const actions = lesson.slice(lesson.indexOf('path: "app/actions/objectives.ts"'), lesson.indexOf('path: "components/ObjectiveForm.tsx"'));
  assert.match(actions, /requireOwnedProject\(projectId\)/);
  assert.match(actions, /\.eq\(\\?"id\\?", projectId\)\.eq\(\\?"user_id\\?", user\.id\)/);
  const filters = actions.match(/\.eq\(\\?"id\\?", objectiveId\)\s*\.eq\(\\?"project_id\\?", projectId\)\.eq\(\\?"user_id\\?", access\.user\.id\)/g) ?? [];
  assert.equal(filters.length >= 4, true);
  assert.match(actions, /project_id: projectId/);
  assert.match(actions, /user_id: access\.user\.id/);
  assert.doesNotMatch(actions, /service_role|SERVICE_ROLE/);
});

test("la progression vaut 0 %, une part réelle puis 100 %", () => {
  assert.equal(calculateLaunchCraftObjectiveProgress([]), 0);
  assert.equal(calculateLaunchCraftObjectiveProgress([{ completed: true }, { completed: false }, { completed: false }]), 33);
  assert.equal(calculateLaunchCraftObjectiveProgress([{ completed: true }, { completed: true }]), 100);
});

test("la route conserve corps strict, offre Complet, meilleur score et première date", () => {
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(route, /Object\.keys\(body\)\.length !== 2/);
  assert.match(route, /requireTrainingAccess\("complet"\)/);
  assert.match(route, /Math\.max\(existing\?\.score \?\? -1, result\.score\)/);
  assert.match(route, /completed_at: existing\.completed_at \?\? now/);
});

test("la leçon mène au QCM puis à la leçon 06 après réussite", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFive.tsx");
  assert.match(lesson, /href="\/formation\/api-ia\/05\/exercice"/);
  assert.match(lesson, /lessonCompleted && <Link href="\/formation\/api-ia\/06"/);
  assert.match(lesson, /<LessonCoach lessonId="api-05-keys-env"/);
});
