import "server-only";

import {
  promptsProjectFields,
  type FundamentalsProjectId,
} from "@/lib/training/projects/catalog";

export type ProjectFieldDefinition = {
  key: string;
  label: string;
  minLength: number;
  maxLength: number;
};

export type ProjectRubricCriterion = {
  id: string;
  label: string;
  description: string;
  maxScore: number;
};

export type ProjectDefinition = {
  version: string;
  instructions: string;
  passingScore: number;
  fields: readonly ProjectFieldDefinition[];
  rubric: readonly ProjectRubricCriterion[];
};

const commonLimits = { minLength: 30, maxLength: 6000 };
const field = (key: string, label: string, minLength = 30) => ({
  key,
  label,
  minLength,
  maxLength: commonLimits.maxLength,
});

export const projectDefinitions: Record<FundamentalsProjectId, ProjectDefinition> = {
  "prompts-05-project": {
    version: "2026-08-v1",
    instructions:
      "Analyser le besoin de la salle de sport, proposer un service IA réaliste, rédiger un prompt exploitable et présenter une sortie issue d’un test.",
    passingScore: 70,
    fields: promptsProjectFields,
    rubric: [
      { id: "discovery", label: "Compréhension du besoin", description: "Les contraintes, utilisateurs et objectifs sont identifiés sans inventer.", maxScore: 20 },
      { id: "solution", label: "Solution", description: "La solution répond au besoin et reste réalisable.", maxScore: 20 },
      { id: "prompt", label: "Prompt", description: "Le prompt cadre rôle, contexte, tâche, format et limites.", maxScore: 25 },
      { id: "output", label: "Sortie testée", description: "La sortie démontre un test pertinent et exploitable.", maxScore: 20 },
      { id: "reliability", label: "Fiabilité", description: "Les incertitudes, contrôles humains et limites sont traités.", maxScore: 15 },
    ],
  },
  "quotidien-05-mission": {
    version: "2026-08-v1",
    instructions:
      "Produire un rapport décisionnel pour le déploiement d’un assistant IA interne dans une entreprise internationale de 80 salariés avec un budget initial de 30 000 euros.",
    passingScore: 70,
    fields: [
      field("objectif", "Objectif"), field("contraintes", "Contraintes"),
      field("manquantes", "Informations manquantes"), field("besoins", "Besoins utilisateurs"),
      field("options", "Options"), field("criteres", "Critères de décision"),
      field("risques", "Risques"), field("budget", "Budget"),
      field("recommandation", "Recommandation", 60), field("plan", "Plan d’action", 70),
    ],
    rubric: [
      { id: "framing", label: "Cadrage", description: "Le problème, les besoins et les inconnues sont clairement distingués.", maxScore: 20 },
      { id: "options", label: "Options", description: "Plusieurs options sont comparées avec des critères pertinents.", maxScore: 20 },
      { id: "risk", label: "Sécurité et risques", description: "Données, accès, adoption et incertitudes sont traités.", maxScore: 20 },
      { id: "decision", label: "Décision", description: "Budget et recommandation sont cohérents et argumentés.", maxScore: 20 },
      { id: "action", label: "Plan d’action", description: "Les étapes, validations et priorités sont concrètes.", maxScore: 20 },
    ],
  },
  "fichiers-06-projet": {
    version: "2026-08-v1",
    instructions:
      "Concevoir un outil personnel fondé sur un fichier réel, capable de répondre à des questions utiles et d’être mis à jour de façon fiable.",
    passingScore: 70,
    fields: [
      field("project_name", "Nom du projet", 5), field("need", "Besoin réel", 50),
      field("questions", "Questions utiles", 60), field("reliability_rules", "Règles de fiabilité", 60),
      field("dashboard_plan", "Plan du tableau de bord", 60), field("reuse_routine", "Routine de réutilisation", 50),
      field("dataset_context", "Contexte du fichier", 20),
    ],
    rubric: [
      { id: "utility", label: "Utilité", description: "Le besoin est concret et relié au fichier utilisé.", maxScore: 20 },
      { id: "questions", label: "Questions", description: "Les questions produisent des décisions ou actions utiles.", maxScore: 20 },
      { id: "reliability", label: "Fiabilité", description: "Valeurs manquantes, incohérences et vérifications sont prévues.", maxScore: 20 },
      { id: "dashboard", label: "Restitution", description: "Le tableau de bord est lisible, ciblé et non trompeur.", maxScore: 20 },
      { id: "reuse", label: "Réutilisation", description: "La mise à jour et le contrôle régulier sont décrits.", maxScore: 20 },
    ],
  },
  "automation-07-project": {
    version: "2026-08-v1",
    instructions:
      "Concevoir, configurer et tester un assistant métier qui comprend une demande, choisit une action et respecte une politique de sécurité.",
    passingScore: 70,
    fields: [
      field("project_name", "Nom du projet", 5), field("target_user", "Utilisateur cible", 20),
      field("problem", "Problème", 60), field("trigger", "Déclencheur", 20),
      field("categories", "Catégories", 20), field("data_to_extract", "Données à extraire", 30),
      field("actions", "Actions et permissions", 20), field("confidence_policy", "Politique de confiance", 30),
      field("fallback", "Gestion de l’incertitude", 40), field("value", "Valeur utilisateur", 40),
      field("test_evidence", "Preuve de test", 80), field("execution_log", "Journal d’exécution", 30),
    ],
    rubric: [
      { id: "value", label: "Problème et valeur", description: "Le besoin et le bénéfice attendu sont concrets.", maxScore: 20 },
      { id: "architecture", label: "Architecture", description: "Déclencheur, compréhension, données et actions sont cohérents.", maxScore: 20 },
      { id: "ai", label: "Usage de l’IA", description: "L’IA est utilisée là où elle apporte une valeur justifiée.", maxScore: 20 },
      { id: "security", label: "Sécurité", description: "Permissions, seuils et validation humaine limitent les risques.", maxScore: 25 },
      { id: "testing", label: "Test et traçabilité", description: "Un test réel, ses résultats et les décisions sont traçables.", maxScore: 15 },
    ],
  },
};
