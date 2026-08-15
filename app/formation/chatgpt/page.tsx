import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const lessons = [
  {
    slug: "01",
    id: "chatgpt-01-intro",
    number: "01",
    title: "Qu’est-ce que ChatGPT ?",
    duration: "6 min",
    description:
      "Découvrez simplement ce qu’est ChatGPT, ce qu’il peut faire et ses principales limites.",
  },
  {
    slug: "02",
    id: "chatgpt-02-interface",
    number: "02",
    title: "Découvrir l’interface",
    duration: "8 min",
    description:
      "Apprenez à utiliser une conversation, retrouver vos échanges et fournir des informations à ChatGPT.",
  },
  {
    slug: "03",
    id: "chatgpt-03-prompt",
    number: "03",
    title: "Écrire son premier prompt",
    duration: "8 min",
    description:
      "Comprenez comment formuler une demande simple pour obtenir une réponse plus utile.",
  },
  {
    slug: "04",
    id: "chatgpt-04-contexte",
    number: "04",
    title: "Donner du contexte",
    duration: "8 min",
    description:
      "Voyez comment quelques informations supplémentaires peuvent complètement améliorer une réponse.",
  },
  {
    slug: "05",
    id: "chatgpt-05-format",
    number: "05",
    title: "Demander un format précis",
    duration: "7 min",
    description:
      "Apprenez à demander un tableau, une liste, un résumé, un email ou des étapes.",
  },
];

type LessonStatus =
  | "done"
  | "current"
  | "locked";

export default async function ChatGPTCourse() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, score")
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur progression :",
      progressError
    );
  }

  const completedLessonIds = new Set(
    progressData
      ?.filter(
        (lesson) => lesson.completed
      )
      .map(
        (lesson) => lesson.lesson_id
      ) ?? []
  );

  // Compatibilité ancien identifiant
  if (
    completedLessonIds.has(
      "chatgpt-prompt-01"
    )
  ) {
    completedLessonIds.add(
      "chatgpt-03-prompt"
    );
  }

  const lessonStates = lessons.map(
    (lesson, index) => {
      const completed =
        completedLessonIds.has(
          lesson.id
        );

      const previousCompleted =
        index === 0 ||
        completedLessonIds.has(
          lessons[index - 1].id
        );

      const status: LessonStatus =
        completed
          ? "done"
          : previousCompleted
          ? "current"
          : "locked";

      const progress =
        progressData?.find(
          (item) =>
            item.lesson_id ===
            lesson.id
        );

      return {
        ...lesson,
        status,
        score:
          progress?.score ?? null,
      };
    }
  );

  const completedCount =
    lessonStates.filter(
      (lesson) =>
        lesson.status === "done"
    ).length;

  const moduleProgress = Math.round(
    (completedCount /
      lessons.length) *
      100
  );

  const currentLesson =
    lessonStates.find(
      (lesson) =>
        lesson.status === "current"
    );

  const moduleCompleted =
    completedCount ===
    lessons.length;

  const totalMinutes =
    lessons.reduce(
      (total, lesson) =>
        total +
        Number(
          lesson.duration.split(
            " "
          )[0]
        ),
      0
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      <div className="flex min-h-screen">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

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
                  Module 01
                </p>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                DÉCOUVRIR CHATGPT
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Prenez ChatGPT en main
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Découvrez les bases nécessaires pour utiliser
                ChatGPT efficacement avant de passer aux
                techniques de prompting.
              </p>

              <div className="mt-6">

                <div className="mb-2 flex justify-between text-xs text-slate-400">

                  <span>
                    Progression
                  </span>

                  <span>
                    {moduleProgress}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{
                      width: `${moduleProgress}%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {completedCount} / {lessons.length} leçons
                </p>

              </div>

            </div>

          </div>

          {/* LEÇONS */}

          <div className="border-t border-slate-100 p-4">

            <div className="space-y-2">

              {lessonStates.map(
                (lesson) => (
                  <SidebarLesson
                    key={lesson.id}
                    number={lesson.number}
                    title={lesson.title}
                    duration={lesson.duration}
                    status={lesson.status}
                    href={`/formation/chatgpt/${lesson.slug}`}
                  />
                )
              )}

            </div>

          </div>

        </aside>

        {/* ==================================================
            CONTENU
        ================================================== */}

        <section className="flex-1 px-6 py-8 lg:px-10">

          <div className="mx-auto max-w-6xl">

            {/* TOP */}

            <div className="flex items-center justify-between">

              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
              >
                ← Retour au dashboard
              </Link>

              <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
                Module 01
              </span>

            </div>

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  Débutant
                </span>

                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {lessons.length} leçons
                </span>

                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  ~{totalMinutes} min
                </span>

              </div>

              <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-slate-500">
                MODULE 01
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-5xl">
                Découvrir ChatGPT
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Comprenez ce qu&apos;est ChatGPT,
                apprenez à utiliser une conversation
                et découvrez les principes fondamentaux
                permettant d&apos;obtenir des réponses utiles.
              </p>

              {/* PROGRESSION */}

              <div className="mt-8 max-w-xl">

                <div className="mb-2 flex justify-between text-sm">

                  <span className="text-slate-400">
                    Progression
                  </span>

                  <span>
                    {moduleProgress}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width: `${moduleProgress}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">

                <p className="text-sm text-slate-400">
                  {completedCount} / {lessons.length} leçons terminées
                </p>

                {!moduleCompleted &&
                  currentLesson && (
                    <Link
                      href={`/formation/chatgpt/${currentLesson.slug}`}
                      className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                    >
                      {completedCount === 0
                        ? "Commencer →"
                        : "Continuer →"}
                    </Link>
                  )}

                {moduleCompleted && (
                  <div className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                    ✓ Module terminé
                  </div>
                )}

              </div>

            </section>

            {/* ==================================================
                OBJECTIFS
            ================================================== */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                OBJECTIFS
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Les bases essentielles
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Ce premier module reste volontairement simple.
                Vous devez comprendre les principes fondamentaux
                avant de passer au module consacré aux prompts.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <SkillCard
                  code="01"
                  title="Comprendre"
                  text="Savoir ce qu’est ChatGPT et comment il fonctionne globalement."
                />

                <SkillCard
                  code="02"
                  title="Utiliser"
                  text="Être à l’aise avec une conversation et l’interface."
                />

                <SkillCard
                  code="03"
                  title="Demander"
                  text="Savoir formuler une demande simple et compréhensible."
                />

                <SkillCard
                  code="04"
                  title="Structurer"
                  text="Demander une réponse présentée dans le bon format."
                />

              </div>

            </section>

            {/* ==================================================
                PROGRAMME
            ================================================== */}

            <section className="mt-12">

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                <div>

                  <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                    PROGRAMME
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Les 5 leçons
                  </h2>

                </div>

                <p className="text-sm text-slate-400">
                  {completedCount} / {lessons.length} terminées
                </p>

              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {lessonStates.map(
                  (lesson) => (
                    <LessonCard
                      key={lesson.id}
                      number={lesson.number}
                      title={lesson.title}
                      description={lesson.description}
                      duration={lesson.duration}
                      status={lesson.status}
                      score={lesson.score}
                      href={`/formation/chatgpt/${lesson.slug}`}
                    />
                  )
                )}

              </div>

            </section>

            {/* ==================================================
                MODULE TERMINÉ
            ================================================== */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 01 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous avez les bases.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous savez maintenant utiliser ChatGPT,
                  formuler une demande simple, fournir du contexte
                  et préciser le format attendu.
                </p>

                <Link
                  href="/formation/prompts"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 02 →
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

function SidebarLesson({
  number,
  title,
  duration,
  status,
  href,
}: {
  number: string;
  title: string;
  duration: string;
  status: LessonStatus;
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
  status,
  score,
  href,
}: {
  number: string;
  title: string;
  description: string;
  duration: string;
  status: LessonStatus;
  score: number | null;
  href: string;
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

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {duration}
        </span>

      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">

        <span className="text-sm font-semibold text-slate-700">

          {done
            ? "Terminée ✓"
            : locked
            ? "Verrouillée"
            : "Commencer →"}

        </span>

        {done &&
          score !== null && (
            <span className="text-sm font-semibold text-slate-500">
              Score : {score}%
            </span>
          )}

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
// SKILL CARD
// ======================================================

function SkillCard({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        {code}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}