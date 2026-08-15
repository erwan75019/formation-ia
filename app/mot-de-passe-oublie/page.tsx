"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const redirectTo =
      `${window.location.origin}/nouveau-mot-de-passe`;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        }
      );

    setLoading(false);

    if (error) {
      console.error(
        "Erreur reset password :",
        error
      );

      setErrorMessage(
        "Impossible d’envoyer l’email pour le moment. Réessayez dans quelques instants."
      );

      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ======================================================
            GAUCHE
        ====================================================== */}

        <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
              AI
            </div>

            <div>
              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-500">
                De zéro au SaaS IA
              </p>
            </div>
          </Link>

          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              RÉCUPÉRATION DU COMPTE
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-tight">
              Retrouvez l’accès à votre formation.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Entrez l’adresse email liée à votre compte.
              Nous vous enverrons un lien sécurisé permettant
              de choisir un nouveau mot de passe.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <InfoCard
                value="12"
                label="Modules"
              />

              <InfoCard
                value="74"
                label="Leçons"
              />

              <InfoCard
                value="100%"
                label="Progression conservée"
              />
            </div>
          </div>

          <p className="text-sm text-slate-600">
            © 2026 AI Academy
          </p>

        </section>

        {/* ======================================================
            DROITE
        ====================================================== */}

        <section className="flex items-center justify-center px-6 py-12 sm:px-10">

          <div className="w-full max-w-md">

            <Link
              href="/"
              className="mb-10 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                AI
              </div>

              <p className="font-bold">
                AI Academy
              </p>
            </Link>

            {!sent ? (
              <>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                  MOT DE PASSE OUBLIÉ
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight">
                  Réinitialisez votre mot de passe
                </h1>

                <p className="mt-4 leading-7 text-slate-500">
                  Entrez votre adresse email et nous vous
                  enverrons un lien pour choisir un nouveau mot de passe.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8"
                >
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold"
                  >
                    Adresse email
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="vous@exemple.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
                  />

                  {errorMessage && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !email.trim()
                    }
                    className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {loading
                      ? "Envoi en cours..."
                      : "Envoyer le lien →"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    href="/connexion"
                    className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
                  >
                    ← Retour à la connexion
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-[30px] border border-emerald-200 bg-white p-8 shadow-sm">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                  ✓
                </div>

                <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-emerald-700">
                  EMAIL ENVOYÉ
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                  Consultez votre boîte mail
                </h1>

                <p className="mt-4 leading-7 text-slate-500">
                  Si un compte correspond à{" "}
                  <span className="font-semibold text-slate-700">
                    {email}
                  </span>
                  , vous recevrez un lien permettant
                  de choisir un nouveau mot de passe.
                </p>

                <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                  Pensez également à vérifier vos courriers indésirables.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setErrorMessage("");
                  }}
                  className="mt-6 w-full rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
                >
                  Renvoyer un email
                </button>

                <Link
                  href="/connexion"
                  className="mt-3 block w-full rounded-2xl bg-slate-950 px-6 py-4 text-center font-semibold text-white"
                >
                  Retour à la connexion
                </Link>

              </div>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>

    </div>
  );
}