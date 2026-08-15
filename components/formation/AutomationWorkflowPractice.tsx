"use client";

import { useState } from "react";

import AutomationInbox, {
  type TrainingEmail,
} from "@/components/formation/AutomationInbox";

// ======================================================
// TYPES
// ======================================================

type EvaluationFunction = (
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

type Props = {
  evaluate: EvaluationFunction;
  evaluating: boolean;
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

type WorkflowStage =
  | "idle"
  | "email"
  | "classified"
  | "extracted"
  | "decision"
  | "draft"
  | "permission"
  | "finished";

// ======================================================
// COMPOSANT
// ======================================================

export default function AutomationWorkflowPractice({
  evaluate,
  evaluating,
}: Props) {
  // ====================================================
  // EMAIL
  // ====================================================

  const [
    selectedEmail,
    setSelectedEmail,
  ] =
    useState<TrainingEmail | null>(
      null
    );

  // ====================================================
  // CLASSIFICATION
  // ====================================================

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    priority,
    setPriority,
  ] = useState("");

  // ====================================================
  // EXTRACTION
  // ====================================================

  const [
    extraction,
    setExtraction,
  ] =
    useState<ExtractedEmail | null>(
      null
    );

  const [
    extracting,
    setExtracting,
  ] = useState(false);

  const [
    extractionError,
    setExtractionError,
  ] = useState("");

  // ====================================================
  // DÉCISION
  // ====================================================

  const [
    proposedAction,
    setProposedAction,
  ] = useState("");

  const [
    actionReason,
    setActionReason,
  ] = useState("");

  // ====================================================
  // BROUILLON
  // ====================================================

  const [
    facts,
    setFacts,
  ] = useState("");

  const [
    generatedEmail,
    setGeneratedEmail,
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

  // ====================================================
  // PERMISSION
  // ====================================================

  const [
    permission,
    setPermission,
  ] =
    useState<Permission | "">(
      ""
    );

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
    securityRule,
    setSecurityRule,
  ] = useState("");

  // ====================================================
  // HISTORIQUE
  // ====================================================

  const [
    logs,
    setLogs,
  ] = useState<string[]>([]);

  // ====================================================
  // ÉTAPE
  // ====================================================

  const [
    stage,
    setStage,
  ] =
    useState<WorkflowStage>(
      "idle"
    );

  // ====================================================
  // EMAIL
  // ====================================================

  function selectEmail(
    email: TrainingEmail
  ) {
    setSelectedEmail(email);

    setCategory("");
    setPriority("");

    setExtraction(null);
    setExtractionError("");

    setProposedAction("");
    setActionReason("");

    setFacts("");

    setGeneratedEmail(null);
    setDraft("");
    setGenerationError("");

    setPermission("");
    setHumanDecision("");
    setSecurityRule("");

    setLogs([
      `Email reçu : ${email.subject}`,
    ]);

    setStage("email");
  }

  // ====================================================
  // CLASSIFICATION
  // ====================================================

  function validateClassification() {
    if (
      !category ||
      !priority
    ) {
      return;
    }

    setLogs(
      (current) => [
        ...current,
        `Classification : ${category}`,
        `Priorité : ${priority}`,
      ]
    );

    setStage(
      "classified"
    );
  }

  // ====================================================
  // EXTRACTION OLLAMA
  // ====================================================

  async function extractWithAI() {
    if (!selectedEmail) {
      return;
    }

    setExtracting(true);
    setExtractionError("");

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
            "Impossible d'extraire les informations."
        );
      }

      const result =
        data.extraction as ExtractedEmail;

      setExtraction(
        result
      );

      setLogs(
        (current) => [
          ...current,
          `Extraction IA terminée — confiance ${result.confidence}%`,
          result.amount
            ? `Montant détecté : ${result.amount}`
            : "Aucun montant détecté",
          result.reference
            ? `Référence détectée : ${result.reference}`
            : "Aucune référence détectée",
        ]
      );

      setStage(
        "extracted"
      );
    } catch (error) {
      setExtractionError(
        error instanceof Error
          ? error.message
          : "Erreur pendant l'extraction."
      );
    } finally {
      setExtracting(false);
    }
  }

  // ====================================================
  // DÉCISION
  // ====================================================

  function validateDecision() {
    if (
      !proposedAction.trim() ||
      !actionReason.trim()
    ) {
      return;
    }

    setLogs(
      (current) => [
        ...current,
        `Action proposée : ${proposedAction}`,
        `Justification : ${actionReason}`,
      ]
    );

    setStage(
      "decision"
    );
  }

  // ====================================================
  // GÉNÉRATION BROUILLON
  // ====================================================

  async function generateDraft() {
    if (
      !selectedEmail ||
      !facts.trim()
    ) {
      return;
    }

    setGenerating(true);
    setGenerationError("");

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

      setGeneratedEmail(
        result
      );

      setDraft(
        result.draft
      );

      setLogs(
        (current) => [
          ...current,
          `Brouillon IA généré — risque ${result.riskLevel}`,
          `Confiance génération : ${result.confidence}%`,
        ]
      );

      setStage(
        "draft"
      );
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

  // ====================================================
  // PERMISSION
  // ====================================================

  function validatePermission() {
    if (
      !permission ||
      !securityRule.trim()
    ) {
      return;
    }

    setLogs(
      (current) => [
        ...current,
        `Permission : ${permission}`,
        `Règle de sécurité : ${securityRule}`,
      ]
    );

    if (
      permission ===
      "VALIDATION"
    ) {
      setStage(
        "permission"
      );

      return;
    }

    if (
      permission ===
      "BLOQUÉ"
    ) {
      setLogs(
        (current) => [
          ...current,
          "Workflow arrêté : action bloquée.",
        ]
      );

      setStage(
        "finished"
      );

      return;
    }

    setLogs(
      (current) => [
        ...current,
        "Workflow autorisé automatiquement.",
      ]
    );

    setStage(
      "finished"
    );
  }

  // ====================================================
  // VALIDATION HUMAINE
  // ====================================================

  function validateHumanDecision(
    choice:
      | "approved"
      | "rejected"
  ) {
    setHumanDecision(
      choice
    );

    setLogs(
      (current) => [
        ...current,
        choice ===
        "approved"
          ? "Validation humaine : action approuvée."
          : "Validation humaine : action refusée.",
      ]
    );

    setStage(
      "finished"
    );
  }

  // ====================================================
  // RESET
  // ====================================================

  function resetWorkflow() {
    setSelectedEmail(null);

    setCategory("");
    setPriority("");

    setExtraction(null);
    setExtractionError("");

    setProposedAction("");
    setActionReason("");

    setFacts("");

    setGeneratedEmail(null);
    setDraft("");
    setGenerationError("");

    setPermission("");
    setHumanDecision("");
    setSecurityRule("");

    setLogs([]);

    setStage("idle");
  }

  // ====================================================
  // PROGRESSION
  // ====================================================

  const progress =
    calculateProgress(
      stage
    );

  const readyForEvaluation =
    stage === "finished" &&
    Boolean(
      selectedEmail &&
      category &&
      priority &&
      extraction &&
      proposedAction.trim() &&
      actionReason.trim() &&
      permission &&
      securityRule.trim()
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
          ATELIER PRATIQUE
        </p>

        <h2 className="mt-4 text-3xl font-bold">
          Exécutez votre workflow complet
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Faites circuler une vraie demande
          à travers toutes les briques
          construites dans ce module :
          réception, classification,
          extraction, décision, IA,
          permission et contrôle humain.
        </p>

        {/* PROGRESSION */}

        <div className="mt-7">

          <div className="flex justify-between text-sm">

            <span className="text-slate-400">
              Progression du workflow
            </span>

            <span>
              {progress}%
            </span>

          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      <div className="p-6 md:p-8">

        {/* ==================================================
            PIPELINE
        ================================================== */}

        <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-7">

          <PipelineStep
            number="01"
            title="Email"
            done={
              stage !==
              "idle"
            }
          />

          <PipelineStep
            number="02"
            title="Tri"
            done={
              [
                "classified",
                "extracted",
                "decision",
                "draft",
                "permission",
                "finished",
              ].includes(
                stage
              )
            }
          />

          <PipelineStep
            number="03"
            title="Extraction"
            done={
              [
                "extracted",
                "decision",
                "draft",
                "permission",
                "finished",
              ].includes(
                stage
              )
            }
          />

          <PipelineStep
            number="04"
            title="Décision"
            done={
              [
                "decision",
                "draft",
                "permission",
                "finished",
              ].includes(
                stage
              )
            }
          />

          <PipelineStep
            number="05"
            title="IA"
            done={
              [
                "draft",
                "permission",
                "finished",
              ].includes(
                stage
              )
            }
          />

          <PipelineStep
            number="06"
            title="Permission"
            done={
              [
                "permission",
                "finished",
              ].includes(
                stage
              )
            }
          />

          <PipelineStep
            number="07"
            title="Résultat"
            done={
              stage ===
              "finished"
            }
          />

        </div>

        {/* ==================================================
            1 — EMAIL
        ================================================== */}

        <WorkflowBlock
          number="01"
          title="Réception"
          description="Choisissez le message qui va entrer dans votre workflow."
        >

          <AutomationInbox
            onSelectEmail={
              selectEmail
            }
          />

        </WorkflowBlock>

        {/* ==================================================
            2 — CLASSIFICATION
        ================================================== */}

        {selectedEmail && (
          <WorkflowBlock
            number="02"
            title="Classification"
            description="Déterminez le type de demande et son niveau de priorité."
          >

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                EMAIL À TRAITER
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

              <p className="font-bold">
                Catégorie
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {[
                  "Facturation",
                  "Commercial",
                  "Support",
                  "Rendez-vous",
                  "Information",
                  "À vérifier",
                ].map(
                  (item) => (
                    <ChoiceButton
                      key={
                        item
                      }
                      active={
                        category ===
                        item
                      }
                      onClick={() =>
                        setCategory(
                          item
                        )
                      }
                    >
                      {item}
                    </ChoiceButton>
                  )
                )}

              </div>

            </div>

            <div className="mt-6">

              <p className="font-bold">
                Priorité
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {[
                  "Haute",
                  "Normale",
                  "Faible",
                ].map(
                  (item) => (
                    <ChoiceButton
                      key={
                        item
                      }
                      active={
                        priority ===
                        item
                      }
                      onClick={() =>
                        setPriority(
                          item
                        )
                      }
                    >
                      {item}
                    </ChoiceButton>
                  )
                )}

              </div>

            </div>

            <button
              type="button"
              disabled={
                !category ||
                !priority
              }
              onClick={
                validateClassification
              }
              className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              Valider la classification →
            </button>

          </WorkflowBlock>
        )}

        {/* ==================================================
            3 — EXTRACTION
        ================================================== */}

        {[
          "classified",
          "extracted",
          "decision",
          "draft",
          "permission",
          "finished",
        ].includes(
          stage
        ) &&
          selectedEmail && (
          <WorkflowBlock
            number="03"
            title="Extraction des données"
            description="Ollama transforme maintenant le texte du message en données structurées."
          >

            {!extraction && (
              <button
                type="button"
                onClick={
                  extractWithAI
                }
                disabled={
                  extracting
                }
                className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:opacity-50"
              >
                {extracting
                  ? "Extraction en cours..."
                  : "Extraire les informations avec l'IA →"}
              </button>
            )}

            {extractionError && (
              <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm text-slate-600">
                {
                  extractionError
                }
              </div>
            )}

            {extraction && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <DataCard
                  label="Catégorie IA"
                  value={
                    extraction.category ||
                    "Non trouvé"
                  }
                />

                <DataCard
                  label="Demande"
                  value={
                    extraction.request ||
                    "Non trouvée"
                  }
                />

                <DataCard
                  label="Montant"
                  value={
                    extraction.amount ||
                    "Non fourni"
                  }
                />

                <DataCard
                  label="Référence"
                  value={
                    extraction.reference ||
                    "Non fournie"
                  }
                />

                <DataCard
                  label="Échéance"
                  value={
                    extraction.deadline ||
                    "Non fournie"
                  }
                />

                <DataCard
                  label="Confiance"
                  value={`${extraction.confidence}%`}
                />

              </div>
            )}

          </WorkflowBlock>
        )}

        {/* ==================================================
            4 — DÉCISION
        ================================================== */}

        {[
          "extracted",
          "decision",
          "draft",
          "permission",
          "finished",
        ].includes(
          stage
        ) &&
          extraction && (
          <WorkflowBlock
            number="04"
            title="Décision"
            description="À partir des informations extraites, décidez ce que le workflow devrait faire."
          >

            <Field
              label="Action proposée"
              value={
                proposedAction
              }
              onChange={
                setProposedAction
              }
              placeholder="Ex. vérifier le paiement et préparer une réponse au client."
            />

            <div className="mt-5">

              <Field
                label="Pourquoi cette action ?"
                value={
                  actionReason
                }
                onChange={
                  setActionReason
                }
                placeholder="Expliquez pourquoi cette action est adaptée à la demande."
              />

            </div>

            <button
              type="button"
              disabled={
                !proposedAction.trim() ||
                !actionReason.trim()
              }
              onClick={
                validateDecision
              }
              className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              Valider la décision →
            </button>

          </WorkflowBlock>
        )}

        {/* ==================================================
            5 — IA / BROUILLON
        ================================================== */}

        {[
          "decision",
          "draft",
          "permission",
          "finished",
        ].includes(
          stage
        ) &&
          selectedEmail && (
          <WorkflowBlock
            number="05"
            title="Production IA"
            description="Donnez uniquement les faits autorisés à Ollama pour générer un brouillon."
          >

            <Field
              label="Faits que l'IA a le droit d'utiliser"
              value={facts}
              onChange={
                setFacts
              }
              placeholder="Ex. Le client signale un double paiement de 89 €. La commande est CMD-4821. Aucun remboursement n'a encore été confirmé."
              rows={6}
            />

            {!generatedEmail && (
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
                  ? "Génération..."
                  : "Générer le brouillon →"}
              </button>
            )}

            {generationError && (
              <div className="mt-5 rounded-2xl bg-slate-100 p-5 text-sm text-slate-600">
                {
                  generationError
                }
              </div>
            )}

            {generatedEmail && (
              <div className="mt-6">

                <div className="grid gap-3 sm:grid-cols-3">

                  <DataCard
                    label="Risque"
                    value={
                      generatedEmail.riskLevel
                    }
                  />

                  <DataCard
                    label="Confiance"
                    value={`${generatedEmail.confidence}%`}
                  />

                  <DataCard
                    label="Validation"
                    value={
                      generatedEmail.requiresHumanValidation
                        ? "Requise"
                        : "Non requise"
                    }
                  />

                </div>

                <div className="mt-5">

                  <Field
                    label="Brouillon final"
                    value={draft}
                    onChange={
                      setDraft
                    }
                    placeholder="..."
                    rows={9}
                  />

                </div>

              </div>
            )}

          </WorkflowBlock>
        )}

        {/* ==================================================
            6 — PERMISSION
        ================================================== */}

        {[
          "draft",
          "permission",
          "finished",
        ].includes(
          stage
        ) &&
          generatedEmail && (
          <WorkflowBlock
            number="06"
            title="Moteur de permissions"
            description="Décidez si cette action peut continuer automatiquement ou si elle doit être arrêtée."
          >

            <div className="grid gap-3 sm:grid-cols-3">

              {(
                [
                  "AUTO",
                  "VALIDATION",
                  "BLOQUÉ",
                ] as Permission[]
              ).map(
                (item) => (
                  <button
                    key={
                      item
                    }
                    type="button"
                    onClick={() =>
                      setPermission(
                        item
                      )
                    }
                    className={`rounded-2xl border p-5 text-left transition ${
                      permission ===
                      item
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <p className="font-bold">
                      {item}
                    </p>

                    <p
                      className={`mt-2 text-sm leading-6 ${
                        permission ===
                        item
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {item ===
                      "AUTO"
                        ? "Le workflow peut continuer seul."
                        : item ===
                            "VALIDATION"
                          ? "Une personne doit autoriser l'action."
                          : "L'action ne doit jamais être exécutée."}
                    </p>

                  </button>
                )
              )}

            </div>

            <div className="mt-6">

              <Field
                label="Expliquez votre règle de sécurité"
                value={
                  securityRule
                }
                onChange={
                  setSecurityRule
                }
                placeholder="Ex. toute action liée à un remboursement ou un paiement nécessite une validation humaine."
                rows={5}
              />

            </div>

            <button
              type="button"
              disabled={
                !permission ||
                !securityRule.trim()
              }
              onClick={
                validatePermission
              }
              className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              Appliquer la politique →
            </button>

          </WorkflowBlock>
        )}

        {/* ==================================================
            VALIDATION HUMAINE
        ================================================== */}

        {stage ===
          "permission" &&
          permission ===
            "VALIDATION" && (
          <WorkflowBlock
            number="07"
            title="Validation humaine"
            description="Le workflow est suspendu jusqu'à votre décision."
          >

            <div className="rounded-[24px] bg-slate-950 p-6 text-white">

              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                WORKFLOW SUSPENDU
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Une personne doit
                décider
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Aucune action réelle
                n&apos;est exécutée tant
                que la validation
                n&apos;a pas été donnée.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() =>
                    validateHumanDecision(
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
                    validateHumanDecision(
                      "rejected"
                    )
                  }
                  className="rounded-2xl border border-slate-700 px-5 py-4 font-semibold text-white"
                >
                  ✕ Refuser
                </button>

              </div>

            </div>

          </WorkflowBlock>
        )}

        {/* ==================================================
            RÉSULTAT FINAL
        ================================================== */}

        {stage ===
          "finished" && (
          <WorkflowBlock
            number="✓"
            title="Workflow terminé"
            description="Voici ce que votre système a réellement décidé."
          >

            <div className="rounded-[26px] bg-slate-950 p-7 text-white">

              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                RÉSULTAT FINAL
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                {permission ===
                "BLOQUÉ"
                  ? "Action bloquée"
                  : permission ===
                      "VALIDATION" &&
                    humanDecision ===
                      "rejected"
                    ? "Action refusée"
                    : permission ===
                        "VALIDATION"
                      ? "Action approuvée"
                      : "Action autorisée"}
              </h3>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <DarkDataCard
                  label="Email"
                  value={
                    selectedEmail?.subject ||
                    ""
                  }
                />

                <DarkDataCard
                  label="Classification"
                  value={`${category} · ${priority}`}
                />

                <DarkDataCard
                  label="Action"
                  value={
                    proposedAction
                  }
                />

                <DarkDataCard
                  label="Permission"
                  value={
                    permission
                  }
                />

              </div>

              <p className="mt-6 text-sm leading-7 text-slate-400">
                Cette simulation n&apos;a
                envoyé aucun email,
                effectué aucun paiement
                et modifié aucune donnée
                réelle.
              </p>

            </div>

          </WorkflowBlock>
        )}

        {/* ==================================================
            HISTORIQUE
        ================================================== */}

        {logs.length >
          0 && (
          <div className="mt-7 rounded-[24px] border border-slate-200 bg-slate-50 p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                  HISTORIQUE
                </p>

                <h3 className="mt-2 font-bold">
                  Journal d&apos;exécution
                </h3>

              </div>

              <span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold shadow-sm">
                {logs.length} événements
              </span>

            </div>

            <div className="mt-5 space-y-2">

              {logs.map(
                (
                  log,
                  index
                ) => (
                  <div
                    key={
                      `${log}-${index}`
                    }
                    className="flex gap-4 rounded-xl bg-white p-4"
                  >

                    <span className="text-xs font-bold text-slate-400">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p className="text-sm text-slate-600">
                      {log}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* ==================================================
            ÉVALUATION
        ================================================== */}

        {readyForEvaluation && (
          <button
            type="button"
            disabled={
              evaluating
            }
            onClick={() =>
              evaluate(
                "Construire et exécuter un workflow IA complet",

                "Assembler réception, classification, extraction IA, décision, génération, moteur de permissions et validation humaine dans un processus cohérent.",

                {
                  Email:
                    selectedEmail?.subject ??
                    "",

                  Classification:
                    category,

                  Priorité:
                    priority,

                  Extraction:
                    JSON.stringify(
                      extraction
                    ),

                  "Action proposée":
                    proposedAction,

                  Justification:
                    actionReason,

                  "Faits utilisés":
                    facts,

                  "Brouillon final":
                    draft ||
                    "Aucun",

                  Permission:
                    permission,

                  "Règle de sécurité":
                    securityRule,

                  "Décision humaine":
                    humanDecision ||
                    "Non nécessaire",

                  Historique:
                    logs.join(
                      " | "
                    ),
                },

                [
                  {
                    name:
                      "Architecture du workflow",

                    maxScore: 20,

                    description:
                      "Les étapes s'enchaînent de manière logique et chacune possède une responsabilité claire.",
                  },

                  {
                    name:
                      "Traitement des données",

                    maxScore: 20,

                    description:
                      "Classification et extraction utilisent correctement les informations du message.",
                  },

                  {
                    name:
                      "Utilisation de l'IA",

                    maxScore: 20,

                    description:
                      "L'IA est utilisée pour comprendre ou générer sans recevoir un pouvoir excessif.",
                  },

                  {
                    name:
                      "Sécurité",

                    maxScore: 20,

                    description:
                      "La permission choisie est proportionnée au risque de l'action.",
                  },

                  {
                    name:
                      "Gestion humaine et erreurs",

                    maxScore: 20,

                    description:
                      "Le workflow sait s'arrêter, demander une validation et conserver une trace compréhensible.",
                  },
                ],

                JSON.stringify({
                  email:
                    selectedEmail,

                  extractionIA:
                    extraction,

                  generationIA:
                    generatedEmail,

                  principe:
                    "Évaluer la cohérence globale du système. Une automatisation réussie n'est pas celle qui automatise tout, mais celle qui sait également quand s'arrêter.",
                })
              )
            }
            className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:opacity-50"
          >
            {evaluating
              ? "Évaluation du workflow..."
              : "Évaluer mon workflow complet /100 →"}
          </button>
        )}

        {/* RESET */}

        {stage ===
          "finished" && (
          <button
            type="button"
            onClick={
              resetWorkflow
            }
            className="mt-3 w-full rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
          >
            Tester un autre email ↻
          </button>
        )}

      </div>

    </section>
  );
}

// ======================================================
// PROGRESSION
// ======================================================

function calculateProgress(
  stage: WorkflowStage
) {
  const values:
    Record<
      WorkflowStage,
      number
    > = {
    idle: 0,
    email: 15,
    classified: 30,
    extracted: 45,
    decision: 60,
    draft: 75,
    permission: 90,
    finished: 100,
  };

  return values[stage];
}

// ======================================================
// WORKFLOW BLOCK
// ======================================================

function WorkflowBlock({
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
// PIPELINE
// ======================================================

function PipelineStep({
  number,
  title,
  done,
}: {
  number: string;
  title: string;
  done: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center transition ${
        done
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-slate-50 text-slate-400"
      }`}
    >

      <p className="text-xs font-bold">
        {done
          ? "✓"
          : number}
      </p>

      <p className="mt-1 text-xs font-semibold">
        {title}
      </p>

    </div>
  );
}

// ======================================================
// CHOICE
// ======================================================

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
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
  onChange:
    (value: string) =>
      void;
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
// DATA CARD
// ======================================================

function DataCard({
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
// DARK DATA CARD
// ======================================================

function DarkDataCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">

      <p className="text-xs font-semibold tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>

    </div>
  );
}