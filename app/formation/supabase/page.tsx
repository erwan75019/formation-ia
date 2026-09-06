import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion, moduleLessonIds } from "@/lib/training/catalog";

// ======================================================
// MODULE 07 — API & IA OBLIGATOIRE
// ======================================================

const previousModuleLessons = moduleLessonIds[7];

// ======================================================
// MODULE 08 — BASES DE DONNÉES & SUPABASE
// ======================================================

const lessons = [
  {
    id: "supabase-01-database",
    number: "01",
    title: "Comprendre une base de données",
    duration: "14 min",
    description:
      "Découvrez tables, lignes, colonnes et la manière dont une application organise ses données.",
    type: "Fondamentaux",
  },
  {
    id: "supabase-02-tables",
    number: "02",
    title: "Créer des tables et des colonnes",
    duration: "18 min",
    description:
      "Apprenez à concevoir une table propre avec des types de données adaptés.",
    type: "Pratique",
  },
  {
    id: "supabase-03-crud",
    number: "03",
    title: "CRUD : créer, lire, modifier et supprimer",
    duration: "20 min",
    description:
      "Comprenez les quatre opérations fondamentales utilisées par presque toutes les applications.",
    type: "Code + pratique",
  },
  {
    id: "supabase-04-relations",
    number: "04",
    title: "Relations entre les données",
    duration: "18 min",
    description:
      "Apprenez à relier des utilisateurs, projets, commandes ou autres ressources.",
    type: "Architecture",
  },
  {
    id: "supabase-05-auth",
    number: "05",
    title: "Authentification et utilisateurs",
    duration: "20 min",
    description:
      "Comprenez comment gérer les comptes utilisateurs et associer des données à chaque personne.",
    type: "Auth",
  },
  {
    id: "supabase-06-rls",
    number: "06",
    title: "Sécuriser avec RLS",
    duration: "22 min",
    description:
      "Apprenez pourquoi une base de données doit contrôler précisément quelles lignes chaque utilisateur peut lire ou modifier.",
    type: "Sécurité",
  },
  {
    id: "supabase-07-project",
    number: "07",
    title: "Mini-projet : base de données d’un SaaS",
    duration: "40 min",
    description:
      "Concevez la structure de données d’une application avec utilisateurs, ressources et règles de sécurité.",
    type: "Mini-projet",
  },
];

export default async function SupabaseModulePage() {
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

  const apiCompleted =
    previousModuleLessons.every((lessonId) =>
      completedIds.has(lessonId)
    );

  if (!apiCompleted) {
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
                  Module 08
                </p>
              </div>

            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                BASES DE DONNÉES
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Donnez une mémoire à vos applications
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Apprenez à stocker les utilisateurs,
                les projets et toutes les données nécessaires
                au fonctionnement d&apos;un véritable SaaS.
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
                  href={`/formation/supabase/${lesson.number}`}
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
                Module 08
              </span>

            </div>

            {/* HERO */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 08
              </p>

              <h1 className="mt-4 text-4xl font-bold">
                Bases de données & Supabase
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Une application devient réellement utile lorsqu&apos;elle
                peut conserver les informations de ses utilisateurs.
                Vous allez maintenant apprendre comment organiser,
                lire, modifier et sécuriser ces données.
              </p>

              {/* ARCHITECTURE */}

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  ARCHITECTURE
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">

                  <FlowStep text="Utilisateur" />
                  <Arrow />
                  <FlowStep text="SaaS" />
                  <Arrow />
                  <FlowStep text="Backend" />
                  <Arrow />
                  <FlowStep text="Supabase" />
                  <Arrow />
                  <FlowStep text="Données" />

                </div>

              </div>

              {/* TABLE */}

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">

                <div className="bg-slate-900 px-5 py-4">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    EXEMPLE — TABLE PROJETS
                  </p>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[650px] text-left text-sm">

                    <thead className="bg-slate-900 text-slate-500">

                      <tr>

                        <th className="px-5 py-4 font-medium">
                          id
                        </th>

                        <th className="px-5 py-4 font-medium">
                          user_id
                        </th>

                        <th className="px-5 py-4 font-medium">
                          nom
                        </th>

                        <th className="px-5 py-4 font-medium">
                          statut
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-300">

                      <tr>

                        <td className="px-5 py-4">
                          101
                        </td>

                        <td className="px-5 py-4">
                          usr_42
                        </td>

                        <td className="px-5 py-4">
                          Assistant commercial
                        </td>

                        <td className="px-5 py-4">
                          actif
                        </td>

                      </tr>

                      <tr>

                        <td className="px-5 py-4">
                          102
                        </td>

                        <td className="px-5 py-4">
                          usr_18
                        </td>

                        <td className="px-5 py-4">
                          Analyse documents
                        </td>

                        <td className="px-5 py-4">
                          brouillon
                        </td>

                      </tr>

                    </tbody>

                  </table>

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
                    href={`/formation/supabase/${nextLesson.number}`}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    {completedCount === 0
                      ? "Commencer →"
                      : "Continuer →"}
                  </Link>
                )}

              </div>

            </section>

            {/* CONCEPTS */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                CE QUE VOUS ALLEZ APPRENDRE
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Les fondations d&apos;une vraie application
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                À la fin du module, vous comprendrez comment
                organiser vos données et surtout comment empêcher
                un utilisateur d&apos;accéder aux données d&apos;un autre.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <SkillCard
                  title="Tables"
                  description="Structurer proprement les données."
                />

                <SkillCard
                  title="CRUD"
                  description="Créer, lire, modifier et supprimer."
                />

                <SkillCard
                  title="Auth"
                  description="Identifier les utilisateurs."
                />

                <SkillCard
                  title="RLS"
                  description="Contrôler précisément l’accès aux lignes."
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
                    De la première table à une base sécurisée
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
                    href={`/formation/supabase/${lesson.number}`}
                    project={lesson.number === "07"}
                  />
                ))}

              </div>

            </section>

            {/* MINI PROJET */}

            <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

                <div>

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    MINI-PROJET
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Concevoir la base de données d&apos;un SaaS IA
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                    Vous devrez définir quelles tables sont nécessaires,
                    comment elles sont reliées aux utilisateurs et quelles
                    règles empêchent un utilisateur de consulter les
                    données des autres.
                  </p>

                </div>

                <div className="shrink-0 rounded-2xl bg-slate-950 px-7 py-5 text-white">

                  <p className="text-xs font-semibold text-slate-400">
                    PROJET
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    Leçon 07
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Architecture + sécurité
                  </p>

                </div>

              </div>

            </section>

            {/* NEXT */}

            <section className="mt-6 rounded-[30px] bg-slate-950 p-8 text-white">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                ENSUITE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Module 09 — Créer un SaaS IA
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                Après ce module, vous aurez toutes les briques
                fondamentales : Python, API, authentification et base
                de données. Il sera alors temps de les assembler dans
                une véritable application SaaS.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">

                <DarkStep text="Frontend" />
                <Arrow />
                <DarkStep text="Backend" />
                <Arrow />
                <DarkStep text="Supabase" />
                <Arrow />
                <DarkStep text="API IA" />
                <Arrow />
                <DarkStep text="SaaS" />

              </div>

            </section>

            {/* MODULE TERMINÉ */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 08 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Votre application peut maintenant conserver et protéger des données.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous savez structurer une base, gérer les utilisateurs
                  et contrôler l&apos;accès aux données. Vous disposez
                  maintenant des briques nécessaires pour construire
                  un véritable SaaS IA.
                </p>

                <Link
                  href="/formation/saas-ia"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 09 →
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
// SIDEBAR ITEM
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
        DB
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

function DarkStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-900 px-4 py-3">
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
