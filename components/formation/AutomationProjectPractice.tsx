"use client";

import { useMemo, useState } from "react";

import AutomationInbox, {
  type TrainingEmail,
} from "@/components/formation/AutomationInbox";
import SecureProjectEvaluation from "@/components/formation/projects/SecureProjectEvaluation";

// ======================================================
// TYPES
// ======================================================

type Permission =
  | "AUTO"
  | "VALIDATION"
  | "BLOQUÉ";

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

type ActionRule = {
  action: string;
  permission: Permission;
};

// ======================================================
// COMPOSANT
// ======================================================

export default function AutomationProjectPractice() {
  // ====================================================
  // PROJET
  // ====================================================

  const [
    projectName,
    setProjectName,
  ] = useState("");

  const [
    targetUser,
    setTargetUser,
  ] = useState("");

  const [
    problem,
    setProblem,
  ] = useState("");

  const [
    trigger,
    setTrigger,
  ] = useState("");

  const [
    categories,
    setCategories,
  ] = useState("");

  const [
    dataToExtract,
    setDataToExtract,
  ] = useState("");

  const [
    value,
    setValue,
  ] = useState("");

  // ====================================================
  // ACTIONS
  // ====================================================

  const [
    actionName,
    setActionName,
  ] = useState("");

  const [
    actionPermission,
    setActionPermission,
  ] =
    useState<Permission>(
      "VALIDATION"
    );

  const [
    actions,
    setActions,
  ] = useState<ActionRule[]>([]);

  // ====================================================
  // SÉCURITÉ
  // ====================================================

  const [
    confidenceThreshold,
    setConfidenceThreshold,
  ] = useState(80);

  const [
    fallback,
    setFallback,
  ] = useState("");

  // ====================================================
  // TEST
  // ====================================================

  const [
    selectedEmail,
    setSelectedEmail,
  ] =
    useState<TrainingEmail | null>(
      null
    );

  const [
    extraction,
    setExtraction,
  ] =
    useState<ExtractedEmail | null>(
      null
    );

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
    selectedAction,
    setSelectedAction,
  ] = useState("");

  const [
    testing,
    setTesting,
  ] = useState(false);

  const [
    testError,
    setTestError,
  ] = useState("");

  const [
    humanDecision,
    setHumanDecision,
  ] =
    useState<
      "" |
      "approved" |
      "rejected"
    >("");

  const [
    logs,
    setLogs,
  ] = useState<string[]>([]);

  // ====================================================
  // ACTIONS
  // ====================================================

  function addAction() {
    const cleaned =
      actionName.trim();

    if (!cleaned) {
      return;
    }

    setActions(
      (current) => [
        ...current,
        {
          action: cleaned,
          permission:
            actionPermission,
        },
      ]
    );

    setActionName("");
    setActionPermission(
      "VALIDATION"
    );
  }

  function removeAction(
    index: number
  ) {
    setActions(
      (current) =>
        current.filter(
          (_, itemIndex) =>
            itemIndex !==
            index
        )
    );
  }

  // ====================================================
  // EMAIL
  // ====================================================

  function selectEmail(
    email: TrainingEmail
  ) {
    setSelectedEmail(email);

    setExtraction(null);
    setGenerated(null);
    setDraft("");
    setSelectedAction("");
    setHumanDecision("");
    setTestError("");

    setLogs([
      `Email reçu : ${email.subject}`,
    ]);
  }

  // ====================================================
  // TEST COMPLET
  // ====================================================

  async function runAssistant() {
    if (
      !selectedEmail ||
      actions.length === 0
    ) {
      return;
    }

    setTesting(true);
    setTestError("");
    setExtraction(null);
    setGenerated(null);
    setDraft("");
    setHumanDecision("");

    try {
      // ================================================
      // 1. EXTRACTION
      // ================================================

      const extractionResponse =
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

      const extractionData =
        await extractionResponse.json();

      if (
        !extractionResponse.ok
      ) {
        throw new Error(
          extractionData.error ??
            "Impossible d'analyser l'email."
        );
      }

      const extracted =
        extractionData.extraction as ExtractedEmail;

      setExtraction(
        extracted
      );

      setLogs(
        (current) => [
          ...current,
          `Analyse terminée — confiance ${extracted.confidence}%`,
          extracted.category
            ? `Catégorie détectée : ${extracted.category}`
            : "Aucune catégorie détectée",
        ]
      );

      // ================================================
      // 2. ACTION
      // ================================================

      const firstAction =
        actions[0];

      setSelectedAction(
        firstAction.action
      );

      setLogs(
        (current) => [
          ...current,
          `Action choisie : ${firstAction.action}`,
          `Permission : ${firstAction.permission}`,
        ]
      );

      // ================================================
      // 3. CONFIANCE
      // ================================================

      if (
        extracted.confidence <
        confidenceThreshold
      ) {
        setLogs(
          (current) => [
            ...current,
            `Confiance insuffisante : ${extracted.confidence}% < ${confidenceThreshold}%`,
            "Workflow suspendu.",
          ]
        );

        return;
      }

      // ================================================
      // 4. BLOQUÉ
      // ================================================

      if (
        firstAction.permission ===
        "BLOQUÉ"
      ) {
        setLogs(
          (current) => [
            ...current,
            "Action bloquée par la politique de sécurité.",
          ]
        );

        return;
      }

      // ================================================
      // 5. GÉNÉRATION
      // ================================================

      const facts = `
Demande détectée :
${extracted.request ?? "non fournie"}

Catégorie :
${extracted.category ?? "non fournie"}

Montant :
${extracted.amount ?? "non fourni"}

Référence :
${extracted.reference ?? "non fournie"}

Échéance :
${extracted.deadline ?? "non fournie"}

Action prévue :
${firstAction.action}
`;

      const generationResponse =
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

      const generationData =
        await generationResponse.json();

      if (
        !generationResponse.ok
      ) {
        throw new Error(
          generationData.error ??
            "Impossible de générer le brouillon."
        );
      }

      const generation =
        generationData.result as GeneratedEmail;

      setGenerated(
        generation
      );

      setDraft(
        generation.draft
      );

      setLogs(
        (current) => [
          ...current,
          `Brouillon généré — risque ${generation.riskLevel}`,
          generation.requiresHumanValidation
            ? "Ollama recommande une validation humaine."
            : "Ollama ne demande pas de validation supplémentaire.",
        ]
      );

      // ================================================
      // 6. PERMISSION
      // ================================================

      if (
        firstAction.permission ===
        "VALIDATION"
      ) {
        setLogs(
          (current) => [
            ...current,
            "Workflow suspendu en attente d'une validation humaine.",
          ]
        );
      } else {
        setLogs(
          (current) => [
            ...current,
            "Action autorisée automatiquement par votre politique.",
          ]
        );
      }
    } catch (error) {
      setTestError(
        error instanceof Error
          ? error.message
          : "Impossible d'exécuter l'assistant."
      );
    } finally {
      setTesting(false);
    }
  }

  // ====================================================
  // PERMISSION ACTUELLE
  // ====================================================

  const currentRule =
    actions.find(
      (item) =>
        item.action ===
        selectedAction
    );

  const waitingHuman =
    Boolean(
      generated &&
      currentRule?.permission ===
        "VALIDATION" &&
      !humanDecision
    );

  // ====================================================
  // VALIDATION HUMAINE
  // ====================================================

  function decide(
    decision:
      | "approved"
      | "rejected"
  ) {
    setHumanDecision(
      decision
    );

    setLogs(
      (current) => [
        ...current,
        decision ===
        "approved"
          ? "Validation humaine : action approuvée."
          : "Validation humaine : action refusée.",
      ]
    );
  }

  // ====================================================
  // AVANCEMENT
  // ====================================================

  const configurationFields =
    [
      projectName,
      targetUser,
      problem,
      trigger,
      categories,
      dataToExtract,
      value,
      fallback,
    ];

  const configurationProgress =
    Math.round(
      (
        configurationFields.filter(
          (item) =>
            item.trim()
        ).length /
        configurationFields.length
      ) *
        100
    );

  const projectReady =
    configurationProgress ===
      100 &&
    actions.length > 0;

  // ====================================================
  // RÉSULTAT
  // ====================================================

  const resultStatus =
    useMemo(() => {
      if (
        !selectedEmail
      ) {
        return "Non testé";
      }

      if (
        extraction &&
        extraction.confidence <
          confidenceThreshold
      ) {
        return "À vérifier";
      }

      if (
        currentRule?.permission ===
        "BLOQUÉ"
      ) {
        return "Bloqué";
      }

      if (
        currentRule?.permission ===
          "VALIDATION" &&
        !humanDecision
      ) {
        return "En attente";
      }

      if (
        humanDecision ===
        "rejected"
      ) {
        return "Refusé";
      }

      if (
        generated ||
        humanDecision ===
          "approved"
      ) {
        return "Terminé";
      }

      return "En cours";
    }, [
      selectedEmail,
      extraction,
      confidenceThreshold,
      currentRule,
      humanDecision,
      generated,
    ]);

  const readyForEvaluation =
    Boolean(
      projectReady &&
      selectedEmail &&
      extraction &&
      selectedAction &&
      logs.length > 0
    );

  // ====================================================
  // UI
  // ====================================================

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-slate-950 p-7 text-white">

        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
          PROJET FINAL
        </p>

        <h2 className="mt-4 text-3xl font-bold">
          Construisez votre assistant métier
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Vous allez configurer un
          assistant capable de recevoir
          une demande, la comprendre,
          choisir une action, utiliser
          l&apos;IA et respecter vos
          règles de sécurité.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">

          <Stat
            value={`${configurationProgress}%`}
            label="Configuration"
          />

          <Stat
            value={`${actions.length}`}
            label="Actions"
          />

          <Stat
            value={`${confidenceThreshold}%`}
            label="Seuil IA"
          />

          <Stat
            value={resultStatus}
            label="Dernier test"
          />

        </div>

      </div>

      <div className="p-6 md:p-8">

        {/* ==================================================
            ÉTAPE 1
        ================================================== */}

        <ProjectBlock
          number="01"
          title="Définissez votre produit"
          description="Commencez par le problème à résoudre, pas par la technologie."
        >

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="Nom de votre assistant"
              value={projectName}
              onChange={
                setProjectName
              }
              placeholder="Ex. Assistant SAV Pro"
            />

            <Field
              label="Utilisateur cible"
              value={targetUser}
              onChange={
                setTargetUser
              }
              placeholder="Ex. e-commerce, artisan, agence..."
            />

          </div>

          <div className="mt-5">

            <Field
              label="Problème concret"
              value={problem}
              onChange={
                setProblem
              }
              placeholder="Ex. l'équipe passe 2 heures par jour à lire et répondre aux demandes clients."
              rows={5}
            />

          </div>

          <div className="mt-5">

            <Field
              label="Valeur produite"
              value={value}
              onChange={
                setValue
              }
              placeholder="Ex. réduire le temps de tri, répondre plus vite et éviter les oublis."
            />

          </div>

        </ProjectBlock>

        {/* ==================================================
            ÉTAPE 2
        ================================================== */}

        <ProjectBlock
          number="02"
          title="Configurez ce que votre assistant comprend"
          description="Définissez l'entrée et les informations nécessaires au traitement."
        >

          <Field
            label="Déclencheur"
            value={trigger}
            onChange={
              setTrigger
            }
            placeholder="Ex. quand un nouvel email client arrive."
          />

          <div className="mt-5">

            <Field
              label="Catégories à reconnaître"
              value={categories}
              onChange={
                setCategories
              }
              placeholder="Ex. Facturation, Commercial, Support, Rendez-vous..."
              rows={5}
            />

          </div>

          <div className="mt-5">

            <Field
              label="Données à extraire"
              value={
                dataToExtract
              }
              onChange={
                setDataToExtract
              }
              placeholder="Ex. nom, email, numéro de commande, montant, échéance..."
              rows={5}
            />

          </div>

        </ProjectBlock>

        {/* ==================================================
            ÉTAPE 3
        ================================================== */}

        <ProjectBlock
          number="03"
          title="Donnez des outils à votre assistant"
          description="Ajoutez les actions qu'il pourra proposer puis attribuez une permission à chacune."
        >

          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">

            <input
              value={actionName}
              onChange={(event) =>
                setActionName(
                  event.target.value
                )
              }
              placeholder="Ex. Préparer un brouillon"
              className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-slate-950"
            />

            <select
              value={
                actionPermission
              }
              onChange={(event) =>
                setActionPermission(
                  event.target
                    .value as Permission
                )
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
            >
              <option value="AUTO">
                AUTO
              </option>

              <option value="VALIDATION">
                VALIDATION
              </option>

              <option value="BLOQUÉ">
                BLOQUÉ
              </option>
            </select>

            <button
              type="button"
              onClick={addAction}
              disabled={
                !actionName.trim()
              }
              className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              Ajouter
            </button>

          </div>

          {actions.length >
            0 && (
            <div className="mt-6 space-y-3">

              {actions.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={`${item.action}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5"
                  >

                    <div>

                      <p className="font-bold">
                        {item.action}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Permission :{" "}
                        {
                          item.permission
                        }
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeAction(
                          index
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
                    >
                      Supprimer
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </ProjectBlock>

        {/* ==================================================
            ÉTAPE 4
        ================================================== */}

        <ProjectBlock
          number="04"
          title="Définissez les limites"
          description="Votre assistant doit savoir quand il doit arrêter de prendre des décisions seul."
        >

          <label className="block">

            <span className="font-bold">
              Confiance minimale
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
                    Number(
                      event.target.value
                    )
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
              label="Que faire si l'assistant hésite ?"
              value={fallback}
              onChange={
                setFallback
              }
              placeholder="Ex. arrêter le workflow, classer la demande dans À vérifier et prévenir une personne."
              rows={5}
            />

          </div>

        </ProjectBlock>

        {/* ==================================================
            PRÊT
        ================================================== */}

        <div className="mt-7 rounded-[24px] border border-slate-200 bg-slate-50 p-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                CONFIGURATION
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {projectReady
                  ? "Votre assistant est prêt à être testé"
                  : "Configuration incomplète"}
              </h3>

            </div>

            <span className="rounded-xl bg-white px-4 py-2 font-bold shadow-sm">
              {configurationProgress}%
            </span>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-slate-950 transition-all"
              style={{
                width:
                  `${configurationProgress}%`,
              }}
            />

          </div>

          {actions.length ===
            0 && (
            <p className="mt-4 text-sm text-slate-500">
              Ajoutez au moins une
              action pour pouvoir
              tester votre assistant.
            </p>
          )}

        </div>

        {/* ==================================================
            ÉTAPE 5
        ================================================== */}

        {projectReady && (
          <ProjectBlock
            number="05"
            title="Testez votre produit"
            description="Votre assistant va maintenant recevoir une vraie demande simulée."
          >

            <AutomationInbox
              onSelectEmail={
                selectEmail
              }
            />

            {selectedEmail && (
              <button
                type="button"
                onClick={
                  runAssistant
                }
                disabled={
                  testing
                }
                className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:opacity-50"
              >
                {testing
                  ? "Votre assistant travaille..."
                  : "Exécuter mon assistant →"}
              </button>
            )}

            {testError && (
              <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm text-slate-600">
                {testError}
              </div>
            )}

          </ProjectBlock>
        )}

        {/* ==================================================
            RÉSULTAT IA
        ================================================== */}

        {extraction && (
          <ProjectBlock
            number="06"
            title="Résultat du traitement"
            description="Observez ce que votre assistant a réellement compris et décidé."
          >

            <div className="grid gap-4 md:grid-cols-3">

              <ResultCard
                label="Catégorie"
                value={
                  extraction.category ??
                  "Non trouvée"
                }
              />

              <ResultCard
                label="Demande"
                value={
                  extraction.request ??
                  "Non trouvée"
                }
              />

              <ResultCard
                label="Confiance"
                value={`${extraction.confidence}%`}
              />

              <ResultCard
                label="Montant"
                value={
                  extraction.amount ??
                  "Non fourni"
                }
              />

              <ResultCard
                label="Référence"
                value={
                  extraction.reference ??
                  "Non fournie"
                }
              />

              <ResultCard
                label="Action"
                value={
                  selectedAction ||
                  "Aucune"
                }
              />

            </div>

            {generated && (
              <div className="mt-6">

                <div className="grid gap-4 sm:grid-cols-3">

                  <ResultCard
                    label="Risque"
                    value={
                      generated.riskLevel
                    }
                  />

                  <ResultCard
                    label="Confiance génération"
                    value={`${generated.confidence}%`}
                  />

                  <ResultCard
                    label="Permission"
                    value={
                      currentRule?.permission ??
                      "Non définie"
                    }
                  />

                </div>

                <div className="mt-6">

                  <Field
                    label="Brouillon produit par votre assistant"
                    value={draft}
                    onChange={
                      setDraft
                    }
                    placeholder="..."
                    rows={10}
                  />

                </div>

              </div>
            )}

          </ProjectBlock>
        )}

        {/* ==================================================
            VALIDATION HUMAINE
        ================================================== */}

        {waitingHuman && (
          <ProjectBlock
            number="07"
            title="Validation humaine"
            description="Votre politique interdit à l'assistant de continuer seul."
          >

            <div className="rounded-[24px] bg-slate-950 p-6 text-white">

              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                ACTION EN ATTENTE
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                {
                  selectedAction
                }
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Votre assistant a
                préparé le travail,
                mais votre politique
                exige maintenant une
                décision humaine.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() =>
                    decide(
                      "approved"
                    )
                  }
                  className="rounded-2xl bg-white px-5 py-4 font-semibold text-slate-950"
                >
                  ✓ Approuver
                </button>

                <button
                  type="button"
                  onClick={() =>
                    decide(
                      "rejected"
                    )
                  }
                  className="rounded-2xl border border-slate-700 px-5 py-4 font-semibold text-white"
                >
                  ✕ Refuser
                </button>

              </div>

            </div>

          </ProjectBlock>
        )}

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        {selectedEmail && (
          <ProjectBlock
            number="08"
            title="Dashboard de votre assistant"
            description="Un produit utile doit aussi montrer ce qu'il a fait et pourquoi."
          >

            <div className="grid gap-4 sm:grid-cols-4">

              <DashboardCard
                value="1"
                label="Demande traitée"
              />

              <DashboardCard
                value={
                  extraction
                    ? "1"
                    : "0"
                }
                label="Analyse IA"
              />

              <DashboardCard
                value={
                  waitingHuman
                    ? "1"
                    : "0"
                }
                label="À valider"
              />

              <DashboardCard
                value={
                  resultStatus
                }
                label="Statut"
              />

            </div>

            <div className="mt-6 rounded-[24px] bg-slate-950 p-6 text-white">

              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                JOURNAL D&apos;EXÉCUTION
              </p>

              <div className="mt-5 space-y-3">

                {logs.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex gap-4 border-b border-slate-800 pb-3"
                    >

                      <span className="text-xs font-bold text-slate-500">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p className="text-sm text-slate-300">
                        {item}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </ProjectBlock>
        )}

        {/* ==================================================
            ÉVALUATION
        ================================================== */}

        <SecureProjectEvaluation
          lessonId="automation-07-project"
          ready={readyForEvaluation}
          work={{
              project_name: projectName,
              target_user: targetUser,
              problem,
              trigger,
              categories,
              data_to_extract: dataToExtract,
              actions: JSON.stringify(actions),
              confidence_policy: `Seuil de confiance : ${confidenceThreshold} %.`,
              fallback,
              value,
              test_evidence: JSON.stringify({
                email: selectedEmail?.subject,
                extraction,
                generated,
                selectedAction,
                humanDecision: humanDecision || "Non nécessaire",
              }),
              execution_log: logs.join(" | "),
          }}
        />

      </div>

    </section>
  );
}

// ======================================================
// BLOCK
// ======================================================

function ProjectBlock({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 rounded-[26px] border border-slate-200 p-6">

      <div className="flex gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {number}
        </div>

        <div>

          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <div className="mt-6">
        {children}
      </div>

    </section>
  );
}

// ======================================================
// FIELD
// ======================================================

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
        placeholder={
          placeholder
        }
        rows={rows}
        className="mt-3 w-full resize-y rounded-2xl border border-slate-200 px-5 py-4 leading-7 outline-none transition focus:border-slate-950"
      />

    </label>
  );
}

// ======================================================
// STAT
// ======================================================

function Stat({
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
// RESULT CARD
// ======================================================

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <p className="text-xs font-semibold tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

// ======================================================
// DASHBOARD CARD
// ======================================================

function DashboardCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white">

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>

    </div>
  );
}
