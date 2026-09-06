import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

import {
  lessonFiveDataCode,
  lessonFivePageCode,
  lessonFiveStarterDataCode,
  lessonFiveTypeCode,
  lessonFourPageCode,
  lessonSixComponents,
  lessonSixPageCode,
} from "./checkpoints.ts";
import { webFoundationLessons } from "./foundations.ts";

const read = (path) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");
const publicQuizzes = read("lib/training/web/quizzes.ts");
const privateAnswers = read("lib/training/web/answers.server.ts");
const renderer = read("components/formation/web/WebFoundationLesson.tsx");
const lessons = webFoundationLessons.slice(3, 6);

test("les leçons 4 à 6 suivent le standard débutant complet", () => {
  assert.deepEqual(lessons.map(({ id }) => id), ["web-04-tailwind", "web-05-donnees", "web-06-composants"]);
  for (const lesson of lessons) {
    for (const key of ["build", "visibleResult", "prerequisites", "vocabulary", "steps", "checklist", "errors", "exercise", "summary"])
      assert.ok(lesson[key]?.length > 0, `${lesson.id}: ${key}`);
    assert.ok(lesson.steps.every((step) => step.instruction && step.expected));
    assert.ok(lesson.steps.filter((step) => step.path).every((step) => step.action));
  }
});

test("les checkpoints TypeScript et JSX sont syntaxiquement valides", () => {
  const sources = [lessonFourPageCode, lessonFiveTypeCode, lessonFiveStarterDataCode, lessonFiveDataCode, lessonFivePageCode, lessonSixPageCode, ...Object.values(lessonSixComponents)];
  for (const source of sources) {
    const result = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true });
    assert.deepEqual(result.diagnostics ?? [], []);
  }
});

test("les checkpoints restent strictement cumulatifs", () => {
  assert.doesNotMatch(lessonFourPageCode, /@\/data|properties\.map|next\/image|localStorage|fetch\(|compatib|score/i);
  assert.match(lessonFiveTypeCode, /export type Property/);
  assert.match(lessonFiveDataCode, /export const properties: Property\[\]/);
  assert.equal((lessonFiveStarterDataCode.match(/slug:/g) ?? []).length, 3);
  assert.equal((lessonFiveDataCode.match(/slug:/g) ?? []).length, 15);
  assert.match(lessonFivePageCode, /properties\.length/);
  assert.doesNotMatch(lessonFivePageCode, /properties\.map|PropertyCard|next\/image|localStorage|fetch\(/i);
  assert.match(lessonSixPageCode, /<Header \/>.*<Hero \/>.*<StatsStrip \/>.*<FeaturedProperties \/>/s);
  assert.doesNotMatch(`${lessonSixPageCode}\n${Object.values(lessonSixComponents).join("\n")}`, /PropertyCard|properties\.map|localStorage|fetch\(|compatib|score/i);
});

test("la leçon 5 installe un catalogue local de quinze logements valides", () => {
  const ids = [...lessonFiveDataCode.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
  const slugs = [...lessonFiveDataCode.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 15);
  assert.equal(slugs.length, 15);
  assert.equal(new Set(ids).size, 15);
  assert.equal(new Set(slugs).size, 15);
  assert.deepEqual(ids, Array.from({ length: 15 }, (_, index) => `pm-${String(index + 1).padStart(3, "0")}`));
  for (const field of ["title", "city", "monthlyRent", "surface", "bedrooms", "bathrooms", "hasBalcony", "imagePath", "imageAlt"])
    assert.equal((lessonFiveDataCode.match(new RegExp(`${field}:`, "g")) ?? []).length, 15, field);
  assert.doesNotMatch(lessonFiveDataCode, /https?:\/\/|district:|description:|features:|floor:|furnished:|availability:|street|address/i);
  assert.match(lessonFivePageCode, /properties\.length/);
  assert.doesNotMatch(lessonFivePageCode, />15 locations/);
  const lessonFive = webFoundationLessons[4];
  assert.ok(lessonFive.steps.some((step) => step.title === "Compléter le catalogue de démonstration"));
  assert.match(lessonFive.visibleResult, /15 locations/);
  assert.ok(lessonFive.checklist.some((item) => item.includes("properties.length vaut 15")));
});

test("les visuels déclarés sont réellement rendus et présents localement", () => {
  const visuals = lessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.visual ? [step.visual] : []));
  assert.ok(visuals.length >= 9);
  assert.match(renderer, /<LessonPedagogyVisual \{\.\.\.step\.visual\} \/>/);
  for (const visual of visuals) {
    assert.equal(existsSync(new URL(`../../../public${visual.src}`, import.meta.url)), true, visual.src);
    assert.match(visual.src, /^\/formation\/site-web\/lessons\/(04|05|06)\//);
    assert.ok(visual.alt.length >= 20);
    assert.ok(visual.caption.length >= 20);
  }
});

test("chaque nouveau QCM a quatre questions publiques et un corrigé server-only", () => {
  for (const [index, id] of ["web-04-tailwind", "web-05-donnees", "web-06-composants"].entries()) {
    const next = ["web-05-donnees", "web-06-composants", "web-07-cartes"][index];
    const start = publicQuizzes.indexOf(`"${id}"`);
    const block = publicQuizzes.slice(start, publicQuizzes.indexOf(`"${next}"`, start + id.length));
    assert.equal((block.match(/id: "/g) ?? []).length, 4, id);
    for (const choices of block.matchAll(/choices: \[([^\]]+)\]/g)) assert.equal((choices[1].match(/"/g) ?? []).length / 2, 3);
  }
  assert.match(privateAnswers, /import "server-only"/);
  const patterns = [...privateAnswers.matchAll(/"web-0[4-6]-[^"]+": \[([0-2, ]+)\]/g)].map((match) => match[1]);
  assert.equal(patterns.length, 3);
  assert.equal(new Set(patterns).size, 3);
  assert.ok(patterns.every((pattern) => pattern.split(",").length === 4));
  assert.doesNotMatch(publicQuizzes, /correctAnswer|correctAnswers|passingScore/);
});

test("aucune validation cliente, Git ou fonctionnalité future n'est introduite", () => {
  const content = `${read("lib/training/web/lessons456.ts")}\n${renderer}`;
  assert.doesNotMatch(content, /git --version|GitHub|commit Git|lesson_progress|createClient\(/i);
  assert.doesNotMatch(content, /Supabase|Stripe|authentification|API externe/i);
});
