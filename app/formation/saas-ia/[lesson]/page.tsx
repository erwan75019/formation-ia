import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 09 — CRÉER UN SAAS IA
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "saas-01-architecture",
    number: "01",
    title: "Comprendre l’architecture d’un SaaS",
    duration: "16 min",
    description:
      "Découvrez comment les différentes parties d’une application web communiquent entre elles.",
  },
  {
    slug: "02",
    id: "saas-02-front-back",
    number: "02",
    title: "Frontend, backend, client et serveur",
    duration: "22 min",
    description:
      "Comprenez précisément ce qui s’exécute dans le navigateur et ce qui doit rester côté serveur.",
  },
  {
    slug: "03",
    id: "saas-03-auth",
    number: "03",
    title: "Gérer les utilisateurs",
    duration: "20 min",
    description:
      "Intégrez inscription, connexion, session et protection des pages privées dans un SaaS.",
  },
  {
    slug: "04",
    id: "saas-04-database",
    number: "04",
    title: "Connecter la base de données",
    duration: "22 min",
    description:
      "Reliez les utilisateurs aux données de l’application et affichez des informations dynamiques.",
  },
  {
    slug: "05",
    id: "saas-05-ai",
    number: "05",
    title: "Ajouter une fonctionnalité IA",
    duration: "25 min",
    description:
      "Faites circuler une demande du frontend jusqu’à une API d’intelligence artificielle.",
  },
  {
    slug: "06",
    id: "saas-06-security",
    number: "06",
    title: "Sécuriser clés API et backend",
    duration: "22 min",
    description:
      "Comprenez pourquoi les secrets ne doivent jamais être exposés dans le navigateur et comment protéger les appels sensibles.",
  },
  {
    slug: "07",
    id: "saas-07-project",
    number: "07",
    title: "Mini-projet : construire un SaaS IA",
    duration: "55 min",
    description:
      "Assemblez frontend, backend, authentification, base de données et API IA dans une architecture complète.",
  },
];

export default async function SaasLessonPage({
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

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

  const allowed =
    currentIndex === 0 ||
    previousLesson === null ||
    completedIds.has(previousLesson.id);

  if (!allowed) {
    redirect("/formation/saas-ia");
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
            href="/formation/saas-ia"
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
              MODULE 09 · LEÇON {lesson.number}
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

            {/* EXPLICATION */}

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

            {/* EXPLICATION EXEMPLE */}

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
                  Validez l&apos;exercice pour terminer cette
                  leçon et débloquer la suivante.
                </p>

                <Link
                  href={`/formation/saas-ia/${lesson.slug}/exercice`}
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
                  Assemblez votre SaaS IA
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Vous allez maintenant reconstruire le trajet
                  complet d&apos;une demande utilisateur dans une
                  véritable architecture SaaS.
                </p>

                <Link
                  href="/formation/saas-ia/07/projet"
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
                    href={`/formation/saas-ia/${nextLesson.slug}`}
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
                  Coach SaaS
                </p>

                <p className="text-xs text-slate-400">
                  Leçon {lesson.number}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Posez une question sur le frontend, le backend,
              l&apos;authentification, la base de données ou les API.
            </div>

            <textarea
              placeholder="Ex : pourquoi une clé API doit rester côté serveur ?"
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
// CONTENU
// ======================================================

function getLessonContent(
  slug: string
) {
  const contents = {
    "01": {
      heading:
        "Un SaaS est un ensemble de couches qui travaillent ensemble.",
      introduction:
        "Une application SaaS ne se résume pas à une page web. Elle peut contenir une interface, une logique serveur, des utilisateurs, une base de données et des services externes comme une API d'intelligence artificielle.",
      points: [
        {
          title: "Utilisateur",
          text: "L'utilisateur interagit avec l'application depuis son navigateur.",
        },
        {
          title: "Frontend",
          text: "Le frontend affiche l'interface et récupère les actions de l'utilisateur.",
        },
        {
          title: "Backend",
          text: "Le backend exécute la logique serveur et les opérations sensibles.",
        },
        {
          title: "Services",
          text: "Le backend peut communiquer avec une base de données ou une API externe.",
        },
      ],
      exampleTitle:
        "Architecture simple",
      architecture: [
        "Utilisateur",
        "Frontend",
        "Backend",
        "Database / API IA",
        "Frontend",
      ],
      code: "",
      exampleExplanation:
        "Une action commence souvent dans l'interface. Le frontend transmet la demande au backend, qui peut consulter des données ou appeler un service externe avant de renvoyer le résultat.",
    },

    "02": {
      heading:
        "Le frontend et le backend n'ont pas le même rôle.",
      introduction:
        "Le frontend correspond à la partie de l'application exécutée pour l'utilisateur, généralement dans son navigateur. Le backend correspond à la logique exécutée côté serveur.",
      points: [
        {
          title: "Client",
          text: "Le client est généralement l'application ou le navigateur qui envoie une demande.",
        },
        {
          title: "Serveur",
          text: "Le serveur reçoit les requêtes et exécute une logique avant de répondre.",
        },
        {
          title: "Frontend",
          text: "Boutons, formulaires, pages et affichage des résultats appartiennent principalement au frontend.",
        },
        {
          title: "Backend",
          text: "Accès aux secrets, validation sensible, base de données et appels privés sont généralement gérés côté serveur.",
        },
      ],
      exampleTitle:
        "Une demande de résumé IA",
      architecture: [
        "Formulaire",
        "Frontend",
        "Backend",
        "API IA",
        "Backend",
        "Frontend",
      ],
      code: `// Frontend
await fetch("/api/resume", {
  method: "POST",
  body: JSON.stringify({
    texte
  })
});

// Backend
const apiKey =
  process.env.AI_API_KEY;

// Le secret reste côté serveur.`,
      exampleExplanation:
        "Le navigateur envoie uniquement les données nécessaires au backend. Le backend possède la clé secrète, appelle l'API externe puis renvoie uniquement le résultat nécessaire au frontend.",
    },

    "03": {
      heading:
        "L'authentification permet de distinguer les utilisateurs.",
      introduction:
        "Un SaaS doit généralement savoir qui utilise l'application afin de protéger certaines pages et d'associer des données au bon compte.",
      points: [
        {
          title: "Inscription",
          text: "Un nouvel utilisateur crée son compte.",
        },
        {
          title: "Connexion",
          text: "L'utilisateur prouve son identité.",
        },
        {
          title: "Session",
          text: "La session permet à l'application de reconnaître l'utilisateur entre plusieurs requêtes.",
        },
        {
          title: "Pages privées",
          text: "Le backend peut vérifier l'utilisateur avant d'autoriser l'accès au dashboard.",
        },
      ],
      exampleTitle:
        "Protéger une page",
      architecture: null,
      code: `const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  redirect("/connexion");
}

// La suite de la page est réservée
// à un utilisateur connecté.`,
      exampleExplanation:
        "Avant d'afficher une page privée, le serveur vérifie qu'un utilisateur authentifié existe. Sinon, il redirige vers la connexion.",
    },

    "04": {
      heading:
        "Les données du SaaS doivent être reliées à leurs propriétaires.",
      introduction:
        "Une fois l'utilisateur identifié, votre SaaS peut lire ou créer des données qui lui appartiennent.",
      points: [
        {
          title: "user_id",
          text: "Une ressource peut contenir l'identifiant de son propriétaire.",
        },
        {
          title: "Lecture",
          text: "Le dashboard peut récupérer les projets de l'utilisateur.",
        },
        {
          title: "Création",
          text: "Une nouvelle ressource peut être créée avec user.id.",
        },
        {
          title: "Sécurité",
          text: "Les règles de la base doivent également empêcher l'accès aux données des autres utilisateurs.",
        },
      ],
      exampleTitle:
        "Lire les projets de l'utilisateur",
      architecture: null,
      code: `const {
  data: { user },
} = await supabase.auth.getUser();

const { data: projects } =
  await supabase
    .from("projects")
    .select("id, name, status")
    .eq("user_id", user.id);`,
      exampleExplanation:
        "Le backend connaît l'utilisateur connecté puis utilise son identifiant pour demander les données correspondantes.",
    },

    "05": {
      heading:
        "Une fonctionnalité IA est un flux de données dans votre SaaS.",
      introduction:
        "L'utilisateur fournit une demande dans le frontend. Le backend reçoit cette demande, appelle le service d'intelligence artificielle puis renvoie le résultat.",
      points: [
        {
          title: "Input",
          text: "Le frontend récupère la demande de l'utilisateur.",
        },
        {
          title: "Requête backend",
          text: "Le frontend transmet les données à une route serveur.",
        },
        {
          title: "API IA",
          text: "Le backend appelle le service IA avec les instructions nécessaires.",
        },
        {
          title: "Output",
          text: "Le résultat revient au backend puis au frontend.",
        },
      ],
      exampleTitle:
        "Trajet d'un prompt",
      architecture: [
        "Utilisateur",
        "Textarea",
        "POST /api/generate",
        "API IA",
        "Réponse",
        "Interface",
      ],
      code: `const response = await fetch(
  "/api/generate",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  }
);

const data =
  await response.json();

setResult(data.result);`,
      exampleExplanation:
        "Le frontend ne contacte pas nécessairement directement le fournisseur d'IA. Il peut contacter votre propre backend, qui contrôle l'appel externe et renvoie un résultat propre à l'interface.",
    },

    "06": {
      heading:
        "Les secrets doivent rester dans un environnement de confiance.",
      introduction:
        "Une clé API privée ne doit jamais être intégrée dans du JavaScript envoyé au navigateur. Toute personne utilisant le site pourrait potentiellement inspecter le code ou les requêtes.",
      points: [
        {
          title: "Variables d'environnement",
          text: "Les secrets serveur peuvent être stockés dans des variables d'environnement.",
        },
        {
          title: "Backend",
          text: "Le serveur lit le secret au moment d'effectuer l'appel sensible.",
        },
        {
          title: "Validation",
          text: "Le backend doit contrôler les données reçues avant d'effectuer des opérations.",
        },
        {
          title: "Autorisation",
          text: "Être connecté ne signifie pas forcément avoir le droit d'effectuer toutes les actions.",
        },
      ],
      exampleTitle:
        "Secret serveur",
      architecture: [
        "Frontend",
        "Votre API",
        "Secret serveur",
        "API externe",
      ],
      code: `// Côté serveur uniquement

const apiKey =
  process.env.AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Configuration manquante"
  );
}

// Le frontend ne reçoit jamais apiKey.`,
      exampleExplanation:
        "Le secret est utilisé uniquement par le backend. Le navigateur connaît l'URL de votre propre route mais pas nécessairement les identifiants utilisés pour appeler les services externes.",
    },

    "07": {
      heading:
        "Vous allez assembler les principales couches d'un SaaS IA.",
      introduction:
        "Le mini-projet reprend tout le module. Vous devrez reconstruire le parcours complet d'une demande utilisateur depuis le navigateur jusqu'à l'intelligence artificielle et la base de données.",
      points: [
        {
          title: "Frontend",
          text: "L'utilisateur saisit sa demande.",
        },
        {
          title: "Auth",
          text: "Le SaaS identifie l'utilisateur.",
        },
        {
          title: "Backend",
          text: "Le serveur valide puis traite la demande.",
        },
        {
          title: "IA + Database",
          text: "Le backend utilise le service IA et peut enregistrer le résultat.",
        },
      ],
      exampleTitle:
        "Architecture finale",
      architecture: [
        "Utilisateur",
        "Frontend",
        "Backend",
        "Auth",
        "API IA",
        "Database",
        "Frontend",
      ],
      code: `Utilisateur
    ↓
Frontend
    ↓
Backend
    ├── Auth
    ├── Database
    └── API IA
    ↓
Résultat
    ↓
Frontend`,
      exampleExplanation:
        "Le backend devient le point central : il sait qui est l'utilisateur, gère les opérations sensibles, communique avec les services nécessaires puis renvoie un résultat adapté au frontend.",
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}