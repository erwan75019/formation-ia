export type TrainingPlan = "fondamentaux" | "complet";

export const webLessonCatalog = [
  { id: "web-01-projet-vscode", number: "01", title: "Découvrir PropertyMatch et préparer VS Code" },
  { id: "web-02-nextjs", number: "02", title: "Créer et lancer le projet Next.js" },
  { id: "web-03-structure", number: "03", title: "Construire la structure de la page d’accueil" },
  { id: "web-04-tailwind", number: "04", title: "Reproduire le design avec Tailwind" },
  { id: "web-05-donnees", number: "05", title: "Créer les données immobilières avec TypeScript" },
  { id: "web-06-composants", number: "06", title: "Découper le site en composants React" },
  { id: "web-07-cartes", number: "07", title: "Afficher les cartes des logements" },
  { id: "web-08-recherche", number: "08", title: "Ajouter la recherche, les filtres et les paramètres d’URL" },
  { id: "web-09-matching", number: "09", title: "Calculer et expliquer la compatibilité" },
  { id: "web-10-fiches", number: "10", title: "Créer les fiches détaillées des logements" },
  { id: "web-11-favoris", number: "11", title: "Enregistrer les favoris dans le navigateur" },
  { id: "web-12-publication", number: "12", title: "Finaliser, tester et publier sur Vercel" },
] as const;

export const moduleLessonIds = {
  1: [
    "chatgpt-01-intro",
    "chatgpt-02-interface",
    "chatgpt-03-prompt",
    "chatgpt-04-contexte",
    "chatgpt-05-format",
  ],
  2: [
    "prompts-01-structure",
    "prompts-02-role",
    "prompts-03-templates",
    "prompts-04-iteration",
    "prompts-05-project",
  ],
  3: [
    "quotidien-01-travail",
    "quotidien-02-etudes",
    "quotidien-03-recherche",
    "quotidien-04-documents",
    "quotidien-05-mission",
  ],
  4: [
    "fichiers-01-comprendre",
    "fichiers-02-questions",
    "fichiers-03-organiser",
    "fichiers-04-dashboard",
    "fichiers-05-decisions",
    "fichiers-06-projet",
  ],
  5: [
    "automation-01-logic",
    "automation-02-tri",
    "automation-03-extraction",
    "automation-04-email",
    "automation-05-control",
    "automation-06-workflow",
    "automation-07-project",
  ],
  6: webLessonCatalog.map((lesson) => lesson.id),
  7: [
    "api-01-intro",
    "api-02-http",
    "api-03-requests",
    "api-04-status",
    "api-05-keys-env",
    "api-06-ai-call",
    "api-07-project",
    "api-08-calendar",
    "api-09-security",
  ],
  8: [
    "supabase-01-database",
    "supabase-02-tables",
    "supabase-03-crud",
    "supabase-04-relations",
    "supabase-05-auth",
    "supabase-06-rls",
    "supabase-07-project",
  ],
  9: [
    "saas-01-architecture",
    "saas-02-front-back",
    "saas-03-auth",
    "saas-04-database",
    "saas-05-ai",
    "saas-06-security",
    "saas-07-project",
  ],
  10: [
    "agents-01-agent-vs-chatbot",
    "agents-02-objective",
    "agents-03-tools",
    "agents-04-tool-calling",
    "agents-05-loop",
    "agents-06-memory-state",
    "agents-07-project",
  ],
  11: [
    "rag-01-intro",
    "rag-02-chunks",
    "rag-03-embeddings",
    "rag-04-semantic-search",
    "rag-05-vector-db",
    "rag-06-pipeline",
    "rag-07-project",
  ],
  12: [
    "final-01-spec",
    "final-02-architecture",
    "final-03-data-security",
    "final-04-ai-features",
    "final-05-backend",
    "final-06-production",
    "final-07-project",
  ],
} as const;

export type TrainingModuleNumber = keyof typeof moduleLessonIds;
export type OfficialLessonId =
  (typeof moduleLessonIds)[TrainingModuleNumber][number];
export type FundamentalsLessonId =
  (typeof moduleLessonIds)[1 | 2 | 3 | 4 | 5][number];

type TrainingModule = {
  number: TrainingModuleNumber;
  title: string;
  description: string;
  route: string;
  lessonIds: readonly OfficialLessonId[];
};

export const trainingModules = [
  {
    number: 1,
    title: "Découvrir ChatGPT",
    description: "Comprendre ChatGPT et apprendre à bien l'utiliser.",
    route: "/formation/chatgpt",
    lessonIds: moduleLessonIds[1],
  },
  {
    number: 2,
    title: "Maîtriser les prompts",
    description: "Apprendre à communiquer efficacement avec une IA.",
    route: "/formation/prompts",
    lessonIds: moduleLessonIds[2],
  },
  {
    number: 3,
    title: "ChatGPT au quotidien",
    description: "Travail, études, recherche et organisation.",
    route: "/formation/quotidien",
    lessonIds: moduleLessonIds[3],
  },
  {
    number: 4,
    title: "Travailler avec ses fichiers grâce à l’IA",
    description:
      "Comprendre, organiser et transformer ses informations grâce à l’IA.",
    route: "/formation/comprendre-ia",
    lessonIds: moduleLessonIds[4],
  },
  {
    number: 5,
    title: "Automatiser son travail avec l'IA",
    description:
      "Créer des automatisations utiles pour gagner du temps au quotidien.",
    route: "/formation/automatisation",
    lessonIds: moduleLessonIds[5],
  },
  {
    number: 6,
    title: "Créer un site web de A à Z",
    description:
      "Construire PropertyMatch de zéro dans VS Code, le faire fonctionner localement puis le publier sur Internet.",
    route: "/formation/site-web",
    lessonIds: moduleLessonIds[6],
  },
  {
    number: 7,
    title: "Créer sa première application web",
    description:
      "Construire une application utile avec comptes, données et dashboard.",
    route: "/formation/api-ia",
    lessonIds: moduleLessonIds[7],
  },
  {
    number: 8,
    title: "Créer et lancer un SaaS IA",
    description:
      "Transformer une idée en produit IA utilisable et prêt à être proposé.",
    route: "/formation/supabase",
    lessonIds: moduleLessonIds[8],
  },
  {
    number: 9,
    title: "Construire des agents IA",
    description:
      "Créer des agents capables de raisonner, utiliser des outils et accomplir des tâches.",
    route: "/formation/saas-ia",
    lessonIds: moduleLessonIds[9],
  },
  {
    number: 10,
    title: "Connecter et automatiser ses outils",
    description:
      "Faire travailler ensemble emails, données, applications et IA dans des workflows avancés.",
    route: "/formation/agents-ia",
    lessonIds: moduleLessonIds[10],
  },
  {
    number: 11,
    title: "Construire des systèmes IA professionnels",
    description:
      "Concevoir des systèmes IA robustes, sécurisés et adaptés à une vraie organisation.",
    route: "/formation/rag",
    lessonIds: moduleLessonIds[11],
  },
  {
    number: 12,
    title: "Créer et lancer son produit IA",
    description:
      "Construire, tester, sécuriser et présenter un produit IA complet de A à Z.",
    route: "/formation/projet-final",
    lessonIds: moduleLessonIds[12],
  },
] as const satisfies readonly TrainingModule[];

export const planModuleLimits: Record<TrainingPlan, number> = {
  fondamentaux: 5,
  complet: 12,
};

export function getNextTrainingModuleRoute(moduleNumber: number) {
  const index = trainingModules.findIndex((module) => module.number === moduleNumber);
  return index >= 0 ? trainingModules[index + 1]?.route ?? null : null;
}

export const planLessonIds = {
  fondamentaux: [
    ...moduleLessonIds[1],
    ...moduleLessonIds[2],
    ...moduleLessonIds[3],
    ...moduleLessonIds[4],
    ...moduleLessonIds[5],
  ],
  complet: trainingModules.flatMap((module) => [...module.lessonIds]),
} satisfies Record<TrainingPlan, OfficialLessonId[]>;

export const planLessonTotals: Record<TrainingPlan, number> = {
  fondamentaux: planLessonIds.fondamentaux.length,
  complet: planLessonIds.complet.length,
};

export type LessonCompletion = {
  lesson_id: string;
  completed: boolean | null;
  completed_at: string | null;
};

export function isValidLessonCompletion(
  progress: LessonCompletion,
  lessonId: string = progress.lesson_id
) {
  return (
    progress.lesson_id === lessonId &&
    progress.completed === true &&
    typeof progress.completed_at === "string" &&
    progress.completed_at.length > 0
  );
}

export function getPreviousOfficialLessonId(
  lessonId: string
): OfficialLessonId | null {
  const index = (planLessonIds.complet as readonly string[]).indexOf(lessonId);
  return index > 0 ? planLessonIds.complet[index - 1] : null;
}
