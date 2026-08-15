"use client";

import { useMemo, useState } from "react";

type ClientInfo = {
  id: string;
  label: string;
  value: string;
  useful: boolean;
  category:
    | "objective"
    | "context"
    | "audience"
    | "data"
    | "constraint"
    | "format";
};

const clientInformations: ClientInfo[] = [
  {
    id: "goal",
    label: "Objectif commercial",
    value:
      "Augmenter les visites en magasin lors des nouvelles sorties.",
    useful: true,
    category: "objective",
  },
  {
    id: "audience",
    label: "Public principal",
    value:
      "18-30 ans intéressés par les sneakers et la mode urbaine.",
    useful: true,
    category: "audience",
  },
  {
    id: "positioning",
    label: "Positionnement",
    value:
      "Une communication urbaine, moderne et premium.",
    useful: true,
    category: "context",
  },
  {
    id: "product-data",
    label: "Informations disponibles",
    value:
      "Modèle, prix, date de sortie, tailles disponibles et photo.",
    useful: true,
    category: "data",
  },
  {
    id: "channel",
    label: "Canal",
    value:
      "La publication est destinée à Instagram.",
    useful: true,
    category: "format",
  },
  {
    id: "length",
    label: "Longueur souhaitée",
    value:
      "Le texte doit rester court et facilement lisible.",
    useful: true,
    category: "constraint",
  },
  {
    id: "favorite-color",
    label: "Couleur préférée de la responsable",
    value:
      "La responsable préfère personnellement le bleu.",
    useful: false,
    category: "context",
  },
  {
    id: "coffee",
    label: "Habitude personnelle",
    value:
      "Elle boit généralement un café pendant qu’elle prépare ses publications.",
    useful: false,
    category: "context",
  },
];

export default function PromptBuilder() {
  const [step, setStep] = useState(1);

  const [selectedInfo, setSelectedInfo] =
    useState<string[]>([]);

  const [objective, setObjective] =
    useState("");

  const [context, setContext] =
    useState("");

  const [audience, setAudience] =
    useState("");

  const [data, setData] =
    useState("");

  const [constraints, setConstraints] =
    useState("");

  const [format, setFormat] =
    useState("");

  const [showEvaluation, setShowEvaluation] =
    useState(false);

  function toggleInfo(id: string) {
    setSelectedInfo((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  const usefulSelected =
    clientInformations.filter(
      (info) =>
        info.useful &&
        selectedInfo.includes(info.id)
    ).length;

  const uselessSelected =
    clientInformations.filter(
      (info) =>
        !info.useful &&
        selectedInfo.includes(info.id)
    ).length;

  const informationScore =
    Math.max(
      0,
      Math.round(
        (usefulSelected / 6) * 100 -
          uselessSelected * 10
      )
    );

  const prompt = useMemo(() => {
    return `OBJECTIF
${objective || "[À compléter]"}

CONTEXTE
${context || "[À compléter]"}

PUBLIC
${audience || "[À compléter]"}

DONNÉES DISPONIBLES
${data || "[À compléter]"}

CONTRAINTES
${constraints || "[À compléter]"}

FORMAT ATTENDU
${format || "[À compléter]"}

Utilise uniquement les informations fournies.
Si une information essentielle manque, indique-le au lieu de l’inventer.`;
  }, [
    objective,
    context,
    audience,
    data,
    constraints,
    format,
  ]);

  const criteria = [
    {
      label: "Objectif précis",
      valid:
        objective.trim().length >= 20,
    },
    {
      label: "Contexte utile",
      valid:
        context.trim().length >= 15,
    },
    {
      label: "Public défini",
      valid:
        audience.trim().length >= 8,
    },
    {
      label: "Données disponibles",
      valid:
        data.trim().length >= 15,
    },
    {
      label: "Contraintes",
      valid:
        constraints.trim().length >= 15,
    },
    {
      label: "Format attendu",
      valid:
        format.trim().length >= 15,
    },
  ];

  const validCount =
    criteria.filter(
      (criterion) =>
        criterion.valid
    ).length;

  const structureScore =
    Math.round(
      (validCount /
        criteria.length) *
        100
    );

  const finalScore =
    Math.round(
      informationScore * 0.35 +
        structureScore * 0.65
    );

  function fillFromSelectedInfo() {
    const selected =
      clientInformations.filter(
        (info) =>
          selectedInfo.includes(
            info.id
          )
      );

    setObjective(
      selected.find(
        (item) =>
          item.category ===
          "objective"
      )?.value ?? ""
    );

    setContext(
      selected.find(
        (item) =>
          item.category ===
          "context" &&
          item.useful
      )?.value ?? ""
    );

    setAudience(
      selected.find(
        (item) =>
          item.category ===
          "audience"
      )?.value ?? ""
    );

    setData(
      selected.find(
        (item) =>
          item.category ===
          "data"
      )?.value ?? ""
    );

    setConstraints(
      selected.find(
        (item) =>
          item.category ===
          "constraint"
      )?.value ?? ""
    );

    setFormat(
      selected.find(
        (item) =>
          item.category ===
          "format"
      )?.value ?? ""
    );

    setStep(2);
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="bg-slate-950 px-6 py-7 text-white md:px-8">

        <div className="flex flex-wrap items-center justify-between gap-5">

          <div>

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
              PROMPT LAB
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Construisez le prompt de la solution
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Un bon prestataire ne copie pas
              toutes les informations du client.
              Il sélectionne celles qui sont utiles
              puis les transforme en instruction exploitable.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-center">

            <p className="text-xs font-semibold text-slate-500">
              ÉTAPE
            </p>

            <p className="mt-1 text-2xl font-bold">
              {step} / 3
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          STEP 1
      ====================================================== */}

      {step === 1 && (
        <div className="p-6 md:p-8">

          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
            ÉTAPE 1 · TRIER L’INFORMATION
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Quelles informations doivent réellement être transmises à l’IA ?
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Le client vous a donné plusieurs informations.
            Certaines sont indispensables pour obtenir une bonne sortie.
            D’autres n’apportent rien au résultat.
          </p>

          <div className="mt-7 grid gap-3">

            {clientInformations.map(
              (info) => {
                const selected =
                  selectedInfo.includes(
                    info.id
                  );

                return (
                  <button
                    key={info.id}
                    type="button"
                    onClick={() =>
                      toggleInfo(
                        info.id
                      )
                    }
                    className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        selected
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {selected
                        ? "✓"
                        : "+"}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-800">
                        {info.label}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {info.value}
                      </p>

                    </div>

                  </button>
                );
              }
            )}

          </div>

          <button
            type="button"
            disabled={
              selectedInfo.length === 0
            }
            onClick={
              fillFromSelectedInfo
            }
            className="mt-7 rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Utiliser ces informations →
          </button>

        </div>
      )}

      {/* ======================================================
          STEP 2
      ====================================================== */}

      {step === 2 && (
        <div className="grid lg:grid-cols-2">

          {/* BUILDER */}

          <div className="border-b border-slate-200 p-6 md:p-8 lg:border-b-0 lg:border-r">

            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              ÉTAPE 2 · STRUCTURER
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Transformez maintenant le besoin en prompt
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Vous pouvez modifier les informations proposées.
              L’objectif n’est pas de remplir des cases,
              mais de rendre chaque partie utile au résultat.
            </p>

            <div className="mt-7">

              <BuilderField
                label="Objectif"
                helper="Quel résultat concret voulez-vous obtenir ?"
                value={objective}
                onChange={
                  setObjective
                }
              />

              <BuilderField
                label="Contexte"
                helper="Quelle situation l’IA doit-elle comprendre ?"
                value={context}
                onChange={
                  setContext
                }
              />

              <BuilderField
                label="Public"
                helper="À qui le contenu est-il destiné ?"
                value={audience}
                onChange={
                  setAudience
                }
              />

              <BuilderField
                label="Données disponibles"
                helper="Quelles informations seront fournies à chaque utilisation ?"
                value={data}
                onChange={setData}
              />

              <BuilderField
                label="Contraintes"
                helper="Quelles règles doivent être respectées ?"
                value={
                  constraints
                }
                onChange={
                  setConstraints
                }
              />

              <BuilderField
                label="Format attendu"
                helper="Sous quelle forme doit sortir le résultat ?"
                value={format}
                onChange={
                  setFormat
                }
                last
              />

            </div>

          </div>

          {/* PREVIEW */}

          <div className="bg-slate-50 p-6 md:p-8">

            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              APERÇU EN DIRECT
            </p>

            <div className="mt-4 rounded-2xl bg-slate-950 p-5">

              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                {prompt}
              </pre>

            </div>

            <div className="mt-6">

              <p className="text-sm font-bold">
                Structure
              </p>

              <div className="mt-4 space-y-2">

                {criteria.map(
                  (criterion) => (
                    <div
                      key={
                        criterion.label
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >

                      <span className="text-sm text-slate-600">
                        {
                          criterion.label
                        }
                      </span>

                      <span
                        className={`text-sm font-bold ${
                          criterion.valid
                            ? "text-emerald-600"
                            : "text-slate-300"
                        }`}
                      >
                        {criterion.valid
                          ? "✓"
                          : "—"}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                setShowEvaluation(
                  true
                );

                setStep(3);
              }}
              className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01]"
            >
              Évaluer mon prompt →
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          STEP 3
      ====================================================== */}

      {step === 3 &&
        showEvaluation && (
          <div className="p-6 md:p-8">

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

              {/* SCORE */}

              <div className="rounded-[26px] bg-slate-950 p-7 text-white">

                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  QUALITÉ DU PROMPT
                </p>

                <p className="mt-5 text-6xl font-bold">
                  {finalScore}
                </p>

                <p className="mt-1 text-slate-500">
                  / 100
                </p>

                <div className="mt-7 space-y-4">

                  <ScoreLine
                    label="Sélection des informations"
                    value={
                      informationScore
                    }
                  />

                  <ScoreLine
                    label="Structure"
                    value={
                      structureScore
                    }
                  />

                </div>

              </div>

              {/* FEEDBACK */}

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-7">

                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                  ANALYSE
                </p>

                <h3 className="mt-3 text-2xl font-bold">
                  {finalScore >= 85
                    ? "Très bonne base"
                    : finalScore >=
                      65
                    ? "Bonne direction, mais améliorable"
                    : "Le prompt manque encore d’informations utiles"}
                </h3>

                <p className="mt-4 leading-7 text-slate-500">
                  {finalScore >= 85
                    ? "Votre prompt contient les éléments principaux nécessaires pour produire une publication cohérente et exploitable."
                    : finalScore >=
                      65
                    ? "Votre structure est correcte, mais certaines informations importantes sont absentes ou trop vagues."
                    : "Revenez sur le besoin client. Un prompt ne peut pas compenser un objectif ou un contexte insuffisamment défini."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  {criteria.map(
                    (
                      criterion
                    ) => (
                      <div
                        key={
                          criterion.label
                        }
                        className={`rounded-xl border p-4 ${
                          criterion.valid
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-amber-200 bg-amber-50"
                        }`}
                      >

                        <p className="text-sm font-semibold">
                          {criterion.valid
                            ? "✓"
                            : "À améliorer"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            criterion.label
                          }
                        </p>

                      </div>
                    )
                  )}

                </div>

                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

                  <p className="text-xs font-bold tracking-[0.16em] text-blue-700">
                    CE QUE VOUS VENEZ D’APPRENDRE
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-950">
                    La qualité d’un prompt vient d’abord de la qualité
                    du cadrage. Un bon prestataire IA sait éliminer
                    les informations inutiles et transformer le besoin
                    client en éléments exploitables.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setShowEvaluation(
                      false
                    );
                  }}
                  className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-slate-100"
                >
                  ← Améliorer mon prompt
                </button>

              </div>

            </div>

            {/* RESULTAT VISIBLE */}

            <div className="mt-7 rounded-[26px] border border-slate-200 bg-white p-7">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                    PREMIÈRE BRIQUE CONSTRUITE
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Générateur de publication produit
                  </h3>

                </div>

                <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
                  Prototype
                </span>

              </div>

              <p className="mt-4 max-w-3xl leading-7 text-slate-500">
                Vous venez de définir le moteur textuel d’un futur outil.
                Plus tard dans la formation, ce prompt pourra être relié à
                un formulaire, une API, une base de données puis une vraie
                interface client.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-950 p-5">

                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                  {prompt}
                </pre>

              </div>

            </div>

          </div>
        )}

    </section>
  );
}

function BuilderField({
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
        last ? "" : "mb-6"
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
        rows={3}
        className="mt-3 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-950"
      />

    </div>
  );
}

function ScoreLine({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <div className="flex justify-between gap-4 text-xs">

        <span className="text-slate-400">
          {label}
        </span>

        <span>
          {value}%
        </span>

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-white"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}