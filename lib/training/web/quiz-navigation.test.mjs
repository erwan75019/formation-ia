import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { trainingModules, webLessonCatalog } from "../catalog.ts";
import { getWebQuizContinuation } from "./navigation.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la réussite des leçons 01 et 11 mène au cours suivant", () => {
  assert.deepEqual(getWebQuizContinuation(webLessonCatalog[0].id), {
    href: `/formation/site-web/${webLessonCatalog[1].number}`,
    label: "Continuer vers la leçon suivante →",
  });
  assert.deepEqual(getWebQuizContinuation(webLessonCatalog[10].id), {
    href: `/formation/site-web/${webLessonCatalog[11].number}`,
    label: "Continuer vers la leçon suivante →",
  });
});

test("la réussite de la leçon 12 mène à la route officielle du module 7", () => {
  const moduleSeven = trainingModules.find((module) => module.number === 7);
  assert.ok(moduleSeven);
  assert.deepEqual(getWebQuizContinuation(webLessonCatalog[11].id), {
    href: moduleSeven.route,
    label: "Continuer vers le module suivant →",
  });
});

test("une leçon inconnue ne produit aucune destination", () => {
  assert.equal(getWebQuizContinuation("web-inconnue"), null);
});

test("l'interface utilise exclusivement passed pour afficher la suite", () => {
  const component = read("components/formation/web/SecureWebQuiz.tsx");
  const presentation = read("lib/training/web/result.ts");
  assert.match(component, /getWebQuizResultPresentation\(result\)/);
  assert.match(presentation, /if \(result\.passed\)/);
  assert.doesNotMatch(component, /result\.score\s*>=|score\s*>=\s*70/);
  assert.doesNotMatch(presentation, /result\.score\s*>=|score\s*>=\s*70/);
  assert.match(component, /href=\{continuation\.href\}/);
  assert.match(component, /Retour au module/);
  assert.match(component, /result \? "Réessayer"/);
});

test("les destinations sont dérivées du catalogue central", () => {
  const navigation = read("lib/training/web/navigation.ts");
  assert.match(navigation, /webLessonCatalog\.findIndex/);
  assert.match(navigation, /webLessonCatalog\[lessonIndex \+ 1\]/);
  assert.match(navigation, /trainingModules\.find/);
  assert.doesNotMatch(navigation, /\[\s*"web-01-|"web-11-favoris"\s*,/);
});
