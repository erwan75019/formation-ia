import { moduleLessonIds } from "@/lib/training/catalog";

export const fundamentalsProjectIds = [
  "prompts-05-project",
  "quotidien-05-mission",
  "fichiers-06-projet",
  "automation-07-project",
] as const;

export type FundamentalsProjectId = (typeof fundamentalsProjectIds)[number];

export type ProjectWork = Record<string, string>;

export type PublicProjectField = {
  key: string;
  label: string;
  minLength: number;
  maxLength: number;
};

export const promptsProjectFields = [
  { key: "interview", label: "Entretien avec le client", minLength: 120, maxLength: 6000 },
  { key: "solution", label: "Solution proposée", minLength: 100, maxLength: 6000 },
  { key: "prompt", label: "Prompt final", minLength: 120, maxLength: 6000 },
  { key: "output", label: "Sortie testée", minLength: 80, maxLength: 6000 },
] as const satisfies readonly PublicProjectField[];

export const projectPublicDefinitions: Record<
  FundamentalsProjectId,
  { title: string; criteria: readonly string[] }
> = {
  "prompts-05-project": {
    title: "Concevoir un service IA de bout en bout",
    criteria: [
      "Compréhension du besoin client",
      "Pertinence de la solution proposée",
      "Qualité et robustesse du prompt",
      "Qualité de la sortie testée",
      "Fiabilité et limites explicites",
    ],
  },
  "quotidien-05-mission": {
    title: "Recommander une solution à la direction",
    criteria: [
      "Cadrage du problème et des besoins",
      "Comparaison argumentée des options",
      "Sécurité, risques et informations manquantes",
      "Cohérence du budget et de la recommandation",
      "Plan d’action concret",
    ],
  },
  "fichiers-06-projet": {
    title: "Concevoir un outil personnel réutilisable",
    criteria: [
      "Utilité réelle du projet",
      "Questions utiles et actionnables",
      "Règles de fiabilité",
      "Restitution claire des informations",
      "Méthode de mise à jour et de réutilisation",
    ],
  },
  "automation-07-project": {
    title: "Construire un assistant métier IA",
    criteria: [
      "Problème métier et valeur apportée",
      "Architecture de l’automatisation",
      "Usage pertinent de l’IA",
      "Permissions, sécurité et gestion de l’incertitude",
      "Test, traçabilité et robustesse",
    ],
  },
};

export function isFundamentalsProjectId(
  value: unknown
): value is FundamentalsProjectId {
  return (
    typeof value === "string" &&
    (fundamentalsProjectIds as readonly string[]).includes(value)
  );
}

export const projectPrerequisites: Record<
  FundamentalsProjectId,
  readonly string[]
> = {
  "prompts-05-project": moduleLessonIds[2].slice(0, -1),
  "quotidien-05-mission": moduleLessonIds[3].slice(0, -1),
  "fichiers-06-projet": moduleLessonIds[4].slice(0, -1),
  "automation-07-project": moduleLessonIds[5].slice(0, -1),
};
