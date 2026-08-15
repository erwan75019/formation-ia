import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type PlanId = "fondamentaux" | "complet";

function getPriceId(plan: PlanId) {
  if (plan === "fondamentaux") {
    return process.env.STRIPE_PRICE_FONDAMENTAUX;
  }

  return process.env.STRIPE_PRICE_COMPLET;
}

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

    const plan = body.plan as PlanId;

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

    const priceId = getPriceId(plan);

    if (!priceId) {
      return NextResponse.json(
        {
          error: "Price ID Stripe manquant.",
        },
        {
          status: 500,
        }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email: user.email,

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