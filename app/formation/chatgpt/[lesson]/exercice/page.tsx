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
    lessonId: "chatgpt-01-intro",
    title: "Qu'est-ce que ChatGPT ?",
    questions: [
      {
        question: "Qu'est-ce que ChatGPT ?",
        answers: [
          "Un moteur de recherche classique",
          "Un assistant basé sur l'intelligence artificielle",
          "Un réseau social",
          "Un logiciel de montage vidéo",
        ],
        correctAnswer: 1,
        explanation:
          "ChatGPT est un assistant basé sur l'intelligence artificielle capable de comprendre des instructions et de générer des réponses.",
      },
      {
        question: "ChatGPT peut-il parfois donner une réponse incorrecte ?",
        answers: [
          "Non, jamais",
          "Uniquement avec un compte gratuit",
          "Oui, il peut se tromper",
          "Uniquement lorsqu'on écrit en français",
        ],
        correctAnswer: 2,
        explanation:
          "ChatGPT peut produire des informations incorrectes. Il est donc important de vérifier les informations importantes.",
      },
      {
        question: "Quelle utilisation correspond bien à ChatGPT ?",
        answers: [
          "Lui demander d'expliquer un concept",
          "Lui confier automatiquement toutes ses décisions importantes",
          "Considérer toutes ses réponses comme forcément vraies",
          "L'utiliser uniquement pour traduire des mots",
        ],
        correctAnswer: 0,
        explanation:
          "ChatGPT peut notamment expliquer, résumer, rédiger, organiser des idées et aider à apprendre.",
      },
    ],
  },

  "02": {
    lessonId: "chatgpt-02-interface",
    title: "Découvrir l'interface",
    questions: [
      {
        question: "Pourquoi créer une nouvelle conversation dans ChatGPT ?",
        answers: [
          "Pour changer son mot de passe",
          "Pour commencer un nouveau sujet dans un contexte séparé",
          "Pour supprimer son compte",
          "Pour rendre automatiquement ChatGPT plus intelligent",
        ],
        correctAnswer: 1,
        explanation:
          "Une nouvelle conversation permet de démarrer un nouveau contexte, ce qui est pratique lorsque vous changez de sujet.",
      },
      {
        question: "À quoi sert principalement la zone de saisie ?",
        answers: [
          "À écrire vos demandes à ChatGPT",
          "À modifier votre adresse email",
          "À installer ChatGPT",
          "À consulter uniquement l'historique",
        ],
        correctAnswer: 0,
        explanation:
          "La zone de saisie permet d'écrire vos questions et vos instructions.",
      },
      {
        question: "Pourquoi l'historique des conversations peut-il être utile ?",
        answers: [
          "Il augmente automatiquement la vitesse d'Internet",
          "Il permet de retrouver certaines conversations",
          "Il garantit que toutes les réponses sont exactes",
          "Il remplace votre mot de passe",
        ],
        correctAnswer: 1,
        explanation:
          "L'historique permet notamment de retrouver et reprendre certaines conversations.",
      },
    ],
  },

  "03": {
    lessonId: "chatgpt-03-prompt",
    title: "Écrire son premier prompt",
    questions: [
      {
        question:
          "Quel prompt permettra probablement d'obtenir la réponse la plus précise ?",
        answers: [
          "Fais-moi un programme.",
          "Crée un programme de sport.",
          "Crée un programme de musculation pour un débutant, 3 séances par semaine de 45 minutes, avec uniquement des haltères. Présente le résultat sous forme de tableau.",
          "Donne-moi des exercices.",
        ],
        correctAnswer: 2,
        explanation:
          "Cette demande fournit un objectif précis ainsi que plusieurs informations utiles à la réponse.",
      },
      {
        question: "Qu'est-ce qu'un prompt ?",
        answers: [
          "Une instruction ou une demande envoyée à l'IA",
          "Le mot de passe de votre compte",
          "Une erreur produite par ChatGPT",
          "Un type d'abonnement",
        ],
        correctAnswer: 0,
        explanation:
          "Un prompt correspond à l'instruction, la question ou la demande que vous adressez à l'IA.",
      },
      {
        question: "Un bon prompt doit généralement être...",
        answers: [
          "Le plus vague possible",
          "Clair et suffisamment précis",
          "Obligatoirement très long",
          "Écrit uniquement en anglais",
        ],
        correctAnswer: 1,
        explanation:
          "Une instruction claire et suffisamment précise aide ChatGPT à comprendre ce que vous attendez.",
      },
    ],
  },

  "04": {
    lessonId: "chatgpt-04-contexte",
    title: "Donner du contexte",
    questions: [
      {
        question: "Pourquoi donner du contexte à ChatGPT ?",
        answers: [
          "Pour rendre le prompt plus long",
          "Pour l'aider à mieux comprendre votre situation",
          "Pour garantir une réponse toujours vraie",
          "Pour changer l'interface",
        ],
        correctAnswer: 1,
        explanation:
          "Le contexte fournit à l'IA les informations nécessaires pour mieux adapter sa réponse à votre situation.",
      },
      {
        question: "Quel prompt fournit le meilleur contexte ?",
        answers: [
          "Explique Python.",
          "Parle-moi de programmation.",
          "Je débute totalement en programmation. Explique-moi les variables Python avec un exemple très simple.",
          "Python ?",
        ],
        correctAnswer: 2,
        explanation:
          "Le troisième prompt indique notamment le niveau de la personne et précisément ce qu'elle souhaite comprendre.",
      },
      {
        question:
          "Quelle information peut être utile comme contexte pour demander un programme d'apprentissage ?",
        answers: [
          "Votre niveau actuel",
          "La couleur de votre téléphone",
          "Le niveau de batterie de votre ordinateur",
          "Aucune information",
        ],
        correctAnswer: 0,
        explanation:
          "Votre niveau actuel permet à l'IA d'adapter le programme à vos connaissances.",
      },
    ],
  },

  "05": {
    lessonId: "chatgpt-05-format",
    title: "Demander un format précis",
    questions: [
      {
        question: "Que signifie préciser le format attendu ?",
        answers: [
          "Choisir la couleur de ChatGPT",
          "Indiquer comment la réponse doit être présentée",
          "Changer son mot de passe",
          "Écrire obligatoirement 100 mots",
        ],
        correctAnswer: 1,
        explanation:
          "Le format décrit la manière dont vous souhaitez recevoir la réponse : liste, tableau, email, résumé, etc.",
      },
      {
        question:
          "Quelle instruction demande explicitement un format particulier ?",
        answers: [
          "Explique-moi ce sujet.",
          "Parle-moi de ce sujet.",
          "Résume ce sujet.",
          "Présente les avantages et inconvénients dans un tableau à deux colonnes.",
        ],
        correctAnswer: 3,
        explanation:
          "Cette instruction indique précisément la structure attendue : un tableau à deux colonnes.",
      },
      {
        question:
          "Quel format peut être pratique pour obtenir une suite d'étapes à effectuer ?",
        answers: [
          "Une liste numérotée",
          "Une phrase sans ponctuation",
          "Un texte volontairement désorganisé",
          "Aucun format",
        ],
        correctAnswer: 0,
        explanation:
          "Une liste numérotée est particulièrement adaptée à une procédure réalisée étape par étape.",
      },
    ],
  },
};

export default function ExercisePage() {
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
            href="/formation/chatgpt"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>
        </div>
      </main>
    );
  }

  const question = quiz.questions[currentQuestion];

  const isCorrect =
    selectedAnswer === question.correctAnswer;

  function validateAnswer() {
    if (selectedAnswer === null || validated) {
      return;
    }

    if (selectedAnswer === question.correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }

    setValidated(true);
  }

  async function nextQuestion() {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(
        (previousQuestion) => previousQuestion + 1
      );

      setSelectedAnswer(null);
      setValidated(false);
      setSaveError("");

      return;
    }

    const finalScore = Math.round(
      (score / quiz.questions.length) * 100
    );

    if (finalScore >= 70) {
      setSaving(true);
      setSaveError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSaving(false);
        setSaveError(
          "Vous devez être connecté pour enregistrer votre progression."
        );
        return;
      }

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: quiz.lessonId,
            completed: true,
            score: finalScore,
            completed_at: now,
            last_viewed_at: now,
          },
          {
            onConflict: "user_id,lesson_id",
          }
        );

      setSaving(false);

      if (error) {
        console.error("Erreur Supabase :", error);

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
    (score / quiz.questions.length) * 100
  );

  if (finished) {
    const passed = finalScore >= 70;

    const lessonNumber = Number(lessonSlug);

    const nextLesson =
      lessonNumber < 5
        ? String(lessonNumber + 1).padStart(2, "0")
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
            {score} bonne{score > 1 ? "s" : ""} réponse
            {score > 1 ? "s" : ""} sur{" "}
            {quiz.questions.length}.
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm leading-6 text-emerald-900">
              Félicitations. Cette leçon est maintenant enregistrée
              comme terminée.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Vous devez obtenir au moins 70 % pour valider cette
              leçon.
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

            {passed && nextLesson && (
              <button
                onClick={() =>
                  router.push(
                    `/formation/chatgpt/${nextLesson}`
                  )
                }
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                Leçon suivante →
              </button>
            )}

            {passed && !nextLesson && (
              <button
                onClick={() =>
                  router.push("/formation/chatgpt")
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

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/chatgpt/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} /{" "}
            {quiz.questions.length}
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
            LEÇON {lessonSlug} · EXERCICE
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {quiz.title}
          </h1>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

          <div className="mt-8 space-y-4">

            {question.answers.map((answer, index) => {
              const selected =
                selectedAnswer === index;

              const correct =
                validated &&
                index === question.correctAnswer;

              const wrong =
                validated &&
                selected &&
                index !== question.correctAnswer;

              return (
                <button
                  key={answer}
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
                    {String.fromCharCode(65 + index)}
                  </div>

                  <p className="leading-6">
                    {answer}
                  </p>

                </button>
              );
            })}

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
                disabled={selectedAnswer === null}
                className={`rounded-2xl px-7 py-4 font-semibold transition ${
                  selectedAnswer === null
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "bg-slate-950 text-white hover:scale-[1.02]"
                }`}
              >
                Valider ma réponse
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={saving}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    quiz.questions.length - 1
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