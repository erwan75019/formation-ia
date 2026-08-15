"use client";

import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

type CsvRow = Record<string, string>;

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

type AiComparison = {
  vague?: string;
  precise?: string;
};

function parseCsv(
  content: string
) {
  const cleanContent =
    content
      .replace(/\r/g, "")
      .trim();

  const lines =
    cleanContent
      .split("\n")
      .filter(
        (line) =>
          line.trim()
            .length > 0
      );

  if (
    lines.length <
    2
  ) {
    return {
      headers: [] as string[],
      rows: [] as CsvRow[],
    };
  }

  const headers =
    lines[0]
      .split(",")
      .map(
        (header) =>
          header.trim()
      );

  const rows =
    lines
      .slice(1)
      .map(
        (line) => {
          const values =
            line.split(",");

          const row:
            CsvRow = {};

          headers.forEach(
            (
              header,
              index
            ) => {
              row[
                header
              ] =
                values[
                  index
                ]?.trim() ??
                "";
            }
          );

          return row;
        }
      );

  return {
    headers,
    rows,
  };
}

const imperfectRows = [
  {
    date:
      "12/08/26",
    description:
      "Carrefour",
    categorie:
      "Courses",
    montant:
      "42.50",
  },
  {
    date:
      "13 août",
    description:
      "CARREFOUR",
    categorie:
      "alimentation",
    montant:
      "36",
  },
  {
    date:
      "",
    description:
      "Netflix",
    categorie:
      "Abonnement",
    montant:
      "19.99",
  },
  {
    date:
      "15/08/26",
    description:
      "Carrefour",
    categorie:
      "Courses",
    montant:
      "42.50",
  },
  {
    date:
      "15/08/26",
    description:
      "Carrefour",
    categorie:
      "Courses",
    montant:
      "42.50",
  },
];

const issueOptions = [
  "Date manquante",
  "Formats de dates différents",
  "Noms écrits différemment",
  "Doublon possible",
  "Catégories incohérentes",
];

export default function FileIntroPractice() {
  const [
    fileName,
    setFileName,
  ] =
    useState("");

  const [
    headers,
    setHeaders,
  ] =
    useState<
      string[]
    >([]);

  const [
    rows,
    setRows,
  ] =
    useState<
      CsvRow[]
    >([]);

  const [
    knowledgeAnswer,
    setKnowledgeAnswer,
  ] =
    useState<number | null>(
      null
    );

  const [
    knowledgeValidated,
    setKnowledgeValidated,
  ] =
    useState(false);

  const [
    inferenceAnswer,
    setInferenceAnswer,
  ] =
    useState<number | null>(
      null
    );

  const [
    inferenceValidated,
    setInferenceValidated,
  ] =
    useState(false);

  const [
    selectedIssues,
    setSelectedIssues,
  ] =
    useState<string[]>([]);

  const [
    issueChecked,
    setIssueChecked,
  ] =
    useState(false);

  const [
    comparing,
    setComparing,
  ] =
    useState(false);

  const [
    comparison,
    setComparison,
  ] =
    useState<
      AiComparison | null
    >(null);

  const [
    verifyAnswer,
    setVerifyAnswer,
  ] =
    useState<number | null>(
      null
    );

  const [
    verifyValidated,
    setVerifyValidated,
  ] =
    useState(false);

  const [
    whatIsRow,
    setWhatIsRow,
  ] =
    useState("");

  const [
    availableInfo,
    setAvailableInfo,
  ] =
    useState("");

  const [
    missingInfo,
    setMissingInfo,
  ] =
    useState("");

  const [
    goal,
    setGoal,
  ] =
    useState("");

  const [
    aiRequest,
    setAiRequest,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

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

  const fileLoaded =
    rows.length > 0 &&
    headers.length > 0;

  const emptyCells =
    useMemo(() => {
      let count =
        0;

      rows.forEach(
        (row) => {
          headers.forEach(
            (header) => {
              if (
                !row[
                  header
                ]?.trim()
              ) {
                count++;
              }
            }
          );
        }
      );

      return count;
    }, [
      rows,
      headers,
    ]);

  const completedMissionFields =
    [
      whatIsRow,
      availableInfo,
      missingInfo,
      goal,
      aiRequest,
    ].filter(
      (value) =>
        value.trim()
          .length > 0
    ).length;

  const missionCompletion =
    Math.round(
      (completedMissionFields /
        5) *
        100
    );

  const learningStepsCompleted =
    [
      knowledgeValidated,
      inferenceValidated,
      issueChecked,
      comparison !== null,
      verifyValidated,
    ].filter(
      Boolean
    ).length;

  const canEvaluate =
    fileLoaded &&
    learningStepsCompleted ===
      5 &&
    missionCompletion ===
      100;

  function invalidateEvaluation() {
    setEvaluation(
      null
    );

    setError("");
  }

  async function loadSample() {
    setError("");
    setEvaluation(null);

    try {
      const response =
        await fetch(
          "/exercices/depenses-exemple.csv"
        );

      if (
        !response.ok
      ) {
        throw new Error(
          "Impossible de charger le fichier d'exercice."
        );
      }

      const content =
        await response.text();

      const parsed =
        parseCsv(
          content
        );

      if (
        parsed.headers
          .length ===
          0 ||
        parsed.rows.length ===
          0
      ) {
        throw new Error(
          "Le fichier d'exercice semble vide."
        );
      }

      setFileName(
        "depenses-exemple.csv"
      );

      setHeaders(
        parsed.headers
      );

      setRows(
        parsed.rows
      );
    } catch (
      error
    ) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Impossible de charger le fichier."
      );
    }
  }

  function handleFile(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    setError("");
    setEvaluation(null);

    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(
          ".csv"
        )
    ) {
      setError(
        "Pour cette première mission, utilisez un fichier CSV."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      () => {
        const content =
          String(
            reader.result ??
              ""
          );

        const parsed =
          parseCsv(
            content
          );

        if (
          parsed.headers
            .length ===
            0 ||
          parsed.rows
            .length ===
            0
        ) {
          setError(
            "Impossible de comprendre ce fichier."
          );

          return;
        }

        setFileName(
          file.name
        );

        setHeaders(
          parsed.headers
        );

        setRows(
          parsed.rows
        );
      };

    reader.readAsText(
      file
    );
  }

  function reset() {
    setFileName("");
    setHeaders([]);
    setRows([]);

    setKnowledgeAnswer(
      null
    );
    setKnowledgeValidated(
      false
    );

    setInferenceAnswer(
      null
    );
    setInferenceValidated(
      false
    );

    setSelectedIssues([]);
    setIssueChecked(false);

    setComparison(null);

    setVerifyAnswer(null);
    setVerifyValidated(false);

    setWhatIsRow("");
    setAvailableInfo("");
    setMissingInfo("");
    setGoal("");
    setAiRequest("");

    setError("");
    setEvaluation(null);
  }

  function toggleIssue(
    issue: string
  ) {
    if (issueChecked) {
      return;
    }

    setSelectedIssues(
      (current) =>
        current.includes(
          issue
        )
          ? current.filter(
              (item) =>
                item !==
                issue
            )
          : [
              ...current,
              issue,
            ]
    );
  }

  async function comparePrompts() {
    if (
      !fileLoaded ||
      comparing
    ) {
      return;
    }

    setComparing(true);
    setError("");
    setComparison(null);

    const vaguePrompt =
      "Analyse ce fichier.";

    const precisePrompt = `Explique-moi simplement ce fichier.

1. Dis-moi ce que représente une ligne.
2. Explique chaque colonne.
3. Signale les informations manquantes ou incohérentes.
4. N'invente aucune information absente.
5. Propose 5 questions utiles que je pourrais poser.
6. Quand tu tires une conclusion, explique sur quelles données elle repose.`;

    try {
      const [
        vagueResponse,
        preciseResponse,
      ] =
        await Promise.all([
          fetch(
            "/api/training/analyze-file",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify({
                  question:
                    vaguePrompt,
                  fileName,
                  headers,
                  rows,
                }),
            }
          ),
          fetch(
            "/api/training/analyze-file",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify({
                  question:
                    precisePrompt,
                  fileName,
                  headers,
                  rows,
                }),
            }
          ),
        ]);

      const vagueData =
        await vagueResponse.json();

      const preciseData =
        await preciseResponse.json();

      if (
        !vagueResponse.ok
      ) {
        throw new Error(
          vagueData.error ??
            "Impossible de tester la demande vague."
        );
      }

      if (
        !preciseResponse.ok
      ) {
        throw new Error(
          preciseData.error ??
            "Impossible de tester la demande précise."
        );
      }

      setComparison({
        vague:
          vagueData.answer ??
          "",
        precise:
          preciseData.answer ??
          "",
      });
    } catch (
      error
    ) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Impossible de comparer les deux demandes."
      );
    } finally {
      setComparing(false);
    }
  }

  async function evaluateWork() {
    if (
      !canEvaluate ||
      evaluating
    ) {
      return;
    }

    setEvaluating(true);
    setError("");
    setEvaluation(null);

    const context = `
L'apprenant travaille sur un fichier CSV.

Nom :
${fileName}

Colonnes :
${headers.join(", ")}

Nombre de lignes :
${rows.length}

Cases vides :
${emptyCells}

Aperçu :
${JSON.stringify(
  rows.slice(0, 8),
  null,
  2
)}

L'apprenant a déjà suivi des activités sur :
- ce qu'une ligne et une colonne représentent ;
- la différence entre information disponible et supposition ;
- les problèmes possibles d'un fichier ;
- la différence entre une demande vague et une demande précise ;
- la nécessité de vérifier une conclusion de l'IA.
`.trim();

    const answers = {
      "Ce que représente une ligne":
        whatIsRow,
      "Informations réellement disponibles":
        availableInfo,
      "Informations manquantes ou inconnues":
        missingInfo,
      "Ce que je veux apprendre":
        goal,
      "Ma demande finale à l'IA":
        aiRequest,
    };

    const criteria = [
      {
        name:
          "Compréhension du fichier",
        maxScore:
          20,
        description:
          "L'apprenant comprend correctement ce que représente une ligne et la structure générale du fichier.",
      },
      {
        name:
          "Faits vs suppositions",
        maxScore:
          20,
        description:
          "L'apprenant distingue les informations réellement présentes de ce qu'il ne peut pas savoir à partir du fichier.",
      },
      {
        name:
          "Détection des limites",
        maxScore:
          15,
        description:
          "L'apprenant identifie les informations manquantes, ambiguës ou potentiellement problématiques.",
      },
      {
        name:
          "Objectif utile",
        maxScore:
          15,
        description:
          "La question ou l'objectif choisi est concret, pertinent et réellement utile.",
      },
      {
        name:
          "Qualité de la demande IA",
        maxScore:
          20,
        description:
          "La demande finale est claire, structurée et indique précisément ce que l'IA doit produire.",
      },
      {
        name:
          "Vérification",
        maxScore:
          10,
        description:
          "La demande prévoit de ne pas inventer d'informations et de justifier ou vérifier les conclusions importantes.",
      },
    ];

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
                lessonId:
                  "fichiers-01-comprendre",
                title:
                  "Comprendre et utiliser un fichier avec l'IA",
                context,
                mission:
                  "Comprendre ce que le fichier permet réellement de savoir, repérer ses limites et construire une demande fiable et utile à envoyer à une IA.",
                answers,
                criteria,
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
            "Impossible d'évaluer votre travail."
        );
      }

      setEvaluation(
        data
      );
    } catch (
      error
    ) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Impossible d'évaluer votre travail."
      );
    } finally {
      setEvaluating(
        false
      );
    }
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      <div className="bg-slate-950 p-7 text-white md:p-8">

        <div className="flex flex-wrap items-center gap-3">

          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
            ATELIER GUIDÉ
          </span>

          <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400">
            20 à 25 min
          </span>

        </div>

        <h2 className="mt-5 text-3xl font-bold">
          Comprendre avant de demander
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Cette partie vous apprend à regarder un fichier comme une source d’informations : ce qu’il dit réellement, ce qu’il ne dit pas et comment demander à l’IA de travailler dessus sans inventer.
        </p>

      </div>

      <div className="p-6 md:p-8">

        {!fileLoaded ? (
          <div>

            <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
              ÉTAPE 01
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Choisissez un fichier
            </h3>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Commencez avec notre exemple ou utilisez votre propre fichier CSV.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <button
                type="button"
                onClick={
                  loadSample
                }
                className="rounded-[24px] border border-slate-200 p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
                  A
                </div>

                <h4 className="mt-5 text-lg font-bold">
                  Fichier d’exercice
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Revenus et dépenses d’un mois.
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Utiliser cet exemple →
                </p>
              </button>

              <label className="cursor-pointer rounded-[24px] border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-900">
                  B
                </div>

                <h4 className="mt-5 text-lg font-bold">
                  Mon propre fichier
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Importez un CSV qui vous appartient.
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Choisir un fichier →
                </p>

                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={
                    handleFile
                  }
                  className="hidden"
                />

              </label>

            </div>

          </div>
        ) : (
          <div>

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                  FICHIER CHARGÉ
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {fileName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {rows.length} lignes ·{" "}
                  {headers.length} colonnes ·{" "}
                  {emptyCells} cases vides
                </p>

              </div>

              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
              >
                Changer de fichier
              </button>

            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">

              <table className="min-w-full text-sm">

                <thead className="bg-slate-100">

                  <tr>
                    {headers.map(
                      (
                        header
                      ) => (
                        <th
                          key={
                            header
                          }
                          className="whitespace-nowrap px-4 py-3 text-left font-semibold"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>

                </thead>

                <tbody>

                  {rows
                    .slice(
                      0,
                      5
                    )
                    .map(
                      (
                        row,
                        rowIndex
                      ) => (
                        <tr
                          key={
                            rowIndex
                          }
                          className="border-t border-slate-100"
                        >
                          {headers.map(
                            (
                              header
                            ) => (
                              <td
                                key={`${rowIndex}-${header}`}
                                className="whitespace-nowrap px-4 py-3 text-slate-600"
                              >
                                {row[
                                  header
                                ] ||
                                  "—"}
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}

                </tbody>

              </table>

            </div>

            <LearningBlock
              number="01"
              title="Comprendre ce que représente une ligne"
              intro="Observez le fichier. Ne cherchez pas encore à analyser les chiffres."
            >

              <ChoiceQuestion
                question="Dans ce fichier d'exemple, que représente probablement une ligne ?"
                answers={[
                  "Une opération financière",
                  "Un mois entier",
                  "Une personne différente",
                  "Une catégorie entière",
                ]}
                correctIndex={0}
                selected={
                  knowledgeAnswer
                }
                validated={
                  knowledgeValidated
                }
                onSelect={
                  setKnowledgeAnswer
                }
                onValidate={() =>
                  setKnowledgeValidated(
                    true
                  )
                }
                explanation="Chaque ligne possède une date, une description, une catégorie et un montant : elle représente donc une opération."
              />

            </LearningBlock>

            <LearningBlock
              number="02"
              title="Savoir ce que le fichier ne dit pas"
              intro="Une donnée présente dans le fichier n'autorise pas toutes les conclusions."
            >

              <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                <strong>
                  Exemple :
                </strong>
                <br />
                Date : 05/07/2026
                <br />
                Description : SNCF
                <br />
                Catégorie : Transport
                <br />
                Montant : 74 €
              </div>

              <div className="mt-4">

                <ChoiceQuestion
                  question="Peut-on savoir, grâce à ces seules informations, pourquoi cette personne a acheté ce billet ?"
                  answers={[
                    "Oui",
                    "Non",
                  ]}
                  correctIndex={1}
                  selected={
                    inferenceAnswer
                  }
                  validated={
                    inferenceValidated
                  }
                  onSelect={
                    setInferenceAnswer
                  }
                  onValidate={() =>
                    setInferenceValidated(
                      true
                    )
                  }
                  explanation="Le fichier prouve qu'une dépense SNCF de 74 € existe. Il ne donne pas le motif du déplacement. Toute explication serait une supposition."
                />

              </div>

            </LearningBlock>

            <LearningBlock
              number="03"
              title="Repérer les problèmes avant l'analyse"
              intro="Voici maintenant un petit fichier volontairement imparfait."
            >

              <div className="overflow-x-auto rounded-2xl border border-slate-200">

                <table className="min-w-full text-sm">

                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        date
                      </th>
                      <th className="px-4 py-3 text-left">
                        description
                      </th>
                      <th className="px-4 py-3 text-left">
                        categorie
                      </th>
                      <th className="px-4 py-3 text-left">
                        montant
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {imperfectRows.map(
                      (
                        row,
                        index
                      ) => (
                        <tr
                          key={
                            index
                          }
                          className="border-t border-slate-100"
                        >
                          <td className="px-4 py-3">
                            {row.date ||
                              "—"}
                          </td>
                          <td className="px-4 py-3">
                            {
                              row.description
                            }
                          </td>
                          <td className="px-4 py-3">
                            {
                              row.categorie
                            }
                          </td>
                          <td className="px-4 py-3">
                            {
                              row.montant
                            }
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>

              </div>

              <p className="mt-5 font-semibold">
                Que remarquez-vous ?
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">

                {issueOptions.map(
                  (
                    issue
                  ) => {
                    const active =
                      selectedIssues.includes(
                        issue
                      );

                    const correct =
                      issueChecked;

                    return (
                      <button
                        key={
                          issue
                        }
                        type="button"
                        disabled={
                          issueChecked
                        }
                        onClick={() =>
                          toggleIssue(
                            issue
                          )
                        }
                        className={`rounded-2xl border p-4 text-left text-sm transition ${
                          active
                            ? "border-slate-950 bg-slate-50"
                            : "border-slate-200"
                        } ${
                          correct &&
                          active
                            ? "font-semibold"
                            : ""
                        }`}
                      >
                        {active
                          ? "✓ "
                          : "○ "}
                        {issue}
                      </button>
                    );
                  }
                )}

              </div>

              {!issueChecked ? (
                <button
                  type="button"
                  disabled={
                    selectedIssues.length ===
                    0
                  }
                  onClick={() =>
                    setIssueChecked(
                      true
                    )
                  }
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Vérifier mes observations
                </button>
              ) : (
                <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700">
                  Ce fichier contient bien une date manquante, plusieurs formats de dates, des noms écrits différemment, des catégories incohérentes et un doublon possible. Le mot important est <strong>possible</strong> : deux lignes identiques doivent encore être vérifiées avant suppression.
                </div>
              )}

            </LearningBlock>

            <LearningBlock
              number="04"
              title="Voir la différence entre une demande vague et une demande précise"
              intro="Cette fois, Ollama va recevoir le même fichier avec deux instructions différentes."
            >

              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                    DEMANDE VAGUE
                  </p>

                  <p className="mt-3 font-medium">
                    « Analyse ce fichier. »
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                    DEMANDE PRÉCISE
                  </p>

                  <p className="mt-3 text-sm leading-7">
                    « Explique le fichier, décris les colonnes, signale les informations manquantes, n’invente rien et justifie les conclusions importantes. »
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={
                  comparePrompts
                }
                disabled={
                  comparing
                }
                className="mt-5 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:opacity-50"
              >
                {comparing
                  ? "Ollama compare les deux demandes..."
                  : comparison
                  ? "Relancer la comparaison"
                  : "Tester les deux demandes avec Ollama →"}
              </button>

              {comparison && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="font-bold">
                      Résultat de la demande vague
                    </p>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {
                        comparison.vague
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="font-bold">
                      Résultat de la demande précise
                    </p>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                      {
                        comparison.precise
                      }
                    </p>
                  </div>

                </div>
              )}

            </LearningBlock>

            <LearningBlock
              number="05"
              title="Ne pas confondre réponse et preuve"
              intro="Une IA peut donner une phrase convaincante qui mérite pourtant d'être vérifiée."
            >

              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                  RÉPONSE DE L’IA
                </p>

                <p className="mt-3 leading-7 text-slate-300">
                  « Les dépenses de restauration représentent la majorité de vos dépenses. »
                </p>
              </div>

              <div className="mt-4">

                <ChoiceQuestion
                  question="Quel est le meilleur réflexe ?"
                  answers={[
                    "Croire la réponse parce qu'elle est formulée clairement",
                    "Demander les montants utilisés et vérifier la comparaison",
                    "Supprimer les autres catégories",
                    "Demander à l'IA d'être plus sûre d'elle",
                  ]}
                  correctIndex={1}
                  selected={
                    verifyAnswer
                  }
                  validated={
                    verifyValidated
                  }
                  onSelect={
                    setVerifyAnswer
                  }
                  onValidate={() =>
                    setVerifyValidated(
                      true
                    )
                  }
                  explanation="Une conclusion n'est pas une preuve. Il faut pouvoir retrouver les valeurs qui la justifient dans le fichier."
                />

              </div>

            </LearningBlock>

            <div className="mt-10 rounded-[28px] border border-slate-200 p-6 md:p-7">

              <div className="flex flex-wrap items-end justify-between gap-4">

                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                    MISSION FINALE
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    À vous de construire la bonne méthode
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Réutilisez maintenant ce que vous venez d’apprendre sur votre fichier.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">
                  {missionCompletion}%
                </div>

              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all"
                  style={{
                    width:
                      `${missionCompletion}%`,
                  }}
                />
              </div>

              <div className="mt-7 space-y-5">

                <PracticeField
                  number="01"
                  label="Que représente une ligne ?"
                  description="Expliquez ce que représente une ligne de votre fichier."
                  placeholder="Une ligne représente..."
                  value={
                    whatIsRow
                  }
                  onChange={(
                    value
                  ) => {
                    setWhatIsRow(
                      value
                    );
                    invalidateEvaluation();
                  }}
                />

                <PracticeField
                  number="02"
                  label="Quelles informations sont réellement disponibles ?"
                  description="Listez uniquement ce que le fichier permet réellement de savoir."
                  placeholder="Le fichier contient..."
                  value={
                    availableInfo
                  }
                  onChange={(
                    value
                  ) => {
                    setAvailableInfo(
                      value
                    );
                    invalidateEvaluation();
                  }}
                />

                <PracticeField
                  number="03"
                  label="Qu’est-ce que le fichier ne permet pas de savoir ?"
                  description="Identifiez les informations manquantes ou les conclusions qui seraient seulement des suppositions."
                  placeholder="Le fichier ne permet pas de savoir..."
                  value={
                    missingInfo
                  }
                  onChange={(
                    value
                  ) => {
                    setMissingInfo(
                      value
                    );
                    invalidateEvaluation();
                  }}
                />

                <PracticeField
                  number="04"
                  label="Quelle question vous serait réellement utile ?"
                  description="Choisissez un objectif concret."
                  placeholder="J’aimerais savoir..."
                  value={
                    goal
                  }
                  onChange={(
                    value
                  ) => {
                    setGoal(
                      value
                    );
                    invalidateEvaluation();
                  }}
                />

                <PracticeField
                  number="05"
                  label="Rédigez votre demande finale à l’IA"
                  description="Écrivez le message que vous enverriez réellement à une IA. Pensez aux données disponibles, aux limites et à la vérification."
                  placeholder={`Exemple de structure :

"Voici mon fichier...
Je veux comprendre...
Utilise uniquement les informations présentes...
Signale ce qui manque...
Explique les données utilisées pour..."`}
                  value={
                    aiRequest
                  }
                  onChange={(
                    value
                  ) => {
                    setAiRequest(
                      value
                    );
                    invalidateEvaluation();
                  }}
                  rows={
                    8
                  }
                />

              </div>

              {learningStepsCompleted <
                5 && (
                <p className="mt-5 text-sm text-slate-400">
                  Terminez d’abord les 5 activités guidées ci-dessus.
                </p>
              )}

              <button
                type="button"
                onClick={
                  evaluateWork
                }
                disabled={
                  !canEvaluate ||
                  evaluating
                }
                className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {evaluating
                  ? "Ollama évalue votre travail..."
                  : evaluation
                  ? "Réévaluer ma mission →"
                  : "Faire évaluer ma mission →"}
              </button>

            </div>

            {error && (
              <div className="mt-6 rounded-2xl bg-slate-100 p-5 text-sm text-slate-700">
                {error}
              </div>
            )}

            {evaluation && (
              <div className="mt-8 overflow-hidden rounded-[26px] border border-slate-200">

                <div className="bg-slate-950 p-7 text-white">

                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                    ÉVALUATION
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

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className="h-full rounded-full bg-white"
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

                <div className="p-6 md:p-7">

                  <div className="space-y-4">

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

                          <div className="flex flex-wrap items-center justify-between gap-3">

                            <p className="font-bold">
                              {
                                criterion.name
                              }
                            </p>

                            <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold shadow-sm">
                              {
                                criterion.score
                              }
                              {" / "}
                              {
                                criterion.maxScore
                              }
                            </span>

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

                  {evaluation.strengths.length >
                    0 && (
                    <div className="mt-7">

                      <h4 className="font-bold">
                        Points forts
                      </h4>

                      <div className="mt-3 space-y-2">

                        {evaluation.strengths.map(
                          (
                            strength,
                            index
                          ) => (
                            <div
                              key={`${strength}-${index}`}
                              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                            >
                              ✓{" "}
                              {
                                strength
                              }
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {evaluation.improvements.length >
                    0 && (
                    <div className="mt-7">

                      <h4 className="font-bold">
                        À améliorer
                      </h4>

                      <div className="mt-3 space-y-2">

                        {evaluation.improvements.map(
                          (
                            improvement,
                            index
                          ) => (
                            <div
                              key={`${improvement}-${index}`}
                              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                            >
                              →{" "}
                              {
                                improvement
                              }
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {evaluation.advice && (
                    <div className="mt-7 rounded-2xl bg-slate-950 p-5 text-white">

                      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                        CONSEIL DU COACH
                      </p>

                      <p className="mt-3 leading-7 text-slate-300">
                        {
                          evaluation.advice
                        }
                      </p>

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </section>
  );
}

function LearningBlock({
  number,
  title,
  intro,
  children,
}: {
  number: string;
  title: string;
  intro: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="mt-9 rounded-[26px] border border-slate-200 p-6">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {number}
        </div>

        <div>

          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {intro}
          </p>

        </div>

      </div>

      <div className="mt-6">
        {children}
      </div>

    </section>
  );
}

function ChoiceQuestion({
  question,
  answers,
  correctIndex,
  selected,
  validated,
  onSelect,
  onValidate,
  explanation,
}: {
  question: string;
  answers: string[];
  correctIndex: number;
  selected:
    number | null;
  validated: boolean;
  onSelect:
    (
      index: number
    ) => void;
  onValidate:
    () => void;
  explanation: string;
}) {
  const correct =
    selected ===
    correctIndex;

  return (
    <div>

      <p className="font-semibold">
        {question}
      </p>

      <div className="mt-4 space-y-3">

        {answers.map(
          (
            answer,
            index
          ) => {
            const active =
              selected ===
              index;

            const isCorrect =
              validated &&
              index ===
                correctIndex;

            const wrong =
              validated &&
              active &&
              index !==
                correctIndex;

            return (
              <button
                key={
                  answer
                }
                type="button"
                disabled={
                  validated
                }
                onClick={() =>
                  onSelect(
                    index
                  )
                }
                className={`w-full rounded-2xl border p-4 text-left text-sm transition ${
                  isCorrect
                    ? "border-slate-950 bg-slate-50 font-semibold"
                    : wrong
                    ? "border-slate-400 bg-slate-100"
                    : active
                    ? "border-slate-950 bg-slate-50"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                {String.fromCharCode(
                  65 +
                    index
                )}
                .{" "}
                {
                  answer
                }
              </button>
            );
          }
        )}

      </div>

      {!validated ? (
        <button
          type="button"
          disabled={
            selected ===
            null
          }
          onClick={
            onValidate
          }
          className="mt-4 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
        >
          Vérifier
        </button>
      ) : (
        <div className="mt-4 rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700">

          <p className="font-bold">
            {correct
              ? "Bonne réponse"
              : "À retenir"}
          </p>

          <p className="mt-2">
            {explanation}
          </p>

        </div>
      )}

    </div>
  );
}

function PracticeField({
  number,
  label,
  description,
  placeholder,
  value,
  onChange,
  rows = 5,
}: {
  number: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  onChange:
    (
      value: string
    ) => void;
  rows?: number;
}) {
  const completed =
    value.trim()
      .length > 0;

  return (
    <div className="rounded-[24px] border border-slate-200 p-5">

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
            : number}
        </div>

        <div className="flex-1">

          <label className="font-bold">
            {label}
          </label>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>

          <textarea
            value={
              value
            }
            onChange={(
              event
            ) =>
              onChange(
                event.target
                  .value
              )
            }
            placeholder={
              placeholder
            }
            rows={
              rows
            }
            className="mt-4 w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 leading-7 outline-none transition placeholder:text-slate-300 focus:border-slate-950"
          />

        </div>

      </div>

    </div>
  );
}
