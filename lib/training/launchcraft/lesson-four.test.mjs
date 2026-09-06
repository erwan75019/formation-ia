import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getLaunchCraftQuiz, launchCraftLessonFourQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la leçon 04 utilise api-04-status et exige api-03-requests", () => {
  const catalog = read("lib/training/catalog.ts");
  const page = read("app/formation/api-ia/[lesson]/page.tsx");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(catalog, /"api-03-requests",\s*"api-04-status"/);
  assert.match(page, /filter\(\(item\) => isValidLessonCompletion\(item\)\)/);
  assert.match(route, /getPreviousOfficialLessonId\(quiz\.lessonId\)/);
  assert.match(route, /data\?\.completed !== true/);
  assert.match(route, /data\.completed_at\.length === 0/);
});

test("le QCM 04 est partagé, strict et corrigé seulement côté serveur", () => {
  assert.equal(launchCraftLessonFourQuiz.lessonId, "api-04-status");
  assert.equal(getLaunchCraftQuiz("api-04-status"), launchCraftLessonFourQuiz);
  assert.equal(launchCraftLessonFourQuiz.questions.length, 4);
  assert.equal(launchCraftLessonFourQuiz.questions.every((question) => question.choices.length === 3), true);
  const publicQuiz = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.doesNotMatch(publicQuiz, /correctAnswer|"api-04-status": \[2, 0, 1, 2\]/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /"api-04-status": \[2, 0, 1, 2\]/);
  assert.match(route, /Object\.keys\(body\)\.length !== 2/);
  assert.match(route, /requireTrainingAccess\("complet"\)/);
  assert.match(route, /completed_at: existing\.completed_at \?\? now/);
});

test("aucun composant navigateur du CRUD n'envoie user_id", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFour.tsx");
  const projectForm = lesson.slice(lesson.indexOf('path: "components/ProjectForm.tsx"'), lesson.indexOf('path: "components/DeleteProjectButton.tsx"'));
  const deleteButton = lesson.slice(lesson.indexOf('path: "components/DeleteProjectButton.tsx"'), lesson.indexOf('path: "components/ProjectCard.tsx"'));
  assert.doesNotMatch(projectForm + deleteButton, /name=\\?"user_id|formData\.get\(\\?"user_id/);
  assert.match(lesson, /user_id: user\.id/);
});

test("update et delete combinent toujours id et user_id", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFour.tsx");
  const actions = lesson.slice(
    lesson.indexOf('path: "app/actions/projects.ts"'),
    lesson.indexOf('path: "components/ProjectForm.tsx"')
  );
  const matches = lesson.match(/\.eq\(\\?"id\\?", projectId\)\.eq\(\\?"user_id\\?", user\.id\)/g) ?? [];
  assert.equal(matches.length >= 2, true);
  assert.match(lesson, /const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\)/);
  assert.doesNotMatch(actions, /service_role|SERVICE_ROLE/);
});

test("identifiants et tailles sont validés, champs supplémentaires refusés", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFour.tsx");
  assert.match(lesson, /UUID_PATTERN/);
  assert.match(lesson, /title\.length < 3 \|\| title\.length > 120/);
  assert.match(lesson, /description\.length > 2000/);
  assert.match(lesson, /keys\.length !== PROJECT_FIELDS\.length/);
  assert.match(lesson, /formData\.get\(\\?"confirm\\?"\) !== \\?"yes\\?"/);
});

test("les pages projet relisent la session et prévoient vide, chargement et erreur", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFour.tsx");
  assert.match(lesson, /path: "app\/projets\/layout\.tsx"[\s\S]*?await requireUser\(\)/);
  assert.match(lesson, /Aucun projet/);
  assert.match(lesson, /aria-busy="true"/);
  assert.match(lesson, /ProjectsError/);
  assert.match(lesson, /\.eq\(\\?"user_id\\?", user\.id\)/);
});

test("le QCM 04 mène à la leçon 05 uniquement après réussite", () => {
  const exercise = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonFour.tsx");
  assert.match(exercise, /moduleLessonIds\[7\]\[lessonIndex\]/);
  assert.match(exercise, /validationEndpoint="\/api\/training\/launchcraft\/quiz\/validate"/);
  assert.doesNotMatch(exercise, /response\.json\(\)|Quel code HTTP indique/);
  assert.match(lesson, /lessonCompleted && <Link href="\/formation\/api-ia\/05"/);
});
