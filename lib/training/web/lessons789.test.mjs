import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import * as checkpoints from "./checkpoints789.ts";
import { webFoundationLessons } from "./foundations.ts";

const rootFile = (path) => new URL(`../../../${path}`, import.meta.url);
const read = (path) => readFileSync(rootFile(path), "utf8");
const publicQuizzes = read("lib/training/web/quizzes.ts");
const privateAnswers = read("lib/training/web/answers.server.ts");
const renderer = read("components/formation/web/WebFoundationLesson.tsx");
const lessons = webFoundationLessons.slice(6, 9);
const compile = (source) => {
  const result = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true });
  assert.deepEqual(result.diagnostics ?? [], []);
};
const loadPureModule = (source) => {
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const commonJsContainer = { exports: {} };
  Function("exports", "module", output)(commonJsContainer.exports, commonJsContainer);
  return commonJsContainer.exports;
};

test("les leçons 7 à 9 suivent le standard pédagogique partagé", () => {
  assert.deepEqual(lessons.map(({ id }) => id), ["web-07-cartes", "web-08-recherche", "web-09-matching"]);
  for (const lesson of lessons) {
    for (const key of ["build", "visibleResult", "prerequisites", "vocabulary", "steps", "checklist", "errors", "exercise", "summary"]) assert.ok(lesson[key]?.length, `${lesson.id}: ${key}`);
    assert.ok(lesson.steps.every((step) => step.instruction && step.expected));
    assert.ok(lesson.steps.filter((step) => step.path).every((step) => step.action));
  }
  assert.match(renderer, /step\.download.*download/s);
});

test("tous les checkpoints 7 à 9 se transpilent", () => {
  for (const [name, source] of Object.entries(checkpoints)) {
    assert.equal(typeof source, "string", name);
    compile(source);
  }
});

test("le ZIP étudiant contient uniquement les six ressources prévues", () => {
  const zip = rootFile("public/formation/site-web/downloads/propertymatch-images.zip");
  assert.equal(existsSync(zip), true);
  const names = execFileSync("unzip", ["-Z1", zip.pathname], { encoding: "utf8" }).trim().split("\n").sort();
  assert.deepEqual(names, ["bordeaux-stone.jpg", "fallback.svg", "lille-studio.jpg", "lyon-modern.jpg", "paris-apartment.jpg", "propertymatch-images-README.txt"]);
  assert.ok(names.every((name) => !name.startsWith(".") && !name.includes("/")));
});

test("la leçon 7 génère trois cartes locales sans fonction prématurée", () => {
  assert.match(checkpoints.lessonSevenPropertyCardCode, /from "next\/image"/);
  assert.match(checkpoints.lessonSevenPropertyCardCode, /formatMonthlyRent/);
  assert.match(checkpoints.lessonSevenFeaturedCode, /properties\.slice\(0, 3\)/);
  assert.match(checkpoints.lessonSevenFeaturedCode, /featured\.map/);
  assert.match(checkpoints.lessonSevenFeaturedCode, /key=\{property\.id\}/);
  assert.doesNotMatch(`${checkpoints.lessonSevenPropertyCardCode}\n${checkpoints.lessonSevenFeaturedCode}`, /Favorite|Compatibility|detailHref|localStorage/);
});

test("la leçon 8 neutralise les URL et fournit quatre tris stables", () => {
  const search = loadPureModule(checkpoints.lessonEightSearchCode);
  const cities = ["Paris", "Lyon"];
  const invalid = search.parseSearchParameters({ ville: "<script>", budget: "abc", chambres: "-2", balcon: "peut-etre", tri: "danger" }, cities);
  assert.deepEqual(invalid.criteria, { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: false });
  assert.deepEqual(invalid.invalidParameters, ["ville", "budget", "chambres", "balcon", "tri"]);
  const valid = search.parseSearchParameters({ ville: "Paris", budget: "2500", chambres: "2", balcon: "oui", tri: "loyer-croissant" }, cities);
  assert.equal(valid.criteria.city, "Paris");
  const sample = [{ id: "a", city: "Paris", monthlyRent: 2000, surface: 50 }, { id: "b", city: "Lyon", monthlyRent: 900, surface: 90 }, { id: "c", city: "Paris", monthlyRent: 1500, surface: 60 }];
  assert.deepEqual(search.filterProperties(sample, valid.criteria).map((item) => item.id), ["a", "c"]);
  assert.deepEqual(search.sortProperties(sample, "loyer-croissant").map((item) => item.id), ["b", "c", "a"]);
  assert.deepEqual(search.sortProperties(sample, "loyer-decroissant").map((item) => item.id), ["a", "c", "b"]);
  assert.deepEqual(search.sortProperties(sample, "surface-decroissante").map((item) => item.id), ["b", "c", "a"]);
  assert.deepEqual(search.sortProperties(sample, "compatibilite").map((item) => item.id), ["a", "b", "c"]);
  assert.match(checkpoints.lessonEightSearchFormCode, /action="\/biens" method="get"/);
  assert.match(checkpoints.lessonEightResultsPageCode, /await searchParams/);
});

test("la leçon 9 applique exactement la formule locale et déterministe", () => {
  const { calculateCompatibility } = loadPureModule(checkpoints.lessonNineMatchingCode);
  const property = { monthlyRent: 1000, bedrooms: 2, hasBalcony: true };
  const none = calculateCompatibility(property, { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: false });
  assert.equal(none.score, null);
  assert.equal(none.emptyMessage, "Ajoutez des critères pour obtenir un score");
  assert.equal(calculateCompatibility(property, { city: null, maximumMonthlyRent: 1000, minimumBedrooms: 2, balconyRequired: true }).score, 100);
  assert.equal(calculateCompatibility({ ...property, monthlyRent: 1100 }, { city: null, maximumMonthlyRent: 1000, minimumBedrooms: null, balconyRequired: false }).score, 50);
  assert.equal(calculateCompatibility({ ...property, monthlyRent: 1101 }, { city: null, maximumMonthlyRent: 1000, minimumBedrooms: null, balconyRequired: false }).score, 0);
  assert.equal(calculateCompatibility({ ...property, bedrooms: 1 }, { city: null, maximumMonthlyRent: null, minimumBedrooms: 2, balconyRequired: false }).score, 50);
  assert.equal(calculateCompatibility({ ...property, hasBalcony: false }, { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: true }).score, 0);
  const combined = calculateCompatibility(property, { city: null, maximumMonthlyRent: 1000, minimumBedrooms: 3, balconyRequired: true });
  assert.equal(combined.score, 83);
  assert.equal(combined.criteria.length, 3);
  assert.deepEqual(combined, calculateCompatibility(property, { city: null, maximumMonthlyRent: 1000, minimumBedrooms: 3, balconyRequired: true }));
  for (let budget = 300; budget <= 10000; budget += 137) {
    const score = calculateCompatibility(property, { city: null, maximumMonthlyRent: budget, minimumBedrooms: 4, balconyRequired: true }).score;
    assert.ok(score >= 0 && score <= 100);
  }
  assert.match(checkpoints.lessonNineSearchCode, /difference \|\| a\.index - b\.index/);
});

test("visuels, QCM et limites du périmètre sont vérifiés", () => {
  const visuals = lessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.visual ? [step.visual] : []));
  assert.ok(visuals.length >= 14);
  for (const visual of visuals) {
    assert.equal(existsSync(rootFile(`public${visual.src}`)), true, visual.src);
    assert.ok(visual.alt.length >= 20 && visual.caption.length >= 20);
  }
  for (const [index, id] of ["web-07-cartes", "web-08-recherche", "web-09-matching"].entries()) {
    const next = ["web-08-recherche", "web-09-matching", "web-10-fiches"][index];
    const block = publicQuizzes.slice(publicQuizzes.indexOf(`"${id}"`), publicQuizzes.indexOf(`"${next}"`));
    assert.equal((block.match(/id: "/g) ?? []).length, 4);
  }
  const patterns = [...privateAnswers.matchAll(/"web-0[7-9]-[^"]+": \[([0-2, ]+)\]/g)].map((match) => match[1]);
  assert.equal(patterns.length, 3);
  assert.equal(new Set(patterns).size, 3);
  assert.doesNotMatch(publicQuizzes, /correctAnswer|correctAnswers/);
  const content = `${read("lib/training/web/lessons789.ts")}\n${Object.values(checkpoints).join("\n")}`;
  assert.doesNotMatch(content, /git --version|GitHub|commit Git|Supabase|Stripe|localStorage|FavoriteButton|authentification/i);
  assert.doesNotMatch(content, /app\/biens\/\[slug\]|notFound\(|Vercel/);
});
