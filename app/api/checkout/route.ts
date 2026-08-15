import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  getPriceIdForPlan,
  type SubscriptionPlan,
} from "@/lib/stripe/plans";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Vous devez être connecté pour continuer.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const plan = body.plan as SubscriptionPlan;

    if (
      plan !== "fondamentaux" &&
      plan !== "complet"
    ) {
      return NextResponse.json(
        {
          error: "Parcours invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "stripe_customer_id, stripe_subscription_id, subscription_status"
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Profil utilisateur introuvable." },
        { status: 500 }
      );
    }

    if (
      profile.subscription_status === "active" ||
      profile.subscription_status === "trialing"
    ) {
      return NextResponse.json(
        { error: "Un abonnement actif existe déjà pour ce compte." },
        { status: 409 }
      );
    }

    const priceId = getPriceIdForPlan(plan);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const customer = profile.stripe_customer_id;

    if (customer) {
      const subscriptions = await stripe.subscriptions.list({
        customer,
        status: "all",
        limit: 100,
      });
      const hasConcurrentSubscription = subscriptions.data.some(
        (subscription) =>
          subscription.status === "active" ||
          subscription.status === "trialing"
      );

      if (hasConcurrentSubscription) {
        return NextResponse.json(
          { error: "Un abonnement Stripe actif existe déjà." },
          { status: 409 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      client_reference_id: user.id,

      ...(customer
        ? { customer }
        : { customer_email: user.email }),

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url:
        `${siteUrl}/abonnement/succes?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${siteUrl}/abonnement/annule`,

      metadata: {
        user_id: user.id,
        plan,
      },

      subscription_data: {
        metadata: {
          user_id: user.id,
          plan,
        },
      },

      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        {
          error: "Stripe n'a pas généré d'URL de paiement.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Erreur Checkout Stripe :",
      error
    );

    return NextResponse.json(
      {
        error: "Impossible de créer la session de paiement.",
      },
      {
        status: 500,
      }
    );
  }
}
