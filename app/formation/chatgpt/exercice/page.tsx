"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const questions = [
  {
    id: 1,
    question:
      "Quel prompt permettra probablement d'obtenir la réponse la plus précise ?",
    answers: [
      "Fais-moi un programme.",
      "Crée un programme de sport.",
      "Crée un programme de musculation pour un débutant, 3 séances par semaine de 45 minutes, avec uniquement des haltères. Présente le résultat sous forme de tableau.",
      "Donne-moi des exercices de musculation.",
    ],
    correctAnswer: 2,
    explanation:
      "Cette réponse précise l'objectif, le niveau, la fréquence, la durée, le matériel disponible et le format attendu.",
  },
  {
    id: 2,
    question: "Pourquoi est-il utile de donner du contexte à ChatGPT ?",
    answers: [
      "Pour rendre le prompt plus long.",
      "Pour permettre à ChatGPT de mieux comprendre la situation.",
      "Pour garantir que ChatGPT ne fera jamais d'erreur.",
      "Parce que tous les prompts doivent contenir au moins 100 mots.",
    ],
    correctAnswer: 1,
    explanation:
      "Le contexte aide l'IA à comprendre votre situation et à produire une réponse plus adaptée.",
  },
  {
    id: 3,
    question: "Que signifie préciser le format attendu ?",
    answers: [
      "Demander à ChatGPT d'écrire uniquement en anglais.",
      "Choisir la couleur de l'interface.",
      "Indiquer comment on souhaite recevoir la réponse : tableau, liste, mail, résumé, etc.",
      "Limiter automatiquement ChatGPT à une seule phrase.",
    ],
    correctAnswer: 2,
    explanation:
      "Le format indique la manière dont vous souhaitez que l'information soit organisée ou présentée.",
  },
];

export default function ExercisePage() {
  const supabase = createClient();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const question = questions[currentQuestion];

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
    // S'il reste encore des questions
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion(
        (previousQuestion) => previousQuestion + 1
      );

      setSelectedAnswer(null);
      setValidated(false);
      setSaveError("");

      return;
    }

    // Dernière question :
    // à ce moment-là "score" contient déjà la dernière réponse validée
    const calculatedScore = Math.round(
      (score / questions.length) * 100
    );

    // On sauvegarde seulement si la leçon est réussie
    if (calculatedScore >= 70) {
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

      const { error } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: "chatgpt-prompt-01",
            completed: true,
            score: calculatedScore,
            completed_at: new Date().toISOString(),
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
    setSaving(false);
    setSaveError("");
  }

  const finalScore = Math.round(
    (score / questions.length) * 100
  );

  // PAGE DE RÉSULTAT
  if (finished) {
    const passed = finalScore >= 70;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10 text-slate-900">
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

          <p className="mt-5 text-6xl font-bold">
            {finalScore}%
          </p>

          <p className="mt-4 text-slate-500">
            Vous avez obtenu {score} bonne
            {score > 1 ? "s" : ""} réponse
            {score > 1 ? "s" : ""} sur {questions.length}.
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm leading-6 text-emerald-900">
              Félicitations. Vous avez obtenu au moins 70 %. Votre résultat a été enregistré et la leçon est validée.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Un score minimum de 70 % est nécessaire pour valider la leçon. Relisez le cours puis recommencez le quiz.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={restartQuiz}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                Recommencer
              </button>
            )}

            <Link
              href="/formation/chatgpt"
              className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
            >
              {passed
                ? "Continuer la formation →"
                : "Retour au cours"}
            </Link>

          </div>
        </section>
      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  // PAGE DU QUIZ
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between">

          <Link
            href="/formation/chatgpt"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au cours
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} / {questions.length}
          </span>

        </div>

        {/* BARRE DE PROGRESSION */}
        <div className="mt-8">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

          </div>
        </div>

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            QUESTION{" "}
            {String(currentQuestion + 1).padStart(2, "0")}
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight">
            {question.question}
          </h1>

          <p className="mt-4 text-slate-500">
            Sélectionnez une réponse puis validez.
          </p>

          {/* RÉPONSES */}
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
                {question.explanation}
              </p>

            </div>
          )}

          {/* ERREUR SUPABASE */}
          {saveError && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {saveError}
            </div>
          )}

          {/* BOUTONS */}
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
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    questions.length - 1
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