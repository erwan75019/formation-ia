import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 12 — PROJET FINAL
// ======================================================

const lessons = [
  {
    number: "01",
    slug: "01",
    id: "final-01-spec",
    title: "Définir le service IA",
    description:
      "Choisir un problème client réel et transformer ce besoin en cahier des charges.",
  },
  {
    number: "02",
    slug: "02",
    id: "final-02-architecture",
    title: "Concevoir l’architecture",
    description:
      "Définir le frontend, le backend, la base de données et les fonctionnalités IA.",
  },
  {
    number: "03",
    slug: "03",
    id: "final-03-data-security",
    title: "Données & sécurité",
    description:
      "Structurer les données, les utilisateurs, les permissions et les règles de sécurité.",
  },
  {
    number: "04",
    slug: "04",
    id: "final-04-ai-features",
    title: "Fonctionnalités IA",
    description:
      "Concevoir les fonctionnalités IA réellement utiles au client.",
  },
  {
    number: "05",
    slug: "05",
    id: "final-05-backend",
    title: "Backend & automatisations",
    description:
      "Relier les données, les API et les actions de l’application.",
  },
  {
    number: "06",
    slug: "06",
    id: "final-06-production",
    title: "Préparer la production",
    description:
      "Tester, sécuriser et préparer le produit pour de vrais utilisateurs.",
  },
  {
    number: "07",
    slug: "07",
    id: "final-07-project",
    title: "Construire le projet final",
    description:
      "Assembler toutes les compétences dans un véritable service IA vendable.",
  },
];

export default async function FinalProjectPage() {
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
  // PROFIL
  // ======================================================

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(
      "Erreur récupération profil :",
      profileError
    );
  }

  const hasCompleteAccess =
    profile?.plan === "complet" &&
    (profile.subscription_status === "active" ||
      profile.subscription_status === "trialing");

  if (!hasCompleteAccess) {
    redirect("/tarifs");
  }

  // ======================================================
  // PROGRESSION
  // ======================================================

  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, score")
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression projet final :",
      progressError
    );
  }

  const progressDataSafe =
    progressData ?? [];

  const completedIds = new Set(
    progressDataSafe
      .filter(
        (item) =>
          item.completed
      )
      .map(
        (item) =>
          item.lesson_id
      )
  );

  const completedCount =
    lessons.filter(
      (lesson) =>
        completedIds.has(
          lesson.id
        )
    ).length;

  const progressPercent =
    Math.round(
      (completedCount /
        lessons.length) *
        100
    );

  const moduleCompleted =
    completedCount ===
    lessons.length;

  // ======================================================
  // LEÇONS
  // ======================================================

  const lessonStates =
    lessons.map(
      (lesson, index) => {
        const completed =
          completedIds.has(
            lesson.id
          );

        const previousLesson =
          index > 0
            ? lessons[index - 1]
            : null;

        const locked =
          previousLesson !== null &&
          !completedIds.has(
            previousLesson.id
          );

        return {
          ...lesson,
          completed,
          locked,
        };
      }
    );

  const currentLesson =
    lessonStates.find(
      (lesson) =>
        !lesson.completed &&
        !lesson.locked
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            TOP BAR
        ====================================================== */}

        <div className="flex items-center justify-between gap-5">

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au dashboard
          </Link>

          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Expert
          </span>

        </div>

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="mt-10 overflow-hidden rounded-[34px] bg-slate-950 p-8 text-white shadow-2xl md:p-12">

          <div className="max-w-4xl">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
              MODULE 12 · PROJET FINAL
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">

              {moduleCompleted
                ? "Formation terminée."
                : "Construisez un service IA"}

              <span className="block text-slate-500">

                {moduleCompleted
                  ? "Vous êtes arrivé au bout du parcours."
                  : "que vous pourriez réellement vendre."}

              </span>

            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">

              {moduleCompleted
                ? "Vous avez terminé les 12 modules AI Academy et validé le projet final. Votre certification numérique est maintenant disponible."
                : "Vous allez partir d’un problème client, concevoir la solution, construire l’application, sécuriser les données et préparer un produit démontrable à un vrai prospect."}

            </p>

          </div>

          {/* PROGRESSION */}

          <div className="mt-10 max-w-2xl">

            <div className="flex justify-between text-sm">

              <span className="text-slate-400">
                Progression du projet
              </span>

              <span>
                {progressPercent}%
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width: `${progressPercent}%`,
                }}
              />

            </div>

            <p className="mt-3 text-sm text-slate-500">
              {completedCount} / {lessons.length} étapes terminées
            </p>

          </div>

          {/* CTA EN COURS */}

          {!moduleCompleted &&
            currentLesson && (
              <Link
                href={`/formation/projet-final/${currentLesson.slug}`}
                className="mt-8 inline-block rounded-2xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                {completedCount === 0
                  ? "Commencer le projet →"
                  : "Continuer le projet →"}
              </Link>
            )}

          {/* CTA TERMINÉ */}

          {moduleCompleted && (
            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                href="/certificat"
                className="inline-flex rounded-2xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Obtenir mon certificat →
              </Link>

              <Link
                href="/projets"
                className="inline-flex rounded-2xl border border-slate-700 bg-slate-900 px-7 py-4 font-semibold text-white transition hover:bg-slate-800"
              >
                Voir mes projets
              </Link>

            </div>
          )}

        </section>

        {/* ======================================================
            OBJECTIFS
        ====================================================== */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">

          <ValueCard
            number="01"
            title="Résoudre un problème"
            text="Ne partez pas de la technologie. Partez d’un problème pour lequel un client pourrait réellement payer."
          />

          <ValueCard
            number="02"
            title="Construire la solution"
            text="Frontend, backend, base de données, IA, automatisations et sécurité seront assemblés."
          />

          <ValueCard
            number="03"
            title="Créer une offre"
            text="À la fin, vous devez pouvoir expliquer ce que vous vendez, à qui et quelle valeur votre solution apporte."
          />

        </section>

        {/* ======================================================
            SCÉNARIO
        ====================================================== */}

        <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            OBJECTIF DU PROJET
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            Construire un véritable service IA de bout en bout
          </h2>

          <p className="mt-5 max-w-4xl leading-8 text-slate-500">
            Vous pourrez choisir plusieurs types de clients :
            commerce, restaurant, immobilier, sport, association,
            services, e-commerce, événementiel ou autre activité.
            Le projet devra répondre à un problème concret plutôt
            qu&apos;utiliser l&apos;IA uniquement pour utiliser l&apos;IA.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <ProjectExample
              sector="Commerce"
              title="Assistant d’analyse des avis clients"
              description="Importer des avis, identifier les problèmes récurrents et produire des recommandations."
            />

            <ProjectExample
              sector="Restaurant"
              title="Assistant opérationnel"
              description="Centraliser questions clients, informations du restaurant et demandes récurrentes."
            />

            <ProjectExample
              sector="Immobilier"
              title="Qualification de prospects"
              description="Analyser les besoins des prospects et rechercher les biens correspondant à leurs critères."
            />

            <ProjectExample
              sector="Association / événement"
              title="Assistant organisationnel"
              description="Centraliser documents, répondre aux questions et automatiser certaines tâches répétitives."
            />

          </div>

        </section>

        {/* ======================================================
            PARCOURS
        ====================================================== */}

        <section className="mt-12">

          <div>

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              PARCOURS DU PROJET
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              7 étapes jusqu’au produit final
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Chaque étape correspond à une compétence nécessaire pour
              transformer une idée en service IA réellement présentable.
            </p>

          </div>

          <div className="mt-8 space-y-4">

            {lessonStates.map(
              (lesson) => (
                <ProjectLessonCard
                  key={lesson.id}
                  number={
                    lesson.number
                  }
                  title={
                    lesson.title
                  }
                  description={
                    lesson.description
                  }
                  href={`/formation/projet-final/${lesson.slug}`}
                  completed={
                    lesson.completed
                  }
                  locked={
                    lesson.locked
                  }
                />
              )
            )}

          </div>

        </section>

        {/* ======================================================
            LIVRABLE FINAL
        ====================================================== */}

        <section className="mt-12 rounded-[30px] bg-slate-950 p-8 text-white md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            LIVRABLE FINAL
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            À la fin, vous ne rendrez pas un simple exercice.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Vous disposerez d&apos;une démonstration complète d&apos;un service IA
            que vous pourrez présenter comme projet portfolio ou utiliser
            comme base pour proposer une prestation à un client.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <DeliverableCard
              title="Application"
              text="Interface fonctionnelle"
            />

            <DeliverableCard
              title="IA"
              text="Fonctionnalité réellement intégrée"
            />

            <DeliverableCard
              title="Sécurité"
              text="Comptes et données protégés"
            />

            <DeliverableCard
              title="Offre"
              text="Service explicable à un prospect"
            />

          </div>

        </section>

        {/* ======================================================
            FÉLICITATIONS FINALES
        ====================================================== */}

        {moduleCompleted && (
          <section className="mt-10 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-xl">

            <div className="grid lg:grid-cols-[1.4fr_0.6fr]">

              {/* TEXTE */}

              <div className="p-8 md:p-10">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  PARCOURS AI ACADEMY TERMINÉ
                </p>

                <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
                  Félicitations.
                  <span className="block text-slate-400">
                    Vous avez terminé la formation.
                  </span>
                </h2>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
                  Vous avez validé les 12 modules, terminé le projet final
                  et démontré votre capacité à comprendre et construire
                  des solutions basées sur l&apos;intelligence artificielle.
                </p>

                {/* COMPÉTENCES */}

                <div className="mt-8">

                  <p className="text-xs font-semibold tracking-[0.15em] text-slate-400">
                    COMPÉTENCES VALIDÉES
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <FinalSkill text="ChatGPT" />
                    <FinalSkill text="Prompting" />
                    <FinalSkill text="Automatisation" />
                    <FinalSkill text="Python" />
                    <FinalSkill text="API" />
                    <FinalSkill text="Supabase" />
                    <FinalSkill text="SaaS IA" />
                    <FinalSkill text="Agents IA" />
                    <FinalSkill text="RAG" />

                  </div>

                </div>

                {/* BOUTONS */}

                <div className="mt-9 flex flex-wrap gap-3">

                  <Link
                    href="/certificat"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02]"
                  >
                    Obtenir mon certificat →
                  </Link>

                  <Link
                    href="/projets"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Voir mes projets
                  </Link>

                </div>

              </div>

              {/* CERTIFICATION */}

              <div className="flex items-center justify-center bg-slate-950 p-8 text-white md:p-10">

                <div className="w-full max-w-sm text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-3xl font-bold text-slate-950">
                    ✓
                  </div>

                  <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-slate-500">
                    CERTIFICATION
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    AI Academy
                  </h3>

                  <p className="mt-2 text-slate-400">
                    De zéro à créateur d&apos;IA
                  </p>

                  <div className="mt-7 h-px bg-slate-800" />

                  <p className="mt-6 text-sm leading-6 text-slate-400">
                    Votre certificat numérique personnalisé
                    est maintenant disponible.
                  </p>

                  <Link
                    href="/certificat"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    Voir mon certificat
                  </Link>

                </div>

              </div>

            </div>

          </section>
        )}

      </div>

    </main>
  );
}

// ======================================================
// VALUE CARD
// ======================================================

function ValueCard({
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

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
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
// PROJECT EXAMPLE
// ======================================================

function ProjectExample({
  sector,
  title,
  description,
}: {
  sector: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
        {sector}
      </p>

      <h3 className="mt-3 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

// ======================================================
// PROJECT LESSON CARD
// ======================================================

function ProjectLessonCard({
  number,
  title,
  description,
  href,
  completed,
  locked,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
  completed: boolean;
  locked: boolean;
}) {
  const content = (
    <div
      className={`flex flex-col justify-between gap-5 rounded-[26px] border p-6 transition sm:flex-row sm:items-center ${
        completed
          ? "border-slate-200 bg-white"
          : locked
          ? "border-slate-200 bg-slate-100 opacity-60"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-lg"
      }`}
    >

      <div className="flex gap-5">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold ${
            completed
              ? "bg-slate-100 text-slate-900"
              : "bg-slate-950 text-white"
          }`}
        >
          {completed
            ? "✓"
            : locked
            ? "🔒"
            : number}
        </div>

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-lg font-bold">
              {title}
            </h3>

            {completed && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Terminée
              </span>
            )}

          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      {!locked && (
        <span className="shrink-0 text-sm font-semibold text-slate-700">
          {completed
            ? "Revoir →"
            : "Ouvrir →"}
        </span>
      )}

    </div>
  );

  if (locked) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block"
    >
      {content}
    </Link>
  );
}

// ======================================================
// DELIVERABLE CARD
// ======================================================

function DeliverableCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-slate-950">
        ✓
      </div>

      <p className="mt-4 font-bold">
        {title}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {text}
      </p>

    </div>
  );
}

// ======================================================
// FINAL SKILL
// ======================================================

function FinalSkill({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
      {text}
    </span>
  );
}
