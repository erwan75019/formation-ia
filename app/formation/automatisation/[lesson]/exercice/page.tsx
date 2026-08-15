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
// QUIZ MODULE 05
// ======================================================

const quizzes: Record<string, Quiz> = {
  // ==================================================
  // LEÇON 01
  // ==================================================

  "01": {
    lessonId: "automation-01-logic",
    title: "Comprendre une automatisation",

    questions: [
      {
        question:
          "Quel élément démarre normalement une automatisation ?",

        answers: [
          "Le déclencheur",
          "Le résultat final",
          "Le bouton de validation",
          "La couleur de l'interface",
        ],

        correctAnswer: 0,

        explanation:
          "Le déclencheur est l'événement qui lance le workflow : nouvel email, formulaire reçu, fichier ajouté, date atteinte, etc.",
      },

      {
        question:
          "Vous recevez un nouvel email client. Quelle étape doit venir avant l'action finale ?",

        answers: [
          "Exécuter immédiatement une action",
          "Comprendre la demande et appliquer les règles prévues",
          "Supprimer l'email",
          "Inventer les informations manquantes",
        ],

        correctAnswer: 1,

        explanation:
          "Le workflow doit d'abord comprendre la situation avant de décider quelle action effectuer.",
      },

      {
        question:
          "Que doit faire une bonne automatisation lorsqu'elle rencontre un cas qu'elle ne sait pas traiter correctement ?",

        answers: [
          "Choisir une réponse au hasard",
          "Continuer automatiquement",
          "Prévoir une validation ou une intervention humaine",
          "Ignorer systématiquement la demande",
        ],

        correctAnswer: 2,

        explanation:
          "Un workflow fiable doit prévoir une sortie sûre lorsqu'une situation est ambiguë ou inconnue.",
      },

      {
        question:
          "Quelle chaîne représente le mieux une automatisation simple ?",

        answers: [
          "Déclencheur → décision → action → contrôle",
          "Action → déclencheur → hasard",
          "Interface → logo → action",
          "Résultat → déclencheur → suppression",
        ],

        correctAnswer: 0,

        explanation:
          "Une automatisation part d'un événement, applique une logique, produit une action et prévoit un contrôle.",
      },
    ],
  },

  // ==================================================
  // LEÇON 02
  // ==================================================

  "02": {
    lessonId: "automation-02-tri",
    title: "Trier automatiquement des demandes",

    questions: [
      {
        question:
          "Sur quoi doit reposer une règle de classement fiable ?",

        answers: [
          "Des informations observables dans le message",
          "Une intuition du système",
          "Le nombre de lettres dans le prénom",
          "Une catégorie choisie au hasard",
        ],

        correctAnswer: 0,

        explanation:
          "Une règle fiable utilise des éléments réellement présents dans la demande.",
      },

      {
        question:
          "Un client signale qu'il a été débité deux fois. Quelle priorité est la plus logique ?",

        answers: [
          "Faible",
          "Haute",
          "Aucune",
          "La même qu'une newsletter",
        ],

        correctAnswer: 1,

        explanation:
          "Un problème financier ayant un impact direct sur un client mérite généralement une attention rapide.",
      },

      {
        question:
          "Pourquoi créer des catégories comme Facturation, Commercial ou Support ?",

        answers: [
          "Uniquement pour rendre la boîte mail plus jolie",
          "Pour déterminer plus facilement l'action à effectuer ensuite",
          "Pour modifier le contenu des emails",
          "Pour supprimer automatiquement tous les messages",
        ],

        correctAnswer: 1,

        explanation:
          "Une catégorie devient utile lorsqu'elle aide le workflow à décider de la prochaine action.",
      },

      {
        question:
          "Un message ne correspond clairement à aucune règle. Que doit faire le système ?",

        answers: [
          "Le classer au hasard",
          "Le supprimer",
          "Le placer dans une catégorie de vérification manuelle",
          "Répondre automatiquement",
        ],

        correctAnswer: 2,

        explanation:
          "Les cas ambigus doivent pouvoir sortir du traitement automatique afin d'être vérifiés.",
      },
    ],
  },

  // ==================================================
  // LEÇON 03
  // ==================================================

  "03": {
    lessonId: "automation-03-extraction",
    title: "Extraire les informations importantes",

    questions: [
      {
        question:
          "Quel est le but principal d'une étape d'extraction ?",

        answers: [
          "Transformer un texte en données structurées utiles",
          "Réécrire le message avec un meilleur style",
          "Inventer les informations absentes",
          "Supprimer le texte original",
        ],

        correctAnswer: 0,

        explanation:
          "L'extraction permet d'isoler les informations dont les étapes suivantes ont réellement besoin.",
      },

      {
        question:
          'Le message dit : "J\'ai été débité deux fois de 89 €. Commande CMD-4821." Que peut-on extraire avec certitude ?',

        answers: [
          "89 € et CMD-4821",
          "L'âge du client",
          "Son adresse",
          "Son moyen de paiement exact",
        ],

        correctAnswer: 0,

        explanation:
          "Le montant et la référence de commande apparaissent explicitement dans le message.",
      },

      {
        question:
          "Le nom complet du client n'apparaît pas dans le message. Que doit enregistrer le workflow ?",

        answers: [
          "Un nom probable",
          "Le nom d'un autre client",
          "Information non fournie",
          "Un nom généré par l'IA",
        ],

        correctAnswer: 2,

        explanation:
          "Une donnée absente doit rester absente. Elle ne doit jamais être remplacée par une supposition.",
      },

      {
        question:
          "Pourquoi structurer les informations dans des champs comme montant, commande et problème ?",

        answers: [
          "Pour pouvoir les réutiliser facilement dans les prochaines étapes",
          "Pour augmenter automatiquement le prix",
          "Pour supprimer le besoin de contrôle",
          "Pour rendre le message plus long",
        ],

        correctAnswer: 0,

        explanation:
          "Des données structurées peuvent être utilisées directement par les décisions et actions du workflow.",
      },
    ],
  },

  // ==================================================
  // LEÇON 04
  // ==================================================

  "04": {
    lessonId: "automation-04-email",
    title: "Préparer des réponses avec l'IA",

    questions: [
      {
        question:
          "Pourquoi est-il utile de demander à l'IA de préparer un brouillon plutôt que d'envoyer directement le message ?",

        answers: [
          "Pour pouvoir vérifier la réponse avant qu'elle ait un effet réel",
          "Parce que les brouillons sont toujours plus longs",
          "Pour empêcher l'utilisateur de lire le message",
          "Pour supprimer toutes les règles",
        ],

        correctAnswer: 0,

        explanation:
          "Le brouillon permet de profiter de la génération de l'IA tout en conservant une étape de contrôle avant l'envoi.",
      },

      {
        question:
          "Aucun remboursement n'a encore été décidé. Que doit dire le brouillon ?",

        answers: [
          "Votre remboursement est déjà effectué",
          "Nous allons vérifier la situation",
          "Vous serez remboursé demain",
          "Le remboursement est garanti",
        ],

        correctAnswer: 1,

        explanation:
          "Le brouillon ne doit pas présenter comme certaine une action qui n'a pas encore été validée.",
      },

      {
        question:
          "Quelle information l'IA doit-elle utiliser pour rédiger une réponse ?",

        answers: [
          "Les faits réellement disponibles",
          "Des informations inventées pour rendre la réponse plus complète",
          "Les données d'un autre client",
          "Des hypothèses présentées comme certaines",
        ],

        correctAnswer: 0,

        explanation:
          "Une réponse fiable doit rester fondée sur les informations réellement disponibles.",
      },

      {
        question:
          "Quelle chaîne est la plus sûre pour traiter un email client ?",

        answers: [
          "Email → réponse automatique immédiate",
          "Email → compréhension → brouillon → vérification → envoi",
          "Email → suppression",
          "Email → paiement automatique",
        ],

        correctAnswer: 1,

        explanation:
          "La séparation entre compréhension, génération et validation permet de garder le contrôle.",
      },
    ],
  },

  // ==================================================
  // LEÇON 05
  // ==================================================

  "05": {
    lessonId: "automation-05-control",
    title: "Garder le contrôle avant d'agir",

    questions: [
      {
        question:
          "Quelle action présente le risque le plus important ?",

        answers: [
          "Classer un email",
          "Créer un résumé",
          "Déclencher un remboursement de 500 €",
          "Ajouter une étiquette interne",
        ],

        correctAnswer: 2,

        explanation:
          "Une action financière réelle peut avoir des conséquences importantes et nécessite donc davantage de contrôle.",
      },

      {
        question:
          "Quelle question aide le plus à décider si une validation humaine est nécessaire ?",

        answers: [
          "Que se passe-t-il si le système se trompe ?",
          "Quelle est la couleur du bouton ?",
          "Combien de lignes contient le workflow ?",
          "Quel est le nom du modèle d'IA ?",
        ],

        correctAnswer: 0,

        explanation:
          "Les conséquences d'une erreur permettent d'évaluer le niveau de contrôle nécessaire.",
      },

      {
        question:
          "Quelle action peut généralement être automatisée avec moins de risque ?",

        answers: [
          "Supprimer définitivement un dossier client",
          "Déclencher un paiement",
          "Classer un email dans une catégorie",
          "Signer un contrat",
        ],

        correctAnswer: 2,

        explanation:
          "Le classement interne est généralement plus facilement réversible et présente moins de conséquences.",
      },

      {
        question:
          "Pourquoi conserver un historique des actions du workflow ?",

        answers: [
          "Pour savoir ce qui a été proposé et réellement exécuté",
          "Pour augmenter automatiquement la vitesse de l'IA",
          "Pour remplacer toutes les validations humaines",
          "Pour masquer les erreurs",
        ],

        correctAnswer: 0,

        explanation:
          "La traçabilité permet de comprendre le comportement du système et de retrouver les décisions prises.",
      },
    ],
  },

  // ==================================================
  // LEÇON 06
  // ==================================================

  "06": {
    lessonId: "automation-06-workflow",
    title: "Construire un workflow complet",

    questions: [
      {
        question:
          "Pourquoi découper un workflow en plusieurs étapes ?",

        answers: [
          "Pour pouvoir comprendre et contrôler chaque transformation",
          "Pour rendre le système volontairement plus compliqué",
          "Pour cacher les erreurs",
          "Pour supprimer les règles",
        ],

        correctAnswer: 0,

        explanation:
          "Des étapes séparées rendent le workflow plus compréhensible, testable et contrôlable.",
      },

      {
        question:
          "Quelle étape doit normalement venir avant la génération d'un brouillon ?",

        answers: [
          "Comprendre ou structurer la demande",
          "Envoyer le message",
          "Supprimer l'entrée",
          "Clôturer le workflow",
        ],

        correctAnswer: 0,

        explanation:
          "Le système doit savoir ce qu'il traite avant de pouvoir générer une réponse pertinente.",
      },

      {
        question:
          "Quel workflow paraît le plus complet ?",

        answers: [
          "Réception → tri → extraction → décision → contrôle → action → historique",
          "Réception → action aléatoire",
          "Email → suppression",
          "Réception → réponse immédiate sans analyse",
        ],

        correctAnswer: 0,

        explanation:
          "Un workflow complet sépare clairement les principales responsabilités du traitement.",
      },

      {
        question:
          "Que doit prévoir un workflow lorsqu'une étape échoue ?",

        answers: [
          "Une règle de gestion de l'erreur ou une reprise humaine",
          "Une réponse inventée",
          "La suppression automatique de toutes les données",
          "Aucune action particulière",
        ],

        correctAnswer: 0,

        explanation:
          "Un système robuste prévoit les échecs et les informations manquantes au lieu de continuer aveuglément.",
      },
    ],
  },

  // ==================================================
  // LEÇON 07
  // ==================================================

  "07": {
    lessonId: "automation-07-project",
    title: "Projet · Construire votre assistant de travail",

    questions: [
      {
        question:
          "Quel est le meilleur point de départ pour construire votre assistant ?",

        answers: [
          "Une tâche réelle et répétitive à améliorer",
          "Le modèle d'IA le plus compliqué",
          "Le design du bouton principal",
          "Une technologie choisie au hasard",
        ],

        correctAnswer: 0,

        explanation:
          "Un bon projet commence par un problème concret avant de choisir la technologie.",
      },

      {
        question:
          "Votre assistant reçoit une demande mais une information essentielle manque. Que doit-il faire ?",

        answers: [
          "Inventer la donnée",
          "Continuer comme si elle existait",
          "Signaler l'information manquante ou demander une validation",
          "Supprimer automatiquement la demande",
        ],

        correctAnswer: 2,

        explanation:
          "Un assistant fiable doit reconnaître ses limites et gérer explicitement les données manquantes.",
      },

      {
        question:
          "Quels types de situations faut-il tester avant de considérer le projet fiable ?",

        answers: [
          "Uniquement un cas parfait",
          "Des cas normaux, ambigus et problématiques",
          "Uniquement les cas les plus faciles",
          "Seulement le design de l'interface",
        ],

        correctAnswer: 1,

        explanation:
          "Tester plusieurs scénarios permet d'identifier les erreurs de règles et les situations non prévues.",
      },

      {
        question:
          "Quel résultat montre le mieux que votre assistant apporte une vraie valeur ?",

        answers: [
          "Il utilise beaucoup de technologies",
          "Il permet de gagner du temps ou de réduire des erreurs sur une vraie tâche",
          "Il possède beaucoup de boutons",
          "Il produit toujours des textes très longs",
        ],

        correctAnswer: 1,

        explanation:
          "La valeur du projet vient de son utilité réelle pour l'utilisateur, pas de sa complexité technique.",
      },
    ],
  },
};

// ======================================================
// PAGE
// ======================================================

export default function AutomationExercisePage() {
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
    quizzes[lessonSlug];

  // ======================================================
  // STATE
  // ======================================================

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<number | null>(
    null
  );

  const [
    validated,
    setValidated,
  ] = useState(false);

  const [
    score,
    setScore,
  ] = useState(0);

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
            href="/formation/automatisation"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>

      </main>
    );
  }

  // ======================================================
  // QUESTION ACTUELLE
  // ======================================================

  const question =
    quiz.questions[
      currentQuestion
    ];

  const isCorrect =
    selectedAnswer ===
    question.correctAnswer;

  // ======================================================
  // VALIDER UNE RÉPONSE
  // ======================================================

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

  // ======================================================
  // QUESTION SUIVANTE
  // ======================================================

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

    // ==================================================
    // SCORE FINAL
    // ==================================================
    //
    // IMPORTANT :
    //
    // La réponse actuelle a DÉJÀ été comptabilisée
    // lorsque l'utilisateur a cliqué sur
    // "Valider ma réponse".
    //
    // On ne l'ajoute donc PAS une deuxième fois.
    // ==================================================

    const correctAnswers =
      score;

    const calculatedScore =
      Math.round(
        (
          correctAnswers /
          quiz.questions.length
        ) *
          100
      );

    // Sécurité supplémentaire :
    // aucune valeur ne peut dépasser 100.

    const finalScore =
      Math.max(
        0,
        Math.min(
          100,
          calculatedScore
        )
      );

    // ==================================================
    // VALIDATION À 70 %
    // ==================================================

    if (
      finalScore >= 70
    ) {
      setSaving(true);
      setSaveError("");

      const {
        data: {
          user,
        },
        error:
          userError,
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

      // ==================================================
      // ENREGISTREMENT SUPABASE
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

    // ==================================================
    // FIN DU QUIZ
    // ==================================================

    setFinished(true);
  }

  // ======================================================
  // RECOMMENCER
  // ======================================================

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setValidated(false);
    setScore(0);
    setFinished(false);
    setSaveError("");
  }

  // ======================================================
  // SCORE AFFICHÉ
  // ======================================================

  const finalScore =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (
            score /
            quiz.questions.length
          ) *
            100
        )
      )
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
      lessonNumber < 7
        ? String(
            lessonNumber + 1
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
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700"
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
            {quiz.title}
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
            {quiz.questions.length}.

          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-left text-sm leading-6 text-slate-700">

              <p className="font-bold">
                ✓ Leçon validée
              </p>

              <p className="mt-2">
                Votre score a été enregistré
                et la leçon suivante est maintenant
                accessible.
              </p>

            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-left text-sm leading-6 text-slate-700">

              <p className="font-bold">
                Score insuffisant
              </p>

              <p className="mt-2">
                Vous devez obtenir au moins
                70 % pour valider cette leçon.
              </p>

            </div>
          )}

          {saveError && (
            <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              {saveError}
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                type="button"
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
                  type="button"
                  onClick={() =>
                    router.push(
                      `/formation/automatisation/${nextLesson}`
                    )
                  }
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
                >
                  Leçon suivante →
                </button>
              )}

            {passed &&
              !nextLesson && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/formation/automatisation"
                    )
                  }
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
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
  // PROGRESSION DU QUIZ
  // ======================================================

  const progress =
    (
      (
        currentQuestion + 1
      ) /
      quiz.questions.length
    ) *
    100;

  // ======================================================
  // ÉCRAN QUESTION
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        {/* ==================================================
            TOP
        ================================================== */}

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/automatisation/${lessonSlug}`}
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

        {/* ==================================================
            BARRE DE PROGRESSION
        ================================================== */}

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-500"
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

        {/* ==================================================
            QUESTION
        ================================================== */}

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MODULE 05 · LEÇON{" "}
            {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {quiz.title}
          </h1>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

          {/* ==================================================
              RÉPONSES
          ================================================== */}

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
                    type="button"
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
                        ? "border-slate-950 bg-slate-100"
                        : wrong
                          ? "border-slate-400 bg-slate-50"
                          : selected
                            ? "border-slate-950 bg-slate-50"
                            : "border-slate-200 hover:border-slate-400"
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        correct
                          ? "border-slate-950 bg-slate-950 text-white"
                          : wrong
                            ? "border-slate-500 bg-slate-500 text-white"
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
                      {answer}
                    </p>

                  </button>
                );
              }
            )}

          </div>

          {/* ==================================================
              EXPLICATION
          ================================================== */}

          {validated && (
            <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-slate-700">

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
            <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              {saveError}
            </div>
          )}

          {/* ==================================================
              BOUTON
          ================================================== */}

          <div className="mt-8 flex justify-end">

            {!validated ? (
              <button
                type="button"
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
                type="button"
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
                      quiz.questions.length -
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