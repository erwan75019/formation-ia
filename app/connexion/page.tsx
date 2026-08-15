"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (error) {
      setError(
        "Email ou mot de passe incorrect."
      );

      return;
    }

    router.push("/dashboard");
    router.refresh();
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

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-slate-950">
              AI
            </div>

            <div>
              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-400">
                Votre espace de formation
              </p>
            </div>

          </Link>

          <div className="max-w-xl">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              BON RETOUR
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight">

              Continuez là où

              <span className="block text-slate-500">
                vous vous êtes arrêté.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Retrouvez vos cours, vos exercices et votre progression.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">

              <Stat
                value="12"
                label="Modules"
              />

              <Stat
                value="74"
                label="Leçons"
              />

              <Stat
                value="100%"
                label="Progression conservée"
              />

            </div>

          </div>

          <p className="text-xs text-slate-600">
            © 2026 AI Academy
          </p>

        </section>

        {/* ======================================================
            DROITE
        ====================================================== */}

        <section className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* LOGO MOBILE */}

            <Link
              href="/"
              className="mb-10 flex items-center gap-3 lg:hidden"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
                AI
              </div>

              <div>
                <p className="font-bold">
                  AI Academy
                </p>

                <p className="text-xs text-slate-400">
                  De zéro au SaaS IA
                </p>
              </div>

            </Link>

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              CONNEXION
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Ravi de vous revoir
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Connectez-vous pour continuer votre formation.
            </p>

            {/* ======================================================
                FORMULAIRE
            ====================================================== */}

            <form
              onSubmit={handleSubmit}
              className="mt-10"
            >

              {/* EMAIL */}

              <div>

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
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
                />

              </div>

              {/* PASSWORD */}

              <div className="mt-5">

                <div className="flex items-center justify-between gap-4">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Mot de passe
                  </label>

                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
                  >
                    Mot de passe oublié ?
                  </Link>

                </div>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Votre mot de passe"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
                />

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password
                }
                className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white"
              >
                {loading
                  ? "Connexion..."
                  : "Se connecter →"}
              </button>

            </form>

            {/* ======================================================
                INSCRIPTION
            ====================================================== */}

            <div className="mt-8 border-t border-slate-200 pt-7">

              <p className="text-center text-sm text-slate-500">

                Pas encore de compte ?{" "}

                <Link
                  href="/inscription"
                  className="font-semibold text-slate-950 transition hover:text-slate-600"
                >
                  Créer un compte
                </Link>

              </p>

            </div>

            {/* RETOUR */}

            <div className="mt-5 text-center">

              <Link
                href="/"
                className="text-sm font-medium text-slate-400 transition hover:text-slate-950"
              >
                ← Retour à l’accueil
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

// ======================================================
// STAT
// ======================================================

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

      <p className="text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {label}
      </p>

    </div>
  );
}