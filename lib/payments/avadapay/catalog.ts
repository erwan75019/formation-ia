export const avadaPayPlans = ["fondamentaux", "complet"] as const;
export type AvadaPayPlan = (typeof avadaPayPlans)[number];

export const avadaPayOperators = {
  mpesa: { label: "M-Pesa", providerId: 9 },
  orange_money: { label: "Orange Money", providerId: 10 },
  airtel_money: { label: "Airtel Money", providerId: 17 },
} as const;

export type AvadaPayOperator = keyof typeof avadaPayOperators;

export type AvadaPayPaymentSelection = {
  plan: AvadaPayPlan;
  operator: AvadaPayOperator;
};

// Autorité serveur provisoire alignée sur les prix actuellement affichés.
// La devise et sa compatibilité AvadaPay doivent être confirmées avant connexion.
export const avadaPayOffers = {
  fondamentaux: {
    amountMinor: 1999,
    currency: "EUR",
    accessMonths: 12,
  },
  complet: {
    amountMinor: 6999,
    currency: "EUR",
    accessMonths: 12,
  },
} as const satisfies Record<
  AvadaPayPlan,
  { amountMinor: number; currency: string; accessMonths: 12 }
>;

export function isAvadaPayPlan(value: unknown): value is AvadaPayPlan {
  return typeof value === "string" &&
    (avadaPayPlans as readonly string[]).includes(value);
}

export function isAvadaPayOperator(
  value: unknown
): value is AvadaPayOperator {
  return typeof value === "string" && value in avadaPayOperators;
}

export function getAvadaPayOffer(plan: AvadaPayPlan) {
  return avadaPayOffers[plan];
}

export function getAvadaPayOperator(operator: AvadaPayOperator) {
  return avadaPayOperators[operator];
}

export function parseAvadaPayPaymentSelection(
  value: unknown
): AvadaPayPaymentSelection | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();

  if (keys.length !== 2 || keys[0] !== "operator" || keys[1] !== "plan") {
    return null;
  }

  if (!isAvadaPayPlan(record.plan) || !isAvadaPayOperator(record.operator)) {
    return null;
  }

  return { plan: record.plan, operator: record.operator };
}
