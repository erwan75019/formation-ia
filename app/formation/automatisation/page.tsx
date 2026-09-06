import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion } from "@/lib/training/catalog";

// ======================================================
// MODULE PRÉCÉDENT — MODULE 04
// ======================================================

const previousModuleLessons = [
  "fichiers-01-comprendre",
  "fichiers-02-questions",
  "fichiers-03-organiser",
  "fichiers-04-dashboard",
  "fichiers-05-decisions",
  "fichiers-06-projet",
];

// ======================================================
// LEÇONS MODULE 05
// ======================================================

const lessons = [
  {
    id: "automation-01-logic",
    number: "01",
    title: "Comprendre une automatisation",
    duration: "15 min",
  },
  {
    id: "automation-02-tri",
    number: "02",
    title: "Trier automatiquement des demandes",
    duration: "20 min",
  },
  {
    id: "automation-03-extraction",
    number: "03",
    title: "Extraire les informations importantes",
    duration: "20 min",
  },
  {
    id: "automation-04-email",
    number: "04",
    title: "Préparer des réponses avec l’IA",
    duration: "22 min",
  },
  {
    id: "automation-05-control",
    number: "05",
    title: "Garder le contrôle avant d’agir",
    duration: "18 min",
  },
  {
    id: "automation-06-workflow",
    number: "06",
    title: "Construire un workflow complet",
    duration: "25 min",
  },
  {
    id: "automation-07-project",
    number: "07",
    title: "Projet · Construire votre assistant de travail",
    duration: "35 min",
  },
];

// ======================================================
// PAGE MODULE
// ======================================================

export default async function AutomationModulePage() {
  const supabase = await createClient();

  // ======================================================
  // UTILISATEUR
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
      "Erreur récupération progression :",
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
  // VÉRIFICATION MODULE 04
  // ======================================================

  const module4Completed =
    previousModuleLessons.every(
      (lessonId) =>
        completedIds.has(
          lessonId
        )
    );

  if (!module4Completed) {
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
                  Module 05
                </p>

              </div>

            </div>

            {/* MODULE */}

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                AUTOMATISER SON TRAVAIL
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Faire travailler l’IA dans vos processus
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Transformez les tâches répétitives
                en workflows simples, contrôlables
                et réellement utiles.
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
                    href={`/formation/automatisation/${lesson.number}`}
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
                Module 05
              </span>

            </div>

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="mt-10 rounded-[32px] bg-slate-950 p-10 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 05
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold">
                Automatiser son travail avec l’IA
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Vous savez déjà utiliser l’IA et travailler
                avec vos informations. Vous allez maintenant
                apprendre à construire des systèmes capables
                de recevoir une demande, l’analyser,
                préparer une action et vous laisser le contrôle
                lorsque la situation l’exige.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">

                <HeroCard
                  value="7"
                  label="Leçons pratiques"
                />

                <HeroCard
                  value="6"
                  label="Ateliers guidés"
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
                OBJECTIFS
            ================================================== */}

            <section className="mt-10 grid gap-5 md:grid-cols-3">

              <ObjectiveCard
                number="01"
                title="Automatiser"
                text="Repérez une tâche répétitive et transformez-la en étapes claires avec un déclencheur, des règles et une action."
              />

              <ObjectiveCard
                number="02"
                title="Contrôler"
                text="Décidez ce que le système peut faire seul et ce qui doit rester sous validation humaine."
              />

              <ObjectiveCard
                number="03"
                title="Construire"
                text="Assemblez plusieurs étapes pour créer un assistant réellement utilisable au quotidien."
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
                Chaque leçon ajoute une nouvelle brique
                au système. Vous commencerez par une logique
                très simple avant de construire un assistant
                capable de traiter des demandes de bout en bout.
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
                      href={`/formation/automatisation/${lesson.number}`}
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

              <h2 className="mt-4 max-w-3xl text-3xl font-bold">
                Vous saurez transformer une tâche répétitive
                en véritable système de travail.
              </h2>

              <div className="mt-7 grid gap-4 md:grid-cols-2">

                <SkillLine>
                  Identifier ce qui mérite d’être automatisé
                </SkillLine>

                <SkillLine>
                  Trier automatiquement des demandes
                </SkillLine>

                <SkillLine>
                  Extraire des informations depuis un message
                </SkillLine>

                <SkillLine>
                  Préparer des réponses avec l’IA
                </SkillLine>

                <SkillLine>
                  Ajouter des validations humaines
                </SkillLine>

                <SkillLine>
                  Gérer les cas incertains et les erreurs
                </SkillLine>

                <SkillLine>
                  Construire un workflow complet
                </SkillLine>

                <SkillLine>
                  Concevoir un assistant utilisable au quotidien
                </SkillLine>

              </div>

            </section>

            {/* ==================================================
                EXEMPLE DE TRANSFORMATION
            ================================================== */}

            <section className="mt-12 grid gap-5 lg:grid-cols-2">

              <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  AVANT
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Vous traitez tout manuellement
                </h2>

                <div className="mt-6 space-y-3">

                  <BeforeLine>
                    Ouvrir chaque email
                  </BeforeLine>

                  <BeforeLine>
                    Comprendre la demande
                  </BeforeLine>

                  <BeforeLine>
                    Chercher les informations utiles
                  </BeforeLine>

                  <BeforeLine>
                    Décider quoi faire
                  </BeforeLine>

                  <BeforeLine>
                    Rédiger une réponse
                  </BeforeLine>

                  <BeforeLine>
                    Recommencer pour chaque message
                  </BeforeLine>

                </div>

              </div>

              <div className="rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  APRÈS
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Votre workflow prépare le travail
                </h2>

                <div className="mt-6 space-y-3">

                  <AfterLine>
                    Réception automatique
                  </AfterLine>

                  <AfterLine>
                    Classification de la demande
                  </AfterLine>

                  <AfterLine>
                    Extraction des informations
                  </AfterLine>

                  <AfterLine>
                    Proposition d’action
                  </AfterLine>

                  <AfterLine>
                    Brouillon préparé
                  </AfterLine>

                  <AfterLine>
                    Validation humaine si nécessaire
                  </AfterLine>

                </div>

              </div>

            </section>

            {/* ==================================================
                MODULE TERMINÉ
            ================================================== */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 05 TERMINÉ
                </p>

                <h2 className="mt-3 max-w-3xl text-3xl font-bold">
                  Vous savez construire des automatisations
                  simples, utiles et contrôlables.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Vous savez maintenant partir d’une tâche
                  répétitive, définir la logique du traitement,
                  utiliser l’IA lorsqu’elle apporte réellement
                  quelque chose et conserver une validation
                  humaine lorsque les conséquences sont importantes.
                </p>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  Dans le prochain module, vous allez utiliser
                  cette logique pour commencer à construire
                  de véritables interfaces web accessibles
                  depuis un navigateur.
                </p>

                <Link
                  href="/formation/site-web"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 06 →
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
// DESCRIPTIONS DES LEÇONS
// ======================================================

function getLessonSummary(
  index: number
) {
  const summaries = [
    "Comprenez comment transformer une tâche répétitive en déclencheur, décision, action et contrôle.",

    "Utilisez une boîte de réception simulée pour apprendre à classer les demandes et repérer les priorités.",

    "Transformez un email en données structurées : nom, montant, référence, demande et informations manquantes.",

    "Préparez des brouillons de réponse avec l’IA tout en évitant les promesses et informations inventées.",

    "Apprenez à distinguer les actions automatiques de celles qui nécessitent obligatoirement une validation humaine.",

    "Assemblez réception, tri, extraction, IA, contrôle et action dans un même workflow.",

    "Construisez votre propre assistant de travail capable de traiter une tâche répétitive de bout en bout.",
  ];

  return (
    summaries[index] ??
    ""
  );
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
// AVANT
// ======================================================

function BeforeLine({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm">
        —
      </div>

      <p className="text-sm font-medium text-slate-600">
        {children}
      </p>

    </div>
  );
}

// ======================================================
// APRÈS
// ======================================================

function AfterLine({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-950">
        ✓
      </div>

      <p className="text-sm font-medium text-slate-300">
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

      <div className="mt-5 border-t border-slate-100 pt-4">

        <p className="text-sm font-medium text-slate-500">

          {done
            ? "Leçon terminée"
            : locked
              ? "Terminez la leçon précédente"
              : current
                ? "Continuer la formation →"
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
