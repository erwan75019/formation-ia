import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Project = {
  id: string;
  title: string;
  company: string | null;
  project_type: string;
  description: string | null;
  score: number | null;
  level: string | null;
  client_value: string | null;
  created_at: string;
  updated_at: string;
};

export default async function ProjectsPage() {
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
    data,
    error,
  } =
    await supabase
      .from("student_projects")
      .select(
        `
          id,
          title,
          company,
          project_type,
          description,
          score,
          level,
          client_value,
          created_at,
          updated_at
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "updated_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Erreur récupération projets :",
      error
    );
  }

  const projects: Project[] =
    data ?? [];

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between gap-4">

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au dashboard
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            {projects.length} projet
            {projects.length > 1
              ? "s"
              : ""}
          </span>

        </div>

        <section className="mt-10">

          <p className="text-sm font-semibold tracking-[0.18em] text-slate-400">
            PORTFOLIO
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Mes projets
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            Retrouvez ici les services,
            prototypes et projets construits
            au fil de votre formation.
          </p>

        </section>

        {projects.length === 0 ? (
          <section className="mt-10 rounded-[30px] border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              ◇
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Aucun projet pour le moment
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Vos projets apparaîtront ici
              lorsque vous terminerez certaines
              missions pratiques de la formation.
            </p>

            <Link
              href="/formation/prompts/05"
              className="mt-6 inline-flex rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
            >
              Construire un premier projet →
            </Link>

          </section>
        ) : (
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {projects.map(
              (project) => (
                <ProjectCard
                  key={
                    project.id
                  }
                  project={
                    project
                  }
                />
              )
            )}

          </section>
        )}

      </div>

    </main>
  );
}

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  const score =
    project.score ?? 0;

  return (
    <Link
      href={`/projets/${project.id}`}
      className="group block h-full"
    >

      <article className="flex h-full flex-col rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">

        <div className="flex items-start justify-between gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
            AI
          </div>

          {project.score !==
            null && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
              {project.score}/100
            </span>
          )}

        </div>

        <p className="mt-6 text-xs font-bold tracking-[0.15em] text-slate-400">
          SERVICE IA
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {project.title}
        </h2>

        {project.company && (
          <p className="mt-2 text-sm font-medium text-slate-500">
            {project.company}
          </p>
        )}

        {project.description && (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {project.description}
          </p>
        )}

        <div className="mt-6">

          <div className="flex items-center justify-between text-xs">

            <span className="text-slate-400">
              Qualité
            </span>

            <span className="font-bold text-slate-950">
              {score}%
            </span>

          </div>

          <div
            className="mt-2 overflow-hidden rounded-full"
            style={{
              height: "7px",
              backgroundColor:
                "#e2e8f0",
            }}
          >

            <div
              className="rounded-full"
              style={{
                width:
                  `${score}%`,
                height:
                  "7px",
                backgroundColor:
                  "#020617",
              }}
            />

          </div>

        </div>

        <div className="mt-auto pt-6">

          <div className="flex items-center justify-between border-t border-slate-100 pt-5">

            <span className="text-sm font-semibold text-slate-500">
              {project.level ||
                "Projet"}
            </span>

            <span className="text-sm font-bold text-slate-950 transition group-hover:translate-x-1">
              Voir →
            </span>

          </div>

        </div>

      </article>

    </Link>
  );
}