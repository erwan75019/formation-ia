import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("toutes les pages principales exposent la cible du lien d’évitement", async () => {
  const header = await read("components/Header.tsx");
  assert.match(header, /href="#main-content"/);
  for (const path of ["app/page.tsx", "app/biens/page.tsx", "components/PropertyDetail.tsx", "app/biens/[slug]/not-found.tsx"]) {
    assert.match(await read(path), /id="main-content"/, path);
  }
});

test("le menu publie son état accessible", async () => {
  const header = await read("components/Header.tsx");
  assert.match(header, /aria-expanded=\{open\}/);
  assert.match(header, /Fermer.*Ouvrir/s);
  assert.match(header, /aria-current/);
});

test("le focus et la réduction des animations sont couverts", async () => {
  const css = await read("app/globals.css");
  assert.match(css, /summary:focus-visible/);
  assert.match(css, /\.skip-link:focus/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
