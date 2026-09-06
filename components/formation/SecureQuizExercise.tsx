"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Quiz = {
  lessonId: string;
  title: string;
  validation: "objective_quiz" | "project_pending";
  questions: readonly {
    question: string;
    choices: readonly string[];
  }[];
};

type ValidationResult = {
  score: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  passing_score: number;
  best_score: number | null;
};

export default function SecureQuizExercise({
  quiz,
  lessonSlug,
  lessonHref,
  nextLessonHref,
  moduleHref,
  validationEndpoint = "/api/training/quiz/validate",
}: {
  quiz: Quiz | undefined;
  lessonSlug: string;
  lessonHref: string;
  nextLessonHref: string | null;
  moduleHref: string;
  validationEndpoint?: string;
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (quiz?.validation === "project_pending") {
      router.replace(`${lessonHref}#evaluation-projet`);
    }
  }, [lessonHref, quiz?.validation, router]);

  if (!quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Exercice introuvable</h1>
          <Link
            href={moduleHref}
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>
        </div>
      </main>
    );
  }

  async function submitAnswers(finalAnswers: number[]) {
    if (quiz?.validation === "project_pending") {
      router.replace(`${lessonHref}#evaluation-projet`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(validationEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: quiz?.lessonId, answers: finalAnswers }),
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
    if (!quiz || selectedAnswer === null || submitting) return;

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

  if (quiz.validation === "project_pending") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10">
        <p className="text-sm font-medium text-slate-500">
          Ouverture de l’interface officielle du projet…
        </p>
      </main>
    );
  }

  if (result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10">
        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${result.passed ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
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
            {result.correct_count} / {result.total_questions} bonnes réponses
          </p>
          <div className={`mt-8 rounded-2xl p-5 text-left text-sm leading-6 ${result.passed ? "bg-emerald-50 text-emerald-900" : "bg-orange-50 text-orange-900"}`}>
            {result.passed
              ? `Validation enregistrée. Meilleur score : ${result.best_score} %.`
              : `Le seuil serveur est de ${result.passing_score} %. Cette tentative n’a créé aucune validation.`}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!result.passed && (
              <button onClick={restartQuiz} className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold">
                Recommencer
              </button>
            )}
            {result.passed && nextLessonHref && (
              <button onClick={() => router.push(nextLessonHref)} className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white">
                Leçon suivante →
              </button>
            )}
            {result.passed && !nextLessonHref && (
              <button onClick={() => router.push(moduleHref)} className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white">
                Retour au module ✓
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
          <Link href={lessonHref} className="text-sm font-medium text-slate-500">
            ← Retour à la leçon
          </Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-slate-950 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            LEÇON {lessonSlug} · EXERCICE
          </p>
          <h1 className="mt-3 text-lg font-semibold text-slate-500">{quiz.title}</h1>
          <h2 className="mt-6 text-3xl font-bold leading-tight">{question.question}</h2>
          <div className="mt-8 space-y-4">
            {question.choices.map((choice, index) => {
              const selected = selectedAnswer === index;
              return (
                <button key={choice} onClick={() => setSelectedAnswer(index)} className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${selected ? "border-slate-950 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300"}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-6">{choice}</span>
                </button>
              );
            })}
          </div>
          {error && <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <div className="mt-8 flex justify-end">
            <button onClick={validateAnswer} disabled={selectedAnswer === null || submitting} className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">
              {submitting ? "Correction sécurisée..." : currentQuestion === quiz.questions.length - 1 ? "Voir mon résultat →" : "Question suivante →"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
