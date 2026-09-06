import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getLaunchCraftQuiz, launchCraftLessonThreeQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la leçon 03 conserve son identifiant et expose quatre questions à trois choix", () => {
  assert.equal(launchCraftLessonThreeQuiz.lessonId, "api-03-requests");
  assert.equal(getLaunchCraftQuiz("api-03-requests"), launchCraftLessonThreeQuiz);
  assert.equal(launchCraftLessonThreeQuiz.questions.length, 4);
  assert.equal(launchCraftLessonThreeQuiz.questions.every((question) => question.choices.length === 3), true);
});

test("le corrigé 03 reste exclusivement dans le module server-only", () => {
  const publicQuiz = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  assert.doesNotMatch(publicQuiz, /correctAnswer|"api-03-requests": \[1, 2, 0, 1\]/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /"api-03-requests": \[1, 2, 0, 1\]/);
});

test("cours et QCM dérivent le prérequis api-02-http du catalogue officiel", () => {
  const catalog = read("lib/training/catalog.ts");
  const page = read("app/formation/api-ia/[lesson]/page.tsx");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(catalog, /"api-02-http",\s*"api-03-requests"/);
  assert.match(page, /filter\(\(item\) => isValidLessonCompletion\(item\)\)/);
  assert.match(route, /getPreviousOfficialLessonId\(quiz\.lessonId\)/);
  assert.match(route, /data\?\.completed !== true/);
  assert.match(route, /data\.completed_at\.length === 0/);
  assert.match(route, /requireTrainingAccess\("complet"\)/);
});

test("le client utilise la route partagée et ne contient plus l'ancien exercice Python 03", () => {
  const exercise = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  assert.match(exercise, /moduleLessonIds\[7\]\[lessonIndex\]/);
  assert.match(exercise, /validationEndpoint="\/api\/training\/launchcraft\/quiz\/validate"/);
  assert.doesNotMatch(exercise, /requests\.get\(url\)|correctAnswer[^\n]*api-03/);
});

test("le cours fournit la configuration SSR complète sans clé service_role", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonThree.tsx");
  for (const path of [
    "lib/supabase/client.ts",
    "lib/supabase/server.ts",
    "lib/supabase/proxy.ts",
    "proxy.ts",
    "app/actions/auth.ts",
    "app/connexion/page.tsx",
    "app/inscription/page.tsx",
    "app/auth/callback/route.ts",
    "app/dashboard/page.tsx",
  ]) assert.match(lesson, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(lesson, /NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(lesson, /supabase\.auth\.getUser\(\)/);
  assert.match(lesson, /exchangeCodeForSession/);
  assert.match(lesson, /<LessonCoach lessonId="api-03-requests"/);
  assert.doesNotMatch(lesson, /NEXT_PUBLIC_[A-Z_]*SERVICE_ROLE/);
});

test("la navigation n'ouvre la leçon 04 qu'après validation", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonThree.tsx");
  assert.match(lesson, /lessonCompleted && <Link href="\/formation\/api-ia\/04"/);
  assert.match(lesson, /href="\/formation\/api-ia\/03\/exercice"/);
});
