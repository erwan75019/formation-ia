"use client";

import {
  ReactNode,
  useMemo,
  useState,
} from "react";

type ServiceId =
  | "reviews"
  | "study"
  | "product"
  | "property"
  | "social"
  | "custom";

type Phase =
  | "service"
  | "template"
  | "tool"
  | "result"
  | "library";

type Service = {
  id: ServiceId;
  icon: string;
  title: string;
  sector: string;
  description: string;
  skill: string;
};

const services: Service[] = [
  {
    id: "reviews",
    icon: "⭐",
    title:
      "Réponse aux avis clients",
    sector:
      "Commerce / restauration",
    description:
      "Transformer chaque avis en réponse cohérente, personnalisée et prête à relire.",
    skill:
      "Relation client",
  },

  {
    id: "study",
    icon: "🎓",
    title:
      "Créer une fiche de révision",
    sector:
      "Études",
    description:
      "Transformer un contenu de cours en fiche structurée sans inventer d'informations.",
    skill:
      "Synthèse pédagogique",
  },

  {
    id: "product",
    icon: "🛍️",
    title:
      "Créer une fiche produit",
    sector:
      "E-commerce",
    description:
      "Transformer les caractéristiques d'un produit en description commerciale exploitable.",
    skill:
      "Contenu e-commerce",
  },

  {
    id: "property",
    icon: "🏠",
    title:
      "Créer une annonce immobilière",
    sector:
      "Immobilier",
    description:
      "Transformer les données d'un bien en annonce attractive sans inventer de caractéristiques.",
    skill:
      "Rédaction commerciale",
  },

  {
    id: "social",
    icon: "📱",
    title:
      "Créer une publication sociale",
    sector:
      "Communication",
    description:
      "Transformer les informations d'une entreprise ou d'un événement en contenu pour les réseaux.",
    skill:
      "Communication digitale",
  },

  {
    id: "custom",
    icon: "🧩",
    title:
      "Créer mon propre outil",
    sector:
      "Libre",
    description:
      "Définissez vous-même le service, les variables et le résultat attendu.",
    skill:
      "Conception",
  },
];

export default function PromptTemplateLab() {
  const [
    phase,
    setPhase,
  ] =
    useState<Phase>(
      "service"
    );

  const [
    selectedService,
    setSelectedService,
  ] =
    useState<ServiceId | null>(
      null
    );

  const [
    objective,
    setObjective,
  ] =
    useState("");

  const [
    rules,
    setRules,
  ] =
    useState("");

  const [
    outputFormat,
    setOutputFormat,
  ] =
    useState("");

  const [
    variables,
    setVariables,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const [
    customVariableNames,
    setCustomVariableNames,
  ] =
    useState([
      "DONNEE_1",
      "DONNEE_2",
      "DONNEE_3",
    ]);

  const [
    result,
    setResult,
  ] =
    useState("");

  const [
    finalPrompt,
    setFinalPrompt,
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

  const [
    createdServices,
    setCreatedServices,
  ] =
    useState<ServiceId[]>([]);

  const service =
    services.find(
      (item) =>
        item.id ===
        selectedService
    );

  const variableNames =
    useMemo(() => {
      switch (
        selectedService
      ) {
        case "reviews":
          return [
            "ENTREPRISE",
            "AVIS_CLIENT",
            "TON",
            "OBJECTIF",
          ];

        case "study":
          return [
            "SUJET",
            "CONTENU_COURS",
            "NIVEAU",
            "FORMAT_REVISION",
          ];

        case "product":
          return [
            "PRODUIT",
            "CARACTERISTIQUES",
            "PRIX",
            "CIBLE",
            "TON",
          ];

        case "property":
          return [
            "TYPE_BIEN",
            "VILLE",
            "SURFACE",
            "PIECES",
            "POINTS_FORTS",
            "TON",
          ];

        case "social":
          return [
            "MARQUE",
            "SUJET",
            "INFORMATIONS",
            "PLATEFORME",
            "TON",
            "OBJECTIF",
          ];

        case "custom":
          return customVariableNames
            .map(
              (item) =>
                normalizeVariable(
                  item
                )
            )
            .filter(Boolean);

        default:
          return [];
      }
    }, [
      selectedService,
      customVariableNames,
    ]);

  const baseContext =
    getBaseContext(
      selectedService
    );

  const template =
    useMemo(() => {
      if (
        !selectedService
      ) {
        return "";
      }

      const variablesBlock =
        variableNames
          .map(
            (variable) =>
              `${variable}\n{{${variable}}}`
          )
          .join(
            "\n\n"
          );

      return `OBJECTIF

${
  objective ||
  "[Définissez l'objectif permanent du service]"
}

CONTEXTE

${baseContext}

DONNÉES VARIABLES

${variablesBlock}

RÈGLES

${
  rules ||
  "[Définissez les règles permanentes]"
}

FORMAT ATTENDU

${
  outputFormat ||
  "[Définissez le format du résultat]"
}`;
    }, [
      selectedService,
      variableNames,
      objective,
      rules,
      outputFormat,
      baseContext,
    ]);

  const checks = [
    {
      label:
        "Objectif clair",
      valid:
        objective.trim()
          .length >= 20,
    },

    {
      label:
        "Variables identifiées",
      valid:
        variableNames.length >=
        2,
    },

    {
      label:
        "Règles définies",
      valid:
        rules.trim()
          .length >= 25,
    },

    {
      label:
        "Format attendu",
      valid:
        outputFormat.trim()
          .length >= 15,
    },
  ];

  const templateScore =
    Math.round(
      (checks.filter(
        (item) =>
          item.valid
      ).length /
        checks.length) *
        100
    );

  function selectService(
    id: ServiceId
  ) {
    setSelectedService(
      id
    );

    setObjective("");
    setRules("");
    setOutputFormat("");
    setVariables({});
    setResult("");
    setFinalPrompt("");
    setError("");
  }

  function startBuilding() {
    if (
      !selectedService
    ) {
      return;
    }

    const defaults =
      getTemplateDefaults(
        selectedService
      );

    setObjective(
      defaults.objective
    );

    setRules(
      defaults.rules
    );

    setOutputFormat(
      defaults.outputFormat
    );

    setVariables(
      getSampleVariables(
        selectedService
      )
    );

    setPhase(
      "template"
    );

    setError("");
  }

  function updateVariable(
    key: string,
    value: string
  ) {
    setVariables(
      (current) => ({
        ...current,
        [key]:
          value,
      })
    );
  }

  async function executeTemplate() {
    if (
      loading ||
      templateScore < 75
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/training/template-run",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                template,
                variables,
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
            "Impossible d'exécuter le template."
        );
      }

      setResult(
        data.result
      );

      setFinalPrompt(
        data.finalPrompt
      );

      setPhase(
        "result"
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof
          Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  function addToLibrary() {
    if (
      selectedService &&
      !createdServices.includes(
        selectedService
      )
    ) {
      setCreatedServices(
        (current) => [
          ...current,
          selectedService,
        ]
      );
    }

    setPhase(
      "library"
    );
  }

  function createAnother() {
    setPhase(
      "service"
    );

    setSelectedService(
      null
    );

    setObjective("");
    setRules("");
    setOutputFormat("");
    setVariables({});
    setResult("");
    setFinalPrompt("");
    setError("");
  }

  function resetAll() {
    setPhase(
      "service"
    );

    setSelectedService(
      null
    );

    setObjective("");
    setRules("");
    setOutputFormat("");
    setVariables({});
    setResult("");
    setFinalPrompt("");
    setCreatedServices(
      []
    );
    setError("");
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="bg-slate-950 px-6 py-7 text-white md:px-8">

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                Prompt Factory
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                Atelier multi-services
              </span>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Un principe.
              Plusieurs services.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Choisissez un usage,
              transformez les informations
              variables en formulaire
              et testez réellement
              votre mini-outil.
            </p>

          </div>

          <button
            type="button"
            onClick={
              resetAll
            }
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
          >
            Tout recommencer
          </button>

        </div>

        <div className="mt-7 grid grid-cols-5 gap-2">

          <PhaseIndicator
            number="01"
            label="Service"
            active={
              phase ===
              "service"
            }
            completed={
              phase !==
              "service"
            }
          />

          <PhaseIndicator
            number="02"
            label="Template"
            active={
              phase ===
              "template"
            }
            completed={[
              "tool",
              "result",
              "library",
            ].includes(
              phase
            )}
          />

          <PhaseIndicator
            number="03"
            label="Interface"
            active={
              phase ===
              "tool"
            }
            completed={[
              "result",
              "library",
            ].includes(
              phase
            )}
          />

          <PhaseIndicator
            number="04"
            label="Résultat"
            active={
              phase ===
              "result"
            }
            completed={
              phase ===
              "library"
            }
          />

          <PhaseIndicator
            number="05"
            label="Bibliothèque"
            active={
              phase ===
              "library"
            }
            completed={
              false
            }
          />

        </div>

      </div>

      {/* ======================================================
          SERVICE SELECTION
      ====================================================== */}

      {phase ===
        "service" && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
            ÉTAPE 1 · CHOISISSEZ VOTRE SERVICE
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Que voulez-vous transformer
            en mini-outil ?
          </h3>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            Tous les choix ci-dessous
            sont maintenant fonctionnels.
            Le principe reste identique,
            mais les variables,
            le formulaire et le résultat changent.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {services.map(
              (item) => {
                const selected =
                  selectedService ===
                  item.id;

                const alreadyCreated =
                  createdServices.includes(
                    item.id
                  );

                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      selectService(
                        item.id
                      )
                    }
                    className={`relative rounded-[24px] border p-5 text-left transition ${
                      selected
                        ? "border-slate-950 bg-slate-50 shadow-lg"
                        : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-400 hover:shadow-md"
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                        {
                          item.icon
                        }
                      </div>

                      {alreadyCreated && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                          CRÉÉ
                        </span>
                      )}

                    </div>

                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {
                        item.sector
                      }
                    </p>

                    <h4 className="mt-2 text-lg font-bold">
                      {
                        item.title
                      }
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {
                        item.description
                      }
                    </p>

                    <div className="mt-5 border-t border-slate-100 pt-4">

                      <p className="text-xs font-semibold text-slate-500">
                        Compétence :{" "}
                        {
                          item.skill
                        }
                      </p>

                    </div>

                  </button>
                );
              }
            )}

          </div>

          {selectedService ===
            "custom" && (
            <div className="mt-6 rounded-[24px] border border-violet-200 bg-violet-50 p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-violet-700">
                MODE LIBRE
              </p>

              <h4 className="mt-2 text-xl font-bold text-violet-950">
                Définissez vos variables
              </h4>

              <p className="mt-2 text-sm leading-6 text-violet-900">
                Choisissez les données
                qui changeront à chaque utilisation.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">

                {customVariableNames.map(
                  (
                    name,
                    index
                  ) => (
                    <input
                      key={
                        index
                      }
                      value={
                        name
                      }
                      onChange={(
                        event
                      ) => {
                        const copy =
                          [
                            ...customVariableNames,
                          ];

                        copy[
                          index
                        ] =
                          event.target.value;

                        setCustomVariableNames(
                          copy
                        );
                      }}
                      placeholder={`Variable ${
                        index +
                        1
                      }`}
                      className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-mono outline-none focus:border-violet-500"
                    />
                  )
                )}

              </div>

            </div>
          )}

          <button
            type="button"
            disabled={
              !selectedService
            }
            onClick={
              startBuilding
            }
            className="mt-7 rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-30"
          >
            Construire ce mini-outil →
          </button>

        </div>
      )}

      {/* ======================================================
          TEMPLATE
      ====================================================== */}

      {phase ===
        "template" &&
        service && (
        <div className="grid lg:grid-cols-2">

          <div className="border-b border-slate-200 p-6 md:p-8 lg:border-b-0 lg:border-r">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                {
                  service.icon
                }
              </div>

              <div>

                <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                  ÉTAPE 2 · LOGIQUE PERMANENTE
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {
                    service.title
                  }
                </h3>

              </div>

            </div>

            <p className="mt-6 text-sm leading-7 text-slate-500">
              Ces instructions resteront
              les mêmes à chaque utilisation.
              C’est votre méthode.
            </p>

            <div className="mt-7">

              <TemplateField
                label="Objectif permanent"
                helper="Que doit produire ce service à chaque utilisation ?"
                value={
                  objective
                }
                onChange={
                  setObjective
                }
              />

              <TemplateField
                label="Règles permanentes"
                helper="Quelles règles le système doit-il toujours respecter ?"
                value={
                  rules
                }
                onChange={
                  setRules
                }
              />

              <TemplateField
                label="Format permanent"
                helper="À quoi doit ressembler le livrable final ?"
                value={
                  outputFormat
                }
                onChange={
                  setOutputFormat
                }
                last
              />

            </div>

          </div>

          <div className="bg-slate-50 p-6 md:p-8">

            <div className="flex items-center justify-between gap-4">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                TEMPLATE
              </p>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                {
                  templateScore
                }
                %
              </span>

            </div>

            <div className="mt-4 max-h-[550px] overflow-y-auto rounded-2xl bg-slate-950 p-5">

              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                {
                  template
                }
              </pre>

            </div>

            <p className="mt-6 text-sm font-bold">
              Variables du service
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              {variableNames.map(
                (
                  variable
                ) => (
                  <VariableBadge
                    key={
                      variable
                    }
                  >
                    {
                      variable
                    }
                  </VariableBadge>
                )
              )}

            </div>

            <div className="mt-6 space-y-2">

              {checks.map(
                (
                  check
                ) => (
                  <div
                    key={
                      check.label
                    }
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >

                    <span className="text-sm text-slate-600">
                      {
                        check.label
                      }
                    </span>

                    <span
                      className={`font-bold ${
                        check.valid
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    >
                      {check.valid
                        ? "✓"
                        : "—"}
                    </span>

                  </div>
                )
              )}

            </div>

            <button
              type="button"
              disabled={
                templateScore <
                75
              }
              onClick={() => {
                setError("");
                setPhase(
                  "tool"
                );
              }}
              className="mt-6 w-full rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white disabled:opacity-30"
            >
              Transformer en interface →
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          TOOL
      ====================================================== */}

      {phase ===
        "tool" &&
        service && (
        <div className="p-6 md:p-8">

          <div className="flex flex-wrap items-start justify-between gap-5">

            <div>

              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                ÉTAPE 3 · INTERFACE CLIENT
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Votre prompt devient un mini-produit
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                L’utilisateur ne voit plus
                votre template.
                Il remplit simplement
                les informations nécessaires.
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              {
                service.icon
              }
            </div>

          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">

            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                    {
                      service.sector.toUpperCase()
                    }
                  </p>

                  <h4 className="mt-2 text-xl font-bold">
                    {
                      service.title
                    }
                  </h4>

                </div>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                  Prototype
                </span>

              </div>

              <div className="mt-7 space-y-5">

                {variableNames.map(
                  (
                    variable
                  ) => (
                    <DynamicField
                      key={
                        variable
                      }
                      variable={
                        variable
                      }
                      value={
                        variables[
                          variable
                        ] ||
                        ""
                      }
                      onChange={(
                        value
                      ) =>
                        updateVariable(
                          variable,
                          value
                        )
                      }
                    />
                  )
                )}

              </div>

              {error && (
                <ErrorMessage
                  message={
                    error
                  }
                />
              )}

              <button
                type="button"
                onClick={
                  executeTemplate
                }
                disabled={
                  loading
                }
                className="mt-7 w-full rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-30"
              >
                {loading
                  ? "Le moteur travaille..."
                  : "Générer le livrable →"}
              </button>

            </div>

            <aside className="h-fit rounded-[26px] bg-slate-950 p-6 text-white">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                CE QUI SE PASSE
              </p>

              <div className="mt-6 space-y-5">

                <ProcessItem
                  number="01"
                  title="Formulaire"
                  text="L’utilisateur renseigne uniquement les données qui changent."
                />

                <ProcessItem
                  number="02"
                  title="Injection"
                  text="Les données sont insérées dans votre template."
                />

                <ProcessItem
                  number="03"
                  title="LLM"
                  text="Votre moteur exécute les instructions permanentes."
                />

                <ProcessItem
                  number="04"
                  title="Livrable"
                  text="L’utilisateur obtient un résultat prêt à contrôler."
                />

              </div>

            </aside>

          </div>

        </div>
      )}

      {/* ======================================================
          RESULT
      ====================================================== */}

      {phase ===
        "result" &&
        service && (
        <div className="p-6 md:p-8">

          <div className="flex flex-wrap items-start justify-between gap-5">

            <div>

              <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
                ÉTAPE 4 · RÉSULTAT RÉEL
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Votre outil vient de fonctionner
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Le résultat ci-dessous
                vient réellement d’Ollama
                avec votre template
                et les données du formulaire.
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              {
                service.icon
              }
            </div>

          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr]">

            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-6">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                DONNÉES UTILISÉES
              </p>

              <div className="mt-5 space-y-4">

                {variableNames.map(
                  (
                    variable
                  ) => (
                    <div
                      key={
                        variable
                      }
                      className="border-b border-slate-200 pb-4 last:border-0"
                    >

                      <p className="text-[11px] font-bold text-slate-400">
                        {
                          humanizeVariable(
                            variable
                          )
                        }
                      </p>

                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                        {
                          variables[
                            variable
                          ] ||
                          "—"
                        }
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            <div className="rounded-[26px] bg-slate-950 p-7 text-white">

              <div className="flex items-center justify-between gap-4">

                <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                  LIVRABLE
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

          <details className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5">

            <summary className="cursor-pointer text-sm font-bold">
              Voir ce que le LLM a réellement reçu
            </summary>

            <pre className="mt-5 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 font-sans text-xs leading-6 text-slate-300">
              {
                finalPrompt
              }
            </pre>

          </details>

          <div className="mt-6 rounded-[26px] border border-blue-200 bg-blue-50 p-6">

            <p className="text-xs font-bold tracking-[0.15em] text-blue-700">
              COMPÉTENCE
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-950">
              Vous venez de séparer
              <strong>
                {" "}
                la logique permanente
              </strong>{" "}
              d’un service
              des
              <strong>
                {" "}
                données variables
              </strong>.
              C’est un principe essentiel
              pour transformer un prompt
              en fonctionnalité réutilisable.
            </p>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setPhase(
                  "tool"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold"
            >
              ← Tester d’autres données
            </button>

            <button
              type="button"
              onClick={
                addToLibrary
              }
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Ajouter à ma bibliothèque →
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          LIBRARY
      ====================================================== */}

      {phase ===
        "library" && (
        <div className="p-6 md:p-8">

          <div className="flex flex-wrap items-start justify-between gap-5">

            <div>

              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                ÉTAPE 5 · VOTRE BIBLIOTHÈQUE
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Vos services commencent à s’accumuler
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Dans cette leçon,
                cette bibliothèque reste locale.
                Plus tard, nous la connecterons
                à votre compte et à Supabase.
              </p>

            </div>

            <div className="rounded-2xl bg-slate-950 px-5 py-4 text-center text-white">

              <p className="text-xs text-slate-500">
                CRÉÉS
              </p>

              <p className="mt-1 text-3xl font-bold">
                {
                  createdServices.length
                }
              </p>

            </div>

          </div>

          {createdServices.length ===
          0 ? (
            <div className="mt-8 rounded-[26px] border border-dashed border-slate-300 p-10 text-center">

              <p className="text-slate-400">
                Aucun mini-service créé.
              </p>

            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {createdServices.map(
                (
                  serviceId
                ) => {
                  const item =
                    services.find(
                      (service) =>
                        service.id ===
                        serviceId
                    );

                  if (!item) {
                    return null;
                  }

                  return (
                    <div
                      key={
                        item.id
                      }
                      className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                          {
                            item.icon
                          }
                        </div>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                          ACTIF
                        </span>

                      </div>

                      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                        {
                          item.sector
                        }
                      </p>

                      <h4 className="mt-2 text-lg font-bold text-emerald-950">
                        {
                          item.title
                        }
                      </h4>

                      <p className="mt-3 text-sm leading-6 text-emerald-900">
                        {
                          item.skill
                        }
                      </p>

                    </div>
                  );
                }
              )}

            </div>
          )}

          <div className="mt-8 rounded-[26px] bg-slate-950 p-7 text-white">

            <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
              VOUS AVEZ COMPRIS LE PRINCIPE ?
            </p>

            <h4 className="mt-3 text-2xl font-bold">
              Essayez maintenant un autre domaine
            </h4>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Une fiche de révision,
              une annonce immobilière
              ou une fiche produit
              fonctionnent techniquement
              selon la même logique :
              instructions fixes +
              données variables.
            </p>

            <button
              type="button"
              onClick={
                createAnother
              }
              className="mt-6 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950"
            >
              Créer un autre mini-service →
            </button>

          </div>

        </div>
      )}

    </section>
  );
}

/* ============================================================
   CONFIG
============================================================ */

function getBaseContext(
  service: ServiceId | null
) {
  switch (service) {
    case "reviews":
      return "Vous aidez une entreprise à répondre à un avis laissé par un client.";

    case "study":
      return "Vous aidez un étudiant à transformer son contenu de cours en support de révision fidèle aux informations fournies.";

    case "product":
      return "Vous transformez les informations réelles d'un produit en contenu e-commerce.";

    case "property":
      return "Vous transformez les caractéristiques réelles d'un bien immobilier en annonce.";

    case "social":
      return "Vous transformez des informations fournies par une organisation en publication pour un réseau social.";

    case "custom":
      return "Vous exécutez un service réutilisable défini par l'utilisateur.";

    default:
      return "";
  }
}

function getTemplateDefaults(
  service: ServiceId
) {
  switch (service) {
    case "reviews":
      return {
        objective:
          "Produire une réponse personnalisée et professionnelle à l'avis d'un client afin de préserver la relation avec lui.",

        rules:
          "Ne jamais inventer de compensation ou de politique commerciale. Reconnaître les problèmes réellement mentionnés et rester naturel.",

        outputFormat:
          "Une réponse courte, sans liste, directement exploitable après validation humaine.",
      };

    case "study":
      return {
        objective:
          "Transformer le contenu de cours fourni en une fiche de révision claire qui facilite la compréhension et la mémorisation.",

        rules:
          "Utiliser uniquement les informations du cours. Ne jamais inventer de source, date, définition ou notion absente du contenu fourni.",

        outputFormat:
          "Une fiche structurée avec titres, notions essentielles, définitions et points à mémoriser.",
      };

    case "product":
      return {
        objective:
          "Transformer les caractéristiques réelles d'un produit en description commerciale claire et utile.",

        rules:
          "Ne jamais inventer de caractéristique, matière, avantage, promotion ou performance qui n'a pas été fournie.",

        outputFormat:
          "Un titre court puis une description commerciale lisible et prête à être relue avant publication.",
      };

    case "property":
      return {
        objective:
          "Transformer les informations d'un bien en annonce immobilière attractive tout en restant strictement fidèle aux caractéristiques fournies.",

        rules:
          "Ne jamais inventer une vue, un étage, une rénovation, un transport proche, une exposition ou un équipement non fourni.",

        outputFormat:
          "Un titre d'annonce puis un texte structuré en paragraphes courts avec les principales caractéristiques du bien.",
      };

    case "social":
      return {
        objective:
          "Créer une publication adaptée au réseau social choisi à partir des informations réellement fournies.",

        rules:
          "Ne jamais inventer d'offre, de résultat, de date ou de caractéristique. Respecter le ton de la marque et l'objectif indiqué.",

        outputFormat:
          "Une publication courte avec accroche, message principal et appel à l'action lorsque cela est pertinent.",
      };

    case "custom":
      return {
        objective:
          "",

        rules:
          "Utiliser uniquement les informations fournies dans les variables et signaler lorsqu'une information essentielle manque.",

        outputFormat:
          "",
      };
  }
}

function getSampleVariables(
  service: ServiceId
): Record<
  string,
  string
> {
  switch (service) {
    case "reviews":
      return {
        ENTREPRISE:
          "Bistro Central",

        AVIS_CLIENT:
          "Nous avons attendu presque 40 minutes avant d'être servis. Les plats étaient bons mais l'attente a gâché l'expérience.",

        TON:
          "Professionnel, chaleureux et calme",

        OBJECTIF:
          "Reconnaître le problème et préserver la relation client",
      };

    case "study":
      return {
        SUJET:
          "La photosynthèse",

        CONTENU_COURS:
          "La photosynthèse permet aux plantes chlorophylliennes de produire de la matière organique à partir de dioxyde de carbone et d'eau grâce à l'énergie lumineuse. Elle se déroule principalement dans les chloroplastes. Elle libère du dioxygène.",

        NIVEAU:
          "Lycée",

        FORMAT_REVISION:
          "Fiche courte avec notions essentielles et questions de révision",
      };

    case "product":
      return {
        PRODUIT:
          "Sac Horizon",

        CARACTERISTIQUES:
          "Cuir grainé, fermeture zippée, bandoulière réglable, dimensions 28 x 20 cm, couleur noire",

        PRIX:
          "149 €",

        CIBLE:
          "Adultes recherchant un sac compact pour un usage quotidien",

        TON:
          "Élégant et premium",
      };

    case "property":
      return {
        TYPE_BIEN:
          "Appartement",

        VILLE:
          "Lyon 6e",

        SURFACE:
          "68 m²",

        PIECES:
          "3 pièces, 2 chambres",

        POINTS_FORTS:
          "Balcon de 8 m², cuisine équipée, cave, séjour lumineux",

        TON:
          "Haut de gamme mais sobre",
      };

    case "social":
      return {
        MARQUE:
          "Club Horizon",

        SUJET:
          "Journée portes ouvertes",

        INFORMATIONS:
          "Samedi 4 octobre, de 10h à 17h, entrée gratuite, découverte des activités et rencontre avec les équipes.",

        PLATEFORME:
          "Instagram",

        TON:
          "Dynamique et accessible",

        OBJECTIF:
          "Donner envie de venir à la journée portes ouvertes",
      };

    case "custom":
      return {
        DONNEE_1:
          "",
        DONNEE_2:
          "",
        DONNEE_3:
          "",
      };
  }
}

/* ============================================================
   UI
============================================================ */

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
      className={`rounded-xl border px-3 py-3 ${
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

function TemplateField({
  label,
  helper,
  value,
  onChange,
  last = false,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (
    value: string
  ) => void;
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
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        rows={4}
        className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-slate-950"
      />
    </div>
  );
}

function DynamicField({
  variable,
  value,
  onChange,
}: {
  variable: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  const multiline =
    [
      "AVIS_CLIENT",
      "CONTENU_COURS",
      "CARACTERISTIQUES",
      "POINTS_FORTS",
      "INFORMATIONS",
    ].includes(
      variable
    ) ||
    value.length >
      90;

  return (
    <div>
      <label className="text-sm font-bold text-slate-700">
        {humanizeVariable(
          variable
        )}
      </label>

      <p className="mt-1 font-mono text-[10px] text-violet-500">
        {"{{"}
        {variable}
        {"}}"}
      </p>

      {multiline ? (
        <textarea
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-slate-950"
        />
      ) : (
        <input
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-950"
        />
      )}
    </div>
  );
}

function VariableBadge({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 font-mono text-xs font-semibold text-violet-700">
      {"{{"}
      {children}
      {"}}"}
    </span>
  );
}

function ProcessItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-xs font-bold text-slate-400">
        {number}
      </div>

      <div>
        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function ErrorMessage({
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

/* ============================================================
   HELPERS
============================================================ */

function normalizeVariable(
  value: string
) {
  return value
    .trim()
    .toUpperCase()
    .replace(
      /[^A-Z0-9À-Ü]+/g,
      "_"
    )
    .replace(
      /^_+|_+$/g,
      ""
    );
}

function humanizeVariable(
  variable: string
) {
  const map: Record<
    string,
    string
  > = {
    ENTREPRISE:
      "Entreprise",

    AVIS_CLIENT:
      "Avis du client",

    TON:
      "Ton",

    OBJECTIF:
      "Objectif",

    SUJET:
      "Sujet",

    CONTENU_COURS:
      "Contenu du cours",

    NIVEAU:
      "Niveau",

    FORMAT_REVISION:
      "Type de fiche",

    PRODUIT:
      "Produit",

    CARACTERISTIQUES:
      "Caractéristiques",

    PRIX:
      "Prix",

    CIBLE:
      "Public cible",

    TYPE_BIEN:
      "Type de bien",

    VILLE:
      "Ville",

    SURFACE:
      "Surface",

    PIECES:
      "Pièces",

    POINTS_FORTS:
      "Points forts",

    MARQUE:
      "Organisation / marque",

    INFORMATIONS:
      "Informations",

    PLATEFORME:
      "Plateforme",
  };

  return (
    map[
      variable
    ] ||
    variable
      .replaceAll(
        "_",
        " "
      )
      .toLowerCase()
      .replace(
        /^./,
        (letter) =>
          letter.toUpperCase()
      )
  );
}