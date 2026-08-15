import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 10 — AGENTS IA
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "agents-01-agent-vs-chatbot",
    number: "01",
    title: "Agent IA vs chatbot",
    duration: "16 min",
    description:
      "Comprenez ce qui différencie une simple réponse générée d’un système capable d’agir.",
  },
  {
    slug: "02",
    id: "agents-02-objective",
    number: "02",
    title: "Objectif et plan d’action",
    duration: "18 min",
    description:
      "Apprenez comment un agent reçoit un objectif et détermine les étapes nécessaires.",
  },
  {
    slug: "03",
    id: "agents-03-tools",
    number: "03",
    title: "Donner des outils à un agent",
    duration: "22 min",
    description:
      "Découvrez comment un agent peut utiliser une API, une base de données ou une fonction.",
  },
  {
    slug: "04",
    id: "agents-04-tool-calling",
    number: "04",
    title: "Comprendre le tool calling",
    duration: "24 min",
    description:
      "Apprenez comment un modèle peut demander l’exécution d’un outil avec des arguments structurés.",
  },
  {
    slug: "05",
    id: "agents-05-loop",
    number: "05",
    title: "La boucle agentique",
    duration: "24 min",
    description:
      "Comprenez comment un agent observe un résultat, décide de la suite et peut enchaîner plusieurs actions.",
  },
  {
    slug: "06",
    id: "agents-06-memory-state",
    number: "06",
    title: "Mémoire, état et limites",
    duration: "22 min",
    description:
      "Apprenez à conserver le contexte utile et à empêcher un agent de tourner sans contrôle.",
  },
  {
    slug: "07",
    id: "agents-07-project",
    number: "07",
    title: "Mini-projet : construire un agent IA",
    duration: "55 min",
    description:
      "Assemblez objectif, outils, décisions, résultats et mémoire dans une architecture agentique.",
  },
];

export default async function AgentLessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: lessonSlug } = await params;

  const lesson = lessons.find(
    (item) => item.slug === lessonSlug
  );

  if (!lesson) {
    notFound();
  }

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
  // PROGRESSION
  // ======================================================

  const { data: progressData, error: progressError } =
    await supabase
      .from("lesson_progress")
      .select("lesson_id, completed, score")
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

  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  // ======================================================
  // VERROUILLAGE
  // ======================================================

  const allowed =
    currentIndex === 0 ||
    previousLesson === null ||
    completedIds.has(previousLesson.id);

  if (!allowed) {
    redirect("/formation/agents-ia");
  }

  const lessonCompleted =
    completedIds.has(lesson.id);

  const lessonProgress =
    progressData?.find(
      (item) =>
        item.lesson_id === lesson.id
    );

  const lessonScore =
    lessonProgress?.score ?? null;

  const content =
    getLessonContent(lesson.slug);

  const isProject =
    lesson.slug === "07";

  // ======================================================
  // PROGRESSION MODULE
  // ======================================================

  const completedCount =
    lessons.filter((item) =>
      completedIds.has(item.id)
    ).length;

  const moduleProgress =
    Math.round(
      (completedCount /
        lessons.length) *
        100
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between gap-4">

          <Link
            href="/formation/agents-ia"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au module
          </Link>

          <div className="flex items-center gap-3">

            {lessonCompleted && (
              <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                ✓ Terminée
              </span>
            )}

            {lessonCompleted &&
              lessonScore !== null && (
                <span className="rounded-full bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                  Score : {lessonScore}%
                </span>
              )}

            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              Leçon {lesson.number} / {lessons.length}
            </span>

          </div>

        </div>

        {/* HEADER */}

        <section className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              MODULE 10 · LEÇON {lesson.number}
            </p>

            {isProject && (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                Mini-projet
              </span>
            )}

          </div>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            {lesson.description}
          </p>

        </section>

        {/* VIDEO */}

        <section className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 shadow-2xl">

          <div className="flex aspect-video items-center justify-center">

            <button
              type="button"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-slate-950 shadow-xl transition hover:scale-105"
            >
              ▶
            </button>

          </div>

          <div className="border-t border-slate-800 px-6 py-4">

            <div className="flex items-center justify-between gap-4 text-sm">

              <span className="text-slate-400">
                {lesson.title}
              </span>

              <span className="text-white">
                {lesson.duration}
              </span>

            </div>

          </div>

        </section>

        {/* PROGRESSION */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between text-sm">

            <span className="font-medium text-slate-500">
              Progression du module
            </span>

            <span className="font-semibold">
              {moduleProgress}%
            </span>

          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-500"
              style={{
                width: `${moduleProgress}%`,
              }}
            />

          </div>

          <p className="mt-3 text-xs text-slate-400">
            {completedCount} / {lessons.length} leçons terminées
          </p>

        </section>

        {/* CONTENU */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          <div className="space-y-6">

            {/* COURS */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {content.heading}
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {content.introduction}
              </p>

              <div className="mt-7 space-y-4">

                {content.points.map(
                  (point, index) => (
                    <div
                      key={point.title}
                      className="rounded-2xl bg-slate-50 p-5"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div>

                          <h3 className="font-semibold">
                            {point.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {point.text}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* ARCHITECTURE */}

            {content.architecture && (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  ARCHITECTURE
                </p>

                <h2 className="mt-3 text-xl font-bold">
                  {content.exampleTitle}
                </h2>

                <div className="mt-6 flex flex-wrap items-center gap-3">

                  {content.architecture.map(
                    (step, index) => (
                      <div
                        key={`${step}-${index}`}
                        className="contents"
                      >

                        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
                          {step}
                        </div>

                        {index <
                          content.architecture!.length -
                            1 && (
                          <span className="text-slate-600">
                            →
                          </span>
                        )}

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

            {/* CODE */}

            {content.code && (
              <section className="overflow-hidden rounded-[26px] bg-slate-950 shadow-xl">

                <div className="border-b border-slate-800 px-6 py-4">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    EXEMPLE
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-white">
                    {content.exampleTitle}
                  </h2>

                </div>

                <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                  <code>
                    {content.code}
                  </code>
                </pre>

              </section>
            )}

            {/* EXPLICATION */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                COMPRENDRE L&apos;EXEMPLE
              </p>

              <p className="mt-4 leading-7 text-slate-500">
                {content.exampleExplanation}
              </p>

            </section>

            {/* ACTION */}

            {!isProject ? (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  EXERCICE
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Vérifiez votre compréhension
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Validez l&apos;exercice pour terminer cette leçon
                  et débloquer la suivante.
                </p>

                <Link
                  href={`/formation/agents-ia/${lesson.slug}/exercice`}
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Refaire l'exercice →"
                    : "Faire l'exercice →"}
                </Link>

              </section>
            ) : (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">
                  MINI-PROJET
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Construisez votre agent IA
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Vous allez reconstruire la logique complète d&apos;un
                  agent capable de choisir un outil, observer son
                  résultat et décider de la prochaine étape.
                </p>

                <Link
                  href="/formation/agents-ia/07/projet"
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Revoir le projet →"
                    : "Commencer le mini-projet →"}
                </Link>

              </section>
            )}

            {/* NEXT */}

            {lessonCompleted && (
              <div>

                {nextLesson ? (
                  <Link
                    href={`/formation/agents-ia/${nextLesson.slug}`}
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Leçon suivante →
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Terminer le module ✓
                  </Link>
                )}

              </div>
            )}

          </div>

          {/* COACH */}

          <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                ✦
              </div>

              <div>

                <p className="font-bold">
                  Coach Agents
                </p>

                <p className="text-xs text-slate-400">
                  Leçon {lesson.number}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Posez une question sur les agents, les outils,
              le tool calling ou les boucles agentiques.
            </div>

            <textarea
              placeholder="Ex : qui exécute réellement l'outil demandé par l'agent ?"
              className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-slate-400"
            />

            <button
              type="button"
              className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
            >
              Envoyer
            </button>

          </aside>

        </div>

      </div>

    </main>
  );
}

// ======================================================
// CONTENU DES LEÇONS
// ======================================================

function getLessonContent(
  slug: string
) {
  const contents = {
    "01": {
      heading:
        "Un agent ne se contente pas forcément de générer du texte.",
      introduction:
        "Un chatbot classique reçoit une demande puis produit généralement une réponse. Un agent peut disposer d'outils et décider qu'une action externe est nécessaire avant de répondre.",
      points: [
        {
          title: "Chatbot",
          text: "Il transforme principalement une entrée utilisateur en réponse générée.",
        },
        {
          title: "Agent",
          text: "Il peut choisir d'utiliser une capacité externe lorsque cela est utile.",
        },
        {
          title: "Outils",
          text: "Une recherche, une fonction, une API ou une base de données peuvent devenir des outils.",
        },
        {
          title: "Contrôle",
          text: "L'application garde la responsabilité de ce que l'agent a réellement le droit d'exécuter.",
        },
      ],
      exampleTitle:
        "Chatbot vs agent",
      architecture: [
        "Objectif",
        "Agent",
        "Décision",
        "Outil",
        "Observation",
        "Réponse",
      ],
      code: "",
      exampleExplanation:
        "La différence centrale est l'action. Le modèle peut indiquer qu'il souhaite utiliser un outil, mais c'est votre application qui contrôle et exécute réellement cette action.",
    },

    "02": {
      heading:
        "Un agent travaille à partir d'un objectif, pas seulement d'une question.",
      introduction:
        "Un objectif peut nécessiter plusieurs étapes. L'agent doit déterminer quelles informations lui manquent et quelles actions sont nécessaires pour obtenir un résultat.",
      points: [
        {
          title: "Objectif",
          text: "Il décrit le résultat que l'utilisateur cherche à obtenir.",
        },
        {
          title: "État actuel",
          text: "L'agent utilise les informations déjà disponibles.",
        },
        {
          title: "Étape suivante",
          text: "Il détermine quelle action est utile à ce moment précis.",
        },
        {
          title: "Arrêt",
          text: "Lorsque suffisamment d'informations sont disponibles, l'agent peut produire le résultat final.",
        },
      ],
      exampleTitle:
        "Trouver un appartement",
      architecture: [
        "Objectif",
        "Critères",
        "Recherche",
        "Analyse",
        "Réponse",
      ],
      code: `Objectif :
Trouver un appartement compatible.

Critères :
- budget <= 2000
- pièces >= 2
- balcon = true

Agent :
1. Il me manque les appartements disponibles.
2. Je dois utiliser un outil de recherche.
3. J'analyserai ensuite les résultats.`,
      exampleExplanation:
        "L'objectif est différent d'une simple instruction isolée. L'agent peut constater qu'il lui manque une information, choisir une action pour l'obtenir puis continuer.",
    },

    "03": {
      heading:
        "Un outil est une capacité exposée à l'agent par votre application.",
      introduction:
        "Le modèle ne possède pas automatiquement l'accès à vos services. Vous définissez explicitement quelles fonctions ou capacités peuvent être utilisées.",
      points: [
        {
          title: "Nom",
          text: "Chaque outil possède un nom compréhensible par le modèle.",
        },
        {
          title: "Description",
          text: "La description explique quand l'outil doit être utilisé.",
        },
        {
          title: "Arguments",
          text: "Les paramètres attendus doivent être structurés et contrôlés.",
        },
        {
          title: "Exécution",
          text: "Votre backend reçoit la demande puis exécute la vraie fonction.",
        },
      ],
      exampleTitle:
        "Un outil de recherche",
      architecture: null,
      code: `const tools = [
  {
    name: "searchApartments",

    description:
      "Recherche des appartements correspondant à des critères.",

    parameters: {
      budget: "number",
      pieces: "number",
      balcon: "boolean",
    },
  },
];`,
      exampleExplanation:
        "La définition décrit l'outil au modèle. Elle ne donne pas directement un accès libre au système : le backend reste responsable de l'exécution.",
    },

    "04": {
      heading:
        "Le tool calling permet au modèle de demander une action de manière structurée.",
      introduction:
        "Au lieu de répondre qu'il faudrait rechercher des données, un modèle capable de tool calling peut produire une demande structurée indiquant quel outil utiliser et avec quels arguments.",
      points: [
        {
          title: "Choix de l'outil",
          text: "Le modèle sélectionne l'outil qui semble adapté à la demande.",
        },
        {
          title: "Arguments",
          text: "Il produit les paramètres nécessaires sous une forme structurée.",
        },
        {
          title: "Validation",
          text: "Votre backend doit contrôler les arguments avant l'exécution.",
        },
        {
          title: "Résultat outil",
          text: "Le résultat est ensuite envoyé au modèle comme nouvelle information.",
        },
      ],
      exampleTitle:
        "Tool call structuré",
      architecture: [
        "Utilisateur",
        "LLM",
        "Tool call",
        "Backend",
        "Outil",
        "Résultat",
        "LLM",
      ],
      code: `{
  "tool": "searchApartments",
  "arguments": {
    "budget": 2000,
    "pieces": 2,
    "balcon": true
  }
}`,
      exampleExplanation:
        "Cette structure représente une demande d'action, pas encore l'action elle-même. Votre code identifie l'outil demandé, contrôle les valeurs puis appelle la fonction correspondante.",
    },

    "05": {
      heading:
        "Un agent peut répéter le cycle décision → action → observation.",
      introduction:
        "Après l'exécution d'un outil, l'agent reçoit une nouvelle information. Il peut alors décider qu'il possède assez de données pour répondre ou qu'une autre action est nécessaire.",
      points: [
        {
          title: "Décision",
          text: "L'agent choisit entre répondre ou utiliser un outil.",
        },
        {
          title: "Action",
          text: "Le backend exécute l'outil demandé.",
        },
        {
          title: "Observation",
          text: "Le résultat de l'outil rejoint le contexte de l'agent.",
        },
        {
          title: "Nouvelle décision",
          text: "L'agent réévalue la situation avec les nouvelles données.",
        },
      ],
      exampleTitle:
        "Boucle agentique simplifiée",
      architecture: [
        "Agent",
        "Décision",
        "Outil",
        "Observation",
        "Agent",
      ],
      code: `for (let step = 0; step < 5; step++) {

  const decision =
    await askModel(state);

  if (decision.type === "final") {
    return decision.answer;
  }

  if (decision.type === "tool") {

    const result =
      await executeTool(
        decision.tool,
        decision.arguments
      );

    state.push({
      type: "tool_result",
      result,
    });
  }
}`,
      exampleExplanation:
        "Cette boucle impose ici une limite de cinq étapes. À chaque tour, le modèle peut produire une réponse finale ou demander l'utilisation d'un outil.",
    },

    "06": {
      heading:
        "Un agent a besoin d'un état contrôlé et de limites explicites.",
      introduction:
        "Plus un agent peut effectuer d'actions, plus votre application doit contrôler son contexte, ses permissions et ses conditions d'arrêt.",
      points: [
        {
          title: "État",
          text: "L'état contient les informations utiles accumulées pendant l'exécution.",
        },
        {
          title: "Mémoire",
          text: "Certaines informations peuvent être conservées entre plusieurs interactions lorsque cela est réellement nécessaire.",
        },
        {
          title: "Limite d'étapes",
          text: "Une boucle doit posséder une condition d'arrêt afin d'éviter les exécutions infinies.",
        },
        {
          title: "Permissions",
          text: "Un agent ne doit avoir accès qu'aux outils et actions nécessaires à son rôle.",
        },
      ],
      exampleTitle:
        "Contrôler l'agent",
      architecture: null,
      code: `const MAX_STEPS = 5;

for (
  let step = 0;
  step < MAX_STEPS;
  step++
) {
  // décision
  // outil éventuel
  // observation
}

// Arrêt forcé après 5 étapes.`,
      exampleExplanation:
        "Une limite d'étapes est une protection simple mais importante. Dans un vrai système, on ajoute également contrôle des permissions, validation des arguments, gestion des erreurs et suivi des coûts.",
    },

    "07": {
      heading:
        "Vous allez assembler les composants d'un agent complet.",
      introduction:
        "Le mini-projet reprend les notions essentielles du module : objectif, sélection d'outil, exécution contrôlée, observation, nouvelle décision et condition d'arrêt.",
      points: [
        {
          title: "Objectif",
          text: "L'utilisateur décrit le résultat attendu.",
        },
        {
          title: "Outils",
          text: "L'agent dispose uniquement des capacités autorisées.",
        },
        {
          title: "Boucle",
          text: "Les résultats d'outils peuvent déclencher de nouvelles décisions.",
        },
        {
          title: "Limites",
          text: "Le système conserve le contrôle du nombre d'étapes et des actions.",
        },
      ],
      exampleTitle:
        "Architecture finale",
      architecture: [
        "Objectif",
        "Agent",
        "Tool call",
        "Backend",
        "Outil",
        "Observation",
        "Agent",
        "Réponse",
      ],
      code: `Objectif
   ↓
Agent
   ↓
Décision
   ├── Réponse finale
   │
   └── Tool call
          ↓
       Backend
          ↓
        Outil
          ↓
      Observation
          ↓
        Agent
          ↓
   Nouvelle décision`,
      exampleExplanation:
        "L'agent ne contrôle pas directement votre infrastructure. Il propose une action structurée, votre backend décide si elle est autorisée, l'exécute puis renvoie le résultat dans la boucle.",
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}