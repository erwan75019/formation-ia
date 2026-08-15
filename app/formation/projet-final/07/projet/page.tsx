"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FinalProjectTestPage() {
  const router = useRouter();
  const supabase = createClient();

  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ======================================================
  // TERMINER LA FORMATION
  // ======================================================

  async function completeFormation() {
    setSaving(true);
    setErrorMessage("");

    // ======================================================
    // UTILISATEUR
    // ======================================================

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);

      setErrorMessage(
        "Vous devez être connecté pour terminer la formation."
      );

      return;
    }

    // ======================================================
    // DATE EXACTE DE VALIDATION
    // ======================================================

    const now = new Date().toISOString();

    // ======================================================
    // ENREGISTREMENT SUPABASE
    // ======================================================

    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,

          lesson_id: "final-07-project",

          completed: true,

          score: 100,

          completed_at: now,

          last_viewed_at: now,
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

    setSaving(false);

    // ======================================================
    // ERREUR
    // ======================================================

    if (error) {
      console.error(
        "Erreur validation formation :",
        error
      );

      setErrorMessage(
        "La formation n'a pas pu être validée."
      );

      return;
    }

    // ======================================================
    // SUCCÈS
    // ======================================================

    setCompleted(true);
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au dashboard
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Test final
          </span>
        </div>

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="mt-16 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 12 · VALIDATION FINALE
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Terminer la formation
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Cette page temporaire permet de tester la validation
            complète de la formation et la génération du certificat.
          </p>
        </section>

        {/* ==================================================
            CARTE
        ================================================== */}

        <section className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">

          {/* HAUT */}

          <div className="bg-slate-950 p-8 text-white md:p-10">
            <div className="flex h-14 w-14 items-center justify-center bg-white text-lg font-bold text-slate-950">
              AI
            </div>

            <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-slate-500">
              AI ACADEMY
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Validation de fin de parcours
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              En validant cette étape, la formation sera considérée
              comme terminée et la date actuelle sera enregistrée comme
              date officielle de fin.
            </p>
          </div>

          {/* CONTENU */}

          <div className="p-8 md:p-10">

            {!completed ? (
              <>
                <div className="rounded-2xl bg-slate-50 p-6">
                  <p className="font-bold">
                    Test de validation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Le bouton ci-dessous va enregistrer
                    <strong> final-07-project </strong>
                    comme terminé dans Supabase avec la date et
                    l&apos;heure actuelles.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mt-6 rounded-2xl bg-red-50 p-5 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  onClick={completeFormation}
                  disabled={saving}
                  className="mt-8 w-full rounded-2xl bg-slate-950 px-8 py-5 text-lg font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Validation en cours..."
                    : "Terminer la formation"}
                </button>
              </>
            ) : (
              /* ==================================================
                  FORMATION TERMINÉE
              ================================================== */

              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
                  ✓
                </div>

                <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-emerald-600">
                  FORMATION TERMINÉE
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Félicitations !
                </h2>

                <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
                  Votre progression a été enregistrée. Votre certificat
                  peut maintenant être généré avec votre date réelle de
                  fin de formation.
                </p>

                <button
                  onClick={() => router.push("/certificat")}
                  className="mt-8 rounded-2xl bg-slate-950 px-8 py-4 font-semibold text-white transition hover:scale-[1.02]"
                >
                  Voir mon certificat →
                </button>
              </div>
            )}

          </div>
        </section>

        {/* ==================================================
            INFO DEV
        ================================================== */}

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          <strong>Page temporaire de test :</strong> une fois le
          fonctionnement du certificat vérifié, remets ton vrai projet
          final à la place de cette page.
        </div>

      </div>
    </main>
  );
}