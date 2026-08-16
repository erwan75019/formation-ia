"use client";

import {
  useMemo,
  useState,
} from "react";

import SecureProjectEvaluation from "@/components/formation/projects/SecureProjectEvaluation";

// ======================================================
// TYPES
// ======================================================

type ExerciseField = {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  minLength?: number;
};

type EvaluationCriterion = {
  name: string;
  maxScore: number;
  description: string;
};

type EvaluationResult = {
  score: number;
  verdict: string;
  summary: string;

  criteria: {
    name: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];

  strengths: string[];
  improvements: string[];
  advice: string;
};

type PracticalExerciseProps = {
  lessonId: string;

  skill: string;
  title: string;
  context: string;
  deliverable: string;
  mission: string;

  placeholder?: string;

  hints?: string[];

  correction: string;

  successCriteria?: string[];

  advancedChallenge?: string;

  tools?: string[];

  estimatedTime?: string;

  fields?: ExerciseField[];

  evaluationCriteria?: EvaluationCriterion[];
};

// ======================================================
// COMPONENT
// ======================================================

export default function PracticalExercise({
  lessonId,

  skill,
  title,
  context,
  deliverable,
  mission,

  placeholder =
    "Écrivez votre réponse ici...",

  hints = [],

  correction,

  successCriteria = [],

  advancedChallenge,

  tools = [],

  estimatedTime =
    "10 à 15 min",

  fields = [],

  evaluationCriteria = [],
}: PracticalExerciseProps) {
  // ======================================================
  // MODE
  // ======================================================

  const structuredMode =
    fields.length > 0;

  // ======================================================
  // STATES
  // ======================================================

  const [
    answer,
    setAnswer,
  ] =
    useState("");

  const [
    fieldAnswers,
    setFieldAnswers,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(() => {
      const initial: Record<
        string,
        string
      > = {};

      fields.forEach(
        (field) => {
          initial[
            field.id
          ] = "";
        }
      );

      return initial;
    });

  const [
    showHint,
    setShowHint,
  ] =
    useState(false);

  const [
    showCorrection,
    setShowCorrection,
  ] =
    useState(false);

  const [
    evaluating,
    setEvaluating,
  ] =
    useState(false);

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<
      EvaluationResult | null
    >(null);

  const [
    evaluationError,
    setEvaluationError,
  ] =
    useState("");

  // ======================================================
  // COMPLETION
  // ======================================================

  const structuredCompletion =
    useMemo(() => {
      if (
        !structuredMode
      ) {
        return 0;
      }

      const completedFields =
        fields.filter(
          (field) => {
            const value =
              fieldAnswers[
                field.id
              ]?.trim() ?? "";

            return value.length > 0;
          }
        ).length;

      return Math.round(
        (completedFields /
          fields.length) *
          100
      );
    }, [
      fields,
      fieldAnswers,
      structuredMode,
    ]);

  const completedFieldCount =
    useMemo(() => {
      if (
        !structuredMode
      ) {
        return 0;
      }

      return fields.filter(
        (field) =>
          (
            fieldAnswers[
              field.id
            ]?.trim() ?? ""
          ).length > 0
      ).length;
    }, [
      fields,
      fieldAnswers,
      structuredMode,
    ]);

  const classicCompleted =
    answer.trim()
      .length > 0;

  const canEvaluate =
    structuredMode
      ? structuredCompletion ===
        100
      : classicCompleted;

  // ======================================================
  // ANSWERS SENT TO OLLAMA
  // ======================================================

  const answersForEvaluation =
    useMemo(() => {
      if (
        structuredMode
      ) {
        return fieldAnswers;
      }

      return {
        answer,
      };
    }, [
      structuredMode,
      fieldAnswers,
      answer,
    ]);

  // ======================================================
  // TOTAL CHARACTERS
  // ======================================================

  const totalCharacters =
    useMemo(() => {
      if (
        !structuredMode
      ) {
        return answer.length;
      }

      return Object.values(
        fieldAnswers
      ).reduce(
        (
          total,
          value
        ) =>
          total +
          value.length,
        0
      );
    }, [
      answer,
      fieldAnswers,
      structuredMode,
    ]);

  // ======================================================
  // UPDATE FIELD
  // ======================================================

  function updateField(
    id: string,
    value: string
  ) {
    setFieldAnswers(
      (previous) => ({
        ...previous,
        [id]:
          value,
      })
    );

    // si l'utilisateur modifie son travail,
    // l'ancienne note n'est plus valable
    setEvaluation(
      null
    );

    setEvaluationError(
      ""
    );

    setShowCorrection(
      false
    );
  }

  // ======================================================
  // UPDATE CLASSIC
  // ======================================================

  function updateClassicAnswer(
    value: string
  ) {
    setAnswer(
      value
    );

    setEvaluation(
      null
    );

    setEvaluationError(
      ""
    );

    setShowCorrection(
      false
    );
  }

  // ======================================================
  // EVALUATE WITH OLLAMA
  // ======================================================

  async function evaluateWork() {
    if (
      !canEvaluate ||
      evaluating
    ) {
      return;
    }

    if (
      evaluationCriteria.length ===
      0
    ) {
      setEvaluationError(
        "Aucune grille d'évaluation n'a été définie pour cet exercice."
      );

      return;
    }

    setEvaluating(
      true
    );

    setEvaluationError(
      ""
    );

    setEvaluation(
      null
    );

    try {
      const response =
        await fetch(
          "/api/training/evaluate-practical",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                lessonId,
                title,
                context,
                mission,

                answers:
                  answersForEvaluation,

                criteria:
                  evaluationCriteria,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ??
            "Erreur pendant l'évaluation."
        );
      }

      setEvaluation(
        data
      );
    } catch (
      error
    ) {
      console.error(
        "Erreur évaluation pratique :",
        error
      );

      setEvaluationError(
        error instanceof
          Error
          ? error.message
          : "Impossible d'évaluer votre livrable."
      );
    } finally {
      setEvaluating(
        false
      );
    }
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <section className="my-10 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-slate-950 px-6 py-7 text-white md:px-8">

        <div className="flex flex-wrap items-center gap-3">

          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-300">
            MISSION PRATIQUE
          </span>

          <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            Compétence métier
          </span>

          <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400">
            {
              estimatedTime
            }
          </span>

        </div>

        <h2 className="mt-5 text-2xl font-bold md:text-3xl">
          {
            title
          }
        </h2>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
            COMPÉTENCE À ACQUÉRIR
          </p>

          <p className="mt-2 leading-7 text-slate-200">
            {
              skill
            }
          </p>

        </div>

      </div>

      {/* ==================================================
          BODY
      ================================================== */}

      <div className="p-6 md:p-8">

        {/* BRIEF */}

        <div>

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            BRIEF
          </p>

          <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
            {
              context
            }
          </p>

        </div>

        {/* TOOLS */}

        {tools.length > 0 && (
          <div className="mt-7">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              OUTILS / RESSOURCES
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              {tools.map(
                (
                  tool
                ) => (
                  <span
                    key={
                      tool
                    }
                    className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
                  >
                    {
                      tool
                    }
                  </span>
                )
              )}

            </div>

          </div>
        )}

        {/* LIVRABLE */}

        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
            LIVRABLE ATTENDU
          </p>

          <p className="mt-3 whitespace-pre-line font-medium leading-7 text-slate-800">
            {
              deliverable
            }
          </p>

        </div>

        {/* MISSION */}

        <div className="mt-6 rounded-2xl bg-[#f5f6f8] p-5 md:p-6">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            VOTRE MISSION
          </p>

          <p className="mt-3 whitespace-pre-line font-medium leading-7 text-slate-800">
            {
              mission
            }
          </p>

        </div>

        {/* ==================================================
            STRUCTURED MODE
        ================================================== */}

        {structuredMode ? (
          <div className="mt-8">

            <div className="flex flex-wrap items-end justify-between gap-4">

              <div>

                <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                  ATELIER
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Construisez votre livrable
                </h3>

              </div>

              <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                {
                  structuredCompletion
                }%
              </div>

            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Complétez chaque partie comme si votre travail
              devait réellement être remis à un responsable.
            </p>

            {/* FIELD COUNTER */}

            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">

              <span>
                {
                  completedFieldCount
                }
                {" / "}
                {
                  fields.length
                }
                {" sections complétées"}
              </span>

              {structuredCompletion ===
                100 && (
                <span className="font-semibold text-slate-700">
                  Livrable complet ✓
                </span>
              )}

            </div>

            {/* PROGRESS */}

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-slate-950 transition-all duration-300"
                style={{
                  width:
                    `${structuredCompletion}%`,
                }}
              />

            </div>

            {/* FIELDS */}

            <div className="mt-7 space-y-5">

              {fields.map(
                (
                  field,
                  index
                ) => {
                  const value =
                    fieldAnswers[
                      field.id
                    ] ?? "";

                  const completed =
                    value.trim()
                      .length > 0;

                  return (
                    <div
                      key={
                        field.id
                      }
                      className="rounded-[24px] border border-slate-200 bg-white p-5"
                    >

                      <div className="flex items-start gap-4">

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            completed
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {completed
                            ? "✓"
                            : String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                        </div>

                        <div className="flex-1">

                          <label
                            htmlFor={`field-${field.id}`}
                            className="font-bold"
                          >
                            {
                              field.label
                            }
                          </label>

                          {field.description && (
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {
                                field.description
                              }
                            </p>
                          )}

                          <textarea
                            id={`field-${field.id}`}
                            value={
                              value
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                field.id,
                                event.target.value
                              )
                            }
                            placeholder={
                              field.placeholder ??
                              "Écrivez votre réponse..."
                            }
                            rows={5}
                            className="mt-4 w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 leading-7 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
                          />

                          <div className="mt-2 flex justify-between text-xs text-slate-400">

                            <span>
                              {completed
                                ? "Section complétée"
                                : "À compléter"}
                            </span>

                            <span>
                              {
                                value.length
                              }{" "}
                              caractères
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        ) : (
          <div className="mt-8">

            <label
              htmlFor="practical-answer"
              className="font-bold"
            >
              Votre travail
            </label>

            <textarea
              id="practical-answer"
              value={
                answer
              }
              onChange={(
                event
              ) =>
                updateClassicAnswer(
                  event.target.value
                )
              }
              placeholder={
                placeholder
              }
              rows={10}
              className="mt-3 w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 leading-7 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
            />

          </div>
        )}

        {/* META */}

        <div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-slate-400">

          <span>
            Travaillez comme si ce livrable allait réellement être utilisé.
          </span>

          <span>
            {
              totalCharacters
            }{" "}
            caractères
          </span>

        </div>

        {/* ==================================================
            HINTS
        ================================================== */}

        {hints.length > 0 && (
          <div className="mt-6">

            {!showHint ? (
              <button
                type="button"
                onClick={() =>
                  setShowHint(
                    true
                  )
                }
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
              >
                Besoin d’un indice ?
              </button>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
                  INDICES
                </p>

                <div className="mt-4 space-y-3">

                  {hints.map(
                    (
                      hint,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                      >

                        <span className="font-bold">
                          {
                            index +
                            1
                          }.
                        </span>

                        <p>
                          {
                            hint
                          }
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* ==================================================
            EVALUATE BUTTON
        ================================================== */}

        {lessonId !== "quotidien-05-mission" && <button
          type="button"
          disabled={
            !canEvaluate ||
            evaluating
          }
          onClick={
            evaluateWork
          }
          className="mt-8 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {evaluating
            ? "Analyse du livrable en cours..."
            : evaluation
            ? "Réévaluer mon livrable →"
            : structuredMode &&
              structuredCompletion <
                100
            ? `Complétez toutes les sections (${completedFieldCount}/${fields.length})`
            : "Faire évaluer mon livrable →"}
        </button>}

        {lessonId === "quotidien-05-mission" && (
          <SecureProjectEvaluation
            lessonId="quotidien-05-mission"
            ready={canEvaluate}
            work={answersForEvaluation}
          />
        )}

        {/* ERROR */}

        {evaluationError && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            {
              evaluationError
            }
          </div>
        )}

        {/* ==================================================
            EVALUATION RESULT
        ================================================== */}

        {evaluation && (
          <div className="mt-8 overflow-hidden rounded-[26px] border border-slate-200">

            {/* SCORE */}

            <div className="bg-slate-950 p-7 text-white">

              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                ÉVALUATION DU LIVRABLE
              </p>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-6">

                <div>

                  <p className="text-6xl font-bold">
                    {
                      evaluation.score
                    }

                    <span className="ml-1 text-2xl text-slate-500">
                      /100
                    </span>
                  </p>

                  <p className="mt-3 font-semibold text-slate-300">
                    {
                      evaluation.verdict
                    }
                  </p>

                </div>

                <div className="w-full max-w-xs">

                  <div className="mb-2 flex justify-between text-xs text-slate-400">

                    <span>
                      Qualité
                    </span>

                    <span>
                      {
                        evaluation.score
                      }%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{
                        width:
                          `${evaluation.score}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

              {evaluation.summary && (
                <p className="mt-6 max-w-3xl leading-7 text-slate-400">
                  {
                    evaluation.summary
                  }
                </p>
              )}

            </div>

            {/* DETAIL */}

            <div className="p-6 md:p-7">

              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                DÉTAIL DE LA NOTE
              </p>

              <div className="mt-5 space-y-4">

                {evaluation.criteria.map(
                  (
                    criterion
                  ) => (
                    <div
                      key={
                        criterion.name
                      }
                      className="rounded-2xl bg-slate-50 p-5"
                    >

                      <div className="flex flex-wrap items-center justify-between gap-4">

                        <p className="font-bold">
                          {
                            criterion.name
                          }
                        </p>

                        <div className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold shadow-sm">
                          {
                            criterion.score
                          }
                          {" / "}
                          {
                            criterion.maxScore
                          }
                        </div>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {
                          criterion.feedback
                        }
                      </p>

                    </div>
                  )
                )}

              </div>

              {/* STRENGTHS */}

              {evaluation.strengths.length >
                0 && (
                <div className="mt-8">

                  <h3 className="font-bold">
                    Points forts
                  </h3>

                  <div className="mt-3 space-y-2">

                    {evaluation.strengths.map(
                      (
                        strength,
                        index
                      ) => (
                        <div
                          key={
                            `${strength}-${index}`
                          }
                          className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6"
                        >

                          <span className="font-bold">
                            ✓
                          </span>

                          <span>
                            {
                              strength
                            }
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* IMPROVEMENTS */}

              {evaluation.improvements.length >
                0 && (
                <div className="mt-8">

                  <h3 className="font-bold">
                    À améliorer
                  </h3>

                  <div className="mt-3 space-y-2">

                    {evaluation.improvements.map(
                      (
                        improvement,
                        index
                      ) => (
                        <div
                          key={
                            `${improvement}-${index}`
                          }
                          className="flex gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6"
                        >

                          <span className="font-bold">
                            →
                          </span>

                          <span>
                            {
                              improvement
                            }
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* ADVICE */}

              {evaluation.advice && (
                <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">

                  <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
                    CONSEIL DU COACH
                  </p>

                  <p className="mt-3 leading-7 text-slate-300">
                    {
                      evaluation.advice
                    }
                  </p>

                </div>
              )}

              {/* CORRECTION BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowCorrection(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                className="mt-7 w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                {showCorrection
                  ? "Masquer l'exemple professionnel"
                  : "Comparer avec l'exemple professionnel"}
              </button>

            </div>

          </div>
        )}

        {/* ==================================================
            CORRECTION
        ================================================== */}

        {showCorrection &&
          evaluation && (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">

            <div className="bg-slate-100 px-5 py-5">

              <p className="font-bold text-slate-900">
                Exemple de livrable professionnel
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Comparez votre travail à cet exemple après avoir reçu votre évaluation.
              </p>

            </div>

            <div className="p-6">

              <p className="whitespace-pre-line leading-7 text-slate-700">
                {
                  correction
                }
              </p>

            </div>

          </div>
        )}

        {/* ==================================================
            BONUS
        ================================================== */}

        {evaluation &&
          advancedChallenge && (
          <div className="mt-6 rounded-[24px] bg-slate-950 p-6 text-white">

            <div className="flex items-center gap-3">

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                BONUS
              </span>

              <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
                NIVEAU SUPÉRIEUR
              </p>

            </div>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
              {
                advancedChallenge
              }
            </p>

          </div>
        )}

        {successCriteria.length >
          0 && (
          <p className="mt-5 text-xs leading-5 text-slate-400">
            Le score d’avancement et la note du livrable sont deux choses différentes : l’avancement indique si toutes les sections sont remplies, tandis que la note est calculée par le correcteur local.
          </p>
        )}

      </div>

    </section>
  );
}
