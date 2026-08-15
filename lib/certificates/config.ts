import "server-only";

export const certificateTypes = ["fondamentaux", "complet"] as const;

export type CertificateType = (typeof certificateTypes)[number];

const fondamentauxLessonIds = [
  "chatgpt-01-intro",
  "chatgpt-02-interface",
  "chatgpt-03-prompt",
  "chatgpt-04-contexte",
  "chatgpt-05-format",
  "prompts-01-structure",
  "prompts-02-role",
  "prompts-03-templates",
  "prompts-04-iteration",
  "prompts-05-project",
  "quotidien-01-travail",
  "quotidien-02-etudes",
  "quotidien-03-recherche",
  "quotidien-04-documents",
  "quotidien-05-mission",
  "fichiers-01-comprendre",
  "fichiers-02-questions",
  "fichiers-03-organiser",
  "fichiers-04-dashboard",
  "fichiers-05-decisions",
  "fichiers-06-projet",
  "automation-01-logic",
  "automation-02-tri",
  "automation-03-extraction",
  "automation-04-email",
  "automation-05-control",
  "automation-06-workflow",
  "automation-07-project",
] as const;

const advancedLessonIds = [
  "web-01-fonctionnement",
  "web-02-environnement",
  "web-03-html-jsx",
  "web-04-css-tailwind",
  "web-05-javascript",
  "web-06-react-components",
  "web-07-react-state",
  "web-08-nextjs",
  "web-09-engine",
  "web-10-application",
  "web-11-favoris",
  "web-12-matching",
  "web-13-navigation",
  "web-14-premium-home",
  "web-15-premium-results",
  "web-16-premium-property",
  "web-17-product-pages",
  "web-18-responsive",
  "web-19-tests-git",
  "web-20-publication",
  "api-01-intro",
  "api-02-http",
  "api-03-requests",
  "api-04-response-json",
  "api-05-auth",
  "api-06-ai",
  "api-07-project",
  "supabase-01-database",
  "supabase-02-tables",
  "supabase-03-crud",
  "supabase-04-relations",
  "supabase-05-auth",
  "supabase-06-rls",
  "supabase-07-project",
  "saas-01-architecture",
  "saas-02-front-back",
  "saas-03-auth",
  "saas-04-database",
  "saas-05-ai",
  "saas-06-security",
  "saas-07-project",
  "agents-01-agent-vs-chatbot",
  "agents-02-objective",
  "agents-03-tools",
  "agents-04-tool-calling",
  "agents-05-loop",
  "agents-06-memory-state",
  "agents-07-project",
  "rag-01-intro",
  "rag-02-chunks",
  "rag-03-embeddings",
  "rag-04-semantic-search",
  "rag-05-vector-db",
  "rag-06-pipeline",
  "rag-07-project",
  "final-01-spec",
  "final-02-architecture",
  "final-03-data-security",
  "final-04-ai-features",
  "final-05-backend",
  "final-06-production",
  "final-07-project",
] as const;

export const certificateDefinitions = {
  fondamentaux: {
    title: "Certificat de maîtrise",
    name: "Fondamentaux et automatisation en intelligence artificielle",
    description:
      "a validé les compétences fondamentales nécessaires à l’utilisation efficace des outils d’intelligence artificielle et à l’automatisation de tâches.",
    requiredPlan: ["fondamentaux", "complet"] as const,
    lessonIds: fondamentauxLessonIds,
  },
  complet: {
    title: "Certificat de réussite",
    name: "Conception d’applications et de systèmes d’intelligence artificielle",
    description:
      "a validé les compétences nécessaires à la conception, au développement et au déploiement d’applications et de systèmes fondés sur l’intelligence artificielle.",
    requiredPlan: ["complet"] as const,
    lessonIds: [...fondamentauxLessonIds, ...advancedLessonIds],
  },
} satisfies Record<
  CertificateType,
  {
    title: string;
    name: string;
    description: string;
    requiredPlan: readonly ("fondamentaux" | "complet")[];
    lessonIds: readonly string[];
  }
>;

export function isCertificateType(value: unknown): value is CertificateType {
  return (
    typeof value === "string" &&
    certificateTypes.includes(value as CertificateType)
  );
}

export function hasCertificateAccess(
  type: CertificateType,
  plan: unknown,
  subscriptionStatus: unknown
) {
  const hasActiveSubscription =
    subscriptionStatus === "active" || subscriptionStatus === "trialing";

  return (
    hasActiveSubscription &&
    certificateDefinitions[type].requiredPlan.some(
      (requiredPlan) => requiredPlan === plan
    )
  );
}
