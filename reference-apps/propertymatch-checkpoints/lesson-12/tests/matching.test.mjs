import assert from "node:assert/strict";
import test from "node:test";
import { properties } from "../data/properties.ts";
import { calculateCompatibility, getCompatibilityLabel } from "../lib/matching.ts";
import { sortProperties } from "../lib/search.ts";

const property = properties[0];
const empty = { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: false };

test("aucune préférence ne fabrique pas un score de 100 %", () => {
  const result = calculateCompatibility(property, empty);
  assert.equal(result.score, null);
  assert.equal(result.emptyMessage, "Ajoutez des critères pour obtenir un score");
  assert.deepEqual(result.criteria, []);
});

test("correspondance parfaite", () => {
  const result = calculateCompatibility(property, { ...empty, maximumMonthlyRent: 2500, minimumBedrooms: 2, balconyRequired: true });
  assert.equal(result.score, 100);
  assert.equal(result.label, "Excellente correspondance");
});

test("dépassement du budget inférieur ou égal à 10 %", () => {
  const candidate = { ...property, monthlyRent: 1100 };
  assert.equal(calculateCompatibility(candidate, { ...empty, maximumMonthlyRent: 1000 }).score, 50);
});

test("dépassement du budget supérieur à 10 %", () => {
  const candidate = { ...property, monthlyRent: 1101 };
  assert.equal(calculateCompatibility(candidate, { ...empty, maximumMonthlyRent: 1000 }).score, 0);
});

test("une chambre manquante vaut la moitié des points", () => {
  assert.equal(calculateCompatibility(property, { ...empty, minimumBedrooms: 3 }).score, 50);
});

test("balcon absent ne rapporte aucun point", () => {
  const candidate = { ...property, balcony: false };
  assert.equal(calculateCompatibility(candidate, { ...empty, balconyRequired: true }).score, 0);
});

test("plusieurs préférences se partagent exactement 100 points", () => {
  const candidate = { ...property, monthlyRent: 2000, bedrooms: 1, balcony: false };
  const result = calculateCompatibility(candidate, { ...empty, maximumMonthlyRent: 2200, minimumBedrooms: 2, balconyRequired: true });
  assert.equal(result.criteria.reduce((total, criterion) => total + criterion.pointsPossible, 0), 100);
  assert.equal(result.score, 50);
});

test("score entier borné et résultat déterministe", () => {
  const preferences = { ...empty, maximumMonthlyRent: 2200, minimumBedrooms: 2, balconyRequired: true };
  for (const candidate of properties) {
    const first = calculateCompatibility(candidate, preferences);
    const second = calculateCompatibility(candidate, preferences);
    assert.deepEqual(first, second);
    assert.ok(Number.isInteger(first.score));
    assert.ok(first.score >= 0 && first.score <= 100);
  }
});

test("le tri de compatibilité utilise le score réel et reste stable", () => {
  const preferences = { ...empty, maximumMonthlyRent: 2200 };
  const sorted = sortProperties(properties.slice(0, 3), "compatibilite", preferences);
  assert.deepEqual(sorted.map(({ id }) => id), ["pm-003", "pm-002", "pm-001"]);
  const ties = sortProperties(properties.slice(0, 3), "compatibilite", empty);
  assert.deepEqual(ties.map(({ id }) => id), ["pm-001", "pm-002", "pm-003"]);
});

test("les explications correspondent aux points accordés", () => {
  const result = calculateCompatibility({ ...property, balcony: false }, { ...empty, maximumMonthlyRent: 2500, balconyRequired: true });
  assert.equal(result.criteria[0]?.pointsEarned, result.criteria[0]?.pointsPossible);
  assert.match(result.criteria[0]?.explanation ?? "", /respecte/);
  assert.equal(result.criteria[1]?.pointsEarned, 0);
  assert.match(result.criteria[1]?.explanation ?? "", /ne possède pas/);
});

test("les quatre libellés respectent leurs seuils", () => {
  assert.equal(getCompatibilityLabel(85), "Excellente correspondance");
  assert.equal(getCompatibilityLabel(70), "Bonne correspondance");
  assert.equal(getCompatibilityLabel(50), "Correspondance partielle");
  assert.equal(getCompatibilityLabel(49), "Peu compatible");
});
