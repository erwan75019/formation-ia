"use client";

import { FormEvent, useRef, useState } from "react";

import { COACH_MAX_QUESTION_LENGTH } from "@/lib/training/coach/request";

type CoachResponse = { answer?: unknown; error?: unknown };

export default function LessonCoach({
  lessonId,
  lessonLabel,
}: {
  lessonId: string;
  lessonLabel: string;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) {
      setAnswer("");
      setError("Écrivez une question avant de l’envoyer.");
      textareaRef.current?.focus();
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("/api/training/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lessonId, question: normalizedQuestion }),
      });
      const data = (await response.json().catch(() => ({}))) as CoachResponse;

      if (!response.ok || typeof data.answer !== "string") {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Le Coach IA est indisponible. Réessayez dans un instant."
        );
        return;
      }

      setAnswer(data.answer);
    } catch {
      setError("Le Coach IA est indisponible. Vérifiez votre connexion puis réessayez.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          ✦
        </div>
        <div>
          <p className="font-bold">Coach IA</p>
          <p className="text-xs text-slate-400">{lessonLabel}</p>
        </div>
      </div>

      <p className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
        Posez une question sur cette leçon ou demandez un exemple supplémentaire.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor={`coach-question-${lessonId}`} className="sr-only">
          Votre question au Coach IA
        </label>
        <textarea
          ref={textareaRef}
          id={`coach-question-${lessonId}`}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={COACH_MAX_QUESTION_LENGTH}
          disabled={loading}
          className="mt-4 min-h-32 w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-300 disabled:cursor-wait disabled:bg-slate-50"
          placeholder="Votre question..."
        />
        <div className="mt-1 text-right text-xs text-slate-400">
          {question.length} / {COACH_MAX_QUESTION_LENGTH}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Le Coach réfléchit…" : "Envoyer"}
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {answer && (
          <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-emerald-900">Réponse du Coach</p>
            <p className="mt-2">{answer}</p>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}
