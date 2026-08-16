import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion } from "@/lib/training/catalog";

// ======================================================
// MODULE PRÉCÉDENT
// ======================================================

const previousModuleLessons = [
  "prompts-01-structure",
  "prompts-02-role",
  "prompts-03-templates",
  "prompts-04-iteration",
  "prompts-05-project",
];

// ======================================================
// LEÇONS MODULE 03
// ======================================================

const lessons = [
  {
    id: "quotidien-01-travail",
    number: "01",
    title: "Transformer une tâche en workflow IA",
    duration: "15 min",
  },
  {
    id: "quotidien-02-etudes",
    number: "02",
    title: "Apprendre et travailler avec l’IA",
    duration: "15 min",
  },
  {
    id: "quotidien-03-recherche",
    number: "03",
    title: "Rechercher, analyser et vérifier",
    duration: "17 min",
  },
  {
    id: "quotidien-04-documents",
    number: "04",
    title: "Exploiter des documents avec l’IA",
    duration: "18 min",
  },
  {
    id: "quotidien-05-mission",
    number: "05",
    title: "Projet · Construire un workflow IA",
    duration: "25 min",
  },
];

// ======================================================
// PAGE MODULE
// ======================================================

export default async function DailyChatGPTModulePage() {
  const supabase = await createClient();

  // ======================================================
  // USER
  // ======================================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // ======================================================
  // PROGRESSION
  // ======================================================

  const {
    data: progressData,
    error,
  } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "Erreur progression :",
      error
    );
  }

  const completedIds = new Set(
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

  // ======================================================
  // VÉRIFICATION MODULE 02
  // ======================================================

  const module2Completed =
    previousModuleLessons.every(
      (lessonId) =>
        completedIds.has(
          lessonId
        )
    );

  if (!module2Completed) {
    redirect("/dashboard");
  }

  // ======================================================
  // ÉTAT DES LEÇONS
  // ======================================================

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

  // ======================================================
  // PROGRESSION MODULE
  // ======================================================

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

  // ======================================================
  // UI
  // ======================================================

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
                  Module 03
                </p>

              </div>

            </div>

            {/* MODULE */}

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                CHATGPT AU QUOTIDIEN
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Transformer l’IA en véritable outil de travail
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Passez des demandes isolées à des méthodes
                de travail structurées et réutilisables.
              </p>

              {/* PROGRESSION */}

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

          {/* LISTE LEÇONS */}

          <div className="border-t border-slate-100 p-4">

            <div className="space-y-2">

              {lessonStates.map(
                (lesson) => (
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
                    href={`/formation/quotidien/${lesson.number}`}
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
                Module 03
              </span>

            </div>

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="mt-10 rounded-[32px] bg-slate-950 p-10 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 03
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-bold">
                ChatGPT au quotidien
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Vous savez maintenant écrire de meilleurs prompts.
                Dans ce module, vous allez apprendre à utiliser
                l&apos;IA dans de vrais processus de travail :
                analyser, organiser, rechercher, vérifier et produire
                des livrables exploitables.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">

                <HeroCard
                  value="5"
                  label="Leçons pratiques"
                />

                <HeroCard
                  value="5"
                  label="Missions concrètes"
                />

                <HeroCard
                  value="1"
                  label="Projet final"
                />

              </div>

              {/* PROGRESSION */}

              <div className="mt-9 max-w-xl">

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

            </section>

            {/* ==================================================
                OBJECTIF
            ================================================== */}

            <section className="mt-10 grid gap-5 md:grid-cols-3">

              <ObjectiveCard
                number="01"
                title="Structurer"
                text="Décomposer une tâche réelle en plusieurs étapes plutôt que demander directement un résultat final."
              />

              <ObjectiveCard
                number="02"
                title="Vérifier"
                text="Savoir quelles informations peuvent être utilisées directement et lesquelles nécessitent une vérification."
              />

              <ObjectiveCard
                number="03"
                title="Livrer"
                text="Transformer les sorties de l’IA en documents, décisions et actions réellement exploitables."
              />

            </section>

            {/* ==================================================
                PROGRAMME
            ================================================== */}

            <section className="mt-12">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                PROGRAMME
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Les leçons
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Chaque leçon ajoute une nouvelle compétence.
                Les exercices sont volontairement orientés vers
                des situations professionnelles et des décisions
                concrètes.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {lessonStates.map(
                  (
                    lesson,
                    index
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
                      duration={
                        lesson.duration
                      }
                      status={
                        lesson.status
                      }
                      href={`/formation/quotidien/${lesson.number}`}
                      description={
                        getLessonSummary(
                          index
                        )
                      }
                    />
                  )
                )}

              </div>

            </section>

            {/* ==================================================
                CE QUE VOUS SAUREZ FAIRE
            ================================================== */}

            <section className="mt-12 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À LA FIN DU MODULE
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Vous ne demanderez plus simplement
                « fais-moi ça » à l’IA.
              </h2>

              <div className="mt-7 grid gap-4 md:grid-cols-2">

                <SkillLine>
                  Décomposer une tâche complexe
                </SkillLine>

                <SkillLine>
                  Exploiter des informations brutes
                </SkillLine>

                <SkillLine>
                  Rechercher avec méthode
                </SkillLine>

                <SkillLine>
                  Vérifier les informations sensibles
                </SkillLine>

                <SkillLine>
                  Analyser des documents longs
                </SkillLine>

                <SkillLine>
                  Produire un livrable professionnel
                </SkillLine>

              </div>

            </section>

            {/* ==================================================
                MODULE TERMINÉ
            ================================================== */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 03 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous savez intégrer l’IA dans un vrai processus de travail.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous avez appris à structurer une mission,
                  travailler avec des documents, rechercher,
                  vérifier et transformer plusieurs informations
                  en résultat exploitable.
                </p>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  La prochaine étape consiste à comprendre ce
                  qu&apos;est réellement une intelligence artificielle
                  et comment fonctionnent les modèles que vous utilisez.
                </p>

                <Link
                  href="/formation/comprendre-ia"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 04 →
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
// DESCRIPTIONS
// ======================================================

function getLessonSummary(
  index: number
) {
  const summaries = [
    "Apprenez à transformer une tâche professionnelle en plusieurs étapes contrôlables et réutilisables.",

    "Utilisez l’IA comme tuteur, assistant de réflexion et outil de progression plutôt que comme générateur de réponses.",

    "Construisez une méthode de recherche avec critères, sources, vérification et recommandation argumentée.",

    "Analysez des PDF et documents longs pour extraire précisément les informations nécessaires à une décision.",

    "Réalisez une mission complète combinant cadrage, recherche, analyse, contrôle et livraison.",
  ];

  return summaries[index];
}

// ======================================================
// HERO CARD
// ======================================================

function HeroCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}

// ======================================================
// OBJECTIVE CARD
// ======================================================

function ObjectiveCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}

// ======================================================
// SKILL
// ======================================================

function SkillLine({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
        ✓
      </div>

      <p className="text-sm font-medium">
        {children}
      </p>

    </div>
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
              : "bg-slate-100 text-slate-900"
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
  duration,
  status,
  href,
  description,
}: {
  number: string;
  title: string;
  duration: string;
  status: string;
  href: string;
  description: string;
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
            current
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-900"
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

      <p className="mt-5 text-sm text-slate-500">
        {done
          ? "Leçon terminée"
          : locked
          ? "Terminez la leçon précédente"
          : current
          ? "Commencer →"
          : "Disponible →"}
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
