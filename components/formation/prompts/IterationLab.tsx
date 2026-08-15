"use client";

import {
  useState,
} from "react";

type Evaluation = {
  globalScore: number;

  verdict: string;

  scores: {
    factualAccuracy: number;
    usefulInformation: number;
    targetFit: number;
    ctaQuality: number;
    clarity: number;
  };

  strengths: string[];
  problems: string[];
};

type RunResult = {
  output: string;
  evaluation: Evaluation;
};

type Phase =
  | "brief"
  | "baseline"
  | "diagnostic"
  | "improve"
  | "compare";

const BASELINE_PROMPT =
  "Écris un message pour trouver des bénévoles pour notre événement.";

const diagnosticOptions = [
  {
    id: "context",
    label:
      "Le prompt donne trop peu de contexte.",
  },
  {
    id: "audience",
    label:
      "La cible n’est pas précisée.",
  },
  {
    id: "information",
    label:
      "Les informations importantes du brief ne sont pas explicitement demandées.",
  },
  {
    id: "cta",
    label:
      "Le prompt ne demande aucun appel à l’action précis.",
  },
  {
    id: "format",
    label:
      "Le format et le canal du message ne sont pas définis.",
  },
  {
    id: "role",
    label:
      "Le principal problème est qu’aucun rôle prestigieux n’est attribué à l’IA.",
  },
];

const usefulDiagnosisIds = [
  "context",
  "audience",
  "information",
  "cta",
  "format",
];

export default function IterationLab() {
  const [
    phase,
    setPhase,
  ] =
    useState<Phase>(
      "brief"
    );

  const [
    baselineResult,
    setBaselineResult,
  ] =
    useState<RunResult | null>(
      null
    );

  const [
    improvedResult,
    setImprovedResult,
  ] =
    useState<RunResult | null>(
      null
    );

  const [
    selectedProblems,
    setSelectedProblems,
  ] =
    useState<string[]>(
      []
    );

  const [
    diagnosisValidated,
    setDiagnosisValidated,
  ] =
    useState(false);

  const [
    improvedPrompt,
    setImprovedPrompt,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function runPrompt(
    prompt: string
  ) {
    const response =
      await fetch(
        "/api/training/iteration-lab",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              prompt,
            }),
        }
      );

    const data =
      await response.json();

    if (
      !response.ok
    ) {
      throw new Error(
        data.error ||
          "Impossible d'exécuter le prompt."
      );
    }

    return data as RunResult;
  }

  async function generateBaseline() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data =
        await runPrompt(
          BASELINE_PROMPT
        );

      setBaselineResult(
        data
      );

      setPhase(
        "baseline"
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof
          Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleProblem(
    id: string
  ) {
    setDiagnosisValidated(
      false
    );

    setSelectedProblems(
      (current) =>
        current.includes(
          id
        )
          ? current.filter(
              (item) =>
                item !== id
            )
          : [
              ...current,
              id,
            ]
    );
  }

  function validateDiagnosis() {
    if (
      selectedProblems.length ===
      0
    ) {
      return;
    }

    setDiagnosisValidated(
      true
    );
  }

  const usefulFound =
    selectedProblems.filter(
      (id) =>
        usefulDiagnosisIds.includes(
          id
        )
    ).length;

  const wrongSelected =
    selectedProblems.includes(
      "role"
    );

  const diagnosisScore =
    Math.max(
      0,
      Math.round(
        (usefulFound /
          usefulDiagnosisIds.length) *
          100 -
          (wrongSelected
            ? 15
            : 0)
      )
    );

  async function runImprovedPrompt() {
    const cleanPrompt =
      improvedPrompt.trim();

    if (
      !cleanPrompt ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data =
        await runPrompt(
          cleanPrompt
        );

      setImprovedResult(
        data
      );

      setPhase(
        "compare"
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof
          Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPhase("brief");

    setBaselineResult(
      null
    );

    setImprovedResult(
      null
    );

    setSelectedProblems(
      []
    );

    setDiagnosisValidated(
      false
    );

    setImprovedPrompt(
      ""
    );

    setError("");
  }

  const scoreDifference =
    baselineResult &&
    improvedResult
      ? improvedResult
          .evaluation
          .globalScore -
        baselineResult
          .evaluation
          .globalScore
      : 0;

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-slate-950 px-6 py-7 text-white md:px-8">

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
                Prompt Clinic
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                Avant / Après
              </span>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Ne recommencez pas.
              Diagnostiquez.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Vous allez observer
              un résultat moyen,
              comprendre pourquoi
              il est moyen,
              modifier le prompt
              puis mesurer
              l’amélioration réelle.
            </p>

          </div>

          <button
            type="button"
            onClick={
              reset
            }
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
          >
            Recommencer
          </button>

        </div>

        <div className="mt-7 grid grid-cols-5 gap-2">

          <PhaseIndicator
            number="01"
            label="Brief"
            active={
              phase ===
              "brief"
            }
            completed={
              phase !==
              "brief"
            }
          />

          <PhaseIndicator
            number="02"
            label="Avant"
            active={
              phase ===
              "baseline"
            }
            completed={[
              "diagnostic",
              "improve",
              "compare",
            ].includes(
              phase
            )}
          />

          <PhaseIndicator
            number="03"
            label="Diagnostic"
            active={
              phase ===
              "diagnostic"
            }
            completed={[
              "improve",
              "compare",
            ].includes(
              phase
            )}
          />

          <PhaseIndicator
            number="04"
            label="Correction"
            active={
              phase ===
              "improve"
            }
            completed={
              phase ===
              "compare"
            }
          />

          <PhaseIndicator
            number="05"
            label="Comparaison"
            active={
              phase ===
              "compare"
            }
            completed={
              false
            }
          />

        </div>

      </div>

      {/* ======================================================
          BRIEF
      ====================================================== */}

      {phase ===
        "brief" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            MISSION
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Une association veut recruter
            des bénévoles
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Vous disposez d’un brief complet,
            mais quelqu’un a utilisé
            un prompt beaucoup trop vague.
            Vous allez voir ce que cela produit.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">

            <BriefCard
              title="Événement"
              value="Course Solidaire Horizon"
            />

            <BriefCard
              title="Date"
              value="Samedi 12 septembre"
            />

            <BriefCard
              title="Horaires"
              value="8h00 à 14h00"
            />

            <BriefCard
              title="Lieu"
              value="Parc des Rives"
            />

            <BriefCard
              title="Besoin"
              value="25 bénévoles"
            />

            <BriefCard
              title="Public"
              value="Étudiants, habitants du quartier et personnes souhaitant participer à une action solidaire."
            />

            <BriefCard
              title="Missions"
              value="Accueil, ravitaillement, orientation et aide à l’installation."
            />

            <BriefCard
              title="Avantage"
              value="Déjeuner offert."
            />

          </div>

          <div className="mt-7 rounded-[24px] border border-red-200 bg-red-50 p-6">

            <p className="text-xs font-bold tracking-[0.16em] text-red-700">
              PROMPT ACTUEL
            </p>

            <p className="mt-4 font-mono text-sm leading-7 text-red-950">
              {BASELINE_PROMPT}
            </p>

          </div>

          {error && (
            <ErrorMessage
              message={
                error
              }
            />
          )}

          <button
            type="button"
            onClick={
              generateBaseline
            }
            disabled={
              loading
            }
            className="mt-7 rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-30"
          >
            {loading
              ? "Génération..."
              : "Voir ce que ce prompt produit →"}
          </button>

        </div>
      )}

      {/* ======================================================
          BASELINE
      ====================================================== */}

      {phase ===
        "baseline" &&
        baselineResult && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            VERSION 1 · AVANT
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Le texte existe.
            Mais est-il vraiment bon ?
          </h3>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_300px]">

            <div className="rounded-[24px] bg-slate-950 p-7 text-white">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                SORTIE GÉNÉRÉE
              </p>

              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-200">
                {
                  baselineResult.output
                }
              </p>

            </div>

            <ScoreCard
              evaluation={
                baselineResult.evaluation
              }
            />

          </div>

          <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-6">

            <p className="text-xs font-bold tracking-[0.15em] text-amber-700">
              VOTRE TRAVAIL
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-amber-950">
              Ne modifiez pas encore le prompt.
              Commencez par expliquer
              pourquoi le résultat pourrait
              être meilleur.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setPhase(
                "diagnostic"
              )
            }
            className="mt-6 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white"
          >
            Diagnostiquer le problème →
          </button>

        </div>
      )}

      {/* ======================================================
          DIAGNOSTIC
      ====================================================== */}

      {phase ===
        "diagnostic" &&
        baselineResult && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            ÉTAPE 3 · DIAGNOSTIC
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Qu’est-ce qui limite
            réellement ce prompt ?
          </h3>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            Sélectionnez les problèmes
            que vous corrigeriez avant
            de demander une nouvelle version.
          </p>

          <div className="mt-7 space-y-3">

            {diagnosticOptions.map(
              (option) => {
                const selected =
                  selectedProblems.includes(
                    option.id
                  );

                const useful =
                  usefulDiagnosisIds.includes(
                    option.id
                  );

                const showCorrect =
                  diagnosisValidated &&
                  selected &&
                  useful;

                const showWrong =
                  diagnosisValidated &&
                  selected &&
                  !useful;

                return (
                  <button
                    key={
                      option.id
                    }
                    type="button"
                    onClick={() =>
                      toggleProblem(
                        option.id
                      )
                    }
                    className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                      showCorrect
                        ? "border-emerald-300 bg-emerald-50"
                        : showWrong
                        ? "border-red-300 bg-red-50"
                        : selected
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                          ? "bg-red-500 text-white"
                          : selected
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {showCorrect
                        ? "✓"
                        : showWrong
                        ? "×"
                        : selected
                        ? "✓"
                        : "+"}
                    </div>

                    <p className="pt-1 text-sm font-medium leading-6 text-slate-700">
                      {
                        option.label
                      }
                    </p>

                  </button>
                );
              }
            )}

          </div>

          {!diagnosisValidated && (
            <button
              type="button"
              onClick={
                validateDiagnosis
              }
              disabled={
                selectedProblems.length ===
                0
              }
              className="mt-6 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-30"
            >
              Valider mon diagnostic
            </button>
          )}

          {diagnosisValidated && (
            <div className="mt-7">

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">

                <div className="flex flex-wrap items-center justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                      QUALITÉ DU DIAGNOSTIC
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {
                        diagnosisScore
                      }
                      %
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      diagnosisScore >=
                      80
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {diagnosisScore >=
                    80
                      ? "Bon diagnostic"
                      : "Encore améliorable"}
                  </span>

                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
                  Le problème principal n’est
                  pas l’absence d’un rôle spectaculaire.
                  Le prompt ne dit presque rien
                  sur l’objectif, la cible,
                  les informations à utiliser
                  ou le résultat attendu.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setPhase(
                    "improve"
                  )
                }
                className="mt-6 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white"
              >
                Corriger le prompt →
              </button>

            </div>
          )}

        </div>
      )}

      {/* ======================================================
          IMPROVE
      ====================================================== */}

      {phase ===
        "improve" &&
        baselineResult && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            ÉTAPE 4 · CORRECTION
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Réécrivez le prompt
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Cette fois, ne demandez pas
            simplement à l’IA de « faire mieux ».
            Corrigez les causes précises
            du mauvais résultat.
          </p>

          <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">

            <aside className="h-fit rounded-[24px] border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                POINTS À CONSIDÉRER
              </p>

              <div className="mt-5 space-y-4">

                <Reminder>
                  Objectif
                </Reminder>

                <Reminder>
                  Public
                </Reminder>

                <Reminder>
                  Informations importantes
                </Reminder>

                <Reminder>
                  Format
                </Reminder>

                <Reminder>
                  Appel à l’action
                </Reminder>

                <Reminder>
                  Interdiction d’inventer
                </Reminder>

              </div>

            </aside>

            <div>

              <textarea
                value={
                  improvedPrompt
                }
                onChange={(
                  event
                ) =>
                  setImprovedPrompt(
                    event.target
                      .value
                  )
                }
                rows={17}
                placeholder={`Écrivez votre nouveau prompt ici...

Exemple de structure :

OBJECTIF
...

PUBLIC
...

INFORMATIONS À UTILISER
...

CONTRAINTES
...

FORMAT
...`}
                className="w-full resize-y rounded-[24px] border border-slate-200 bg-slate-950 p-6 font-mono text-sm leading-7 text-slate-200 outline-none focus:border-slate-500"
              />

              <div className="mt-3 flex justify-between gap-4 text-xs text-slate-400">

                <span>
                  Votre version.
                  Pas de réponse modèle imposée.
                </span>

                <span>
                  {
                    improvedPrompt.length
                  }{" "}
                  caractères
                </span>

              </div>

            </div>

          </div>

          {error && (
            <ErrorMessage
              message={
                error
              }
            />
          )}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "diagnostic"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold"
            >
              ← Diagnostic
            </button>

            <button
              type="button"
              disabled={
                !improvedPrompt.trim() ||
                loading
              }
              onClick={
                runImprovedPrompt
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              {loading
                ? "Test en cours..."
                : "Tester ma nouvelle version →"}
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          COMPARISON
      ====================================================== */}

      {phase ===
        "compare" &&
        baselineResult &&
        improvedResult && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            ÉTAPE 5 · AVANT / APRÈS
          </p>

          <div className="flex flex-wrap items-end justify-between gap-5">

            <div>

              <h3 className="mt-3 text-3xl font-bold">
                Mesurez ce qui a réellement changé
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Le but d’une itération
                n’est pas de changer
                le texte au hasard.
                Elle doit améliorer
                des critères observables.
              </p>

            </div>

            <div
              className={`rounded-2xl px-5 py-3 ${
                scoreDifference >
                0
                  ? "bg-emerald-100 text-emerald-800"
                  : scoreDifference <
                    0
                  ? "bg-red-100 text-red-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >

              <p className="text-xs font-bold">
                ÉVOLUTION
              </p>

              <p className="mt-1 text-2xl font-bold">
                {scoreDifference >
                0
                  ? "+"
                  : ""}
                {
                  scoreDifference
                }{" "}
                pts
              </p>

            </div>

          </div>

          {/* SCORES */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <ComparisonCard
              label="AVANT"
              prompt={
                BASELINE_PROMPT
              }
              result={
                baselineResult.output
              }
              evaluation={
                baselineResult.evaluation
              }
            />

            <ComparisonCard
              label="APRÈS"
              prompt={
                improvedPrompt
              }
              result={
                improvedResult.output
              }
              evaluation={
                improvedResult.evaluation
              }
              improved
            />

          </div>

          {/* METRICS */}

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-6">

            <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
              COMPARAISON PAR CRITÈRE
            </p>

            <div className="mt-6 space-y-6">

              <ComparisonMetric
                label="Exactitude factuelle"
                before={
                  baselineResult
                    .evaluation
                    .scores
                    .factualAccuracy
                }
                after={
                  improvedResult
                    .evaluation
                    .scores
                    .factualAccuracy
                }
              />

              <ComparisonMetric
                label="Informations utiles"
                before={
                  baselineResult
                    .evaluation
                    .scores
                    .usefulInformation
                }
                after={
                  improvedResult
                    .evaluation
                    .scores
                    .usefulInformation
                }
              />

              <ComparisonMetric
                label="Adaptation à la cible"
                before={
                  baselineResult
                    .evaluation
                    .scores
                    .targetFit
                }
                after={
                  improvedResult
                    .evaluation
                    .scores
                    .targetFit
                }
              />

              <ComparisonMetric
                label="Appel à l’action"
                before={
                  baselineResult
                    .evaluation
                    .scores
                    .ctaQuality
                }
                after={
                  improvedResult
                    .evaluation
                    .scores
                    .ctaQuality
                }
              />

              <ComparisonMetric
                label="Clarté"
                before={
                  baselineResult
                    .evaluation
                    .scores
                    .clarity
                }
                after={
                  improvedResult
                    .evaluation
                    .scores
                    .clarity
                }
              />

            </div>

          </div>

          {/* LEARNING */}

          <div className="mt-6 rounded-[26px] bg-slate-950 p-7 text-white">

            <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
              COMPÉTENCE ACQUISE
            </p>

            <h4 className="mt-3 text-2xl font-bold">
              Diagnostiquer avant de corriger
            </h4>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Vous venez de faire
              ce qu’un bon utilisateur
              de l’IA fait en pratique :
              observer une sortie,
              identifier ses défauts,
              modifier les instructions
              responsables puis comparer
              objectivement la nouvelle version.
            </p>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "improve"
                )
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              ← Améliorer encore
            </button>

            <button
              type="button"
              onClick={
                runImprovedPrompt
              }
              disabled={
                loading
              }
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold"
            >
              Retester
            </button>

          </div>

        </div>
      )}

    </section>
  );
}

function PhaseIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: string;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        active
          ? "border-white bg-white text-slate-950"
          : completed
          ? "border-emerald-900 bg-emerald-950/40 text-emerald-300"
          : "border-slate-800 bg-slate-900 text-slate-500"
      }`}
    >

      <p className="text-[10px] font-bold">
        {completed
          ? "✓"
          : number}
      </p>

      <p className="mt-1 truncate text-xs font-semibold">
        {label}
      </p>

    </div>
  );
}

function BriefCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
        {value}
      </p>

    </div>
  );
}

function Reminder({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold shadow-sm">
        ✓
      </div>

      <span className="text-sm text-slate-600">
        {children}
      </span>

    </div>
  );
}

function ScoreCard({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  return (
    <div className="h-fit rounded-[24px] border border-slate-200 bg-slate-50 p-6">

      <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
        QUALITÉ
      </p>

      <p className="mt-4 text-5xl font-bold">
        {
          evaluation.globalScore
        }
      </p>

      <p className="text-sm text-slate-400">
        / 100
      </p>

      <p className="mt-5 font-bold">
        {
          evaluation.verdict
        }
      </p>

      <div className="mt-5 space-y-3">

        {evaluation.problems.map(
          (
            problem,
            index
          ) => (
            <p
              key={`${problem}-${index}`}
              className="text-xs leading-5 text-slate-500"
            >
              → {problem}
            </p>
          )
        )}

      </div>

    </div>
  );
}

function ComparisonCard({
  label,
  prompt,
  result,
  evaluation,
  improved = false,
}: {
  label: string;
  prompt: string;
  result: string;
  evaluation: Evaluation;
  improved?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[26px] border ${
        improved
          ? "border-emerald-200"
          : "border-slate-200"
      } bg-white`}
    >

      <div
        className={`flex items-center justify-between px-6 py-4 ${
          improved
            ? "bg-emerald-50"
            : "bg-slate-50"
        }`}
      >

        <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
          {label}
        </p>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            improved
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white text-slate-700"
          }`}
        >
          {
            evaluation.globalScore
          }
          /100
        </span>

      </div>

      <div className="p-6">

        <p className="text-xs font-bold text-slate-400">
          PROMPT
        </p>

        <p className="mt-3 whitespace-pre-line font-mono text-xs leading-6 text-slate-600">
          {prompt}
        </p>

        <div className="my-6 border-t border-slate-100" />

        <p className="text-xs font-bold text-slate-400">
          SORTIE
        </p>

        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
          {result}
        </p>

      </div>

    </div>
  );
}

function ComparisonMetric({
  label,
  before,
  after,
}: {
  label: string;
  before: number;
  after: number;
}) {
  const difference =
    after - before;

  return (
    <div>

      <div className="flex flex-wrap items-center justify-between gap-4">

        <p className="text-sm font-semibold text-slate-700">
          {label}
        </p>

        <div className="flex items-center gap-3 text-xs">

          <span className="text-slate-400">
            {before}%
          </span>

          <span>
            →
          </span>

          <span className="font-bold">
            {after}%
          </span>

          <span
            className={`font-bold ${
              difference >
              0
                ? "text-emerald-600"
                : difference <
                  0
                ? "text-red-600"
                : "text-slate-400"
            }`}
          >
            {difference >
            0
              ? "+"
              : ""}
            {
              difference
            }
          </span>

        </div>

      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-slate-400"
            style={{
              width: `${before}%`,
            }}
          />

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-slate-950"
            style={{
              width: `${after}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  );
}