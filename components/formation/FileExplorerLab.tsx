"use client";

import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

// ======================================================
// TYPES
// ======================================================

type CsvRow = Record<
  string,
  string
>;

// ======================================================
// PARSE CSV SIMPLE
// ======================================================

function parseCsv(
  content: string
) {
  const cleanContent =
    content
      .replace(/\r/g, "")
      .trim();

  const lines =
    cleanContent.split("\n");

  if (
    lines.length <
    2
  ) {
    return {
      headers: [],
      rows: [],
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
      .filter(
        (line) =>
          line.trim()
            .length > 0
      )
      .map(
        (line) => {
          const values =
            line.split(",");

          const row: CsvRow =
            {};

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

// ======================================================
// COMPONENT
// ======================================================

export default function FileExplorerLab() {
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
    error,
    setError,
  ] =
    useState("");

  const [
    loaded,
    setLoaded,
  ] =
    useState(false);

  // ======================================================
  // LOAD SAMPLE
  // ======================================================

  async function loadSample() {
    setError("");

    try {
      const response =
        await fetch(
          "/exercices/depenses-exemple.csv"
        );

      if (
        !response.ok
      ) {
        throw new Error(
          "Impossible de charger le fichier d'exemple."
        );
      }

      const text =
        await response.text();

      const parsed =
        parseCsv(
          text
        );

      if (
        parsed.headers
          .length ===
        0
      ) {
        throw new Error(
          "Le fichier semble vide."
        );
      }

      setHeaders(
        parsed.headers
      );

      setRows(
        parsed.rows
      );

      setFileName(
        "depenses-exemple.csv"
      );

      setLoaded(
        true
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

  // ======================================================
  // USER FILE
  // ======================================================

  function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setError("");

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
        "Pour cette première leçon, utilisez un fichier CSV."
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
          0
        ) {
          setError(
            "Impossible de comprendre ce fichier."
          );

          return;
        }

        setHeaders(
          parsed.headers
        );

        setRows(
          parsed.rows
        );

        setFileName(
          file.name
        );

        setLoaded(
          true
        );
      };

    reader.readAsText(
      file
    );
  }

  // ======================================================
  // BASIC INFORMATION
  // ======================================================

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

  // ======================================================
  // RESET
  // ======================================================

  function resetFile() {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setLoaded(false);
    setError("");
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="bg-slate-950 p-7 text-white">

        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
          LAB PRATIQUE
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          Ouvrez votre premier fichier
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          Vous n’avez besoin d’aucune connaissance en Excel,
          programmation ou analyse de données.
        </p>

      </div>

      <div className="p-6 md:p-8">

        {/* ==================================================
            CHOICE
        ================================================== */}

        {!loaded && (
          <>
            <p className="text-sm font-semibold text-slate-500">
              Pour commencer, choisissez une option.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {/* SAMPLE */}

              <button
                type="button"
                onClick={
                  loadSample
                }
                className="rounded-[24px] border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
                  01
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Utiliser le fichier d’exercice
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Un petit fichier de revenus et dépenses
                  déjà préparé pour cette leçon.
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Charger le fichier →
                </p>

              </button>

              {/* USER FILE */}

              <label className="cursor-pointer rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-900">
                  02
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Utiliser mon propre fichier
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Vous pouvez déjà tester avec un fichier CSV
                  qui vous appartient.
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Sélectionner un fichier →
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
          </>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm text-slate-700">
            {error}
          </div>
        )}

        {/* ==================================================
            FILE LOADED
        ================================================== */}

        {loaded && (
          <div>

            {/* FILE */}

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                  FICHIER CHARGÉ
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {fileName}
                </h3>

              </div>

              <button
                type="button"
                onClick={
                  resetFile
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
              >
                Changer de fichier
              </button>

            </div>

            {/* ==================================================
                AUTOMATIC SUMMARY
            ================================================== */}

            <div className="mt-7 grid gap-4 sm:grid-cols-3">

              <InfoCard
                value={
                  String(
                    rows.length
                  )
                }
                label="lignes"
              />

              <InfoCard
                value={
                  String(
                    headers.length
                  )
                }
                label="colonnes"
              />

              <InfoCard
                value={
                  String(
                    emptyCells
                  )
                }
                label="cases vides"
              />

            </div>

            {/* ==================================================
                SIMPLE EXPLANATION
            ================================================== */}

            <div className="mt-7 rounded-[24px] bg-slate-50 p-6">

              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                COMPRENDRE SIMPLEMENT
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Que contient ce fichier ?
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Ce fichier contient{" "}
                <strong>
                  {rows.length}
                </strong>{" "}
                lignes d’informations.
                Chaque ligne représente un élément,
                et chaque colonne décrit une information
                particulière.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                {headers.map(
                  (
                    header
                  ) => (
                    <span
                      key={
                        header
                      }
                      className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      {header}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* ==================================================
                TABLE
            ================================================== */}

            <div className="mt-7">

              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                APERÇU
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Regardons les premières lignes
              </h3>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">

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
                        8
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
                                  key={
                                    `${rowIndex}-${header}`
                                  }
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

              {rows.length >
                8 && (
                <p className="mt-3 text-xs text-slate-400">
                  Aperçu des 8 premières lignes sur{" "}
                  {rows.length}.
                </p>
              )}

            </div>

            {/* ==================================================
                QUESTIONS
            ================================================== */}

            <div className="mt-8 rounded-[24px] border border-slate-200 p-6">

              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                PREMIER RÉFLEXE
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Avant de demander une analyse à l’IA
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Commencez toujours par comprendre ce que
                représente le fichier.
              </p>

              <div className="mt-5 space-y-3">

                <QuestionLine>
                  Que représente une ligne ?
                </QuestionLine>

                <QuestionLine>
                  Que représente chaque colonne ?
                </QuestionLine>

                <QuestionLine>
                  Certaines informations sont-elles manquantes ?
                </QuestionLine>

                <QuestionLine>
                  Qu’est-ce que j’aimerais apprendre grâce à ce fichier ?
                </QuestionLine>

              </div>

            </div>

            {/* ==================================================
                EXAMPLE PROMPT
            ================================================== */}

            <div className="mt-7 rounded-[24px] bg-slate-950 p-6 text-white">

              <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                EXEMPLE DE DEMANDE À L’IA
              </p>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
{`"Explique-moi simplement ce fichier.

Dis-moi :
1. ce que représente chaque ligne ;
2. ce que représente chaque colonne ;
3. les informations qui semblent importantes ;
4. les éventuelles données manquantes ou incohérentes ;
5. cinq questions utiles que je pourrais poser sur ce fichier.

Ne fais encore aucune conclusion complexe."`}
              </p>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-100 p-5">

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}

// ======================================================
// QUESTION
// ======================================================

function QuestionLine({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
        ?
      </div>

      <p className="text-sm font-medium leading-6">
        {children}
      </p>

    </div>
  );
}