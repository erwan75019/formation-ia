"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { module1Quizzes } from "@/lib/training/module1/quizzes";

type ValidationResult = {
  lesson_id: string;
  score: number;
  passed: boolean;
  completed: boolean;
  correct_count: number;
  total_questions: number;
  passing_score: number;
  best_score: number | null;
};

export default function ExercisePage() {
  const params = useParams<{ lesson: string }>();
  const router = useRouter();
  const lessonSlug = params.lesson;
  const quiz = module1Quizzes[lessonSlug as keyof typeof module1Quizzes];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState("");

  if (!quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Exercice introuvable</h1>
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

  async function submitAnswers(finalAnswers: number[]) {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/training/module-1/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: quiz.lessonId,
          answers: finalAnswers,
        }),
      });
      const data = (await response.json()) as ValidationResult & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Impossible de corriger le QCM.");
      }

      setResult(data);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Impossible de corriger le QCM."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function validateAnswer() {
    if (selectedAnswer === null || submitting) {
      return;
    }

    const nextAnswers = [...answers, selectedAnswer];

    if (currentQuestion < quiz.questions.length - 1) {
      setAnswers(nextAnswers);
      setCurrentQuestion((value) => value + 1);
      setSelectedAnswer(null);
      setError("");
      return;
    }

    await submitAnswers(nextAnswers);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setResult(null);
    setError("");
  }

  if (result) {
    const lessonNumber = Number(lessonSlug);
    const nextLesson =
      lessonNumber < 5 ? String(lessonNumber + 1).padStart(2, "0") : null;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10">
        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
              result.passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {result.passed ? "✓" : "↻"}
          </div>
          <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-slate-400">
            RÉSULTAT OFFICIEL
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            {result.passed ? "Leçon validée !" : "Encore un petit effort"}
          </h1>
          <p className="mt-3 text-slate-500">{quiz.title}</p>
          <p className="mt-6 text-6xl font-bold">{result.score}%</p>
          <p className="mt-4 text-slate-500">
            {result.correct_count} bonne
            {result.correct_count > 1 ? "s" : ""} réponse
            {result.correct_count > 1 ? "s" : ""} sur {result.total_questions}.
          </p>
          <div
            className={`mt-8 rounded-2xl p-5 text-left text-sm leading-6 ${
              result.passed
                ? "bg-emerald-50 text-emerald-900"
                : "bg-orange-50 text-orange-900"
            }`}
          >
            {result.passed
              ? `Validation enregistrée. Votre meilleur score est de ${result.best_score} %.`
              : `Un score minimum de ${result.passing_score} % est nécessaire. Cette tentative n’a pas validé la leçon.`}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!result.passed && (
              <button
                onClick={restartQuiz}
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold"
              >
                Recommencer
              </button>
            )}
            {result.passed && nextLesson && (
              <button
                onClick={() => router.push(`/formation/chatgpt/${nextLesson}`)}
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                Leçon suivante →
              </button>
            )}
            {result.passed && !nextLesson && (
              <button
                onClick={() => router.push("/formation/chatgpt")}
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

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            href={`/formation/chatgpt/${lessonSlug}`}
            className="text-sm font-medium text-slate-500"
          >
            ← Retour à la leçon
          </Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-950 transition-all"
            style={{ width: `${progress}%` }}
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
            {question.choices.map((choice, index) => {
              const selected = selectedAnswer === index;

              return (
                <button
                  key={choice}
                  onClick={() => setSelectedAnswer(index)}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-slate-950 bg-slate-50"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      selected
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-6">{choice}</span>
                </button>
              );
            })}
          </div>
          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <button
              onClick={validateAnswer}
              disabled={selectedAnswer === null || submitting}
              className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {submitting
                ? "Correction sécurisée..."
                : currentQuestion === quiz.questions.length - 1
                  ? "Voir mon résultat →"
                  : "Question suivante →"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
