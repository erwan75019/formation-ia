"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type SubscriptionState = {
  active: boolean;
  plan: "fondamentaux" | "complet" | null;
  status: string;
};

export default function AbonnementSuccesPage() {
  const [subscription, setSubscription] =
    useState<SubscriptionState | null>(null);
  const [error, setError] = useState("");

  const refreshStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/subscription/status", {
        cache: "no-store",
      });
      const data = (await response.json()) as
        | SubscriptionState
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Impossible de vérifier l'abonnement."
        );
      }

      setSubscription(data as SubscriptionState);
      setError("");
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Impossible de vérifier l'abonnement."
      );
    }
  }, []);

  useEffect(() => {
    const initialTimeout = window.setTimeout(() => {
      void refreshStatus();
    }, 0);

    const interval = window.setInterval(() => {
      void refreshStatus();
    }, 2000);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 30000);

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [refreshStatus]);

  const active = subscription?.active === true;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6 py-16 text-slate-950">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          {active ? "✓" : "…"}
        </div>

        <p className="mt-7 text-sm font-semibold tracking-[0.18em] text-emerald-600">
          {active ? "ABONNEMENT ACTIVÉ" : "ACTIVATION EN COURS"}
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {active
            ? "Votre accès est maintenant actif."
            : "Nous vérifions votre abonnement."}
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-slate-500">
          {active
            ? "Votre abonnement Stripe a été synchronisé. Vous pouvez maintenant accéder à votre formation."
            : "Cette page se met à jour automatiquement après la confirmation sécurisée de Stripe."}
        </p>

        {error && (
          <p className="mx-auto mt-5 max-w-md text-sm text-red-600">
            {error}
          </p>
        )}

        {active ? (
          <Link
            href="/dashboard"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01]"
          >
            Accéder au dashboard →
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => void refreshStatus()}
            className="mt-8 rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Vérifier à nouveau
          </button>
        )}
      </div>
    </main>
  );
}
