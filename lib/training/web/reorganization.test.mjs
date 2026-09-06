import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  getPreviousOfficialLessonId,
  moduleLessonIds,
  planLessonTotals,
  webLessonCatalog,
} from "../catalog.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const expected = [
  ["web-01-projet-vscode", "Découvrir PropertyMatch et préparer VS Code"],
  ["web-02-nextjs", "Créer et lancer le projet Next.js"],
  ["web-03-structure", "Construire la structure de la page d’accueil"],
  ["web-04-tailwind", "Reproduire le design avec Tailwind"],
  ["web-05-donnees", "Créer les données immobilières avec TypeScript"],
  ["web-06-composants", "Découper le site en composants React"],
  ["web-07-cartes", "Afficher les cartes des logements"],
  ["web-08-recherche", "Ajouter la recherche, les filtres et les paramètres d’URL"],
  ["web-09-matching", "Calculer et expliquer la compatibilité"],
  ["web-10-fiches", "Créer les fiches détaillées des logements"],
  ["web-11-favoris", "Enregistrer les favoris dans le navigateur"],
  ["web-12-publication", "Finaliser, tester et publier sur Vercel"],
];

test("les 12 identifiants et titres sont exacts et ordonnés", () => {
  assert.deepEqual(webLessonCatalog.map(({ id, title }) => [id, title]), expected);
  assert.deepEqual(moduleLessonIds[6], expected.map(([id]) => id));
});

test("les totaux des offres et du certificat complet sont 28 et 84", () => {
  assert.deepEqual(planLessonTotals, { fondamentaux: 28, complet: 84 });
  assert.match(read("lib/certificates/config.ts"), /lessonIds: planLessonIds\.complet/);
});

test("chaque leçon exige la précédente et le module 7 exige la leçon 12", () => {
  for (let index = 1; index < moduleLessonIds[6].length; index += 1) {
    assert.equal(getPreviousOfficialLessonId(moduleLessonIds[6][index]), moduleLessonIds[6][index - 1]);
  }
  assert.equal(getPreviousOfficialLessonId("api-01-intro"), "web-12-publication");
  const moduleSevenLayout = read("app/formation/api-ia/layout.tsx");
  assert.match(moduleSevenLayout, /completed, completed_at/);
  assert.match(moduleSevenLayout, /isValidLessonCompletion/);
});

test("les anciens identifiants sont refusés par le catalogue et les QCM", () => {
  const active = `${read("lib/training/catalog.ts")}\n${read("lib/training/web/quizzes.ts")}\n${read("lib/training/web/answers.server.ts")}`;
  for (const id of ["web-01-fonctionnement", "web-12-matching", "web-20-publication", "python-07-project"]) {
    assert.doesNotMatch(active, new RegExp(id));
  }
  assert.match(read("app/api/training/web/quiz/validate/route.ts"), /lesson_id inconnu/);
});

test("les URL historiques redirigent sans pouvoir valider une progression", () => {
  const config = read("next.config.ts");
  assert.match(config, /\/formation\/python\/:path\*/);
  assert.match(config, /\/formation\/site-web\/:lesson\(1\[3-9\]\|20\)\/:path\*/);
  assert.match(config, /destination: "\/formation\/site-web\/12"/);
  assert.equal((config.match(/permanent: true/g) ?? []).length, 3);
  const legacyExercise = read("app/formation/site-web/[lesson]/exercice/page.tsx");
  assert.doesNotMatch(legacyExercise, /lesson_progress|createClient|fetch\(/);
});
