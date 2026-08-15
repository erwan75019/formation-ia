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
    lessonId: "agents-01-agent-vs-chatbot",
    title: "Agent IA vs chatbot",
    questions: [
      {
        type: "mcq",
        question:
          "Quelle différence décrit le mieux un agent IA par rapport à un chatbot classique ?",
        answers: [
          "Un agent peut décider d’utiliser des outils ou d’exécuter des actions",
          "Un chatbot utilise toujours une base de données",
          "Un agent ne produit jamais de texte",
          "Un chatbot ne peut jamais utiliser un LLM",
        ],
        correctAnswer: 0,
        explanation:
          "Un agent peut aller au-delà d’une simple réponse textuelle en demandant l’utilisation d’outils ou d’actions externes.",
      },
      {
        type: "architecture",
        question:
          "Quel flux correspond le mieux à un agent capable d’utiliser un outil ?",
        answers: [
          "Utilisateur → Réponse → Database",
          "Objectif → Agent → Outil → Observation → Agent → Réponse",
          "Frontend → CSS → Backend",
          "Outil → Utilisateur → LLM",
        ],
        correctAnswer: 1,
        explanation:
          "L’agent peut décider d’utiliser un outil, observer son résultat puis reprendre sa décision.",
      },
      {
        type: "mcq",
        question:
          "Qui doit réellement contrôler l’exécution des outils ?",
        answers: [
          "Le modèle seul",
          "Le navigateur de l’utilisateur",
          "Votre application ou votre backend",
          "La feuille CSS",
        ],
        correctAnswer: 2,
        explanation:
          "Le modèle peut demander une action, mais votre application doit décider si elle est autorisée puis l’exécuter.",
      },
    ],
  },

  "02": {
    lessonId: "agents-02-objective",
    title: "Objectif et plan d’action",
    questions: [
      {
        type: "mcq",
        question:
          "Pourquoi parle-t-on d’objectif dans un agent IA ?",
        answers: [
          "Parce qu’un objectif peut nécessiter plusieurs étapes pour être atteint",
          "Parce qu’un agent ne peut traiter qu’un seul mot",
          "Parce qu’un objectif remplace le backend",
          "Parce qu’un agent ne peut jamais poser de question",
        ],
        correctAnswer: 0,
        explanation:
          "Un objectif peut nécessiter de rechercher des informations, utiliser des outils puis analyser les résultats.",
      },
      {
        type: "architecture",
        question:
          "L’utilisateur demande : « Trouve-moi un appartement à moins de 2 000 € avec deux pièces minimum. » Quelle est une bonne première décision de l’agent s’il ne possède aucune donnée immobilière ?",
        answers: [
          "Inventer un appartement",
          "Répondre immédiatement qu’il n’existe aucun appartement",
          "Utiliser un outil de recherche d’appartements",
          "Supprimer l’objectif",
        ],
        correctAnswer: 2,
        explanation:
          "Si l’information manque et qu’un outil adapté existe, l’agent peut décider de l’utiliser.",
      },
      {
        type: "mcq",
        question:
          "Quand un agent doit-il normalement arrêter sa recherche ?",
        answers: [
          "Uniquement après exactement 100 étapes",
          "Lorsqu’il possède suffisamment d’informations pour produire le résultat attendu",
          "Dès qu’un outil renvoie une erreur",
          "Jamais",
        ],
        correctAnswer: 1,
        explanation:
          "L’agent peut produire une réponse finale lorsque l’objectif peut être satisfait avec les informations disponibles.",
      },
    ],
  },

  "03": {
    lessonId: "agents-03-tools",
    title: "Donner des outils à un agent",
    questions: [
      {
        type: "mcq",
        question:
          "Qu’est-ce qu’un outil pour un agent IA ?",
        answers: [
          "Une capacité définie par votre application que l’agent peut demander d’utiliser",
          "Un nouveau modèle obligatoirement",
          "Une base de données entière",
          "Uniquement une API publique",
        ],
        correctAnswer: 0,
        explanation:
          "Un outil peut être une fonction, une API, une recherche, une opération sur une base de données ou une autre capacité contrôlée.",
      },
      {
        type: "code",
        question:
          "À quoi sert principalement la description de cet outil ?",
        code: `{
  name: "searchApartments",

  description:
    "Recherche des appartements correspondant à des critères."
}`,
        answers: [
          "À expliquer au modèle quand cet outil est utile",
          "À stocker la clé API",
          "À exécuter automatiquement l’outil",
          "À créer une table SQL",
        ],
        correctAnswer: 0,
        explanation:
          "La description aide le modèle à comprendre le rôle de l’outil et dans quelles situations il peut être pertinent.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi faut-il définir les arguments attendus par un outil ?",
        answers: [
          "Pour permettre une demande structurée et pouvoir valider les valeurs",
          "Pour empêcher totalement l’utilisation de l’outil",
          "Pour remplacer le nom de l’outil",
          "Pour éviter toute requête HTTP",
        ],
        correctAnswer: 0,
        explanation:
          "Des arguments structurés permettent au modèle d’indiquer précisément les valeurs nécessaires et au backend de les contrôler.",
      },
      {
        type: "mcq",
        question:
          "Le modèle possède-t-il automatiquement un accès direct à la fonction réelle de votre serveur ?",
        answers: [
          "Oui, toujours",
          "Seulement s’il utilise JSON",
          "Non, votre application doit faire le lien et exécuter l’outil",
          "Oui, dès qu’on lui donne le nom de la fonction",
        ],
        correctAnswer: 2,
        explanation:
          "La définition d’un outil indique au modèle qu’une capacité existe. Votre code reste responsable de son exécution réelle.",
      },
    ],
  },

  "04": {
    lessonId: "agents-04-tool-calling",
    title: "Comprendre le tool calling",
    questions: [
      {
        type: "code",
        question:
          "Que représente principalement cette structure ?",
        code: `{
  "tool": "searchApartments",
  "arguments": {
    "budget": 2000,
    "pieces": 2,
    "balcon": true
  }
}`,
        answers: [
          "Le résultat final de l’API immobilière",
          "Une demande structurée d’utilisation d’un outil",
          "Une table Supabase",
          "Une clé API",
        ],
        correctAnswer: 1,
        explanation:
          "Le modèle indique ici l’outil qu’il souhaite utiliser et les arguments nécessaires.",
      },
      {
        type: "architecture",
        question:
          "Quel ordre est correct pour un tool call ?",
        answers: [
          "Modèle → Tool call → Backend → Outil → Résultat → Modèle",
          "Outil → CSS → Utilisateur",
          "Backend → Modèle → Suppression du résultat",
          "Utilisateur → Database → Clé API",
        ],
        correctAnswer: 0,
        explanation:
          "Le modèle demande l’action, le backend l’exécute puis le résultat de l’outil est renvoyé au modèle.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi le backend doit-il valider les arguments d’un tool call ?",
        answers: [
          "Parce qu’une demande générée par le modèle ne doit pas être considérée automatiquement comme sûre",
          "Parce que JSON est toujours dangereux",
          "Parce que le modèle ne peut jamais produire de nombres",
          "Parce que tous les outils doivent être publics",
        ],
        correctAnswer: 0,
        explanation:
          "Les arguments générés doivent être contrôlés avant toute action réelle, surtout si l’outil peut modifier des données ou déclencher une action.",
      },
      {
        type: "mcq",
        question:
          "Après l’exécution de l’outil, que devient son résultat ?",
        answers: [
          "Une nouvelle information que l’agent peut utiliser",
          "Une clé secrète",
          "Une nouvelle session utilisateur",
          "Une feuille CSS",
        ],
        correctAnswer: 0,
        explanation:
          "Le résultat est réinjecté dans le contexte de l’agent afin qu’il puisse décider de la suite.",
      },
    ],
  },

  "05": {
    lessonId: "agents-05-loop",
    title: "La boucle agentique",
    questions: [
      {
        type: "architecture",
        question:
          "Quel cycle représente une boucle agentique simple ?",
        answers: [
          "Décision → Action → Observation → Nouvelle décision",
          "Frontend → CSS → HTML",
          "Utilisateur → Mot de passe → Image",
          "Database → Database → Database",
        ],
        correctAnswer: 0,
        explanation:
          "L’agent décide, une action est exécutée, il observe le résultat puis décide de la suite.",
      },
      {
        type: "code",
        question:
          "Quel est le rôle principal de cette condition ?",
        code: `if (decision.type === "final") {
  return decision.answer;
}`,
        answers: [
          "Exécuter obligatoirement un outil",
          "Arrêter la boucle lorsqu’une réponse finale est disponible",
          "Supprimer l’état de l’agent",
          "Créer un utilisateur",
        ],
        correctAnswer: 1,
        explanation:
          "La boucle se termine lorsque le modèle indique qu’il peut produire la réponse finale.",
      },
      {
        type: "code",
        question:
          "Que fait cette partie ?",
        code: `const result =
  await executeTool(
    decision.tool,
    decision.arguments
  );`,
        answers: [
          "Elle exécute l’outil demandé avec les arguments fournis",
          "Elle convertit le backend en frontend",
          "Elle crée une policy RLS",
          "Elle termine toujours l’agent",
        ],
        correctAnswer: 0,
        explanation:
          "Le programme appelle la fonction d’exécution de l’outil correspondant à la décision de l’agent.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi renvoyer le résultat d’un outil dans l’état de l’agent ?",
        answers: [
          "Pour que l’agent puisse utiliser cette nouvelle information lors de sa prochaine décision",
          "Pour cacher le résultat au modèle",
          "Pour supprimer l’objectif",
          "Pour rendre le frontend inutile",
        ],
        correctAnswer: 0,
        explanation:
          "Une observation devient une nouvelle donnée sur laquelle l’agent peut raisonner.",
      },
    ],
  },

  "06": {
    lessonId: "agents-06-memory-state",
    title: "Mémoire, état et limites",
    questions: [
      {
        type: "mcq",
        question:
          "À quoi sert l’état d’un agent pendant une exécution ?",
        answers: [
          "À conserver les informations utiles accumulées pendant les différentes étapes",
          "À stocker uniquement la couleur de l’interface",
          "À remplacer les outils",
          "À rendre le modèle public",
        ],
        correctAnswer: 0,
        explanation:
          "L’état peut contenir l’objectif, les décisions, les résultats d’outils et d’autres informations nécessaires au déroulement de l’agent.",
      },
      {
        type: "code",
        question:
          "Quelle protection ajoute ce code ?",
        code: `const MAX_STEPS = 5;

for (
  let step = 0;
  step < MAX_STEPS;
  step++
) {
  // agent
}`,
        answers: [
          "Une limite maximale de cinq étapes",
          "Une limite de cinq utilisateurs",
          "Une limite de cinq bases de données",
          "Aucune limite",
        ],
        correctAnswer: 0,
        explanation:
          "Le nombre de tours est limité afin d’éviter qu’une boucle continue indéfiniment.",
      },
      {
        type: "mcq",
        question:
          "Quel principe est le plus sûr concernant les outils disponibles pour un agent ?",
        answers: [
          "Donner accès à tous les outils possibles",
          "Donner uniquement les outils nécessaires à son rôle",
          "Laisser le modèle créer lui-même des outils système",
          "Désactiver toute validation",
        ],
        correctAnswer: 1,
        explanation:
          "Le principe du moindre privilège consiste à ne donner à l’agent que les capacités réellement nécessaires.",
      },
      {
        type: "mcq",
        question:
          "Une mémoire persistante doit-elle automatiquement conserver toutes les informations de toutes les conversations ?",
        answers: [
          "Oui, toujours",
          "Non, seules les informations utiles et autorisées doivent être conservées selon le besoin du produit",
          "Oui, si le modèle est puissant",
          "Oui, car la mémoire n’a aucun impact sur la confidentialité",
        ],
        correctAnswer: 1,
        explanation:
          "La mémoire doit être conçue intentionnellement : utilité, confidentialité, permissions et durée de conservation doivent être contrôlées.",
      },
    ],
  },
};

export default function AgentExercisePage() {
  const params =
    useParams<{ lesson: string }>();

  const router =
    useRouter();

  const supabase =
    createClient();

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

          <p className="mt-3 text-slate-500">
            Cette leçon utilise peut-être un mini-projet séparé.
          </p>

          <Link
            href="/formation/agents-ia"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>

      </main>
    );
  }

  const question =
    exercise.questions[
      currentQuestion
    ];

  const isCorrect =
    selectedAnswer ===
    question.correctAnswer;

  function validateAnswer() {
    if (
      selectedAnswer ===
        null ||
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
      exercise.questions.length -
        1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer(
        null
      );

      setValidated(false);
      setSaveError("");

      return;
    }

    const finalScore =
      Math.round(
        (score /
          exercise.questions
            .length) *
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
          .from(
            "lesson_progress"
          )
          .upsert(
            {
              user_id:
                user.id,
              lesson_id:
                exercise.lessonId,
              completed:
                true,
              score:
                finalScore,
              completed_at:
                now,
              last_viewed_at:
                now,
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

  const finalScore =
    Math.round(
      (score /
        exercise.questions
          .length) *
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
            lessonNumber +
              1
          ).padStart(
            2,
            "0"
          )
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
            {passed
              ? "✓"
              : "↻"}
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
            {score > 1
              ? "s"
              : ""}{" "}
            réponse
            {score > 1
              ? "s"
              : ""}{" "}
            sur{" "}
            {
              exercise.questions
                .length
            }
            .
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
                    `/formation/agents-ia/${nextLesson}`
                  )
                }
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                {lessonSlug ===
                "06"
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
      exercise.questions
        .length) *
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
            href={`/formation/agents-ia/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question{" "}
            {currentQuestion + 1}{" "}
            /{" "}
            {
              exercise.questions
                .length
            }
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
            AGENTS IA · LEÇON {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {exercise.title}
          </h1>

          <div className="mt-5">

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {question.type ===
              "code"
                ? "Lecture de code"
                : question.type ===
                  "architecture"
                ? "Architecture"
                : "Compréhension"}
            </span>

          </div>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {
              question.question
            }
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
                  {
                    question.code
                  }
                </code>
              </pre>

            </div>
          )}

          {/* RÉPONSES */}

          <div className="mt-8 space-y-4">

            {question.answers.map(
              (
                answer,
                index
              ) => {
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
                    disabled={
                      validated
                    }
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
                        65 +
                          index
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
                {
                  question.explanation
                }
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
                disabled={
                  saving
                }
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    exercise.questions
                      .length -
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