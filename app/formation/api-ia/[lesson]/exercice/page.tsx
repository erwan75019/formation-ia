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
    lessonId: "api-01-intro",
    title: "Qu’est-ce qu’une API ?",
    questions: [
      {
        type: "mcq",
        question:
          "Quel est le rôle principal d’une API ?",
        answers: [
          "Créer automatiquement un site web",
          "Permettre à deux applications de communiquer",
          "Remplacer Python",
          "Stocker uniquement des mots de passe",
        ],
        correctAnswer: 1,
        explanation:
          "Une API sert principalement d’interface de communication entre plusieurs systèmes ou applications.",
      },
      {
        type: "mcq",
        question:
          "Dans une communication API classique, que fait généralement votre programme en premier ?",
        answers: [
          "Il envoie une requête",
          "Il reçoit forcément du HTML",
          "Il supprime le serveur",
          "Il crée une base de données",
        ],
        correctAnswer: 0,
        explanation:
          "Votre programme envoie d’abord une requête à l’API pour demander ou transmettre une information.",
      },
      {
        type: "mcq",
        question:
          "Quel format est très souvent utilisé pour échanger des données avec une API ?",
        answers: [
          "MP3",
          "PNG",
          "JSON",
          "DOCX",
        ],
        correctAnswer: 2,
        explanation:
          "JSON est un format très courant pour les échanges de données entre applications.",
      },
    ],
  },

  "02": {
    lessonId: "api-02-http",
    title: "HTTP, GET et POST",
    questions: [
      {
        type: "mcq",
        question:
          "Quelle méthode HTTP est généralement utilisée pour récupérer des données ?",
        answers: [
          "POST",
          "DELETE",
          "PATCH",
          "GET",
        ],
        correctAnswer: 3,
        explanation:
          "GET est généralement utilisé pour demander une ressource ou récupérer des données.",
      },
      {
        type: "mcq",
        question:
          "Quelle méthode est généralement utilisée pour envoyer des données afin de créer une ressource ou déclencher un traitement ?",
        answers: [
          "POST",
          "GET",
          "READ",
          "OPEN",
        ],
        correctAnswer: 0,
        explanation:
          "POST est souvent utilisé pour envoyer des données au serveur.",
      },
      {
        type: "code",
        question:
          "Que signifie cette requête ?",
        code: `GET /appartements/71`,
        answers: [
          "Créer l’appartement 71",
          "Récupérer la ressource correspondant à l’appartement 71",
          "Supprimer l’appartement 71",
          "Modifier automatiquement l’appartement 71",
        ],
        correctAnswer: 1,
        explanation:
          "GET demande généralement la ressource identifiée par l’URL.",
      },
    ],
  },

  "03": {
    lessonId: "api-03-requests",
    title: "Utiliser requests en Python",
    questions: [
      {
        type: "code",
        question:
          "Quelle ligne envoie réellement une requête GET avec requests ?",
        answers: [
          `response = requests.get(url)`,
          `response = requests.json(url)`,
          `requests = get(url)`,
          `response.get = url`,
        ],
        correctAnswer: 0,
        explanation:
          "requests.get(url) envoie une requête HTTP GET vers l’URL indiquée.",
      },
      {
        type: "code",
        question:
          "À quoi sert `import requests` ?",
        answers: [
          "À créer une variable appelée requests",
          "À charger la bibliothèque requests afin de pouvoir l’utiliser",
          "À convertir automatiquement une réponse en JSON",
          "À créer une API",
        ],
        correctAnswer: 1,
        explanation:
          "L’instruction import rend la bibliothèque disponible dans votre programme.",
      },
      {
        type: "code",
        question:
          "Que contient généralement la variable response ici ?",
        code: `response = requests.get(
    "https://api.exemple.com/data"
)`,
        answers: [
          "Uniquement une chaîne de caractères",
          "La réponse HTTP renvoyée par le serveur",
          "Toujours un dictionnaire Python",
          "Toujours le code 200",
        ],
        correctAnswer: 1,
        explanation:
          "response représente l’objet réponse HTTP. On peut ensuite lire son status code ou son contenu.",
      },
    ],
  },

  "04": {
    lessonId: "api-04-response-json",
    title: "Réponses, status codes et JSON",
    questions: [
      {
        type: "mcq",
        question:
          "Quel code HTTP indique généralement qu’une requête a réussi ?",
        answers: [
          "404",
          "500",
          "200",
          "401",
        ],
        correctAnswer: 2,
        explanation:
          "200 est le code classique indiquant qu’une requête HTTP a réussi.",
      },
      {
        type: "mcq",
        question:
          "Que signifie généralement un code HTTP 404 ?",
        answers: [
          "Authentification réussie",
          "Serveur démarré",
          "Réponse JSON invalide",
          "Ressource introuvable",
        ],
        correctAnswer: 3,
        explanation:
          "404 signifie généralement que la ressource demandée n’a pas été trouvée.",
      },
      {
        type: "code",
        question:
          "Que fait cette ligne ?",
        code: `data = response.json()`,
        answers: [
          "Elle envoie une nouvelle requête",
          "Elle transforme une réponse JSON en données Python manipulables",
          "Elle affiche automatiquement la réponse",
          "Elle vérifie uniquement le status code",
        ],
        correctAnswer: 1,
        explanation:
          "response.json() convertit le contenu JSON de la réponse en structures Python.",
      },
    ],
  },

  "05": {
    lessonId: "api-05-auth",
    title: "Clés API et authentification",
    questions: [
      {
        type: "mcq",
        question:
          "Pourquoi une clé API secrète ne doit-elle pas être placée directement dans du code public ?",
        answers: [
          "Parce qu’elle pourrait être récupérée et utilisée par quelqu’un d’autre",
          "Parce qu’elle empêche Python de démarrer",
          "Parce qu’elle casse automatiquement JSON",
          "Parce qu’elle désactive les API",
        ],
        correctAnswer: 0,
        explanation:
          "Une clé exposée peut être volée et utilisée à votre place, parfois avec des coûts ou des risques de sécurité.",
      },
      {
        type: "mcq",
        question:
          "Où est-il préférable de stocker une clé API secrète ?",
        answers: [
          "Dans le HTML envoyé au navigateur",
          "Dans une capture d’écran",
          "Dans une variable d’environnement côté serveur",
          "Dans le nom du fichier Python",
        ],
        correctAnswer: 2,
        explanation:
          "Les variables d’environnement permettent de garder les secrets séparés du code.",
      },
      {
        type: "code",
        question:
          "Quelle ligne récupère correctement une variable d’environnement en Python ?",
        answers: [
          `api_key = env["API_KEY"]`,
          `api_key = os.getenv("API_KEY")`,
          `api_key = requests.get("API_KEY")`,
          `api_key = print("API_KEY")`,
        ],
        correctAnswer: 1,
        explanation:
          "os.getenv() permet de récupérer la valeur d’une variable d’environnement.",
      },
    ],
  },

  "06": {
    lessonId: "api-06-ai",
    title: "Appeler une API d’IA",
    questions: [
      {
        type: "mcq",
        question:
          "Une API d’IA fonctionne-t-elle sur un principe totalement différent d’une API classique ?",
        answers: [
          "Oui, elle n’utilise jamais HTTP",
          "Oui, elle ne reçoit aucune donnée",
          "Non, elle suit le même principe général de requête et réponse",
          "Non, mais elle ne peut jamais utiliser JSON",
        ],
        correctAnswer: 2,
        explanation:
          "Une API IA suit le même principe : votre application envoie une requête et reçoit une réponse.",
      },
      {
        type: "mcq",
        question:
          "Que peut contenir la requête envoyée à une API d’IA ?",
        answers: [
          "Uniquement une adresse email",
          "Des instructions et des données à analyser",
          "Uniquement un code HTTP",
          "Uniquement une clé API",
        ],
        correctAnswer: 1,
        explanation:
          "On peut envoyer des instructions, du texte, des données structurées ou d’autres contenus selon l’API.",
      },
      {
        type: "mcq",
        question:
          "Que peut faire votre application avec la réponse de l’IA ?",
        answers: [
          "Uniquement l’afficher",
          "Uniquement la supprimer",
          "L’utiliser dans d’autres étapes de logique, d’automatisation ou de stockage",
          "Rien, la réponse appartient au serveur",
        ],
        correctAnswer: 2,
        explanation:
          "La réponse de l’IA devient une donnée que votre application peut réutiliser.",
      },
    ],
  },
};

export default function APIExercisePage() {
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
            Cette leçon utilise peut-être un projet séparé.
          </p>

          <Link
            href="/formation/api-ia"
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
          "Erreur Supabase :",
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
  // PAGE DE RÉSULTAT
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
              Cette leçon API est validée. Votre progression a été enregistrée dans Supabase.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Vous devez obtenir au moins 70 %. Relisez la leçon puis recommencez.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={restartExercise}
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                Recommencer
              </button>
            )}

            {passed && (
              <button
                onClick={() =>
                  router.push(
                    `/formation/api-ia/${nextLesson}`
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
  // PAGE EXERCICE
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/api-ia/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} /{" "}
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
            API & IA · LEÇON {lessonSlug}
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
                  CODE / REQUÊTE
                </p>

              </div>

              <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                <code>
                  {question.code}
                </code>
              </pre>

            </div>
          )}

          {/* ANSWERS */}

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