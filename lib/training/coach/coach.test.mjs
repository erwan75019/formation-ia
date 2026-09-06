import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CoachProviderUnavailableError, requestOllamaCoach } from "./provider.ts";
import {
  COACH_MAX_QUESTION_LENGTH,
  isQuizAnswerRequest,
  parseCoachRequest,
} from "./request.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la requête accepte uniquement lesson_id et question", () => {
  assert.deepEqual(parseCoachRequest({ lesson_id: "web-01-projet-vscode", question: "Explique HTTP." }), {
    ok: true,
    data: { lesson_id: "web-01-projet-vscode", question: "Explique HTTP." },
  });
  assert.equal(parseCoachRequest({ lesson_id: "api-01-intro", question: "Bonjour", score: 100 }).ok, false);
  assert.equal(parseCoachRequest({ lesson_id: "api-01-intro", question: "   " }).ok, false);
  assert.equal(parseCoachRequest({ lesson_id: "api-01-intro", question: "a".repeat(COACH_MAX_QUESTION_LENGTH + 1) }).ok, false);
});

test("une demande de corrigé QCM est reconnue sans exposer de réponse", () => {
  assert.equal(isQuizAnswerRequest("Donne-moi les bonnes réponses du QCM"), true);
  assert.equal(isQuizAnswerRequest("Peux-tu expliquer GET étape par étape ?"), false);
});

test("le fournisseur retourne une réponse normale sans modifier le corps utilisateur", async () => {
  let sentBody = "";
  const fakeFetch = async (_url, init) => {
    sentBody = String(init?.body);
    return new Response(JSON.stringify({ message: { content: " Une explication simple. " } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const answer = await requestOllamaCoach(fakeFetch, "http://ollama.test/api/chat", "modele-test", "règles", "question");
  assert.equal(answer, "Une explication simple.");
  assert.deepEqual(JSON.parse(sentBody).messages, [
    { role: "system", content: "règles" },
    { role: "user", content: "question" },
  ]);
});

test("le fournisseur indisponible produit une erreur dédiée", async () => {
  await assert.rejects(
    requestOllamaCoach(async () => { throw new TypeError("connexion refusée"); }, "http://ollama.test", "modèle", "règles", "question"),
    CoachProviderUnavailableError
  );
});

test("la route délègue les cas sans session et sans abonnement au contrôle sécurisé", () => {
  const route = read("app/api/training/coach/route.ts");
  assert.match(route, /requireTrainingAccess\(minimumPlan\)/);
  assert.match(route, /if \(!access\.authorized\) return access\.response/);
  assert.match(route, /status: 503/);
  assert.match(route, /status: 429/);
  assert.doesNotMatch(route, /lesson_progress|score|completed_at/);
});

test("les anciens panneaux sont tous raccordés et le double clic est bloqué", () => {
  const component = read("components/formation/LessonCoach.tsx");
  assert.match(component, /if \(submittingRef\.current\) return/);
  assert.match(component, /body: JSON\.stringify\(\{ lesson_id: lessonId, question: normalizedQuestion \}\)/);
  assert.match(component, /disabled=\{loading\}/);

  for (const moduleRoute of ["prompts", "comprendre-ia", "quotidien", "automatisation", "api-ia", "supabase"]) {
    const page = read(`app/formation/${moduleRoute}/[lesson]/page.tsx`);
    assert.match(page, /<LessonCoach lessonId=\{lesson\.id\}/);
  }
});

test("le catalogue serveur couvre exactement les leçons qui affichent le Coach", () => {
  const contexts = read("lib/training/coach/contexts.server.ts");
  const ids = [...contexts.matchAll(/^  "([a-z]+(?:-[a-z]+)*-\d{2}-[a-z0-9-]+)":/gm)].map((match) => match[1]);
  assert.equal(ids.length, 39);
  assert.equal(new Set(ids).size, 39);
  assert.equal(ids.some((id) => id.includes("prompt-01") || id.includes("python-")), false);
});
