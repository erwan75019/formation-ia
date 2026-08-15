import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY est manquante dans .env.local"
  );
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);