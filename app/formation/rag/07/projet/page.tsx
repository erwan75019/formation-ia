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
  "document",
  "chunks",
  "embeddings",
  "vector-db",
  "question",
  "question-embedding",
  "search",
  "context",
  "llm",
];

const availableSteps: Step[] = [
  {
    id: "search",
    title: "Recherche vectorielle",
    description:
      "Comparer la question aux chunks indexés.",
  },
  {
    id: "document",
    title: "Importer le document",
    description:
      "Récupérer le contenu qui servira de source.",
  },
  {
    id: "context",
    title: "Construire le contexte",
    description:
      "Assembler les meilleurs passages retrouvés.",
  },
  {
    id: "question",
    title: "Recevoir la question",
    description:
      "L’utilisateur pose une question sur ses documents.",
  },
  {
    id: "embeddings",
    title: "Créer les embeddings",
    description:
      "Transformer chaque chunk en vecteur.",
  },
  {
    id: "llm",
    title: "Interroger le LLM",
    description:
      "Envoyer la question avec le contexte récupéré.",
  },
  {
    id: "chunks",
    title: "Découper en chunks",
    description:
      "Créer plusieurs passages à partir du document.",
  },
  {
    id: "vector-db",
    title: "Stocker dans la base vectorielle",
    description:
      "Conserver texte, vecteurs et métadonnées.",
  },
  {
    id: "question-embedding",
    title: "Vectoriser la question",
    description:
      "Créer l’embedding de la question utilisateur.",
  },
];

const searchAnswers = [
  {
    text: "Récupérer les chunks les plus similaires à la question",
    correct: true,
  },
  {
    text: "Envoyer tous les documents de la base au navigateur",
    correct: false,
  },
  {
    text: "Supprimer les embeddings après chaque question",
    correct: false,
  },
  {
    text: "Choisir les chunks aléatoirement",
    correct: false,
  },
];

const generationAnswers = [
  {
    text: "Question + passages récupérés",
    correct: true,
  },
  {
    text: "Uniquement la clé API",
    correct: false,
  },
  {
    text: "Uniquement l’ID utilisateur",
    correct: false,
  },
  {
    text: "Tous les documents sans recherche",
    correct: false,
  },
];

export default function RagProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedFlow, setSelectedFlow] =
    useState<string[]>([]);

  const [selectedSearch, setSelectedSearch] =
    useState<number | null>(null);

  const [selectedGeneration, setSelectedGeneration] =
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
    setSelectedSearch(null);
    setSelectedGeneration(null);
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
        "Construisez d’abord tout le pipeline RAG."
      );

      return;
    }

    if (
      selectedSearch === null ||
      selectedGeneration === null
    ) {
      setErrorMessage(
        "Répondez également aux questions sur la recherche et la génération."
      );

      return;
    }

    const flowCorrect =
      selectedFlow.every(
        (item, index) =>
          item === correctFlow[index]
      );

    const searchCorrect =
      searchAnswers[selectedSearch]
        .correct;

    const generationCorrect =
      generationAnswers[selectedGeneration]
        .correct;

    setValidated(true);

    if (
      !flowCorrect ||
      !searchCorrect ||
      !generationCorrect
    ) {
      setPassed(false);
      return;
    }

    setPassed(true);
    setSaving(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
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
              "rag-07-project",
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
      console.error(error);

      setPassed(false);

      setErrorMessage(
        "Le projet est correct, mais votre progression n’a pas pu être enregistrée."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between">
          <Link
            href="/formation/rag/07"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet RAG
          </span>
        </div>

        <section className="mt-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 11 · PROJET FINAL
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">
            Construisez un assistant documentaire RAG
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Reconstruisez toute la chaîne permettant à une IA
            de répondre à partir d’un document.
          </p>
        </section>

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Assistant capable de répondre à partir d’un règlement
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            L’utilisateur importe un document puis pose une question.
            Votre application doit retrouver les passages pertinents
            avant de demander au modèle de répondre.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            ÉTAPE 01
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Construisez le pipeline
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

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
                          addStep(step.id)
                        }
                        className={`w-full rounded-2xl border p-5 text-left transition ${
                          selected
                            ? "cursor-not-allowed bg-slate-100 opacity-60"
                            : "border-slate-200 hover:border-slate-950"
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

            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  VOTRE PIPELINE
                </p>
              </div>

              <div className="min-h-[700px] bg-slate-950 p-6">
                {selectedFlow.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Commencez par le document...
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
                          <div key={id}>
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
                                  {step.description}
                                </p>
                              </div>

                              {!validated && (
                                <button
                                  onClick={() =>
                                    removeStep(id)
                                  }
                                  className="text-slate-500"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            {index <
                              selectedFlow.length -
                                1 && (
                              <div className="h-7 pl-8 text-slate-600">
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

        <QuestionBlock
          title="Que doit faire la recherche vectorielle ?"
          answers={searchAnswers}
          selected={selectedSearch}
          validated={validated}
          onSelect={setSelectedSearch}
        />

        <QuestionBlock
          title="Que doit recevoir le LLM pour générer une réponse RAG ?"
          answers={generationAnswers}
          selected={selectedGeneration}
          validated={validated}
          onSelect={setSelectedGeneration}
        />

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
                ? "✓ Pipeline RAG validé"
                : "✕ Le pipeline doit encore être corrigé"}
            </h2>

            <p className="mt-3 leading-7">
              {passed
                ? "Vous avez correctement relié ingestion, embeddings, recherche sémantique, contexte et génération."
                : "Vérifiez l’ordre du pipeline ainsi que le rôle de la recherche et du contexte."}
            </p>
          </section>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {!validated && (
            <button
              onClick={validateProject}
              disabled={
                selectedFlow.length !==
                  correctFlow.length ||
                selectedSearch === null ||
                selectedGeneration === null ||
                saving
              }
              className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              {saving
                ? "Enregistrement..."
                : "Valider mon pipeline"}
            </button>
          )}

          {validated &&
            !passed && (
              <button
                onClick={resetProject}
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

        <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            PIPELINE FINAL
          </p>

          <pre className="mt-7 overflow-x-auto rounded-2xl bg-slate-900 p-6 text-sm leading-7 text-slate-300">
            <code>{`DOCUMENT
   ↓
CHUNKS
   ↓
EMBEDDINGS
   ↓
VECTOR DATABASE

UTILISATEUR
   ↓
QUESTION
   ↓
EMBEDDING QUESTION
   ↓
RECHERCHE VECTORIELLE
   ↓
TOP CHUNKS
   ↓
CONTEXTE
   ↓
LLM
   ↓
RÉPONSE`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}

function QuestionBlock({
  title,
  answers,
  selected,
  validated,
  onSelect,
}: {
  title: string;
  answers: {
    text: string;
    correct: boolean;
  }[];
  selected: number | null;
  validated: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <div className="mt-6 space-y-3">
        {answers.map(
          (answer, index) => {
            const isSelected =
              selected === index;

            const correct =
              validated &&
              answer.correct;

            const wrong =
              validated &&
              isSelected &&
              !answer.correct;

            return (
              <button
                key={answer.text}
                disabled={validated}
                onClick={() =>
                  onSelect(index)
                }
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left ${
                  correct
                    ? "border-emerald-400 bg-emerald-50"
                    : wrong
                    ? "border-red-400 bg-red-50"
                    : isSelected
                    ? "border-slate-950 bg-slate-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
                  {String.fromCharCode(
                    65 + index
                  )}
                </div>

                <span className="text-sm">
                  {answer.text}
                </span>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}