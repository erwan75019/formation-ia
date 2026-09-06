import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const data = read("data/properties.ts");
const page = read("app/page.tsx");
const search = read("components/SearchForm.tsx");
const css = read("app/globals.css");

test("la phase 1 contient exactement quinze locations typées", () => {
  assert.equal((data.match(/id: "pm-/g) ?? []).length, 15);
  assert.match(data, /satisfies readonly Property\[\]/);
  assert.doesNotMatch(data, /salePrice|purchase|à vendre/i);
});

test("les loyers et critères sont explicitement mensuels", () => {
  assert.equal((data.match(/monthlyRent:/g) ?? []).length, 15);
  assert.match(search, /Budget mensuel maximum/);
  assert.match(search, /€ \/ mois/);
});

test("la page affiche des indicateurs calculés et non les promesses de la maquette", () => {
  assert.match(page, /properties\.length/);
  assert.match(page, /coveredCities\.length/);
  assert.doesNotMatch(`${page}${data}`, /10 000|25 000|98 % de pertinence/);
});

test("la recherche envoie uniquement les quatre critères et le tri", () => {
  assert.match(search, /action="\/biens" method="get"/);
  for (const name of ["ville", "budget", "chambres", "balcon", "tri"])
    assert.match(search, new RegExp(`name="${name}"`));
});

test("le responsive couvre tablette et mobile sans image distante", () => {
  assert.match(css, /@media \(max-width:1023px\)/);
  assert.match(css, /@media \(max-width:767px\)/);
  assert.doesNotMatch(`${data}${css}`, /https?:\/\//);
});
