"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FlowStep = {
  id: string;
  title: string;
  description: string;
};

const correctFlow = [
  "objective",
  "agent-decision",
  "tool-call",
  "backend-validation",
  "tool-execution",
  "observation",
  "new-decision",
];

const availableSteps: FlowStep[] = [
  {
    id: "tool-execution",
    title: "Exécuter l’outil",
    description:
      "Le backend appelle réellement la fonction ou le service autorisé.",
  },
  {
    id: "objective",
    title: "Recevoir l’objectif",
    description:
      "L’utilisateur demande à l’agent d’atteindre un résultat précis.",
  },
  {
    id: "observation",
    title: "Observer le résultat",
    description:
      "Le résultat de l’outil devient une nouvelle information pour l’agent.",
  },
  {
    id: "backend-validation",
    title: "Valider l’action",
    description:
      "Le backend contrôle l’outil demandé et les arguments fournis.",
  },
  {
    id: "agent-decision",
    title: "Décider de la prochaine action",
    description:
      "L’agent détermine s’il doit répondre ou utiliser un outil.",
  },
  {
    id: "new-decision",
    title: "Prendre une nouvelle décision",
    description:
      "Avec l’observation obtenue, l’agent réévalue la situation.",
  },
  {
    id: "tool-call",
    title: "Produire un tool call",
    description:
      "L’agent demande l’utilisation d’un outil avec des arguments structurés.",
  },
];

const permissionAnswers = [
  {
    text: "Donner à l’agent tous les outils disponibles",
    correct: false,
  },
  {
    text: "Donner uniquement les outils nécessaires à sa mission",
    correct: true,
  },
  {
    text: "Laisser le modèle créer ses propres permissions",
    correct: false,
  },
  {
    text: "Désactiver les contrôles backend",
    correct: false,
  },
];

const limitAnswers = [
  {
    text: "Aucune limite d’étapes",
    correct: false,
  },
  {
    text: "Une limite comme MAX_STEPS = 5",
    correct: true,
  },
  {
    text: "Une boucle infinie jusqu’à obtenir une réponse",
    correct: false,
  },
  {
    text: "Fermer le navigateur après chaque outil",
    correct: false,
  },
];

const toolAnswers = [
  {
    text: "searchApartments",
    correct: true,
  },
  {
    text: "deleteAllUsers",
    correct: false,
  },
  {
    text: "changeServerPassword",
    correct: false,
  },
  {
    text: "disableSecurity",
    correct: false,
  },
];

export default function AgentProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedFlow, setSelectedFlow] =
    useState<string[]>([]);

  const [selectedPermission, setSelectedPermission] =
    useState<number | null>(null);

  const [selectedLimit, setSelectedLimit] =
    useState<number | null>(null);

  const [selectedTool, setSelectedTool] =
    useState<number | null>(null);

  const [validated, setValidated] =
    useState(false);

  const [passed, setPassed] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  function addStep(id: string) {
    if (
      validated ||
      selectedFlow.includes(id)
    ) {
      return;
    }

    setSelectedFlow((previous) => [
      ...previous,
      id,
    ]);
  }

  function removeStep(id: string) {
    if (validated) {
      return;
    }

    setSelectedFlow((previous) =>
      previous.filter(
        (item) => item !== id
      )
    );
  }

  function resetProject() {
    setSelectedFlow([]);
    setSelectedPermission(null);
    setSelectedLimit(null);
    setSelectedTool(null);
    setValidated(false);
    setPassed(false);
    setErrorMessage("");
  }

  async function validateProject() {
    if (
      selectedFlow.length !==
      correctFlow.length
    ) {
      setErrorMessage(
        "Construisez d’abord toute la boucle agentique."
      );

      return;
    }

    if (
      selectedPermission === null ||
      selectedLimit === null ||
      selectedTool === null
    ) {
      setErrorMessage(
        "Répondez également aux questions sur les outils, permissions et limites."
      );

      return;
    }

    setErrorMessage("");

    const flowCorrect =
      selectedFlow.every(
        (step, index) =>
          step === correctFlow[index]
      );

    const permissionCorrect =
      permissionAnswers[selectedPermission]
        .correct;

    const limitCorrect =
      limitAnswers[selectedLimit]
        .correct;

    const toolCorrect =
      toolAnswers[selectedTool]
        .correct;

    setValidated(true);

    if (
      !flowCorrect ||
      !permissionCorrect ||
      !limitCorrect ||
      !toolCorrect
    ) {
      setPassed(false);
      return;
    }

    setPassed(true);
    setSaving(true);

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      setSaving(false);
      setPassed(false);

      setErrorMessage(
        "Vous devez être connecté pour enregistrer votre progression."
      );

      return;
    }

    const now =
      new Date().toISOString();

    const { error } =
      await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id:
              "agents-07-project",
            completed: true,
            score: 100,
            completed_at: now,
            last_viewed_at: now,
          },
          {
            onConflict:
              "user_id,lesson_id",
          }
        );

    setSaving(false);

    if (error) {
      console.error(
        "Erreur progression :",
        error
      );

      setPassed(false);

      setErrorMessage(
        "Le projet est correct, mais votre progression n’a pas pu être enregistrée."
      );

      return;
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/agents-ia/07"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet Agent IA
          </span>

        </div>

        {/* HEADER */}

        <section className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 10 · PROJET FINAL
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">
            Construisez la logique d’un véritable agent IA
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Votre agent doit recevoir un objectif,
            décider s’il a besoin d’un outil, produire
            un tool call, laisser le backend contrôler
            l’action, observer le résultat puis prendre
            une nouvelle décision.
          </p>

        </section>

        {/* MISSION */}

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Agent immobilier intelligent
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            L’utilisateur demande : « Trouve-moi un appartement
            avec deux pièces minimum, un balcon et un budget de
            2 000 €. » L’agent ne possède pas lui-même la liste
            des appartements : il doit utiliser un outil autorisé.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <DarkStep text="Objectif" />
            <Arrow />
            <DarkStep text="Agent" />
            <Arrow />
            <DarkStep text="Tool call" />
            <Arrow />
            <DarkStep text="Backend" />
            <Arrow />
            <DarkStep text="Observation" />

          </div>

        </section>

        {/* COMPÉTENCES */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <ConceptCard
            code="GO"
            title="Objectif"
            description="Définir le résultat attendu."
          />

          <ConceptCard
            code="AI"
            title="Décision"
            description="Choisir la prochaine action."
          />

          <ConceptCard
            code="TL"
            title="Outil"
            description="Accéder à une capacité externe."
          />

          <ConceptCard
            code="OB"
            title="Observation"
            description="Analyser le résultat de l’outil."
          />

          <ConceptCard
            code="LP"
            title="Boucle"
            description="Décider à nouveau si nécessaire."
          />

        </section>

        {/* ======================================================
            ÉTAPE 01 — FLUX
        ====================================================== */}

        <section className="mt-8">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 01
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Reconstruisez la boucle agentique
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Cliquez sur les blocs dans l’ordre logique.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* BLOCS DISPONIBLES */}

            <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                BLOCS DISPONIBLES
              </p>

              <div className="mt-6 space-y-3">

                {availableSteps.map(
                  (step) => {
                    const selected =
                      selectedFlow.includes(
                        step.id
                      );

                    return (
                      <button
                        key={step.id}
                        disabled={
                          selected ||
                          validated
                        }
                        onClick={() =>
                          addStep(
                            step.id
                          )
                        }
                        className={`w-full rounded-2xl border p-5 text-left transition ${
                          selected
                            ? "cursor-not-allowed border-slate-100 bg-slate-100 opacity-60"
                            : "border-slate-200 hover:border-slate-950 hover:bg-slate-50"
                        }`}
                      >

                        <p className="font-semibold">
                          + {step.title}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {step.description}
                        </p>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* FLUX */}

            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 p-7">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  VOTRE AGENT
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Boucle d’exécution
                </h3>

              </div>

              <div className="min-h-[650px] bg-slate-950 p-6">

                {selectedFlow.length ===
                0 ? (
                  <p className="text-sm text-slate-500">
                    Ajoutez la première étape...
                  </p>
                ) : (
                  <div>

                    {selectedFlow.map(
                      (id, index) => {
                        const step =
                          availableSteps.find(
                            (item) =>
                              item.id === id
                          );

                        if (!step) {
                          return null;
                        }

                        return (
                          <div
                            key={id}
                          >

                            <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <div className="flex-1">

                                <p className="font-semibold text-white">
                                  {step.title}
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                  {
                                    step.description
                                  }
                                </p>

                              </div>

                              {!validated && (
                                <button
                                  onClick={() =>
                                    removeStep(
                                      id
                                    )
                                  }
                                  className="rounded-lg px-2 py-1 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                                >
                                  ✕
                                </button>
                              )}

                            </div>

                            {index <
                              selectedFlow.length -
                                1 && (
                              <div className="flex h-7 items-center pl-8 text-slate-600">
                                ↓
                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            ÉTAPE 02 — TOOL
        ====================================================== */}

        <section className="mt-8 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 02 · OUTILS
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Quel outil doit être disponible pour cette mission ?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            L’agent doit chercher des appartements.
            Il ne doit recevoir que les capacités nécessaires.
          </p>

          <div className="mt-6 space-y-3">

            {toolAnswers.map(
              (answer, index) => {
                const selected =
                  selectedTool === index;

                const correct =
                  validated &&
                  answer.correct;

                const wrong =
                  validated &&
                  selected &&
                  !answer.correct;

                return (
                  <ChoiceButton
                    key={answer.text}
                    text={answer.text}
                    index={index}
                    selected={selected}
                    correct={correct}
                    wrong={wrong}
                    disabled={validated}
                    code
                    onClick={() =>
                      setSelectedTool(
                        index
                      )
                    }
                  />
                );
              }
            )}

          </div>

        </section>

        {/* ======================================================
            ÉTAPE 03 — PERMISSIONS
        ====================================================== */}

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 03 · PERMISSIONS
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Quelle stratégie de permissions est la plus sûre ?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Un agent ne doit pas recevoir plus de
            pouvoir que nécessaire.
          </p>

          <div className="mt-6 space-y-3">

            {permissionAnswers.map(
              (answer, index) => {
                const selected =
                  selectedPermission ===
                  index;

                const correct =
                  validated &&
                  answer.correct;

                const wrong =
                  validated &&
                  selected &&
                  !answer.correct;

                return (
                  <ChoiceButton
                    key={answer.text}
                    text={answer.text}
                    index={index}
                    selected={selected}
                    correct={correct}
                    wrong={wrong}
                    disabled={validated}
                    onClick={() =>
                      setSelectedPermission(
                        index
                      )
                    }
                  />
                );
              }
            )}

          </div>

        </section>

        {/* ======================================================
            ÉTAPE 04 — LIMITES
        ====================================================== */}

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 04 · BOUCLE
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Comment empêcher une boucle infinie ?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            L’agent peut décider plusieurs fois d’utiliser
            un outil. Le système doit imposer une limite.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950">

            <div className="border-b border-slate-800 px-5 py-3">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                EXEMPLE
              </p>

            </div>

            <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
              <code>{`const MAX_STEPS = 5;

for (
  let step = 0;
  step < MAX_STEPS;
  step++
) {
  // décision
  // outil éventuel
  // observation
}`}</code>
            </pre>

          </div>

          <div className="mt-6 space-y-3">

            {limitAnswers.map(
              (answer, index) => {
                const selected =
                  selectedLimit ===
                  index;

                const correct =
                  validated &&
                  answer.correct;

                const wrong =
                  validated &&
                  selected &&
                  !answer.correct;

                return (
                  <ChoiceButton
                    key={answer.text}
                    text={answer.text}
                    index={index}
                    selected={selected}
                    correct={correct}
                    wrong={wrong}
                    disabled={validated}
                    onClick={() =>
                      setSelectedLimit(
                        index
                      )
                    }
                  />
                );
              }
            )}

          </div>

        </section>

        {/* ======================================================
            FEEDBACK
        ====================================================== */}

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
                ? "✓ Agent correctement conçu"
                : "✕ Il reste des éléments à corriger"}
            </h2>

            {passed ? (
              <div className="mt-3 space-y-3 leading-7">

                <p>
                  Votre agent reçoit un objectif,
                  choisit une action, demande un
                  outil, laisse le backend valider
                  et exécuter cette action puis
                  utilise l’observation pour décider
                  de la suite.
                </p>

                <p>
                  Vous avez également limité ses
                  permissions et le nombre maximal
                  d’étapes.
                </p>

              </div>
            ) : (
              <div className="mt-3 space-y-2 leading-7">

                <p>
                  Vérifiez l’ordre de la boucle et
                  les protections du système.
                </p>

                <p>
                  Le modèle ne doit pas exécuter
                  directement une action sensible :
                  le backend doit toujours contrôler
                  l’outil et ses arguments.
                </p>

              </div>
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
                selectedFlow.length !==
                  correctFlow.length ||
                selectedPermission ===
                  null ||
                selectedLimit === null ||
                selectedTool === null ||
                saving
              }
              className={`rounded-2xl px-7 py-4 font-semibold transition ${
                selectedFlow.length !==
                  correctFlow.length ||
                selectedPermission ===
                  null ||
                selectedLimit === null ||
                selectedTool === null ||
                saving
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-slate-950 text-white hover:scale-[1.02]"
              }`}
            >
              {saving
                ? "Enregistrement..."
                : "Valider mon agent"}
            </button>
          )}

          {validated &&
            !passed && (
              <button
                onClick={
                  resetProject
                }
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

        {/* ======================================================
            SYNTHÈSE
        ====================================================== */}

        <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            ARCHITECTURE D’UN AGENT
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Vous comprenez maintenant la mécanique d’un agent IA
          </h2>

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <pre className="overflow-x-auto text-sm leading-7 text-slate-300">
              <code>{`Objectif utilisateur
        │
        ▼
      Agent
        │
        ▼
     Décision
     /      \\
    /        \\
Réponse     Tool call
 finale        │
               ▼
         Backend valide
               │
               ▼
             Outil
               │
               ▼
          Observation
               │
               ▼
             Agent
               │
               └── nouvelle décision

Protections :
- outils autorisés
- validation des arguments
- authentification
- autorisations
- MAX_STEPS
- gestion des erreurs`}</code>
            </pre>

          </div>

        </section>

        {/* ======================================================
            NEXT
        ====================================================== */}

        <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MODULE SUIVANT
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Module 11 — RAG & documents
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Votre agent sait désormais utiliser des outils.
            Nous allons maintenant lui apprendre à rechercher
            des informations pertinentes dans vos propres
            documents avant de répondre.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <LightStep text="Documents" />
            <ArrowLight />
            <LightStep text="Découpage" />
            <ArrowLight />
            <LightStep text="Embeddings" />
            <ArrowLight />
            <LightStep text="Recherche" />
            <ArrowLight />
            <LightStep text="LLM" />

          </div>

        </section>

      </div>

    </main>
  );
}

// ======================================================
// CHOICE
// ======================================================

function ChoiceButton({
  text,
  index,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
  code = false,
}: {
  text: string;
  index: number;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  disabled: boolean;
  onClick: () => void;
  code?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
        correct
          ? "border-emerald-400 bg-emerald-50"
          : wrong
          ? "border-red-400 bg-red-50"
          : selected
          ? "border-slate-950 bg-slate-50"
          : "border-slate-200 hover:border-slate-400"
      }`}
    >

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
          correct
            ? "border-emerald-500 bg-emerald-500 text-white"
            : wrong
            ? "border-red-500 bg-red-500 text-white"
            : selected
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-300"
        }`}
      >
        {String.fromCharCode(
          65 + index
        )}
      </div>

      {code ? (
        <code className="text-sm">
          {text}
        </code>
      ) : (
        <span className="text-sm">
          {text}
        </span>
      )}

    </button>
  );
}

// ======================================================
// COMPONENTS
// ======================================================

function ConceptCard({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        {code}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function DarkStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-800 px-4 py-3 text-sm">
      {text}
    </span>
  );
}

function LightStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
      {text}
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}

function ArrowLight() {
  return (
    <span className="text-slate-400">
      →
    </span>
  );
}