import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { properties } from "../data/properties.ts";
import { FAVORITES_STORAGE_KEY, normalizeFavoriteSlugs, readFavoriteSlugs, toggleFavoriteSlug, writeFavoriteSlugs } from "../lib/favorites.ts";
import { buildFavoritePropertyUrl, buildPropertyReturnUrl } from "../lib/property-navigation.ts";
import { parseSearchParameters } from "../lib/search.ts";

const allowedSlugs = properties.map(({ slug }) => slug);

function memoryStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem(key) { assert.equal(key, FAVORITES_STORAGE_KEY); return value; },
    setItem(key, nextValue) { assert.equal(key, FAVORITES_STORAGE_KEY); value = nextValue; },
    value: () => value,
  };
}

test("ajout, suppression et absence de doublon", () => {
  const first = allowedSlugs[0];
  const added = toggleFavoriteSlug([], first, allowedSlugs);
  assert.deepEqual(added, [first]);
  assert.deepEqual(toggleFavoriteSlug(added, first, allowedSlugs), []);
  assert.deepEqual(normalizeFavoriteSlugs([first, first], allowedSlugs), [first]);
});

test("JSON invalide, liste vide et stockage absent sont sûrs", () => {
  assert.deepEqual(readFavoriteSlugs(memoryStorage("{cassé"), allowedSlugs), []);
  assert.deepEqual(readFavoriteSlugs(memoryStorage("[]"), allowedSlugs), []);
  assert.deepEqual(readFavoriteSlugs(null, allowedSlugs), []);
});

test("les slugs inconnus sont retirés dans un ordre déterministe", () => {
  const requested = [allowedSlugs[4], "slug-inconnu", allowedSlugs[1], allowedSlugs[4]];
  assert.deepEqual(normalizeFavoriteSlugs(requested, allowedSlugs), [allowedSlugs[1], allowedSlugs[4]]);
});

test("l’écriture stocke seulement le tableau normalisé de slugs", () => {
  const storage = memoryStorage();
  const result = writeFavoriteSlugs(storage, [allowedSlugs[2], "inconnu", allowedSlugs[2]], allowedSlugs);
  assert.equal(result.success, true);
  assert.equal(storage.value(), JSON.stringify([allowedSlugs[2]]));
});

test("un stockage indisponible ne provoque aucune erreur", () => {
  const unavailable = { getItem() { throw new Error("indisponible"); }, setItem() { throw new Error("indisponible"); } };
  assert.deepEqual(readFavoriteSlugs(unavailable, allowedSlugs), []);
  assert.equal(writeFavoriteSlugs(unavailable, [allowedSlugs[0]], allowedSlugs).success, false);
});

test("la fiche favorite et son retour utilisent /favoris", () => {
  assert.equal(buildFavoritePropertyUrl("lumineux-bastille"), "/biens/lumineux-bastille?origine=favoris");
  const parameters = { origine: "favoris" };
  const state = parseSearchParameters(parameters, properties.map(({ city }) => city));
  assert.equal(buildPropertyReturnUrl(parameters, state), "/favoris");
});

test("un contexte de recherche reste prioritaire sur l’origine favoris", () => {
  const parameters = { origine: "favoris", ville: "Paris", budget: "2500", chambres: "2", balcon: "oui", tri: "compatibilite" };
  const state = parseSearchParameters(parameters, ["Paris"]);
  assert.equal(buildPropertyReturnUrl(parameters, state), "/biens?ville=Paris&budget=2500&chambres=2&balcon=oui&tri=compatibilite");
});

test("le bouton expose le même état accessible sur carte et fiche", async () => {
  const button = await readFile(new URL("../components/FavoriteButton.tsx", import.meta.url), "utf8");
  const card = await readFile(new URL("../components/PropertyCard.tsx", import.meta.url), "utf8");
  const detail = await readFile(new URL("../components/PropertyDetail.tsx", import.meta.url), "utf8");
  assert.match(button, /Ajouter \$\{title\} aux favoris/);
  assert.match(button, /Retirer \$\{title\} des favoris/);
  assert.match(button, /aria-pressed=\{favorite\}/);
  assert.match(card, /<FavoriteButton/);
  assert.match(detail, /<FavoriteButton/);
});
