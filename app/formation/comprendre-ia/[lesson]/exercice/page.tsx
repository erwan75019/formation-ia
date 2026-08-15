"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

const quizzes: Record<string, Quiz> = {
  "01": {
    lessonId: "fichiers-01-comprendre",
    title: "Faire comprendre un fichier à l’IA",
    questions: [
      {
        question: "Avant de demander à l’IA d’analyser un fichier que vous connaissez mal, quel est le meilleur premier réflexe ?",
        answers: [
          "Lui demander d’abord d’expliquer ce que représente le fichier, ses lignes et ses colonnes",
          "Lui demander immédiatement de prendre une décision à votre place",
          "Supprimer les colonnes que vous ne comprenez pas",
          "Considérer automatiquement toutes les données comme correctes",
        ],
        correctAnswer: 0,
        explanation: "Avant de tirer des conclusions, il faut d’abord comprendre ce que contient le fichier et comment ses informations sont organisées.",
      },
      {
        question: "Dans un fichier de dépenses où chaque ligne correspond à une opération, que peut représenter une colonne ?",
        answers: [
          "Une information sur l’opération, comme sa date, sa catégorie ou son montant",
          "Obligatoirement un nouveau fichier",
          "Une réponse générée par l’IA",
          "Uniquement le nom de la personne qui a créé le document",
        ],
        correctAnswer: 0,
        explanation: "Une ligne représente souvent un élément et les colonnes décrivent différentes informations concernant cet élément.",
      },
      {
        question: "Quelle demande est la plus utile pour commencer avec un fichier inconnu ?",
        answers: [
          "Analyse.",
          "Dis-moi simplement ce que contient ce fichier, ce que représentent les lignes et colonnes, et signale les informations manquantes ou incohérentes.",
          "Trouve quelque chose d’intéressant.",
          "Dis-moi que tout est correct.",
        ],
        correctAnswer: 1,
        explanation: "Une demande précise donne à l’IA un objectif clair et lui demande de distinguer compréhension du fichier et conclusions.",
      },
      {
        question: "L’IA remarque une case vide dans votre fichier. Que doit-elle faire ?",
        answers: [
          "Inventer la valeur la plus probable",
          "Ignorer systématiquement la ligne",
          "Signaler l’information manquante sans inventer ce qu’elle ne connaît pas",
          "Remplacer automatiquement la valeur par zéro",
        ],
        correctAnswer: 2,
        explanation: "Une information manquante doit être signalée. L’IA ne doit pas inventer une donnée absente.",
      },
    ],
  },

  "02": {
    lessonId: "fichiers-02-questions",
    title: "Poser des questions à ses informations",
    questions: [
      {
        question: "Vous avez un fichier de dépenses. Quelle question est la plus exploitable ?",
        answers: [
          "Analyse tout.",
          "Quelles sont mes trois catégories de dépenses les plus importantes ce mois-ci ? Donne le montant de chacune.",
          "Qu’en penses-tu ?",
          "Trouve des chiffres.",
        ],
        correctAnswer: 1,
        explanation: "Une question précise indique ce que l’on cherche et le résultat attendu.",
      },
      {
        question: "L’IA affirme que vos dépenses de transport ont augmenté de 30 %. Quel bon réflexe devez-vous avoir ?",
        answers: [
          "Partager immédiatement la conclusion",
          "Lui demander quels chiffres et quelles périodes elle a comparés",
          "Lui demander de rendre la phrase plus convaincante",
          "Considérer le pourcentage comme exact parce qu’il est précis",
        ],
        correctAnswer: 1,
        explanation: "Une conclusion chiffrée doit pouvoir être reliée aux données qui la justifient.",
      },
      {
        question: "Vous ne savez pas encore quelles questions poser à un fichier. Que pouvez-vous demander à l’IA ?",
        answers: [
          "De proposer plusieurs questions utiles à partir des informations réellement présentes",
          "D’inventer des informations supplémentaires",
          "De supprimer le fichier",
          "De choisir une conclusion au hasard",
        ],
        correctAnswer: 0,
        explanation: "L’IA peut aider à explorer un fichier en proposant des questions pertinentes à partir de son contenu réel.",
      },
      {
        question: "Après une première réponse de l’IA, pouvez-vous approfondir un point particulier ?",
        answers: [
          "Non, une analyse doit toujours se faire en une seule demande",
          "Oui, vous pouvez poser des questions de suivi pour préciser ou vérifier un résultat",
          "Uniquement si le fichier contient moins de dix lignes",
          "Uniquement avec un fichier PDF",
        ],
        correctAnswer: 1,
        explanation: "Le dialogue permet d’affiner progressivement l’analyse et de vérifier les éléments importants.",
      },
    ],
  },

  "03": {
    lessonId: "fichiers-03-organiser",
    title: "Nettoyer et organiser ses informations",
    questions: [
      {
        question: "Votre fichier contient « 12/08/2026 », « 12 août 2026 » et « 2026-08-12 ». Quel traitement est pertinent ?",
        answers: [
          "Mettre les dates dans un format cohérent",
          "Supprimer toutes les dates",
          "Transformer les dates en montants",
          "Inventer une nouvelle date pour chaque ligne",
        ],
        correctAnswer: 0,
        explanation: "Uniformiser le format facilite la lecture, le classement et l’utilisation future du fichier.",
      },
      {
        question: "Deux lignes semblent identiques. Que faut-il faire avant d’en supprimer une ?",
        answers: [
          "Vérifier qu’il s’agit réellement d’un doublon",
          "Toujours supprimer la deuxième",
          "Supprimer les deux",
          "Demander à l’IA d’en inventer une troisième",
        ],
        correctAnswer: 0,
        explanation: "Deux lignes similaires ne sont pas forcément des doublons. Il faut vérifier avant toute suppression.",
      },
      {
        question: "Une catégorie est vide dans une ligne. Quelle approche est la plus sûre ?",
        answers: [
          "Demander à l’IA de l’inventer sans prévenir",
          "Identifier la valeur comme manquante et ne la compléter que si une règle ou une information fiable le permet",
          "Mettre automatiquement « Autre » dans tous les cas",
          "Supprimer toute la colonne",
        ],
        correctAnswer: 1,
        explanation: "L’objectif est d’organiser les données sans transformer une supposition en fait.",
      },
      {
        question: "Pourquoi nettoyer un fichier avant de l’utiliser pour tirer des conclusions ?",
        answers: [
          "Pour réduire le risque que des incohérences ou doublons faussent les résultats",
          "Uniquement pour changer son apparence",
          "Pour empêcher l’utilisateur de voir les données",
          "Parce que l’IA ne peut lire que des fichiers parfaits",
        ],
        correctAnswer: 0,
        explanation: "Des données incohérentes ou dupliquées peuvent conduire à des calculs et conclusions trompeurs.",
      },
    ],
  },

  "04": {
    lessonId: "fichiers-04-dashboard",
    title: "Transformer un fichier en tableau de bord",
    questions: [
      {
        question: "Quel est le rôle principal d’un tableau de bord ?",
        answers: [
          "Afficher toutes les données possibles sur une seule page",
          "Permettre de voir rapidement les informations les plus utiles",
          "Remplacer définitivement le fichier d’origine",
          "Ajouter le plus de graphiques possible",
        ],
        correctAnswer: 1,
        explanation: "Un bon tableau de bord met en avant l’essentiel pour comprendre rapidement une situation.",
      },
      {
        question: "Vous créez un suivi de budget personnel. Quel élément serait pertinent à afficher en priorité ?",
        answers: [
          "Les dépenses totales du mois",
          "Le nombre de lettres dans le nom du fichier",
          "La couleur préférée de l’utilisateur",
          "Le modèle d’ordinateur utilisé",
        ],
        correctAnswer: 0,
        explanation: "Les informations affichées doivent répondre au besoin réel de l’utilisateur.",
      },
      {
        question: "Quand un graphique est-il réellement utile ?",
        answers: [
          "Lorsqu’il aide à comprendre plus rapidement une évolution, une comparaison ou une répartition",
          "Toujours, même s’il ne montre rien d’utile",
          "Uniquement s’il contient beaucoup de couleurs",
          "Seulement dans une entreprise",
        ],
        correctAnswer: 0,
        explanation: "Le graphique est un moyen de compréhension, pas simplement un élément décoratif.",
      },
      {
        question: "Pourquoi prévoir qu’un tableau de bord puisse être actualisé ?",
        answers: [
          "Pour pouvoir continuer à l’utiliser lorsque de nouvelles informations arrivent",
          "Pour rendre le fichier plus lourd",
          "Pour changer automatiquement son titre chaque jour",
          "Parce qu’un tableau de bord ne doit jamais conserver les anciennes données",
        ],
        correctAnswer: 0,
        explanation: "Un outil réutilisable est plus utile qu’une démonstration créée uniquement pour l’exercice.",
      },
    ],
  },

  "05": {
    lessonId: "fichiers-05-decisions",
    title: "Faire ressortir ce qui mérite votre attention",
    questions: [
      {
        question: "L’IA remarque une forte hausse de vos dépenses ce mois-ci. Quelle est la meilleure réaction ?",
        answers: [
          "Conclure immédiatement que votre budget est mal géré",
          "Identifier les opérations responsables de la hausse avant d’en tirer une conclusion",
          "Supprimer les dépenses les plus élevées du fichier",
          "Demander à l’IA d’ignorer cette hausse",
        ],
        correctAnswer: 1,
        explanation: "Une anomalie ou une évolution est un signal à examiner, pas automatiquement une conclusion.",
      },
      {
        question: "Une valeur très différente des autres est-elle forcément une erreur ?",
        answers: [
          "Oui, toujours",
          "Non, elle peut être réelle et liée à un événement exceptionnel",
          "Oui, si l’IA la trouve étrange",
          "Non, donc il ne faut jamais la vérifier",
        ],
        correctAnswer: 1,
        explanation: "Une valeur inhabituelle mérite une vérification. Elle peut être erronée ou parfaitement légitime.",
      },
      {
        question: "L’IA vous donne une recommandation à partir de votre fichier. Qui garde la décision finale ?",
        answers: [
          "L’IA",
          "Le logiciel qui a créé le fichier",
          "Vous, car vous connaissez aussi le contexte que les données ne montrent pas forcément",
          "La première ligne du fichier",
        ],
        correctAnswer: 2,
        explanation: "L’IA peut aider à comprendre et suggérer, mais l’utilisateur reste responsable de la décision.",
      },
      {
        question: "Quel comportement permet de mieux vérifier une conclusion de l’IA ?",
        answers: [
          "Demander les données ou calculs qui soutiennent cette conclusion",
          "Demander une réponse plus longue",
          "Demander à l’IA d’être plus sûre d’elle",
          "Changer la couleur du graphique",
        ],
        correctAnswer: 0,
        explanation: "Une conclusion fiable doit pouvoir être reliée aux informations qui l’ont produite.",
      },
    ],
  },

  "06": {
    lessonId: "fichiers-06-projet",
    title: "Projet — Construire mon outil personnel",
    questions: [
      {
        question: "Quel est le meilleur sujet pour votre projet final ?",
        answers: [
          "Un besoin réel que vous pourrez continuer à utiliser après la formation",
          "Le sujet qui contient le plus de termes techniques",
          "Un projet choisi au hasard",
          "Un projet obligatoirement professionnel",
        ],
        correctAnswer: 0,
        explanation: "Le projet doit avant tout être utile : budget, études, activité, objectifs ou tout autre besoin réel.",
      },
      {
        question: "Avant de construire votre outil, que devez-vous définir ?",
        answers: [
          "Ce que vous souhaitez suivre ou comprendre et les informations dont vous disposez",
          "Uniquement sa couleur",
          "Le plus grand nombre de graphiques possible",
          "Une conclusion avant même d’avoir regardé les informations",
        ],
        correctAnswer: 0,
        explanation: "Un outil utile part d’un besoin clair et des informations réellement disponibles.",
      },
      {
        question: "Si votre outil utilise l’IA pour produire une conclusion importante, que devez-vous prévoir ?",
        answers: [
          "Une manière de vérifier les informations ou calculs utilisés",
          "Une règle interdisant toute vérification",
          "Une réponse automatique toujours positive",
          "La suppression du fichier d’origine",
        ],
        correctAnswer: 0,
        explanation: "Même dans votre propre outil, les conclusions importantes doivent rester vérifiables.",
      },
      {
        question: "Qu’est-ce qui montre que votre projet est réellement réussi ?",
        answers: [
          "Vous pouvez le comprendre, l’actualiser et l’utiliser pour un besoin réel",
          "Il contient beaucoup de code",
          "Il utilise le plus grand nombre possible de technologies",
          "Il est impossible à modifier",
        ],
        correctAnswer: 0,
        explanation: "Le but est de créer quelque chose de réellement utile et réutilisable, pas de rendre le projet inutilement technique.",
      },
    ],
  },
};

export default function UnderstandAIExercisePage() {
  const params = useParams<{ lesson: string }>();
  const router = useRouter();
  const supabase = createClient();

  const lessonSlug = params.lesson;
  const quiz = quizzes[lessonSlug];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    null
  );
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold">
            Exercice introuvable
          </h1>

          <Link
            href="/formation/comprendre-ia"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>

      </main>
    );
  }

  const question =
    quiz.questions[currentQuestion];

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
      quiz.questions.length - 1
    ) {
      setCurrentQuestion(
        (previousQuestion) =>
          previousQuestion + 1
      );

      setSelectedAnswer(null);
      setValidated(false);
      setSaveError("");

      return;
    }

    const finalScore = Math.round(
      (score /
        quiz.questions.length) *
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
                quiz.lessonId,
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

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setValidated(false);
    setScore(0);
    setFinished(false);
    setSaveError("");
  }

  const finalScore = Math.round(
    (score /
      quiz.questions.length) *
      100
  );

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
        : null;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10">

        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl">

          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
              passed
                ? "bg-slate-950 text-white"
                : "bg-slate-200 text-slate-700"
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
              : "Encore un petit effort"}
          </h1>

          <p className="mt-3 text-slate-500">
            {quiz.title}
          </p>

          <p className="mt-6 text-6xl font-bold">
            {finalScore}%
          </p>

          <p className="mt-4 text-slate-500">
            {score} bonne
            {score > 1 ? "s" : ""} réponse
            {score > 1 ? "s" : ""} sur{" "}
            {quiz.questions.length}.
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-left text-sm leading-6 text-slate-700">
              Félicitations. Cette leçon est validée et votre progression a été enregistrée.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-left text-sm leading-6 text-slate-700">
              Vous devez obtenir au moins 70 % pour valider cette leçon.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={restartQuiz}
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
                      `/formation/comprendre-ia/${nextLesson}`
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
                      "/dashboard"
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

  const progress =
    ((currentQuestion + 1) /
      quiz.questions.length) *
    100;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/comprendre-ia/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question{" "}
            {currentQuestion + 1} /{" "}
            {quiz.questions.length}
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
            MODULE 04 · LEÇON{" "}
            {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {quiz.title}
          </h1>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

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
                    key={answer}
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

                    <p className="leading-6">
                      {answer}
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
                Valider ma réponse
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