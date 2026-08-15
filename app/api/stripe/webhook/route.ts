import type Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { getPlanForPriceId } from "@/lib/stripe/plans";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Profile = {
  id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
};

const SUPPORTED_EVENT_TYPES = new Set<string>([
  "checkout.session.completed",
  "invoice.paid",
  "invoice.payment_failed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
]);

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret) {
    console.error("Configuration du webhook Stripe manquante.");
    return NextResponse.json({ error: "Webhook indisponible." }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Signature Stripe manquante." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json({ error: "Signature Stripe invalide." }, { status: 400 });
  }

  if (!SUPPORTED_EVENT_TYPES.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    const supabase = createAdminClient();
    const { data: processedEvent, error: lookupError } = await supabase
      .from("stripe_webhook_events")
      .select("event_id")
      .eq("event_id", event.id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (processedEvent) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const synchronized = await processEvent(event);

    if (!synchronized) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const { error: processedError } = await supabase
      .from("stripe_webhook_events")
      .insert({
        event_id: event.id,
        event_type: event.type,
        stripe_created_at: toIsoDate(event.created),
      });

    if (processedError && processedError.code !== "23505") {
      throw processedError;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "Erreur de synchronisation du webhook Stripe :",
      formatSafeError(error)
    );

    return NextResponse.json(
      { error: "Synchronisation Stripe impossible." },
      { status: 500 }
    );
  }
}

async function processEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode !== "subscription") {
        return false;
      }

      const subscriptionId = getId(session.subscription);

      if (!subscriptionId) {
        throw new Error("Subscription absente de la session Checkout.");
      }

      await syncCurrentSubscription(subscriptionId, event.created, [
        session.client_reference_id,
        session.metadata?.user_id,
      ]);
      return true;
    }

    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = getInvoiceSubscriptionId(invoice);

      if (!subscriptionId) {
        return false;
      }

      await syncCurrentSubscription(subscriptionId, event.created);
      return true;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed": {
      const eventSubscription = event.data.object as Stripe.Subscription;
      await syncCurrentSubscription(eventSubscription.id, event.created, [
        eventSubscription.metadata.user_id,
      ]);
      return true;
    }

    default:
      return false;
  }
}

async function syncCurrentSubscription(
  subscriptionId: string,
  eventCreated: number,
  candidateUserIds: Array<string | null | undefined> = []
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = getId(subscription.customer);

  if (!customerId) {
    throw new Error("Customer Stripe introuvable sur la Subscription.");
  }

  const priceItems = subscription.items.data.map((item) => ({
    priceId: item.price.id,
    plan: getPlanForPriceId(item.price.id),
    currentPeriodEnd: item.current_period_end,
  }));
  const recognizedItems = priceItems.filter((item) => item.plan !== null);
  const hasExactlyOneKnownPrice =
    priceItems.length === 1 && recognizedItems.length === 1;
  const selectedItem = hasExactlyOneKnownPrice ? recognizedItems[0] : null;
  const plan = selectedItem?.plan ?? null;
  const priceId =
    selectedItem?.priceId ?? priceItems[0]?.priceId ?? null;
  const profile = await resolveProfile(
    subscription.id,
    customerId,
    [subscription.metadata.user_id, ...candidateUserIds]
  );

  if (!profile) {
    throw new Error("Profil Supabase introuvable pour la Subscription Stripe.");
  }

  ensureStripeBinding(profile, subscription.id, customerId);

  const eventCreatedAt = toIsoDate(eventCreated);
  const subscriptionStatus = plan
    ? normalizeSubscriptionStatus(subscription.status)
    : "inactive";
  const currentPeriodEnd = selectedItem
    ? toIsoDate(selectedItem.currentPeriodEnd)
    : null;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      plan,
      subscription_status: subscriptionStatus,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      current_period_end: currentPeriodEnd,
      subscription_cancel_at_period_end:
        subscription.cancel_at_period_end,
      stripe_event_created_at: eventCreatedAt,
    })
    .eq("id", profile.id)
    .or(
      `stripe_event_created_at.is.null,stripe_event_created_at.lte.${eventCreatedAt}`
    );

  if (error) {
    throw error;
  }
}

async function resolveProfile(
  subscriptionId: string,
  customerId: string,
  candidateUserIds: Array<string | null | undefined>
): Promise<Profile | null> {
  const supabase = createAdminClient();
  const selection =
    "id, stripe_customer_id, stripe_subscription_id, subscription_status";

  const { data: subscriptionProfile, error: subscriptionError } =
    await supabase
      .from("profiles")
      .select(selection)
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();

  if (subscriptionError) {
    throw subscriptionError;
  }

  if (subscriptionProfile) {
    return subscriptionProfile as Profile;
  }

  const { data: customerProfile, error: customerError } = await supabase
    .from("profiles")
    .select(selection)
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (customerError) {
    throw customerError;
  }

  if (customerProfile) {
    return customerProfile as Profile;
  }

  const userId = candidateUserIds.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && UUID_PATTERN.test(candidate)
  );

  if (!userId) {
    return null;
  }

  const { data: userProfile, error: userError } = await supabase
    .from("profiles")
    .select(selection)
    .eq("id", userId)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  return (userProfile as Profile | null) ?? null;
}

function ensureStripeBinding(
  profile: Profile,
  subscriptionId: string,
  customerId: string
) {
  const hasActiveSubscription =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (
    profile.stripe_customer_id &&
    profile.stripe_customer_id !== customerId
  ) {
    throw new Error("Le profil est déjà lié à un autre Customer Stripe.");
  }

  if (
    hasActiveSubscription &&
    profile.stripe_subscription_id &&
    profile.stripe_subscription_id !== subscriptionId
  ) {
    throw new Error("Le profil possède déjà un abonnement actif différent.");
  }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice) {
  const subscription = invoice.parent?.subscription_details?.subscription;
  return getId(subscription);
}

function getId(value: { id: string } | string | null | undefined) {
  return typeof value === "string" ? value : value?.id ?? null;
}

function normalizeSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "canceled":
      return status;
    case "incomplete_expired":
      return "canceled";
    case "incomplete":
    case "paused":
    case "unpaid":
    default:
      return "inactive";
  }
}

function toIsoDate(timestamp: number) {
  return new Date(timestamp * 1000).toISOString();
}

function formatSafeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (typeof error !== "object" || error === null) {
    return {
      message: "Erreur inconnue",
    };
  }

  const errorRecord = error as Record<string, unknown>;
  const message = getSafeErrorField(errorRecord, "message");
  const code = getSafeErrorField(errorRecord, "code");
  const details = getSafeErrorField(errorRecord, "details");

  return {
    message: message ?? "Erreur Supabase sans message",
    ...(code ? { code } : {}),
    ...(details ? { details } : {}),
  };
}

function getSafeErrorField(
  error: Record<string, unknown>,
  field: "message" | "code" | "details"
) {
  return typeof error[field] === "string" ? error[field] : null;
}
