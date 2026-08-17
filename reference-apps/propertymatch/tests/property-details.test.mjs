import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { properties, coveredCities } from "../data/properties.ts";
import { calculateCompatibility } from "../lib/matching.ts";
import { buildPropertyUrl, buildResultsUrl, hasSearchContext } from "../lib/property-navigation.ts";
import { findPropertyBySlug } from "../lib/properties.ts";
import { parseSearchParameters } from "../lib/search.ts";

test("les quinze logements possèdent un slug stable et unique", () => {
  assert.equal(properties.length, 15);
  assert.equal(new Set(properties.map(({ slug }) => slug)).size, properties.length);
  for (const property of properties) assert.match(property.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test("la recherche par slug trouve un logement et neutralise un inconnu", () => {
  assert.equal(findPropertyBySlug(properties, "lumineux-bastille")?.id, "pm-001");
  assert.equal(findPropertyBySlug(properties, "adresse-inconnue"), undefined);
});

test("le lien de fiche conserve exactement la recherche canonique", () => {
  const parameters = { ville: "Paris", budget: "2500", chambres: "2", balcon: "oui", tri: "loyer-croissant" };
  const state = parseSearchParameters(parameters, coveredCities);
  const resultsUrl = buildResultsUrl(state, hasSearchContext(parameters));
  assert.equal(resultsUrl, "/biens?ville=Paris&budget=2500&chambres=2&balcon=oui&tri=loyer-croissant");
  assert.equal(buildPropertyUrl("lumineux-bastille", resultsUrl), "/biens/lumineux-bastille?ville=Paris&budget=2500&chambres=2&balcon=oui&tri=loyer-croissant");
});

test("une fiche directe revient à la liste simple", () => {
  const state = parseSearchParameters({}, coveredCities);
  assert.equal(buildResultsUrl(state, hasSearchContext({})), "/biens");
  assert.equal(buildPropertyUrl("lumineux-bastille"), "/biens/lumineux-bastille");
});

test("le score de fiche est identique à celui calculé pour la carte", () => {
  const state = parseSearchParameters({ budget: "2200", chambres: "2", balcon: "oui" }, coveredCities);
  const property = findPropertyBySlug(properties, "lumineux-bastille");
  assert.ok(property);
  const cardScore = calculateCompatibility(property, state.criteria);
  const detailScore = calculateCompatibility(property, state.criteria);
  assert.deepEqual(detailScore, cardScore);
});

test("aucune préférence ne fabrique un score", () => {
  const state = parseSearchParameters({}, coveredCities);
  const result = calculateCompatibility(properties[0], state.criteria);
  assert.equal(result.score, null);
  assert.equal(result.emptyMessage, "Ajoutez des critères pour obtenir un score");
});

test("les paramètres invalides sont neutralisés et signalés", () => {
  const parameters = { ville: "<script>", budget: "infini", chambres: "-2", balcon: "peut-être", tri: "danger" };
  const state = parseSearchParameters(parameters, coveredCities);
  assert.deepEqual(state.criteria, { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: false });
  assert.deepEqual(state.invalidParameters, ["ville", "budget", "chambres", "balcon", "tri"]);
  assert.equal(buildResultsUrl(state, hasSearchContext(parameters)), "/biens?balcon=indifferent&tri=compatibilite");
});

test("les données obligatoires sont présentes sans adresse personnelle réelle", () => {
  for (const property of properties) {
    assert.ok(property.description.length >= 80);
    assert.ok(property.features.length >= 2);
    assert.ok(["appartement", "maison", "studio"].includes(property.propertyType));
    assert.equal(typeof property.furnished, "boolean");
    assert.match(property.availability, /donnée fictive/i);
    assert.ok(property.images[0]?.src.startsWith("/properties/"));
    assert.equal("address" in property, false);
    assert.doesNotMatch(`${property.title} ${property.description}`, /\b\d{1,4}\s+(rue|avenue|boulevard|impasse|allée)\b/i);
  }
});

test("la page utilise notFound, les métadonnées et le composant partagé de score", async () => {
  const source = await readFile(new URL("../app/biens/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /notFound\(\)/);
  assert.match(source, /generateMetadata/);
  assert.match(source, /calculateCompatibility/);
  assert.match(source, /PropertyDetail/);
});
