import "server-only";

import { randomUUID } from "node:crypto";
import {
  getAvadaPayOffer,
  getAvadaPayOperator,
  type AvadaPayOperator,
  type AvadaPayPlan,
} from "./catalog";

export type PendingAvadaPayOrder = {
  order_id: string;
  user_id: string;
  provider: "avadapay";
  plan: AvadaPayPlan;
  operator: AvadaPayOperator;
  provider_id: 9 | 10 | 17;
  amount: string;
  currency: string;
  status: "pending";
};

export function createPendingAvadaPayOrder(
  userId: string,
  plan: AvadaPayPlan,
  operator: AvadaPayOperator
): PendingAvadaPayOrder {
  const offer = getAvadaPayOffer(plan);
  const paymentOperator = getAvadaPayOperator(operator);

  return {
    order_id: `AIA-${randomUUID()}`,
    user_id: userId,
    provider: "avadapay",
    plan,
    operator,
    provider_id: paymentOperator.providerId,
    amount: (offer.amountMinor / 100).toFixed(2),
    currency: offer.currency,
    status: "pending",
  };
}
