"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [recoveryReady, setRecoveryReady] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (
        mounted &&
        session
      ) {
        setRecoveryReady(true);
      }

      if (mounted) {
        setChecking(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (
            event ===
              "PASSWORD_RECOVERY" ||
            session
          ) {
            setRecoveryReady(true);
            setChecking(false);
          }
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Votre mot de passe doit contenir au moins 8 caractères."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setErrorMessage(
        "Les deux mots de passe ne correspondent pas."
      );

      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (error) {
      console.error(
        "Erreur update password :",
        error
      );

      setErrorMessage(
        "Impossible de modifier votre mot de passe. Le lien a peut-être expiré. Demandez un nouveau lien."
      );

      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push(
        "/connexion"
      );
    }, 2500);
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />

          <p className="mt-4 text-sm text-slate-500">
            Vérification du lien...
          </p>

        </div>
      </main>
    );
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
              SÉCURITÉ DU COMPTE
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-tight">
              Choisissez un nouveau mot de passe.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Votre progression reste liée à votre compte.
              Modifier le mot de passe ne supprime aucune leçon,
              validation ou information de progression.
            </p>

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

            {success ? (
              <div className="rounded-[30px] border border-emerald-200 bg-white p-8 shadow-sm">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                  ✓
                </div>

                <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-emerald-700">
                  MOT DE PASSE MODIFIÉ
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                  C’est terminé
                </h1>

                <p className="mt-4 leading-7 text-slate-500">
                  Votre nouveau mot de passe a bien été enregistré.
                  Vous allez être redirigé vers la page de connexion.
                </p>

                <Link
                  href="/connexion"
                  className="mt-7 block rounded-2xl bg-slate-950 px-6 py-4 text-center font-semibold text-white"
                >
                  Se connecter maintenant →
                </Link>

              </div>
            ) : !recoveryReady ? (
              <div className="rounded-[30px] border border-red-200 bg-white p-8 shadow-sm">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl font-bold text-red-700">
                  !
                </div>

                <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-red-600">
                  LIEN INVALIDE
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                  Impossible de continuer
                </h1>

                <p className="mt-4 leading-7 text-slate-500">
                  Le lien de récupération est invalide ou a expiré.
                  Demandez simplement un nouveau lien.
                </p>

                <Link
                  href="/mot-de-passe-oublie"
                  className="mt-7 block rounded-2xl bg-slate-950 px-6 py-4 text-center font-semibold text-white"
                >
                  Demander un nouveau lien →
                </Link>

              </div>
            ) : (
              <>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                  NOUVEAU MOT DE PASSE
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight">
                  Sécurisez votre compte
                </h1>

                <p className="mt-4 leading-7 text-slate-500">
                  Choisissez un nouveau mot de passe
                  pour votre compte AI Academy.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8"
                >

                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold"
                    >
                      Nouveau mot de passe
                    </label>

                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="8 caractères minimum"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="confirm-password"
                      className="text-sm font-semibold"
                    >
                      Confirmer le mot de passe
                    </label>

                    <input
                      id="confirm-password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={
                        confirmPassword
                      }
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Retapez votre mot de passe"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
                    />
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-500">
                    Utilisez au minimum 8 caractères et évitez
                    de réutiliser un mot de passe déjà utilisé ailleurs.
                  </div>

                  {errorMessage && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !password ||
                      !confirmPassword
                    }
                    className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {loading
                      ? "Modification..."
                      : "Modifier mon mot de passe →"}
                  </button>

                </form>
              </>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}