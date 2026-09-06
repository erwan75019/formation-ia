"use client";

import {
  useMemo,
  useState,
} from "react";

type RoleChoice = {
  id: string;
  title: string;
  description: string;
  correct: boolean;
  feedback: string;
};

const roles: RoleChoice[] = [
  {
    id: "writer",
    title:
      "Rédacteur académique",
    description:
      "Rédige directement une dissertation complète prête à rendre.",
    correct: false,
    feedback:
      "Ce rôle produit le travail à la place de l'étudiant. Il peut générer un texte convaincant, mais l'étudiant maîtrise moins la problématique, les arguments et les éventuelles erreurs.",
  },
  {
    id: "expert",
    title:
      "Expert mondial de l'histoire",
    description:
      "Agit comme le meilleur spécialiste possible de la révolution industrielle.",
    correct: false,
    feedback:
      "Le titre paraît impressionnant, mais il ne définit pas vraiment la méthode attendue. Un rôle utile doit guider la façon de travailler, pas seulement donner un statut prestigieux à l'IA.",
  },
  {
    id: "teacher",
    title:
      "Tuteur universitaire",
    description:
      "Aide l'étudiant à construire son raisonnement, questionne ses choix et corrige sa méthode sans faire automatiquement le devoir à sa place.",
    correct: true,
    feedback:
      "C'est le rôle le plus pertinent ici. Il apporte une méthode : questionnement, construction de problématique, vérification du plan et critique des arguments.",
  },
  {
    id: "marketer",
    title:
      "Consultant en communication",
    description:
      "Cherche surtout à rendre le texte plus convaincant et plus accrocheur.",
    correct: false,
    feedback:
      "Ce rôle peut être utile dans d'autres situations, mais il ne correspond pas à l'objectif principal d'une dissertation universitaire.",
  },
];

type Phase =
  | "diagnostic"
  | "builder"
  | "result";

export default function StudentRoleLab() {
  const [phase, setPhase] =
    useState<Phase>(
      "diagnostic"
    );

  const [
    selectedRole,
    setSelectedRole,
  ] =
    useState<string | null>(
      null
    );

  const [validated, setValidated] =
    useState(false);

  const [objective, setObjective] =
    useState("");

  const [method, setMethod] =
    useState("");

  const [limits, setLimits] =
    useState("");

  const [interaction, setInteraction] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState("");

  const chosenRole =
    roles.find(
      (role) =>
        role.id ===
        selectedRole
    );

  const roleName =
    chosenRole?.correct
      ? "tuteur universitaire"
      : chosenRole?.title ??
        "";

  const generatedPrompt =
    useMemo(() => {
      return `RÔLE

Agis comme ${roleName || "[rôle à définir]"}.

OBJECTIF

${objective || "[objectif à définir]"}

MÉTHODE DE TRAVAIL

${method || "[méthode à définir]"}

LIMITES

${limits || "[limites à définir]"}

INTERACTION AVEC L'ÉTUDIANT

${interaction || "[interaction à définir]"}`;
    }, [
      roleName,
      objective,
      method,
      limits,
      interaction,
    ]);

  const structureItems = [
    {
      label:
        "Rôle cohérent",
      valid:
        selectedRole ===
        "teacher",
    },
    {
      label:
        "Objectif défini",
      valid:
        objective.trim()
          .length >= 20,
    },
    {
      label:
        "Méthode définie",
      valid:
        method.trim()
          .length >= 30,
    },
    {
      label:
        "Limites prévues",
      valid:
        limits.trim()
          .length >= 20,
    },
    {
      label:
        "Interaction prévue",
      valid:
        interaction.trim()
          .length >= 20,
    },
  ];

  const structureScore =
    Math.round(
      (structureItems.filter(
        (item) =>
          item.valid
      ).length /
        structureItems.length) *
        100
    );

  function validateRole() {
    if (!selectedRole) {
      return;
    }

    setValidated(true);
  }

  function continueToBuilder() {
    if (
      selectedRole !==
      "teacher"
    ) {
      return;
    }

    setValidated(false);
    setPhase("builder");
  }

  async function executePrompt() {
    if (
      !generatedPrompt.trim() ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/training/student-role",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                prompt:
                  generatedPrompt,
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

      setResult(
        data.result
      );

      setPhase("result");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPhase(
      "diagnostic"
    );

    setSelectedRole(null);
    setValidated(false);

    setObjective("");
    setMethod("");
    setLimits("");
    setInteraction("");

    setResult("");
    setError("");
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="bg-slate-950 px-6 py-7 text-white md:px-8">

        <div className="flex flex-wrap items-center justify-between gap-5">

          <div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                Cas étudiant
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                Rôle & méthode
              </span>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              L’IA doit-elle faire le travail ou aider à le construire ?
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Vous devez rendre une
              dissertation universitaire.
              Votre objectif est d&apos;utiliser
              l&apos;IA intelligemment pour
              améliorer votre raisonnement,
              pas simplement obtenir un texte.
            </p>

          </div>

          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
          >
            Recommencer
          </button>

        </div>

        <div className="mt-7 grid grid-cols-3 gap-2">

          <PhaseIndicator
            number="01"
            label="Choisir le rôle"
            active={
              phase ===
              "diagnostic"
            }
            completed={
              phase !==
              "diagnostic"
            }
          />

          <PhaseIndicator
            number="02"
            label="Construire"
            active={
              phase ===
              "builder"
            }
            completed={
              phase ===
              "result"
            }
          />

          <PhaseIndicator
            number="03"
            label="Observer"
            active={
              phase ===
              "result"
            }
            completed={false}
          />

        </div>

      </div>

      {/* ======================================================
          PHASE 1
      ====================================================== */}

      {phase ===
        "diagnostic" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            SITUATION
          </p>

          <div className="mt-4 rounded-2xl bg-slate-50 p-6">

            <p className="text-sm font-semibold text-slate-500">
              Votre sujet :
            </p>

            <p className="mt-3 text-xl font-bold leading-8">
              « La révolution
              industrielle
              a-t-elle transformé
              durablement les
              sociétés européennes
              au XIXe siècle ? »
            </p>

          </div>

          <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-5">

            <p className="text-xs font-bold tracking-[0.15em] text-red-700">
              PREMIER RÉFLEXE
            </p>

            <p className="mt-3 text-sm leading-7 text-red-950">
              Vous pourriez écrire :
              « Fais-moi une dissertation
              complète avec introduction,
              trois parties et conclusion. »
            </p>

          </div>

          <h3 className="mt-8 text-2xl font-bold">
            Quel rôle donneriez-vous plutôt à l’IA ?
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Plusieurs rôles peuvent
            sembler crédibles. Choisissez
            celui qui apporte la meilleure
            méthode de travail.
          </p>

          <div className="mt-6 space-y-3">

            {roles.map(
              (role) => {
                const selected =
                  selectedRole ===
                  role.id;

                const correct =
                  validated &&
                  role.correct;

                const wrong =
                  validated &&
                  selected &&
                  !role.correct;

                return (
                  <button
                    key={
                      role.id
                    }
                    type="button"
                    onClick={() => {
                      setSelectedRole(
                        role.id
                      );

                      setValidated(
                        false
                      );
                    }}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      correct
                        ? "border-emerald-300 bg-emerald-50"
                        : wrong
                        ? "border-red-300 bg-red-50"
                        : selected
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          correct
                            ? "bg-emerald-500 text-white"
                            : wrong
                            ? "bg-red-500 text-white"
                            : selected
                            ? "bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {correct
                          ? "✓"
                          : wrong
                          ? "×"
                          : role.id ===
                            "writer"
                          ? "A"
                          : role.id ===
                            "expert"
                          ? "B"
                          : role.id ===
                            "teacher"
                          ? "C"
                          : "D"}
                      </div>

                      <div>

                        <p className="font-bold">
                          {
                            role.title
                          }
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {
                            role.description
                          }
                        </p>

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>

          {!validated && (
            <button
              type="button"
              onClick={
                validateRole
              }
              disabled={
                !selectedRole
              }
              className="mt-6 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-30"
            >
              Valider mon choix
            </button>
          )}

          {validated &&
            chosenRole && (
              <div
                className={`mt-6 rounded-2xl border p-6 ${
                  chosenRole.correct
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >

                <p className="font-bold">
                  {chosenRole.correct
                    ? "✓ Bon choix"
                    : "Pourquoi ce n'est pas le meilleur choix"}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {
                    chosenRole.feedback
                  }
                </p>

                {chosenRole.correct && (
                  <button
                    type="button"
                    onClick={
                      continueToBuilder
                    }
                    className="mt-5 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Construire mon tuteur IA →
                  </button>
                )}

              </div>
            )}

        </div>
      )}

      {/* ======================================================
          PHASE 2
      ====================================================== */}

      {phase ===
        "builder" && (
        <div className="grid lg:grid-cols-2">

          <div className="border-b border-slate-200 p-6 md:p-8 lg:border-b-0 lg:border-r">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
              CONSTRUCTION DU PROMPT
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Définissez comment le tuteur doit travailler
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Le rôle « tuteur universitaire »
              ne suffit pas. Vous devez maintenant
              préciser ce qu&apos;il doit réellement faire.
            </p>

            <div className="mt-7">

              <PromptField
                label="Objectif"
                helper="Que voulez-vous réellement obtenir de l'IA ?"
                value={
                  objective
                }
                onChange={
                  setObjective
                }
                placeholder="Ex : m'aider à construire une problématique et un plan solides..."
              />

              <PromptField
                label="Méthode"
                helper="Comment l'IA doit-elle vous accompagner ?"
                value={
                  method
                }
                onChange={
                  setMethod
                }
                placeholder="Ex : commence par me poser des questions, critique ensuite mes propositions..."
              />

              <PromptField
                label="Limites"
                helper="Que ne doit-elle surtout pas faire ?"
                value={
                  limits
                }
                onChange={
                  setLimits
                }
                placeholder="Ex : ne rédige pas directement toute la dissertation, n'invente aucune source..."
              />

              <PromptField
                label="Interaction"
                helper="Comment souhaitez-vous travailler avec elle ?"
                value={
                  interaction
                }
                onChange={
                  setInteraction
                }
                placeholder="Ex : attends ma réponse entre chaque étape..."
                last
              />

            </div>

          </div>

          <div className="bg-slate-50 p-6 md:p-8">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                APERÇU
              </p>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                {structureScore}%
              </span>

            </div>

            <div className="mt-4 rounded-2xl bg-slate-950 p-5">

              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                {
                  generatedPrompt
                }
              </pre>

            </div>

            <div className="mt-6 space-y-2">

              {structureItems.map(
                (item) => (
                  <div
                    key={
                      item.label
                    }
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >

                    <p className="text-sm text-slate-600">
                      {
                        item.label
                      }
                    </p>

                    <span
                      className={`font-bold ${
                        item.valid
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    >
                      {item.valid
                        ? "✓"
                        : "—"}
                    </span>

                  </div>
                )
              )}

            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={
                structureScore <
                  60 ||
                loading
              }
              onClick={
                executePrompt
              }
              className="mt-6 w-full rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {loading
                ? "Le tuteur répond..."
                : "Tester mon tuteur →"}
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          PHASE 3
      ====================================================== */}

      {phase ===
        "result" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            RÉSULTAT RÉEL
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Observez le comportement créé par votre prompt
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Ollama vient réellement
            d&apos;exécuter votre consigne
            sur le sujet de dissertation.
          </p>

          <div className="mt-7 grid gap-6 lg:grid-cols-[330px_1fr]">

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                SUJET
              </p>

              <p className="mt-4 font-semibold leading-7">
                La révolution
                industrielle
                a-t-elle transformé
                durablement les
                sociétés européennes
                au XIXe siècle ?
              </p>

              <div className="mt-6 border-t border-slate-200 pt-5">

                <p className="text-xs font-bold text-slate-400">
                  RÔLE
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Tuteur universitaire
                </p>

              </div>

            </div>

            <div className="rounded-[24px] bg-slate-950 p-7 text-white">

              <div className="flex items-center justify-between gap-4">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                  RÉPONSE DU TUTEUR
                </p>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                  Généré en direct
                </span>

              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-200">
                {result}
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-[24px] border border-blue-200 bg-blue-50 p-6">

            <p className="text-xs font-bold tracking-[0.15em] text-blue-700">
              CE QU&apos;IL FAUT OBSERVER
            </p>

            <h4 className="mt-3 text-xl font-bold text-blue-950">
              Le rôle a-t-il réellement changé le comportement de l&apos;IA ?
            </h4>

            <p className="mt-3 text-sm leading-7 text-blue-900">
              Si votre tuteur vous pose
              des questions, critique votre
              raisonnement et avance avec vous,
              votre rôle et votre méthode ont
              réellement influencé la réponse.
              S&apos;il rédige immédiatement le devoir,
              votre consigne reste trop permissive.
            </p>

          </div>

          <div className="mt-6 rounded-[24px] bg-slate-950 p-6 text-white">

            <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
              PRINCIPE À RETENIR
            </p>

            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              Un rôle utile ne sert pas
              à rendre le prompt impressionnant.
              Il définit une perspective,
              une méthode ou une façon
              d&apos;interagir qui améliore
              réellement le résultat.
            </p>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "builder"
                )
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              ← Modifier mon prompt
            </button>

            <button
              type="button"
              onClick={
                executePrompt
              }
              disabled={
                loading
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

function PhaseIndicator({
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
      className={`rounded-xl border px-4 py-3 ${
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

      <p className="mt-1 text-xs font-semibold">
        {label}
      </p>

    </div>
  );
}

function PromptField({
  label,
  helper,
  value,
  onChange,
  placeholder,
  last = false,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  last?: boolean;
}) {
  return (
    <div
      className={
        last
          ? ""
          : "mb-6"
      }
    >

      <p className="font-bold">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {helper}
      </p>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        rows={4}
        className="mt-3 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-950"
      />

    </div>
  );
}
