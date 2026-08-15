import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 07 — API & IA
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "api-01-intro",
    number: "01",
    title: "Qu’est-ce qu’une API ?",
    duration: "12 min",
    description:
      "Comprenez comment deux applications peuvent communiquer automatiquement entre elles.",
    eyebrow: "LES BASES",
    contentTitle: "Une API est un intermédiaire entre deux applications",
    paragraphs: [
      "Jusqu’ici, vos programmes Python utilisaient principalement des données écrites directement dans votre code.",
      "Une API permet à votre programme de communiquer avec une autre application afin de récupérer des informations ou de lui envoyer des données.",
    ],
    code: `Votre programme
      ↓
     API
      ↓
Service externe
      ↓
   Réponse`,
    points: [
      "Une API permet à deux logiciels de communiquer.",
      "Votre programme envoie une requête.",
      "Le serveur traite cette requête.",
      "Le serveur renvoie une réponse.",
      "Les données sont souvent échangées au format JSON.",
    ],
  },

  {
    slug: "02",
    id: "api-02-http",
    number: "02",
    title: "HTTP, GET et POST",
    duration: "16 min",
    description:
      "Découvrez comment une application envoie des requêtes à un serveur et récupère des données.",
    eyebrow: "COMMUNIQUER AVEC UN SERVEUR",
    contentTitle: "Les requêtes HTTP",
    paragraphs: [
      "Pour communiquer avec une API sur le Web, votre application utilise généralement le protocole HTTP.",
      "GET sert principalement à demander une ressource. POST sert généralement à envoyer des données afin de créer une ressource ou déclencher un traitement.",
    ],
    code: `GET /appartements/71

→ Je veux récupérer l'appartement 71


POST /prospects

→ Je veux envoyer les données d'un prospect`,
    points: [
      "HTTP permet au client et au serveur de communiquer.",
      "GET demande généralement des informations.",
      "POST permet généralement d’envoyer des données.",
      "Une URL peut identifier une ressource précise.",
      "Une API peut proposer plusieurs endpoints.",
    ],
  },

  {
    slug: "03",
    id: "api-03-requests",
    number: "03",
    title: "Utiliser requests en Python",
    duration: "18 min",
    description:
      "Effectuez vos premiers appels API avec Python et récupérez une réponse.",
    eyebrow: "PYTHON + API",
    contentTitle: "Envoyer une requête depuis Python",
    paragraphs: [
      "Python peut communiquer avec une API grâce à une bibliothèque comme requests.",
      "La fonction requests.get() envoie une requête GET vers l’adresse indiquée. La réponse du serveur est ensuite stockée dans une variable.",
    ],
    code: `import requests

response = requests.get(
    "https://api.exemple.com/appartements/71"
)

print(response)`,
    points: [
      "import requests charge la bibliothèque.",
      "requests.get() envoie une requête GET.",
      "L’URL indique la ressource demandée.",
      "La réponse est stockée dans une variable.",
      "Cette réponse pourra ensuite être analysée.",
    ],
  },

  {
    slug: "04",
    id: "api-04-response-json",
    number: "04",
    title: "Réponses, status codes et JSON",
    duration: "18 min",
    description:
      "Apprenez à vérifier si une requête a réussi puis à exploiter les données JSON reçues.",
    eyebrow: "EXPLOITER LA RÉPONSE",
    contentTitle: "Transformer la réponse en données Python",
    paragraphs: [
      "Une réponse HTTP contient notamment un code de statut. Par exemple, 200 indique généralement que la requête a réussi et 404 que la ressource demandée n’a pas été trouvée.",
      "Lorsqu’une API renvoie du JSON, response.json() permet de convertir ces données en objets Python que vous savez déjà manipuler.",
    ],
    code: `import requests

response = requests.get(
    "https://api.exemple.com/appartements/71"
)

if response.status_code == 200:

    appartement = response.json()

    print(appartement["prix"])

else:

    print("Erreur :", response.status_code)`,
    points: [
      "status_code indique le résultat HTTP.",
      "200 correspond généralement à une requête réussie.",
      "404 indique généralement une ressource introuvable.",
      "response.json() transforme le JSON reçu en données Python.",
      "Vous pouvez ensuite utiliser conditions, boucles et fonctions.",
    ],
  },

  {
    slug: "05",
    id: "api-05-auth",
    number: "05",
    title: "Clés API et authentification",
    duration: "16 min",
    description:
      "Comprenez comment sécuriser l’accès à une API et pourquoi une clé API ne doit jamais être exposée publiquement.",
    eyebrow: "SÉCURITÉ",
    contentTitle: "Une API peut avoir besoin de savoir qui vous êtes",
    paragraphs: [
      "Certaines API sont publiques, mais beaucoup demandent une authentification. Une clé API peut servir à identifier l’application qui effectue la requête.",
      "Une clé secrète ne doit pas être écrite directement dans du code envoyé sur GitHub ou exposé dans le navigateur. Elle sera plus tard stockée dans une variable d’environnement côté serveur.",
    ],
    code: `import os
import requests

api_key = os.getenv("API_KEY")

headers = {
    "Authorization": f"Bearer {api_key}"
}

response = requests.get(
    "https://api.exemple.com/data",
    headers=headers
)`,
    points: [
      "Une API peut nécessiter une authentification.",
      "Une clé API peut identifier votre application.",
      "Une clé secrète ne doit pas être publiée.",
      "Les variables d’environnement permettent de séparer secrets et code.",
      "Les appels sensibles seront réalisés côté serveur dans votre SaaS.",
    ],
  },

  {
    slug: "06",
    id: "api-06-ai",
    number: "06",
    title: "Appeler une API d’IA",
    duration: "22 min",
    description:
      "Comprenez comment envoyer un prompt à un service d’IA et récupérer sa réponse dans votre programme.",
    eyebrow: "API + INTELLIGENCE ARTIFICIELLE",
    contentTitle: "Votre programme peut maintenant communiquer avec une IA",
    paragraphs: [
      "Une API d’intelligence artificielle suit le même principe général que les API que vous venez d’étudier : votre programme prépare une requête, l’envoie au service puis récupère une réponse.",
      "La différence est surtout le contenu de la requête. Vous pouvez par exemple envoyer des instructions et du texte, puis exploiter la réponse générée dans votre application.",
    ],
    code: `Votre application

      ↓

Prompt + données

      ↓

API d'IA

      ↓

Modèle

      ↓

Réponse générée

      ↓

Votre application`,
    points: [
      "Une API IA reste une API.",
      "Votre programme envoie des données et des instructions.",
      "Le service exécute le modèle côté serveur.",
      "Une réponse est renvoyée à votre application.",
      "Cette architecture servira plus tard pour votre SaaS et vos agents IA.",
    ],
  },

  {
    slug: "07",
    id: "api-07-project",
    number: "07",
    title: "Mini-projet : application connectée à une API",
    duration: "35 min",
    description:
      "Construisez la logique complète d’un programme qui récupère des données externes, les analyse puis produit un résultat.",
    eyebrow: "MINI-PROJET",
    contentTitle: "Assembler Python et API",
    paragraphs: [
      "Vous avez maintenant toutes les briques nécessaires pour comprendre un programme qui récupère des données externes et applique automatiquement une logique métier.",
      "Le mini-projet vous demandera de combiner requests, JSON, conditions, dictionnaires et fonctions dans un seul programme.",
    ],
    code: `import requests

response = requests.get(
    "https://api.exemple.com/appartements/71"
)

appartement = response.json()

budget = 2000

if appartement["prix"] <= budget:
    print("Appartement compatible")
else:
    print("Appartement trop cher")`,
    points: [
      "Envoyer une requête HTTP.",
      "Récupérer une réponse.",
      "Transformer du JSON en données Python.",
      "Analyser les données.",
      "Produire automatiquement un résultat.",
    ],
  },
];

// ======================================================
// PAGE
// ======================================================

export default async function LessonPage({
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
      .select("lesson_id, completed")
      .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression API :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => item.completed)
      .map((item) => item.lesson_id) ?? []
  );

  // ======================================================
  // INDEX
  // ======================================================

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
    redirect("/formation/api-ia");
  }

  const lessonCompleted =
    completedIds.has(lesson.id);

  // ======================================================
  // PROGRESSION MODULE
  // ======================================================

  const completedCount = lessons.filter(
    (item) =>
      completedIds.has(item.id)
  ).length;

  const moduleProgress = Math.round(
    (completedCount / lessons.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <div className="flex items-center justify-between gap-4">

          <Link
            href="/formation/api-ia"
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

            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              Leçon {lesson.number} / {lessons.length}
            </span>

          </div>

        </div>

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
            MODULE 07 · LEÇON {lesson.number}
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            {lesson.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
              ⏱ {lesson.duration}
            </span>

            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              API & IA
            </span>

          </div>

        </section>

        {/* ==================================================
            VIDEO
        ================================================== */}

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

        {/* ==================================================
            PROGRESSION
        ================================================== */}

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

        {/* ==================================================
            CONTENU + COACH
        ================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* COURS */}

          <div className="space-y-6">

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                {lesson.eyebrow}
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {lesson.contentTitle}
              </h2>

              <div className="mt-5 space-y-4">

                {lesson.paragraphs.map(
                  (paragraph) => (
                    <p
                      key={paragraph}
                      className="leading-7 text-slate-500"
                    >
                      {paragraph}
                    </p>
                  )
                )}

              </div>

            </section>

            {/* CODE */}

            <section className="overflow-hidden rounded-[26px] bg-slate-950 shadow-xl">

              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  EXEMPLE
                </p>

                <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  {lesson.number === "01" ||
                  lesson.number === "02" ||
                  lesson.number === "06"
                    ? "Concept"
                    : "Python"}
                </span>

              </div>

              <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                <code>
                  {lesson.code}
                </code>
              </pre>

            </section>

            {/* POINTS IMPORTANTS */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                CE QU&apos;IL FAUT RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                Les points essentiels
              </h2>

              <div className="mt-6 space-y-3">

                {lesson.points.map(
                  (point, index) => (
                    <div
                      key={point}
                      className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="pt-1 text-sm leading-6 text-slate-600">
                        {point}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* ==================================================
                ACTION
            ================================================== */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                VALIDATION
              </p>

              {lesson.number === "07" ? (
                <>
                  <h2 className="mt-4 text-2xl font-bold">
                    Prêt pour le mini-projet ?
                  </h2>

                  <p className="mt-3 leading-7 text-slate-500">
                    Vous allez maintenant assembler les notions
                    principales du module dans un exercice final.
                  </p>

                  <Link
                    href="/formation/api-ia/07/projet"
                    className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
                  >
                    Commencer le mini-projet →
                  </Link>
                </>
              ) : lessonCompleted ? (
                <>
                  <h2 className="mt-4 text-2xl font-bold">
                    Leçon terminée ✓
                  </h2>

                  <p className="mt-3 leading-7 text-slate-500">
                    Votre progression a été enregistrée.
                  </p>

                  {nextLesson ? (
                    <Link
                      href={`/formation/api-ia/${nextLesson.slug}`}
                      className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
                    >
                      Leçon suivante →
                    </Link>
                  ) : (
                    <Link
                      href="/formation/api-ia"
                      className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                    >
                      Retour au module →
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-2xl font-bold">
                    Vérifiez vos connaissances
                  </h2>

                  <p className="mt-3 leading-7 text-slate-500">
                    Validez l&apos;exercice de cette leçon pour
                    débloquer la suivante.
                  </p>

                  <Link
                    href={`/formation/api-ia/${lesson.slug}/exercice`}
                    className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
                  >
                    Faire l&apos;exercice →
                  </Link>
                </>
              )}

            </section>

          </div>

          {/* ==================================================
              COACH IA
          ================================================== */}

          <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                ✦
              </div>

              <div>

                <p className="font-bold">
                  Coach IA
                </p>

                <p className="text-xs text-slate-400">
                  API & IA · Leçon {lesson.number}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Posez-moi une question sur cette leçon.
              Je pourrai bientôt utiliser directement
              le contexte du cours pour vous répondre.
            </div>

            <textarea
              placeholder="Ex : Quelle est la différence entre GET et POST ?"
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

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="mt-8 flex items-center justify-between gap-4">

          {previousLesson ? (
            <Link
              href={`/formation/api-ia/${previousLesson.slug}`}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-slate-50"
            >
              ← Leçon {previousLesson.number}
            </Link>
          ) : (
            <div />
          )}

          {nextLesson &&
          lessonCompleted ? (
            <Link
              href={`/formation/api-ia/${nextLesson.slug}`}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Leçon {nextLesson.number} →
            </Link>
          ) : (
            nextLesson && (
              <span className="rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-400">
                🔒 Leçon {nextLesson.number}
              </span>
            )
          )}

        </div>

      </div>

    </main>
  );
}