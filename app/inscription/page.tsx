"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ======================================================
// PLANS
// ======================================================

const plans = {
  fondamentaux: {
    id: "fondamentaux",
    name: "Fondamentaux & Automatisation IA",
    price: "19,99 €",
    period: "/ an",
    access: "Modules 1 à 5",
  },

  complet: {
    id: "complet",
    name: "Parcours complet",
    price: "69,99 €",
    period: "/ an",
    access: "Modules 1 à 12",
  },
};

type PlanId = keyof typeof plans;

// ======================================================
// PAGE
// ======================================================

export default function InscriptionPage() {
  return (
    <Suspense fallback={<InscriptionLoading />}>
      <InscriptionContent />
    </Suspense>
  );
}

function InscriptionContent() {
  const supabase = createClient();
  const router = useRouter();

  const searchParams = useSearchParams();

  const requestedPlan = searchParams.get("plan");

  const planId: PlanId =
    requestedPlan === "fondamentaux" ||
    requestedPlan === "complet"
      ? requestedPlan
      : "fondamentaux";

  const selectedPlan = plans[planId];

  // ======================================================
  // FORM STATE
  // ======================================================

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // ======================================================
  // SUBMIT
  // ======================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    // ------------------------------------------------------
    // VALIDATIONS
    // ------------------------------------------------------

    if (!firstName.trim()) {
      setError(
        "Veuillez renseigner votre prénom."
      );
      return;
    }

    if (!lastName.trim()) {
      setError(
        "Veuillez renseigner votre nom."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    setLoading(true);

    // ------------------------------------------------------
    // CLEAN DATA
    // ------------------------------------------------------

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanEmail =
      email.trim();

    const fullName =
      `${cleanFirstName} ${cleanLastName}`.trim();

    // ------------------------------------------------------
    // SUPABASE SIGNUP
    // ------------------------------------------------------

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email: cleanEmail,

        password,

        options: {
          data: {
            first_name:
              cleanFirstName,

            last_name:
              cleanLastName,

            full_name:
              fullName,

            // Forfait choisi
            plan_selected:
              planId,
          },
        },
      });

    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message
      );
      return;
    }

    if (signUpData.session) {
      router.replace(`/abonnement?plan=${planId}`);
      router.refresh();
      return;
    }

    setMessage(
      "Compte créé ! Vérifiez votre boîte mail pour confirmer votre inscription."
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ==================================================
            PARTIE GAUCHE
        ================================================== */}

        <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-slate-950">
              AI
            </div>

            <div>

              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-400">
                De l&apos;IA aux produits réels
              </p>

            </div>

          </Link>

          {/* TEXTE */}

          <div className="max-w-xl">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              VOTRE PARCOURS COMMENCE ICI
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight">

              Apprenez l&apos;IA.

              <span className="block text-slate-500">
                Puis construisez avec.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">

              Une formation progressive pour maîtriser
              l&apos;IA puis construire de véritables sites,
              applications, SaaS, agents et systèmes IA.

            </p>

            {/* PLAN CHOISI */}

            <div className="mt-10 rounded-[26px] border border-slate-800 bg-slate-900 p-6">

              <div className="flex items-center justify-between gap-4">

                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                  PARCOURS SÉLECTIONNÉ
                </p>

                {planId === "complet" && (

                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-950">
                    RECOMMANDÉ
                  </span>

                )}

              </div>

              <h2 className="mt-4 text-xl font-bold">
                {selectedPlan.name}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {selectedPlan.access}
              </p>

              <div className="mt-5 flex items-end gap-2">

                <p className="text-3xl font-bold">
                  {selectedPlan.price}
                </p>

                <p className="pb-1 text-sm font-semibold text-slate-500">
                  {selectedPlan.period}
                </p>

              </div>

              <p className="mt-3 text-xs font-semibold text-emerald-400">
                12 mois d&apos;accès
              </p>

              <Link
                href="/tarifs"
                className="mt-5 inline-block text-xs font-semibold text-slate-400 transition hover:text-white"
              >
                Modifier mon parcours →
              </Link>

            </div>

          </div>

          <p className="text-xs text-slate-600">
            AI Academy
          </p>

        </section>

        {/* ==================================================
            FORMULAIRE
        ================================================== */}

        <section className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="lg:hidden">

              <Link
                href="/"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white"
              >
                AI
              </Link>

            </div>

            <p className="mt-8 text-sm font-semibold text-slate-400 lg:mt-0">
              CRÉER UN COMPTE
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Commencez votre formation
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Créez votre espace personnel pour
              sauvegarder votre progression et accéder
              à votre parcours.
            </p>

            {/* PLAN MOBILE */}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 lg:hidden">

              <p className="text-xs font-semibold text-slate-400">
                PARCOURS SÉLECTIONNÉ
              </p>

              <p className="mt-2 font-bold">
                {selectedPlan.name}
              </p>

              <div className="mt-2 flex items-end gap-2">

                <p className="text-xl font-bold">
                  {selectedPlan.price}
                </p>

                <p className="text-xs text-slate-400">
                  {selectedPlan.period}
                </p>

              </div>

            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >

              {/* PRÉNOM */}

              <div>

                <label className="text-sm font-semibold">
                  Prénom
                </label>

                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-slate-500"
                />

              </div>

              {/* NOM */}

              <div>

                <label className="text-sm font-semibold">
                  Nom
                </label>

                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  placeholder="Votre nom"
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-slate-500"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="text-sm font-semibold">
                  Adresse email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-slate-500"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-sm font-semibold">
                  Mot de passe
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="8 caractères minimum"
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-slate-500"
                />

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="text-sm font-semibold">
                  Confirmer le mot de passe
                </label>

                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Retapez votre mot de passe"
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-slate-500"
                />

              </div>

              {/* ERROR */}

              {error && (

                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>

              )}

              {/* SUCCESS */}

              {message && (

                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  {message}
                </div>

              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Création du compte..."
                  : "Créer mon compte"}

              </button>

            </form>

            <p className="mt-8 text-center text-sm text-slate-500">

              Vous avez déjà un compte ?{" "}

              <Link
                href="/connexion"
                className="font-semibold text-slate-950 transition hover:underline"
              >
                Connexion
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

function InscriptionLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6 text-slate-600">
      Chargement du formulaire…
    </main>
  );
}
