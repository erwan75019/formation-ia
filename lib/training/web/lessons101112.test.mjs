import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import * as checkpoints from "./checkpoints101112.ts";
import { webFoundationLessons } from "./foundations.ts";

const root = (path) => new URL(`../../../${path}`, import.meta.url);
const read = (path) => readFileSync(root(path), "utf8");
const lessons = webFoundationLessons.slice(9);

test("les trois dernières leçons suivent le standard", () => {
  assert.deepEqual(lessons.map(({ id }) => id), ["web-10-fiches", "web-11-favoris", "web-12-publication"]);
  for (const lesson of lessons) for (const key of ["build", "visibleResult", "prerequisites", "vocabulary", "steps", "checklist", "errors", "exercise", "summary"]) assert.ok(lesson[key]?.length);
});

test("les sources TypeScript et JSX affichées sont syntaxiquement complètes", () => {
  const steps = lessons.flatMap((lesson) => lesson.steps.filter((step) => step.code && !step.path?.endsWith(".json") && !step.path?.endsWith(".mjs") && !step.path?.endsWith(".css")));
  for (const step of steps) {
    const result = ts.transpileModule(step.code, { compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }, fileName: step.path, reportDiagnostics: true });
    assert.deepEqual(result.diagnostics ?? [], [], step.path);
    assert.doesNotMatch(step.code, /compl[eé]tez comme/i, step.path);
  }
  assert.equal((checkpoints.lessonTenPropertiesCode.match(/id: "pm-/g) ?? []).length, 15);
  assert.doesNotMatch(checkpoints.lessonTenPropertiesCode, /https?:\/\//);
});

test("chaque fichier obligatoire possède son propre bloc complet", () => {
  const required = [
    ["types/property.ts", "data/properties.ts", "lib/properties.ts", "lib/property-navigation.ts", "components/PropertyFacts.tsx", "components/PropertyDetail.tsx", "components/PropertyCard.tsx", "app/biens/page.tsx", "app/biens/[slug]/page.tsx", "app/biens/[slug]/not-found.tsx"],
    ["lib/favorites.ts", "components/FavoritesProvider.tsx", "components/FavoriteButton.tsx", "components/FavoritesGrid.tsx", "components/PropertyCard.tsx", "components/PropertyDetail.tsx", "components/Header.tsx", "app/layout.tsx", "app/favoris/page.tsx", "app/biens/[slug]/page.tsx", "lib/property-navigation.ts"],
  ];
  required.forEach((paths, index) => {
    const byPath = new Map(lessons[index].steps.map((step) => [step.path, step]));
    for (const path of paths) {
      const step = byPath.get(path);
      assert.ok(step?.code?.trim(), path);
      assert.match(step.action, /Créer|Remplacer entièrement/);
    }
  });
});

test("la leçon 12 fournit package, configuration, tests et fichiers accessibles", () => {
  const paths = lessons[2].steps.map(({ path }) => path);
  for (const path of ["package.json", "eslint.config.mjs", "tests/data.test.mjs", "tests/search.test.mjs", "tests/matching.test.mjs", "tests/property-details.test.mjs", "tests/favorites.test.mjs", "tests/accessibility.test.mjs", "app/layout.tsx", "app/page.tsx", "app/globals.css", "components/Header.tsx", "components/FavoriteButton.tsx", "components/PropertyCard.tsx", "components/PropertyDetail.tsx", "app/biens/page.tsx", "app/favoris/page.tsx"]) assert.ok(paths.includes(path), path);
  const packageJson = JSON.parse(checkpoints.lessonTwelvePackageCode);
  assert.equal(packageJson.scripts.lint, "eslint .");
  assert.equal(packageJson.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(packageJson.scripts.build, "next build --webpack");
  assert.deepEqual(checkpoints.lessonTwelveCommands.slice(0, 4), ["npm run typecheck", "npm run lint", "npm test", "npm run build"]);
});

test("les checkpoints autonomes 10 à 12 sont matérialisés sans artefacts", () => {
  for (const checkpoint of ["lesson-10", "lesson-11", "lesson-12"]) {
    const base = `reference-apps/propertymatch-checkpoints/${checkpoint}`;
    for (const path of ["package.json", "tsconfig.json", "app/page.tsx", "data/properties.ts"]) assert.equal(existsSync(root(`${base}/${path}`)), true, `${checkpoint}/${path}`);
    for (const artifact of ["node_modules", ".next", ".git", "tsconfig.tsbuildinfo"]) assert.equal(existsSync(root(`${base}/${artifact}`)), false, `${checkpoint}/${artifact}`);
  }
});

test("les visuels et QCM finaux restent complets", () => {
  const visuals = lessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.visual ? [step.visual] : []));
  assert.ok(visuals.length >= 7);
  for (const visual of visuals) assert.equal(existsSync(root(`public${visual.src}`)), true, visual.src);
  const quizzes = read("lib/training/web/quizzes.ts");
  const answers = read("lib/training/web/answers.server.ts");
  for (const [index, id] of ["web-10-fiches", "web-11-favoris", "web-12-publication"].entries()) {
    const next = ["web-11-favoris", "web-12-publication", null][index];
    const start = quizzes.indexOf(`"${id}"`);
    const block = next ? quizzes.slice(start, quizzes.indexOf(`"${next}"`)) : quizzes.slice(start);
    assert.equal((block.match(/id: "/g) ?? []).length, 4);
  }
  const patterns = [...answers.matchAll(/"web-(?:10|11|12)-[^"]+": \[([0-2, ]+)\]/g)].map((match) => match[1]);
  assert.equal(patterns.length, 3);
  assert.equal(new Set(patterns).size, 3);
});
