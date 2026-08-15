import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 05 — PRÉREQUIS
// ======================================================

const previousModuleLessons = [
  "automation-01-logic",
  "automation-02-tri",
  "automation-03-extraction",
  "automation-04-email",
  "automation-05-control",
  "automation-06-workflow",
  "automation-07-project",
];

// ======================================================
// MODULE 06 — CRÉER UN SITE WEB DE A À Z
// ======================================================

const lessons = [
  {
    id: "web-01-fonctionnement",
    number: "01",
    title: "Comprendre le Web",
    duration: "30 min",
    phase: "Fondations",
    description:
      "Comprendre navigateur, URL, serveur, requêtes et découvrir PropertyMatch.",
  },
  {
    id: "web-02-environnement",
    number: "02",
    title: "VS Code & environnement",
    duration: "60 min",
    phase: "Fondations",
    description:
      "Installer les outils, découvrir VS Code, le terminal et créer le projet Next.js.",
  },
  {
    id: "web-03-html-jsx",
    number: "03",
    title: "HTML & JSX",
    duration: "55 min",
    phase: "Interface",
    description:
      "Modifier réellement la page d'accueil et comprendre la structure d'une interface React.",
  },
  {
    id: "web-04-css-tailwind",
    number: "04",
    title: "CSS & Tailwind",
    duration: "65 min",
    phase: "Interface",
    description:
      "Transformer la page brute en véritable interface professionnelle et responsive.",
  },
  {
    id: "web-05-javascript",
    number: "05",
    title: "JavaScript & données",
    duration: "70 min",
    phase: "Programmation",
    description:
      "Créer les logements avec des objets, tableaux et affichages dynamiques.",
  },
  {
    id: "web-06-react-components",
    number: "06",
    title: "Composants & props",
    duration: "65 min",
    phase: "Programmation",
    description:
      "Découper PropertyMatch avec Header et PropertyCard pour organiser le projet.",
  },
  {
    id: "web-07-react-state",
    number: "07",
    title: "State & interactions",
    duration: "75 min",
    phase: "Programmation",
    description:
      "Rendre le formulaire réellement interactif et filtrer les logements en direct.",
  },
  {
    id: "web-08-nextjs",
    number: "08",
    title: "Photos & design premium",
    duration: "70 min",
    phase: "Design",
    description:
      "Ajouter les photos, badges, micro-interactions et améliorer fortement les cartes.",
  },
  {
    id: "web-09-engine",
    number: "09",
    title: "Fiches logements & routes",
    duration: "75 min",
    phase: "Architecture",
    description:
      "Créer les URLs dynamiques et une véritable fiche détaillée pour chaque logement.",
  },
  {
    id: "web-10-application",
    number: "10",
    title: "Centraliser les données",
    duration: "55 min",
    phase: "Architecture",
    description:
      "Créer une source unique de données utilisée par l'accueil et les fiches.",
  },
  {
    id: "web-11-favoris",
    number: "11",
    title: "Favoris fonctionnels",
    duration: "70 min",
    phase: "Fonctionnalités",
    description:
      "Transformer les boutons cœur en véritables favoris et créer leur interface.",
  },
  {
    id: "web-12-matching",
    number: "12",
    title: "Moteur de matching",
    duration: "85 min",
    phase: "Fonctionnalités",
    description:
      "Calculer un vrai score de compatibilité et classer les logements automatiquement.",
  },
  {
    id: "web-13-navigation",
    number: "13",
    title: "Navigation complète",
    duration: "60 min",
    phase: "Produit",
    description:
      "Créer les pages utiles, améliorer le header et rendre le parcours utilisateur cohérent.",
  },
  {
    id: "web-14-premium-home",
    number: "14",
    title: "Refonte premium de l’accueil",
    duration: "90 min",
    phase: "Design final",
    description:
      "Transformer l’accueil en véritable vitrine immobilière premium : hero photo, header haut de gamme, recherche intégrée et nouvelle hiérarchie visuelle.",
  },
  {
    id: "web-15-premium-results",
    number: "15",
    title: "Résultats & cartes premium",
    duration: "85 min",
    phase: "Design final",
    description:
      "Créer des résultats dignes d’un vrai produit : grandes photos, scores de compatibilité, badges, caractéristiques, favoris et actions soignées.",
  },
  {
    id: "web-16-premium-property",
    number: "16",
    title: "Fiche logement premium",
    duration: "95 min",
    phase: "Produit",
    description:
      "Construire une fiche immobilière complète avec galerie, prix, caractéristiques, équipements, analyse de compatibilité et contact agence.",
  },
  {
    id: "web-17-product-pages",
    number: "17",
    title: "Favoris, navigation & footer",
    duration: "80 min",
    phase: "Produit",
    description:
      "Finaliser la page Favoris, enrichir la navigation et ajouter les sections et le footer qui donnent à PropertyMatch l’allure d’un vrai service.",
  },
  {
    id: "web-18-responsive",
    number: "18",
    title: "Responsive & finitions",
    duration: "80 min",
    phase: "Qualité",
    description:
      "Adapter le site web au téléphone et à la tablette, corriger les détails visuels et harmoniser l’expérience sur toutes les tailles d’écran.",
  },
  {
    id: "web-19-tests-git",
    number: "19",
    title: "Tests, debug & GitHub",
    duration: "85 min",
    phase: "Production",
    description:
      "Tester tous les parcours, corriger les derniers problèmes, vérifier le build puis sauvegarder le projet avec Git et GitHub.",
  },
  {
    id: "web-20-publication",
    number: "20",
    title: "Publier PropertyMatch",
    duration: "80 min",
    phase: "Publication",
    description:
      "Mettre PropertyMatch en ligne, obtenir une vraie URL publique et effectuer le contrôle final du site premium terminé.",
  },
];

const totalLessons = lessons.length;

// ======================================================
// PAGE
// ======================================================

export default async function WebModulePage() {
  const supabase = await createClient();

  // ====================================================
  // USER
  // ====================================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // ====================================================
  // PROGRESSION
  // ====================================================

  const { data: progressData, error: progressError } =
    await supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression Module 06 :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => item.completed)
      .map((item) => item.lesson_id) ?? []
  );

  // ====================================================
  // PRÉREQUIS
  // ====================================================

  const previousModuleCompleted =
    previousModuleLessons.every((id) =>
      completedIds.has(id)
    );

  if (!previousModuleCompleted) {
    redirect("/formation/automatisation");
  }

  // ====================================================
  // STATS
  // ====================================================

  const completedCount = lessons.filter((lesson) =>
    completedIds.has(lesson.id)
  ).length;

  const progressPercent =
    totalLessons > 0
      ? Math.round(
          (completedCount / totalLessons) * 100
        )
      : 0;

  const allDone =
    completedCount === totalLessons;

  const nextLesson =
    lessons.find(
      (lesson) => !completedIds.has(lesson.id)
    ) ?? lessons[lessons.length - 1];

  return (
    <main className="min-h-screen bg-[#f4f6fa] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="border-r border-slate-200 bg-white">

          <div className="sticky top-0 flex h-screen flex-col">

            {/* BRAND */}

            <div className="border-b border-slate-200 px-6 py-7">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#020617] text-sm font-black text-white">
                  AI
                </div>

                <div>
                  <p className="font-bold">
                    AI Academy
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Module 06
                  </p>
                </div>

              </div>

            </div>

            {/* MODULE INFO */}

            <div className="border-b border-slate-200 px-6 py-7">

              <p className="text-[11px] font-black tracking-[0.2em] text-slate-400">
                DÉVELOPPEMENT WEB
              </p>

              <h1 className="mt-4 text-xl font-black leading-7">
                Créer un site web de A à Z
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Construisez PropertyMatch sur votre ordinateur puis publiez-le sur Internet.
              </p>

              <div className="mt-7">

                <div className="flex items-center justify-between text-xs">

                  <span className="text-slate-400">
                    Progression
                  </span>

                  <span className="font-black">
                    {progressPercent}%
                  </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />

                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {completedCount} / {totalLessons} leçons terminées
                </p>

              </div>

            </div>

            {/* LESSONS */}

            <div className="flex-1 overflow-y-auto px-4 py-5">

              <div className="space-y-1.5">

                {lessons.map(
                  (lesson, index) => {

                    const done =
                      completedIds.has(
                        lesson.id
                      );

                    const previousDone =
                      index === 0 ||
                      completedIds.has(
                        lessons[index - 1].id
                      );

                    const locked =
                      !done &&
                      !previousDone;

                    const content = (
                      <div
                        className={`flex items-start gap-3 rounded-2xl px-3 py-3 transition ${
                          locked
                            ? "opacity-45"
                            : done
                            ? "bg-slate-50"
                            : "hover:bg-slate-50"
                        }`}
                      >

                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
                            done
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {locked
                            ? "—"
                            : done
                            ? "✓"
                            : lesson.number}
                        </div>

                        <div className="min-w-0">

                          <p
                            className={`text-sm font-bold leading-5 ${
                              locked
                                ? "text-slate-400"
                                : "text-slate-700"
                            }`}
                          >
                            {lesson.title}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {lesson.duration}
                          </p>

                        </div>

                      </div>
                    );

                    if (locked) {
                      return (
                        <div
                          key={lesson.id}
                        >
                          {content}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/formation/python/${lesson.number}`}
                        className="block"
                      >
                        {content}
                      </Link>
                    );
                  }
                )}

              </div>

            </div>

          </div>

        </aside>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="px-6 py-8 md:px-10 xl:px-12">

          <div className="mx-auto max-w-[1220px]">

            {/* TOP BAR */}

            <div className="flex items-center justify-between gap-5">

              <Link
                href="/dashboard"
                className="text-sm font-bold text-slate-500 transition hover:text-slate-950"
              >
                ← Retour au dashboard
              </Link>

              <div className="flex items-center gap-3">

                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">
                  Parcours Pro
                </span>

                <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
                  Module 06
                </span>

              </div>

            </div>

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="mt-8 overflow-hidden rounded-[34px] bg-[#020617] text-white shadow-2xl shadow-slate-300/60">

              <div className="grid gap-12 p-8 md:p-12 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">

                {/* LEFT */}

                <div>

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-[10px] font-black tracking-[0.18em] text-slate-300">
                      MODULE 06
                    </span>

                    <span className="rounded-full border border-slate-700 px-4 py-2 text-[10px] font-black tracking-[0.15em] text-slate-400">
                      PROJET RÉEL
                    </span>

                  </div>

                  <h2 className="mt-8 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.045em] md:text-6xl">
                    Construisez et publiez votre première application web.
                  </h2>

                  <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                    Vous allez créer PropertyMatch étape par étape dans VS Code.
                    Vous partirez d&apos;un dossier vide pour arriver à un véritable site
                    Next.js immobilier, fonctionnel et premium, puis vous le rendrez responsive
                    avant de le publier sur Internet.
                  </p>

                  <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    <HeroStat
                      value="20"
                      label="leçons"
                    />

                    <HeroStat
                      value="1"
                      label="projet fil rouge"
                    />

                    <HeroStat
                      value="1"
                      label="site publié"
                    />

                    <HeroStat
                      value="100%"
                      label="pratique"
                    />

                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">

                    <Link
                      href={`/formation/python/${nextLesson.number}`}
                      className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
                    >
                      {allDone
                        ? "Revoir le projet →"
                        : completedCount === 0
                        ? "Commencer le projet →"
                        : "Continuer le projet →"}
                    </Link>

                    <a
                      href="#programme"
                      className="rounded-2xl border border-slate-700 px-6 py-4 text-sm font-black text-slate-300 transition hover:bg-slate-900"
                    >
                      Voir le programme
                    </a>

                  </div>

                </div>

                {/* PRODUCT MOCKUP */}

                <PropertyMatchMockup />

              </div>

            </section>

            {/* ==================================================
                PROJECT + PROGRESS
            ================================================== */}

            <div className="mt-7 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">

              <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

                <p className="text-[11px] font-black tracking-[0.2em] text-slate-400">
                  PROJET FIL ROUGE
                </p>

                <h3 className="mt-4 text-3xl font-black tracking-tight">
                  PropertyMatch évolue à chaque leçon.
                </h3>

                <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                  Vous ne réalisez pas vingt exercices isolés. Vous construisez
                  progressivement le même produit : interface, données, interactions,
                  fiches logements, favoris et matching, puis vous transformez l’ensemble
                  en véritable produit immobilier premium avant de le publier.
                </p>

              </section>

              <section className="rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-[11px] font-black tracking-[0.2em] text-slate-500">
                  VOTRE PROGRESSION
                </p>

                <div className="mt-5 flex items-end justify-between gap-5">

                  <div>
                    <p className="text-5xl font-black">
                      {progressPercent}%
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {completedCount} leçon(s) terminée(s) sur {totalLessons}
                    </p>
                  </div>

                  <span className="text-3xl">
                    {allDone ? "✓" : "↗"}
                  </span>

                </div>

                <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />

                </div>

              </section>

            </div>

            {/* ==================================================
                PROGRAM
            ================================================== */}

            <section
              id="programme"
              className="mt-12"
            >

              <div className="max-w-3xl">

                <p className="text-[11px] font-black tracking-[0.2em] text-slate-400">
                  PROGRAMME COMPLET
                </p>

                <h3 className="mt-4 text-4xl font-black tracking-tight">
                  20 étapes pour passer de zéro à un site en ligne.
                </h3>

                <p className="mt-4 text-lg leading-8 text-slate-500">
                  Chaque leçon correspond à une vraie évolution de PropertyMatch.
                  Les notions techniques arrivent uniquement au moment où vous en avez besoin.
                </p>

              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">

                {lessons.map(
                  (lesson, index) => {

                    const done =
                      completedIds.has(
                        lesson.id
                      );

                    const previousDone =
                      index === 0 ||
                      completedIds.has(
                        lessons[index - 1].id
                      );

                    const locked =
                      !done &&
                      !previousDone;

                    return (
                      <ProgramCard
                        key={lesson.id}
                        lesson={lesson}
                        done={done}
                        locked={locked}
                      />
                    );
                  }
                )}

              </div>

            </section>

          </div>

        </section>

      </div>
    </main>
  );
}

// ======================================================
// UI
// ======================================================

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">

      <span className="text-lg font-black">
        {value}
      </span>

      <span className="ml-2 text-xs text-slate-500">
        {label}
      </span>

    </div>
  );
}

function ProgramCard({
  lesson,
  done,
  locked,
}: {
  lesson: (typeof lessons)[number];
  done: boolean;
  locked: boolean;
}) {
  const content = (
    <article
      className={`h-full rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition ${
        locked
          ? "opacity-50"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
            done
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {locked
            ? "—"
            : done
            ? "✓"
            : lesson.number}
        </div>

        <div className="flex flex-wrap justify-end gap-2">

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-500">
            {lesson.phase}
          </span>

          <span className="px-1 py-1.5 text-xs text-slate-400">
            {lesson.duration}
          </span>

        </div>

      </div>

      <h4 className="mt-5 text-xl font-black tracking-tight">
        {lesson.title}
      </h4>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {lesson.description}
      </p>

      <p className="mt-5 text-sm font-black">

        {done
          ? "Leçon terminée ✓"
          : locked
          ? "Terminez la leçon précédente"
          : "Commencer la leçon →"}

      </p>

    </article>
  );

  if (locked) {
    return content;
  }

  return (
    <Link
      href={`/formation/python/${lesson.number}`}
      className="block h-full"
    >
      {content}
    </Link>
  );
}

function PropertyMatchMockup() {
  return (
    <div className="mx-auto w-full max-w-[520px]">

      <div className="overflow-hidden rounded-[28px] bg-white text-slate-950 shadow-2xl">

        {/* BROWSER */}

        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4">

          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>

          <div className="ml-2 flex-1 rounded-lg bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-400">
            propertymatch.app
          </div>

        </div>

        <div className="p-5">

          {/* APP HEADER */}

          <div className="flex items-center justify-between">

            <p className="text-sm font-black">
              PropertyMatch
            </p>

            <div className="flex gap-3 text-[8px] font-bold text-slate-400">
              <span>Accueil</span>
              <span>Favoris</span>
              <span>À propos</span>
              <span>Contact</span>
            </div>

          </div>

          {/* SEARCH */}

          <div className="mt-5 rounded-[20px] bg-slate-950 p-5 text-white">

            <p className="text-[8px] font-black tracking-[0.16em] text-slate-500">
              TROUVEZ VOTRE LOGEMENT
            </p>

            <p className="mt-3 text-xl font-black">
              Des résultats adaptés à vos critères.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">

              <MockField
                label="Ville"
                value="Paris"
              />

              <MockField
                label="Budget"
                value="2 300 €"
              />

              <MockField
                label="Chambres"
                value="2+"
              />

            </div>

            <div className="mt-3 rounded-xl bg-white py-3 text-center text-[9px] font-black text-slate-950">
              Rechercher
            </div>

          </div>

          {/* RESULTS */}

          <div className="mt-5">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-[8px] font-black text-slate-400">
                  MEILLEURES CORRESPONDANCES
                </p>

                <p className="mt-1 text-xs font-black">
                  3 logements trouvés
                </p>

              </div>

              <span className="rounded-lg border border-slate-200 px-3 py-2 text-[8px] font-black">
                Score ↓
              </span>

            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">

              <MockProperty
                place="Paris 16e"
                price="2 180 €"
                score="96%"
              />

              <MockProperty
                place="Paris 15e"
                price="2 050 €"
                score="89%"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function MockField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-900 p-3">

      <p className="text-[7px] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-[9px] font-black">
        {value}
      </p>

    </div>
  );
}

function MockProperty({
  place,
  price,
  score,
}: {
  place: string;
  price: string;
  score: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">

      <div className="relative h-16 rounded-lg bg-slate-100">

        <span className="absolute bottom-2 left-2 rounded bg-slate-950 px-2 py-1 text-[7px] font-black text-white">
          {score} match
        </span>

      </div>

      <p className="mt-3 text-[9px] font-black">
        {place}
      </p>

      <p className="mt-1 text-[8px] text-slate-400">
        {price} / mois
      </p>

    </div>
  );
}
