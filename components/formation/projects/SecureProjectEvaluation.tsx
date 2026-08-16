"use client";

import { useState } from "react";

import {
  projectPublicDefinitions,
  type FundamentalsProjectId,
  type ProjectWork,
} from "@/lib/training/projects/catalog";

type Result = {
  score: number;
  passed: boolean;
  cached: boolean;
  criteria: { id: string; label: string; score: number; maxScore: number; feedback: string }[];
  improvements: string[];
};

export default function SecureProjectEvaluation({
  lessonId,
  work,
  ready = true,
  blockingMessages = [],
}: {
  lessonId: FundamentalsProjectId;
  work: ProjectWork;
  ready?: boolean;
  blockingMessages?: readonly string[];
}) {
  const definition = projectPublicDefinitions[lessonId];
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit() {
    setEvaluating(true);
    setError("");
    try {
      const response = await fetch("/api/training/projects/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lessonId, work }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Évaluation impossible.");
      setResult(data as Result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Évaluation impossible.");
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <section
      id="evaluation-projet"
      className="mt-8 scroll-mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        Validation officielle sécurisée
      </p>
      <h3 className="mt-2 text-xl font-bold">{definition.title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {definition.criteria.map((criterion) => (
          <li key={criterion}>• {criterion}</li>
        ))}
      </ul>

      {!ready && blockingMessages.length > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Champs à compléter :</p>
          <ul className="mt-2 space-y-1">
            {blockingMessages.map((message) => (
              <li key={message}>• {message}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        disabled={evaluating || !ready}
        onClick={submit}
        className="mt-6 rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {evaluating
          ? "Évaluation sécurisée en cours…"
          : !ready
            ? "Complétez le projet pour l’évaluer"
            : result
              ? "Soumettre une nouvelle tentative"
              : "Faire évaluer mon projet"}
      </button>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {result && (
        <div className="mt-6 rounded-2xl bg-white p-5">
          <p className="text-2xl font-bold">{result.score} / 100</p>
          <p className={`mt-1 font-semibold ${result.passed ? "text-emerald-700" : "text-amber-700"}`}>
            {result.passed ? "Projet validé" : "Projet à améliorer"}
            {result.cached ? " — résultat déjà enregistré" : ""}
          </p>
          <div className="mt-5 space-y-4">
            {result.criteria.map((criterion) => (
              <div key={criterion.id}>
                <p className="font-semibold">{criterion.label} — {criterion.score} / {criterion.maxScore}</p>
                <p className="text-sm text-slate-600">{criterion.feedback}</p>
              </div>
            ))}
          </div>
          <h4 className="mt-6 font-bold">Points à améliorer</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {result.improvements.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}
