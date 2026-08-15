"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = {
  id: string;
  title: string;
  description: string;
};

const correctFlow = [
  "frontend-input",
  "backend-request",
  "auth-check",
  "ai-call",
  "database-save",
  "backend-response",
  "frontend-display",
];

const availableSteps: Step[] = [
  {
    id: "database-save",
    title: "Enregistrer le résultat",
    description:
      "Le backend enregistre le résultat dans la base de données.",
  },
  {
    id: "frontend-input",
    title: "Saisie utilisateur",
    description:
      "L’utilisateur écrit sa demande dans l’interface.",
  },
  {
    id: "ai-call",
    title: "Appeler l’API IA",
    description:
      "Le backend utilise sa clé privée pour contacter le service IA.",
  },
  {
    id: "frontend-display",
    title: "Afficher le résultat",
    description:
      "Le frontend affiche la réponse à l’utilisateur.",
  },
  {
    id: "auth-check",
    title: "Vérifier l’utilisateur",
    description:
      "Le backend vérifie qu’un utilisateur authentifié peut effectuer l’action.",
  },
  {
    id: "backend-response",
    title: "Renvoyer la réponse",
    description:
      "Le backend renvoie au frontend uniquement les données nécessaires.",
  },
  {
    id: "backend-request",
    title: "Envoyer au backend",
    description:
      "Le frontend transmet la demande à une route serveur.",
  },
];

const secretAnswers = [
  {
    text: "Dans le composant React du frontend",
    correct: false,
  },
  {
    text: "Dans une variable d’environnement côté serveur",
    correct: true,
  },
  {
    text: "Dans l’URL de la requête",
    correct: false,
  },
  {
    text: "Dans le texte du bouton Générer",
    correct: false,
  },
];

const databaseAnswers = [
  {
    text: `user_id: user.id`,
    correct: true,
  },
  {
    text: `user_id: "public"`,
    correct: false,
  },
  {
    text: `user_id: project.id`,
    correct: false,
  },
  {
    text: `user_id: apiKey`,
    correct: false,
  },
];

export default function SaasProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedFlow, setSelectedFlow] =
    useState<string[]>([]);

  const [selectedSecret, setSelectedSecret] =
    useState<number | null>(null);

  const [selectedDatabase, setSelectedDatabase] =
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
    setSelectedSecret(null);
    setSelectedDatabase(null);
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
        "Construisez d’abord tout le trajet de la demande."
      );

      return;
    }

    if (
      selectedSecret === null ||
      selectedDatabase === null
    ) {
      setErrorMessage(
        "Répondez aussi aux questions de sécurité et de base de données."
      );

      return;
    }

    setErrorMessage("");

    const flowCorrect =
      selectedFlow.every(
        (item, index) =>
          item === correctFlow[index]
      );

    const secretCorrect =
      secretAnswers[selectedSecret].correct;

    const databaseCorrect =
      databaseAnswers[selectedDatabase]
        .correct;

    setValidated(true);

    if (
      !flowCorrect ||
      !secretCorrect ||
      !databaseCorrect
    ) {
      setPassed(false);
      return;
    }

    setPassed(true);
    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

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
              "saas-07-project",
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
            href="/formation/saas-ia/07"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet SaaS IA
          </span>

        </div>

        {/* HEADER */}

        <section className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 09 · PROJET FINAL
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">
            Assemblez l&apos;architecture complète d&apos;un SaaS IA
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Vous devez reconstruire le trajet complet d&apos;une
            fonctionnalité IA : depuis l&apos;action de
            l&apos;utilisateur jusqu&apos;à l&apos;affichage du
            résultat, en passant par le backend, l&apos;authentification,
            l&apos;API IA et la base de données.
          </p>

        </section>

        {/* MISSION */}

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Fonctionnalité : générateur IA privé
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Un utilisateur connecté écrit une demande dans son dashboard.
            Le SaaS doit envoyer cette demande à une intelligence
            artificielle, enregistrer le résultat sous son compte puis
            l&apos;afficher dans l&apos;interface.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <FlowStep text="Utilisateur" />
            <Arrow />
            <FlowStep text="Frontend" />
            <Arrow />
            <FlowStep text="Backend" />
            <Arrow />
            <FlowStep text="IA + DB" />
            <Arrow />
            <FlowStep text="Frontend" />

          </div>

        </section>

        {/* COMPÉTENCES */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <ConceptCard
            code="UI"
            title="Frontend"
            description="Récupérer et afficher les données."
          />

          <ConceptCard
            code="SV"
            title="Backend"
            description="Traiter les opérations sensibles."
          />

          <ConceptCard
            code="AU"
            title="Auth"
            description="Identifier l’utilisateur."
          />

          <ConceptCard
            code="AI"
            title="API IA"
            description="Générer une réponse."
          />

          <ConceptCard
            code="DB"
            title="Database"
            description="Conserver le résultat."
          />

        </section>

        {/* ==================================================
            ÉTAPE 1 — ARCHITECTURE
        ================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              ÉTAPE 01
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Reconstruisez le trajet complet
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-slate-500">
              Cliquez sur les blocs dans l&apos;ordre logique
              d&apos;exécution.
            </p>

          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* BLOCS */}

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

            {/* FLOW UTILISATEUR */}

            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 p-7">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  VOTRE ARCHITECTURE
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Flux de la fonctionnalité
                </h3>

              </div>

              <div className="min-h-[650px] bg-slate-950 p-6">

                {selectedFlow.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Ajoutez la première étape...
                  </p>
                ) : (
                  <div className="space-y-3">

                    {selectedFlow.map(
                      (id, index) => {
                        const step =
                          availableSteps.find(
                            (item) =>
                              item.id ===
                              id
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

        {/* ==================================================
            ÉTAPE 2 — SECRET
        ================================================== */}

        <section className="mt-8 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 02 · SÉCURITÉ
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Où placez-vous la clé de l&apos;API IA ?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            L&apos;API utilisée par votre SaaS nécessite une
            clé secrète privée.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950">

            <div className="border-b border-slate-800 px-5 py-3">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                BACKEND
              </p>

            </div>

            <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
              <code>{`const apiKey =
  process.env.AI_API_KEY;

// Puis le backend utilise
// cette clé pour appeler
// le service externe.`}</code>
            </pre>

          </div>

          <div className="mt-6 space-y-3">

            {secretAnswers.map(
              (answer, index) => {
                const selected =
                  selectedSecret === index;

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
                      setSelectedSecret(
                        index
                      )
                    }
                  />
                );
              }
            )}

          </div>

        </section>

        {/* ==================================================
            ÉTAPE 3 — DATABASE
        ================================================== */}

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 03 · DONNÉES
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Comment associer le résultat au bon utilisateur ?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            La table generations contient :
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">
              id
            </code>
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">
              user_id
            </code>
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">
              prompt
            </code>
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">
              result
            </code>
            .
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950">

            <div className="border-b border-slate-800 px-5 py-3">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                INSERT
              </p>

            </div>

            <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
              <code>{`await supabase
  .from("generations")
  .insert({
    ???,
    prompt,
    result
  });`}</code>
            </pre>

          </div>

          <div className="mt-6 space-y-3">

            {databaseAnswers.map(
              (answer, index) => {
                const selected =
                  selectedDatabase ===
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
                    code
                    onClick={() =>
                      setSelectedDatabase(
                        index
                      )
                    }
                  />
                );
              }
            )}

          </div>

        </section>

        {/* ==================================================
            FEEDBACK
        ================================================== */}

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
                ? "✓ Architecture SaaS validée"
                : "✕ Il reste des éléments à corriger"}
            </h2>

            {passed ? (
              <div className="mt-3 space-y-3 leading-7">

                <p>
                  Vous avez correctement reconstruit le trajet
                  d&apos;une fonctionnalité SaaS IA complète.
                </p>

                <p>
                  Le frontend récupère la demande, le backend
                  contrôle l&apos;utilisateur, utilise un secret
                  serveur pour appeler l&apos;IA, associe le résultat
                  au bon compte puis renvoie les données à
                  l&apos;interface.
                </p>

              </div>
            ) : (
              <div className="mt-3 space-y-2 leading-7">

                <p>
                  Vérifiez les trois dimensions du projet :
                  l&apos;ordre du flux, la localisation du secret et
                  l&apos;association des données à l&apos;utilisateur.
                </p>

                <p>
                  Une opération sensible doit passer par le backend,
                  et une ressource privée doit pouvoir être reliée à
                  son propriétaire.
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
                selectedSecret === null ||
                selectedDatabase === null ||
                saving
              }
              className={`rounded-2xl px-7 py-4 font-semibold transition ${
                selectedFlow.length !==
                  correctFlow.length ||
                selectedSecret === null ||
                selectedDatabase === null ||
                saving
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-slate-950 text-white hover:scale-[1.02]"
              }`}
            >
              {saving
                ? "Enregistrement..."
                : "Valider mon SaaS"}
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

        {/* ==================================================
            SYNTHÈSE
        ================================================== */}

        <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            ARCHITECTURE COMPLÈTE
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Vous savez maintenant comment les briques se connectent
          </h2>

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <pre className="overflow-x-auto text-sm leading-7 text-slate-300">
              <code>{`Utilisateur
    │
    ▼
Frontend
    │ POST /api/generate
    ▼
Backend
    │
    ├── Vérifie Auth
    │
    ├── Lit AI_API_KEY
    │
    ├── Appelle API IA
    │
    └── Enregistre :
          user_id
          prompt
          result
    │
    ▼
Database
    │
    ▼
Backend
    │
    ▼
Frontend
    │
    ▼
Résultat utilisateur`}</code>
            </pre>

          </div>

        </section>

        {/* ==================================================
            AGENTS IA
        ================================================== */}

        <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MODULE SUIVANT
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Module 10 — Agents IA
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Votre SaaS sait maintenant envoyer une demande à une IA.
            Dans le prochain module, l&apos;IA ne se contentera plus
            de produire une réponse : elle pourra décider d&apos;utiliser
            des outils et d&apos;enchaîner plusieurs actions.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <LightStep text="Objectif" />
            <ArrowLight />
            <LightStep text="Agent IA" />
            <ArrowLight />
            <LightStep text="Choix d’un outil" />
            <ArrowLight />
            <LightStep text="Action" />
            <ArrowLight />
            <LightStep text="Résultat" />

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

function FlowStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
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