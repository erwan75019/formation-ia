import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 08 — PRÉREQUIS
// ======================================================

const previousModuleLessons = [
  "supabase-01-database",
  "supabase-02-tables",
  "supabase-03-crud",
  "supabase-04-relations",
  "supabase-05-auth",
  "supabase-06-rls",
  "supabase-07-project",
];

// ======================================================
// MODULE 09 — CRÉER UN SAAS IA
// ======================================================

const lessons = [
  {
    id: "saas-01-architecture",
    number: "01",
    title: "Comprendre l’architecture d’un SaaS",
    duration: "16 min",
    description:
      "Découvrez comment les différentes parties d’une application web communiquent entre elles.",
    type: "Architecture",
  },
  {
    id: "saas-02-front-back",
    number: "02",
    title: "Frontend, backend, client et serveur",
    duration: "22 min",
    description:
      "Comprenez précisément ce qui s’exécute dans le navigateur et ce qui doit rester côté serveur.",
    type: "Fondamentaux",
  },
  {
    id: "saas-03-auth",
    number: "03",
    title: "Gérer les utilisateurs",
    duration: "20 min",
    description:
      "Intégrez inscription, connexion, session et protection des pages privées dans un SaaS.",
    type: "Authentification",
  },
  {
    id: "saas-04-database",
    number: "04",
    title: "Connecter la base de données",
    duration: "22 min",
    description:
      "Reliez les utilisateurs aux données de l’application et affichez des informations dynamiques.",
    type: "Database",
  },
  {
    id: "saas-05-ai",
    number: "05",
    title: "Ajouter une fonctionnalité IA",
    duration: "25 min",
    description:
      "Faites circuler une demande du frontend jusqu’à une API d’intelligence artificielle.",
    type: "IA + API",
  },
  {
    id: "saas-06-security",
    number: "06",
    title: "Sécuriser clés API et backend",
    duration: "22 min",
    description:
      "Comprenez pourquoi les secrets ne doivent jamais être exposés dans le navigateur et comment protéger les appels sensibles.",
    type: "Sécurité",
  },
  {
    id: "saas-07-project",
    number: "07",
    title: "Mini-projet : construire un SaaS IA",
    duration: "55 min",
    description:
      "Assemblez frontend, backend, authentification, base de données et API IA dans une architecture complète.",
    type: "Mini-projet",
  },
];

export default async function SaasModulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: progressData, error: progressError } =
    await supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => item.completed)
      .map((item) => item.lesson_id) ?? []
  );

  const previousModuleCompleted =
    previousModuleLessons.every((lessonId) =>
      completedIds.has(lessonId)
    );

  if (!previousModuleCompleted) {
    redirect("/dashboard");
  }

  const lessonStates = lessons.map((lesson, index) => {
    const completed =
      completedIds.has(lesson.id);

    const previousCompleted =
      index === 0 ||
      completedIds.has(
        lessons[index - 1].id
      );

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

  const completedCount =
    lessonStates.filter(
      (lesson) =>
        lesson.status === "done"
    ).length;

  const progress = Math.round(
    (completedCount / lessons.length) * 100
  );

  const moduleCompleted =
    completedCount === lessons.length;

  const nextLesson =
    lessonStates.find(
      (lesson) =>
        lesson.status === "current"
    );

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
                  Module 09
                </p>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                CRÉER UN SAAS IA
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                Assemblez toutes les briques
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Passez d&apos;un ensemble de technologies séparées
                à une véritable application web utilisant
                authentification, données et intelligence artificielle.
              </p>

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
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {completedCount} / {lessons.length} leçons
                </p>

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
                  href={`/formation/saas-ia/${lesson.number}`}
                />
              ))}

            </div>

          </div>

        </aside>

        {/* CONTENU */}

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
                Module 09
              </span>

            </div>

            {/* HERO */}

            <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MODULE 09
              </p>

              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                Créer un SaaS IA
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Vous connaissez maintenant plusieurs briques
                importantes. Ce module va vous apprendre comment
                les assembler pour construire une application
                utilisable par de vrais utilisateurs.
              </p>

              {/* ARCHITECTURE */}

              <div className="mt-9 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  ARCHITECTURE D&apos;UN SAAS IA
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Une action utilisateur peut traverser plusieurs couches.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">

                  <ArchitectureBlock
                    label="Utilisateur"
                    sub="Clique / écrit"
                  />

                  <Arrow />

                  <ArchitectureBlock
                    label="Frontend"
                    sub="Interface"
                  />

                  <Arrow />

                  <ArchitectureBlock
                    label="Backend"
                    sub="Logique"
                  />

                  <Arrow />

                  <ArchitectureBlock
                    label="Database"
                    sub="Données"
                  />

                  <span className="text-slate-600">
                    +
                  </span>

                  <ArchitectureBlock
                    label="API IA"
                    sub="Intelligence"
                  />

                </div>

              </div>

              {/* PROGRESSION */}

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
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">

                <p className="text-sm text-slate-400">
                  {completedCount} / {lessons.length} leçons terminées
                </p>

                {nextLesson && (
                  <Link
                    href={`/formation/saas-ia/${nextLesson.number}`}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    {completedCount === 0
                      ? "Commencer →"
                      : "Continuer →"}
                  </Link>
                )}

              </div>

            </section>

            {/* FRONTEND VS BACKEND */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                CONCEPT CENTRAL
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Frontend vs Backend
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Avant de construire un SaaS, il faut comprendre
                où chaque partie du programme s&apos;exécute.
                C&apos;est notamment ce qui permet de savoir où
                placer une clé API ou une opération sensible.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {/* FRONTEND */}

                <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-bold">
                    F
                  </div>

                  <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-slate-400">
                    FRONTEND
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Ce que voit l&apos;utilisateur
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    Le frontend correspond principalement à
                    l&apos;interface avec laquelle l&apos;utilisateur
                    interagit.
                  </p>

                  <div className="mt-5 space-y-3">

                    <Feature text="Pages" />
                    <Feature text="Boutons" />
                    <Feature text="Formulaires" />
                    <Feature text="Dashboard" />
                    <Feature text="Affichage des résultats" />

                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-sm font-semibold text-slate-900">
                      Attention
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Le code envoyé au navigateur ne doit pas
                      contenir de secret privé.
                    </p>

                  </div>

                </div>

                {/* BACKEND */}

                <div className="rounded-[26px] bg-slate-950 p-7 text-white shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-slate-950">
                    B
                  </div>

                  <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-slate-500">
                    BACKEND
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Ce qui travaille derrière
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    Le backend exécute la logique qui ne doit pas
                    nécessairement être exposée directement au navigateur.
                  </p>

                  <div className="mt-5 space-y-3">

                    <DarkFeature text="Vérifier l’utilisateur" />
                    <DarkFeature text="Traiter les données" />
                    <DarkFeature text="Interroger la base" />
                    <DarkFeature text="Appeler une API IA" />
                    <DarkFeature text="Utiliser des secrets serveur" />

                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-900 p-4">

                    <p className="text-sm font-semibold">
                      Exemple
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Une clé secrète permettant d&apos;appeler
                      une API IA doit rester côté serveur.
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* REQUÊTE */}

            <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                EXEMPLE CONCRET
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                L&apos;utilisateur demande un résumé à l&apos;IA
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Regardez ce qui peut se produire lorsqu&apos;un utilisateur
                clique simplement sur un bouton dans une application.
              </p>

              <div className="mt-7 space-y-4">

                <RequestStep
                  number="01"
                  title="L’utilisateur écrit son texte"
                  description="Le formulaire est affiché dans le frontend."
                  badge="Frontend"
                />

                <RequestStep
                  number="02"
                  title="Il clique sur Générer"
                  description="Le frontend envoie une requête vers le serveur."
                  badge="Frontend → Backend"
                />

                <RequestStep
                  number="03"
                  title="Le serveur reçoit la demande"
                  description="Le backend vérifie et traite les informations reçues."
                  badge="Backend"
                />

                <RequestStep
                  number="04"
                  title="Le backend appelle l’API IA"
                  description="La clé API reste côté serveur et n’est pas envoyée au navigateur."
                  badge="Backend → API"
                />

                <RequestStep
                  number="05"
                  title="L’IA renvoie sa réponse"
                  description="Le backend récupère le résultat et peut éventuellement l’enregistrer."
                  badge="API → Backend"
                />

                <RequestStep
                  number="06"
                  title="Le résultat apparaît"
                  description="Le backend renvoie les données nécessaires au frontend, qui les affiche."
                  badge="Backend → Frontend"
                />

              </div>

            </section>

            {/* BRIQUES */}

            <section className="mt-10">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                LES BRIQUES
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Ce qui compose notre SaaS
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                <SkillCard
                  code="UI"
                  title="Frontend"
                  description="L’interface."
                />

                <SkillCard
                  code="SV"
                  title="Backend"
                  description="La logique serveur."
                />

                <SkillCard
                  code="AU"
                  title="Auth"
                  description="Les utilisateurs."
                />

                <SkillCard
                  code="DB"
                  title="Database"
                  description="Les données."
                />

                <SkillCard
                  code="AI"
                  title="API IA"
                  description="Le modèle."
                />

              </div>

            </section>

            {/* PROGRAMME */}

            <section className="mt-12">

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                <div>

                  <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                    PROGRAMME
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Construire couche par couche
                  </h2>

                </div>

                <p className="text-sm text-slate-400">
                  {completedCount} / {lessons.length} terminées
                </p>

              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {lessonStates.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    number={lesson.number}
                    title={lesson.title}
                    description={lesson.description}
                    duration={lesson.duration}
                    type={lesson.type}
                    status={lesson.status}
                    href={`/formation/saas-ia/${lesson.number}`}
                    project={lesson.number === "07"}
                  />
                ))}

              </div>

            </section>

            {/* PROJET */}

            <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                <div className="max-w-3xl">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    MINI-PROJET
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Construire une fonctionnalité SaaS IA complète
                  </h2>

                  <p className="mt-4 leading-7 text-slate-400">
                    L&apos;utilisateur se connectera, saisira une demande,
                    votre backend communiquera avec une API IA et le
                    résultat pourra être associé à son compte dans la
                    base de données.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    <DarkStep text="Login" />
                    <Arrow />
                    <DarkStep text="Dashboard" />
                    <Arrow />
                    <DarkStep text="Backend" />
                    <Arrow />
                    <DarkStep text="IA" />
                    <Arrow />
                    <DarkStep text="Database" />

                  </div>

                </div>

                <div className="shrink-0 rounded-2xl bg-white px-7 py-5 text-slate-950">

                  <p className="text-xs font-semibold text-slate-400">
                    OBJECTIF
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    SaaS fonctionnel
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Leçon 07
                  </p>

                </div>

              </div>

            </section>

            {/* NEXT */}

            <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                ENSUITE
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Module 10 — Agents IA
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-500">
                Une fois capable de construire une application IA
                classique, vous apprendrez à créer des systèmes capables
                d&apos;utiliser plusieurs outils et d&apos;enchaîner des
                actions pour atteindre un objectif.
              </p>

            </section>

            {/* MODULE TERMINÉ */}

            {moduleCompleted && (
              <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  MODULE 09 TERMINÉ
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Vous savez assembler les briques d’un SaaS IA.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Frontend, backend, authentification, base de données
                  et API IA forment maintenant une architecture cohérente.
                  Vous pouvez passer aux systèmes capables de choisir
                  et d&apos;exécuter plusieurs actions.
                </p>

                <Link
                  href="/formation/agents-ia"
                  className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Passer au Module 10 →
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
  type,
  status,
  href,
  project,
}: {
  number: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  status: string;
  href: string;
  project: boolean;
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

        <div className="flex flex-wrap justify-end gap-2">

          {project && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Mini-projet
            </span>
          )}

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {type}
          </span>

        </div>

      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between">

        <span className="text-sm text-slate-400">
          {duration}
        </span>

        <span className="text-sm font-semibold text-slate-700">
          {done
            ? "Terminée ✓"
            : locked
            ? "Verrouillée"
            : project
            ? "Commencer le projet →"
            : "Commencer →"}
        </span>

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
// COMPONENTS
// ======================================================

function ArchitectureBlock({
  label,
  sub,
}: {
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 text-slate-950">

      <p className="text-sm font-bold">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {sub}
      </p>

    </div>
  );
}

function RequestStep({
  number,
  title,
  description,
  badge,
}: {
  number: string;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
        {number}
      </div>

      <div className="flex-1">

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

      <span className="w-fit rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
        {badge}
      </span>

    </div>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">

      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs">
        ✓
      </span>

      {text}

    </div>
  );
}

function DarkFeature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">

      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs">
        ✓
      </span>

      {text}

    </div>
  );
}

function SkillCard({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
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
        {description}
      </p>

    </div>
  );
}

function DarkStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm">
      {text}
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}