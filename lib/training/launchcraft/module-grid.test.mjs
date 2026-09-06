import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(
  new URL("../../../app/formation/api-ia/page.tsx", import.meta.url),
  "utf8"
);

test("la grille des neuf leçons passe de une à deux puis trois colonnes", () => {
  assert.match(
    page,
    /grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3/
  );
});

test("le conteneur reste centré et borné sur les grands écrans", () => {
  assert.match(page, /mx-auto w-full max-w-\[1320px\]/);
  assert.match(page, /min-w-0 flex-1/);
  assert.match(page, /w-72 shrink-0/);
  assert.match(page, /xl:block/);
});

test("les cartes étirent leur contenu et alignent leur pied", () => {
  assert.match(page, /flex h-full min-w-0 flex-col/);
  assert.match(page, /mt-3 flex-1 text-sm/);
  assert.match(page, /flex flex-wrap items-center justify-between gap-3 border-t/);
  assert.match(page, /text-xl font-semibold leading-7/);
});

test("les neuf métadonnées restent présentes sans modification du catalogue", () => {
  const ids = page.match(/id: "api-[^"]+"/g) ?? [];
  assert.equal(ids.length, 9);
  assert.match(page, /officialModuleLessons\.length/);
  assert.match(page, /moduleCompleted/);
});
