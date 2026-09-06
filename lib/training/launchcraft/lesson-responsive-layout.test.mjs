import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const lessons = ["Five", "Six", "Seven", "Eight", "Nine"].map((name) => ({
  name,
  source: readFileSync(
    new URL(
      `../../../components/formation/launchcraft/LaunchCraftLesson${name}.tsx`,
      import.meta.url
    ),
    "utf8"
  ),
}));

test("les leçons 05 à 09 partagent le même conteneur responsive principal", () => {
  for (const lesson of lessons) {
    assert.match(lesson.source, /max-w-7xl/, `${lesson.name}: largeur maximale`);
    assert.match(lesson.source, /md:px-8/, `${lesson.name}: marge tablette`);
    assert.match(
      lesson.source,
      /lg:grid-cols-\[minmax\(0,1fr\)_320px\]/,
      `${lesson.name}: colonne pédagogique réductible et Coach stable`
    );
    assert.match(
      lesson.source,
      /lg:sticky lg:top-6 lg:self-start/,
      `${lesson.name}: position du Coach`
    );
  }
});

test("les leçons 06 à 09 empêchent leur contenu riche d'élargir la page", () => {
  for (const lesson of lessons.slice(1)) {
    assert.match(lesson.source, /min-w-0 space-y-7/);
    assert.match(lesson.source, /max-w-full overflow-(?:auto|x-auto)/);
    assert.match(lesson.source, /break-all/);
  }
});
