import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } = await params;

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const {
    data: project,
    error,
  } =
    await supabase
      .from("student_projects")
      .select(
        `
          id,
          module_id,
          lesson_id,
          title,
          company,
          project_type,
          description,
          solution,
          prompt,
          output,
          score,
          level,
          client_value,
          next_step,
          created_at,
          updated_at
        `
      )
      .eq(
        "id",
        id
      )
      .eq(
        "user_id",
        user.id
      )
      .single();

  if (
    error ||
    !project
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between gap-4">

          <Link
            href="/projets"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Mes projets
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Projet
          </span>

        </div>

        <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

          <div className="flex flex-wrap items-start justify-between gap-6">

            <div className="max-w-3xl">

              <p className="text-xs font-bold tracking-[0.18em] text-slate-500">
                SERVICE IA
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                {project.title}
              </h1>

              {project.company && (
                <p className="mt-4 text-lg text-slate-400">
                  {project.company}
                </p>
              )}

              {project.description && (
                <p className="mt-5 max-w-2xl leading-7 text-slate-400">
                  {project.description}
                </p>
              )}

            </div>

            <div className="rounded-[22px] bg-white px-6 py-5 text-center text-slate-950">

              <p className="text-xs font-bold text-slate-400">
                SCORE
              </p>

              <p className="mt-2 text-4xl font-bold">
                {project.score ??
                  "—"}
              </p>

              {project.score !==
                null && (
                <p className="text-xs text-slate-400">
                  /100
                </p>
              )}

            </div>

          </div>

          {project.level && (
            <div className="mt-8 border-t border-slate-800 pt-6">

              <p className="text-xs font-bold tracking-[0.15em] text-slate-500">
                NIVEAU
              </p>

              <p className="mt-2 text-xl font-bold">
                {project.level}
              </p>

            </div>
          )}

        </section>

        <div className="mt-6 space-y-6">

          {project.client_value && (
            <ProjectSection
              eyebrow="VALEUR MÉTIER"
              title="Ce que le service apporte"
            >
              <p className="leading-8 text-slate-600">
                {
                  project.client_value
                }
              </p>
            </ProjectSection>
          )}

          {project.solution && (
            <ProjectSection
              eyebrow="CONCEPTION"
              title="Solution proposée"
            >
              <p className="whitespace-pre-line leading-8 text-slate-600">
                {
                  project.solution
                }
              </p>
            </ProjectSection>
          )}

          {project.prompt && (
            <ProjectSection
              eyebrow="MOTEUR"
              title="Prompt du service"
            >
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-[22px] bg-slate-950 p-6 font-mono text-sm leading-7 text-slate-200">
                {
                  project.prompt
                }
              </pre>
            </ProjectSection>
          )}

          {project.output && (
            <ProjectSection
              eyebrow="TEST"
              title="Résultat généré"
            >
              <div className="rounded-[22px] bg-slate-50 p-6">

                <p className="whitespace-pre-line text-sm leading-8 text-slate-700">
                  {
                    project.output
                  }
                </p>

              </div>
            </ProjectSection>
          )}

          {project.next_step && (
            <ProjectSection
              eyebrow="ÉVOLUTION"
              title="Prochaine amélioration"
            >
              <p className="leading-8 text-slate-600">
                {
                  project.next_step
                }
              </p>
            </ProjectSection>
          )}

        </div>

      </div>

    </main>
  );
}

function ProjectSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

      <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-bold">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>

    </section>
  );
}