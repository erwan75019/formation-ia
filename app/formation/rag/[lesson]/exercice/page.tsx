"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Question = {
  type: "mcq" | "code" | "architecture";
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
    lessonId: "rag-01-intro",
    title: "Comprendre le RAG",
    questions: [
      {
        type: "mcq",
        question:
          "Quel est le principe central du RAG ?",
        answers: [
          "Réentraîner le modèle pour chaque question",
          "Rechercher des informations pertinentes avant de générer la réponse",
          "Envoyer uniquement le nom du document au modèle",
          "Remplacer complètement le LLM",
        ],
        correctAnswer: 1,
        explanation:
          "Le RAG récupère d’abord du contexte pertinent puis le fournit au modèle.",
      },
      {
        type: "architecture",
        question:
          "Quel ordre représente le mieux un pipeline RAG simple ?",
        answers: [
          "Question → recherche → contexte → LLM → réponse",
          "LLM → question → document",
          "Document → réponse → question",
          "Question → CSS → database",
        ],
        correctAnswer: 0,
        explanation:
          "La question déclenche une recherche. Les passages trouvés deviennent ensuite le contexte du modèle.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi utiliser le RAG avec des documents privés ?",
        answers: [
          "Parce que le modèle connaît automatiquement tous les documents privés",
          "Parce qu’on peut fournir au modèle les passages utiles au moment de la question",
          "Parce que le RAG supprime les documents",
          "Parce que le RAG remplace l’authentification",
        ],
        correctAnswer: 1,
        explanation:
          "Le RAG permet d’utiliser des données externes ou privées comme contexte au moment de la génération.",
      },
    ],
  },

  "02": {
    lessonId: "rag-02-chunks",
    title: "Découper les documents",
    questions: [
      {
        type: "mcq",
        question:
          "Qu’est-ce qu’un chunk ?",
        answers: [
          "Une clé API",
          "Une portion d’un document",
          "Un utilisateur",
          "Un modèle IA",
        ],
        correctAnswer: 1,
        explanation:
          "Un chunk est un morceau du contenu d’un document.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi ne pas toujours envoyer un document entier pour chaque recherche ?",
        answers: [
          "Parce que des passages plus ciblés facilitent la récupération d’information pertinente",
          "Parce qu’un LLM ne peut jamais lire de texte",
          "Parce que les documents doivent être supprimés",
          "Parce que JSON ne supporte pas le texte",
        ],
        correctAnswer: 0,
        explanation:
          "Découper le document permet de rechercher des passages précis et pertinents.",
      },
      {
        type: "mcq",
        question:
          "À quoi peut servir un overlap entre deux chunks ?",
        answers: [
          "À conserver du contexte lorsqu’une idée traverse la frontière entre deux chunks",
          "À chiffrer le document",
          "À créer une session",
          "À supprimer les embeddings",
        ],
        correctAnswer: 0,
        explanation:
          "Un léger chevauchement peut éviter de couper brutalement une information importante.",
      },
    ],
  },

  "03": {
    lessonId: "rag-03-embeddings",
    title: "Comprendre les embeddings",
    questions: [
      {
        type: "mcq",
        question:
          "Que produit un modèle d’embedding à partir d’un texte ?",
        answers: [
          "Une image",
          "Un vecteur numérique",
          "Une table SQL",
          "Une session",
        ],
        correctAnswer: 1,
        explanation:
          "Un embedding représente le texte sous forme d’un vecteur numérique.",
      },
      {
        type: "code",
        question:
          "Que représente cette liste ?",
        code: `[0.18, -0.42, 0.73, ...]`,
        answers: [
          "Un exemple simplifié de vecteur d’embedding",
          "Une clé secrète",
          "Un document PDF",
          "Une policy RLS",
        ],
        correctAnswer: 0,
        explanation:
          "Un embedding est généralement constitué de nombreuses valeurs numériques.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi les embeddings sont-ils utiles pour le RAG ?",
        answers: [
          "Ils permettent de comparer la proximité sémantique entre des textes",
          "Ils remplacent le texte original",
          "Ils authentifient l’utilisateur",
          "Ils servent uniquement au design",
        ],
        correctAnswer: 0,
        explanation:
          "Les embeddings permettent de comparer des textes selon leur sens.",
      },
    ],
  },

  "04": {
    lessonId: "rag-04-semantic-search",
    title: "Recherche sémantique",
    questions: [
      {
        type: "mcq",
        question:
          "Que cherche principalement une recherche sémantique ?",
        answers: [
          "Uniquement les mêmes mots exacts",
          "Les passages proches en sens de la question",
          "Uniquement le premier paragraphe",
          "Uniquement les titres",
        ],
        correctAnswer: 1,
        explanation:
          "La recherche sémantique compare le sens des textes grâce à leurs représentations vectorielles.",
      },
      {
        type: "architecture",
        question:
          "Quel flux est correct ?",
        answers: [
          "Question → embedding → comparaison vectorielle → top chunks",
          "Embedding → navigateur → CSS",
          "Question → suppression des documents",
          "Top chunks → aucune question",
        ],
        correctAnswer: 0,
        explanation:
          "La question reçoit un embedding qui est comparé aux embeddings des chunks.",
      },
      {
        type: "mcq",
        question:
          "Que signifie récupérer le Top K ?",
        answers: [
          "Récupérer quelques résultats parmi les plus proches",
          "Supprimer K utilisateurs",
          "Créer K modèles",
          "Envoyer toute la base au modèle",
        ],
        correctAnswer: 0,
        explanation:
          "Top K correspond aux K résultats considérés comme les plus pertinents.",
      },
    ],
  },

  "05": {
    lessonId: "rag-05-vector-db",
    title: "Base de données vectorielle",
    questions: [
      {
        type: "mcq",
        question:
          "Que peut-on stocker avec un chunk dans une base vectorielle ?",
        answers: [
          "Son texte, son embedding et ses métadonnées",
          "Uniquement sa couleur",
          "Uniquement un mot de passe",
          "Uniquement une image",
        ],
        correctAnswer: 0,
        explanation:
          "Le texte, le vecteur et les métadonnées sont généralement conservés ensemble.",
      },
      {
        type: "mcq",
        question:
          "Quel est le rôle principal d’une recherche vectorielle ?",
        answers: [
          "Retrouver les vecteurs les plus proches du vecteur de la question",
          "Modifier le frontend",
          "Créer automatiquement un utilisateur",
          "Exécuter du CSS",
        ],
        correctAnswer: 0,
        explanation:
          "La recherche vectorielle récupère les passages dont les embeddings sont les plus proches.",
      },
      {
        type: "code",
        question:
          "Pourquoi conserver `source` et `page` ?",
        code: `{
  content,
  embedding,
  source,
  page
}`,
        answers: [
          "Pour savoir d’où provient le passage",
          "Pour générer une clé API",
          "Pour remplacer l’embedding",
          "Pour créer une session",
        ],
        correctAnswer: 0,
        explanation:
          "Les métadonnées permettent notamment d’identifier la source du passage retrouvé.",
      },
    ],
  },

  "06": {
    lessonId: "rag-06-pipeline",
    title: "Construire le pipeline RAG",
    questions: [
      {
        type: "architecture",
        question:
          "Quel pipeline correspond à une requête RAG ?",
        answers: [
          "Question → embedding → recherche → chunks → contexte → LLM",
          "LLM → CSS → question",
          "Question → suppression base",
          "Document → authentification → CSS",
        ],
        correctAnswer: 0,
        explanation:
          "La question est vectorisée, comparée aux documents, puis les passages récupérés sont envoyés au modèle.",
      },
      {
        type: "code",
        question:
          "Que construit principalement ce code ?",
        code: `const context =
  chunks
    .map((chunk) => chunk.content)
    .join("\\n\\n");`,
        answers: [
          "Un contexte contenant le texte des chunks récupérés",
          "Une nouvelle base de données",
          "Une clé API",
          "Un nouvel utilisateur",
        ],
        correctAnswer: 0,
        explanation:
          "Le code rassemble le contenu des chunks afin de former le contexte envoyé au modèle.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi demander au modèle de répondre uniquement à partir du contexte ?",
        answers: [
          "Pour mieux encadrer la réponse par rapport aux documents récupérés",
          "Pour empêcher toute réponse",
          "Pour supprimer la recherche",
          "Pour transformer les chunks en utilisateurs",
        ],
        correctAnswer: 0,
        explanation:
          "Cette instruction aide à centrer la réponse sur les informations réellement récupérées.",
      },
    ],
  },
};

export default function RagExercisePage() {
  const params =
    useParams<{ lesson: string }>();

  const router = useRouter();
  const supabase = createClient();

  const lessonSlug =
    params.lesson;

  const exercise =
    exercises[lessonSlug];

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] =
    useState<number | null>(
      null
    );

  const [
    validated,
    setValidated,
  ] = useState(false);

  const [score, setScore] =
    useState(0);

  const [
    finished,
    setFinished,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState("");

  if (!exercise) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            Exercice introuvable
          </h1>

          <Link
            href="/formation/rag"
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

    const finalScore =
      Math.round(
        (score /
          exercise.questions.length) *
          100
      );

    if (finalScore >= 70) {
      setSaving(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
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
        console.error(error);

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

  const finalScore =
    Math.round(
      (score /
        exercise.questions.length) *
        100
    );

  if (finished) {
    const passed =
      finalScore >= 70;

    const nextLesson =
      Number(lessonSlug) < 6
        ? String(
            Number(lessonSlug) + 1
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

          <h1 className="mt-8 text-4xl font-bold">
            {passed
              ? "Leçon validée !"
              : "À retravailler"}
          </h1>

          <p className="mt-6 text-6xl font-bold">
            {finalScore}%
          </p>

          <p className="mt-4 text-slate-500">
            {score} /{" "}
            {exercise.questions.length} bonnes réponses
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

          <div className="mt-8">
            {passed ? (
              <button
                onClick={() =>
                  router.push(
                    `/formation/rag/${nextLesson}`
                  )
                }
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white"
              >
                {lessonSlug === "06"
                  ? "Passer au mini-projet →"
                  : "Leçon suivante →"}
              </button>
            ) : (
              <button
                onClick={restartExercise}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white"
              >
                Recommencer
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

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between">
          <Link
            href={`/formation/rag/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} /{" "}
            {exercise.questions.length}
          </span>
        </div>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            RAG · LEÇON {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {exercise.title}
          </h1>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

          {question.code && (
            <div className="mt-7 overflow-hidden rounded-2xl bg-slate-950">
              <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                <code>
                  {question.code}
                </code>
              </pre>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {question.answers.map(
              (answer, index) => {
                const selected =
                  selectedAnswer === index;

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
                      setSelectedAnswer(index)
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
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </div>

                    <span className="text-sm leading-6">
                      {answer}
                    </span>
                  </button>
                );
              }
            )}
          </div>

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

          <div className="mt-8 flex justify-end">
            {!validated ? (
              <button
                onClick={validateAnswer}
                disabled={
                  selectedAnswer === null
                }
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
              >
                Vérifier
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={saving}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    exercise.questions.length - 1
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