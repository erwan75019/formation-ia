"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Question = {
  type: "mcq" | "code";
  question: string;
  code?: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

type Exercise = {
  lessonId: string;
  title: string;
  questions: Question[];
};

const exercises: Record<string, Exercise> = {
  "01": {
    lessonId: "supabase-01-database",
    title: "Comprendre une base de données",
    questions: [
      {
        type: "mcq",
        question:
          "Dans une base de données, que représente généralement une ligne ?",
        answers: [
          "Le nom de la base entière",
          "Une propriété comme le prix",
          "Un enregistrement précis",
          "Une règle de sécurité",
        ],
        correctAnswer: 2,
        explanation:
          "Une ligne représente généralement un élément précis, par exemple un projet ou une commande.",
      },
      {
        type: "mcq",
        question:
          "Quelle colonne sert généralement à identifier une ligne de manière unique ?",
        answers: [
          "id",
          "description",
          "status",
          "name",
        ],
        correctAnswer: 0,
        explanation:
          "La colonne id sert généralement d’identifiant unique pour chaque ligne.",
      },
      {
        type: "mcq",
        question:
          "Quel exemple représente correctement une colonne ?",
        answers: [
          "Une table entière appelée projects",
          "Une propriété appelée statut",
          "L’ensemble de la base",
          "Un utilisateur connecté",
        ],
        correctAnswer: 1,
        explanation:
          "Une colonne représente une propriété commune aux lignes, comme statut, nom ou prix.",
      },
    ],
  },

  "02": {
    lessonId: "supabase-02-tables",
    title: "Créer des tables et des colonnes",
    questions: [
      {
        type: "mcq",
        question:
          "Quel type est adapté à une valeur vraie ou fausse ?",
        answers: [
          "text",
          "boolean",
          "uuid",
          "timestamp",
        ],
        correctAnswer: 1,
        explanation:
          "Un booléen stocke une valeur true ou false.",
      },
      {
        type: "mcq",
        question:
          "Quel type est adapté à un nom de projet comme « Assistant IA » ?",
        answers: [
          "integer",
          "boolean",
          "text",
          "timestamp",
        ],
        correctAnswer: 2,
        explanation:
          "Un nom est une chaîne de caractères, donc un type texte convient.",
      },
      {
        type: "mcq",
        question:
          "À quoi sert le type UUID dans une application ?",
        answers: [
          "À stocker uniquement des dates",
          "À représenter des identifiants uniques",
          "À stocker du texte long",
          "À remplacer les tables",
        ],
        correctAnswer: 1,
        explanation:
          "UUID est couramment utilisé pour créer des identifiants uniques.",
      },
    ],
  },

  "03": {
    lessonId: "supabase-03-crud",
    title: "CRUD : créer, lire, modifier et supprimer",
    questions: [
      {
        type: "mcq",
        question:
          "Que signifie la lettre R dans CRUD ?",
        answers: [
          "Remove",
          "Read",
          "Request",
          "Replace",
        ],
        correctAnswer: 1,
        explanation:
          "CRUD signifie Create, Read, Update, Delete.",
      },
      {
        type: "code",
        question:
          "Que fait principalement ce code ?",
        code: `const { data } = await supabase
  .from("projects")
  .select("id, name");`,
        answers: [
          "Il supprime tous les projets",
          "Il crée un nouvel utilisateur",
          "Il lit les colonnes id et name de projects",
          "Il modifie le nom des projets",
        ],
        correctAnswer: 2,
        explanation:
          "select() sert à lire des données dans la table indiquée.",
      },
      {
        type: "code",
        question:
          "Que fait ce filtre ?",
        code: `.eq("id", projectId)`,
        answers: [
          "Il cible les lignes dont id correspond à projectId",
          "Il trie les lignes",
          "Il crée une nouvelle colonne",
          "Il active RLS",
        ],
        correctAnswer: 0,
        explanation:
          "eq() applique une condition d’égalité sur la colonne indiquée.",
      },
    ],
  },

  "04": {
    lessonId: "supabase-04-relations",
    title: "Relations entre les données",
    questions: [
      {
        type: "mcq",
        question:
          "À quoi sert une clé étrangère ?",
        answers: [
          "À relier une ligne à une ligne d’une autre table",
          "À chiffrer toute la base",
          "À créer une session",
          "À remplacer un identifiant",
        ],
        correctAnswer: 0,
        explanation:
          "Une clé étrangère permet de créer un lien entre deux tables.",
      },
      {
        type: "mcq",
        question:
          "Si plusieurs projets appartiennent au même utilisateur, quelle information peuvent-ils partager ?",
        answers: [
          "Le même project_id",
          "Le même user_id",
          "Le même nom obligatoire",
          "Le même mot de passe",
        ],
        correctAnswer: 1,
        explanation:
          "Chaque projet peut avoir son propre id mais partager le même user_id.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi utilise-t-on des relations entre tables ?",
        answers: [
          "Pour éviter de dupliquer inutilement des données",
          "Pour supprimer toutes les colonnes",
          "Pour empêcher l’authentification",
          "Pour remplacer les API",
        ],
        correctAnswer: 0,
        explanation:
          "Les relations permettent d’éviter de recopier les mêmes informations dans plusieurs endroits.",
      },
    ],
  },

  "05": {
    lessonId: "supabase-05-auth",
    title: "Authentification et utilisateurs",
    questions: [
      {
        type: "mcq",
        question:
          "Pourquoi associer user_id à une ressource ?",
        answers: [
          "Pour connaître son propriétaire",
          "Pour augmenter automatiquement son prix",
          "Pour remplacer son id",
          "Pour créer un token JSON",
        ],
        correctAnswer: 0,
        explanation:
          "user_id permet de savoir à quel utilisateur appartient une ressource.",
      },
      {
        type: "code",
        question:
          "Que récupère ce code ?",
        code: `const {
  data: { user },
} = await supabase.auth.getUser();`,
        answers: [
          "Toutes les lignes d’une table",
          "L’utilisateur authentifié",
          "La clé API",
          "Tous les projets",
        ],
        correctAnswer: 1,
        explanation:
          "getUser() permet de récupérer l’utilisateur actuellement authentifié.",
      },
      {
        type: "code",
        question:
          "Pourquoi insérer `user_id: user.id` dans un projet ?",
        answers: [
          "Pour lier le projet au compte connecté",
          "Pour rendre le projet public",
          "Pour supprimer RLS",
          "Pour transformer le projet en utilisateur",
        ],
        correctAnswer: 0,
        explanation:
          "Le projet garde ainsi la référence vers son propriétaire.",
      },
    ],
  },

  "06": {
    lessonId: "supabase-06-rls",
    title: "Sécuriser avec RLS",
    questions: [
      {
        type: "mcq",
        question:
          "Que signifie RLS ?",
        answers: [
          "Remote Login System",
          "Row Level Security",
          "Request Logic Service",
          "Relational Login Storage",
        ],
        correctAnswer: 1,
        explanation:
          "RLS signifie Row Level Security, c’est-à-dire sécurité au niveau des lignes.",
      },
      {
        type: "mcq",
        question:
          "Quel problème RLS aide-t-il à éviter ?",
        answers: [
          "Un utilisateur qui accède aux données d’un autre",
          "Un utilisateur qui ferme son navigateur",
          "Une erreur de syntaxe Python",
          "Un mauvais nom de variable",
        ],
        correctAnswer: 0,
        explanation:
          "RLS permet de contrôler l’accès aux lignes directement dans la base.",
      },
      {
        type: "code",
        question:
          "Que vérifie cette condition ?",
        code: `(select auth.uid()) = user_id`,
        answers: [
          "Que le projet possède un nom",
          "Que le prix est correct",
          "Que l’utilisateur connecté correspond au propriétaire de la ligne",
          "Que la table est vide",
        ],
        correctAnswer: 2,
        explanation:
          "auth.uid() représente l’identifiant de l’utilisateur authentifié et il est comparé ici au user_id de la ligne.",
      },
    ],
  },
};

export default function SupabaseExercisePage() {
  const params = useParams<{ lesson: string }>();
  const router = useRouter();
  const supabase = createClient();

  const lessonSlug = params.lesson;
  const exercise = exercises[lessonSlug];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [validated, setValidated] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  if (!exercise) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold">
            Exercice introuvable
          </h1>

          <p className="mt-3 text-slate-500">
            Cette leçon utilise peut-être un mini-projet séparé.
          </p>

          <Link
            href="/formation/supabase"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>

      </main>
    );
  }

  const question =
    exercise.questions[currentQuestion];

  const isCorrect =
    selectedAnswer ===
    question.correctAnswer;

  function validateAnswer() {
    if (
      selectedAnswer === null ||
      validated
    ) {
      return;
    }

    if (
      selectedAnswer ===
      question.correctAnswer
    ) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );
    }

    setValidated(true);
  }

  async function nextQuestion() {
    if (
      currentQuestion <
      exercise.questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer(null);
      setValidated(false);
      setSaveError("");

      return;
    }

    const finalScore = Math.round(
      (score /
        exercise.questions.length) *
        100
    );

    if (finalScore >= 70) {
      setSaving(true);
      setSaveError("");

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

        setSaveError(
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
                exercise.lessonId,
              completed: true,
              score: finalScore,
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

        setSaveError(
          "Impossible d'enregistrer votre progression."
        );

        return;
      }
    }

    setFinished(true);
  }

  function restartExercise() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setValidated(false);
    setScore(0);
    setFinished(false);
    setSaveError("");
  }

  const finalScore = Math.round(
    (score /
      exercise.questions.length) *
      100
  );

  // ======================================================
  // RÉSULTAT
  // ======================================================

  if (finished) {
    const passed =
      finalScore >= 70;

    const lessonNumber =
      Number(lessonSlug);

    const nextLesson =
      lessonNumber < 6
        ? String(
            lessonNumber + 1
          ).padStart(2, "0")
        : "07";

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10">

        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl">

          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
              passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {passed ? "✓" : "↻"}
          </div>

          <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-slate-400">
            RÉSULTAT
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {passed
              ? "Leçon validée !"
              : "À retravailler"}
          </h1>

          <p className="mt-3 text-slate-500">
            {exercise.title}
          </p>

          <p className="mt-6 text-6xl font-bold">
            {finalScore}%
          </p>

          <p className="mt-4 text-slate-500">
            {score} bonne
            {score > 1 ? "s" : ""} réponse
            {score > 1 ? "s" : ""} sur{" "}
            {exercise.questions.length}.
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm leading-6 text-emerald-900">
              Félicitations, cette leçon est validée. Vous pouvez continuer la formation.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Vous devez obtenir au moins 70 %. Relisez la leçon puis recommencez.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={
                  restartExercise
                }
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                Recommencer
              </button>
            )}

            {passed && (
              <button
                onClick={() =>
                  router.push(
                    `/formation/supabase/${nextLesson}`
                  )
                }
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                {lessonSlug === "06"
                  ? "Passer au mini-projet →"
                  : "Leçon suivante →"}
              </button>
            )}

          </div>

        </section>

      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) /
      exercise.questions.length) *
    100;

  // ======================================================
  // EXERCICE
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        {/* TOP */}

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/supabase/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question{" "}
            {currentQuestion + 1} /{" "}
            {exercise.questions.length}
          </span>

        </div>

        {/* PROGRESSION */}

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        {/* QUESTION */}

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            BASES DE DONNÉES · LEÇON {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {exercise.title}
          </h1>

          <div className="mt-5">

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {question.type === "code"
                ? "Lecture de code"
                : "Compréhension"}
            </span>

          </div>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

          {/* CODE */}

          {question.code && (
            <div className="mt-7 overflow-hidden rounded-2xl bg-slate-950">

              <div className="border-b border-slate-800 px-5 py-3">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  CODE
                </p>

              </div>

              <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                <code>
                  {question.code}
                </code>
              </pre>

            </div>
          )}

          {/* RÉPONSES */}

          <div className="mt-8 space-y-4">

            {question.answers.map(
              (answer, index) => {
                const selected =
                  selectedAnswer ===
                  index;

                const correct =
                  validated &&
                  index ===
                    question.correctAnswer;

                const wrong =
                  validated &&
                  selected &&
                  index !==
                    question.correctAnswer;

                return (
                  <button
                    key={`${answer}-${index}`}
                    disabled={validated}
                    onClick={() =>
                      setSelectedAnswer(
                        index
                      )
                    }
                    className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
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

                    <pre className="whitespace-pre-wrap font-sans text-sm leading-6">
                      {answer}
                    </pre>

                  </button>
                );
              }
            )}

          </div>

          {/* FEEDBACK */}

          {validated && (
            <div
              className={`mt-8 rounded-2xl p-5 ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-red-50 text-red-900"
              }`}
            >

              <p className="font-bold">
                {isCorrect
                  ? "✓ Bonne réponse"
                  : "✕ Réponse incorrecte"}
              </p>

              <p className="mt-2 text-sm leading-6">
                {question.explanation}
              </p>

            </div>
          )}

          {saveError && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {saveError}
            </div>
          )}

          {/* ACTION */}

          <div className="mt-8 flex justify-end">

            {!validated ? (
              <button
                onClick={
                  validateAnswer
                }
                disabled={
                  selectedAnswer ===
                  null
                }
                className={`rounded-2xl px-7 py-4 font-semibold transition ${
                  selectedAnswer ===
                  null
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "bg-slate-950 text-white hover:scale-[1.02]"
                }`}
              >
                Vérifier
              </button>
            ) : (
              <button
                onClick={
                  nextQuestion
                }
                disabled={saving}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    exercise.questions.length -
                      1
                  ? "Voir mon résultat →"
                  : "Question suivante →"}
              </button>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}