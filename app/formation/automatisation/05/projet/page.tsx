"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const correctWorkflow = [
  "Formulaire",
  "Récupérer les données",
  "Analyser avec l’IA",
  "Classer la demande",
  "Préparer la réponse",
];

const availableSteps = [
  "Analyser avec l’IA",
  "Préparer la réponse",
  "Formulaire",
  "Classer la demande",
  "Récupérer les données",
];

export default function AutomationProjectPage() {
  const router = useRouter();

  const [selectedSteps, setSelectedSteps] = useState<string[]>(
    []
  );

  const [validated, setValidated] = useState(false);
  const [passed, setPassed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function addStep(step: string) {
    if (
      validated ||
      selectedSteps.includes(step)
    ) {
      return;
    }

    setSelectedSteps((previous) => [
      ...previous,
      step,
    ]);
  }

  function removeStep(step: string) {
    if (validated) {
      return;
    }

    setSelectedSteps((previous) =>
      previous.filter(
        (item) => item !== step
      )
    );
  }

  function resetWorkflow() {
    setSelectedSteps([]);
    setValidated(false);
    setPassed(false);
    setErrorMessage("");
  }

  function validateProject() {
    if (
      selectedSteps.length !==
      correctWorkflow.length
    ) {
      setErrorMessage(
        "Placez les 5 étapes du workflow avant de valider."
      );

      return;
    }

    setErrorMessage("");

    const isCorrect =
      selectedSteps.every(
        (step, index) =>
          step ===
          correctWorkflow[index]
      );

    setValidated(true);

    if (!isCorrect) {
      setPassed(false);
      return;
    }

    setPassed(true);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-5xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/automatisation/05"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet
          </span>

        </div>

        {/* HEADER */}

        <div className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 05 · PROJET FINAL
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Construisez votre premier workflow IA
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            Votre mission est de reconstruire dans le bon ordre
            la logique d&apos;un système capable de traiter
            automatiquement une demande commerciale.
          </p>

        </div>

        {/* MISSION */}

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Qualification automatique d&apos;un prospect
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Une personne remplit un formulaire avec son nom,
            son email et son besoin. Votre système doit récupérer
            ces informations, demander à une IA d&apos;analyser
            la demande, la classer puis préparer une réponse adaptée.
          </p>

        </section>

        {/* CONSTRUCTION */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* ÉTAPES DISPONIBLES */}

          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              ÉTAPES DISPONIBLES
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Ajoutez les étapes
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cliquez sur les étapes dans l&apos;ordre qui vous
              semble correct.
            </p>

            <div className="mt-6 space-y-3">

              {availableSteps.map(
                (step) => {
                  const alreadySelected =
                    selectedSteps.includes(
                      step
                    );

                  return (
                    <button
                      key={step}
                      onClick={() =>
                        addStep(step)
                      }
                      disabled={
                        alreadySelected ||
                        validated
                      }
                      className={`w-full rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                        alreadySelected
                          ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                          : "border-slate-200 hover:border-slate-950 hover:bg-slate-50"
                      }`}
                    >
                      + {step}
                    </button>
                  );
                }
              )}

            </div>

          </section>

          {/* WORKFLOW CONSTRUIT */}

          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              VOTRE WORKFLOW
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Ordre des opérations
            </h2>

            {selectedSteps.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                Aucune étape ajoutée pour le moment.
              </div>
            ) : (
              <div className="mt-6 space-y-3">

                {selectedSteps.map(
                  (step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
                        {index + 1}
                      </div>

                      <p className="flex-1 text-sm font-semibold">
                        {step}
                      </p>

                      {!validated && (
                        <button
                          onClick={() =>
                            removeStep(
                              step
                            )
                          }
                          className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        >
                          ✕
                        </button>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>

        {/* RÉSULTAT */}

        {validated && (
          <section
            className={`mt-6 rounded-[26px] p-7 ${
              passed
                ? "bg-emerald-50 text-emerald-900"
                : "bg-red-50 text-red-900"
            }`}
          >

            <h2 className="text-xl font-bold">
              {passed
                ? "✓ Workflow correct"
                : "✕ L’ordre n’est pas encore correct"}
            </h2>

            {passed ? (
              <p className="mt-3 leading-7">
                Bravo. Vous avez correctement identifié la logique
                complète du workflow : déclencheur → récupération
                des données → IA → classification → action.
                Cet exercice reste consultatif : aucune progression
                officielle n&apos;est enregistrée avant la phase de
                validation sécurisée des projets.
              </p>
            ) : (
              <p className="mt-3 leading-7">
                Regardez à nouveau la logique du processus. Le workflow
                doit commencer par l&apos;événement déclencheur, puis
                récupérer les informations avant de les envoyer à
                l&apos;IA.
              </p>
            )}

          </section>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-8 flex flex-wrap gap-3">

          {!validated && (
            <button
              onClick={
                validateProject
              }
              disabled={
                selectedSteps.length !==
                  correctWorkflow.length
              }
              className={`rounded-2xl px-7 py-4 font-semibold transition ${
                selectedSteps.length !==
                  correctWorkflow.length
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-slate-950 text-white hover:scale-[1.02]"
              }`}
            >
              Vérifier mon workflow
            </button>
          )}

          {validated &&
            !passed && (
              <button
                onClick={resetWorkflow}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white"
              >
                Recommencer
              </button>
            )}

          {validated &&
            passed && (
              <button
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white"
              >
                Terminer le module →
              </button>
            )}

        </div>

        {/* EXPLICATION */}

        <section className="mt-10 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            POURQUOI CE PROJET ?
          </p>

          <h2 className="mt-3 text-xl font-bold">
            Vous commencez à penser comme un concepteur de système
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Jusqu&apos;ici, vous appreniez principalement à utiliser
            des outils. Maintenant, vous commencez à réfléchir à la
            circulation des données entre plusieurs composants.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">

            <p className="text-sm font-semibold">
              Cette logique va revenir dans les prochains modules :
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">

              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                Python
              </span>

              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                JSON
              </span>

              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                API
              </span>

              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                Supabase
              </span>

              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                SaaS
              </span>

              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                Agents IA
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
