import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  isValidLessonCompletion,
  moduleLessonIds,
} from "@/lib/training/catalog";

// ======================================================
// MODULE 06 — SITE WEB OBLIGATOIRE
// ======================================================

const previousModuleLessons = moduleLessonIds[6];
const officialModuleLessons = moduleLessonIds[7];

// ======================================================
// MODULE 07 — API & IA
// ======================================================

const lessons = [
  {
    id: "api-01-intro",
    number: "01",
    title: "Structurer LaunchCraft et créer l’interface initiale",
    duration: "50 min",
    description:
      "Créez le projet Next.js puis construisez son premier shell sombre et responsive.",
    type: "Next.js + interface",
  },
  {
    id: "api-02-http",
    number: "02",
    title: "Concevoir la base de données et ses protections",
    duration: "60 min",
    description:
      "Créez le modèle Supabase séparé de LaunchCraft, ses relations, contraintes et politiques RLS.",
    type: "Supabase + sécurité",
  },
  {
    id: "api-03-requests",
    number: "03",
    title: "Inscription, connexion et protection des routes",
    duration: "75 min",
    description:
      "Connectez LaunchCraft à Supabase Auth puis protégez le dashboard côté serveur.",
    type: "Supabase Auth",
  },
  {
    id: "api-04-status",
    number: "04",
    title: "Création et gestion des projets",
    duration: "90 min",
    description:
      "Créez un CRUD sécurisé qui isole strictement les projets de chaque compte.",
    type: "Server Actions + RLS",
  },
  {
    id: "api-05-keys-env",
    number: "05",
    title: "Créer et valider les objectifs d’un projet",
    duration: "90 min",
    description:
      "Ajoutez des objectifs sécurisés et calculez la progression réelle de chaque projet.",
    type: "Relations + Server Actions",
  },
  {
    id: "api-06-ai-call",
    number: "06",
    title: "Créer, prioriser et terminer les tâches",
    duration: "100 min",
    description:
      "Construisez le plan d’action réel de chaque projet avec statuts, priorités et échéances.",
    type: "Tâches + indicateurs",
  },
  {
    id: "api-07-project",
    number: "07",
    title: "Construire le dashboard réel de LaunchCraft",
    duration: "90 min",
    description:
      "Synthétisez les données Supabase en indicateurs, échéances et projets récents.",
    type: "Dashboard serveur",
  },
  {
    id: "api-08-calendar",
    number: "08",
    title: "Calendrier : organiser les échéances",
    duration: "100 min",
    description:
      "Visualisez objectifs et tâches dans une vue mensuelle accessible et isolée par compte.",
    type: "Dates + calendrier",
  },
  {
    id: "api-09-security",
    number: "09",
    title: "Sécurité finale et validation de LaunchCraft",
    duration: "110 min",
    description:
      "Testez l’isolation, les accès directs, l’accessibilité, les états et le responsive de l’application finale.",
    type: "Audit + finalisation",
  },
];

export default async function APIIAModulePage() {
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
      .select("lesson_id, completed, completed_at")
      .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => isValidLessonCompletion(item))
      .map((item) => item.lesson_id) ?? []
  );

  const pythonCompleted =
    previousModuleLessons.every((lessonId) =>
      completedIds.has(lessonId)
    );

  if (!pythonCompleted) {
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

  const completedCount = officialModuleLessons.filter((lessonId) =>
    completedIds.has(lessonId)
  ).length;

  const progress = Math.round(
    (completedCount / officialModuleLessons.length) * 100
  );

  const moduleCompleted =
    completedCount === officialModuleLessons.length;

  const nextLesson =
    lessonStates.find(
      (lesson) =>
        lesson.status === "current"
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white xl:block">

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
                  Module 07
                </p>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                API & IA
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Connectez vos programmes au monde extérieur
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Découvrez comment récupérer des données,
                communiquer avec des services externes et
                connecter votre code à une intelligence artificielle.
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
                  {completedCount} / {officialModuleLessons.length} checkpoints
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
                  href={`/formation/api-ia/${lesson.number}`}
                />
              ))}

            </div>

          </div>

        </aside>

        {/* CONTENU */}

        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8 2xl:px-10">

          <div className="mx-auto w-full max-w-[1320px]">

            {/* TOP BAR */}

            <div className="flex items-center justify-between">

              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
              >
                ← Retour au dashboard
              </Link>

              <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
                Module 07
              </span>

            </div>

            {/* HERO */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 07
              </p>

              <h1 className="mt-4 text-4xl font-bold">
                API & IA
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Jusqu&apos;ici, vos données étaient écrites
                directement dans votre programme Python.
                Maintenant, vous allez apprendre à les récupérer
                depuis de véritables services externes.
              </p>

              {/* SCHÉMA */}

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  COMMENT UNE API S&apos;INTÈGRE DANS UNE APPLICATION
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">

                  <FlowStep text="Votre programme" />
                  <Arrow />
                  <FlowStep text="Requête HTTP" />
                  <Arrow />
                  <FlowStep text="API" />
                  <Arrow />
                  <FlowStep text="Données JSON" />
                  <Arrow />
                  <FlowStep text="Votre logique" />

                </div>

              </div>

              {/* CODE PREVIEW */}

              <div className="mt-6 max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                <div className="border-b border-slate-800 px-5 py-3">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    BIENTÔT DANS CE MODULE
                  </p>

                </div>

                <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                  <code>{`import requests

response = requests.get(
    "https://api.exemple.com/appartements/71"
)

appartement = response.json()

if appartement["prix"] <= 2000:
    print("Appartement compatible")
else:
    print("Appartement trop cher")`}</code>
                </pre>

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
                  {completedCount} / {officialModuleLessons.length} checkpoints terminés
                </p>

                {nextLesson && (
                  <Link
                    href={`/formation/api-ia/${nextLesson.number}`}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    {completedCount === 0
                      ? "Commencer les API →"
                      : "Continuer →"}
                  </Link>
                )}

              </div>

            </section>

            {/* POURQUOI */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                POURQUOI LES API ?
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Une compétence centrale pour construire des applications IA
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Une API permet à votre application de demander
                automatiquement quelque chose à un autre système.
                C&apos;est l&apos;une des briques fondamentales des
                SaaS, agents IA et automatisations modernes.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <SkillCard
                  title="Récupérer"
                  description="Obtenir des données depuis un service externe."
                />

                <SkillCard
                  title="Envoyer"
                  description="Transmettre des informations à une application."
                />

                <SkillCard
                  title="IA"
                  description="Envoyer un prompt et récupérer une réponse."
                />

                <SkillCard
                  title="SaaS"
                  description="Connecter votre application à plusieurs services."
                />

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
                    De votre premier GET à une API d&apos;IA
                  </h2>

                </div>

                <p className="text-sm text-slate-400">
                  {completedCount} / {officialModuleLessons.length} terminés
                </p>

              </div>

              <div className="mt-7 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">

                {lessonStates.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    number={lesson.number}
                    title={lesson.title}
                    description={lesson.description}
                    duration={lesson.duration}
                    type={lesson.type}
                    status={lesson.status}
                    href={`/formation/api-ia/${lesson.number}`}
                    project={lesson.number === "07"}
                  />
                ))}

              </div>

            </section>

            {/* ARCHITECTURE */}

            <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À LA FIN DU MODULE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Vous comprendrez cette architecture
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Le même principe sera ensuite réutilisé dans votre
                SaaS et dans vos futurs agents IA.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">

                <LightStep text="Utilisateur" />
                <ArrowDark />
                <LightStep text="Application" />
                <ArrowDark />
                <LightStep text="Backend" />
                <ArrowDark />
                <LightStep text="API IA" />
                <ArrowDark />
                <LightStep text="Réponse" />

              </div>

            </section>

            {/* NEXT */}

            <section className="mt-6 rounded-[30px] bg-slate-950 p-8 text-white">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                PROCHAINE ÉTAPE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Module 08 — Bases de données & Supabase
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Une API permet de récupérer et d&apos;envoyer des
                informations. Le module suivant vous apprendra à
                conserver ces informations durablement dans une
                base de données et à les associer à vos utilisateurs.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">

                <span className="rounded-xl bg-slate-900 px-4 py-3">
                  API
                </span>

                <span className="text-slate-600">
                  →
                </span>

                <span className="rounded-xl bg-slate-900 px-4 py-3">
                  Données
                </span>

                <span className="text-slate-600">
                  →
                </span>

                <span className="rounded-xl bg-slate-900 px-4 py-3">
                  Supabase
                </span>

                <span className="text-slate-600">
                  →
                </span>

                <span className="rounded-xl bg-slate-900 px-4 py-3">
                  SaaS
                </span>

              </div>

            </section>

            {/* MODULE TERMINÉ */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 07 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous savez connecter votre code à des services externes.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous comprenez désormais les requêtes HTTP,
                  les réponses JSON, l&apos;authentification API et
                  les appels vers des services d&apos;IA. Vous allez
                  maintenant apprendre à stocker durablement vos données.
                </p>

                <Link
                  href="/formation/supabase"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 08 →
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
      className={`flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition sm:p-6 ${
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

      <h3 className="mt-5 text-xl font-semibold leading-7">
        {title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

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
// SKILLS
// ======================================================

function SkillCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        API
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

function FlowStep({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
      {text}
    </div>
  );
}

function LightStep({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
      {text}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}

function ArrowDark() {
  return (
    <span className="text-slate-400">
      →
    </span>
  );
}
