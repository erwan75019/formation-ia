"use client";

import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

type Row = Record<string, string>;

type Evaluation = {
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

type Props = {
  lesson: "02" | "03" | "04" | "05" | "06";
};

function parseCsv(content: string) {
  const lines = content
    .replace(/\r/g, "")
    .trim()
    .split("\n")
    .filter(Boolean);

  if (lines.length < 2) {
    return { headers: [] as string[], rows: [] as Row[] };
  }

  const separator =
    lines[0].includes(";") && !lines[0].includes(",")
      ? ";"
      : ",";

  const headers = lines[0]
    .split(separator)
    .map((value) => value.trim());

  const rows = lines.slice(1).map((line) => {
    const values = line.split(separator);
    const row: Row = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });

    return row;
  });

  return { headers, rows };
}

function toNumber(value: string) {
  const normalized = String(value ?? "")
    .replace(/\s/g, "")
    .replace("€", "")
    .replace(",", ".");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function findHeader(headers: string[], words: string[]) {
  return (
    headers.find((header) =>
      words.some((word) =>
        header.toLowerCase().includes(word)
      )
    ) ?? ""
  );
}

export default function Module04PracticeLab({
  lesson,
}: Props) {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  async function loadSample() {
    setError("");

    try {
      const response = await fetch(
        "/exercices/depenses-exemple.csv"
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de charger le fichier d'exercice."
        );
      }

      const parsed = parseCsv(await response.text());

      if (!parsed.headers.length || !parsed.rows.length) {
        throw new Error(
          "Le fichier d'exercice est vide ou illisible."
        );
      }

      setFileName("depenses-exemple.csv");
      setHeaders(parsed.headers);
      setRows(parsed.rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le fichier."
      );
    }
  }

  function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError(
        "Utilisez un fichier CSV pour cet atelier."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const parsed = parseCsv(String(reader.result ?? ""));

      if (!parsed.headers.length || !parsed.rows.length) {
        setError(
          "Impossible de comprendre ce fichier."
        );
        return;
      }

      setFileName(file.name);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
    };

    reader.readAsText(file);
  }

  function clearFile() {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setError("");
  }

  const shared = {
    fileName,
    headers,
    rows,
    error,
    loadSample,
    handleFile,
    clearFile,
  };

  if (lesson === "02") {
    return <QuestionLab {...shared} />;
  }

  if (lesson === "03") {
    return <CleaningLab {...shared} />;
  }

  if (lesson === "04") {
    return <DashboardLab {...shared} />;
  }

  if (lesson === "05") {
    return <DecisionLab {...shared} />;
  }

  return <PersonalProjectLab {...shared} />;
}

type SharedProps = {
  fileName: string;
  headers: string[];
  rows: Row[];
  error: string;
  loadSample: () => Promise<void>;
  handleFile: (event: ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
};

function FileChooser({
  fileName,
  headers,
  rows,
  error,
  loadSample,
  handleFile,
  clearFile,
}: SharedProps) {
  if (rows.length > 0) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
              FICHIER ACTIF
            </p>
            <p className="mt-2 font-bold">{fileName}</p>
            <p className="mt-1 text-sm text-slate-500">
              {rows.length} lignes · {headers.length} colonnes
            </p>
          </div>

          <button
            type="button"
            onClick={clearFile}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
          >
            Changer
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-slate-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={loadSample}
          className="rounded-[22px] border border-slate-200 p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            A
          </span>
          <p className="mt-4 font-bold">Fichier d’exercice</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Utilisez les données préparées pour suivre l’atelier.
          </p>
        </button>

        <label className="cursor-pointer rounded-[22px] border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold">
            B
          </span>
          <p className="mt-4 font-bold">Mon propre fichier</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Importez un CSV et appliquez directement la méthode.
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 text-sm text-slate-600">{error}</p>
      )}
    </div>
  );
}

function LabShell({
  tag,
  title,
  description,
  children,
}: {
  tag: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 p-7 text-white md:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
          {tag}
        </p>
        <h2 className="mt-4 text-3xl font-bold">{title}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          {description}
        </p>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

function Step({
  number,
  title,
  text,
  children,
}: {
  number: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 rounded-[24px] border border-slate-200 p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {number}
        </span>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {text}
          </p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-3 w-full resize-y rounded-2xl border border-slate-200 px-5 py-4 leading-7 outline-none focus:border-slate-950"
      />
    </label>
  );
}

async function askFile(
  question: string,
  fileName: string,
  headers: string[],
  rows: Row[]
) {
  const response = await fetch(
    "/api/training/analyze-file",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        fileName,
        headers,
        rows,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Impossible d'interroger l'IA."
    );
  }

  return String(data.answer ?? "");
}

async function evaluateMission(payload: {
  lessonId: string;
  title: string;
  mission: string;
  context: string;
  answers: Record<string, string>;
  criteria: {
    name: string;
    maxScore: number;
    description: string;
  }[];
}) {
  const response = await fetch(
    "/api/training/evaluate-practical",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Impossible d'évaluer la mission."
    );
  }

  return data as Evaluation;
}

function EvaluationPanel({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  return (
    <div className="mt-7 overflow-hidden rounded-[24px] border border-slate-200">
      <div className="bg-slate-950 p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
          ÉVALUATION
        </p>
        <p className="mt-3 text-5xl font-bold">
          {evaluation.score}
          <span className="text-xl text-slate-500"> /100</span>
        </p>
        <p className="mt-2 font-semibold text-slate-300">
          {evaluation.verdict}
        </p>
        <p className="mt-4 leading-7 text-slate-400">
          {evaluation.summary}
        </p>
      </div>

      <div className="space-y-4 p-6">
        {evaluation.criteria.map((criterion) => (
          <div
            key={criterion.name}
            className="rounded-2xl bg-slate-50 p-5"
          >
            <div className="flex justify-between gap-3">
              <p className="font-bold">{criterion.name}</p>
              <p className="font-bold">
                {criterion.score}/{criterion.maxScore}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {criterion.feedback}
            </p>
          </div>
        ))}

        {!!evaluation.improvements?.length && (
          <div>
            <p className="font-bold">À améliorer</p>
            <div className="mt-3 space-y-2">
              {evaluation.improvements.map((item, index) => (
                <p
                  key={`${item}-${index}`}
                  className="rounded-xl border border-slate-200 p-3 text-sm"
                >
                  → {item}
                </p>
              ))}
            </div>
          </div>
        )}

        {evaluation.advice && (
          <div className="rounded-2xl bg-slate-950 p-5 text-slate-300">
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
              CONSEIL
            </p>
            <p className="mt-3 leading-7">{evaluation.advice}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LEÇON 02
========================================================= */

function QuestionLab(props: SharedProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const [proofRequest, setProofRequest] = useState("");
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [localError, setLocalError] = useState("");

  const ready = props.rows.length > 0;

  async function runQuestion(custom?: string) {
    const finalQuestion = (custom ?? question).trim();

    if (!ready || !finalQuestion || loading) return;

    setLoading(true);
    setLocalError("");

    try {
      setAnswer(
        await askFile(
          finalQuestion,
          props.fileName,
          props.headers,
          props.rows
        )
      );
      setQuestion(finalQuestion);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setLoading(false);
    }
  }

  async function runEvaluation() {
    if (
      !question.trim() ||
      !reflection.trim() ||
      !proofRequest.trim()
    ) {
      setLocalError(
        "Complétez la question, votre analyse et la demande de vérification."
      );
      return;
    }

    setEvaluating(true);
    setLocalError("");

    try {
      const result = await evaluateMission({
        lessonId: "fichiers-02-questions",
        title: "Interroger utilement ses informations",
        mission:
          "Formuler une question utile sur un fichier, comprendre la réponse et prévoir comment la vérifier.",
        context: `Fichier: ${props.fileName}
Colonnes: ${props.headers.join(", ")}
Aperçu: ${JSON.stringify(props.rows.slice(0, 8))}

Réponse obtenue de l'IA:
${answer}`,
        answers: {
          "Question posée": question,
          "Ce que je retiens de la réponse": reflection,
          "Comment je demande la preuve": proofRequest,
        },
        criteria: [
          {
            name: "Question précise",
            maxScore: 30,
            description:
              "La question indique clairement l'information recherchée.",
          },
          {
            name: "Utilité",
            maxScore: 20,
            description:
              "La question répond à un besoin concret.",
          },
          {
            name: "Compréhension de la réponse",
            maxScore: 20,
            description:
              "L'apprenant reformule correctement ce que la réponse permet de conclure.",
          },
          {
            name: "Vérification",
            maxScore: 30,
            description:
              "L'apprenant demande les valeurs, lignes ou calculs permettant de vérifier la conclusion.",
          },
        ],
      });

      setEvaluation(result);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <LabShell
      tag="LEÇON 02 · LAB PRATIQUE"
      title="Interrogez réellement vos informations"
      description="Vous allez apprendre à passer d'une question vague à une question exploitable, puis à demander les preuves derrière la réponse."
    >
      <FileChooser {...props} />

      {ready && (
        <>
          <Step
            number="01"
            title="Une question = un objectif"
            text="Commencez par choisir exactement ce que vous voulez savoir."
          >
            <div className="grid gap-3 md:grid-cols-3">
              {[
                "Quelles sont les 3 catégories les plus importantes ? Donne les montants.",
                "Quelles sont les 5 opérations les plus élevées ?",
                "Quelles informations semblent manquer dans ce fichier ?",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuestion(item)}
                  className="rounded-2xl border border-slate-200 p-4 text-left text-sm leading-6 hover:border-slate-950"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <TextField
                label="Votre question"
                value={question}
                onChange={setQuestion}
                placeholder="Ex. Quelles sont les trois catégories..."
              />
            </div>

            <button
              type="button"
              disabled={!question.trim() || loading}
              onClick={() => runQuestion()}
              className="mt-4 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? "Analyse en cours..." : "Poser la question à Ollama →"}
            </button>
          </Step>

          {answer && (
            <Step
              number="02"
              title="Comprendre la réponse"
              text="Une réponse utile doit pouvoir être reformulée simplement."
            >
              <div className="rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-300">
                <p className="whitespace-pre-line">{answer}</p>
              </div>

              <div className="mt-5">
                <TextField
                  label="En une ou deux phrases, qu'avez-vous appris ?"
                  value={reflection}
                  onChange={setReflection}
                  placeholder="Je retiens que..."
                />
              </div>
            </Step>
          )}

          {answer && (
            <Step
              number="03"
              title="Demander la preuve"
              text="Ne vous contentez pas de la conclusion : demandez comment la retrouver dans les données."
            >
              <TextField
                label="Écrivez une demande de vérification"
                value={proofRequest}
                onChange={setProofRequest}
                placeholder="Montre-moi les lignes et les montants utilisés pour..."
              />

              <button
                type="button"
                onClick={() => runQuestion(proofRequest)}
                disabled={!proofRequest.trim() || loading}
                className="mt-4 rounded-xl border border-slate-950 px-5 py-3 font-semibold disabled:opacity-40"
              >
                Tester cette vérification →
              </button>
            </Step>
          )}

          <Step
            number="04"
            title="Mission"
            text="Votre travail est évalué sur la précision, l'utilité et surtout votre capacité à vérifier."
          >
            <button
              type="button"
              onClick={runEvaluation}
              disabled={
                !answer ||
                !reflection.trim() ||
                !proofRequest.trim() ||
                evaluating
              }
              className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              {evaluating
                ? "Évaluation en cours..."
                : "Évaluer ma méthode /100 →"}
            </button>

            {localError && (
              <p className="mt-4 text-sm text-slate-600">
                {localError}
              </p>
            )}

            {evaluation && (
              <EvaluationPanel evaluation={evaluation} />
            )}
          </Step>
        </>
      )}
    </LabShell>
  );
}

/* =========================================================
   LEÇON 03
========================================================= */

function CleaningLab(props: SharedProps) {
  const dirtyRows = imperfectDataset;
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [corrections, setCorrections] = useState<
    Record<string, boolean>
  >({});
  const [explanation, setExplanation] = useState("");
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [localError, setLocalError] = useState("");

  const issues = [
    "Date manquante",
    "Formats de date différents",
    "Catégories incohérentes",
    "Nom écrit différemment",
    "Doublon possible",
  ];

  const correctionChoices = [
    {
      id: "dates",
      text: "Uniformiser les dates au même format",
      safe: true,
    },
    {
      id: "categories",
      text: "Uniformiser Courses / alimentation après validation",
      safe: true,
    },
    {
      id: "missing",
      text: "Inventer la date manquante",
      safe: false,
    },
    {
      id: "duplicate",
      text: "Signaler le doublon possible avant suppression",
      safe: true,
    },
  ];

  async function runEvaluation() {
    setEvaluating(true);
    setLocalError("");

    try {
      const result = await evaluateMission({
        lessonId: "fichiers-03-organiser",
        title: "Nettoyer un fichier sans inventer",
        mission:
          "Identifier les problèmes d'un fichier puis choisir des corrections sûres.",
        context: JSON.stringify(dirtyRows, null, 2),
        answers: {
          "Problèmes identifiés": selected.join(", "),
          "Corrections choisies": correctionChoices
            .filter((item) => corrections[item.id])
            .map((item) => item.text)
            .join(", "),
          "Règle personnelle de nettoyage": explanation,
        },
        criteria: [
          {
            name: "Détection",
            maxScore: 30,
            description:
              "Les principaux problèmes sont correctement identifiés.",
          },
          {
            name: "Corrections sûres",
            maxScore: 30,
            description:
              "Les corrections choisies améliorent le fichier sans inventer de données.",
          },
          {
            name: "Prudence",
            maxScore: 20,
            description:
              "Les doublons et valeurs manquantes sont vérifiés avant modification.",
          },
          {
            name: "Méthode",
            maxScore: 20,
            description:
              "L'apprenant formule une règle claire et réutilisable.",
          },
        ],
      });

      setEvaluation(result);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <LabShell
      tag="LEÇON 03 · LAB PRATIQUE"
      title="Nettoyez sans casser les données"
      description="Le but n'est pas de tout modifier automatiquement. Vous apprenez à repérer, proposer, vérifier puis appliquer."
    >
      <Step
        number="01"
        title="Trouvez les problèmes"
        text="Ce fichier a volontairement été abîmé. Repérez tout ce qui peut fausser une analyse."
      >
        <MiniTable rows={dirtyRows} />

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {issues.map((issue) => {
            const active = selected.includes(issue);

            return (
              <button
                key={issue}
                type="button"
                disabled={checked}
                onClick={() =>
                  setSelected((current) =>
                    active
                      ? current.filter((item) => item !== issue)
                      : [...current, issue]
                  )
                }
                className={`rounded-2xl border p-4 text-left text-sm ${
                  active
                    ? "border-slate-950 bg-slate-50"
                    : "border-slate-200"
                }`}
              >
                {active ? "✓ " : "○ "}
                {issue}
              </button>
            );
          })}
        </div>

        {!checked ? (
          <button
            type="button"
            onClick={() => setChecked(true)}
            disabled={!selected.length}
            className="mt-4 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-200"
          >
            Vérifier →
          </button>
        ) : (
          <p className="mt-4 rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700">
            Les 5 problèmes sont présents. Attention : « doublon
            possible » ne veut pas dire « doublon certain ».
          </p>
        )}
      </Step>

      {checked && (
        <Step
          number="02"
          title="Décidez avant de corriger"
          text="Certaines corrections sont sûres. D'autres inventent une information que le fichier ne contient pas."
        >
          <div className="space-y-3">
            {correctionChoices.map((choice) => (
              <label
                key={choice.id}
                className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 p-4"
              >
                <input
                  type="checkbox"
                  checked={!!corrections[choice.id]}
                  onChange={(event) =>
                    setCorrections((current) => ({
                      ...current,
                      [choice.id]: event.target.checked,
                    }))
                  }
                />
                <span className="text-sm leading-6">
                  {choice.text}
                </span>
              </label>
            ))}
          </div>

          {corrections.missing && (
            <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm leading-6">
              Attention : une date absente ne peut pas être devinée.
              On peut la signaler, demander la vraie valeur ou la
              laisser vide.
            </p>
          )}
        </Step>
      )}

      {checked && (
        <Step
          number="03"
          title="Construisez votre règle de nettoyage"
          text="Une bonne méthode doit rester valable sur un autre fichier."
        >
          <TextField
            label="Quelle règle suivrez-vous avant toute correction ?"
            value={explanation}
            onChange={setExplanation}
            placeholder="Avant de modifier une donnée, je..."
          />

          <button
            type="button"
            onClick={runEvaluation}
            disabled={!explanation.trim() || evaluating}
            className="mt-5 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            {evaluating
              ? "Évaluation..."
              : "Évaluer mon nettoyage /100 →"}
          </button>

          {localError && (
            <p className="mt-4 text-sm">{localError}</p>
          )}

          {evaluation && (
            <EvaluationPanel evaluation={evaluation} />
          )}
        </Step>
      )}

      <div className="mt-8 rounded-[24px] border border-slate-200 p-6">
        <p className="font-bold">Essayez ensuite avec votre fichier</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Cette partie est facultative mais permet de réutiliser la méthode sur vos propres données.
        </p>
        <div className="mt-5">
          <FileChooser {...props} />
        </div>
      </div>
    </LabShell>
  );
}

const imperfectDataset = [
  {
    date: "12/08/2026",
    description: "Carrefour",
    categorie: "Courses",
    montant: "42.50",
  },
  {
    date: "13 août 2026",
    description: "CARREFOUR",
    categorie: "alimentation",
    montant: "36",
  },
  {
    date: "",
    description: "Netflix",
    categorie: "Abonnement",
    montant: "19.99",
  },
  {
    date: "15/08/2026",
    description: "Carrefour",
    categorie: "Courses",
    montant: "42.50",
  },
  {
    date: "15/08/2026",
    description: "Carrefour",
    categorie: "Courses",
    montant: "42.50",
  },
];

/* =========================================================
   LEÇON 04
========================================================= */

function DashboardLab(props: SharedProps) {
  const [selectedKpis, setSelectedKpis] = useState<string[]>([
    "total",
    "count",
  ]);
  const [goal, setGoal] = useState("");
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [localError, setLocalError] = useState("");

  const amountHeader = findHeader(props.headers, [
    "montant",
    "amount",
    "prix",
    "total",
  ]);

  const categoryHeader = findHeader(props.headers, [
    "categorie",
    "catégorie",
    "category",
    "type",
  ]);

  const amounts = props.rows.map((row) =>
    toNumber(row[amountHeader] ?? "0")
  );

  const total = amounts.reduce((sum, value) => sum + value, 0);
  const average =
    amounts.length > 0 ? total / amounts.length : 0;

  const categories = useMemo(() => {
    const map = new Map<string, number>();

    props.rows.forEach((row) => {
      const category =
        row[categoryHeader]?.trim() || "Non classé";
      const amount = toNumber(row[amountHeader] ?? "0");

      map.set(category, (map.get(category) ?? 0) + amount);
    });

    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [props.rows, categoryHeader, amountHeader]);

  const maxCategory = Math.max(
    1,
    ...categories.map((item) => Math.abs(item[1]))
  );

  function toggleKpi(id: string) {
    setSelectedKpis((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function runEvaluation() {
    setEvaluating(true);
    setLocalError("");

    try {
      const result = await evaluateMission({
        lessonId: "fichiers-04-dashboard",
        title: "Construire un tableau de bord utile",
        mission:
          "Choisir les indicateurs et visualisations qui répondent à un besoin réel.",
        context: `Fichier: ${props.fileName}
Colonnes: ${props.headers.join(", ")}
Nombre de lignes: ${props.rows.length}`,
        answers: {
          "Objectif du dashboard": goal,
          "Indicateurs choisis": selectedKpis.join(", "),
          "Visualisation choisie":
            categoryHeader && amountHeader
              ? "Répartition par catégorie"
              : "Vue synthétique",
        },
        criteria: [
          {
            name: "Objectif",
            maxScore: 25,
            description:
              "Le dashboard répond à une question ou un besoin précis.",
          },
          {
            name: "Indicateurs",
            maxScore: 30,
            description:
              "Les indicateurs choisis sont réellement utiles pour l'objectif.",
          },
          {
            name: "Lisibilité",
            maxScore: 25,
            description:
              "La vue reste simple et ne montre pas des informations inutiles.",
          },
          {
            name: "Réutilisation",
            maxScore: 20,
            description:
              "Le tableau de bord pourrait être actualisé avec de nouvelles données.",
          },
        ],
      });

      setEvaluation(result);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <LabShell
      tag="LEÇON 04 · CONSTRUCTION"
      title="Construisez un vrai mini-dashboard"
      description="Vous choisissez d'abord ce qui doit être compris. Le graphique vient ensuite, jamais l'inverse."
    >
      <FileChooser {...props} />

      {!!props.rows.length && (
        <>
          <Step
            number="01"
            title="Définissez le rôle du dashboard"
            text="Un tableau de bord utile répond à une question. Il ne doit pas simplement afficher tout le fichier."
          >
            <TextField
              label="À quoi doit servir votre dashboard ?"
              value={goal}
              onChange={setGoal}
              placeholder="Ex. Je veux voir rapidement où part mon budget..."
            />
          </Step>

          <Step
            number="02"
            title="Choisissez ce qui mérite d'être visible"
            text="Sélectionnez seulement les indicateurs qui vous aideraient à décider ou comprendre."
          >
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["total", "Total"],
                ["count", "Nombre d'opérations"],
                ["average", "Montant moyen"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleKpi(id)}
                  className={`rounded-2xl border p-4 text-left ${
                    selectedKpis.includes(id)
                      ? "border-slate-950 bg-slate-50"
                      : "border-slate-200"
                  }`}
                >
                  {selectedKpis.includes(id) ? "✓ " : ""}
                  {label}
                </button>
              ))}
            </div>
          </Step>

          <Step
            number="03"
            title="Regardez votre dashboard se construire"
            text="La vue ci-dessous est calculée à partir du fichier chargé."
          >
            {!amountHeader ? (
              <p className="rounded-2xl bg-slate-100 p-5 text-sm leading-6">
                Aucune colonne de montant n'a été reconnue. Essayez un
                fichier contenant une colonne « montant », « prix » ou
                « total ».
              </p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {selectedKpis.includes("total") && (
                    <Kpi
                      label="Total"
                      value={total.toLocaleString("fr-FR", {
                        maximumFractionDigits: 2,
                      })}
                    />
                  )}

                  {selectedKpis.includes("count") && (
                    <Kpi
                      label="Opérations"
                      value={String(props.rows.length)}
                    />
                  )}

                  {selectedKpis.includes("average") && (
                    <Kpi
                      label="Moyenne"
                      value={average.toLocaleString("fr-FR", {
                        maximumFractionDigits: 2,
                      })}
                    />
                  )}
                </div>

                {categoryHeader && categories.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                    <p className="font-bold">
                      Répartition par {categoryHeader}
                    </p>

                    <div className="mt-5 space-y-4">
                      {categories.map(([category, value]) => (
                        <div key={category}>
                          <div className="flex justify-between gap-4 text-sm">
                            <span>{category}</span>
                            <span className="font-semibold">
                              {value.toLocaleString("fr-FR", {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-950"
                              style={{
                                width: `${Math.max(
                                  4,
                                  (Math.abs(value) / maxCategory) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Step>

          <Step
            number="04"
            title="Faites évaluer vos choix"
            text="Le score ne récompense pas le nombre de graphiques : il récompense l'utilité."
          >
            <button
              type="button"
              onClick={runEvaluation}
              disabled={
                !goal.trim() ||
                !selectedKpis.length ||
                evaluating
              }
              className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              {evaluating
                ? "Évaluation..."
                : "Évaluer mon dashboard /100 →"}
            </button>

            {localError && (
              <p className="mt-4 text-sm">{localError}</p>
            )}

            {evaluation && (
              <EvaluationPanel evaluation={evaluation} />
            )}
          </Step>
        </>
      )}
    </LabShell>
  );
}

function Kpi({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white">
      <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
        {label.toUpperCase()}
      </p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

/* =========================================================
   LEÇON 05
========================================================= */

function DecisionLab(props: SharedProps) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [chosenInsight, setChosenInsight] = useState("");
  const [verification, setVerification] = useState("");
  const [action, setAction] = useState("");
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [localError, setLocalError] = useState("");

  async function analyze() {
    setLoading(true);
    setLocalError("");

    try {
      const result = await askFile(
        `Analyse ce fichier et propose exactement 3 éléments qui méritent mon attention.

Pour chaque élément :
- indique les données précises qui t'ont conduit à le remarquer ;
- distingue un fait d'une hypothèse ;
- ne donne aucune cause si elle n'est pas dans le fichier ;
- indique ce que je devrais vérifier avant de prendre une décision.`,
        props.fileName,
        props.headers,
        props.rows
      );

      setAnalysis(result);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setLoading(false);
    }
  }

  async function runEvaluation() {
    setEvaluating(true);
    setLocalError("");

    try {
      const result = await evaluateMission({
        lessonId: "fichiers-05-decisions",
        title: "Transformer une analyse en décision prudente",
        mission:
          "Choisir un signal intéressant, le vérifier puis décider d'une action proportionnée.",
        context: `Fichier: ${props.fileName}
Analyse Ollama:
${analysis}`,
        answers: {
          "Signal retenu": chosenInsight,
          "Vérification prévue": verification,
          "Action envisagée": action,
        },
        criteria: [
          {
            name: "Signal pertinent",
            maxScore: 25,
            description:
              "L'élément choisi mérite réellement l'attention.",
          },
          {
            name: "Preuve",
            maxScore: 30,
            description:
              "La vérification revient aux données concrètes.",
          },
          {
            name: "Fait vs hypothèse",
            maxScore: 20,
            description:
              "L'apprenant ne transforme pas une hypothèse en certitude.",
          },
          {
            name: "Décision",
            maxScore: 25,
            description:
              "L'action proposée est raisonnable et cohérente avec les informations disponibles.",
          },
        ],
      });

      setEvaluation(result);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <LabShell
      tag="LEÇON 05 · ANALYSE"
      title="Passez d'un signal à une décision"
      description="L'IA attire votre attention. Vous vérifiez. Ensuite seulement, vous décidez."
    >
      <FileChooser {...props} />

      {!!props.rows.length && (
        <>
          <Step
            number="01"
            title="Demandez à l'IA ce qui mérite votre attention"
            text="L'instruction oblige Ollama à séparer les faits, les hypothèses et les vérifications."
          >
            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Analyse en cours..."
                : "Chercher 3 éléments importants →"}
            </button>

            {analysis && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                <p className="whitespace-pre-line">{analysis}</p>
              </div>
            )}
          </Step>

          {analysis && (
            <Step
              number="02"
              title="Choisissez un seul signal"
              text="Vous devez maintenant prendre position : quel élément mérite réellement d'être approfondi ?"
            >
              <TextField
                label="Signal retenu"
                value={chosenInsight}
                onChange={setChosenInsight}
                placeholder="Je choisis de vérifier..."
              />
            </Step>
          )}

          {analysis && (
            <Step
              number="03"
              title="Revenez aux preuves"
              text="Expliquez précisément ce que vous devez regarder dans le fichier avant d'agir."
            >
              <TextField
                label="Comment allez-vous vérifier ?"
                value={verification}
                onChange={setVerification}
                placeholder="Je vais comparer..., retrouver les lignes..., vérifier..."
              />

              <div className="mt-5">
                <TextField
                  label="Quelle action prendriez-vous après vérification ?"
                  value={action}
                  onChange={setAction}
                  placeholder="Si les données confirment..., alors je..."
                />
              </div>

              <button
                type="button"
                onClick={runEvaluation}
                disabled={
                  !chosenInsight.trim() ||
                  !verification.trim() ||
                  !action.trim() ||
                  evaluating
                }
                className="mt-5 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
              >
                {evaluating
                  ? "Évaluation..."
                  : "Évaluer ma décision /100 →"}
              </button>

              {localError && (
                <p className="mt-4 text-sm">{localError}</p>
              )}

              {evaluation && (
                <EvaluationPanel evaluation={evaluation} />
              )}
            </Step>
          )}
        </>
      )}
    </LabShell>
  );
}

/* =========================================================
   LEÇON 06
========================================================= */

function PersonalProjectLab(props: SharedProps) {
  const [projectName, setProjectName] = useState("");
  const [need, setNeed] = useState("");
  const [questions, setQuestions] = useState("");
  const [rules, setRules] = useState("");
  const [dashboardPlan, setDashboardPlan] = useState("");
  const [routine, setRoutine] = useState("");
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [localError, setLocalError] = useState("");

  const completed = [
    projectName,
    need,
    questions,
    rules,
    dashboardPlan,
    routine,
  ].filter((value) => value.trim()).length;

  const percentage = Math.round((completed / 6) * 100);

  async function runEvaluation() {
    setEvaluating(true);
    setLocalError("");

    try {
      const result = await evaluateMission({
        lessonId: "fichiers-06-projet",
        title: "Projet personnel réutilisable",
        mission:
          "Concevoir un outil personnel fondé sur ses propres informations et une méthode fiable.",
        context: `Fichier: ${props.fileName}
Colonnes: ${props.headers.join(", ")}
Nombre de lignes: ${props.rows.length}`,
        answers: {
          "Nom du projet": projectName,
          "Besoin réel": need,
          "Questions auxquelles l'outil doit répondre": questions,
          "Règles de fiabilité": rules,
          "Plan du tableau de bord": dashboardPlan,
          "Routine de réutilisation": routine,
        },
        criteria: [
          {
            name: "Utilité réelle",
            maxScore: 20,
            description:
              "Le projet répond à un besoin personnel, étudiant ou professionnel concret.",
          },
          {
            name: "Questions utiles",
            maxScore: 20,
            description:
              "L'outil doit répondre à des questions claires et actionnables.",
          },
          {
            name: "Fiabilité",
            maxScore: 20,
            description:
              "Le projet prévoit les données manquantes, incohérences et vérifications.",
          },
          {
            name: "Dashboard",
            maxScore: 20,
            description:
              "La restitution prévue montre l'essentiel sans surcharge.",
          },
          {
            name: "Réutilisation",
            maxScore: 20,
            description:
              "L'apprenant sait comment mettre à jour et réutiliser son outil après la formation.",
          },
        ],
      });

      setEvaluation(result);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erreur."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <LabShell
      tag="LEÇON 06 · PROJET FINAL"
      title="Construisez un outil que vous garderez"
      description="Budget, notes, commandes, activité, tâches ou suivi personnel : cette fois, le projet part de votre besoin."
    >
      <FileChooser {...props} />

      {!!props.rows.length && (
        <>
          <div className="mt-7 flex items-center justify-between gap-4">
            <p className="font-bold">Construction du projet</p>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">
              {percentage}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-950 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <Step
            number="01"
            title="Donnez une raison d'exister à votre outil"
            text="Le meilleur projet n'est pas le plus compliqué : c'est celui que vous utiliserez."
          >
            <TextField
              label="Nom du projet"
              value={projectName}
              onChange={setProjectName}
              placeholder="Ex. Mon suivi budget mensuel"
            />

            <div className="mt-5">
              <TextField
                label="Quel problème réel doit-il résoudre ?"
                value={need}
                onChange={setNeed}
                placeholder="Aujourd'hui, j'ai du mal à..."
              />
            </div>
          </Step>

          <Step
            number="02"
            title="Définissez les questions essentielles"
            text="Votre outil doit produire des réponses, pas seulement afficher des données."
          >
            <TextField
              label="Quelles questions devra-t-il résoudre ?"
              value={questions}
              onChange={setQuestions}
              placeholder={`Ex.
- Où est-ce que je dépense le plus ?
- Qu'est-ce qui a changé ?
- Que dois-je vérifier ?`}
              rows={6}
            />
          </Step>

          <Step
            number="03"
            title="Ajoutez vos règles de fiabilité"
            text="Définissez ce que l'IA doit faire lorsqu'une information manque ou semble incohérente."
          >
            <TextField
              label="Mes règles"
              value={rules}
              onChange={setRules}
              placeholder="Ne jamais inventer une valeur manquante. Signaler..."
              rows={6}
            />
          </Step>

          <Step
            number="04"
            title="Dessinez la vue finale"
            text="Expliquez ce que vous voulez voir immédiatement en ouvrant votre outil."
          >
            <TextField
              label="Mon dashboard contiendra..."
              value={dashboardPlan}
              onChange={setDashboardPlan}
              placeholder="3 indicateurs principaux, une répartition par..., une alerte si..."
              rows={6}
            />
          </Step>

          <Step
            number="05"
            title="Prévoyez la vie après la formation"
            text="Un outil personnel devient utile quand il peut être mis à jour régulièrement."
          >
            <TextField
              label="Comment allez-vous le réutiliser ?"
              value={routine}
              onChange={setRoutine}
              placeholder="Chaque semaine/mois, j'ajouterai..., puis je vérifierai..."
              rows={5}
            />

            <button
              type="button"
              onClick={runEvaluation}
              disabled={percentage < 100 || evaluating}
              className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              {evaluating
                ? "Évaluation du projet..."
                : "Évaluer mon projet final /100 →"}
            </button>

            {localError && (
              <p className="mt-4 text-sm">{localError}</p>
            )}

            {evaluation && (
              <EvaluationPanel evaluation={evaluation} />
            )}
          </Step>
        </>
      )}
    </LabShell>
  );
}

function MiniTable({
  rows,
}: {
  rows: Row[];
}) {
  const headers = Object.keys(rows[0] ?? {});

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-slate-100"
            >
              {headers.map((header) => (
                <td
                  key={`${rowIndex}-${header}`}
                  className="whitespace-nowrap px-4 py-3 text-slate-600"
                >
                  {row[header] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
