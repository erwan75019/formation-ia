"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ======================================================
// TYPES
// ======================================================

type Question = {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

type Quiz = {
  lessonId: string;
  title: string;
  questions: Question[];
};

// ======================================================
// QUIZ
// ======================================================

const quizzes: Record<string, Quiz> = {

  // ==================================================
  // LEÇON 01
  // ==================================================

  "01": {
    lessonId:
      "quotidien-01-travail",

    title:
      "Transformer une tâche en workflow IA",

    questions: [
      {
        question:
          "Vous recevez des notes de réunion désordonnées. Quelle première étape est la plus solide ?",

        answers: [
          "Demander immédiatement un compte rendu final",
          "Classer d’abord les informations en décisions, actions, responsables, échéances et éléments inconnus",
          "Réécrire toutes les notes avec un ton plus professionnel",
          "Demander à l’IA de compléter les éléments qui manquent",
        ],

        correctAnswer: 1,

        explanation:
          "Commencer par structurer les informations permet de contrôler la transformation avant de produire le livrable final.",
      },

      {
        question:
          "Une tâche mentionne qu’un document doit être validé, mais aucun responsable n’est indiqué. Que doit faire le workflow ?",

        answers: [
          "Choisir la personne la plus probable",
          "Supprimer cette information",
          "Indiquer que le responsable reste à définir",
          "Attribuer automatiquement la responsabilité au manager",
        ],

        correctAnswer: 2,

        explanation:
          "Une information absente ne doit pas être inventée. Le workflow doit la signaler explicitement comme inconnue.",
      },

      {
        question:
          "Pourquoi ajouter une étape de contrôle après la génération du livrable ?",

        answers: [
          "Pour rallonger le workflow",
          "Pour vérifier les éléments sensibles comme noms, dates, montants et échéances",
          "Pour obliger l’IA à réécrire tout le résultat",
          "Pour remplacer toutes les informations initiales",
        ],

        correctAnswer: 1,

        explanation:
          "Le contrôle final sert à vérifier les informations qui pourraient avoir été mal interprétées ou déformées.",
      },

      {
        question:
          "Quel workflow est le plus professionnel ?",

        answers: [
          "Informations brutes → résultat final",
          "Informations brutes → classification → transformation → contrôle → livrable",
          "Informations brutes → reformulation → publication",
          "Informations brutes → résumé → suppression des détails",
        ],

        correctAnswer: 1,

        explanation:
          "Un workflow fiable sépare les étapes afin que chaque transformation puisse être comprise et contrôlée.",
      },
    ],
  },

  // ==================================================
  // LEÇON 02
  // ==================================================

  "02": {
    lessonId:
      "quotidien-02-etudes",

    title:
      "Apprendre et travailler avec l’IA",

    questions: [
      {
        question:
          "Quelle approche développe le mieux une vraie compréhension ?",

        answers: [
          "Lire plusieurs explications sans répondre à aucune question",
          "Demander une explication puis copier les exemples",
          "Recevoir une explication, répondre à des questions, résoudre un exercice puis analyser ses erreurs",
          "Demander directement la correction de chaque exercice",
        ],

        correctAnswer: 2,

        explanation:
          "L’apprentissage actif nécessite de produire soi-même une réponse puis d’utiliser les erreurs pour progresser.",
      },

      {
        question:
          "Vous réussissez facilement trois exercices consécutifs. Quelle suite est la plus pertinente ?",

        answers: [
          "Recommencer exactement les mêmes exercices",
          "Augmenter progressivement la difficulté",
          "Arrêter immédiatement la séance",
          "Demander toutes les réponses du chapitre",
        ],

        correctAnswer: 1,

        explanation:
          "Une progression adaptative augmente la difficulté lorsque les compétences précédentes sont suffisamment maîtrisées.",
      },

      {
        question:
          "Quel comportement de l’IA est le plus utile pendant un exercice ?",

        answers: [
          "Donner immédiatement la solution complète",
          "Attendre la réponse de l’apprenant avant de corriger",
          "Ignorer les erreurs commises",
          "Changer de sujet dès qu’une erreur apparaît",
        ],

        correctAnswer: 1,

        explanation:
          "L’apprenant doit d’abord produire son propre raisonnement afin que la correction puisse réellement diagnostiquer ses difficultés.",
      },

      {
        question:
          "Pourquoi utiliser les erreurs précédentes pour créer la révision finale ?",

        answers: [
          "Parce qu’elles indiquent les points qui nécessitent encore du travail",
          "Parce qu’elles rendent la séance plus longue",
          "Parce que toutes les erreurs doivent être mémorisées",
          "Parce que l’IA ne peut pas créer de nouvelles questions",
        ],

        correctAnswer: 0,

        explanation:
          "Les erreurs donnent une indication précise des notions qui doivent être revues ou renforcées.",
      },
    ],
  },

  // ==================================================
  // LEÇON 03
  // ==================================================

  "03": {
    lessonId:
      "quotidien-03-recherche",

    title:
      "Rechercher, analyser et vérifier",

    questions: [
      {
        question:
          "Vous comparez plusieurs ordinateurs. Lequel de ces critères doit être traité comme éliminatoire si le budget maximum est de 1 600 € ?",

        answers: [
          "La couleur",
          "Le poids préféré",
          "Un prix de 1 850 €",
          "La taille du trackpad",
        ],

        correctAnswer: 2,

        explanation:
          "Une contrainte éliminatoire exclut directement une option, contrairement à une simple préférence.",
      },

      {
        question:
          "Pourquoi faut-il vérifier la configuration exacte d’un modèle d’ordinateur ?",

        answers: [
          "Parce qu’un même nom commercial peut correspondre à plusieurs configurations différentes",
          "Parce que tous les ordinateurs ont les mêmes composants",
          "Parce que le nom du modèle change chaque jour",
          "Parce que la configuration n’influence jamais le prix",
        ],

        correctAnswer: 0,

        explanation:
          "Un même modèle peut être vendu avec différentes quantités de RAM, stockage ou processeurs.",
      },

      {
        question:
          "Quelle information doit être revérifiée juste avant un achat ?",

        answers: [
          "La définition de la RAM",
          "Le principe général d’un SSD",
          "Le prix et la disponibilité du produit",
          "Le rôle d’un processeur",
        ],

        correctAnswer: 2,

        explanation:
          "Les prix et disponibilités peuvent changer rapidement et doivent donc être vérifiés au moment de la décision.",
      },

      {
        question:
          "Une recommandation finale est solide lorsqu’elle…",

        answers: [
          "choisit automatiquement l’option la plus chère",
          "présente seulement le produit préféré par l’IA",
          "explique pourquoi une option respecte mieux les contraintes et priorités définies",
          "ignore les compromis entre les options",
        ],

        correctAnswer: 2,

        explanation:
          "La recommandation doit être reliée aux critères définis au début de la recherche.",
      },
    ],
  },

  // ==================================================
  // LEÇON 04
  // ==================================================

  "04": {
    lessonId:
      "quotidien-04-documents",

    title:
      "Exploiter des documents avec l’IA",

    questions: [
      {
        question:
          "Vous analysez un contrat. Quelle consigne réduit le mieux le risque d’ajouter des informations extérieures ?",

        answers: [
          "Analyse uniquement le document fourni et signale toute information absente",
          "Complète les clauses qui semblent manquer",
          "Utilise tes connaissances générales pour compléter le contrat",
          "Imagine ce que le fournisseur voulait probablement dire",
        ],

        correctAnswer: 0,

        explanation:
          "Limiter explicitement l’analyse au document fourni réduit le risque d’introduire des informations non présentes.",
      },

      {
        question:
          "Pourquoi conserver la page ou la section associée à une information extraite ?",

        answers: [
          "Pour rendre le tableau plus long",
          "Pour pouvoir retrouver et vérifier rapidement l’information dans le document",
          "Pour augmenter automatiquement la précision du modèle",
          "Pour éviter complètement toute erreur",
        ],

        correctAnswer: 1,

        explanation:
          "La traçabilité permet à l’utilisateur de revenir directement à la source dans le document.",
      },

      {
        question:
          "Le contrat ne précise rien concernant des frais de résiliation anticipée. Quelle sortie est la plus correcte ?",

        answers: [
          "Frais probablement inexistants",
          "Frais à estimer",
          "Information non trouvée dans le document",
          "Frais standards du secteur",
        ],

        correctAnswer: 2,

        explanation:
          "Une absence d’information doit être signalée comme telle plutôt que remplacée par une supposition.",
      },

      {
        question:
          "Quel livrable est le plus adapté à une analyse documentaire orientée décision ?",

        answers: [
          "Un long résumé narratif sans référence",
          "Un tableau avec information, page ou section et point d’attention",
          "Une copie complète du document",
          "Une liste de toutes les phrases du contrat",
        ],

        correctAnswer: 1,

        explanation:
          "Une structure orientée décision permet de retrouver rapidement les informations importantes et leur source.",
      },
    ],
  },

  // ==================================================
  // LEÇON 05
  // ==================================================

  "05": {
    lessonId:
      "quotidien-05-mission",

    title:
      "Projet · Construire un workflow IA",

    questions: [
      {
        question:
          "Votre directrice demande d’organiser un déplacement mais ne donne pas les dates exactes. Quelle doit être la première action ?",

        answers: [
          "Chercher immédiatement les vols les moins chers",
          "Choisir des dates probables",
          "Identifier les informations manquantes avant de lancer la recherche",
          "Réserver un hôtel flexible",
        ],

        correctAnswer: 2,

        explanation:
          "Une recherche commencée avec des contraintes essentielles manquantes risque de produire des résultats inutilisables.",
      },

      {
        question:
          "Pourquoi comparer le coût total du déplacement plutôt que seulement le billet d’avion ?",

        answers: [
          "Parce qu’un billet moins cher peut entraîner d’autres coûts ou contraintes",
          "Parce que l’hôtel est toujours plus cher que le vol",
          "Parce que les transports locaux sont gratuits",
          "Parce que le billet d’avion n’a aucune importance",
        ],

        correctAnswer: 0,

        explanation:
          "La meilleure option dépend du coût et des contraintes de l’ensemble du déplacement.",
      },

      {
        question:
          "Quelle information concernant l’hôtel doit être évaluée par rapport au rendez-vous ?",

        answers: [
          "La couleur de la réception",
          "Le temps de trajet réel",
          "La taille du logo de l’hôtel",
          "Le nombre de photos disponibles",
        ],

        correctAnswer: 1,

        explanation:
          "Une distance apparemment courte peut représenter un temps de trajet important selon la circulation et la localisation.",
      },

      {
        question:
          "Quel ordre représente le mieux le workflow final du module ?",

        answers: [
          "Recherche → réservation → contraintes",
          "Cadrage → collecte → vérification → comparaison → recommandation → contrôle final",
          "Résultat final → recherche → vérification",
          "Prompt → résultat → publication immédiate",
        ],

        correctAnswer: 1,

        explanation:
          "Le module vise précisément à construire un processus contrôlé allant du cadrage jusqu’au livrable final.",
      },
    ],
  },
};

// ======================================================
// PAGE
// ======================================================

export default function DailyExercisePage() {
  const params =
    useParams<{
      lesson: string;
    }>();

  const router =
    useRouter();

  const supabase =
    createClient();

  const lessonSlug =
    params.lesson;

  const quiz =
    quizzes[
      lessonSlug
    ];

  // ======================================================
  // STATE
  // ======================================================

  const [
    currentQuestion,
    setCurrentQuestion,
  ] =
    useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] =
    useState<
      number | null
    >(null);

  const [
    validated,
    setValidated,
  ] =
    useState(false);

  const [
    score,
    setScore,
  ] =
    useState(0);

  const [
    finished,
    setFinished,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    saveError,
    setSaveError,
  ] =
    useState("");

  // ======================================================
  // QUIZ INTROUVABLE
  // ======================================================

  if (!quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold">
            Exercice introuvable
          </h1>

          <Link
            href="/formation/quotidien"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>

      </main>
    );
  }

  // ======================================================
  // QUESTION
  // ======================================================

  const question =
    quiz.questions[
      currentQuestion
    ];

  const isCorrect =
    selectedAnswer ===
    question.correctAnswer;

  // ======================================================
  // VALIDATION RÉPONSE
  // ======================================================

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
        (
          previousScore
        ) =>
          previousScore +
          1
      );
    }

    setValidated(
      true
    );
  }

  // ======================================================
  // QUESTION SUIVANTE
  // ======================================================

  async function nextQuestion() {

    if (
      currentQuestion <
      quiz.questions.length -
        1
    ) {
      setCurrentQuestion(
        (
          previousQuestion
        ) =>
          previousQuestion +
          1
      );

      setSelectedAnswer(
        null
      );

      setValidated(
        false
      );

      setSaveError(
        ""
      );

      return;
    }

    // ==================================================
    // CALCUL SCORE
    // ==================================================

    const finalScore =
      Math.round(
        (score /
          quiz.questions
            .length) *
          100
      );

    // ==================================================
    // VALIDATION 70 %
    // ==================================================

    if (
      finalScore >= 70
    ) {
      setSaving(
        true
      );

      setSaveError(
        ""
      );

      // ==================================================
      // USER
      // ==================================================

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        setSaving(
          false
        );

        setSaveError(
          "Vous devez être connecté pour enregistrer votre progression."
        );

        return;
      }

      const now =
        new Date().toISOString();

      // ==================================================
      // SUPABASE
      // ==================================================

      const {
        error,
      } =
        await supabase
          .from(
            "lesson_progress"
          )
          .upsert(
            {
              user_id:
                user.id,

              lesson_id:
                quiz.lessonId,

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

      setSaving(
        false
      );

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

    setFinished(
      true
    );
  }

  // ======================================================
  // RESTART
  // ======================================================

  function restartQuiz() {
    setCurrentQuestion(
      0
    );

    setSelectedAnswer(
      null
    );

    setValidated(
      false
    );

    setScore(
      0
    );

    setFinished(
      false
    );

    setSaveError(
      ""
    );
  }

  // ======================================================
  // SCORE FINAL
  // ======================================================

  const finalScore =
    Math.round(
      (score /
        quiz.questions
          .length) *
        100
    );

  // ======================================================
  // ÉCRAN FINAL
  // ======================================================

  if (finished) {
    const passed =
      finalScore >= 70;

    const lessonNumber =
      Number(
        lessonSlug
      );

    const nextLesson =
      lessonNumber < 5
        ? String(
            lessonNumber +
              1
          ).padStart(
            2,
            "0"
          )
        : null;

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
              : "Encore un petit effort"}
          </h1>

          <p className="mt-3 text-slate-500">
            {
              quiz.title
            }
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
              quiz.questions
                .length
            }.
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm leading-6 text-emerald-900">
              Félicitations. Cette leçon est validée et votre progression a été enregistrée.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Vous devez obtenir au moins 70 % pour valider cette leçon.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={
                  restartQuiz
                }
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                Recommencer
              </button>
            )}

            {passed &&
              nextLesson && (
                <button
                  onClick={() =>
                    router.push(
                      `/formation/quotidien/${nextLesson}`
                    )
                  }
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                >
                  Leçon suivante →
                </button>
              )}

            {passed &&
              !nextLesson && (
                <button
                  onClick={() =>
                    router.push(
                      "/formation/quotidien"
                    )
                  }
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                >
                  Terminer le module ✓
                </button>
              )}

          </div>

        </section>

      </main>
    );
  }

  // ======================================================
  // PROGRESSION QUIZ
  // ======================================================

  const progress =
    ((currentQuestion +
      1) /
      quiz.questions
        .length) *
    100;

  // ======================================================
  // QUIZ UI
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        {/* TOP */}

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/quotidien/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question{" "}
            {currentQuestion +
              1}{" "}
            /{" "}
            {
              quiz.questions
                .length
            }
          </span>

        </div>

        {/* PROGRESS */}

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-500"
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

        {/* QUESTION */}

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MODULE 03 · LEÇON{" "}
            {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {
              quiz.title
            }
          </h1>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {
              question.question
            }
          </h2>

          {/* ANSWERS */}

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
                    key={
                      answer
                    }
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

                    <p className="leading-6">
                      {
                        answer
                      }
                    </p>

                  </button>
                );
              }
            )}

          </div>

          {/* EXPLICATION */}

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

          {/* ERROR */}

          {saveError && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {
                saveError
              }
            </div>
          )}

          {/* BUTTON */}

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
                Valider ma réponse
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
                    quiz.questions
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