import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  isValidLessonCompletion,
  moduleLessonIds,
  webLessonCatalog,
} from "@/lib/training/catalog";

export default async function SiteWebModulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id);
  if (error) console.error("Erreur progression module 6 :", error.message);

  const completedIds = new Set(
    (data ?? []).filter((item) => isValidLessonCompletion(item)).map((item) => item.lesson_id)
  );
  if (!moduleLessonIds[5].every((id) => completedIds.has(id))) {
    redirect("/formation/automatisation/07#evaluation-projet");
  }

  const completedCount = webLessonCatalog.filter((lesson) => completedIds.has(lesson.id)).length;
  const nextLesson = webLessonCatalog.find((lesson) => !completedIds.has(lesson.id)) ?? webLessonCatalog.at(-1)!;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="text-sm font-semibold text-slate-600">← Retour au dashboard</Link>
        <section className="mt-6 rounded-[32px] bg-slate-950 p-8 text-white md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Module 6 · PropertyMatch</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Créer un site web de A à Z</h1>
          <p className="mt-5 max-w-3xl leading-7 text-slate-300">
            Construisez progressivement l’application de location PropertyMatch avec Next.js, TypeScript et Tailwind.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={`/formation/site-web/${nextLesson.number}`} className="rounded-xl bg-white px-6 py-3 font-bold text-slate-950">
              {completedCount === webLessonCatalog.length ? "Revoir le parcours" : "Continuer"}
            </Link>
            <span className="text-sm text-slate-300">{completedCount} / {webLessonCatalog.length} leçons validées</span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {webLessonCatalog.map((lesson, index) => {
            const completed = completedIds.has(lesson.id);
            const unlocked = index === 0 || completedIds.has(webLessonCatalog[index - 1].id);
            return (
              <article key={lesson.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Leçon {lesson.number}</p>
                    <h2 className="mt-2 text-xl font-bold">{lesson.title}</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{completed ? "Validée" : unlocked ? "Disponible" : "Verrouillée"}</span>
                </div>
                {unlocked ? (
                  <Link href={`/formation/site-web/${lesson.number}`} className="mt-5 inline-flex font-semibold text-blue-700">
                    {completed ? "Revoir la leçon" : "Commencer"} →
                  </Link>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">Validez d’abord la leçon {webLessonCatalog[index - 1].number}.</p>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
