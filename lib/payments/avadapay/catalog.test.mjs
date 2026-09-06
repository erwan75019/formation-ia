import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  avadaPayOffers,
  avadaPayOperators,
  isAvadaPayOperator,
  isAvadaPayPlan,
  parseAvadaPayPaymentSelection,
} from "./catalog.ts";
import { hasCurrentPaidAccess } from "../access.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("seuls les deux plans et les trois opérateurs AvadaPay sont reconnus", () => {
  assert.equal(isAvadaPayPlan("fondamentaux"), true);
  assert.equal(isAvadaPayPlan("complet"), true);
  assert.equal(isAvadaPayPlan("expert"), false);
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(avadaPayOperators).map(([operator, config]) => [
        operator,
        config.providerId,
      ])
    ),
    { mpesa: 9, orange_money: 10, airtel_money: 17 }
  );
  assert.equal(isAvadaPayOperator("orange_money"), true);
  assert.equal(isAvadaPayOperator("inconnu"), false);
});

test("la future requête navigateur ne peut sélectionner que plan et opérateur", () => {
  assert.deepEqual(
    parseAvadaPayPaymentSelection({
      plan: "fondamentaux",
      operator: "mpesa",
    }),
    { plan: "fondamentaux", operator: "mpesa" }
  );

  for (const forbiddenField of ["amount", "status", "user_id", "accessMonths"]) {
    assert.equal(
      parseAvadaPayPaymentSelection({
        plan: "complet",
        operator: "airtel_money",
        [forbiddenField]: "valeur-fournie-par-le-client",
      }),
      null
    );
  }
});

test("les prix et les douze mois viennent exclusivement du catalogue serveur", () => {
  assert.deepEqual(avadaPayOffers.fondamentaux, {
    amountMinor: 1999,
    currency: "EUR",
    accessMonths: 12,
  });
  assert.deepEqual(avadaPayOffers.complet, {
    amountMinor: 6999,
    currency: "EUR",
    accessMonths: 12,
  });
  const orderBuilder = read("lib/payments/avadapay/orders.server.ts");
  assert.match(orderBuilder, /import "server-only"/);
  assert.match(orderBuilder, /getAvadaPayOffer\(plan\)/);
  assert.doesNotMatch(orderBuilder, /amount.*parameter|duration.*parameter/i);
});

test("l’accès futur exige plan reconnu, active et une date strictement future", () => {
  const now = new Date("2026-08-24T12:00:00.000Z");
  assert.equal(hasCurrentPaidAccess({ plan: "complet", subscription_status: "active", current_period_end: "2027-08-24T12:00:00.000Z" }, now), true);
  assert.equal(hasCurrentPaidAccess({ plan: "complet", subscription_status: "trialing", current_period_end: "2027-08-24T12:00:00.000Z" }, now), false);
  assert.equal(hasCurrentPaidAccess({ plan: "expert", subscription_status: "active", current_period_end: "2027-08-24T12:00:00.000Z" }, now), false);
  assert.equal(hasCurrentPaidAccess({ plan: "fondamentaux", subscription_status: "active", current_period_end: now.toISOString() }, now), false);
  assert.equal(hasCurrentPaidAccess({ plan: "fondamentaux", subscription_status: "active", current_period_end: "date-invalide" }, now), false);
});

test("les quatre variables AvadaPay restent exclusivement serveur", () => {
  const config = read("lib/payments/avadapay/config.server.ts");
  for (const name of ["AVADAPAY_API_URL", "AVADAPAY_PUBLIC_ID", "AVADAPAY_MERCHANT_ID", "AVADAPAY_SECRET_KEY"]) {
    assert.match(config, new RegExp(`process\\.env\\.${name}`));
  }
  assert.doesNotMatch(config, /NEXT_PUBLIC_AVADAPAY/);
});

test("la migration isole les commandes et événements des écritures navigateur", () => {
  const sql = read("supabase/migrations/202608240007_prepare_avadapay_one_time_payments.sql");
  assert.match(sql, /create table public\.payment_orders/);
  assert.match(sql, /create table public\.payment_events/);
  assert.match(sql, /unique \(provider, event_id\)/);
  assert.match(sql, /enable row level security/g);
  assert.match(sql, /revoke all on table public\.payment_orders from anon, authenticated/);
  assert.match(sql, /grant select, insert, update on table public\.payment_orders to service_role/);
  assert.match(sql, /grant select, insert, update on table public\.payment_events to service_role/);
  assert.doesNotMatch(sql, /grant insert.*authenticated|grant update.*authenticated/i);
});
