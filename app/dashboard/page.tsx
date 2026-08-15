import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

// ======================================================
// TYPES
// ======================================================

type Plan = "fondamentaux" | "complet";

type ModuleConfig = {
  number: number;
  title: string;
  description: string;
  route: string;
  lessonIds: string[];
};

// ======================================================
// MODULES
// ======================================================

const modulesConfig: ModuleConfig[] = [
  {
    number: 1,
    title: "Découvrir ChatGPT",
    description:
      "Comprendre ChatGPT et apprendre à bien l'utiliser.",
    route: "/formation/chatgpt",
    lessonIds: [
      "chatgpt-01-intro",
      "chatgpt-02-interface",
      "chatgpt-03-prompt",
      "chatgpt-04-contexte",
      "chatgpt-05-format",
    ],
  },

  {
    number: 2,
    title: "Maîtriser les prompts",
    description:
      "Apprendre à communiquer efficacement avec une IA.",
    route: "/formation/prompts",
    lessonIds: [
      "prompts-01-structure",
      "prompts-02-role",
      "prompts-03-templates",
      "prompts-04-iteration",
      "prompts-05-project",
    ],
  },

  {
    number: 3,
    title: "ChatGPT au quotidien",
    description:
      "Travail, études, recherche et organisation.",
    route: "/formation/quotidien",
    lessonIds: [
      "quotidien-01-travail",
      "quotidien-02-etudes",
      "quotidien-03-recherche",
      "quotidien-04-documents",
      "quotidien-05-mission",
    ],
  },

  {
    number: 4,
    title: "Travailler avec ses fichiers grâce à l’IA",
    description:
      "Comprendre, organiser et transformer ses informations grâce à l’IA.",
    route: "/formation/comprendre-ia",
    lessonIds: [
      "ia-01-llm",
      "ia-02-tokens",
      "ia-03-contexte",
      "ia-04-entrainement",
      "ia-05-hallucinations",
    ],
  },

  {
    number: 5,
    title: "Automatiser son travail avec l'IA",
    description:
      "Créer des automatisations utiles pour gagner du temps au quotidien.",
    route: "/formation/automatisation",
    lessonIds: [
      "automation-01-logic",
      "automation-02-tri",
      "automation-03-extraction",
      "automation-04-email",
      "automation-05-control",
      "automation-06-workflow",
      "automation-07-project",
    ],
  },

  // ====================================================
  // MODULE 06 — NOUVELLE VERSION PREMIUM
  // ====================================================

  {
    number: 6,
    title: "Créer un site web de A à Z",
    description:
      "Construire PropertyMatch de zéro dans VS Code, le faire fonctionner localement puis le publier sur Internet.",
    route: "/formation/python",
    lessonIds: [
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
      "web-11-production",
      "web-12-publication",
    ],
  },

  {
    number: 7,
    title: "Créer sa première application web",
    description:
      "Construire une application utile avec comptes, données et dashboard.",
    route: "/formation/api-ia",
    lessonIds: [
      "api-01-intro",
      "api-02-http",
      "api-03-requests",
      "api-04-response-json",
      "api-05-auth",
      "api-06-ai",
      "api-07-project",
    ],
  },

  {
    number: 8,
    title: "Créer et lancer un SaaS IA",
    description:
      "Transformer une idée en produit IA utilisable et prêt à être proposé.",
    route: "/formation/supabase",
    lessonIds: [
      "supabase-01-database",
      "supabase-02-tables",
      "supabase-03-crud",
      "supabase-04-relations",
      "supabase-05-auth",
      "supabase-06-rls",
      "supabase-07-project",
    ],
  },

  {
    number: 9,
    title: "Construire des agents IA",
    description:
      "Créer des agents capables de raisonner, utiliser des outils et accomplir des tâches.",
    route: "/formation/saas-ia",
    lessonIds: [
      "saas-01-architecture",
      "saas-02-front-back",
      "saas-03-auth",
      "saas-04-database",
      "saas-05-ai",
      "saas-06-security",
      "saas-07-project",
    ],
  },

  {
    number: 10,
    title: "Connecter et automatiser ses outils",
    description:
      "Faire travailler ensemble emails, données, applications et IA dans des workflows avancés.",
    route: "/formation/agents-ia",
    lessonIds: [
      "agents-01-agent-vs-chatbot",
      "agents-02-objective",
      "agents-03-tools",
      "agents-04-tool-calling",
      "agents-05-loop",
      "agents-06-memory-state",
      "agents-07-project",
    ],
  },

  {
    number: 11,
    title: "Construire des systèmes IA professionnels",
    description:
      "Concevoir des systèmes IA robustes, sécurisés et adaptés à une vraie organisation.",
    route: "/formation/rag",
    lessonIds: [
      "rag-01-intro",
      "rag-02-chunks",
      "rag-03-embeddings",
      "rag-04-semantic-search",
      "rag-05-vector-db",
      "rag-06-pipeline",
      "rag-07-project",
    ],
  },

  {
    number: 12,
    title: "Créer et lancer son produit IA",
    description:
      "Construire, tester, sécuriser et présenter un produit IA complet de A à Z.",
    route: "/formation/projet-final",
    lessonIds: [
      "final-01-spec",
      "final-02-architecture",
      "final-03-data-security",
      "final-04-ai-features",
      "final-05-backend",
      "final-06-production",
      "final-07-project",
    ],
  },
];

// ======================================================
// PLAN → MODULE MAXIMUM
// ======================================================

const planLimits: Record<Plan, number> = {
  fondamentaux: 5,
  complet: 12,
};

const planLabels: Record<Plan, string> = {
  fondamentaux: "Fondamentaux",
  complet: "Parcours complet",
};

// ======================================================
// PAGE
// ======================================================

export default async function Dashboard() {
  const supabase = await createClient();

  // ======================================================
  // UTILISATEUR
  // ======================================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // ======================================================
  // PROFIL / OFFRE
  // ======================================================

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      `
        first_name,
        plan,
        subscription_status
      `
    )
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(
      "Erreur récupération profil :",
      profileError
    );
  }

  const rawPlan = profile?.plan;

  const subscriptionStatus =
    profile?.subscription_status ??
    "inactive";

  const plan: Plan | null =
    rawPlan === "fondamentaux" ||
    rawPlan === "complet"
      ? rawPlan
      : null;

  const hasActiveSubscription =
    subscriptionStatus === "active" ||
    subscriptionStatus === "trialing";

  const maxAccessibleModule =
    hasActiveSubscription && plan
      ? planLimits[plan]
      : 0;

  const planLabel = plan
    ? planLabels[plan]
    : "Aucune offre active";

  // ======================================================
  // PROGRESSION
  // ======================================================

  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select(
      "lesson_id, completed, score"
    )
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const progress =
    progressData ?? [];

  // ======================================================
  // COMPATIBILITÉ ANCIEN QUIZ
  // ======================================================

  const legacyPromptQuiz =
    progress.find(
      (item) =>
        item.lesson_id ===
          "chatgpt-prompt-01" &&
        item.completed
    );

  // ======================================================
  // LEÇONS TERMINÉES
  // ======================================================

  const completedLessonIds =
    new Set(
      progress
        .filter(
          (item) =>
            item.completed
        )
        .map(
          (item) =>
            item.lesson_id
        )
    );

  if (legacyPromptQuiz) {
    completedLessonIds.add(
      "chatgpt-03-prompt"
    );
  }

  // ======================================================
  // CALCUL DES MODULES
  // ======================================================

  const moduleStates =
    modulesConfig.map(
      (module, index) => {
        const completedCount =
          module.lessonIds.filter(
            (lessonId) =>
              completedLessonIds.has(
                lessonId
              )
          ).length;

        const completed =
          completedCount ===
          module.lessonIds.length;

        const progressPercent =
          Math.round(
            (completedCount /
              module.lessonIds
                .length) *
              100
          );

        const previousModule =
          index > 0
            ? modulesConfig[
                index - 1
              ]
            : null;

        const previousCompleted =
          previousModule ===
            null ||
          previousModule.lessonIds.every(
            (lessonId) =>
              completedLessonIds.has(
                lessonId
              )
          );

        // ==================================================
        // VERROUILLAGE PAR OFFRE
        // ==================================================

        const planLocked =
          module.number >
          maxAccessibleModule;

        // ==================================================
        // VERROUILLAGE PAR PROGRESSION
        // ==================================================

        const progressionLocked =
          !previousCompleted;

        let status:
          | "Terminé"
          | "En cours"
          | "Disponible"
          | "Verrouillé"
          | "Offre requise";

        if (planLocked) {
          status =
            "Offre requise";
        } else if (completed) {
          status =
            "Terminé";
        } else if (
          progressionLocked
        ) {
          status =
            "Verrouillé";
        } else if (
          completedCount > 0
        ) {
          status =
            "En cours";
        } else {
          status =
            "Disponible";
        }

        // ==================================================
        // PROCHAINE LEÇON DU MODULE
        // ==================================================

        const nextLessonIndex =
          module.lessonIds.findIndex(
            (lessonId) =>
              !completedLessonIds.has(
                lessonId
              )
          );

        const nextLessonNumber =
          nextLessonIndex === -1
            ? String(
                module.lessonIds
                  .length
              ).padStart(
                2,
                "0"
              )
            : String(
                nextLessonIndex +
                  1
              ).padStart(
                2,
                "0"
              );

        return {
          ...module,
          completedCount,
          completed,
          progressPercent,
          status,
          planLocked,
          progressionLocked,
          nextLessonNumber,
        };
      }
    );

  // ======================================================
  // VALIDATIONS
  // ======================================================

  const allValidationLessons =
    modulesConfig.flatMap(
      (module) =>
        module.lessonIds
    );

  const successfulValidationIds =
    new Set<string>();

  progress.forEach(
    (item) => {
      if (
        item.completed &&
        item.score !== null &&
        item.score >= 70 &&
        allValidationLessons.includes(
          item.lesson_id
        )
      ) {
        successfulValidationIds.add(
          item.lesson_id
        );
      }
    }
  );

  if (
    legacyPromptQuiz &&
    legacyPromptQuiz.score !==
      null &&
    legacyPromptQuiz.score >= 70
  ) {
    successfulValidationIds.add(
      "chatgpt-03-prompt"
    );
  }

  // ======================================================
  // SCORE MOYEN
  // ======================================================

  const successfulScores: number[] =
    [];

  successfulValidationIds.forEach(
    (lessonId) => {
      const validation =
        progress.find(
          (item) =>
            item.lesson_id ===
              lessonId &&
            item.score !== null
        );

      if (
        validation?.score !== null &&
        validation?.score !==
          undefined
      ) {
        successfulScores.push(
          validation.score
        );

        return;
      }

      if (
        lessonId ===
          "chatgpt-03-prompt" &&
        legacyPromptQuiz?.score !==
          null &&
        legacyPromptQuiz?.score !==
          undefined
      ) {
        successfulScores.push(
          legacyPromptQuiz.score
        );
      }
    }
  );

  const averageScore =
    successfulScores.length > 0
      ? Math.round(
          successfulScores.reduce(
            (
              total,
              score
            ) =>
              total + score,
            0
          ) /
            successfulScores.length
        )
      : 0;

  // ======================================================
  // PROGRESSION GLOBALE
  // ======================================================

  const totalLessons =
    allValidationLessons.length;

  const totalCompletedLessons =
    allValidationLessons.filter(
      (lessonId) =>
        completedLessonIds.has(
          lessonId
        )
    ).length;

  const globalProgress =
    totalLessons > 0
      ? Math.round(
          (totalCompletedLessons /
            totalLessons) *
            100
        )
      : 0;

  // ======================================================
  // MODULE ACTUEL
  // ======================================================

  const currentModule =
    moduleStates.find(
      (module) =>
        !module.completed &&
        !module.planLocked &&
        !module.progressionLocked
    );

  const formationCompleted =
    moduleStates.every(
      (module) =>
        module.completed
    );

  // ======================================================
  // PROGRESSION DE L'OFFRE
  // ======================================================

  const accessibleModules =
    moduleStates.filter(
      (module) =>
        module.number <=
        maxAccessibleModule
    );

  const accessibleLessonIds =
    accessibleModules.flatMap(
      (module) =>
        module.lessonIds
    );

  const completedAccessibleLessons =
    accessibleLessonIds.filter(
      (lessonId) =>
        completedLessonIds.has(
          lessonId
        )
    ).length;

  const planProgress =
    accessibleLessonIds.length >
    0
      ? Math.round(
          (completedAccessibleLessons /
            accessibleLessonIds.length) *
            100
        )
      : 0;

  // ======================================================
  // NOM UTILISATEUR
  // ======================================================

  const firstName =
    profile?.first_name?.trim();

  const displayName =
    firstName ||
    user.email
      ?.split("@")[0] ||
    "Utilisateur";

  // ======================================================
  // AFFICHAGE
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      <div className="flex min-h-screen">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 md:flex">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
              AI
            </div>

            <div>

              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-400">
                Espace étudiant
              </p>

            </div>

          </Link>

          {/* ==================================================
              OFFRE
          ================================================== */}

          <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">

            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
              VOTRE OFFRE
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">

              <p className="text-xl font-bold">
                {planLabel}
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  subscriptionStatus ===
                    "active" ||
                  subscriptionStatus ===
                    "trialing"
                    ? "bg-slate-800 text-slate-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {subscriptionStatus ===
                "active"
                  ? "Actif"
                  : subscriptionStatus ===
                      "trialing"
                    ? "Essai"
                    : subscriptionStatus ===
                        "past_due"
                      ? "Paiement requis"
                      : subscriptionStatus ===
                          "canceled"
                        ? "Annulé"
                        : "En attente"}
              </span>

            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Accès aux modules 01 à{" "}
              {String(
                maxAccessibleModule
              ).padStart(
                2,
                "0"
              )}
            </p>

            <div className="mt-5">

              <div className="flex justify-between text-xs text-slate-500">

                <span>
                  Progression offre
                </span>

                <span>
                  {planProgress}%
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: `${planProgress}%`,
                  }}
                />

              </div>

            </div>

            {plan !== "complet" && (
              <Link
                href="/tarifs"
                className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
              >
                Améliorer mon offre →
              </Link>
            )}

          </div>

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <nav className="mt-8 space-y-2">

            <Link
              href="/dashboard"
              className="flex w-full items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white"
            >
              <span>⌂</span>
              Accueil
            </Link>

            <a
              href="#parcours"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
            >
              <span>▣</span>
              Mon parcours
            </a>

            <a
              href="#progression"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
            >
              <span>◒</span>
              Progression
            </a>

            <Link
              href="/projets"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <span>◇</span>
              Mes projets
            </Link>

          </nav>

          <div className="mt-auto pt-8">
            <LogoutButton />
          </div>

        </aside>

        {/* ==================================================
            CONTENU
        ================================================== */}

        <section className="flex-1 px-6 py-8 md:px-12 lg:px-16">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="flex items-center justify-between gap-5">

            <div>

              <p className="text-sm font-medium text-slate-400">
                VOTRE ESPACE DE FORMATION
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Bonjour {displayName} 👋
              </h1>

              <p className="mt-2 text-slate-500">
                {formationCompleted
                  ? "Vous avez terminé l’intégralité du parcours."
                  : "Continuez votre progression en intelligence artificielle."}
              </p>

            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 font-semibold text-white">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

          </header>

          {/* ==================================================
              MODULE ACTUEL
          ================================================== */}

          {formationCompleted ? (

            <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                FORMATION TERMINÉE
              </p>

              <h2 className="mt-5 text-4xl font-bold">
                Parcours terminé 🎓
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Vous avez validé les 12 modules et les{" "}
                {totalLessons} leçons de AI Academy.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm">
                  ✓ 12 modules
                </span>

                <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm">
                  ✓ {totalLessons} leçons
                </span>

                <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm">
                  ✓ Projet final
                </span>

              </div>

            </section>

          ) : currentModule ? (

            <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

                <div className="max-w-2xl">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    MODULE{" "}
                    {String(
                      currentModule.number
                    ).padStart(
                      2,
                      "0"
                    )}
                  </p>

                  <h2 className="mt-5 text-3xl font-semibold md:text-4xl">
                    {currentModule.title}
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-slate-400">
                    {currentModule.description}
                  </p>

                  <div className="mt-7 max-w-lg">

                    <div className="mb-2 flex justify-between text-sm">

                      <span className="text-slate-400">
                        Progression
                      </span>

                      <span>
                        {currentModule.progressPercent}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                          width: `${currentModule.progressPercent}%`,
                        }}
                      />

                    </div>

                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    {currentModule.completedCount} /{" "}
                    {currentModule.lessonIds.length} leçons terminées
                  </p>

                </div>

                <Link
                  href={`${currentModule.route}/${currentModule.nextLessonNumber}`}
                  className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {currentModule.completedCount ===
                  0
                    ? "Commencer →"
                    : "Continuer →"}
                </Link>

              </div>

            </section>

          ) : (

            <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                LIMITE DE VOTRE OFFRE
              </p>

              <h2 className="mt-5 text-3xl font-bold">
                Vous avez terminé tout le contenu disponible avec{" "}
                {planLabel}
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Passez à une offre supérieure pour continuer le parcours.
              </p>

              <Link
                href="/tarifs"
                className="mt-7 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950"
              >
                Voir les offres →
              </Link>

            </section>

          )}

          {/* ==================================================
              STATS
          ================================================== */}

          <div
            id="progression"
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >

            <StatCard
              value={`${globalProgress}%`}
              label="Progression globale"
              detail={`Sur les ${totalLessons} leçons`}
            />

            <StatCard
              value={`${totalCompletedLessons}/${totalLessons}`}
              label="Leçons terminées"
            />

            <StatCard
              value={`${successfulValidationIds.size}/${totalLessons}`}
              label="Validations réussies"
            />

            <StatCard
              value={`${averageScore}%`}
              label="Score moyen"
              detail={
                successfulValidationIds.size >
                0
                  ? `${successfulValidationIds.size} validations`
                  : "Aucune validation"
              }
            />

          </div>

          {/* ==================================================
              PARCOURS
          ================================================== */}

          <section
            id="parcours"
            className="mt-12"
          >

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>

                <p className="text-sm font-medium text-slate-400">
                  VOTRE FORMATION
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Votre parcours
                </h2>

              </div>

              <div className="text-right">

                <p className="text-sm font-semibold">
                  Offre {planLabel}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Modules 01 →{" "}
                  {String(
                    maxAccessibleModule
                  ).padStart(
                    2,
                    "0"
                  )}
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">

              {moduleStates.map(
                (module) => (

                  <ModuleCard
                    key={module.number}
                    number={String(
                      module.number
                    ).padStart(
                      2,
                      "0"
                    )}
                    title={
                      module.title
                    }
                    description={
                      module.description
                    }
                    progress={
                      module.progressPercent
                    }
                    status={
                      module.status
                    }
                    href={
                      module.route
                    }
                    requiredPlan={
                      module.number <= 5
                        ? "Fondamentaux"
                        : "Parcours complet"
                    }
                  />

                )
              )}

            </div>

          </section>

        </section>

      </div>

    </main>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

      {detail && (
        <p className="mt-2 text-xs text-slate-400">
          {detail}
        </p>
      )}

    </div>
  );
}

// ======================================================
// MODULE CARD
// ======================================================

function ModuleCard({
  number,
  title,
  description,
  progress,
  status,
  href,
  requiredPlan,
}: {
  number: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  href: string;
  requiredPlan: string;
}) {
  const planLocked =
    status ===
    "Offre requise";

  const progressionLocked =
    status ===
    "Verrouillé";

  const locked =
    planLocked ||
    progressionLocked;

  const completed =
    status ===
    "Terminé";

  const content = (
    <div
      className={`h-full rounded-3xl border p-6 shadow-sm transition ${
        completed
          ? "border-slate-300 bg-white"
          : planLocked
            ? "border-slate-200 bg-slate-100"
            : "border-slate-200 bg-white"
      } ${
        locked
          ? "opacity-70"
          : "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
            completed
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-900"
          }`}
        >
          {locked
            ? "🔒"
            : completed
              ? "✓"
              : number}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            completed
              ? "bg-slate-950 text-white"
              : status ===
                  "Disponible"
                ? "bg-slate-100 text-slate-700"
                : status ===
                    "En cours"
                  ? "bg-slate-200 text-slate-900"
                  : planLocked
                    ? "bg-slate-200 text-slate-600"
                    : "bg-slate-200 text-slate-500"
          }`}
        >
          {status}
        </span>

      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {planLocked && (
        <div className="mt-5 rounded-xl bg-white p-4">

          <p className="text-xs font-semibold text-slate-400">
            OFFRE NÉCESSAIRE
          </p>

          <p className="mt-1 text-sm font-bold">
            {requiredPlan}
          </p>

        </div>
      )}

      {!locked && (
        <div className="mt-6">

          <div className="mb-2 flex justify-between text-xs text-slate-400">

            <span>
              Progression
            </span>

            <span>
              {progress}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>
      )}

      {planLocked && (
        <Link
          href="/tarifs"
          className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Voir les offres →
        </Link>
      )}

    </div>
  );

  if (locked) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block h-full"
    >
      {content}
    </Link>
  );
}
