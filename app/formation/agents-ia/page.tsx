import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 09 — PRÉREQUIS
// ======================================================

const previousModuleLessons = [
  "saas-01-architecture",
  "saas-02-front-back",
  "saas-03-auth",
  "saas-04-database",
  "saas-05-ai",
  "saas-06-security",
  "saas-07-project",
];

// ======================================================
// MODULE 10 — AGENTS IA
// ======================================================

const lessons = [
  {
    id: "agents-01-agent-vs-chatbot",
    number: "01",
    title: "Agent IA vs chatbot",
    duration: "16 min",
    description:
      "Comprenez ce qui différencie une simple réponse générée d’un système capable d’agir.",
    type: "Fondamentaux",
  },
  {
    id: "agents-02-objective",
    number: "02",
    title: "Objectif et plan d’action",
    duration: "18 min",
    description:
      "Apprenez comment un agent reçoit un objectif et détermine les étapes nécessaires.",
    type: "Raisonnement",
  },
  {
    id: "agents-03-tools",
    number: "03",
    title: "Donner des outils à un agent",
    duration: "22 min",
    description:
      "Découvrez comment un agent peut utiliser une API, une base de données ou une fonction.",
    type: "Outils",
  },
  {
    id: "agents-04-tool-calling",
    number: "04",
    title: "Comprendre le tool calling",
    duration: "24 min",
    description:
      "Apprenez comment un modèle peut demander l’exécution d’un outil avec des arguments structurés.",
    type: "IA + outils",
  },
  {
    id: "agents-05-loop",
    number: "05",
    title: "La boucle agentique",
    duration: "24 min",
    description:
      "Comprenez comment un agent observe un résultat, décide de la suite et peut enchaîner plusieurs actions.",
    type: "Architecture",
  },
  {
    id: "agents-06-memory-state",
    number: "06",
    title: "Mémoire, état et limites",
    duration: "22 min",
    description:
      "Apprenez à conserver le contexte utile et à empêcher un agent de tourner sans contrôle.",
    type: "Sécurité",
  },
  {
    id: "agents-07-project",
    number: "07",
    title: "Mini-projet : construire un agent IA",
    duration: "55 min",
    description:
      "Assemblez objectif, outils, décisions, résultats et mémoire dans une architecture agentique.",
    type: "Mini-projet",
  },
];

export default async function AgentsModulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: progressData, error: progressError } =
    await supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => item.completed)
      .map((item) => item.lesson_id) ?? []
  );

  const previousModuleCompleted =
    previousModuleLessons.every((lessonId) =>
      completedIds.has(lessonId)
    );

  if (!previousModuleCompleted) {
    redirect("/dashboard");
  }

  const lessonStates = lessons.map((lesson, index) => {
    const completed =
      completedIds.has(lesson.id);

    const previousCompleted =
      index === 0 ||
      completedIds.has(
        lessons[index - 1].id
      );

    const status = completed
      ? "done"
      : previousCompleted
      ? "current"
      : "locked";

    return {
      ...lesson,
      status,
    };
  });

  const completedCount =
    lessonStates.filter(
      (lesson) =>
        lesson.status === "done"
    ).length;

  const progress = Math.round(
    (completedCount / lessons.length) * 100
  );

  const moduleCompleted =
    completedCount === lessons.length;

  const nextLesson =
    lessonStates.find(
      (lesson) =>
        lesson.status === "current"
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-80 border-r border-slate-200 bg-white md:block">

          <div className="p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
                AI
              </div>

              <div>
                <p className="font-bold">
                  AI Academy
                </p>

                <p className="text-xs text-slate-400">
                  Module 10
                </p>
              </div>

            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                AGENTS IA
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Passez de l’IA qui répond à l’IA qui agit
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Découvrez comment un modèle peut utiliser des outils,
                observer leurs résultats et enchaîner plusieurs étapes
                pour atteindre un objectif.
              </p>

              <div className="mt-6">

                <div className="mb-2 flex justify-between text-xs text-slate-400">

                  <span>
                    Progression
                  </span>

                  <span>
                    {progress}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {completedCount} / {lessons.length} leçons
                </p>

              </div>

            </div>

          </div>

          <div className="border-t border-slate-100 p-4">

            <div className="space-y-2">

              {lessonStates.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  number={lesson.number}
                  title={lesson.title}
                  duration={lesson.duration}
                  status={lesson.status}
                  href={`/formation/agents-ia/${lesson.number}`}
                />
              ))}

            </div>

          </div>

        </aside>

        {/* CONTENU */}

        <section className="flex-1 px-6 py-8 lg:px-10">

          <div className="mx-auto max-w-6xl">

            {/* TOP BAR */}

            <div className="flex items-center justify-between">

              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
              >
                ← Retour au dashboard
              </Link>

              <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
                Module 10
              </span>

            </div>

            {/* HERO */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 10
              </p>

              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                Agents IA
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Une application IA classique reçoit une demande et
                produit une réponse. Un agent peut aller plus loin :
                choisir une action, utiliser un outil, observer le
                résultat puis décider de la prochaine étape.
              </p>

              {/* CHATBOT VS AGENT */}

              <div className="mt-9 grid gap-5 md:grid-cols-2">

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    CHATBOT CLASSIQUE
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    <DarkStep text="Utilisateur" />
                    <Arrow />
                    <DarkStep text="LLM" />
                    <Arrow />
                    <DarkStep text="Réponse" />

                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-400">
                    Le modèle reçoit un message et génère une réponse.
                  </p>

                </div>

                <div className="rounded-3xl bg-white p-6 text-slate-950">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    AGENT IA
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    <LightStep text="Objectif" />
                    <ArrowLight />
                    <LightStep text="Agent" />
                    <ArrowLight />
                    <LightStep text="Outil" />
                    <ArrowLight />
                    <LightStep text="Résultat" />

                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-500">
                    Le modèle peut décider qu’une action externe est
                    nécessaire avant de produire sa réponse finale.
                  </p>

                </div>

              </div>

              {/* PROGRESSION */}

              <div className="mt-8 max-w-xl">

                <div className="mb-2 flex justify-between text-sm">

                  <span className="text-slate-400">
                    Progression
                  </span>

                  <span>
                    {progress}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">

                <p className="text-sm text-slate-400">
                  {completedCount} / {lessons.length} leçons terminées
                </p>

                {nextLesson && (
                  <Link
                    href={`/formation/agents-ia/${nextLesson.number}`}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    {completedCount === 0
                      ? "Commencer →"
                      : "Continuer →"}
                  </Link>
                )}

              </div>

            </section>

            {/* EXEMPLE */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                EXEMPLE
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                « Trouve-moi un appartement compatible »
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Une simple IA pourrait expliquer comment chercher.
                Un agent équipé d&apos;outils pourrait réellement
                effectuer plusieurs actions pour produire un résultat.
              </p>

              <div className="mt-7 space-y-4">

                <AgentStep
                  number="01"
                  title="Comprendre l’objectif"
                  description="Budget 2 000 €, deux pièces minimum, balcon souhaité."
                  badge="Objectif"
                />

                <AgentStep
                  number="02"
                  title="Choisir un outil"
                  description="L’agent décide qu’il doit interroger une API immobilière."
                  badge="Décision"
                />

                <AgentStep
                  number="03"
                  title="Appeler l’API"
                  description="Le backend exécute réellement l’outil avec les paramètres demandés."
                  badge="Action"
                />

                <AgentStep
                  number="04"
                  title="Observer les résultats"
                  description="Les appartements retournés deviennent une nouvelle information pour l’agent."
                  badge="Observation"
                />

                <AgentStep
                  number="05"
                  title="Filtrer"
                  description="L’agent compare prix, pièces et balcon aux critères."
                  badge="Raisonnement"
                />

                <AgentStep
                  number="06"
                  title="Répondre"
                  description="Il présente uniquement les options compatibles à l’utilisateur."
                  badge="Résultat"
                />

              </div>

            </section>

            {/* OUTILS */}

            <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                LES OUTILS
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Un agent devient utile lorsqu’il peut agir
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Un outil est simplement une capacité que votre
                application autorise l&apos;agent à demander.
                Votre backend reste responsable de l&apos;exécution réelle.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <ToolCard
                  code="API"
                  title="Rechercher"
                  description="Interroger un service externe."
                />

                <ToolCard
                  code="DB"
                  title="Base de données"
                  description="Lire ou enregistrer des informations."
                />

                <ToolCard
                  code="FX"
                  title="Fonction"
                  description="Exécuter une logique précise."
                />

                <ToolCard
                  code="WEB"
                  title="Service externe"
                  description="Déclencher une action autorisée."
                />

              </div>

            </section>

            {/* TOOL CALLING */}

            <section className="mt-6 overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-xl">

              <div className="p-8">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  TOOL CALLING
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  Le modèle demande une action structurée
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Au lieu d&apos;inventer le résultat d&apos;une recherche,
                  le modèle peut demander à votre programme
                  d&apos;exécuter un outil réel.
                </p>

              </div>

              <div className="border-t border-slate-800 bg-slate-900 p-6">

                <pre className="overflow-x-auto text-sm leading-7 text-slate-300">
                  <code>{`Utilisateur :
"Trouve un appartement à moins de 2000 €"

Agent :
Je dois utiliser l'outil searchApartments.

Tool call :
{
  "budget": 2000,
  "pieces": 2,
  "balcon": true
}

Backend :
→ exécute searchApartments(...)

Résultat outil :
[
  {
    "id": 71,
    "prix": 1850,
    "pieces": 2,
    "balcon": true
  }
]

Agent :
→ analyse le résultat
→ répond à l'utilisateur`}</code>
                </pre>

              </div>

            </section>

            {/* BOUCLE */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                BOUCLE AGENTIQUE
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Observer → décider → agir → observer
              </h2>

              <div className="mt-7 flex flex-wrap items-center gap-3">

                <LoopStep
                  number="1"
                  title="Objectif"
                />

                <ArrowLight />

                <LoopStep
                  number="2"
                  title="Décision"
                />

                <ArrowLight />

                <LoopStep
                  number="3"
                  title="Outil"
                />

                <ArrowLight />

                <LoopStep
                  number="4"
                  title="Observation"
                />

                <ArrowLight />

                <LoopStep
                  number="5"
                  title="Nouvelle décision"
                />

              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">

                <p className="font-bold text-slate-950">
                  Un agent ne doit pas être laissé sans limite
                </p>

                <p className="mt-2">
                  Votre application doit contrôler le nombre
                  d&apos;étapes, les outils disponibles,
                  les permissions et les actions sensibles.
                </p>

              </div>

            </section>

            {/* PROGRAMME */}

            <section className="mt-12">

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                <div>

                  <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                    PROGRAMME
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    De la réponse simple à l’agent complet
                  </h2>

                </div>

                <p className="text-sm text-slate-400">
                  {completedCount} / {lessons.length} terminées
                </p>

              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {lessonStates.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    number={lesson.number}
                    title={lesson.title}
                    description={lesson.description}
                    duration={lesson.duration}
                    type={lesson.type}
                    status={lesson.status}
                    href={`/formation/agents-ia/${lesson.number}`}
                    project={lesson.number === "07"}
                  />
                ))}

              </div>

            </section>

            {/* PROJET */}

            <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                <div className="max-w-3xl">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    MINI-PROJET
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Construire un agent de recherche
                  </h2>

                  <p className="mt-4 leading-7 text-slate-400">
                    L&apos;agent recevra un objectif, choisira un outil,
                    récupérera des données puis décidera s&apos;il possède
                    suffisamment d&apos;informations pour répondre ou
                    s&apos;il doit effectuer une nouvelle action.
                  </p>

                </div>

                <div className="shrink-0 rounded-2xl bg-white px-7 py-5 text-slate-950">

                  <p className="text-xs font-semibold text-slate-400">
                    OBJECTIF
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    Agent fonctionnel
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Leçon 07
                  </p>

                </div>

              </div>

            </section>

            {/* NEXT */}

            <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                ENSUITE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Module 11 — RAG & documents
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Après avoir appris à donner des outils à une IA,
                vous apprendrez à lui permettre de rechercher
                intelligemment dans vos propres documents et données.
              </p>

            </section>

            {/* MODULE TERMINÉ */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 10 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous comprenez comment construire une IA capable d’agir.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous savez maintenant raisonner en objectifs,
                  outils, tool calling, observations, mémoire et
                  boucle agentique. Vous pouvez passer à la connexion
                  de l&apos;IA avec vos propres documents.
                </p>

                <Link
                  href="/formation/rag"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 11 →
                </Link>

              </section>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

// ======================================================
// SIDEBAR LESSON
// ======================================================

function LessonItem({
  number,
  title,
  duration,
  status,
  href,
}: {
  number: string;
  title: string;
  duration: string;
  status: string;
  href: string;
}) {
  const locked =
    status === "locked";

  const done =
    status === "done";

  const current =
    status === "current";

  const content = (
    <div
      className={`rounded-2xl p-4 transition ${
        current
          ? "bg-slate-950 text-white"
          : locked
          ? "opacity-50"
          : "hover:bg-slate-50"
      }`}
    >

      <div className="flex items-start gap-3">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
            current
              ? "bg-white text-slate-950"
              : done
              ? "bg-slate-100 text-slate-900"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {done
            ? "✓"
            : locked
            ? "🔒"
            : number}
        </div>

        <div>

          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {duration}
          </p>

        </div>

      </div>

    </div>
  );

  if (locked) {
    return content;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

// ======================================================
// LESSON CARD
// ======================================================

function LessonCard({
  number,
  title,
  description,
  duration,
  type,
  status,
  href,
  project,
}: {
  number: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  status: string;
  href: string;
  project: boolean;
}) {
  const locked =
    status === "locked";

  const done =
    status === "done";

  const content = (
    <div
      className={`h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition ${
        locked
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
            done
              ? "bg-slate-100 text-slate-900"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {locked
            ? "🔒"
            : done
            ? "✓"
            : number}
        </div>

        <div className="flex flex-wrap justify-end gap-2">

          {project && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Mini-projet
            </span>
          )}

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {type}
          </span>

        </div>

      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between">

        <span className="text-sm text-slate-400">
          {duration}
        </span>

        <span className="text-sm font-semibold text-slate-700">
          {done
            ? "Terminée ✓"
            : locked
            ? "Verrouillée"
            : project
            ? "Commencer le projet →"
            : "Commencer →"}
        </span>

      </div>

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

// ======================================================
// COMPONENTS
// ======================================================

function AgentStep({
  number,
  title,
  description,
  badge,
}: {
  number: string;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        {number}
      </div>

      <div className="flex-1">

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

      <span className="w-fit rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
        {badge}
      </span>

    </div>
  );
}

function ToolCard({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
        {code}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function LoopStep({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

      <p className="text-xs font-bold text-slate-400">
        {number}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {title}
      </p>

    </div>
  );
}

function DarkStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-800 px-4 py-3 text-sm">
      {text}
    </span>
  );
}

function LightStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
      {text}
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}

function ArrowLight() {
  return (
    <span className="text-slate-400">
      →
    </span>
  );
}