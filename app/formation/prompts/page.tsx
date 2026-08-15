import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const previousModuleLessons = [
  "chatgpt-01-intro",
  "chatgpt-02-interface",
  "chatgpt-03-prompt",
  "chatgpt-04-contexte",
  "chatgpt-05-format",
];

const lessons = [
  {
    id: "prompts-01-structure",
    number: "01",
    title: "La structure d’un bon prompt",
    duration: "10 min",
  },
  {
    id: "prompts-02-role",
    number: "02",
    title: "Attribuer un rôle à l’IA",
    duration: "9 min",
  },
  {
    id: "prompts-03-templates",
    number: "03",
    title: "Créer des prompts réutilisables",
    duration: "12 min",
  },
  {
    id: "prompts-04-iteration",
    number: "04",
    title: "Améliorer une réponse",
    duration: "11 min",
  },
  {
    id: "prompts-05-project",
    number: "05",
    title: "Projet pratique",
    duration: "15 min",
  },
];

export default async function PromptsModulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: progressData, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur progression :", error);
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => item.completed)
      .map((item) => item.lesson_id) ?? []
  );

  if (completedIds.has("chatgpt-prompt-01")) {
    completedIds.add("chatgpt-03-prompt");
  }

  const module1Completed = previousModuleLessons.every(
    (lessonId) => completedIds.has(lessonId)
  );

  if (!module1Completed) {
    redirect("/dashboard");
  }

  const lessonStates = lessons.map((lesson, index) => {
    const completed = completedIds.has(lesson.id);

    const previousCompleted =
      index === 0 ||
      completedIds.has(lessons[index - 1].id);

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

  const completedCount = lessonStates.filter(
    (lesson) => lesson.status === "done"
  ).length;

  const progress = Math.round(
    (completedCount / lessons.length) * 100
  );

  const moduleCompleted =
    completedCount === lessons.length;

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
                  Module 02
                </p>
              </div>
            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MAÎTRISER LES PROMPTS
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Communiquer efficacement avec l’IA
              </h1>

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
                    className="h-full rounded-full bg-slate-950 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

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
                  href={`/formation/prompts/${lesson.number}`}
                />
              ))}

            </div>

          </div>

        </aside>

        {/* CONTENU */}

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
                Module 02
              </span>

            </div>

            {/* HERO */}

            <section className="mt-10 rounded-[32px] bg-slate-950 p-10 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 02
              </p>

              <h1 className="mt-4 text-4xl font-bold">
                Maîtriser les prompts
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                Apprenez à donner des instructions plus précises,
                à structurer vos demandes et à obtenir des réponses
                vraiment utiles.
              </p>

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
                    className="h-full rounded-full bg-white transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

            </section>

            {/* PROGRAMME */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                PROGRAMME
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Les leçons
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {lessonStates.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    number={lesson.number}
                    title={lesson.title}
                    duration={lesson.duration}
                    status={lesson.status}
                    href={`/formation/prompts/${lesson.number}`}
                  />
                ))}

              </div>

            </section>

            {/* MODULE TERMINÉ */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 02 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous maîtrisez les bases du prompting.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous savez maintenant structurer une demande,
                  attribuer un rôle à l&apos;IA, créer des prompts
                  réutilisables et améliorer progressivement une réponse.
                </p>

                <Link
                  href="/formation/quotidien"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 03 →
                </Link>

              </section>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

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
  const locked = status === "locked";
  const done = status === "done";
  const current = status === "current";

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
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {done ? "✓" : locked ? "🔒" : number}
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

function LessonCard({
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
  const locked = status === "locked";
  const done = status === "done";

  const content = (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition ${
        locked
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
    >

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold">
          {locked ? "🔒" : done ? "✓" : number}
        </div>

        <span className="text-sm text-slate-400">
          {duration}
        </span>

      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm text-slate-500">
        {done
          ? "Leçon terminée"
          : locked
          ? "Terminez la leçon précédente"
          : "Disponible"}
      </p>

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