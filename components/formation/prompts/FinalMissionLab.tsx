"use client";

import Link from "next/link";

import SecureProjectEvaluation from "@/components/formation/projects/SecureProjectEvaluation";
import {
  promptsProjectFields,
  type PublicProjectField,
} from "@/lib/training/projects/catalog";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  id: string;

  role:
    | "client"
    | "student";

  content: string;
};

type HistoryMessage = {
  role:
    | "user"
    | "assistant";

  content: string;
};

type TestLead = {
  name: string;
  channel: string;
  message: string;
};

type FinalEvaluation = {
  globalScore: number;

  level: string;

  scores: {
    discovery: number;
    solution: number;
    promptQuality: number;
    outputQuality: number;
    reliability: number;
    businessValue: number;
  };

  summary: string;

  strengths: string[];

  weaknesses: string[];

  clientValue: string;

  nextStep: string;
};

type Phase =
  | "mission"
  | "interview"
  | "solution"
  | "prompt"
  | "test"
  | "evaluation"
  | "service";

const initialMessages: Message[] =
  [
    {
      id:
        "client-start",

      role:
        "client",

      content:
        "Je gère une salle de sport indépendante et je passe beaucoup trop de temps à répondre aux messages Instagram et aux emails. On me pose souvent les mêmes questions et ça me prend une bonne partie de la journée. J’aimerais trouver une manière de gérer ça plus efficacement sans perdre le côté humain.",
    },
  ];

export default function FinalMissionLab() {
  const [
    phase,
    setPhase,
  ] =
    useState<Phase>(
      "mission"
    );

  const [
    messages,
    setMessages,
  ] =
    useState<Message[]>(
      initialMessages
    );

  const [
    input,
    setInput,
  ] =
    useState("");

  const [
    solution,
    setSolution,
  ] =
    useState("");

  const [
    prompt,
    setPrompt,
  ] =
    useState("");

  const [
    output,
    setOutput,
  ] =
    useState("");

  const [
    testLead,
    setTestLead,
  ] =
    useState<TestLead | null>(
      null
    );

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<FinalEvaluation | null>(
      null
    );

  const [
    projectId,
    setProjectId,
  ] =
    useState<string | null>(
      null
    );

  const [
    projectSaved,
    setProjectSaved,
  ] =
    useState(false);

  const [
    projectSaveError,
    setProjectSaveError,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (
      phase ===
      "interview"
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

  function buildHistory(): HistoryMessage[] {
    return messages
      .slice(1)
      .map(
        (
          message
        ) => ({
          role:
            message.role ===
            "student"
              ? "user"
              : "assistant",

          content:
            message.content,
        })
      );
  }

  function conversationText() {
    return messages
      .map(
        (
          message
        ) =>
          `${
            message.role ===
            "student"
              ? "APPRENANT"
              : "CLIENTE"
          } : ${message.content}`
      )
      .join(
        "\n\n"
      );
  }

  const projectWork = {
    interview: conversationText(),
    solution,
    prompt,
    output,
  };

  const projectReady = promptsProjectFields.every((field) => {
    const length = projectWork[field.key].trim().length;
    return length >= field.minLength && length <= field.maxLength;
  });

  const projectBlockingMessages = promptsProjectFields.flatMap((field) => {
    const length = projectWork[field.key].trim().length;
    if (length < field.minLength) {
      return [`${field.label} : ${length}/${field.minLength} caractères.`];
    }
    if (length > field.maxLength) {
      return [`${field.label} : maximum ${field.maxLength} caractères dépassé.`];
    }
    return [];
  });

  async function sendClientMessage(
    event: FormEvent
  ) {
    event.preventDefault();

    const clean =
      input.trim();

    if (
      !clean ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setInput("");

    const history =
      buildHistory();

    const studentMessage: Message =
      {
        id:
          crypto.randomUUID(),

        role:
          "student",

        content:
          clean,
      };

    setMessages(
      (
        current
      ) => [
        ...current,
        studentMessage,
      ]
    );

    try {
      const response =
        await fetch(
          "/api/training/final-mission",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action:
                  "client",

                message:
                  clean,

                history,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Impossible de continuer la conversation."
        );
      }

      setMessages(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            role:
              "client",

            content:
              data.message,
          },
        ]
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de continuer la conversation."
      );
    } finally {
      setLoading(false);
    }
  }

  async function runService() {
    if (
      !prompt.trim() ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/training/final-mission",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action:
                  "run",

                prompt,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Impossible de tester le service."
        );
      }

      setOutput(
        data.output
      );

      setTestLead(
        data.testLead
      );

      setProjectSaved(
        false
      );

      setProjectSaveError(
        ""
      );

      setPhase(
        "test"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de tester le service."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveProject(
    finalEvaluation: FinalEvaluation
  ) {
    try {
      setProjectSaveError(
        ""
      );

      setProjectSaved(
        false
      );

      const response =
        await fetch(
          "/api/projects",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                moduleId:
                  "prompts",

                lessonId:
                  "prompts-05-project",

                title:
                  "Assistant de réponse aux prospects",

                company:
                  "Pulse Studio",

                projectType:
                  "ai_service",

                description:
                  "Service IA conçu pour préparer des réponses fiables et naturelles aux messages des prospects d'une salle de sport.",

                solution,

                prompt,

                output,

                clientValue:
                  finalEvaluation.clientValue,

                nextStep:
                  finalEvaluation.nextStep,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Impossible de sauvegarder le projet."
        );
      }

      if (
        !data.project?.id
      ) {
        throw new Error(
          "Le projet a été sauvegardé mais aucun identifiant n'a été retourné."
        );
      }

      setProjectId(
        data.project.id
      );

      setProjectSaved(
        true
      );

      setProjectSaveError(
        ""
      );
    } catch (error) {
      console.error(
        "Sauvegarde projet :",
        error
      );

      setProjectSaved(
        false
      );

      setProjectSaveError(
        error instanceof Error
          ? error.message
          : "Impossible de sauvegarder le projet."
      );
    }
  }

  async function evaluateMission() {
    if (
      !output ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    setProjectSaved(
      false
    );

    setProjectSaveError(
      ""
    );

    try {
      const response =
        await fetch(
          "/api/training/final-mission",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action:
                  "evaluate",

                solution,

                prompt,

                output,

                conversation:
                  conversationText(),
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Impossible d'évaluer la mission."
        );
      }

      const finalEvaluation =
        data as FinalEvaluation;

      setEvaluation(
        finalEvaluation
      );

      setPhase(
        "evaluation"
      );

      await saveProject(
        finalEvaluation
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'évaluer la mission."
      );
    } finally {
      setLoading(false);
    }
  }

  async function retryProjectSave() {
    if (
      !evaluation ||
      loading
    ) {
      return;
    }

    setLoading(true);

    await saveProject(
      evaluation
    );

    setLoading(false);
  }

  function reset() {
    setPhase(
      "mission"
    );

    setMessages(
      initialMessages
    );

    setInput("");

    setSolution("");

    setPrompt("");

    setOutput("");

    setTestLead(
      null
    );

    setEvaluation(
      null
    );

    setProjectId(
      null
    );

    setProjectSaved(
      false
    );

    setProjectSaveError(
      ""
    );

    setError("");
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-slate-950 px-6 py-7 text-white md:px-8">

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
                Mission finale
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                Autonomie
              </span>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Construisez votre premier service IA de A à Z
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Cette fois,
              personne ne vous donne
              la solution.
              Vous devez conduire
              la mission jusqu’au prototype.
            </p>

          </div>

          <button
            type="button"
            onClick={
              reset
            }
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
          >
            Recommencer
          </button>

        </div>

        <div className="mt-7 grid grid-cols-7 gap-2">

          <Step
            number="01"
            label="Mission"
            active={
              phase ===
              "mission"
            }
            completed={
              phase !==
              "mission"
            }
          />

          <Step
            number="02"
            label="Entretien"
            active={
              phase ===
              "interview"
            }
            completed={[
              "solution",
              "prompt",
              "test",
              "evaluation",
              "service",
            ].includes(
              phase
            )}
          />

          <Step
            number="03"
            label="Solution"
            active={
              phase ===
              "solution"
            }
            completed={[
              "prompt",
              "test",
              "evaluation",
              "service",
            ].includes(
              phase
            )}
          />

          <Step
            number="04"
            label="Prompt"
            active={
              phase ===
              "prompt"
            }
            completed={[
              "test",
              "evaluation",
              "service",
            ].includes(
              phase
            )}
          />

          <Step
            number="05"
            label="Test"
            active={
              phase ===
              "test"
            }
            completed={[
              "evaluation",
              "service",
            ].includes(
              phase
            )}
          />

          <Step
            number="06"
            label="Audit"
            active={
              phase ===
              "evaluation"
            }
            completed={
              phase ===
              "service"
            }
          />

          <Step
            number="07"
            label="Service"
            active={
              phase ===
              "service"
            }
            completed={
              false
            }
          />

        </div>

      </div>

      {/* ======================================================
          MISSION
      ====================================================== */}

      {phase ===
        "mission" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            NOUVEAU CLIENT
          </p>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">

            <div>

              <h3 className="text-3xl font-bold">
                Pulse Studio
              </h3>

              <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                Une salle de sport indépendante
                vous contacte parce que son équipe
                perd beaucoup de temps à gérer
                les demandes des prospects.
              </p>

              <div className="mt-6 rounded-[24px] bg-slate-50 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    👤
                  </div>

                  <p className="font-bold">
                    Responsable de Pulse Studio
                  </p>

                </div>

                <p className="mt-5 text-sm leading-7 text-slate-700">
                  « Je passe énormément
                  de temps à répondre aux messages.
                  On me pose souvent les mêmes questions,
                  mais je veux quand même garder
                  des réponses naturelles
                  et éviter de donner
                  de mauvaises informations. »
                </p>

              </div>

            </div>

            <aside className="rounded-[24px] bg-slate-950 p-6 text-white">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                VOTRE OBJECTIF
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Découvrez suffisamment
                le fonctionnement de l’entreprise
                pour proposer une solution
                réellement utile.
              </p>

              <div className="mt-6 border-t border-slate-800 pt-5">

                <p className="text-xs leading-5 text-slate-500">
                  Aucun nombre de questions
                  n’est imposé.
                </p>

              </div>

            </aside>

          </div>

          <button
            type="button"
            onClick={() =>
              setPhase(
                "interview"
              )
            }
            className="mt-7 rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white"
          >
            Rencontrer la cliente →
          </button>

        </div>
      )}

      {/* ======================================================
          INTERVIEW
      ====================================================== */}

      {phase ===
        "interview" && (
        <>

          <div className="max-h-[620px] min-h-[440px] overflow-y-auto p-6 md:p-8">

            <div className="space-y-7">

              {messages.map(
                (
                  message
                ) => {
                  const client =
                    message.role ===
                    "client";

                  return (
                    <div
                      key={
                        message.id
                      }
                      className={`flex ${
                        client
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >

                      <div className="max-w-[85%]">

                        <p
                          className={`mb-2 text-xs font-semibold text-slate-400 ${
                            client
                              ? ""
                              : "text-right"
                          }`}
                        >
                          {client
                            ? "Responsable Pulse Studio"
                            : "Vous"}
                        </p>

                        <div
                          className={`rounded-2xl px-5 py-4 text-sm leading-7 ${
                            client
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
                sendClientMessage
              }
            >

              <textarea
                value={
                  input
                }
                onChange={(
                  event
                ) =>
                  setInput(
                    event.target
                      .value
                  )
                }
                rows={3}
                placeholder="Posez votre question..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-slate-950"
              />

              <FieldLengthStatus
                field={promptsProjectFields[0]}
                value={projectWork.interview}
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
                  J’ai assez d’informations →
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
              <ErrorBox
                message={
                  error
                }
              />
            )}

          </div>

        </>
      )}

      {/* ======================================================
          SOLUTION
      ====================================================== */}

      {phase ===
        "solution" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            CONCEPTION
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Que vendriez-vous réellement à cette cliente ?
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Ne donnez pas simplement
            le nom d’une technologie.
            Expliquez comment votre solution
            fonctionnerait dans son quotidien.
          </p>

          <textarea
            value={
              solution
            }
            onChange={(
              event
            ) =>
              setSolution(
                event.target
                  .value
              )
            }
            rows={12}
            maxLength={promptsProjectFields[1].maxLength}
            placeholder="Décrivez votre solution..."
            className="mt-7 w-full resize-y rounded-[24px] border border-slate-200 p-5 text-sm leading-7 outline-none focus:border-slate-950"
          />

          <FieldLengthStatus
            field={promptsProjectFields[1]}
            value={solution}
          />

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "interview"
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
            >
              ← Retourner voir la cliente
            </button>

            <button
              type="button"
              disabled={
                solution.trim().length < promptsProjectFields[1].minLength
              }
              onClick={() =>
                setPhase(
                  "prompt"
                )
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              Construire le moteur →
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          PROMPT
      ====================================================== */}

      {phase ===
        "prompt" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            CONSTRUCTION
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Écrivez le prompt de votre service
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Vous disposez uniquement
            de ce que vous avez appris
            pendant la mission.
            Construisez le comportement
            du futur système.
          </p>

          <textarea
            value={
              prompt
            }
            onChange={(
              event
            ) => {
              setPrompt(
                event.target.value
              );

              setProjectSaved(
                false
              );
            }}
            rows={18}
            maxLength={promptsProjectFields[2].maxLength}
            placeholder={`Écrivez votre prompt...

OBJECTIF
...

CONTEXTE
...

INFORMATIONS DISPONIBLES
...

RÈGLES
...

FORMAT
...`}
            className="mt-7 w-full resize-y rounded-[24px] border border-slate-800 bg-slate-950 p-6 font-mono text-sm leading-7 text-slate-200 outline-none"
          />

          <FieldLengthStatus
            field={promptsProjectFields[2]}
            value={prompt}
          />

          {error && (
            <ErrorBox
              message={
                error
              }
            />
          )}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "solution"
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
            >
              ← Solution
            </button>

            <button
              type="button"
              disabled={
                prompt.trim().length < promptsProjectFields[2].minLength ||
                loading
              }
              onClick={
                runService
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              {loading
                ? "Test..."
                : "Tester mon service →"}
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          TEST
      ====================================================== */}

      {phase ===
        "test" &&
        testLead && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            TEST RÉEL
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Une prospect vient d’écrire
          </h3>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                MESSAGE REÇU
              </p>

              <p className="mt-4 font-bold">
                {
                  testLead.name
                }
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {
                  testLead.channel
                }
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-700">
                {
                  testLead.message
                }
              </p>

            </div>

            <div className="rounded-[24px] bg-slate-950 p-6 text-white">

              <div className="flex items-center justify-between gap-4">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                  VOTRE SYSTÈME
                </p>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  Généré
                </span>

              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-200">
                {output}
              </p>

              <FieldLengthStatus
                field={promptsProjectFields[3]}
                value={output}
                dark
              />

            </div>

          </div>

          {error && (
            <ErrorBox
              message={
                error
              }
            />
          )}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "prompt"
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
            >
              ← Corriger le prompt
            </button>

            <button
              type="button"
              disabled={
                loading
              }
              onClick={
                evaluateMission
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              {loading
                ? "Audit..."
                : "Faire auditer ma mission →"}
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          AUDIT
      ====================================================== */}

      {phase ===
        "evaluation" &&
        evaluation && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            AUDIT FINAL
          </p>

          {projectSaved ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 p-5">

              <div>

                <p className="text-sm font-bold text-slate-950">
                  ✓ Projet sauvegardé dans votre espace
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Une nouvelle version remplacera automatiquement l’ancienne.
                </p>

              </div>

              {projectId && (
                <Link
                  href={`/projets/${projectId}`}
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Voir le projet →
                </Link>
              )}

            </div>
          ) : projectSaveError ? (
            <div className="mt-5 rounded-[22px] border border-amber-200 bg-amber-50 p-5">

              <p className="text-sm font-bold text-amber-950">
                Le projet n’a pas pu être sauvegardé.
              </p>

              <p className="mt-2 text-xs leading-5 text-amber-800">
                {projectSaveError}
              </p>

              <button
                type="button"
                disabled={
                  loading
                }
                onClick={
                  retryProjectSave
                }
                className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading
                  ? "Sauvegarde..."
                  : "Réessayer"}
              </button>

            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              Sauvegarde du projet...
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[290px_1fr]">

            <div className="rounded-[26px] bg-slate-950 p-7 text-white">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                SCORE GLOBAL
              </p>

              <p className="mt-5 text-6xl font-bold">
                {
                  evaluation.globalScore
                }
              </p>

              <p className="text-slate-500">
                / 100
              </p>

              <p className="mt-6 text-lg font-bold">
                {
                  evaluation.level
                }
              </p>

            </div>

            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-7">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                COMPÉTENCES
              </p>

              <div className="mt-6 space-y-5">

                <Metric
                  label="Découverte client"
                  value={
                    evaluation.scores.discovery
                  }
                />

                <Metric
                  label="Solution"
                  value={
                    evaluation.scores.solution
                  }
                />

                <Metric
                  label="Qualité du prompt"
                  value={
                    evaluation.scores.promptQuality
                  }
                />

                <Metric
                  label="Qualité de la sortie"
                  value={
                    evaluation.scores.outputQuality
                  }
                />

                <Metric
                  label="Fiabilité"
                  value={
                    evaluation.scores.reliability
                  }
                />

                <Metric
                  label="Valeur métier"
                  value={
                    evaluation.scores.businessValue
                  }
                />

              </div>

            </div>

          </div>

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6">

            <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
              ANALYSE
            </p>

            <p className="mt-4 max-w-4xl leading-7 text-slate-600">
              {
                evaluation.summary
              }
            </p>

          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Feedback
              title="✓ Points solides"
              items={
                evaluation.strengths
              }
            />

            <Feedback
              title="↑ À améliorer"
              items={
                evaluation.weaknesses
              }
            />

          </div>

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-6">

            <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
              VALEUR POUR LE CLIENT
            </p>

            <p className="mt-3 text-lg font-semibold leading-7 text-slate-950">
              {
                evaluation.clientValue
              }
            </p>

          </div>

          {evaluation.nextStep && (
            <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                PROCHAINE ÉVOLUTION
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {
                  evaluation.nextStep
                }
              </p>

            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "prompt"
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
            >
              ← Améliorer encore
            </button>

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "service"
                )
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Voir mon service construit →
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          SERVICE FINAL
      ====================================================== */}

      {phase ===
        "service" &&
        evaluation && (
        <div className="p-6 md:p-8">

          <div className="rounded-[30px] bg-slate-950 p-8 text-white">

            <div className="flex flex-wrap items-start justify-between gap-5">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
                    SERVICE IA CONSTRUIT
                  </p>

                  {projectSaved && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-slate-300">
                      ✓ SAUVEGARDÉ
                    </span>
                  )}

                </div>

                <h3 className="mt-4 text-3xl font-bold">
                  Assistant de réponse aux prospects
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Pulse Studio
                </p>

              </div>

              <div className="rounded-2xl bg-white px-5 py-4 text-center text-slate-950">

                <p className="text-xs font-bold text-slate-400">
                  QUALITÉ
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {
                    evaluation.globalScore
                  }
                </p>

              </div>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <ServiceInfo
                label="Entrée"
                value="Message d’un prospect"
              />

              <ServiceInfo
                label="Traitement"
                value="Analyse + réponse selon les règles de l’entreprise"
              />

              <ServiceInfo
                label="Sortie"
                value="Réponse prête à relire avant envoi"
              />

            </div>

            <div className="mt-8 border-t border-slate-800 pt-7">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                VALEUR MÉTIER
              </p>

              <p className="mt-3 max-w-3xl text-lg font-semibold leading-8 text-slate-200">
                {
                  evaluation.clientValue
                }
              </p>

            </div>

          </div>

          {projectSaved &&
            projectId && (
            <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-6">

              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                VOTRE PORTFOLIO
              </p>

              <h4 className="mt-3 text-xl font-bold text-slate-950">
                Ce service fait maintenant partie de vos projets.
              </h4>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Il est enregistré dans votre compte.
                Vous pourrez le retrouver même après
                avoir fermé cette session.
              </p>

              <Link
                href={`/projets/${projectId}`}
                className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Ouvrir mon projet →
              </Link>

            </div>
          )}

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              CE QUE VOUS SAVEZ MAINTENANT FAIRE
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Skill>
                Mener un entretien client
              </Skill>

              <Skill>
                Identifier un problème automatisable
              </Skill>

              <Skill>
                Concevoir une solution proportionnée
              </Skill>

              <Skill>
                Construire le prompt moteur
              </Skill>

              <Skill>
                Tester sur un cas réel
              </Skill>

              <Skill>
                Contrôler la fiabilité
              </Skill>

            </div>

          </div>

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-7">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              PROCHAINE ÉTAPE DE LA FORMATION
            </p>

            <h4 className="mt-3 text-2xl font-bold text-slate-950">
              Transformer ce moteur en vrai produit
            </h4>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              Pour l’instant,
              le service fonctionne dans
              notre laboratoire.
              Dans les prochains modules,
              nous apprendrons à créer
              les interfaces,
              connecter des données,
              utiliser des API
              et automatiser réellement
              ce type de processus.
            </p>

          </div>

        </div>
      )}

      <div className="p-6 md:p-8">
        <SecureProjectEvaluation
          lessonId="prompts-05-project"
          ready={projectReady}
          blockingMessages={projectBlockingMessages}
          work={projectWork}
        />
      </div>

    </section>
  );
}

function FieldLengthStatus({
  field,
  value,
  dark = false,
}: {
  field: PublicProjectField;
  value: string;
  dark?: boolean;
}) {
  const length = value.trim().length;
  const tooShort = length < field.minLength;
  const tooLong = length > field.maxLength;

  return (
    <div className={`mt-2 flex flex-wrap justify-between gap-2 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
      <span>Minimum attendu : {field.minLength} caractères.</span>
      <span className={tooShort || tooLong ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
        {length} / {field.minLength} caractères
        {tooShort ? ` — ${field.label} est trop court.` : ""}
        {tooLong ? ` — ${field.label} dépasse ${field.maxLength} caractères.` : ""}
      </span>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function Step({
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
      className={`rounded-xl border px-2 py-3 ${
        active
          ? "border-white bg-white text-slate-950"
          : completed
          ? "border-slate-700 bg-slate-900 text-white"
          : "border-slate-800 bg-slate-900 text-slate-500"
      }`}
    >

      <p className="text-[10px] font-bold">
        {completed
          ? "✓"
          : number}
      </p>

      <p className="mt-1 truncate text-[11px] font-semibold">
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
  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );

  return (
    <div>

      <div className="flex items-center justify-between gap-4">

        <span className="text-sm font-medium text-slate-900">
          {label}
        </span>

        <strong className="text-sm font-bold text-slate-950">
          {safeValue}%
        </strong>

      </div>

      <div
        className="mt-3 overflow-hidden rounded-full"
        style={{
          height: "8px",
          backgroundColor:
            "#e2e8f0",
        }}
      >

        <div
          className="rounded-full transition-all duration-700"
          style={{
            width:
              `${safeValue}%`,

            height:
              "8px",

            backgroundColor:
              "#020617",
          }}
        />

      </div>

    </div>
  );
}

function Feedback({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">

      <p className="font-bold">
        {title}
      </p>

      <div className="mt-4 space-y-3">

        {items.length >
        0 ? (
          items.map(
            (
              item,
              index
            ) => (
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
            Aucun élément majeur.
          </p>
        )}

      </div>

    </div>
  );
}

function ServiceInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-xs font-bold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
        {value}
      </p>

    </div>
  );
}

function Skill({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
        ✓
      </div>

      <p className="text-sm font-semibold text-slate-700">
        {children}
      </p>

    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  );
}
