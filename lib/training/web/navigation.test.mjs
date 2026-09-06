import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");

const catalog = read("lib/training/catalog.ts");
const navigation = read("lib/training/web/navigation.ts");
const layout = read("app/formation/site-web/[lesson]/layout.tsx");
const lessonPage = read("app/formation/site-web/[lesson]/page.tsx");
const foundationPage = read("components/formation/web/WebFoundationLesson.tsx");

test("le catalogue du module 6 contient exactement 12 leçons officielles", () => {
  const moduleSix = catalog.match(/webLessonCatalog = \[([\s\S]*?)\n\] as const/)?.[1] ?? "";
  assert.equal([...moduleSix.matchAll(/id: "web-/g)].length, 12);
});

test("le prérequis est dérivé du catalogue, pas d’un état client", () => {
  assert.match(navigation, /moduleLessonIds\[6\]/);
  assert.match(navigation, /webLessonIds\[index - 1\]/);
  assert.doesNotMatch(layout, /searchParams|localStorage|completed.*request/);
});

test("le layout serveur couvre leçon, exercice et QCM", () => {
  assert.match(layout, /params: Promise<\{ lesson: string \}>/);
  assert.match(layout, /supabase\.auth\.getUser\(\)/);
  assert.match(layout, /from\("lesson_progress"\)/);
  assert.match(layout, /select\("lesson_id, completed, completed_at"\)/);
  assert.match(layout, /isValidLessonCompletion\(progress\)/);
});

test("un prérequis absent redirige vers la bonne leçon avec le contexte", () => {
  assert.match(layout, /`\/formation\/site-web\/\$\{prerequisite\.slug\}\?required_for=\$\{slug\}`/);
  assert.match(lessonPage, /getValidatedRequiredFor/);
});

test("le message de verrouillage est affiché dans les deux rendus", () => {
  const message = /Validez cette leçon avant d(?:&apos;|’)accéder à la leçon/;
  assert.match(lessonPage, message);
  assert.match(foundationPage, message);
});
