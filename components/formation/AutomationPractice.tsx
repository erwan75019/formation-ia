"use client";

import { useState } from "react";

import AutomationInbox, {
  type EmailClassification,
  type TrainingEmail,
} from "@/components/formation/AutomationInbox";

import AutomationWorkflowPractice from "@/components/formation/AutomationWorkflowPractice";
import AutomationProjectPractice from "@/components/formation/AutomationProjectPractice";

// ======================================================
// TYPES
// ======================================================

type Lesson =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07";

type Props = {
  lesson: Lesson;
  lessonId: string;
  nextHref: string;
  alreadyCompleted: boolean;
  previousScore: number | null;
};

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

type Shared = {
  evaluate: (
    title: string,
    mission: string,
    answers: Record<string, string>,
    criteria: {
      name: string;
      maxScore: number;
      description: string;
    }[],
    context?: string
  ) => Promise<void>;

  evaluating: boolean;
  error: string;
};

type ExtractedEmail = {
  senderName: string | null;
  email: string | null;
  category: string | null;
  request: string | null;
  amount: string | null;
  reference: string | null;
  date: string | null;
  deadline: string | null;
  people: string | null;
  missingInformation: string[];
  confidence: number;
};

type GeneratedEmail = {
  summary: string;
  draft: string;
  checks: string[];

  riskLevel:
    | "Faible"
    | "Moyen"
    | "Élevé";

  requiresHumanValidation: boolean;
  confidence: number;
};

type Permission =
  | "AUTO"
  | "VALIDATION"
  | "BLOQUÉ";

type ActionPermission = {
  permission: Permission | "";
  maxAmount: string;
};

type SecurityScenario = {
  id: string;
  title: string;
  description: string;
  action: string;
  amount?: number;
  confidence?: number;
};

// ======================================================
// EMAILS SIMPLES
// ======================================================

const sampleEmails = [
  {
    id: "A",
    from: "marie@client.fr",
    subject: "Facture de juillet",
    body:
      "Bonjour, je n'ai toujours pas reçu la facture de juillet pour notre abonnement. Pouvez-vous me la transmettre avant vendredi ? Merci.",
  },

  {
    id: "B",
    from: "lucas@prospect.fr",
    subject: "Demande de tarif",
    body:
      "Bonjour, nous sommes une équipe de 12 personnes et nous aimerions connaître vos tarifs ainsi que les délais de mise en place.",
  },

  {
    id: "C",
    from: "client@example.fr",
    subject: "Problème de paiement",
    body:
      "Bonjour, j'ai été débité deux fois de 89 € aujourd'hui. Pouvez-vous vérifier rapidement ? Numéro de commande CMD-4821.",
  },

  {
    id: "D",
    from: "newsletter@example.fr",
    subject: "Découvrez nos nouveautés",
    body:
      "Profitez de notre sélection de nouveautés et découvrez nos dernières actualités.",
  },
];

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

export default function AutomationPractice({
  lesson,
  lessonId,
}: Props) {
  const [
    evaluation,
    setEvaluation,
  ] = useState<Evaluation | null>(null);

  const [
    evaluating,
    setEvaluating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function evaluate(
    title: string,
    mission: string,
    answers: Record<string, string>,
    criteria: {
      name: string;
      maxScore: number;
      description: string;
    }[],
    context = ""
  ) {
    setEvaluating(true);
    setError("");
    setEvaluation(null);

    try {
      const response =
        await fetch(
          "/api/training/evaluate-practical",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              lessonId,
              title,
              mission,
              context,
              answers,
              criteria,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Impossible d'évaluer la mission."
        );
      }

      setEvaluation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur."
      );
    } finally {
      setEvaluating(false);
    }
  }

  const shared = {
    evaluate,
    evaluating,
    error,
  };

  return (
    <section>
      {lesson === "01" && (
        <LogicPractice
          {...shared}
        />
      )}

      {lesson === "02" && (
        <SortingPractice
          {...shared}
        />
      )}

      {lesson === "03" && (
        <ExtractionPractice
          {...shared}
        />
      )}

      {lesson === "04" && (
        <EmailPractice
          {...shared}
        />
      )}

      {lesson === "05" && (
        <ControlPractice
          {...shared}
        />
      )}

      {lesson === "06" && (
        <AutomationWorkflowPractice
          evaluate={evaluate}
          evaluating={evaluating}
        />
      )}

      {lesson === "07" && (
        <AutomationProjectPractice
          evaluate={evaluate}
          evaluating={evaluating}
        />
      )}

      {evaluation && (
        <EvaluationPanel
          evaluation={evaluation}
        />
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          {error}
        </div>
      )}

      {evaluation && (
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-6">
          <p className="font-bold">
            Pratique évaluée :{" "}
            {evaluation.score}/100
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Cette note concerne
            uniquement votre pratique.
            Le QCM reste obligatoire
            pour valider la leçon.
          </p>
        </div>
      )}
    </section>
  );
}

// ======================================================
// COMPOSANTS COMMUNS
// ======================================================

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 p-7 text-white">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
          ATELIER PRATIQUE
        </p>

        <h2 className="mt-4 text-3xl font-bold">
          {title}
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="p-6 md:p-8">
        {children}
      </div>
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
    <div className="mt-7 rounded-[24px] border border-slate-200 p-6">
      <div className="flex gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {number}
        </span>

        <div>
          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {text}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-bold">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        rows={rows}
        className="mt-3 w-full resize-y rounded-2xl border border-slate-200 px-5 py-4 leading-7 outline-none transition focus:border-slate-950"
      />
    </label>
  );
}

function MissionStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <p className="text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

// ======================================================
// LEÇON 01
// ======================================================

function LogicPractice({
  evaluate,
  evaluating,
}: Shared) {
  const [
    trigger,
    setTrigger,
  ] = useState("");

  const [
    decision,
    setDecision,
  ] = useState("");

  const [
    action,
    setAction,
  ] = useState("");

  const [
    fallback,
    setFallback,
  ] = useState("");

  const complete = [
    trigger,
    decision,
    action,
    fallback,
  ].every(
    (value) =>
      value.trim()
  );

  return (
    <Shell
      title="Dessinez votre première automatisation"
      subtitle="Transformez une tâche répétitive en workflow simple."
    >
      <Step
        number="01"
        title="Choisissez le déclencheur"
        text="Quel événement doit démarrer le processus ?"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Nouvel email reçu",
            "Nouveau formulaire reçu",
            "Nouvelle facture reçue",
          ].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setTrigger(item)
                }
                className={`rounded-2xl border p-4 text-left text-sm ${
                  trigger === item
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </Step>

      <Step
        number="02"
        title="Construisez la logique"
        text="Décrivez la décision, l'action et le comportement du système lorsqu'il hésite."
      >
        <Field
          label="Quelle décision doit être prise ?"
          value={decision}
          onChange={setDecision}
          placeholder="Ex. déterminer le type de demande..."
        />

        <div className="mt-5">
          <Field
            label="Quelle action doit suivre ?"
            value={action}
            onChange={setAction}
            placeholder="Ex. préparer un brouillon..."
          />
        </div>

        <div className="mt-5">
          <Field
            label="Que faire si le système hésite ?"
            value={fallback}
            onChange={setFallback}
            placeholder="Ex. demander une validation humaine..."
          />
        </div>
      </Step>

      <button
        type="button"
        disabled={
          !complete ||
          evaluating
        }
        onClick={() =>
          evaluate(
            "Concevoir une automatisation",
            "Construire un workflow simple avec déclencheur, décision, action et contrôle.",
            {
              Déclencheur:
                trigger,
              Décision:
                decision,
              Action:
                action,
              "Cas incertain":
                fallback,
            },
            [
              {
                name:
                  "Déclencheur",
                maxScore: 20,
                description:
                  "Le point de départ est clair.",
              },
              {
                name:
                  "Décision",
                maxScore: 25,
                description:
                  "La règle est compréhensible.",
              },
              {
                name:
                  "Action",
                maxScore: 25,
                description:
                  "L'action est cohérente.",
              },
              {
                name:
                  "Contrôle",
                maxScore: 30,
                description:
                  "L'incertitude est prévue.",
              },
            ]
          )
        }
        className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
      >
        {evaluating
          ? "Évaluation..."
          : "Évaluer mon workflow /100 →"}
      </button>
    </Shell>
  );
}

// ======================================================
// LEÇON 02
// ======================================================

function SortingPractice({
  evaluate,
  evaluating,
}: Shared) {
  const [
    classifications,
    setClassifications,
  ] =
    useState<
      Record<
        string,
        EmailClassification
      >
    >({});

  const [
    rules,
    setRules,
  ] = useState("");

  const [
    ambiguousCase,
    setAmbiguousCase,
  ] = useState("");

  const expectedGuide: Record<
    string,
    EmailClassification
  > = {
    "mail-001": {
      category:
        "Facturation",
      priority:
        "Normale",
      action:
        "Préparer une réponse",
    },

    "mail-002": {
      category:
        "Commercial",
      priority:
        "Normale",
      action:
        "Préparer une réponse",
    },

    "mail-003": {
      category:
        "Facturation",
      priority:
        "Haute",
      action:
        "Vérifier manuellement",
    },

    "mail-004": {
      category:
        "Rendez-vous",
      priority:
        "Normale",
      action:
        "Préparer une réponse",
    },

    "mail-005": {
      category:
        "Information",
      priority:
        "Faible",
      action:
        "Classer uniquement",
    },
  };

  const treatedCount =
    Object.values(
      classifications
    ).filter(
      (item) =>
        item.category &&
        item.priority &&
        item.action
    ).length;

  const exactMatches =
    Object.entries(
      expectedGuide
    ).filter(
      ([
        emailId,
        expected,
      ]) => {
        const answer =
          classifications[
            emailId
          ];

        if (!answer) {
          return false;
        }

        return (
          answer.category ===
            expected.category &&
          answer.priority ===
            expected.priority &&
          answer.action ===
            expected.action
        );
      }
    ).length;

  const complete =
    treatedCount === 5 &&
    rules.trim().length >
      0 &&
    ambiguousCase
      .trim()
      .length > 0;

  function updateClassification(
    emailId: string,
    value: EmailClassification
  ) {
    setClassifications(
      (current) => ({
        ...current,
        [emailId]:
          value,
      })
    );
  }

  return (
    <Shell
      title="Transformez une boîte mail en file de travail"
      subtitle="Classez, priorisez et choisissez l'action suivante."
    >
      <div className="rounded-[24px] bg-slate-950 p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
          VOTRE MISSION
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MissionStat
            value={`${treatedCount}/5`}
            label="Emails traités"
          />

          <MissionStat
            value={`${exactMatches}/5`}
            label="Référence"
          />

          <MissionStat
            value={
              complete
                ? "Prêt"
                : "En cours"
            }
            label="Évaluation"
          />
        </div>
      </div>

      <Step
        number="01"
        title="Traitez votre Inbox"
        text="Pour chaque email, choisissez catégorie, priorité et action."
      >
        <AutomationInbox
          trainingMode
          classifications={
            classifications
          }
          onClassificationChange={
            updateClassification
          }
        />
      </Step>

      <Step
        number="02"
        title="Écrivez vos règles"
        text="Vos décisions doivent être réutilisables sur de nouveaux emails."
      >
        <Field
          label="Mes règles"
          value={rules}
          onChange={setRules}
          placeholder="Si le message concerne..."
          rows={8}
        />
      </Step>

      <Step
        number="03"
        title="Gérez l'incertitude"
        text="Que doit faire le système s'il ne sait pas classer correctement ?"
      >
        <Field
          label="Cas ambigu"
          value={
            ambiguousCase
          }
          onChange={
            setAmbiguousCase
          }
          placeholder="Placer dans À vérifier..."
        />
      </Step>

      <button
        type="button"
        disabled={
          !complete ||
          evaluating
        }
        onClick={() =>
          evaluate(
            "Trier automatiquement des demandes",
            "Construire un système de tri réutilisable.",
            {
              Décisions:
                JSON.stringify(
                  classifications
                ),
              Règles: rules,
              "Cas ambigu":
                ambiguousCase,
              Référence:
                `${exactMatches}/5`,
            },
            [
              {
                name:
                  "Catégorisation",
                maxScore: 25,
                description:
                  "Les catégories sont cohérentes.",
              },
              {
                name:
                  "Priorisation",
                maxScore: 20,
                description:
                  "Les priorités correspondent aux enjeux.",
              },
              {
                name:
                  "Action",
                maxScore: 20,
                description:
                  "Les actions sont adaptées.",
              },
              {
                name:
                  "Règles",
                maxScore: 20,
                description:
                  "Les règles sont réutilisables.",
              },
              {
                name:
                  "Incertitude",
                maxScore: 15,
                description:
                  "Une sortie sûre est prévue.",
              },
            ]
          )
        }
        className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
      >
        {evaluating
          ? "Évaluation..."
          : "Évaluer mon système de tri /100 →"}
      </button>
    </Shell>
  );
}

// ======================================================
// LEÇON 03
// ======================================================

function ExtractionPractice({
  evaluate,
  evaluating,
}: Shared) {
  const [
    selectedEmail,
    setSelectedEmail,
  ] =
    useState<TrainingEmail | null>(
      null
    );

  const [
    requestValue,
    setRequestValue,
  ] = useState("");

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    reference,
    setReference,
  ] = useState("");

  const [
    deadline,
    setDeadline,
  ] = useState("");

  const [
    people,
    setPeople,
  ] = useState("");

  const [
    missing,
    setMissing,
  ] = useState("");

  const [
    aiExtraction,
    setAiExtraction,
  ] =
    useState<ExtractedEmail | null>(
      null
    );

  const [
    analysing,
    setAnalysing,
  ] = useState(false);

  const [
    analysisError,
    setAnalysisError,
  ] = useState("");

  function selectEmail(
    email: TrainingEmail
  ) {
    setSelectedEmail(
      email
    );

    setRequestValue("");
    setAmount("");
    setReference("");
    setDeadline("");
    setPeople("");
    setMissing("");

    setAiExtraction(null);
    setAnalysisError("");
  }

  const manualComplete =
    Boolean(
      selectedEmail &&
      requestValue.trim() &&
      missing.trim()
    );

  async function analyseWithAI() {
    if (
      !selectedEmail ||
      !manualComplete
    ) {
      return;
    }

    setAnalysing(true);
    setAnalysisError("");
    setAiExtraction(null);

    try {
      const response =
        await fetch(
          "/api/training/extract-email",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              senderName:
                selectedEmail.senderName,

              from:
                selectedEmail.from,

              subject:
                selectedEmail.subject,

              body:
                selectedEmail.body,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Impossible d'analyser l'email."
        );
      }

      setAiExtraction(
        data.extraction
      );
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Erreur pendant l'analyse."
      );
    } finally {
      setAnalysing(false);
    }
  }

  function displayValue(
    value:
      | string
      | null
      | undefined
  ) {
    return value ||
      "Non trouvé";
  }

  return (
    <Shell
      title="Passez du texte aux données"
      subtitle="Faites d'abord votre extraction puis comparez-la avec Ollama."
    >
      <Step
        number="01"
        title="Choisissez un email"
        text="Sélectionnez une demande dans votre Inbox."
      >
        <AutomationInbox
          onSelectEmail={
            selectEmail
          }
        />
      </Step>

      {selectedEmail && (
        <Step
          number="02"
          title="Faites votre extraction"
          text="N'inventez aucune information."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Demande principale"
              value={
                requestValue
              }
              onChange={
                setRequestValue
              }
              placeholder="..."
            />

            <Field
              label="Montant"
              value={amount}
              onChange={setAmount}
              placeholder="..."
            />

            <Field
              label="Référence"
              value={reference}
              onChange={setReference}
              placeholder="..."
            />

            <Field
              label="Échéance"
              value={deadline}
              onChange={setDeadline}
              placeholder="..."
            />

            <Field
              label="Nombre de personnes"
              value={people}
              onChange={setPeople}
              placeholder="..."
            />

            <Field
              label="Informations manquantes"
              value={missing}
              onChange={setMissing}
              placeholder="..."
            />
          </div>
        </Step>
      )}

      {selectedEmail && (
        <Step
          number="03"
          title="Comparez avec l'IA"
          text="Ollama analyse le même email après votre propre travail."
        >
          {!aiExtraction && (
            <button
              type="button"
              disabled={
                !manualComplete ||
                analysing
              }
              onClick={
                analyseWithAI
              }
              className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              {analysing
                ? "Analyse Ollama..."
                : "Analyser avec l'IA →"}
            </button>
          )}

          {analysisError && (
            <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm">
              {analysisError}
            </div>
          )}

          {aiExtraction && (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 p-6">
                <p className="font-bold">
                  Votre extraction
                </p>

                <div className="mt-5 space-y-3">
                  <LightLine
                    label="Demande"
                    value={requestValue}
                  />

                  <LightLine
                    label="Montant"
                    value={
                      amount ||
                      "Non fourni"
                    }
                  />

                  <LightLine
                    label="Référence"
                    value={
                      reference ||
                      "Non fourni"
                    }
                  />
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-950 p-6 text-white">
                <div className="flex justify-between">
                  <p className="font-bold">
                    Ollama
                  </p>

                  <span className="text-sm text-slate-400">
                    {
                      aiExtraction.confidence
                    }
                    %
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <DarkLine
                    label="Demande"
                    value={displayValue(
                      aiExtraction.request
                    )}
                  />

                  <DarkLine
                    label="Montant"
                    value={displayValue(
                      aiExtraction.amount
                    )}
                  />

                  <DarkLine
                    label="Référence"
                    value={displayValue(
                      aiExtraction.reference
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </Step>
      )}

      {selectedEmail &&
        aiExtraction && (
        <button
          type="button"
          disabled={evaluating}
          onClick={() =>
            evaluate(
              "Extraire des informations",
              "Transformer un email en données fiables.",
              {
                Email:
                  selectedEmail.subject,
                Demande:
                  requestValue,
                Montant:
                  amount ||
                  "non fourni",
                Référence:
                  reference ||
                  "non fourni",
                Échéance:
                  deadline ||
                  "non fourni",
                Personnes:
                  people ||
                  "non fourni",
                Manquant:
                  missing,
              },
              [
                {
                  name:
                    "Exactitude",
                  maxScore: 30,
                  description:
                    "Les données correspondent au message.",
                },
                {
                  name:
                    "Absence d'invention",
                  maxScore: 25,
                  description:
                    "Aucune donnée n'est inventée.",
                },
                {
                  name:
                    "Structure",
                  maxScore: 15,
                  description:
                    "Les champs sont correctement séparés.",
                },
                {
                  name:
                    "Données manquantes",
                  maxScore: 20,
                  description:
                    "Les absences sont identifiées.",
                },
                {
                  name:
                    "Esprit critique",
                  maxScore: 10,
                  description:
                    "L'IA reste un outil de comparaison.",
                },
              ],
              JSON.stringify({
                email:
                  selectedEmail,
                extractionIA:
                  aiExtraction,
              })
            )
          }
          className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
        >
          {evaluating
            ? "Évaluation..."
            : "Évaluer mon extraction /100 →"}
        </button>
      )}
    </Shell>
  );
}

// ======================================================
// LEÇON 04
// ======================================================

function EmailPractice({
  evaluate,
  evaluating,
}: Shared) {
  const [
    selectedEmail,
    setSelectedEmail,
  ] =
    useState<TrainingEmail | null>(
      null
    );

  const [
    facts,
    setFacts,
  ] = useState("");

  const [
    generated,
    setGenerated,
  ] =
    useState<GeneratedEmail | null>(
      null
    );

  const [
    draft,
    setDraft,
  ] = useState("");

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    generationError,
    setGenerationError,
  ] = useState("");

  const [
    decision,
    setDecision,
  ] =
    useState<
      "" |
      "approved" |
      "rejected"
    >("");

  const [
    verification,
    setVerification,
  ] = useState("");

  function selectEmail(
    email: TrainingEmail
  ) {
    setSelectedEmail(
      email
    );

    setFacts("");
    setGenerated(null);
    setDraft("");
    setDecision("");
    setVerification("");
    setGenerationError("");
  }

  async function generateDraft() {
    if (
      !selectedEmail ||
      !facts.trim()
    ) {
      return;
    }

    setGenerating(true);
    setGenerationError("");
    setGenerated(null);
    setDraft("");
    setDecision("");

    try {
      const response =
        await fetch(
          "/api/training/generate-email",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              senderName:
                selectedEmail.senderName,

              from:
                selectedEmail.from,

              subject:
                selectedEmail.subject,

              body:
                selectedEmail.body,

              facts,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Impossible de générer le brouillon."
        );
      }

      const result =
        data.result as GeneratedEmail;

      setGenerated(result);
      setDraft(result.draft);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Erreur pendant la génération."
      );
    } finally {
      setGenerating(false);
    }
  }

  const readyForEvaluation =
    Boolean(
      selectedEmail &&
      generated &&
      draft.trim() &&
      verification.trim() &&
      decision
    );

  return (
    <Shell
      title="Construisez votre assistant de réponse email"
      subtitle="Donnez les faits fiables à l'IA puis conservez la décision finale."
    >
      <div className="rounded-[24px] bg-slate-950 p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
          VOTRE MISSION
        </p>

        <h3 className="mt-3 text-xl font-bold">
          Passer d&apos;un email reçu
          à un brouillon contrôlé
        </h3>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          L&apos;IA écrit, mais elle
          ne prend pas la décision
          finale.
        </p>
      </div>

      <Step
        number="01"
        title="Choisissez la demande"
        text="Sélectionnez l'email auquel votre assistant va répondre."
      >
        <AutomationInbox
          onSelectEmail={
            selectEmail
          }
        />
      </Step>

      {selectedEmail && (
        <Step
          number="02"
          title="Donnez les faits autorisés"
          text="N'écrivez que ce que l'IA a réellement le droit d'utiliser."
        >
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
              EMAIL CHOISI
            </p>

            <p className="mt-2 font-bold">
              {
                selectedEmail.subject
              }
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {
                selectedEmail.body
              }
            </p>
          </div>

          <div className="mt-6">
            <Field
              label="Faits validés"
              value={facts}
              onChange={setFacts}
              placeholder="Ex. Le client demande une facture..."
              rows={7}
            />
          </div>

          <button
            type="button"
            disabled={
              !facts.trim() ||
              generating
            }
            onClick={
              generateDraft
            }
            className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            {generating
              ? "Ollama prépare le brouillon..."
              : "Générer un brouillon avec l'IA →"}
          </button>

          {generationError && (
            <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm text-slate-600">
              {generationError}
            </div>
          )}
        </Step>
      )}

      {selectedEmail &&
        generated && (
        <Step
          number="03"
          title="Analysez le brouillon"
          text="Lisez la proposition, les contrôles et le niveau de risque."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs text-slate-500">
                RISQUE
              </p>

              <p className="mt-2 text-xl font-bold">
                {
                  generated.riskLevel
                }
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs text-slate-500">
                CONFIANCE IA
              </p>

              <p className="mt-2 text-xl font-bold">
                {
                  generated.confidence
                }
                %
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs text-slate-500">
                VALIDATION
              </p>

              <p className="mt-2 text-xl font-bold">
                {generated.requiresHumanValidation
                  ? "Requise"
                  : "Conseillée"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
              COMPRÉHENSION IA
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-700">
              {
                generated.summary
              }
            </p>
          </div>

          <div className="mt-6">
            <Field
              label="Brouillon proposé — vous pouvez le modifier"
              value={draft}
              onChange={setDraft}
              placeholder="..."
              rows={10}
            />
          </div>
        </Step>
      )}

      {generated && (
        <Step
          number="04"
          title="Prenez la décision finale"
          text="Approuvez ou refusez le brouillon."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setDecision(
                  "approved"
                )
              }
              className={`rounded-2xl border p-5 text-left ${
                decision ===
                "approved"
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200"
              }`}
            >
              <p className="font-bold">
                ✓ Approuver
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setDecision(
                  "rejected"
                )
              }
              className={`rounded-2xl border p-5 text-left ${
                decision ===
                "rejected"
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200"
              }`}
            >
              <p className="font-bold">
                ✕ Refuser
              </p>
            </button>
          </div>

          <div className="mt-6">
            <Field
              label="Contrôle avant un éventuel envoi"
              value={
                verification
              }
              onChange={
                setVerification
              }
              placeholder="Ex. vérifier la facture dans le logiciel..."
              rows={5}
            />
          </div>
        </Step>
      )}

      {readyForEvaluation && (
        <button
          type="button"
          disabled={evaluating}
          onClick={() =>
            evaluate(
              "Assistant de réponse email",
              "Utiliser une IA pour préparer un brouillon sans lui abandonner la décision finale.",
              {
                Email:
                  selectedEmail?.subject ??
                  "",
                "Faits autorisés":
                  facts,
                "Brouillon final":
                  draft,
                Décision:
                  decision ===
                  "approved"
                    ? "Approuvé"
                    : "Refusé",
                "Contrôle":
                  verification,
              },
              [
                {
                  name:
                    "Faits fiables",
                  maxScore: 20,
                  description:
                    "Les faits sont fiables.",
                },
                {
                  name:
                    "Qualité du brouillon",
                  maxScore: 25,
                  description:
                    "Le brouillon est clair.",
                },
                {
                  name:
                    "Absence de promesse",
                  maxScore: 20,
                  description:
                    "Aucune promesse n'est inventée.",
                },
                {
                  name:
                    "Contrôle humain",
                  maxScore: 20,
                  description:
                    "La décision reste humaine.",
                },
                {
                  name:
                    "Vérification",
                  maxScore: 15,
                  description:
                    "Une vérification concrète est prévue.",
                },
              ],
              JSON.stringify({
                email:
                  selectedEmail,
                propositionIA:
                  generated,
              })
            )
          }
          className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
        >
          {evaluating
            ? "Évaluation..."
            : "Évaluer mon assistant email /100 →"}
        </button>
      )}
    </Shell>
  );
}

// ======================================================
// LEÇON 05 — MOTEUR DE PERMISSIONS
// ======================================================

function ControlPractice({
  evaluate,
  evaluating,
}: Shared) {
  const actions = [
    {
      id: "classify",
      name:
        "Classer un email",
      description:
        "Déplacer automatiquement un message dans une catégorie interne.",
      risk:
        "Faible",
      financial:
        false,
    },

    {
      id: "draft",
      name:
        "Préparer un brouillon",
      description:
        "Créer une proposition de réponse sans l'envoyer.",
      risk:
        "Faible",
      financial:
        false,
    },

    {
      id: "send",
      name:
        "Envoyer un email",
      description:
        "Envoyer réellement un message à un client.",
      risk:
        "Moyen",
      financial:
        false,
    },

    {
      id: "refund",
      name:
        "Effectuer un remboursement",
      description:
        "Déclencher une action financière réelle.",
      risk:
        "Élevé",
      financial:
        true,
    },

    {
      id: "delete",
      name:
        "Supprimer des données client",
      description:
        "Supprimer définitivement des informations.",
      risk:
        "Élevé",
      financial:
        false,
    },

    {
      id: "task",
      name:
        "Créer une tâche interne",
      description:
        "Ajouter une tâche de suivi dans le système.",
      risk:
        "Faible",
      financial:
        false,
    },
  ];

  const scenarios:
    SecurityScenario[] = [
      {
        id: "scenario-01",
        title:
          "Newsletter commerciale",
        description:
          "Le système veut classer automatiquement une newsletter dans Informations.",
        action:
          "classify",
        confidence: 99,
      },

      {
        id: "scenario-02",
        title:
          "Brouillon client",
        description:
          "L'IA souhaite préparer une réponse concernant une facture manquante.",
        action:
          "draft",
        confidence: 94,
      },

      {
        id: "scenario-03",
        title:
          "Réponse commerciale",
        description:
          "L'IA propose d'envoyer directement une offre commerciale au prospect.",
        action:
          "send",
        confidence: 88,
      },

      {
        id: "scenario-04",
        title:
          "Double paiement",
        description:
          "Le client a été débité deux fois et l'IA propose de rembourser 89 €.",
        action:
          "refund",
        amount: 89,
        confidence: 93,
      },

      {
        id: "scenario-05",
        title:
          "Gros remboursement",
        description:
          "L'IA propose de rembourser automatiquement 450 € à un client.",
        action:
          "refund",
        amount: 450,
        confidence: 97,
      },

      {
        id: "scenario-06",
        title:
          "Dossier inactif",
        description:
          "L'IA pense qu'un ancien dossier client peut être supprimé définitivement.",
        action:
          "delete",
        confidence: 82,
      },
    ];

  const [
    permissions,
    setPermissions,
  ] =
    useState<
      Record<
        string,
        ActionPermission
      >
    >({});

  const [
    confidenceThreshold,
    setConfidenceThreshold,
  ] = useState("80");

  const [
    uncertaintyRule,
    setUncertaintyRule,
  ] = useState("");

  const [
    selectedScenario,
    setSelectedScenario,
  ] =
    useState<string>(
      scenarios[0].id
    );

  const configuredCount =
    actions.filter(
      (action) =>
        permissions[action.id]
          ?.permission
    ).length;

  const complete =
    configuredCount ===
      actions.length &&
    confidenceThreshold.trim() &&
    uncertaintyRule.trim();

  function updatePermission(
    actionId: string,
    permission: Permission
  ) {
    setPermissions(
      (current) => ({
        ...current,

        [actionId]: {
          permission,
          maxAmount:
            current[actionId]
              ?.maxAmount ??
            "",
        },
      })
    );
  }

  function updateMaxAmount(
    actionId: string,
    maxAmount: string
  ) {
    setPermissions(
      (current) => ({
        ...current,

        [actionId]: {
          permission:
            current[actionId]
              ?.permission ??
            "",

          maxAmount,
        },
      })
    );
  }

  function runScenario(
    scenario: SecurityScenario
  ) {
    const rule =
      permissions[
        scenario.action
      ];

    if (
      !rule ||
      !rule.permission
    ) {
      return {
        status:
          "NON CONFIGURÉ",
        message:
          "Aucune permission n'a encore été définie pour cette action.",
      };
    }

    if (
      scenario.confidence !==
        undefined &&
      scenario.confidence <
        Number(
          confidenceThreshold ||
            0
        )
    ) {
      return {
        status:
          "VALIDATION",
        message:
          `Confiance IA : ${scenario.confidence} %. Votre seuil minimum est ${confidenceThreshold} %. Une validation humaine est donc requise.`,
      };
    }

    if (
      rule.permission ===
      "BLOQUÉ"
    ) {
      return {
        status: "BLOQUÉ",
        message:
          "Cette action est interdite par votre politique de sécurité.",
      };
    }

    if (
      rule.permission ===
      "VALIDATION"
    ) {
      return {
        status:
          "VALIDATION",
        message:
          "Cette action peut être proposée mais une personne doit l'autoriser avant son exécution.",
      };
    }

    if (
      rule.permission ===
        "AUTO" &&
      scenario.amount !==
        undefined
    ) {
      const max =
        Number(
          rule.maxAmount
        );

      if (
        !Number.isFinite(max) ||
        max <= 0
      ) {
        return {
          status:
            "VALIDATION",
          message:
            "Cette action financière est en AUTO mais aucune limite financière valide n'a été configurée.",
        };
      }

      if (
        scenario.amount >
        max
      ) {
        return {
          status:
            "VALIDATION",
          message:
            `Le montant de ${scenario.amount} € dépasse votre limite automatique de ${max} €. Validation humaine obligatoire.`,
        };
      }

      return {
        status:
          "AUTORISÉ",
        message:
          `Le montant de ${scenario.amount} € respecte votre limite automatique de ${max} €.`,
      };
    }

    return {
      status:
        "AUTORISÉ",
      message:
        "Votre politique autorise cette action automatiquement.",
    };
  }

  const currentScenario =
    scenarios.find(
      (scenario) =>
        scenario.id ===
        selectedScenario
    ) ??
    scenarios[0];

  const scenarioResult =
    runScenario(
      currentScenario
    );

  const policySummary =
    actions.map(
      (action) => ({
        action:
          action.name,
        risk:
          action.risk,
        permission:
          permissions[
            action.id
          ]?.permission ||
          "Non configuré",
        maxAmount:
          permissions[
            action.id
          ]?.maxAmount ||
          null,
      })
    );

  return (
    <Shell
      title="Construisez le moteur de sécurité de votre assistant"
      subtitle="Décidez précisément ce que l'IA peut faire seule, ce qui nécessite votre accord et ce qui doit rester interdit."
    >
      {/* ================================================
          INTRO
      ================================================ */}

      <div className="rounded-[24px] bg-slate-950 p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
          POLITIQUE DE SÉCURITÉ
        </p>

        <h3 className="mt-3 text-xl font-bold">
          Donnez des permissions,
          pas un pouvoir illimité
        </h3>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Un assistant sérieux
          ne doit pas décider seul
          de toutes ses permissions.
          Vous allez définir les règles
          qu&apos;il devra respecter
          avant chaque action.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MissionStat
            value={`${configuredCount}/${actions.length}`}
            label="Actions configurées"
          />

          <MissionStat
            value={`${confidenceThreshold || "0"}%`}
            label="Seuil confiance"
          />

          <MissionStat
            value={
              complete
                ? "Prêt"
                : "À configurer"
            }
            label="Politique"
          />
        </div>
      </div>

      {/* ================================================
          ÉTAPE 1 — PERMISSIONS
      ================================================ */}

      <Step
        number="01"
        title="Attribuez une permission à chaque action"
        text="AUTO exécute seul. VALIDATION exige l'accord d'une personne. BLOQUÉ interdit complètement l'action."
      >
        <div className="space-y-4">
          {actions.map(
            (action) => {
              const current =
                permissions[
                  action.id
                ];

              return (
                <div
                  key={action.id}
                  className="rounded-[22px] border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">
                          {action.name}
                        </p>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          Risque{" "}
                          {action.risk}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {
                          action.description
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    {(
                      [
                        "AUTO",
                        "VALIDATION",
                        "BLOQUÉ",
                      ] as Permission[]
                    ).map(
                      (
                        permission
                      ) => (
                        <button
                          key={
                            permission
                          }
                          type="button"
                          onClick={() =>
                            updatePermission(
                              action.id,
                              permission
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            current?.permission ===
                            permission
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          {
                            permission
                          }
                        </button>
                      )
                    )}
                  </div>

                  {action.financial &&
                    current
                      ?.permission ===
                      "AUTO" && (
                      <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                        <label className="block">
                          <span className="text-sm font-bold">
                            Limite automatique
                            maximale (€)
                          </span>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Au-dessus de ce
                            montant, votre moteur
                            demandera automatiquement
                            une validation humaine.
                          </p>

                          <input
                            type="number"
                            min="0"
                            value={
                              current.maxAmount
                            }
                            onChange={(
                              event
                            ) =>
                              updateMaxAmount(
                                action.id,
                                event.target
                                  .value
                              )
                            }
                            placeholder="Ex. 50"
                            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-950"
                          />
                        </label>
                      </div>
                    )}
                </div>
              );
            }
          )}
        </div>
      </Step>

      {/* ================================================
          ÉTAPE 2 — CONFIANCE
      ================================================ */}

      <Step
        number="02"
        title="Définissez le seuil de confiance"
        text="Même une action normalement autorisée doit pouvoir s'arrêter si l'IA n'est pas suffisamment sûre."
      >
        <label className="block">
          <span className="font-bold">
            Confiance minimum pour
            continuer automatiquement
          </span>

          <div className="mt-5 flex items-center gap-5">
            <input
              type="range"
              min="50"
              max="100"
              value={
                confidenceThreshold
              }
              onChange={(event) =>
                setConfidenceThreshold(
                  event.target.value
                )
              }
              className="w-full"
            />

            <span className="min-w-20 rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white">
              {
                confidenceThreshold
              }
              %
            </span>
          </div>
        </label>

        <div className="mt-6">
          <Field
            label="Que doit faire le système lorsqu'il est incertain ?"
            value={
              uncertaintyRule
            }
            onChange={
              setUncertaintyRule
            }
            placeholder="Ex. arrêter le workflow, enregistrer le cas dans À vérifier et demander une validation humaine."
            rows={5}
          />
        </div>
      </Step>

      {/* ================================================
          ÉTAPE 3 — TEST
      ================================================ */}

      <Step
        number="03"
        title="Testez votre moteur de permissions"
        text="Choisissez plusieurs situations et observez la décision produite uniquement à partir de vos propres règles."
      >
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="space-y-2">
            {scenarios.map(
              (scenario) => (
                <button
                  key={
                    scenario.id
                  }
                  type="button"
                  onClick={() =>
                    setSelectedScenario(
                      scenario.id
                    )
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedScenario ===
                    scenario.id
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-semibold">
                    {
                      scenario.title
                    }
                  </p>

                  <p
                    className={`mt-2 text-xs leading-5 ${
                      selectedScenario ===
                      scenario.id
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {
                      scenario.description
                    }
                  </p>
                </button>
              )
            )}
          </div>

          <div className="rounded-[24px] bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
              SIMULATION
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              {
                currentScenario.title
              }
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {
                currentScenario.description
              }
            </p>

            <div className="mt-6 space-y-3">
              <DarkLine
                label="Action"
                value={
                  actions.find(
                    (action) =>
                      action.id ===
                      currentScenario.action
                  )?.name ??
                  currentScenario.action
                }
              />

              {currentScenario.amount !==
                undefined && (
                <DarkLine
                  label="Montant"
                  value={`${currentScenario.amount} €`}
                />
              )}

              {currentScenario.confidence !==
                undefined && (
                <DarkLine
                  label="Confiance IA"
                  value={`${currentScenario.confidence} %`}
                />
              )}
            </div>

            <div className="mt-7 rounded-2xl bg-slate-900 p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                DÉCISION DU MOTEUR
              </p>

              <p className="mt-3 text-2xl font-bold">
                {
                  scenarioResult.status
                }
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {
                  scenarioResult.message
                }
              </p>
            </div>
          </div>
        </div>
      </Step>

      {/* ================================================
          RÉCAPITULATIF
      ================================================ */}

      <div className="mt-7 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
          VOTRE POLITIQUE
        </p>

        <div className="mt-5 space-y-3">
          {actions.map(
            (action) => {
              const rule =
                permissions[
                  action.id
                ];

              return (
                <div
                  key={
                    action.id
                  }
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4"
                >
                  <p className="font-semibold">
                    {
                      action.name
                    }
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold">
                      {rule?.permission ||
                        "NON CONFIGURÉ"}
                    </span>

                    {action.financial &&
                      rule?.permission ===
                        "AUTO" && (
                        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">
                          max{" "}
                          {rule.maxAmount ||
                            "?"}{" "}
                          €
                        </span>
                      )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* ================================================
          ÉVALUATION
      ================================================ */}

      <button
        type="button"
        disabled={
          !complete ||
          evaluating
        }
        onClick={() =>
          evaluate(
            "Construire une politique de sécurité pour un assistant IA",

            "Configurer les permissions d'un système autonome avec niveaux AUTO, VALIDATION et BLOQUÉ, limites financières, seuil de confiance et gestion des cas incertains.",

            {
              "Politique d'actions":
                JSON.stringify(
                  policySummary
                ),

              "Seuil de confiance":
                `${confidenceThreshold}%`,

              "Règle d'incertitude":
                uncertaintyRule,

              "Dernier scénario testé":
                JSON.stringify({
                  scenario:
                    currentScenario,
                  result:
                    scenarioResult,
                }),
            },

            [
              {
                name:
                  "Gestion du risque",
                maxScore: 25,
                description:
                  "Les actions les plus sensibles disposent d'un niveau de contrôle proportionné.",
              },

              {
                name:
                  "Permissions",
                maxScore: 25,
                description:
                  "Les choix AUTO, VALIDATION et BLOQUÉ sont cohérents avec les conséquences possibles.",
              },

              {
                name:
                  "Limites financières",
                maxScore: 15,
                description:
                  "Les actions financières automatiques sont limitées et encadrées de manière réaliste.",
              },

              {
                name:
                  "Gestion de l'incertitude",
                maxScore: 20,
                description:
                  "Une confiance insuffisante conduit à une sortie sûre et à une reprise humaine.",
              },

              {
                name:
                  "Cohérence globale",
                maxScore: 15,
                description:
                  "La politique constitue un ensemble de règles compréhensible et réutilisable.",
              },
            ],

            JSON.stringify({
              actions,
              scenarios,
              principle:
                "Le système ne décide jamais lui-même de ses permissions. Il applique une politique définie à l'avance par l'utilisateur.",
            })
          )
        }
        className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
      >
        {evaluating
          ? "Évaluation de votre politique..."
          : complete
            ? "Évaluer mon moteur de sécurité /100 →"
            : "Configurez toutes les permissions"}
      </button>
    </Shell>
  );
}

// ======================================================
// PETITES LIGNES
// ======================================================

function LightLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value}
      </p>
    </div>
  );
}

function DarkLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-800 pb-3">
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}

// ======================================================
// ÉVALUATION
// ======================================================

function EvaluationPanel({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  return (
    <section className="mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="bg-slate-950 p-7 text-white">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
          ANALYSE DE VOTRE TRAVAIL
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-6xl font-bold">
              {evaluation.score}

              <span className="text-2xl text-slate-500">
                /100
              </span>
            </p>

            <p className="mt-2 font-semibold text-slate-300">
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
                    `${Math.max(
                      0,
                      Math.min(
                        100,
                        evaluation.score
                      )
                    )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <p className="mt-5 max-w-3xl leading-7 text-slate-400">
          {
            evaluation.summary
          }
        </p>
      </div>

      <div className="space-y-4 p-6">
        {evaluation.criteria?.map(
          (criterion) => (
            <div
              key={
                criterion.name
              }
              className="rounded-2xl bg-slate-50 p-5"
            >
              <div className="flex justify-between gap-4">
                <p className="font-bold">
                  {
                    criterion.name
                  }
                </p>

                <p className="font-bold">
                  {
                    criterion.score
                  }
                  /
                  {
                    criterion.maxScore
                  }
                </p>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {
                  criterion.feedback
                }
              </p>
            </div>
          )
        )}

        {evaluation.strengths &&
          evaluation.strengths.length >
            0 && (
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="font-bold">
                Points solides
              </p>

              <div className="mt-3 space-y-2">
                {evaluation.strengths.map(
                  (
                    item,
                    index
                  ) => (
                    <p
                      key={index}
                      className="text-sm leading-6 text-slate-600"
                    >
                      ✓ {item}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

        {evaluation.improvements &&
          evaluation.improvements.length >
            0 && (
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="font-bold">
                À améliorer
              </p>

              <div className="mt-3 space-y-2">
                {evaluation.improvements.map(
                  (
                    item,
                    index
                  ) => (
                    <p
                      key={index}
                      className="text-sm leading-6 text-slate-600"
                    >
                      → {item}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

        {evaluation.advice && (
          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <p className="font-bold">
              Conseil pour progresser
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {evaluation.advice}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
