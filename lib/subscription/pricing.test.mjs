import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const pricingPage = read("app/tarifs/page.tsx");
const action = read("components/subscription/PricingPlanAction.tsx");
const checkout = read("app/api/checkout/route.ts");
const signup = read("app/inscription/page.tsx");
const proxy = read("proxy.ts");

test("la page tarifs recharge session et profil côté serveur", () => {
  assert.match(pricingPage, /await supabase\.auth\.getUser\(\)/);
  assert.match(pricingPage, /select\("plan, subscription_status"\)/);
  assert.match(pricingPage, /Mon espace/);
});

test("un visiteur conserve le plan dans le lien d’inscription", () => {
  assert.match(action, /href=\{`\/inscription\?plan=\$\{plan\}`\}/);
});

test("un utilisateur connecté envoie seulement le plan au Checkout", () => {
  assert.match(action, /fetch\("\/api\/checkout"/);
  assert.match(action, /JSON\.stringify\(\{ plan \}\)/);
  assert.doesNotMatch(action, /user_id|stripe_customer_id/);
});

test("le double clic est bloqué synchroniquement", () => {
  assert.match(action, /checkoutStarted\.current/);
  assert.match(action, /if \(checkoutStarted\.current\) return/);
});

test("une offre active ne lance pas Checkout", () => {
  assert.match(action, /if \(hasActiveSubscription\)/);
  assert.match(action, /Offre actuelle/);
  assert.match(action, /href="\/dashboard"/);
});

test("Checkout garde ses contrôles serveur", () => {
  assert.match(checkout, /supabase\.auth\.getUser\(\)/);
  assert.match(checkout, /plan !== "fondamentaux"/);
  assert.match(checkout, /plan !== "complet"/);
  assert.match(checkout, /subscription_status === "active"/);
  assert.match(checkout, /subscription_status === "trialing"/);
  assert.match(checkout, /client_reference_id: user\.id/);
});

test("un compte déjà connecté reprend le plan sans nouvelle inscription", () => {
  assert.match(proxy, /pathname === "\/inscription"/);
  assert.match(proxy, /`\/abonnement\?plan=\$\{checkoutPlan\}`/);
  assert.match(proxy, /activeSubscription[\s\S]*"\/dashboard"/);
  assert.match(signup, /router\.replace\(`\/abonnement\?plan=\$\{planId\}`\)/);
});
