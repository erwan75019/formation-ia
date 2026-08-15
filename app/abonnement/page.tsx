"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AbonnementPage() {
  const searchParams = useSearchParams();

  const requestedPlan = searchParams.get("plan");

  const plan =
    requestedPlan === "fondamentaux"
      ? "fondamentaux"
      : "complet";

  const isComplet = plan === "complet";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de lancer le paiement."
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe n'a pas retourné d'URL de paiement."
        );
      }

      // Redirection vers Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] px-6 py-20 text-slate-950">

      <div className="mx-auto max-w-2xl">

        {/* LOGO */}

        <Link
          href="/"
          className="inline-flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
            AI
          </div>

          <div>
            <p className="font-bold">
              AI Academy
            </p>

            <p className="text-xs text-slate-400">
              Paiement sécurisé
            </p>
          </div>
        </Link>

        {/* HEADER */}

        <div className="mt-14">

          <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
            ABONNEMENT
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Finalisez votre parcours
          </h1>

          <p className="mt-5 max-w-xl leading-7 text-slate-500">
            Vérifiez votre offre puis continuez vers
            le paiement sécurisé Stripe.
          </p>

        </div>

        {/* CARTE ABONNEMENT */}

        <div className="mt-10 rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl">

          {/* PLAN */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-xs font-semibold tracking-[0.15em] text-slate-500">
                PARCOURS SÉLECTIONNÉ
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                {isComplet
                  ? "Parcours complet"
                  : "Fondamentaux & Automatisation IA"}
              </h2>

            </div>

            {isComplet && (
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950">
                Recommandé
              </span>
            )}

          </div>

          {/* ACCÈS */}

          <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
              ACCÈS
            </p>

            <p className="mt-2 text-lg font-bold">
              {isComplet
                ? "Modules 1 à 12"
                : "Modules 1 à 5"}
            </p>

          </div>

          {/* PRIX */}

          <div className="mt-7 border-t border-slate-800 pt-7">

            <p className="text-xs font-semibold tracking-[0.15em] text-slate-500">
              ABONNEMENT ANNUEL
            </p>

            <div className="mt-3 flex items-end gap-2">

              <p className="text-5xl font-bold tracking-tight">
                {isComplet
                  ? "69,99 €"
                  : "19,99 €"}
              </p>

              <p className="pb-1 text-sm font-semibold text-slate-400">
                / an
              </p>

            </div>

            <p className="mt-3 text-sm font-semibold text-emerald-400">
              12 mois d&apos;accès
            </p>

          </div>

          {/* AVANTAGES */}

          <div className="mt-8 space-y-4 text-sm text-slate-300">

            <p>
              ✓ Progression enregistrée
            </p>

            <p>
              ✓ Accès aux exercices et projets
            </p>

            <p>
              ✓ Certificat selon le parcours
            </p>

            {isComplet && (
              <>
                <p>
                  ✓ Projet PropertyMatch AI
                </p>

                <p>
                  ✓ Parcours Applications & Systèmes IA
                </p>
              </>
            )}

          </div>

          {/* ERREUR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* BOUTON STRIPE */}

          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-white px-6 py-5 font-bold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Redirection vers Stripe..."
              : "Continuer vers le paiement →"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Le paiement sera traité de manière
            sécurisée par Stripe.
          </p>

        </div>

        {/* CHANGER DE PARCOURS */}

        <div className="mt-7 text-center">

          <Link
            href="/tarifs"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            ← Modifier mon parcours
          </Link>

        </div>

      </div>

    </main>
  );
}