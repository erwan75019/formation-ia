"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export type PricingPlan = "fondamentaux" | "complet";

type Props = {
  plan: PricingPlan;
  authenticated: boolean;
  activePlan: PricingPlan | null;
  hasActiveSubscription: boolean;
  className: string;
  visitorLabel: string;
};

export default function PricingPlanAction({
  plan,
  authenticated,
  activePlan,
  hasActiveSubscription,
  className,
  visitorLabel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const checkoutStarted = useRef(false);

  if (!authenticated) {
    return (
      <Link href={`/inscription?plan=${plan}`} className={className}>
        {visitorLabel}
      </Link>
    );
  }

  if (hasActiveSubscription) {
    return (
      <div>
        <Link href="/dashboard" className={className}>
          {activePlan === plan ? "Offre actuelle" : "Voir mon offre active"}
        </Link>
        {activePlan !== plan && (
          <p className="mt-2 text-center text-xs text-slate-400">
            Un abonnement est déjà actif sur ce compte.
          </p>
        )}
      </div>
    );
  }

  async function startCheckout() {
    if (checkoutStarted.current) return;
    checkoutStarted.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Impossible de lancer le paiement.");
      }
      if (!payload.url) {
        throw new Error("Stripe n’a pas retourné d’URL de paiement.");
      }

      window.location.assign(payload.url);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Impossible de lancer le paiement. Réessayez dans quelques instants."
      );
      checkoutStarted.current = false;
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        aria-busy={loading}
        className={`${className} w-full disabled:cursor-wait disabled:opacity-60`}
      >
        {loading ? "Ouverture du paiement…" : visitorLabel}
      </button>
      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-950/60 p-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
