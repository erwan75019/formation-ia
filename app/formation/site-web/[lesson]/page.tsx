import Link from "next/link";
import { notFound } from "next/navigation";

import WebFoundationLesson from "@/components/formation/web/WebFoundationLesson";
import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion, webLessonCatalog } from "@/lib/training/catalog";
import { getWebFoundationLessonBySlug } from "@/lib/training/web/foundations";
import { getValidatedRequiredFor, getWebLessonIdFromSlug } from "@/lib/training/web/navigation";

export default async function SiteWebLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lesson: string }>;
  searchParams: Promise<{ required_for?: string }>;
}) {
  const { lesson: slug } = await params;
  const lessonId = getWebLessonIdFromSlug(slug);
  const lesson = webLessonCatalog.find((entry) => entry.id === lessonId);
  if (!lesson) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progress } = user
    ? await supabase.from("lesson_progress").select("lesson_id, completed, completed_at")
        .eq("user_id", user.id).eq("lesson_id", lesson.id).maybeSingle()
    : { data: null };
  const completed = Boolean(progress && isValidLessonCompletion(progress));
  const requiredFor = getValidatedRequiredFor(slug, (await searchParams).required_for);
  const foundationLesson = getWebFoundationLessonBySlug(slug);
  if (foundationLesson) {
    return <WebFoundationLesson lesson={foundationLesson} completed={completed} requiredFor={requiredFor} />;
  }
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/formation/site-web" className="text-sm font-semibold text-slate-600">← Retour au module</Link>
          <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white">{lesson.number} / 12</span>
        </header>
        {requiredFor && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-900">
            Validez cette leçon avant d&apos;accéder à la leçon {requiredFor}.
          </div>
        )}
        <section className="mt-6 rounded-[32px] bg-slate-950 p-8 text-white md:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">PropertyMatch · Leçon {lesson.number}</p>
          <h1 className="mt-4 text-4xl font-bold">{lesson.title}</h1>
          <p className="mt-5 leading-7 text-slate-300">
            Cette leçon est maintenant raccordée au parcours officiel en 12 étapes. Son contenu détaillé sera dérivé de l’application de référence et de sa cartographie finale.
          </p>
        </section>
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-2xl font-bold">Sources pédagogiques officielles</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            <li>Application exécutable : reference-apps/propertymatch</li>
            <li>Cartographie : reference-apps/propertymatch/docs/final-application-map.md</li>
            <li>Direction visuelle : docs/design/propertymatch-design-spec.md</li>
          </ul>
        </section>
        <section className="mt-6 rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-sm text-slate-300">{completed ? "Leçon déjà validée : votre meilleur score est conservé." : "La validation passe exclusivement par le QCM sécurisé."}</p>
          <Link href={`/formation/site-web/${slug}/qcm`} className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-slate-950">
            {completed ? "Refaire le QCM" : "Passer le QCM sécurisé"} →
          </Link>
        </section>
      </div>
    </main>
  );
}
