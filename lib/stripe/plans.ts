export type SubscriptionPlan = "fondamentaux" | "complet";

export function getPriceIdForPlan(plan: SubscriptionPlan) {
  const priceId =
    plan === "fondamentaux"
      ? process.env.STRIPE_PRICE_FONDAMENTAUX
      : process.env.STRIPE_PRICE_COMPLET;

  if (!priceId) {
    throw new Error(`Price ID Stripe manquant pour l'offre ${plan}.`);
  }

  return priceId;
}

export function getPlanForPriceId(
  priceId: string
): SubscriptionPlan | null {
  const fondamentauxPriceId =
    process.env.STRIPE_PRICE_FONDAMENTAUX;
  const completPriceId = process.env.STRIPE_PRICE_COMPLET;

  if (!fondamentauxPriceId || !completPriceId) {
    throw new Error("Configuration des Price IDs Stripe incomplète.");
  }

  if (priceId === fondamentauxPriceId) {
    return "fondamentaux";
  }

  if (priceId === completPriceId) {
    return "complet";
  }

  return null;
}
