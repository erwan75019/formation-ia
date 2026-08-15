import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const lessons = [
  {
    slug: "01",
    id: "rag-01-intro",
    number: "01",
    title: "Comprendre le RAG",
    duration: "18 min",
    description:
      "Comprenez comment une IA peut rechercher dans vos propres documents avant de répondre.",
  },
  {
    slug: "02",
    id: "rag-02-chunks",
    number: "02",
    title: "Découper les documents",
    duration: "20 min",
    description:
      "Apprenez pourquoi un document est découpé en morceaux appelés chunks.",
  },
  {
    slug: "03",
    id: "rag-03-embeddings",
    number: "03",
    title: "Comprendre les embeddings",
    duration: "22 min",
    description:
      "Découvrez comment transformer le sens d’un texte en représentation numérique.",
  },
  {
    slug: "04",
    id: "rag-04-semantic-search",
    number: "04",
    title: "Recherche sémantique",
    duration: "22 min",
    description:
      "Apprenez à retrouver les passages les plus proches du sens d’une question.",
  },
  {
    slug: "05",
    id: "rag-05-vector-db",
    number: "05",
    title: "Base de données vectorielle",
    duration: "24 min",
    description:
      "Comprenez comment stocker les chunks et leurs embeddings.",
  },
  {
    slug: "06",
    id: "rag-06-pipeline",
    number: "06",
    title: "Construire le pipeline RAG",
    duration: "26 min",
    description:
      "Assemblez question, embedding, recherche, contexte et génération.",
  },
  {
    slug: "07",
    id: "rag-07-project",
    number: "07",
    title: "Mini-projet : assistant documentaire",
    duration: "55 min",
    description:
      "Construisez la logique complète d’un assistant documentaire.",
  },
];

export default async function RagLessonPage({
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
    redirect("/formation/rag");
  }

  const lessonCompleted =
    completedIds.has(lesson.id);

  const lessonProgress =
    progressData?.find(
      (item) => item.lesson_id === lesson.id
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

  const moduleProgress = Math.round(
    (completedCount / lessons.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/formation/rag"
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

        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              MODULE 11 · LEÇON {lesson.number}
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">

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
                          {String(index + 1).padStart(2, "0")}
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
                          content.architecture.length - 1 && (
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

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                COMPRENDRE L&apos;EXEMPLE
              </p>

              <p className="mt-4 leading-7 text-slate-500">
                {content.exampleExplanation}
              </p>
            </section>

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
                  href={`/formation/rag/${lesson.slug}/exercice`}
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
                  Construisez votre pipeline RAG
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Vous devrez reconstruire la chaîne complète depuis
                  l&apos;import d&apos;un document jusqu&apos;à la réponse finale.
                </p>

                <Link
                  href="/formation/rag/07/projet"
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Revoir le projet →"
                    : "Commencer le mini-projet →"}
                </Link>
              </section>
            )}

            {lessonCompleted && (
              <div>
                {nextLesson ? (
                  <Link
                    href={`/formation/rag/${nextLesson.slug}`}
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

          <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                ✦
              </div>

              <div>
                <p className="font-bold">
                  Coach RAG
                </p>

                <p className="text-xs text-slate-400">
                  Leçon {lesson.number}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Posez une question sur les chunks, embeddings,
              vecteurs ou la recherche sémantique.
            </div>

            <textarea
              placeholder="Ex : pourquoi faut-il découper le document ?"
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

function getLessonContent(slug: string) {
  const contents = {
    "01": {
      heading:
        "RAG signifie Retrieval-Augmented Generation.",
      introduction:
        "L’idée est simple : avant de demander au modèle de répondre, votre application recherche des informations pertinentes dans une source externe puis les ajoute au contexte.",
      points: [
        {
          title: "Retrieval",
          text: "Le système recherche les passages les plus pertinents.",
        },
        {
          title: "Augmented",
          text: "La question est enrichie avec les informations récupérées.",
        },
        {
          title: "Generation",
          text: "Le modèle génère ensuite sa réponse à partir de ce contexte.",
        },
        {
          title: "Documents privés",
          text: "Le RAG permet d’exploiter des données que le modèle n’a pas nécessairement connues pendant son entraînement.",
        },
      ],
      exampleTitle:
        "Pipeline RAG simplifié",
      architecture: [
        "Question",
        "Recherche",
        "Passages",
        "Contexte",
        "LLM",
        "Réponse",
      ],
      code: "",
      exampleExplanation:
        "Le modèle ne parcourt pas directement tout le document. Une étape de recherche sélectionne d’abord les passages les plus utiles.",
    },

    "02": {
      heading:
        "Un grand document est généralement découpé en morceaux.",
      introduction:
        "Ces morceaux sont appelés chunks. Ils permettent d’indexer et de rechercher des passages précis plutôt que de manipuler le document entier à chaque question.",
      points: [
        {
          title: "Chunk",
          text: "Un chunk est une portion du document.",
        },
        {
          title: "Taille",
          text: "Un chunk doit être assez grand pour conserver du sens mais pas inutilement énorme.",
        },
        {
          title: "Overlap",
          text: "Un léger chevauchement peut éviter de perdre une idée située entre deux chunks.",
        },
        {
          title: "Métadonnées",
          text: "On peut conserver la page, le fichier ou la section d’origine avec chaque chunk.",
        },
      ],
      exampleTitle:
        "Découpage d’un document",
      architecture: [
        "Document",
        "Chunk 1",
        "Chunk 2",
        "Chunk 3",
        "Chunk 4",
      ],
      code: `Document :
"Les congés annuels sont..."

Découpage :

Chunk 1 :
"Les congés annuels sont..."

Chunk 2 :
"Les demandes doivent être..."

Chunk 3 :
"En cas d'absence..."`,
      exampleExplanation:
        "Au lieu de chercher dans un énorme bloc de texte, l’application peut comparer la question à plusieurs passages plus ciblés.",
    },

    "03": {
      heading:
        "Un embedding représente le sens d’un texte sous forme de nombres.",
      introduction:
        "Un modèle d’embedding transforme une phrase ou un chunk en vecteur numérique. Des textes proches en sens auront généralement des représentations proches dans l’espace vectoriel.",
      points: [
        {
          title: "Texte",
          text: "Le système part d’une phrase ou d’un chunk.",
        },
        {
          title: "Modèle d’embedding",
          text: "Un modèle transforme ce texte en représentation numérique.",
        },
        {
          title: "Vecteur",
          text: "Le résultat est une liste de nombres.",
        },
        {
          title: "Sens",
          text: "La proximité entre vecteurs permet de comparer la similarité sémantique.",
        },
      ],
      exampleTitle:
        "Texte vers vecteur",
      architecture: [
        "Texte",
        "Embedding model",
        "Vecteur",
      ],
      code: `"Le salarié possède 25 jours de congés"

        ↓ embedding

[
  0.18,
  -0.42,
  0.73,
  ...
]`,
      exampleExplanation:
        "Les nombres ne sont pas destinés à être interprétés individuellement. C’est la position globale du vecteur qui permet de comparer le texte à d’autres textes.",
    },

    "04": {
      heading:
        "La recherche sémantique compare le sens plutôt que seulement les mots.",
      introduction:
        "Une question peut employer des mots différents du document tout en parlant du même sujet. Les embeddings permettent de retrouver des passages proches sémantiquement.",
      points: [
        {
          title: "Question",
          text: "La question utilisateur reçoit elle aussi un embedding.",
        },
        {
          title: "Comparaison",
          text: "Son vecteur est comparé aux vecteurs des chunks.",
        },
        {
          title: "Similarité",
          text: "Les chunks les plus proches obtiennent les meilleurs scores.",
        },
        {
          title: "Top K",
          text: "On récupère généralement quelques passages parmi les plus pertinents.",
        },
      ],
      exampleTitle:
        "Question et passages",
      architecture: [
        "Question",
        "Embedding",
        "Similarité",
        "Top chunks",
      ],
      code: `Question :
"Combien de jours puis-je partir en congé ?"

Document :
"Le salarié bénéficie de 25 jours de congés annuels."

Même sans utiliser exactement les mêmes mots,
les deux textes peuvent être proches sémantiquement.`,
      exampleExplanation:
        "Une recherche uniquement basée sur des mots exacts pourrait rater certaines formulations. La recherche sémantique cherche plutôt la proximité de sens.",
    },

    "05": {
      heading:
        "Une base vectorielle permet de stocker et rechercher les embeddings.",
      introduction:
        "Chaque chunk peut être enregistré avec son texte, ses métadonnées et son vecteur. Une recherche vectorielle permet ensuite de récupérer les chunks les plus similaires à la question.",
      points: [
        {
          title: "Chunk",
          text: "Le texte original doit être conservé.",
        },
        {
          title: "Embedding",
          text: "Le vecteur du chunk est stocké avec celui-ci.",
        },
        {
          title: "Métadonnées",
          text: "On peut conserver le fichier, la page ou le propriétaire.",
        },
        {
          title: "Recherche",
          text: "La base retourne les vecteurs les plus proches du vecteur de la question.",
        },
      ],
      exampleTitle:
        "Structure logique",
      architecture: null,
      code: `documents

id
user_id
content
source
page
embedding

Question
   ↓
embedding question
   ↓
recherche vectorielle
   ↓
top chunks`,
      exampleExplanation:
        "La base ne remplace pas le modèle. Elle sert principalement à retrouver les informations que l’on donnera ensuite au modèle.",
    },

    "06": {
      heading:
        "Le pipeline RAG relie ingestion, recherche et génération.",
      introduction:
        "Une partie du pipeline prépare les documents. Une autre partie est exécutée lorsqu’un utilisateur pose une question.",
      points: [
        {
          title: "Ingestion",
          text: "Les documents sont lus, découpés, transformés en embeddings puis stockés.",
        },
        {
          title: "Question",
          text: "La question est transformée en embedding.",
        },
        {
          title: "Retrieval",
          text: "La base retourne les passages les plus pertinents.",
        },
        {
          title: "Generation",
          text: "Le modèle reçoit la question et ces passages comme contexte.",
        },
      ],
      exampleTitle:
        "Pipeline complet",
      architecture: [
        "Question",
        "Embedding",
        "Vector DB",
        "Chunks",
        "Contexte",
        "LLM",
        "Réponse",
      ],
      code: `const chunks =
  await searchSimilarChunks(
    question
  );

const context =
  chunks
    .map((chunk) => chunk.content)
    .join("\\n\\n");

const prompt = \`
Contexte :
\${context}

Question :
\${question}

Réponds uniquement à partir du contexte.
\`;`,
      exampleExplanation:
        "Le contexte récupéré est intégré à la demande envoyée au modèle. Le système peut aussi demander explicitement au modèle de signaler lorsque les documents ne permettent pas de répondre.",
    },

    "07": {
      heading:
        "Vous allez reconstruire la logique complète d’un assistant documentaire.",
      introduction:
        "Le mini-projet combinera documents, chunks, embeddings, base vectorielle, recherche sémantique et génération.",
      points: [
        {
          title: "Ingestion",
          text: "Transformer le document en chunks indexables.",
        },
        {
          title: "Embedding",
          text: "Créer une représentation numérique de chaque chunk.",
        },
        {
          title: "Retrieval",
          text: "Retrouver les passages pertinents pour la question.",
        },
        {
          title: "Generation",
          text: "Fournir les passages au LLM et générer la réponse finale.",
        },
      ],
      exampleTitle:
        "Architecture finale",
      architecture: [
        "Document",
        "Chunks",
        "Embeddings",
        "Vector DB",
        "Question",
        "Recherche",
        "Contexte",
        "LLM",
      ],
      code: `DOCUMENT
   ↓
CHUNKS
   ↓
EMBEDDINGS
   ↓
VECTOR DB

QUESTION
   ↓
EMBEDDING
   ↓
RECHERCHE
   ↓
TOP CHUNKS
   ↓
CONTEXTE
   ↓
LLM
   ↓
RÉPONSE`,
      exampleExplanation:
        "Le RAG ajoute une étape de récupération de connaissances avant la génération. Cette architecture est particulièrement utile lorsqu’une application doit répondre à partir de documents spécifiques.",
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}