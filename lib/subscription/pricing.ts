export type PricingPlan = "fondamentaux" | "complet";

export const activeSubscriptionStatuses = new Set(["active", "trialing"]);

export function isPricingPlan(value: unknown): value is PricingPlan {
  return value === "fondamentaux" || value === "complet";
}

export function hasActiveSubscription(status: unknown) {
  return typeof status === "string" && activeSubscriptionStatuses.has(status);
}
