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
    lessonId: "saas-01-architecture",
    title: "Comprendre l’architecture d’un SaaS",
    questions: [
      {
        type: "architecture",
        question:
          "Quel ordre représente le mieux le trajet classique d’une demande dans un SaaS ?",
        answers: [
          "Backend → Utilisateur → Frontend → Database",
          "Utilisateur → Frontend → Backend → Database / API → Frontend",
          "Database → Frontend → Utilisateur → Backend",
          "Utilisateur → Database → Backend → Frontend",
        ],
        correctAnswer: 1,
        explanation:
          "L’utilisateur interagit avec le frontend. Le frontend transmet la demande au backend, qui peut utiliser une base de données ou une API avant de renvoyer le résultat.",
      },
      {
        type: "mcq",
        question:
          "Quel élément est généralement responsable de la logique sensible de l’application ?",
        answers: [
          "Le backend",
          "Le bouton HTML",
          "Le navigateur uniquement",
          "La feuille CSS",
        ],
        correctAnswer: 0,
        explanation:
          "Le backend exécute généralement la logique serveur et les opérations sensibles.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi une application SaaS contient-elle souvent plusieurs couches ?",
        answers: [
          "Pour compliquer volontairement le projet",
          "Parce que chaque couche a un rôle différent",
          "Parce que le frontend ne peut jamais afficher de texte",
          "Parce qu’une base de données remplace le backend",
        ],
        correctAnswer: 1,
        explanation:
          "Chaque couche remplit un rôle spécifique : interface, logique, stockage, authentification ou services externes.",
      },
    ],
  },

  "02": {
    lessonId: "saas-02-front-back",
    title: "Frontend, backend, client et serveur",
    questions: [
      {
        type: "mcq",
        question:
          "Lequel de ces éléments appartient principalement au frontend ?",
        answers: [
          "Une clé API secrète",
          "Une policy RLS",
          "Un formulaire visible par l’utilisateur",
          "Une variable d’environnement serveur",
        ],
        correctAnswer: 2,
        explanation:
          "Le formulaire fait partie de l’interface utilisée dans le navigateur.",
      },
      {
        type: "mcq",
        question:
          "Quel élément doit rester côté backend ?",
        answers: [
          "Le texte du bouton",
          "La clé secrète d’une API IA",
          "Le titre de la page",
          "La couleur du dashboard",
        ],
        correctAnswer: 1,
        explanation:
          "Une clé API secrète ne doit pas être exposée au navigateur.",
      },
      {
        type: "architecture",
        question:
          "Dans une architecture web, qu’appelle-t-on généralement le client ?",
        answers: [
          "Le navigateur ou l’application qui envoie une requête",
          "La base PostgreSQL",
          "Uniquement l’API IA",
          "Le fichier .env",
        ],
        correctAnswer: 0,
        explanation:
          "Le client est généralement le programme ou navigateur qui envoie une requête au serveur.",
      },
      {
        type: "code",
        question:
          "Quel problème voyez-vous dans ce code s’il est exécuté dans le navigateur ?",
        code: `const apiKey = "sk-secret-123";

const response = await fetch(
  "https://api.exemple.com/generate",
  {
    headers: {
      Authorization: \`Bearer \${apiKey}\`
    }
  }
);`,
        answers: [
          "fetch ne peut jamais être utilisé dans un navigateur",
          "La clé secrète est exposée côté client",
          "Il manque obligatoirement une base de données",
          "Le code ne peut pas contenir de constante",
        ],
        correctAnswer: 1,
        explanation:
          "Une clé secrète placée dans du code frontend peut être récupérée par l’utilisateur.",
      },
    ],
  },

  "03": {
    lessonId: "saas-03-auth",
    title: "Gérer les utilisateurs",
    questions: [
      {
        type: "mcq",
        question:
          "À quoi sert principalement l’authentification ?",
        answers: [
          "À changer la couleur du site",
          "À savoir qui utilise l’application",
          "À remplacer la base de données",
          "À supprimer les requêtes HTTP",
        ],
        correctAnswer: 1,
        explanation:
          "L’authentification permet d’identifier l’utilisateur connecté.",
      },
      {
        type: "code",
        question:
          "Que fait ce code ?",
        code: `const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  redirect("/connexion");
}`,
        answers: [
          "Il crée automatiquement un compte",
          "Il protège la page contre les utilisateurs non connectés",
          "Il supprime la session",
          "Il appelle une API IA",
        ],
        correctAnswer: 1,
        explanation:
          "Si aucun utilisateur authentifié n’est trouvé, la page redirige vers la connexion.",
      },
      {
        type: "mcq",
        question:
          "Quel concept permet à l’application de reconnaître un utilisateur après sa connexion ?",
        answers: [
          "Une session",
          "Une feuille CSS",
          "Un endpoint GET public",
          "Une image",
        ],
        correctAnswer: 0,
        explanation:
          "La session permet de maintenir l’état d’authentification entre plusieurs requêtes.",
      },
    ],
  },

  "04": {
    lessonId: "saas-04-database",
    title: "Connecter la base de données",
    questions: [
      {
        type: "mcq",
        question:
          "Pourquoi une ressource comme un projet contient-elle souvent user_id ?",
        answers: [
          "Pour savoir à quel utilisateur elle appartient",
          "Pour remplacer son propre id",
          "Pour appeler directement une API IA",
          "Pour créer une session",
        ],
        correctAnswer: 0,
        explanation:
          "user_id relie la ressource à son propriétaire.",
      },
      {
        type: "code",
        question:
          "Que récupère cette requête ?",
        code: `const { data: projects } =
  await supabase
    .from("projects")
    .select("id, name")
    .eq("user_id", user.id);`,
        answers: [
          "Tous les utilisateurs",
          "Les projets liés à l’utilisateur connecté",
          "Toutes les tables de la base",
          "Une clé API",
        ],
        correctAnswer: 1,
        explanation:
          "La requête filtre les projets dont user_id correspond à user.id.",
      },
      {
        type: "mcq",
        question:
          "Quel élément doit compléter le filtrage côté application pour une vraie sécurité multi-utilisateurs ?",
        answers: [
          "Une policy RLS adaptée",
          "Un bouton supplémentaire",
          "Un fichier CSS",
          "Une image de profil",
        ],
        correctAnswer: 0,
        explanation:
          "Le filtrage applicatif ne remplace pas les règles de sécurité appliquées par la base.",
      },
    ],
  },

  "05": {
    lessonId: "saas-05-ai",
    title: "Ajouter une fonctionnalité IA",
    questions: [
      {
        type: "architecture",
        question:
          "Quel trajet est le plus sûr pour envoyer un prompt vers une API IA utilisant une clé secrète ?",
        answers: [
          "Frontend → API IA directement avec la clé secrète",
          "Frontend → Backend → API IA → Backend → Frontend",
          "Database → Utilisateur → API IA",
          "API IA → Frontend → Backend",
        ],
        correctAnswer: 1,
        explanation:
          "Le frontend envoie la demande à votre backend. Le backend utilise la clé secrète pour appeler le service IA.",
      },
      {
        type: "code",
        question:
          "Que fait ce code frontend ?",
        code: `const response = await fetch(
  "/api/generate",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  }
);`,
        answers: [
          "Il envoie le prompt à une route backend",
          "Il crée une base de données",
          "Il récupère automatiquement l’utilisateur",
          "Il expose une variable d’environnement",
        ],
        correctAnswer: 0,
        explanation:
          "Le frontend envoie les données vers la route /api/generate avec une requête POST.",
      },
      {
        type: "mcq",
        question:
          "Après avoir reçu la réponse de l’IA, que peut faire le backend ?",
        answers: [
          "Uniquement l’ignorer",
          "La renvoyer au frontend et éventuellement l’enregistrer",
          "Uniquement supprimer la session",
          "Forcément fermer l’application",
        ],
        correctAnswer: 1,
        explanation:
          "Le backend peut traiter la réponse, l’enregistrer et renvoyer les données nécessaires au frontend.",
      },
    ],
  },

  "06": {
    lessonId: "saas-06-security",
    title: "Sécuriser clés API et backend",
    questions: [
      {
        type: "mcq",
        question:
          "Où doit être stockée une clé API privée utilisée par le backend ?",
        answers: [
          "Dans une variable d’environnement serveur",
          "Dans un composant React envoyé au navigateur",
          "Dans le texte d’un bouton",
          "Dans l’URL publique",
        ],
        correctAnswer: 0,
        explanation:
          "Une variable d’environnement côté serveur permet de garder le secret hors du code client.",
      },
      {
        type: "code",
        question:
          "Que fait ce code ?",
        code: `const apiKey =
  process.env.AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Configuration manquante"
  );
}`,
        answers: [
          "Il expose la clé au frontend",
          "Il vérifie que le secret serveur existe",
          "Il crée un utilisateur",
          "Il active automatiquement RLS",
        ],
        correctAnswer: 1,
        explanation:
          "Le backend récupère la variable d’environnement et vérifie qu’elle est bien configurée.",
      },
      {
        type: "mcq",
        question:
          "Être authentifié signifie-t-il qu’un utilisateur doit automatiquement pouvoir effectuer toutes les actions ?",
        answers: [
          "Oui, toujours",
          "Oui, sauf pour les requêtes GET",
          "Non, il faut aussi gérer les autorisations",
          "Non, car un utilisateur connecté ne peut accéder à aucune donnée",
        ],
        correctAnswer: 2,
        explanation:
          "Authentification et autorisation sont différentes : savoir qui est l’utilisateur ne suffit pas à décider ce qu’il peut faire.",
      },
      {
        type: "architecture",
        question:
          "Quel élément constitue une meilleure frontière de sécurité pour un appel sensible ?",
        answers: [
          "Le navigateur",
          "Le backend",
          "Une balise HTML",
          "Le fichier CSS",
        ],
        correctAnswer: 1,
        explanation:
          "Le backend constitue l’environnement de confiance pour exécuter les opérations nécessitant des secrets ou des contrôles.",
      },
    ],
  },
};

export default function SaasExercisePage() {
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
            href="/formation/saas-ia"
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
      } = await supabase.auth.getUser();

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
                    `/formation/saas-ia/${nextLesson}`
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

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/saas-ia/${lessonSlug}`}
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
            SAAS IA · LEÇON {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {exercise.title}
          </h1>

          <div className="mt-5">

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {question.type === "code"
                ? "Lecture de code"
                : question.type ===
                  "architecture"
                ? "Architecture"
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