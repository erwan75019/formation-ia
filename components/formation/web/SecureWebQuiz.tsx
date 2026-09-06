"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { WebQuiz } from "@/lib/training/web/quizzes";
import type { WebQuizContinuation } from "@/lib/training/web/navigation";
import {
  getWebQuizResultPresentation,
  type WebQuizServerResult,
} from "@/lib/training/web/result";
import {
  buildWebQuizSubmission,
  createEmptyWebQuizAnswers,
  toWebQuizAnswerIndex,
} from "@/lib/training/web/submission";

export default function SecureWebQuiz({
  quiz,
  slug,
  continuation,
}: {
  quiz: WebQuiz;
  slug: string;
  continuation: WebQuizContinuation;
}) {
  const [answers, setAnswers] = useState(() =>
    createEmptyWebQuizAnswers(quiz.questions.length)
  );
  const [result, setResult] = useState<WebQuizServerResult | null>(null);
  const [error, setError] = useState("");
  const [incompleteMessage, setIncompleteMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const submissionInProgress = useRef(false);
  const questionRefs = useRef<(HTMLFieldSetElement | null)[]>([]);

  async function submit() {
    const submission = buildWebQuizSubmission(quiz, answers);
    if (!submission) {
      setIncompleteMessage(
        `Répondez aux ${quiz.questions.length} questions avant de continuer.`
      );
      const firstMissingAnswer = answers.findIndex((answer) => answer === null);
      if (firstMissingAnswer >= 0) questionRefs.current[firstMissingAnswer]?.focus();
      return;
    }
    if (submissionInProgress.current) return;
    submissionInProgress.current = true;
    setLoading(true); setError(""); setIncompleteMessage(""); setResult(null);
    try {
      const response = await fetch("/api/training/web/quiz/validate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const payload = await response.json() as WebQuizServerResult & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Validation impossible.");
      setResult(payload);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Validation impossible."); }
    finally {
      submissionInProgress.current = false;
      setLoading(false);
    }
  }

  function retry() {
    setResult(null);
    setError("");
    setIncompleteMessage("");
    setAnswers(createEmptyWebQuizAnswers(quiz.questions.length));
    requestAnimationFrame(() => questionRefs.current[0]?.focus());
  }

  const presentation = result ? getWebQuizResultPresentation(result) : null;

  return <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
    <div className="mx-auto max-w-4xl">
      <Link href={`/formation/site-web/${slug}`} className="text-sm font-semibold text-slate-600">← Retour à la leçon</Link>
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-9">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Validation sécurisée</p>
        <h1 className="mt-3 text-3xl font-bold">{quiz.title}</h1>
        <p className="mt-3 text-slate-600">Répondez aux {quiz.questions.length} questions. Le serveur calcule le score ; 70 % sont requis.</p>
        <div className="mt-8 space-y-7">{quiz.questions.map((question, questionIndex) =>
          <fieldset
            key={question.id}
            ref={(element) => { questionRefs.current[questionIndex] = element; }}
            tabIndex={-1}
            className="focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          ><legend className="font-semibold">{questionIndex + 1}. {question.prompt}</legend>
            <div className="mt-3 grid gap-2">{question.choices.map((choice, choiceIndex) =>
              <label key={choice} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-3">
                <input type="radio" name={question.id} value={choiceIndex} checked={answers[questionIndex] === choiceIndex}
                  onChange={(event) => {
                    const answer = toWebQuizAnswerIndex(event.currentTarget.value);
                    setIncompleteMessage("");
                    setAnswers((current) => current.map((value, index) => index === questionIndex ? answer : value));
                  }} />
                <span>{choice}</span>
              </label>)}</div>
          </fieldset>)}</div>
        {incompleteMessage && <p role="status" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">{incompleteMessage}</p>}
        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {result && presentation && <div className={`mt-6 rounded-xl p-4 ${presentation.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
          <p className="font-bold">{presentation.message}</p>
          <p className="mt-1 text-sm">{result.correct_count}/{result.total_questions} réponses correctes. Meilleur score : {result.best_score ?? result.score} %.</p>
        </div>}
        {presentation?.canContinue ? (
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href={continuation.href}
              aria-disabled={navigating}
              onClick={() => setNavigating(true)}
              className={`rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 ${
                navigating ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {navigating ? "Ouverture…" : continuation.label}
            </Link>
            <Link
              href="/formation/site-web"
              className="rounded-xl px-4 py-3 font-semibold text-slate-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
            >
              Retour au module
            </Link>
          </div>
        ) : (
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button type="button" disabled={loading} onClick={result ? retry : submit}
              className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
              {loading ? "Vérification…" : result ? "Réessayer" : "Faire vérifier mes réponses"}
            </button>
            <Link
              href="/formation/site-web"
              className="rounded-xl px-4 py-3 font-semibold text-slate-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
            >
              Retour au module
            </Link>
          </div>
        )}
      </section>
    </div>
  </main>;
}
