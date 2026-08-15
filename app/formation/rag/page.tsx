import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 10 — PRÉREQUIS
// ======================================================

const previousModuleLessons = [
  "agents-01-agent-vs-chatbot",
  "agents-02-objective",
  "agents-03-tools",
  "agents-04-tool-calling",
  "agents-05-loop",
  "agents-06-memory-state",
  "agents-07-project",
];

// ======================================================
// MODULE 11 — RAG & DOCUMENTS
// ======================================================

const lessons = [
  {
    id: "rag-01-intro",
    number: "01",
    title: "Comprendre le RAG",
    duration: "18 min",
    description:
      "Comprenez comment une IA peut rechercher dans vos propres documents avant de répondre.",
    type: "Fondamentaux",
  },
  {
    id: "rag-02-chunks",
    number: "02",
    title: "Découper les documents",
    duration: "20 min",
    description:
      "Apprenez pourquoi un document est découpé en morceaux appelés chunks.",
    type: "Préparation",
  },
  {
    id: "rag-03-embeddings",
    number: "03",
    title: "Comprendre les embeddings",
    duration: "22 min",
    description:
      "Découvrez comment transformer le sens d’un texte en représentation numérique.",
    type: "Embeddings",
  },
  {
    id: "rag-04-semantic-search",
    number: "04",
    title: "Recherche sémantique",
    duration: "22 min",
    description:
      "Apprenez à retrouver les passages les plus proches du sens d’une question.",
    type: "Recherche",
  },
  {
    id: "rag-05-vector-db",
    number: "05",
    title: "Base de données vectorielle",
    duration: "24 min",
    description:
      "Comprenez comment stocker les chunks et leurs embeddings pour les rechercher efficacement.",
    type: "Vector DB",
  },
  {
    id: "rag-06-pipeline",
    number: "06",
    title: "Construire le pipeline RAG",
    duration: "26 min",
    description:
      "Assemblez question, embedding, recherche, contexte et génération.",
    type: "Architecture",
  },
  {
    id: "rag-07-project",
    number: "07",
    title: "Mini-projet : assistant documentaire",
    duration: "55 min",
    description:
      "Construisez la logique complète d’un assistant capable de répondre à partir de documents.",
    type: "Mini-projet",
  },
];

export default async function RagModulePage() {
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
                  Module 11
                </p>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                RAG & DOCUMENTS
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Connectez l’IA à vos propres connaissances
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Apprenez comment une IA peut retrouver les bons
                passages dans des documents avant de générer sa réponse.
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
                  href={`/formation/rag/${lesson.number}`}
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
                Module 11
              </span>

            </div>

            {/* HERO */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 11
              </p>

              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                RAG & documents
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Un modèle ne connaît pas automatiquement vos documents
                privés. Le RAG permet de retrouver les passages utiles
                puis de les fournir au modèle comme contexte.
              </p>

              <div className="mt-9 rounded-3xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  PIPELINE RAG
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">

                  <DarkStep text="Question" />
                  <Arrow />
                  <DarkStep text="Embedding" />
                  <Arrow />
                  <DarkStep text="Recherche" />
                  <Arrow />
                  <DarkStep text="Chunks" />
                  <Arrow />
                  <DarkStep text="LLM" />
                  <Arrow />
                  <DarkStep text="Réponse" />

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
                    href={`/formation/rag/${nextLesson.number}`}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    {completedCount === 0
                      ? "Commencer →"
                      : "Continuer →"}
                  </Link>
                )}

              </div>

            </section>

            {/* POURQUOI */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                POURQUOI LE RAG ?
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Donner les bonnes informations au modèle
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Au lieu d’envoyer un document entier au modèle,
                votre application recherche d’abord les passages
                les plus pertinents pour la question posée.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    SANS RAG
                  </p>

                  <h3 className="mt-3 text-xl font-bold">
                    Le modèle manque d’information
                  </h3>

                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    <LightStep text="Question" />
                    <ArrowLight />
                    <LightStep text="LLM" />
                    <ArrowLight />
                    <LightStep text="Réponse" />

                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-500">
                    Si la réponse dépend d’un document privé que le modèle
                    n’a jamais reçu, il ne peut pas s’appuyer dessus.
                  </p>

                </div>

                <div className="rounded-[26px] bg-slate-950 p-7 text-white shadow-xl">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    AVEC RAG
                  </p>

                  <h3 className="mt-3 text-xl font-bold">
                    Le modèle reçoit le contexte pertinent
                  </h3>

                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    <DarkStep text="Question" />
                    <Arrow />
                    <DarkStep text="Recherche" />
                    <Arrow />
                    <DarkStep text="Contexte" />
                    <Arrow />
                    <DarkStep text="LLM" />

                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-400">
                    Le système cherche d’abord les passages utiles puis
                    les ajoute au contexte du modèle.
                  </p>

                </div>

              </div>

            </section>

            {/* EXEMPLE */}

            <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                EXEMPLE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Assistant RH basé sur un règlement interne
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Imaginons qu’une entreprise possède un document de
                80 pages contenant ses règles internes.
              </p>

              <div className="mt-7 space-y-4">

                <PipelineStep
                  number="01"
                  title="Importer le document"
                  description="Le fichier est récupéré par l’application."
                />

                <PipelineStep
                  number="02"
                  title="Extraire le texte"
                  description="Le contenu exploitable du document est récupéré."
                />

                <PipelineStep
                  number="03"
                  title="Créer des chunks"
                  description="Le texte est découpé en passages plus petits."
                />

                <PipelineStep
                  number="04"
                  title="Créer les embeddings"
                  description="Chaque passage est transformé en représentation vectorielle."
                />

                <PipelineStep
                  number="05"
                  title="Rechercher"
                  description="La question utilisateur est comparée aux chunks."
                />

                <PipelineStep
                  number="06"
                  title="Générer"
                  description="Les meilleurs passages sont envoyés au LLM avec la question."
                />

              </div>

            </section>

            {/* PROGRAMME */}

            <section className="mt-10">

              <div className="flex items-end justify-between gap-4">

                <div>

                  <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                    PROGRAMME
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Du document brut à une réponse augmentée
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
                    href={`/formation/rag/${lesson.number}`}
                    project={lesson.number === "07"}
                  />
                ))}

              </div>

            </section>

            {/* MINI PROJET */}

            <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                MINI-PROJET
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Construire un assistant documentaire
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                Votre assistant recevra une question, recherchera les
                passages les plus pertinents dans une base vectorielle
                puis fournira ce contexte au modèle.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">

                <DarkStep text="PDF" />
                <Arrow />
                <DarkStep text="Chunks" />
                <Arrow />
                <DarkStep text="Embeddings" />
                <Arrow />
                <DarkStep text="Recherche" />
                <Arrow />
                <DarkStep text="LLM" />

              </div>

            </section>

            {/* MODULE SUIVANT */}

            <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                ENSUITE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Module 12 — Projet final
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Vous assemblerez les compétences de toute la formation
                dans une véritable application IA complète.
              </p>

            </section>

            {/* MODULE TERMINÉ */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 11 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous savez connecter une IA à vos propres connaissances.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous comprenez désormais les chunks, les embeddings,
                  la recherche sémantique, les bases vectorielles et la
                  construction d&apos;un pipeline RAG. Il ne reste plus
                  qu&apos;à assembler tout ce que vous avez appris.
                </p>

                <Link
                  href="/formation/projet-final"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 12 →
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
// PIPELINE STEP
// ======================================================

function PipelineStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
        {number}
      </div>

      <div>

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

// ======================================================
// SMALL COMPONENTS
// ======================================================

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