import assert from "node:assert/strict";
import test from "node:test";
import { properties, coveredCities } from "../data/properties.ts";
import { buildSearchUrl, countMatchingProperties, filterProperties, parseSearchParameters, searchProperties, sortProperties } from "../lib/search.ts";

const empty = { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: false };

test("sans critère, les quinze locations restent disponibles", () => {
  assert.equal(filterProperties(properties, empty).length, 15);
  assert.equal(countMatchingProperties(properties, empty), 15);
});

test("filtre par ville", () => {
  const results = filterProperties(properties, { ...empty, city: "Lyon" });
  assert.equal(results.length, 2);
  assert.ok(results.every((property) => property.city === "Lyon"));
});

test("le budget devient une préférence non éliminatoire", () => {
  const results = filterProperties(properties, { ...empty, maximumMonthlyRent: 900 });
  assert.equal(results.length, 15);
});

test("les chambres deviennent une préférence non éliminatoire", () => {
  const results = filterProperties(properties, { ...empty, minimumBedrooms: 4 });
  assert.equal(results.length, 15);
});

test("le balcon devient une préférence non éliminatoire", () => {
  const results = filterProperties(properties, { ...empty, balconyRequired: true });
  assert.equal(results.length, 15);
});

test("seule la ville reste un filtre strict", () => {
  const criteria = { city: "Paris", maximumMonthlyRent: 2400, minimumBedrooms: 2, balconyRequired: true };
  assert.deepEqual(filterProperties(properties, criteria).map(({ id }) => id), ["pm-001", "pm-002", "pm-003"]);
});

test("aucun résultat", () => {
  const criteria = { city: "Nice", maximumMonthlyRent: 900, minimumBedrooms: 4, balconyRequired: true };
  assert.equal(filterProperties(properties, criteria).length, 0);
});

test("les paramètres invalides sont neutralisés et signalés", () => {
  const state = parseSearchParameters({ ville: "<script>", budget: "NaN", chambres: "-4", balcon: "peut-être", tri: "pirate" }, coveredCities);
  assert.deepEqual(state.criteria, empty);
  assert.equal(state.sort, "compatibilite");
  assert.deepEqual(state.invalidParameters, ["ville", "budget", "chambres", "balcon", "tri"]);
});

test("les quatre tris produisent l’ordre attendu", () => {
  const subset = properties.slice(0, 5);
  assert.deepEqual(sortProperties(subset, "loyer-croissant", empty).map(({ monthlyRent }) => monthlyRent), [890, 1780, 2150, 2300, 2450]);
  assert.deepEqual(sortProperties(subset, "loyer-decroissant", empty).map(({ monthlyRent }) => monthlyRent), [2450, 2300, 2150, 1780, 890]);
  assert.deepEqual(sortProperties(subset, "surface-decroissante", empty).map(({ surface }) => surface), [91, 62, 58, 55, 28]);
  const compatibilityCriteria = { ...empty, city: "Paris", maximumMonthlyRent: 2200, minimumBedrooms: 2 };
  assert.equal(sortProperties(subset, "compatibilite", compatibilityCriteria)[0]?.id, "pm-003");
});

test("le tri reste stable lorsque les valeurs sont égales", () => {
  const sameRent = properties.slice(0, 3).map((property) => ({ ...property, monthlyRent: 1000 }));
  assert.deepEqual(sortProperties(sameRent, "loyer-croissant", empty).map(({ id }) => id), ["pm-001", "pm-002", "pm-003"]);
});

test("construction puis relecture de l’URL", () => {
  const criteria = { city: "Paris", maximumMonthlyRent: 2500, minimumBedrooms: 2, balconyRequired: true };
  const url = buildSearchUrl(criteria, "compatibilite");
  assert.equal(url, "/biens?ville=Paris&budget=2500&chambres=2&balcon=oui&tri=compatibilite");
  const parameters = Object.fromEntries(new URL(url, "http://localhost").searchParams);
  const parsed = parseSearchParameters(parameters, coveredCities);
  assert.deepEqual(parsed.criteria, criteria);
  assert.equal(searchProperties(properties, parsed).length, 3);
});
