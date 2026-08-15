"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  id: string;
  role: "client" | "student";
  content: string;
};

type ApiHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type Evaluation = {
  globalScore: number;

  level: string;

  scores: {
    need_understanding: number;
    solution_relevance: number;
    client_value: number;
    control_and_safety: number;
    simplicity: number;
  };

  diagnosis: string;

  strengths: string[];

  weaknesses: string[];

  nextVersion: string[];
};

type TestResult = {
  result: string;

  product: {
    name: string;
    price: string;
    releaseDate: string;
    sizes: string;
    colors: string;
    availability: string;
  };
};

type OutputEvaluation = {
  globalScore: number;

  verdict: string;

  scores: {
    factualAccuracy: number;
    objectiveFit: number;
    toneFit: number;
    ctaQuality: number;
    concision: number;
  };

  summary: string;

  respected: string[];

  problems: string[];

  hallucinations: string[];

  recommendedChanges: string[];
};

type Phase =
  | "interview"
  | "solution"
  | "evaluation"
  | "prompt"
  | "test"
  | "output-evaluation";

const initialMessages: Message[] = [
  {
    id: "initial-client-message",
    role: "client",
    content:
      "On reçoit de nouvelles paires presque chaque semaine et on publie sur Instagram pour les annoncer. Le problème, c’est que je passe beaucoup de temps à trouver quoi écrire et nos publications ne sont pas toujours cohérentes. J’aimerais que ce soit beaucoup plus rapide.",
  },
];

export default function ClientSimulation() {
  const [phase, setPhase] =
    useState<Phase>("interview");

  const [messages, setMessages] =
    useState<Message[]>(
      initialMessages
    );

  const [input, setInput] =
    useState("");

  const [solution, setSolution] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [
    testResult,
    setTestResult,
  ] =
    useState<TestResult | null>(
      null
    );

  const [
    outputEvaluation,
    setOutputEvaluation,
  ] =
    useState<OutputEvaluation | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [
    evaluating,
    setEvaluating,
  ] =
    useState(false);

  const [
    testingPrompt,
    setTestingPrompt,
  ] =
    useState(false);

  const [
    evaluatingOutput,
    setEvaluatingOutput,
  ] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<Evaluation | null>(
      null
    );

  const inputRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (
      phase === "interview"
    ) {
      bottomRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",
        }
      );
    }
  }, [
    messages,
    loading,
    phase,
  ]);

  function buildHistory(
    currentMessages: Message[]
  ): ApiHistoryMessage[] {
    return currentMessages
      .slice(1)
      .map((message) => ({
        role:
          message.role ===
          "student"
            ? "user"
            : "assistant",
        content:
          message.content,
      }));
  }

  function buildConversationText() {
    return messages
      .map((message) => {
        const speaker =
          message.role ===
          "student"
            ? "APPRENANT"
            : "CLIENTE";

        return `${speaker} : ${message.content}`;
      })
      .join("\n\n");
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    const message =
      input.trim();

    if (
      !message ||
      loading
    ) {
      return;
    }

    setError("");
    setInput("");
    setLoading(true);

    const studentMessage: Message =
      {
        id: crypto.randomUUID(),
        role: "student",
        content: message,
      };

    setMessages(
      (current) => [
        ...current,
        studentMessage,
      ]
    );

    try {
      const response =
        await fetch(
          "/api/training/client-simulation",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                message,

                history:
                  buildHistory(
                    messages
                  ),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Une erreur est survenue."
        );
      }

      const clientMessage: Message =
        {
          id: crypto.randomUUID(),
          role: "client",
          content:
            data.message,
        };

      setMessages(
        (current) => [
          ...current,
          clientMessage,
        ]
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de continuer la conversation."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  async function evaluateSolution() {
    const cleanSolution =
      solution.trim();

    if (
      !cleanSolution ||
      evaluating
    ) {
      return;
    }

    setError("");
    setEvaluating(true);

    try {
      const response =
        await fetch(
          "/api/training/evaluate-solution",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                solution:
                  cleanSolution,

                conversation:
                  buildConversationText(),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'évaluer votre proposition."
        );
      }

      setEvaluation(data);

      setPhase(
        "evaluation"
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'évaluer votre proposition."
      );
    } finally {
      setEvaluating(false);
    }
  }

  async function executePrompt() {
    const cleanPrompt =
      prompt.trim();

    if (
      !cleanPrompt ||
      testingPrompt
    ) {
      return;
    }

    setTestingPrompt(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/training/test-prompt",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                prompt:
                  cleanPrompt,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'exécuter le prompt."
        );
      }

      setTestResult(data);
      setOutputEvaluation(null);

      setPhase("test");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'exécuter votre prompt."
      );
    } finally {
      setTestingPrompt(false);
    }
  }

  async function evaluateGeneratedOutput() {
    if (
      !testResult ||
      !prompt.trim() ||
      evaluatingOutput
    ) {
      return;
    }

    setEvaluatingOutput(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/training/evaluate-output",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                prompt,
                output:
                  testResult.result,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'analyser la sortie."
        );
      }

      setOutputEvaluation(
        data
      );

      setPhase(
        "output-evaluation"
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'analyser la sortie."
      );
    } finally {
      setEvaluatingOutput(
        false
      );
    }
  }

  function resetSimulation() {
    setPhase("interview");

    setMessages(
      initialMessages
    );

    setInput("");
    setSolution("");
    setPrompt("");
    setTestResult(null);
    setEvaluation(null);
    setOutputEvaluation(null);
    setError("");
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-slate-800 bg-slate-950 px-6 py-6 text-white md:px-8">

        <div className="flex flex-wrap items-center justify-between gap-5">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                Mission interactive
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                Premier service IA
              </span>

            </div>

            <h2 className="mt-4 text-2xl font-bold md:text-3xl">
              Du problème client au prototype
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Comprenez le besoin,
              concevez la solution,
              construisez le prompt,
              testez-le puis contrôlez
              réellement la qualité.
            </p>

          </div>

          <button
            type="button"
            onClick={
              resetSimulation
            }
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            Recommencer
          </button>

        </div>

        <div className="mt-7 grid grid-cols-6 gap-2">

          <PhaseStep
            number="01"
            label="Entretien"
            active={
              phase ===
              "interview"
            }
            completed={
              phase !==
              "interview"
            }
          />

          <PhaseStep
            number="02"
            label="Solution"
            active={
              phase ===
              "solution"
            }
            completed={[
              "evaluation",
              "prompt",
              "test",
              "output-evaluation",
            ].includes(
              phase
            )}
          />

          <PhaseStep
            number="03"
            label="Diagnostic"
            active={
              phase ===
              "evaluation"
            }
            completed={[
              "prompt",
              "test",
              "output-evaluation",
            ].includes(
              phase
            )}
          />

          <PhaseStep
            number="04"
            label="Prompt"
            active={
              phase ===
              "prompt"
            }
            completed={[
              "test",
              "output-evaluation",
            ].includes(
              phase
            )}
          />

          <PhaseStep
            number="05"
            label="Test"
            active={
              phase ===
              "test"
            }
            completed={
              phase ===
              "output-evaluation"
            }
          />

          <PhaseStep
            number="06"
            label="Contrôle"
            active={
              phase ===
              "output-evaluation"
            }
            completed={
              false
            }
          />

        </div>

      </div>

      {/* ENTRETIEN */}

      {phase ===
        "interview" && (
        <>

          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-8">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              ÉTAPE 1 · DÉCOUVERTE CLIENT
            </p>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Posez vos propres questions
              afin de comprendre le problème
              avant de proposer quoi que ce soit.
            </p>

          </div>

          <div className="max-h-[620px] min-h-[430px] overflow-y-auto px-6 py-7 md:px-8">

            <div className="space-y-7">

              {messages.map(
                (message) => {
                  const isClient =
                    message.role ===
                    "client";

                  return (
                    <div
                      key={
                        message.id
                      }
                      className={`flex ${
                        isClient
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >

                      <div className="max-w-[88%] md:max-w-[76%]">

                        <div
                          className={`mb-2 flex items-center gap-2 ${
                            isClient
                              ? ""
                              : "justify-end"
                          }`}
                        >

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              isClient
                                ? "bg-slate-200"
                                : "bg-slate-950 text-white"
                            }`}
                          >
                            {isClient
                              ? "👤"
                              : "V"}
                          </div>

                          <p className="text-xs font-semibold text-slate-500">
                            {isClient
                              ? "Responsable de boutique"
                              : "Vous"}
                          </p>

                        </div>

                        <div
                          className={`rounded-2xl px-5 py-4 text-sm leading-7 ${
                            isClient
                              ? "rounded-tl-md bg-slate-100 text-slate-700"
                              : "rounded-tr-md bg-slate-950 text-white"
                          }`}
                        >
                          {
                            message.content
                          }
                        </div>

                      </div>

                    </div>
                  );
                }
              )}

              {loading && (
                <p className="text-sm text-slate-400">
                  La cliente répond...
                </p>
              )}

              <div
                ref={
                  bottomRef
                }
              />

            </div>

          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-5 md:p-6">

            <form
              onSubmit={
                handleSubmit
              }
            >

              <textarea
                ref={
                  inputRef
                }
                value={input}
                disabled={
                  loading
                }
                onChange={(
                  event
                ) =>
                  setInput(
                    event.target
                      .value
                  )
                }
                placeholder="Posez une question à la cliente..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-slate-950"
              />

              <div className="mt-3 flex flex-wrap justify-between gap-3">

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={() =>
                    setPhase(
                      "solution"
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold"
                >
                  J’ai compris le besoin →
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-30"
                >
                  Envoyer
                </button>

              </div>

            </form>

            {error && (
              <ErrorMessage
                message={
                  error
                }
              />
            )}

          </div>

        </>
      )}

      {/* SOLUTION */}

      {phase ===
        "solution" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            ÉTAPE 2 · SOLUTION
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Que proposeriez-vous à cette cliente ?
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Décrivez concrètement
            comment votre solution fonctionnerait
            et ce qu’elle apporterait.
          </p>

          <textarea
            value={solution}
            onChange={(
              event
            ) =>
              setSolution(
                event.target
                  .value
              )
            }
            rows={10}
            placeholder="La cliente fournirait..., le système..., puis elle recevrait..."
            className="mt-7 w-full resize-y rounded-2xl border border-slate-200 p-5 text-sm leading-7 outline-none focus:border-slate-950"
          />

          {error && (
            <ErrorMessage
              message={
                error
              }
            />
          )}

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "interview"
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
            >
              ← Retour
            </button>

            <button
              type="button"
              onClick={
                evaluateSolution
              }
              disabled={
                !solution.trim() ||
                evaluating
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              {evaluating
                ? "Analyse..."
                : "Analyser ma solution →"}
            </button>

          </div>

        </div>
      )}

      {/* DIAGNOSTIC */}

      {phase ===
        "evaluation" &&
        evaluation && (
          <div className="p-6 md:p-8">

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

              <div className="rounded-[26px] bg-slate-950 p-7 text-white">

                <p className="text-xs tracking-[0.16em] text-slate-500">
                  NIVEAU GLOBAL
                </p>

                <p className="mt-5 text-6xl font-bold">
                  {
                    evaluation.globalScore
                  }
                </p>

                <p className="text-slate-500">
                  / 100
                </p>

                <p className="mt-6 text-lg font-semibold">
                  {
                    evaluation.level
                  }
                </p>

              </div>

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-7">

                <h3 className="text-2xl font-bold">
                  Diagnostic
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {
                    evaluation.diagnosis
                  }
                </p>

                <div className="mt-7 space-y-4">

                  <Metric
                    label="Compréhension"
                    value={
                      evaluation
                        .scores
                        .need_understanding
                    }
                  />

                  <Metric
                    label="Pertinence"
                    value={
                      evaluation
                        .scores
                        .solution_relevance
                    }
                  />

                  <Metric
                    label="Valeur client"
                    value={
                      evaluation
                        .scores
                        .client_value
                    }
                  />

                  <Metric
                    label="Fiabilité"
                    value={
                      evaluation
                        .scores
                        .control_and_safety
                    }
                  />

                  <Metric
                    label="Simplicité"
                    value={
                      evaluation
                        .scores
                        .simplicity
                    }
                  />

                </div>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <FeedbackCard
                title="✓ Ce qui fonctionne"
                items={
                  evaluation.strengths
                }
              />

              <FeedbackCard
                title="↑ Ce qui manque"
                items={
                  evaluation.weaknesses
                }
              />

            </div>

            <div className="mt-7 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  setPhase(
                    "solution"
                  )
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
              >
                ← Améliorer ma solution
              </button>

              <button
                type="button"
                onClick={() =>
                  setPhase(
                    "prompt"
                  )
                }
                className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Construire le prompt →
              </button>

            </div>

          </div>
        )}

      {/* PROMPT */}

      {phase ===
        "prompt" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            ÉTAPE 4 · MOTEUR IA
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Construisez maintenant le prompt
          </h3>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Imaginez que ce prompt sera
            utilisé derrière un formulaire
            dans un futur produit.
          </p>

          <textarea
            value={prompt}
            onChange={(
              event
            ) =>
              setPrompt(
                event.target
                  .value
              )
            }
            rows={16}
            placeholder={`Écrivez votre prompt ici...

OBJECTIF
...

CONTEXTE
...

RÈGLES
...

FORMAT
...`}
            className="mt-6 w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-6 font-mono text-sm leading-7 text-slate-200 outline-none focus:border-slate-500"
          />

          {error && (
            <ErrorMessage
              message={
                error
              }
            />
          )}

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "evaluation"
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
            >
              ← Diagnostic
            </button>

            <button
              type="button"
              disabled={
                !prompt.trim() ||
                testingPrompt
              }
              onClick={
                executePrompt
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              {testingPrompt
                ? "Exécution..."
                : "Tester sur un produit →"}
            </button>

          </div>

        </div>
      )}

      {/* TEST */}

      {phase === "test" &&
        testResult && (
          <div className="p-6 md:p-8">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              ÉTAPE 5 · TEST DU PROTOTYPE
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Voici ce que votre système produit
            </h3>

            <div className="mt-7 grid gap-6 lg:grid-cols-[320px_1fr]">

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                  DONNÉES ENTRÉES
                </p>

                <h4 className="mt-4 text-xl font-bold">
                  {
                    testResult
                      .product
                      .name
                  }
                </h4>

                <div className="mt-5 space-y-4">

                  <ProductLine
                    label="Prix"
                    value={
                      testResult
                        .product
                        .price
                    }
                  />

                  <ProductLine
                    label="Sortie"
                    value={
                      testResult
                        .product
                        .releaseDate
                    }
                  />

                  <ProductLine
                    label="Tailles"
                    value={
                      testResult
                        .product
                        .sizes
                    }
                  />

                  <ProductLine
                    label="Couleurs"
                    value={
                      testResult
                        .product
                        .colors
                    }
                  />

                  <ProductLine
                    label="Disponibilité"
                    value={
                      testResult
                        .product
                        .availability
                    }
                  />

                </div>

              </div>

              <div className="rounded-[24px] bg-slate-950 p-7 text-white">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                  SORTIE DE VOTRE SYSTÈME
                </p>

                <p className="mt-7 whitespace-pre-line text-base leading-8 text-slate-200">
                  {
                    testResult.result
                  }
                </p>

              </div>

            </div>

            {error && (
              <ErrorMessage
                message={
                  error
                }
              />
            )}

            <div className="mt-6 rounded-[24px] border border-blue-200 bg-blue-50 p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-blue-700">
                NE VOUS ARRÊTEZ PAS AU FAIT QUE ÇA FONCTIONNE
              </p>

              <h4 className="mt-3 text-xl font-bold text-blue-950">
                Contrôlez maintenant la qualité
              </h4>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-900">
                Une sortie peut sembler convaincante
                tout en contenant une information inventée,
                un mauvais ton ou un appel à l’action faible.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setPhase(
                      "prompt"
                    )
                  }
                  className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-950"
                >
                  ← Modifier mon prompt
                </button>

                <button
                  type="button"
                  disabled={
                    evaluatingOutput
                  }
                  onClick={
                    evaluateGeneratedOutput
                  }
                  className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
                >
                  {evaluatingOutput
                    ? "Contrôle..."
                    : "Contrôler la sortie →"}
                </button>

              </div>

            </div>

          </div>
        )}

      {/* CONTROLE QUALITE */}

      {phase ===
        "output-evaluation" &&
        outputEvaluation &&
        testResult && (
          <div className="p-6 md:p-8">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              ÉTAPE 6 · CONTRÔLE QUALITÉ
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Votre prototype est-il réellement utilisable ?
            </h3>

            <p className="mt-3 max-w-3xl leading-7 text-slate-500">
              Ici, on ne juge plus votre idée.
              On contrôle le résultat réellement
              produit par votre système.
            </p>

            <div className="mt-7 grid gap-6 lg:grid-cols-[290px_1fr]">

              <div className="rounded-[26px] bg-slate-950 p-7 text-white">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                  QUALITÉ DE LA SORTIE
                </p>

                <p className="mt-5 text-6xl font-bold">
                  {
                    outputEvaluation.globalScore
                  }
                </p>

                <p className="text-slate-500">
                  / 100
                </p>

                <p className="mt-6 text-lg font-semibold">
                  {
                    outputEvaluation.verdict
                  }
                </p>

              </div>

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-7">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                  INDICATEURS
                </p>

                <div className="mt-6 space-y-5">

                  <Metric
                    label="Exactitude factuelle"
                    value={
                      outputEvaluation
                        .scores
                        .factualAccuracy
                    }
                  />

                  <Metric
                    label="Respect de l'objectif"
                    value={
                      outputEvaluation
                        .scores
                        .objectiveFit
                    }
                  />

                  <Metric
                    label="Ton"
                    value={
                      outputEvaluation
                        .scores
                        .toneFit
                    }
                  />

                  <Metric
                    label="Appel à l'action"
                    value={
                      outputEvaluation
                        .scores
                        .ctaQuality
                    }
                  />

                  <Metric
                    label="Concision"
                    value={
                      outputEvaluation
                        .scores
                        .concision
                    }
                  />

                </div>

              </div>

            </div>

            <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                DIAGNOSTIC
              </p>

              <p className="mt-4 max-w-4xl leading-7 text-slate-600">
                {
                  outputEvaluation.summary
                }
              </p>

            </div>

            {outputEvaluation
              .hallucinations
              .length >
              0 ? (
              <div className="mt-6 rounded-[26px] border border-red-200 bg-red-50 p-6">

                <p className="font-bold text-red-900">
                  ⚠ Informations inventées détectées
                </p>

                <div className="mt-4 space-y-3">

                  {outputEvaluation.hallucinations.map(
                    (
                      item,
                      index
                    ) => (
                      <p
                        key={`${item}-${index}`}
                        className="text-sm leading-6 text-red-950"
                      >
                        • {item}
                      </p>
                    )
                  )}

                </div>

                <p className="mt-5 text-sm font-semibold leading-6 text-red-900">
                  Un système destiné à un client
                  doit empêcher autant que possible
                  ce type d’invention.
                </p>

              </div>
            ) : (
              <div className="mt-6 rounded-[26px] border border-emerald-200 bg-emerald-50 p-6">

                <p className="font-bold text-emerald-900">
                  ✓ Aucune hallucination factuelle détectée
                </p>

                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  La sortie semble rester dans
                  les informations réellement fournies.
                </p>

              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <FeedbackCard
                title="✓ Bien respecté"
                items={
                  outputEvaluation.respected
                }
              />

              <FeedbackCard
                title="↑ À corriger"
                items={
                  outputEvaluation.problems
                }
              />

            </div>

            {outputEvaluation
              .recommendedChanges
              .length >
              0 && (
              <div className="mt-6 rounded-[26px] border border-blue-200 bg-blue-50 p-6">

                <p className="text-xs font-bold tracking-[0.15em] text-blue-700">
                  MODIFICATIONS RECOMMANDÉES
                </p>

                <div className="mt-5 space-y-4">

                  {outputEvaluation.recommendedChanges.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex items-start gap-4"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                          {
                            index +
                            1
                          }
                        </div>

                        <p className="pt-1 text-sm leading-6 text-blue-950">
                          {
                            item
                          }
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            <div className="mt-7 rounded-[26px] bg-slate-950 p-7 text-white">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                COMPÉTENCE ACQUISE
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Tester, contrôler, améliorer
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                Vous venez de suivre le début
                d’un vrai processus de conception
                d’un service IA :
                comprendre un client,
                construire une solution,
                écrire le moteur,
                exécuter puis contrôler
                ce qu’il produit.
              </p>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  setPhase(
                    "prompt"
                  )
                }
                className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                ← Corriger mon prompt
              </button>

              <button
                type="button"
                onClick={
                  executePrompt
                }
                disabled={
                  testingPrompt
                }
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold"
              >
                Retester
              </button>

            </div>

          </div>
        )}

    </section>
  );
}

function PhaseStep({
  number,
  label,
  active,
  completed,
}: {
  number: string;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 transition ${
        active
          ? "border-white bg-white text-slate-950"
          : completed
          ? "border-emerald-900 bg-emerald-950/40 text-emerald-300"
          : "border-slate-800 bg-slate-900 text-slate-500"
      }`}
    >

      <p className="text-[10px] font-bold">
        {completed
          ? "✓"
          : number}
      </p>

      <p className="mt-1 truncate text-xs font-semibold">
        {label}
      </p>

    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <div className="flex justify-between text-sm">

        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-slate-950"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

function FeedbackCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6">

      <h4 className="font-bold">
        {title}
      </h4>

      <div className="mt-4 space-y-3">

        {items.length >
        0 ? (
          items.map(
            (item, index) => (
              <p
                key={`${item}-${index}`}
                className="text-sm leading-6 text-slate-600"
              >
                • {item}
              </p>
            )
          )
        ) : (
          <p className="text-sm text-slate-400">
            Aucun élément particulier.
          </p>
        )}

      </div>

    </div>
  );
}

function ProductLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </p>

    </div>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}