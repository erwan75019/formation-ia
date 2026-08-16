import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion } from "@/lib/training/catalog";

// ======================================================
// MODULE PRÉCÉDENT
// ======================================================

const previousModuleLessons = [
  "quotidien-01-travail",
  "quotidien-02-etudes",
  "quotidien-03-recherche",
  "quotidien-04-documents",
  "quotidien-05-mission",
];

// ======================================================
// LEÇONS DU MODULE 04
// ======================================================

const lessons = [
  {
    id: "fichiers-01-comprendre",
    number: "01",
    title: "Faire comprendre un fichier à l’IA",
    duration: "12 min",
    description:
      "Donnez un fichier à l’IA et apprenez à comprendre simplement ce qu’il contient.",
  },
  {
    id: "fichiers-02-questions",
    number: "02",
    title: "Poser des questions à ses informations",
    duration: "12 min",
    description:
      "Utilisez l’IA pour retrouver rapidement les informations qui vous intéressent dans un fichier.",
  },
  {
    id: "fichiers-03-organiser",
    number: "03",
    title: "Nettoyer et organiser ses informations",
    duration: "15 min",
    description:
      "Corrigez les incohérences, doublons, dates et catégories pour obtenir des informations propres.",
  },
  {
    id: "fichiers-04-dashboard",
    number: "04",
    title: "Transformer un fichier en tableau de bord",
    duration: "18 min",
    description:
      "Transformez des informations difficiles à lire en un outil visuel simple et utile.",
  },
  {
    id: "fichiers-05-decisions",
    number: "05",
    title: "Faire ressortir ce qui mérite votre attention",
    duration: "15 min",
    description:
      "Demandez à l’IA de repérer les évolutions, anomalies et informations importantes sans lui faire confiance aveuglément.",
  },
  {
    id: "fichiers-06-projet",
    number: "06",
    title: "Projet — Construire mon outil personnel",
    duration: "30 min",
    description:
      "Créez un outil que vous pourrez réellement continuer à utiliser après la formation.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default async function FilesAIModulePage() {
  const supabase =
    await createClient();

  // ====================================================
  // USER
  // ====================================================

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/connexion"
    );
  }

  // ====================================================
  // PROGRESSION
  // ====================================================

  const {
    data: progressData,
    error,
  } =
    await supabase
      .from(
        "lesson_progress"
      )
      .select(
        "lesson_id, completed, completed_at"
      )
      .eq(
        "user_id",
        user.id
      );

  if (error) {
    console.error(
      "Erreur progression :",
      error
    );
  }

  const completedIds =
    new Set(
      progressData
        ?.filter(
          (item) =>
            isValidLessonCompletion(item)
        )
        .map(
          (item) =>
            item.lesson_id
        ) ?? []
    );

  // ====================================================
  // VÉRIFICATION MODULE 03
  // ====================================================

  const module3Completed =
    previousModuleLessons.every(
      (lessonId) =>
        completedIds.has(
          lessonId
        )
    );

  if (
    !module3Completed
  ) {
    redirect(
      "/dashboard"
    );
  }

  // ====================================================
  // ÉTAT DES LEÇONS
  // ====================================================

  const lessonStates =
    lessons.map(
      (
        lesson,
        index
      ) => {
        const completed =
          completedIds.has(
            lesson.id
          );

        const previousCompleted =
          index === 0 ||
          completedIds.has(
            lessons[
              index - 1
            ].id
          );

        const status =
          completed
            ? "done"
            : previousCompleted
            ? "current"
            : "locked";

        return {
          ...lesson,
          status,
        };
      }
    );

  // ====================================================
  // PROGRESSION MODULE
  // ====================================================

  const completedCount =
    lessonStates.filter(
      (lesson) =>
        lesson.status ===
        "done"
    ).length;

  const progress =
    Math.round(
      (completedCount /
        lessons.length) *
        100
    );

  const moduleCompleted =
    completedCount ===
    lessons.length;

  // ====================================================
  // UI
  // ====================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      <div className="flex min-h-screen">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="hidden w-80 border-r border-slate-200 bg-white md:block">

          <div className="p-6">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
                AI
              </div>

              <div>

                <p className="font-bold">
                  AI Academy
                </p>

                <p className="text-xs text-slate-400">
                  Module 04
                </p>

              </div>

            </div>

            {/* MODULE INFO */}

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                FICHIERS & INFORMATIONS
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Faites travailler vos fichiers pour vous
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Comprenez, organisez et transformez vos informations grâce à l’IA.
              </p>

              {/* PROGRESS */}

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
                      width:
                        `${progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* LESSON LIST */}

          <div className="border-t border-slate-100 p-4">

            <div className="space-y-2">

              {lessonStates.map(
                (
                  lesson
                ) => (
                  <LessonItem
                    key={
                      lesson.id
                    }
                    number={
                      lesson.number
                    }
                    title={
                      lesson.title
                    }
                    duration={
                      lesson.duration
                    }
                    status={
                      lesson.status
                    }
                    href={`/formation/comprendre-ia/${lesson.number}`}
                  />
                )
              )}

            </div>

          </div>

        </aside>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

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
                Module 04
              </span>

            </div>

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <div className="max-w-3xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  MODULE 04
                </p>

                <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                  Travailler avec ses fichiers grâce à l’IA
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                  Un tableau de dépenses, des notes, des ventes,
                  une liste ou un fichier professionnel :
                  apprenez à utiliser l’IA pour comprendre vos
                  informations et en faire quelque chose d’utile.
                </p>

                {/* PROMISE */}

                <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                    À LA FIN DU MODULE
                  </p>

                  <p className="mt-2 leading-7 text-slate-200">
                    Vous serez capable de partir d’un simple fichier
                    et de construire un outil visuel que vous pourrez
                    continuer à utiliser dans votre vie personnelle,
                    vos études ou votre travail.
                  </p>

                </div>

                {/* PROGRESS */}

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
                        width:
                          `${progress}%`,
                      }}
                    />

                  </div>

                </div>

                <p className="mt-4 text-sm text-slate-400">
                  {completedCount} /{" "}
                  {lessons.length} leçons terminées
                </p>

              </div>

            </section>

            {/* ==================================================
                POURQUOI
            ================================================== */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                POURQUOI CE MODULE ?
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Vos fichiers contiennent souvent plus d’informations que vous ne le pensez.
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-500">
                Vous n’avez pas besoin d’être expert en Excel,
                en statistiques ou en informatique. L’objectif
                est d’apprendre à expliquer à l’IA ce que vous
                voulez obtenir, puis à vérifier que le résultat
                est réellement utile.
              </p>

              {/* EXAMPLES */}

              <div className="mt-7 grid gap-4 md:grid-cols-3">

                <ExampleCard
                  icon="€"
                  title="Budget"
                  description="Comprendre où part votre argent et suivre vos dépenses."
                />

                <ExampleCard
                  icon="A"
                  title="Études"
                  description="Analyser vos notes, votre progression ou votre organisation."
                />

                <ExampleCard
                  icon="↗"
                  title="Travail"
                  description="Comprendre une activité, des ventes, des demandes ou un suivi."
                />

              </div>

            </section>

            {/* ==================================================
                PROGRAMME
            ================================================== */}

            <section className="mt-12">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                PROGRAMME
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                De votre fichier à votre propre outil
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                Chaque leçon ajoute une nouvelle capacité.
                Vous commencez avec un simple fichier et vous
                terminez avec un outil que vous avez construit
                avec l’aide de l’IA.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {lessonStates.map(
                  (
                    lesson
                  ) => (
                    <LessonCard
                      key={
                        lesson.id
                      }
                      number={
                        lesson.number
                      }
                      title={
                        lesson.title
                      }
                      description={
                        lesson.description
                      }
                      duration={
                        lesson.duration
                      }
                      status={
                        lesson.status
                      }
                      href={`/formation/comprendre-ia/${lesson.number}`}
                    />
                  )
                )}

              </div>

            </section>

            {/* ==================================================
                FINAL PROJECT PREVIEW
            ================================================== */}

            <section className="mt-12 rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

              <div className="flex flex-wrap items-start justify-between gap-5">

                <div className="max-w-3xl">

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    PROJET DU MODULE
                  </span>

                  <h2 className="mt-5 text-3xl font-bold">
                    Construisez un outil qui vous servira réellement
                  </h2>

                  <p className="mt-4 leading-7 text-slate-500">
                    Pour terminer le module, vous choisirez ce que
                    vous souhaitez suivre et l’IA vous accompagnera
                    dans la création de votre propre outil.
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-bold text-white">
                  06
                </div>

              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <ProjectChoice
                  title="Mon budget"
                  description="Revenus et dépenses"
                />

                <ProjectChoice
                  title="Mes études"
                  description="Notes et progression"
                />

                <ProjectChoice
                  title="Mon activité"
                  description="Suivi professionnel"
                />

                <ProjectChoice
                  title="Mon propre fichier"
                  description="Votre besoin personnel"
                />

              </div>

              <div className="mt-7 rounded-2xl bg-slate-50 p-5">

                <p className="text-sm font-semibold text-slate-800">
                  Le projet ne disparaît pas à la fin de la leçon.
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  L’objectif est que vous puissiez remplacer ou
                  actualiser vos informations plus tard et continuer
                  à utiliser l’outil que vous avez construit.
                </p>

              </div>

            </section>

            {/* ==================================================
                MODULE COMPLETED
            ================================================== */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 04 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous savez maintenant faire travailler vos informations pour vous.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous savez comprendre un fichier avec l’IA,
                  l’organiser, poser des questions dessus,
                  faire ressortir les informations importantes
                  et le transformer en outil visuel.
                </p>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  Dans le prochain module, vous allez apprendre
                  à aller encore plus loin : faire exécuter
                  automatiquement des tâches répétitives par l’IA.
                </p>

                <Link
                  href="/formation/automatisation"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 05 →
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
  status,
  href,
}: {
  number: string;
  title: string;
  description: string;
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
      className={`h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition ${
        locked
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
    >

      <div className="flex items-center justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
            done
              ? "bg-slate-100 text-slate-900"
              : current
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {locked
            ? "🔒"
            : done
            ? "✓"
            : number}
        </div>

        <span className="text-sm text-slate-400">
          {duration}
        </span>

      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5">

        <p className="text-sm font-medium text-slate-500">
          {done
            ? "Leçon terminée"
            : locked
            ? "Terminez la leçon précédente"
            : current
            ? "Commencer la leçon →"
            : "Disponible"}
        </p>

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
// EXAMPLE CARD
// ======================================================

function ExampleCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

// ======================================================
// PROJECT CHOICE
// ======================================================

function ProjectChoice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">

      <p className="font-semibold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}
