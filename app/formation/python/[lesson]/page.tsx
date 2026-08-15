import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// TYPES
// ======================================================

type Lesson = {
  slug: string;
  id: string;
  number: string;
  title: string;
  duration: string;
  phase: string;
  description: string;
};

type Explanation = {
  code: string;
  text: string;
};

type VisualGuideType =
  | "vscode-empty"
  | "vscode-terminal-open"
  | "vscode-terminal-cursor"
  | "vscode-project-open"
  | "project-map"
  | "page-editor"
  | "save-refresh"
  | "vscode-page04"
  | "site-lesson03"
  | "site-header-hero"
  | "site-search-section"
  | "site-lesson04-final"
  | "site-responsive"
  | "vscode-data-location"
  | "site-data-same-result"
  | "site-four-properties"
  | "site-data-final"
  | "vscode-components-folder"
  | "vscode-property-card"
  | "vscode-header-component"
  | "site-component-same"
  | "site-component-final"
  | "vscode-use-client"
  | "site-search-live"
  | "site-filter-budget"
  | "site-filter-balcony"
  | "site-no-results"
  | "site-search-final"
  | "site-premium-before"
  | "site-premium-cards"
  | "site-premium-hover"
  | "site-premium-mobile"
  | "site-premium-final"
  | "vscode-propertycard-image"
  | "vscode-detail-route"
  | "vscode-detail-page"
  | "site-card-clickable"
  | "site-detail-page"
  | "site-detail-mobile"
  | "site-detail-final"
  | "vscode-data-folder"
  | "vscode-logements-file"
  | "vscode-import-data"
  | "data-flow"
  | "site-shared-data"
  | "site-shared-data-final"
  | "vscode-favorite-button"
  | "vscode-propertycard-favorite"
  | "vscode-detail-favorite"
  | "site-favorite-before"
  | "site-favorite-clicked"
  | "site-favorite-detail"
  | "site-favorite-persist"
  | "site-favorite-final"
  | "matching-before"
  | "matching-form"
  | "matching-code"
  | "matching-results"
  | "matching-budget"
  | "matching-bedroom"
  | "matching-balcony"
  | "matching-final"
  | "nav-before"
  | "nav-header-code"
  | "nav-home"
  | "nav-favorites-empty"
  | "nav-favorites-page"
  | "nav-favorites-filled"
  | "nav-flow"
  | "nav-final"
  | "premium-target"
  | "premium-before"
  | "premium-vscode-home"
  | "premium-header"
  | "premium-hero"
  | "premium-search"
  | "premium-trust"
  | "premium-results-preview"
  | "premium-home-final"
  | "cards-target"
  | "cards-before"
  | "cards-vscode"
  | "cards-photo"
  | "cards-score"
  | "cards-details"
  | "cards-grid"
  | "cards-hover"
  | "cards-best-match"
  | "cards-final"
  | "detail-target"
  | "detail-before"
  | "detail-vscode"
  | "detail-data-gallery"
  | "detail-gallery"
  | "detail-info"
  | "detail-sidebar"
  | "detail-match"
  | "detail-equipment"
  | "detail-contact"
  | "detail-final"
  | "ecosystem-target"
  | "favorites-before"
  | "favorites-vscode"
  | "favorites-premium"
  | "favorites-empty"
  | "header-final"
  | "about-section"
  | "contact-section"
  | "footer-final"
  | "ecosystem-final"
  | "responsive-browser-wide"
  | "responsive-browser-tablet"
  | "responsive-browser-mobile"
  | "responsive-header"
  | "responsive-cards"
  | "responsive-gallery"
  | "responsive-contact"
  | "responsive-final"
  | "design-reference"
  | "design-header"
  | "design-hero"
  | "design-search"
  | "design-results"
  | "design-property-card"
  | "design-detail"
  | "design-about"
  | "design-contact"
  | "design-footer"
  | "design-final"
  | "localhost"
  | "explorer";

type Step =
  | {
      type: "text";
      eyebrow?: string;
      title: string;
      text: string;
    }
  | {
      type: "concept";
      eyebrow?: string;
      title: string;
      text: string;
      items?: {
        title: string;
        text: string;
      }[];
    }
  | {
      type: "action";
      eyebrow?: string;
      title: string;
      text: string;
      actions: string[];
    }
  | {
      type: "terminal";
      eyebrow?: string;
      title: string;
      text: string;
      command: string;
      explanations?: Explanation[];
    }
  | {
      type: "code";
      eyebrow?: string;
      title: string;
      text: string;
      code: string;
      explanations?: Explanation[];
    }
  | {
      type: "observe";
      eyebrow?: string;
      title: string;
      text: string;
      result?: string;
    }
  | {
      type: "warning";
      eyebrow?: string;
      title: string;
      text: string;
    }
  | {
      type: "checkpoint";
      eyebrow?: string;
      title: string;
      text: string;
      items: string[];
    }
  | {
      type: "download";
      eyebrow?: string;
      title: string;
      text: string;
      options: {
        platform: "macOS" | "Windows" | "Autre";
        description: string;
        href: string;
        button: string;
      }[];
    }
  | {
      type: "visual-guide";
      eyebrow?: string;
      title: string;
      text: string;
      visual: VisualGuideType;
    }
  | {
      type: "os-guide";
      eyebrow?: string;
      title: string;
      text: string;
      mac: {
        title: string;
        steps: string[];
      };
      windows: {
        title: string;
        steps: string[];
      };
    };

// ======================================================
// LESSONS
// ======================================================

const lessons: Lesson[] = [
  {
    slug: "01",
    id: "web-01-fonctionnement",
    number: "01",
    title: "Comprendre ce que nous allons construire",
    duration: "30 min",
    phase: "Fondations",
    description:
      "Comprendre ce qu'est un site web, comment il fonctionne et découvrir PropertyMatch.",
  },
  {
    slug: "02",
    id: "web-02-environnement",
    number: "02",
    title: "Créer PropertyMatch dans VS Code",
    duration: "60 min",
    phase: "Fondations",
    description:
      "Installer les outils, découvrir VS Code et créer le vrai projet Next.js.",
  },
  {
    slug: "03",
    id: "web-03-html-jsx",
    number: "03",
    title: "Construire la page d'accueil",
    duration: "55 min",
    phase: "Interface",
    description:
      "Modifier le vrai projet et comprendre la structure de la première page.",
  },
  {
    slug: "04",
    id: "web-04-css-tailwind",
    number: "04",
    title: "Créer une interface professionnelle",
    duration: "65 min",
    phase: "Interface",
    description:
      "Construire le premier vrai front premium de PropertyMatch avec Tailwind.",
  },
  {
    slug: "05",
    id: "web-05-javascript",
    number: "05",
    title: "Ajouter les logements avec JavaScript",
    duration: "70 min",
    phase: "Programmation",
    description:
      "Stocker les logements dans des données et générer automatiquement les cartes.",
  },
  {
    slug: "06",
    id: "web-06-react-components",
    number: "06",
    title: "Organiser PropertyMatch avec React",
    duration: "65 min",
    phase: "Programmation",
    description:
      "Créer Header et PropertyCard pour organiser proprement le projet.",
  },
  {
    slug: "07",
    id: "web-07-react-state",
    number: "07",
    title: "Rendre la recherche interactive",
    duration: "75 min",
    phase: "Programmation",
    description:
      "Utiliser state, événements et filtres pour faire réagir réellement le site.",
  },
  {
    slug: "08",
    id: "web-08-nextjs",
    number: "08",
    title: "Photos & design premium",
    duration: "70 min",
    phase: "Design",
    description:
      "Ajouter des photos, badges, micro-interactions et améliorer fortement les cartes.",
  },
  {
    slug: "09",
    id: "web-09-engine",
    number: "09",
    title: "Fiches logements & routes",
    duration: "75 min",
    phase: "Architecture",
    description:
      "Créer les routes dynamiques et une véritable fiche détaillée pour chaque logement.",
  },
  {
    slug: "10",
    id: "web-10-application",
    number: "10",
    title: "Centraliser les données",
    duration: "55 min",
    phase: "Architecture",
    description:
      "Créer une source unique de données utilisée par l'accueil et les fiches.",
  },
  {
    slug: "11",
    id: "web-11-favoris",
    number: "11",
    title: "Favoris fonctionnels",
    duration: "70 min",
    phase: "Fonctionnalités",
    description:
      "Créer des favoris persistants et réutiliser le même comportement sur les cartes et les fiches.",
  },
  {
    slug: "12",
    id: "web-12-matching",
    number: "12",
    title: "Moteur de matching",
    duration: "85 min",
    phase: "Fonctionnalités",
    description:
      "Calculer un vrai score de compatibilité et classer automatiquement les logements.",
  },
  {
    slug: "13",
    id: "web-13-navigation",
    number: "13",
    title: "Navigation complète",
    duration: "60 min",
    phase: "Produit",
    description:
      "Créer les pages utiles et rendre le parcours utilisateur cohérent dans toute l'application.",
  },
  {
    slug: "14",
    id: "web-14-premium-home",
    number: "14",
    title: "Refonte premium de l’accueil",
    duration: "90 min",
    phase: "Design final",
    description:
      "Transformer l’accueil en véritable vitrine immobilière premium : hero photo, header haut de gamme, recherche intégrée et nouvelle hiérarchie visuelle.",
  },
  {
    slug: "15",
    id: "web-15-premium-results",
    number: "15",
    title: "Résultats & cartes premium",
    duration: "85 min",
    phase: "Design final",
    description:
      "Créer des résultats dignes d’un vrai produit : grandes photos, scores de compatibilité, badges, caractéristiques, favoris et actions soignées.",
  },
  {
    slug: "16",
    id: "web-16-premium-property",
    number: "16",
    title: "Fiche logement premium",
    duration: "95 min",
    phase: "Produit",
    description:
      "Construire une fiche immobilière complète avec galerie, prix, caractéristiques, équipements, analyse de compatibilité et contact agence.",
  },
  {
    slug: "17",
    id: "web-17-product-pages",
    number: "17",
    title: "Favoris, navigation & footer",
    duration: "80 min",
    phase: "Produit",
    description:
      "Finaliser la page Favoris, enrichir la navigation et ajouter les sections et le footer qui donnent à PropertyMatch l’allure d’un vrai service.",
  },
  {
    slug: "18",
    id: "web-18-responsive",
    number: "18",
    title: "Responsive & finitions",
    duration: "80 min",
    phase: "Qualité",
    description:
      "Adapter le site web au téléphone et à la tablette, corriger les détails visuels et harmoniser l’expérience sur toutes les tailles d’écran.",
  },
  {
    slug: "19",
    id: "web-19-tests-git",
    number: "19",
    title: "Tests, debug & GitHub",
    duration: "85 min",
    phase: "Production",
    description:
      "Tester tous les parcours, corriger les derniers problèmes, vérifier le build puis sauvegarder le projet avec Git et GitHub.",
  },
  {
    slug: "20",
    id: "web-20-publication",
    number: "20",
    title: "Publier PropertyMatch",
    duration: "80 min",
    phase: "Publication",
    description:
      "Mettre PropertyMatch en ligne, obtenir une vraie URL publique et effectuer le contrôle final du site premium terminé.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default async function WebLessonPage({
  params,
}: {
  params: Promise<{
    lesson: string;
  }>;
}) {
  const { lesson: slug } = await params;

  const lesson = lessons.find(
    (item) => item.slug === slug
  );

  if (!lesson) {
    notFound();
  }

  const lessonId = lesson.id;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // ====================================================
  // PROGRESSION
  // ====================================================

  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select(
      "id, lesson_id, completed, score"
    )
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter(
        (item) => item.completed
      )
      .map(
        (item) => item.lesson_id
      ) ?? []
  );

  const currentIndex =
    lessons.findIndex(
      (item) =>
        item.id === lesson.id
    );

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : null;

  const allowed =
    currentIndex === 0 ||
    previousLesson === null ||
    completedIds.has(
      previousLesson.id
    );

  if (!allowed) {
    redirect("/formation/python");
  }

  const lessonCompleted =
    completedIds.has(lesson.id);

  const steps =
    getLessonSteps(slug);

  const nextLesson =
    currentIndex <
    lessons.length - 1
      ? lessons[
          currentIndex + 1
        ]
      : null;

  // ====================================================
  // VALIDATION
  // ====================================================

  async function validateLesson() {
    "use server";

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
      data: existingProgress,
      error: existingError,
    } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq(
        "lesson_id",
        lessonId
      )
      .maybeSingle();

    if (existingError) {
      console.error(
        "Erreur recherche progression :",
        existingError
      );

      throw new Error(
        "Impossible de valider cette leçon."
      );
    }

    if (existingProgress) {
      const { error } =
        await supabase
          .from(
            "lesson_progress"
          )
          .update({
            completed: true,
            score: 100,
          })
          .eq(
            "id",
            existingProgress.id
          );

      if (error) {
        console.error(
          "Erreur mise à jour progression :",
          error
        );

        throw new Error(
          "Impossible de valider cette leçon."
        );
      }
    } else {
      const { error } =
        await supabase
          .from(
            "lesson_progress"
          )
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            score: 100,
          });

      if (error) {
        console.error(
          "Erreur création progression :",
          error
        );

        throw new Error(
          "Impossible de valider cette leçon."
        );
      }
    }

    if (nextLesson) {
      redirect(
        `/formation/python/${nextLesson.slug}`
      );
    }

    redirect("/formation/python");
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">

        {/* ==================================================
            TOP
        ================================================== */}

        <header className="flex items-center justify-between gap-5">

          <Link
            href="/formation/python"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au module
          </Link>

          <div className="flex items-center gap-2">

            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500">
              {lesson.phase}
            </span>

            <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white">
              {lesson.number} / 20
            </span>

          </div>

        </header>

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="mt-7 overflow-hidden rounded-[34px] bg-slate-950 text-white shadow-xl">

          <div className="grid gap-10 p-7 lg:grid-cols-[1fr_390px] lg:p-10">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full border border-slate-700 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] text-slate-400">
                  LEÇON {lesson.number}
                </span>

                {lessonCompleted && (
                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-950">
                    ✓ TERMINÉE
                  </span>
                )}

              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl">
                {lesson.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">
                {lesson.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <HeroTag>
                  {lesson.duration}
                </HeroTag>

                <HeroTag>
                  Projet réel
                </HeroTag>

                {Number(
                  lesson.number
                ) >= 2 && (
                  <HeroTag>
                    Travail dans VS Code
                  </HeroTag>
                )}

              </div>

            </div>

            {/* WORKFLOW */}

            <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-6">

              <p className="text-[11px] font-bold tracking-[0.16em] text-slate-500">
                VOTRE ENVIRONNEMENT
              </p>

              <div className="mt-5 space-y-3">

                <WorkflowLine
                  number="01"
                  title="La formation"
                  text="Vous guide étape par étape."
                />

                <WorkflowArrow />

                <WorkflowLine
                  number="02"
                  title="VS Code"
                  text="Vous construisez le vrai projet."
                />

                <WorkflowArrow />

                <WorkflowLine
                  number="03"
                  title="Navigateur"
                  text="Vous observez le résultat."
                />

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_320px]">

          <section className="space-y-5">

            {steps.map(
              (step, index) => (
                <LessonStep
                  key={`${step.title}-${index}`}
                  index={
                    index + 1
                  }
                  step={step}
                />
              )
            )}

            {/* ==================================================
                VALIDATION
            ================================================== */}

            <section className="rounded-[30px] bg-slate-950 p-7 text-white shadow-xl md:p-8">

              {lessonCompleted ? (
                <>
                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-bold text-slate-950">
                      ✓
                    </div>

                    <div>

                      <p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">
                        LEÇON VALIDÉE
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        Cette étape est terminée.
                      </h2>

                    </div>

                  </div>

                  <p className="mt-5 max-w-3xl leading-7 text-slate-400">
                    Votre progression est enregistrée. Vous pouvez continuer la construction du même projet PropertyMatch.
                  </p>

                  {nextLesson ? (
                    <Link
                      href={`/formation/python/${nextLesson.slug}`}
                      className="mt-6 inline-flex rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-slate-100"
                    >
                      Passer à la leçon{" "}
                      {nextLesson.number} →
                    </Link>
                  ) : lesson.number === "20" ? (
                    <Link
                      href="/formation/python"
                      className="mt-6 inline-flex rounded-2xl bg-white px-6 py-4 font-bold text-slate-950"
                    >
                      Terminer le module →
                    </Link>
                  ) : (
                    <Link
                      href="/formation/python"
                      className="mt-6 inline-flex rounded-2xl bg-white px-6 py-4 font-bold text-slate-950"
                    >
                      Retour au programme →
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">
                    FIN DE LA LEÇON
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Vérifiez votre vrai travail avant de continuer.
                  </h2>

                  <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                    Les checkpoints précédents ne sont pas décoratifs. Vérifiez réellement votre ordinateur et votre projet avant de débloquer la suite.
                  </p>

                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                    <div className="flex gap-3">

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
                        ✓
                      </span>

                      <div>

                        <p className="text-sm font-bold">
                          PropertyMatch est votre exercice.
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Vous ne passez pas dans un simulateur séparé. Tout ce que vous apprenez est directement appliqué dans votre propre projet.
                        </p>

                      </div>

                    </div>

                  </div>

                  <form
                    action={
                      validateLesson
                    }
                  >

                    <button
                      type="submit"
                      className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-slate-100"
                    >
                      J&apos;ai vérifié — continuer
                      <span>→</span>
                    </button>

                  </form>
                </>
              )}

            </section>

          </section>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="h-fit space-y-4 xl:sticky xl:top-6">

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                PROPERTYMATCH
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Un seul projet pendant tout le module
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                À partir de la leçon 02, vous travaillez directement dans votre propre dossier PropertyMatch.
              </p>

              <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">

                <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
                  PARCOURS
                </p>

                <p className="mt-2 text-sm font-semibold leading-6">
                  VS Code
                  {" → "}
                  localhost
                  {" → "}
                  application complète
                  {" → "}
                  Internet
                </p>

              </div>

            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  ?
                </div>

                <div>

                  <p className="font-bold">
                    Vous êtes bloqué ?
                  </p>

                  <p className="text-xs text-slate-400">
                    Ne devinez pas.
                  </p>

                </div>

              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Si votre écran est différent, si une commande affiche une erreur ou si quelque chose devient rouge dans VS Code, regardez d'abord le message affiché avant de continuer.
              </p>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

// ======================================================
// STEP RENDERER
// ======================================================

function LessonStep({
  index,
  step,
}: {
  index: number;
  step: Step;
}) {
  // ====================================================
  // WARNING
  // ====================================================

  if (
    step.type === "warning"
  ) {
    return (
      <section className="rounded-[28px] border border-slate-300 bg-slate-100 p-7">

        <StepHeader
          index={index}
          eyebrow={
            step.eyebrow ??
            "ATTENTION"
          }
          title={step.title}
        />

        <p className="mt-5 leading-7 text-slate-600">
          {step.text}
        </p>

      </section>
    );
  }

  // ====================================================
  // OBSERVE
  // ====================================================

  if (
    step.type === "observe"
  ) {
    return (
      <section className="rounded-[28px] bg-slate-950 p-7 text-white">

        <StepHeaderDark
          index={index}
          eyebrow={
            step.eyebrow ??
            "OBSERVEZ"
          }
          title={step.title}
        />

        <p className="mt-5 leading-7 text-slate-400">
          {step.text}
        </p>

        {step.result && (
          <div className="mt-6 rounded-2xl bg-white p-5 text-slate-950">

            <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400">
              EXEMPLE
            </p>

            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7">
              {step.result}
            </pre>

          </div>
        )}

      </section>
    );
  }

  // ====================================================
  // DOWNLOAD
  // ====================================================

  if (
    step.type === "download"
  ) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">

        <StepHeader
          index={index}
          eyebrow={
            step.eyebrow ??
            "INSTALLATION"
          }
          title={step.title}
        />

        <p className="mt-5 max-w-3xl leading-7 text-slate-500">
          {step.text}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {step.options.map(
            (option) => (
              <div
                key={`${option.platform}-${option.button}`}
                className="rounded-[22px] border border-slate-200 p-5"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                    {option.platform ===
                    "macOS"
                      ? "⌘"
                      : option.platform ===
                          "Windows"
                        ? "⊞"
                        : "↓"}
                  </div>

                  <div>

                    <p className="font-bold">
                      {option.platform}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {option.description}
                    </p>

                  </div>

                </div>

                <a
                  href={
                    option.href
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex w-full items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {option.button}
                  <span>↗</span>
                </a>

              </div>
            )
          )}

        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">

          <p className="text-sm leading-6 text-slate-500">
            Utilisez les liens officiels fournis dans la formation. Évitez les sites de téléchargement tiers.
          </p>

        </div>

      </section>
    );
  }

  // ====================================================
  // OS GUIDE
  // ====================================================

  if (
    step.type === "os-guide"
  ) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">

        <StepHeader
          index={index}
          eyebrow={
            step.eyebrow ??
            "MAC / WINDOWS"
          }
          title={step.title}
        />

        <p className="mt-5 max-w-3xl leading-7 text-slate-500">
          {step.text}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">

          <OSCard
            icon="⌘"
            system="macOS"
            title={
              step.mac.title
            }
            steps={
              step.mac.steps
            }
          />

          <OSCard
            icon="⊞"
            system="Windows"
            title={
              step.windows.title
            }
            steps={
              step.windows
                .steps
            }
          />

        </div>

      </section>
    );
  }

  // ====================================================
  // VISUAL
  // ====================================================

  if (
    step.type ===
    "visual-guide"
  ) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">

        <StepHeader
          index={index}
          eyebrow={
            step.eyebrow ??
            "REPÈRE VISUEL"
          }
          title={step.title}
        />

        <p className="mt-5 max-w-3xl leading-7 text-slate-500">
          {step.text}
        </p>

        <div className="mt-6">
          <VisualGuide
            type={
              step.visual
            }
          />
        </div>

      </section>
    );
  }

  // ====================================================
  // NORMAL CARD
  // ====================================================

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">

      <StepHeader
        index={index}
        eyebrow={
          step.eyebrow ??
          getDefaultEyebrow(
            step.type
          )
        }
        title={step.title}
      />

      <p className="mt-5 leading-7 text-slate-500">
        {step.text}
      </p>

      {/* CONCEPT */}

      {step.type ===
        "concept" &&
        step.items && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">

            {step.items.map(
              (item) => (
                <div
                  key={
                    item.title
                  }
                  className="rounded-2xl bg-slate-50 p-5"
                >

                  <p className="font-bold">
                    {item.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      {/* ACTION */}

      {step.type ===
        "action" && (
          <div className="mt-6 space-y-3">

            {step.actions.map(
              (
                action,
                actionIndex
              ) => (
                <div
                  key={`${action}-${actionIndex}`}
                  className="flex gap-4 rounded-2xl bg-slate-50 p-4"
                >

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                    {actionIndex +
                      1}
                  </span>

                  <p className="pt-1 text-sm leading-6 text-slate-600">
                    {action}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      {/* TERMINAL */}

      {step.type ===
        "terminal" && (
          <>
            <CodeWindow
              label="TERMINAL VS CODE"
              code={
                step.command
              }
            />

            {step.explanations && (
              <CodeExplanations
                explanations={
                  step.explanations
                }
              />
            )}
          </>
        )}

      {/* CODE */}

      {step.type ===
        "code" && (
          <>
            <CodeWindow
              label="DANS VS CODE"
              code={
                step.code
              }
            />

            {step.explanations && (
              <CodeExplanations
                explanations={
                  step.explanations
                }
              />
            )}
          </>
        )}

      {/* CHECKPOINT */}

      {step.type ===
        "checkpoint" && (
          <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">

            <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
              AVANT DE CONTINUER
            </p>

            <div className="mt-4 space-y-3">

              {step.items.map(
                (item) => (
                  <div
                    key={item}
                    className="flex gap-3"
                  >

                    <span className="font-bold">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-slate-300">
                      {item}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        )}

    </section>
  );
}

// ======================================================
// LESSON CONTENT
// ======================================================

function getLessonSteps(
  slug: string
): Step[] {
  switch (slug) {
    // ====================================================
    // 01
    // ====================================================

    case "01":
      return [
        {
          type: "text",
          eyebrow:
            "AVANT DE COMMENCER",
          title:
            "Vous allez construire un vrai site.",
          text:
            "Pendant ce module, notre plateforme vous guidera mais le véritable projet sera créé sur votre ordinateur. À partir de la leçon 02, vous utiliserez VS Code, un terminal et votre navigateur pour construire progressivement PropertyMatch.",
        },

        {
          type: "concept",
          title:
            "Qu'est-ce qu'un site web ?",
          text:
            "Un site web est composé de pages et éventuellement de fonctionnalités accessibles depuis un navigateur. Certains sites servent principalement à afficher du contenu. D'autres sont de véritables applications permettant à l'utilisateur d'effectuer des actions.",
          items: [
            {
              title:
                "Navigateur",
              text:
                "Chrome, Safari, Firefox ou Edge permettent d'accéder aux sites et applications web.",
            },
            {
              title:
                "Page web",
              text:
                "Une interface affichée dans le navigateur.",
            },
            {
              title: "URL",
              text:
                "Une adresse permettant d'accéder à une ressource.",
            },
            {
              title: "Code",
              text:
                "Les instructions et structures utilisées pour construire l'application.",
            },
          ],
        },

        {
          type: "concept",
          title:
            "Frontend et backend",
          text:
            "Pour commencer, nous allons utiliser une séparation simple. Le frontend correspond principalement à l'interface avec laquelle l'utilisateur interagit. Le backend correspond principalement aux traitements et données situés derrière cette interface.",
          items: [
            {
              title:
                "Frontend",
              text:
                "Titres, boutons, formulaires, cartes, menus et autres éléments visibles.",
            },
            {
              title:
                "Backend",
              text:
                "Traitements, accès aux données et règles métier qui ne sont pas directement visibles.",
            },
          ],
        },

        {
          type: "concept",
          title:
            "Navigateur, requête, serveur et réponse",
          text:
            "Lorsqu'une ressource est demandée, le navigateur peut envoyer une requête à un serveur. Le serveur traite cette demande et renvoie une réponse que le navigateur utilise ensuite.",
          items: [
            {
              title:
                "Requête",
              text:
                "Une demande envoyée.",
            },
            {
              title:
                "Serveur",
              text:
                "Un système capable de recevoir et traiter certaines demandes.",
            },
            {
              title:
                "Réponse",
              text:
                "Ce que le serveur renvoie après le traitement.",
            },
            {
              title:
                "Affichage",
              text:
                "Le navigateur interprète ce qu'il reçoit et met à jour l'interface.",
            },
          ],
        },

        {
          type: "observe",
          title:
            "Le circuit simplifié",
          text:
            "Retenez surtout le principe général. Nous approfondirons progressivement.",
          result: `UTILISATEUR
     ↓
NAVIGATEUR
     ↓
REQUÊTE
     ↓
SERVEUR
     ↓
RÉPONSE
     ↓
NAVIGATEUR
     ↓
INTERFACE`,
        },

        {
          type: "concept",
          eyebrow:
            "PROJET DU MODULE",
          title:
            "PropertyMatch",
          text:
            "PropertyMatch sera une application immobilière permettant à un utilisateur d'indiquer ses critères puis d'obtenir des logements classés selon leur compatibilité.",
          items: [
            {
              title:
                "Recherche",
              text:
                "Ville, budget, chambres, balcon et autres critères.",
            },
            {
              title:
                "Matching",
              text:
                "Une logique comparera les critères aux logements.",
            },
            {
              title:
                "Résultats",
              text:
                "Les meilleurs logements seront classés avec un score.",
            },
            {
              title:
                "Publication",
              text:
                "Le même projet sera finalement mis en ligne.",
            },
          ],
        },

        {
          type: "checkpoint",
          title:
            "Avant de commencer à coder",
          text:
            "Assurez-vous simplement de comprendre ces idées.",
          items: [
            "Je sais ce qu'est un navigateur.",
            "Je comprends globalement frontend et backend.",
            "Je comprends l'idée requête → traitement → réponse.",
            "Je sais que PropertyMatch sera créé réellement sur mon ordinateur.",
          ],
        },
      ];

    // ====================================================
    // 02 — LEÇON ULTRA GUIDÉE
    // ====================================================

    case "02":
      return [
        {
          type: "text",
          eyebrow:
            "LE VRAI PROJET COMMENCE",
          title:
            "Vous allez maintenant travailler sur votre propre ordinateur.",
          text:
            "À partir de cette leçon, PropertyMatch n'est plus une simple démonstration dans la formation. Vous allez installer les outils nécessaires, créer un véritable projet et le faire fonctionner localement.",
        },

        {
          type: "concept",
          eyebrow:
            "AUCUN PRÉREQUIS",
          title:
            "Vous n'avez jamais utilisé VS Code ? Ce n'est pas un problème.",
          text:
            "Nous allons partir exactement de l'écran que vous voyez après avoir ouvert VS Code pour la première fois. Chaque outil sera expliqué au moment où vous en aurez besoin.",
          items: [
            {
              title:
                "Formation",
              text:
                "Vous indique quoi faire et pourquoi.",
            },
            {
              title:
                "VS Code",
              text:
                "Contiendra les fichiers et le code de PropertyMatch.",
            },
            {
              title:
                "Terminal",
              text:
                "Permettra d'exécuter certaines commandes.",
            },
            {
              title:
                "Navigateur",
              text:
                "Affichera le résultat de votre travail.",
            },
          ],
        },

        // VS CODE INSTALL

        {
          type: "download",
          eyebrow:
            "ÉTAPE 1",
          title:
            "Installez Visual Studio Code",
          text:
            "VS Code est l'éditeur de code que nous utiliserons pendant tout le projet. Choisissez le bouton correspondant à votre ordinateur.",
          options: [
            {
              platform:
                "macOS",
              description:
                "MacBook, iMac, Mac mini...",
              href:
                "https://code.visualstudio.com/docs/setup/mac",
              button:
                "Installer VS Code sur Mac",
            },
            {
              platform:
                "Windows",
              description:
                "PC sous Windows",
              href:
                "https://code.visualstudio.com/docs/setup/windows",
              button:
                "Installer VS Code sur Windows",
            },
          ],
        },

        {
          type: "os-guide",
          title:
            "Installez puis ouvrez VS Code",
          text:
            "Suivez uniquement les instructions correspondant à votre ordinateur.",
          mac: {
            title:
              "Installation sur Mac",
            steps: [
              "Téléchargez Visual Studio Code.",
              "Ouvrez le fichier téléchargé.",
              "Placez Visual Studio Code dans Applications si nécessaire.",
              "Ouvrez Visual Studio Code.",
              "Autorisez son ouverture si macOS vous demande confirmation.",
            ],
          },
          windows: {
            title:
              "Installation sur Windows",
            steps: [
              "Téléchargez l'installateur Windows.",
              "Ouvrez le fichier téléchargé.",
              "Suivez l'assistant d'installation.",
              "Terminez l'installation.",
              "Ouvrez Visual Studio Code.",
            ],
          },
        },

        // EMPTY VS CODE

        {
          type:
            "visual-guide",
          eyebrow:
            "VOTRE ÉCRAN",
          title:
            "VS Code est presque vide : c'est normal.",
          text:
            "Aucun projet n'est encore ouvert. Votre écran doit donc ressembler globalement à celui-ci. Ne cherchez pas encore le dossier PropertyMatch : il n'existe pas.",
          visual:
            "vscode-empty",
        },

        {
          type: "concept",
          title:
            "Repérez seulement les zones importantes",
          text:
            "VS Code contient beaucoup d'outils. Pour le moment, nous allons volontairement en ignorer la majorité.",
          items: [
            {
              title:
                "Barre latérale",
              text:
                "La colonne d'icônes située complètement à gauche.",
            },
            {
              title:
                "Explorer",
              text:
                "La première icône permettra d'afficher les fichiers d'un projet.",
            },
            {
              title:
                "Zone centrale",
              text:
                "Les fichiers que vous ouvrirez apparaîtront ici.",
            },
            {
              title:
                "Terminal",
              text:
                "Il n'est pas encore visible. Nous allons l'ouvrir maintenant.",
            },
          ],
        },

        // TERMINAL

        {
          type: "concept",
          title:
            "Qu'est-ce qu'un terminal ?",
          text:
            "Habituellement, vous demandez quelque chose à votre ordinateur en cliquant. Un terminal permet également de donner des instructions à l'ordinateur, mais sous forme de texte.",
          items: [
            {
              title:
                "Commande",
              text:
                "Une instruction écrite dans le terminal.",
            },
            {
              title:
                "Entrée",
              text:
                "La touche Entrée demande au terminal d'exécuter la commande.",
            },
          ],
        },

        {
          type: "action",
          eyebrow:
            "FAITES-LE",
          title:
            "Ouvrez le terminal",
          text:
            "Suivez exactement ces étapes dans VS Code.",
          actions: [
            "Regardez la barre de menus située tout en haut de VS Code.",
            "Cliquez sur Terminal.",
            "Cliquez sur New Terminal.",
            "Regardez la partie inférieure de la fenêtre.",
            "Un panneau TERMINAL doit être apparu.",
          ],
        },

        {
          type:
            "visual-guide",
          eyebrow:
            "RÉSULTAT ATTENDU",
          title:
            "Le terminal est maintenant visible en bas",
          text:
            "La grande partie supérieure reste votre zone de travail. Le nouveau panneau inférieur est le terminal.",
          visual:
            "vscode-terminal-open",
        },

        {
          type: "concept",
          title:
            "Ne supprimez pas le texte déjà affiché",
          text:
            "Le terminal affiche automatiquement certaines informations. Dans nos illustrations, notre utilisateur fictif s'appelle Jean. Votre ordinateur affichera naturellement autre chose.",
          items: [
            {
              title:
                "jean",
              text:
                "Nom fictif utilisé dans la formation.",
            },
            {
              title:
                "MacBook-Pro",
              text:
                "Exemple de nom de machine.",
            },
            {
              title: "~",
              text:
                "Représente ici le dossier personnel.",
            },
            {
              title:
                "% ou >",
              text:
                "Un symbole peut apparaître avant la zone dans laquelle vous écrivez.",
            },
          ],
        },

        {
          type:
            "visual-guide",
          eyebrow:
            "OÙ TAPER ?",
          title:
            "Écrivez après le curseur",
          text:
            "Cliquez dans le terminal à l'endroit indiqué. Vous ne devez pas réécrire le nom de l'utilisateur ni le symbole.",
          visual:
            "vscode-terminal-cursor",
        },

        {
          type: "terminal",
          eyebrow:
            "PREMIÈRE COMMANDE",
          title:
            "Demandez au terminal où vous êtes",
          text:
            "Tapez exactement pwd puis appuyez sur Entrée.",
          command: "pwd",
          explanations: [
            {
              code: "pwd",
              text:
                "Print Working Directory : affiche le dossier de travail actuel.",
            },
          ],
        },

        {
          type: "observe",
          title:
            "Exemple de résultat sur Mac",
          text:
            "Votre résultat sera probablement différent. C'est normal.",
          result: `jean@MacBook-Pro ~ % pwd
/Users/jean

jean@MacBook-Pro ~ %`,
        },

        {
          type: "concept",
          title:
            "Vous venez d'utiliser votre première commande",
          text:
            "Le mécanisme est simple : écrire → Entrée → exécution → résultat éventuel → nouvelle ligne prête.",
          items: [
            {
              title:
                "Écrire",
              text:
                "Vous tapez la commande.",
            },
            {
              title:
                "Entrée",
              text:
                "Vous demandez son exécution.",
            },
            {
              title:
                "Résultat",
              text:
                "Le terminal peut afficher une réponse.",
            },
            {
              title:
                "Nouvelle invite",
              text:
                "Le terminal attend la commande suivante.",
            },
          ],
        },

        {
          type: "os-guide",
          title:
            "Regardez les fichiers présents",
          text:
            "Nous allons maintenant demander au terminal d'afficher le contenu du dossier actuel.",
          mac: {
            title:
              "Sur Mac",
            steps: [
              "Cliquez dans le terminal.",
              "Tapez ls.",
              "Appuyez sur Entrée.",
              "Le contenu du dossier apparaît.",
            ],
          },
          windows: {
            title:
              "Sur Windows",
            steps: [
              "Dans PowerShell, vous pouvez taper ls.",
              "La commande dir peut également être utilisée.",
              "Appuyez sur Entrée.",
              "Le contenu du dossier apparaît.",
            ],
          },
        },

        // NODE

        {
          type: "concept",
          eyebrow:
            "OUTIL NÉCESSAIRE",
          title:
            "Pourquoi installer Node.js ?",
          text:
            "PropertyMatch sera construit avec Next.js. Node.js fournit l'environnement nécessaire pour utiliser Next.js et de nombreux outils modernes du développement web.",
          items: [
            {
              title:
                "Node.js",
              text:
                "Permet notamment d'exécuter JavaScript en dehors du navigateur.",
            },
            {
              title: "npm",
              text:
                "Outil fourni avec Node.js permettant notamment de gérer des packages et scripts.",
            },
          ],
        },

        {
          type: "download",
          title:
            "Installez Node.js",
          text:
            "Téléchargez Node.js depuis son site officiel. Choisissez une version LTS.",
          options: [
            {
              platform:
                "macOS",
              description:
                "Version LTS pour Mac",
              href:
                "https://nodejs.org/en/download",
              button:
                "Télécharger Node.js",
            },
            {
              platform:
                "Windows",
              description:
                "Version LTS pour Windows",
              href:
                "https://nodejs.org/en/download",
              button:
                "Télécharger Node.js",
            },
          ],
        },

        {
          type: "warning",
          title:
            "Rouvrez VS Code après l'installation",
          text:
            "Une fois Node.js installé, fermez complètement VS Code puis rouvrez-le. Ouvrez ensuite un nouveau terminal avec Terminal → New Terminal.",
        },

        {
          type: "terminal",
          title:
            "Vérifiez Node.js",
          text:
            "Tapez cette commande puis appuyez sur Entrée.",
          command:
            "node --version",
          explanations: [
            {
              code:
                "node",
              text:
                "Le programme Node.js.",
            },
            {
              code:
                "--version",
              text:
                "Demande d'afficher la version installée.",
            },
          ],
        },

        {
          type: "observe",
          title:
            "Un numéro doit apparaître",
          text:
            "Le numéro exact dépend de la version que vous avez installée.",
          result: `node --version

vXX.XX.X

✓ Node.js fonctionne`,
        },

        {
          type: "terminal",
          title:
            "Vérifiez npm",
          text:
            "npm est normalement installé automatiquement avec Node.js.",
          command:
            "npm --version",
          explanations: [
            {
              code:
                "npm",
              text:
                "Outil que nous utiliserons régulièrement dans le projet.",
            },
          ],
        },

        {
          type: "warning",
          title:
            "Une commande n'est pas reconnue ?",
          text:
            "Ne continuez pas encore. Vérifiez l'installation de Node.js, fermez VS Code, rouvrez-le puis ouvrez un nouveau terminal avant de réessayer.",
        },

        // CREATE APP

        {
          type: "text",
          eyebrow:
            "CRÉATION DE PROPERTYMATCH",
          title:
            "Nous sommes maintenant prêts à créer le projet.",
          text:
            "Jusqu'ici, aucun dossier PropertyMatch n'existait. La prochaine commande va demander à Next.js de générer la structure de départ de notre application.",
        },

        {
          type: "terminal",
          title:
            "Créez le projet",
          text:
            "Copiez exactement cette commande puis appuyez sur Entrée.",
          command:
            "npx create-next-app@latest propertymatch",
          explanations: [
            {
              code:
                "npx",
              text:
                "Permet ici d'exécuter l'outil de création.",
            },
            {
              code:
                "create-next-app",
              text:
                "Outil permettant de créer un projet Next.js.",
            },
            {
              code:
                "@latest",
              text:
                "Demande une version récente de l'outil.",
            },
            {
              code:
                "propertymatch",
              text:
                "Nom du dossier de notre projet.",
            },
          ],
        },

        {
          type: "action",
          title:
            "Répondez aux questions de configuration",
          text:
            "L'assistant peut légèrement changer selon la version de Next.js. Utilisez ces choix lorsqu'ils sont proposés.",
          actions: [
            "Utilisez TypeScript.",
            "Activez ESLint.",
            "Activez Tailwind CSS.",
            "Utilisez l'App Router.",
            "Gardez les choix par défaut pour les options que nous ne personnalisons pas.",
            "Laissez l'installation se terminer complètement.",
          ],
        },

        {
          type: "observe",
          title:
            "Le dossier PropertyMatch vient d'être créé",
          text:
            "Next.js a généré de nombreux fichiers. Vous n'avez pas à comprendre tout cela immédiatement.",
          result: `propertymatch/
├── app/
├── public/
├── package.json
├── next.config...
└── ...`,
        },

        // OPEN FOLDER

        {
          type: "action",
          eyebrow:
            "DANS VS CODE",
          title:
            "Ouvrez le dossier PropertyMatch",
          text:
            "Nous voulons maintenant que VS Code affiche ce projet dans l'Explorer.",
          actions: [
            "Dans VS Code, cliquez sur File dans la barre supérieure.",
            "Cliquez sur Open Folder...",
            "Retrouvez le dossier propertymatch qui vient d'être créé.",
            "Sélectionnez-le.",
            "Cliquez sur Open.",
            "Si VS Code demande si vous faites confiance aux fichiers, acceptez puisque vous venez de créer ce projet.",
          ],
        },

        {
          type:
            "visual-guide",
          eyebrow:
            "L'INTERFACE CHANGE",
          title:
            "Votre projet apparaît maintenant dans l'Explorer",
          text:
            "Contrairement à l'écran vide du début, VS Code affiche maintenant les dossiers et fichiers de PropertyMatch.",
          visual:
            "vscode-project-open",
        },

        {
          type: "concept",
          title:
            "Comprendre l'Explorer",
          text:
            "La colonne de gauche représente désormais l'arborescence réelle de votre projet.",
          items: [
            {
              title:
                "propertymatch",
              text:
                "Dossier principal du projet.",
            },
            {
              title: "app",
              text:
                "Contiendra notamment nos pages.",
            },
            {
              title:
                "public",
              text:
                "Peut contenir des ressources publiques.",
            },
            {
              title:
                "package.json",
              text:
                "Décrit notamment les dépendances et scripts du projet.",
            },
          ],
        },

        // TERMINAL IN PROJECT

        {
          type: "terminal",
          title:
            "Placez-vous dans PropertyMatch si nécessaire",
          text:
            "Si votre terminal n'est pas déjà dans le dossier du projet, utilisez cd.",
          command:
            "cd propertymatch",
          explanations: [
            {
              code: "cd",
              text:
                "Change Directory : changer de dossier.",
            },
            {
              code:
                "propertymatch",
              text:
                "Dossier dans lequel nous voulons travailler.",
            },
          ],
        },

        {
          type: "observe",
          title:
            "Le terminal peut maintenant indiquer propertymatch",
          text:
            "Selon votre terminal, l'affichage exact changera.",
          result: `AVANT

jean@MacBook-Pro ~ %

APRÈS

jean@MacBook-Pro propertymatch %`,
        },

        // NPM RUN DEV

        {
          type: "terminal",
          eyebrow:
            "DÉMARRAGE",
          title:
            "Lancez votre application",
          text:
            "Tapez cette commande dans le terminal du projet.",
          command:
            "npm run dev",
          explanations: [
            {
              code: "npm",
              text:
                "Outil qui exécute le script.",
            },
            {
              code: "run",
              text:
                "Indique que nous lançons un script.",
            },
            {
              code: "dev",
              text:
                "Script démarrant Next.js en mode développement.",
            },
          ],
        },

        {
          type: "observe",
          eyebrow:
            "RÉSULTAT ATTENDU",
          title:
            "Next.js démarre",
          text:
            "Le terminal doit afficher une adresse locale et indiquer que l'application est prête.",
          result: `▲ Next.js

Local: http://localhost:3000

✓ Ready`,
        },

        {
          type: "warning",
          title:
            "Ne fermez pas ce terminal",
          text:
            "Le serveur doit rester actif pour que localhost fonctionne. Le fait que le terminal reste occupé après npm run dev est donc normal.",
        },

        // LOCALHOST

        {
          type: "concept",
          title:
            "Qu'est-ce que localhost:3000 ?",
          text:
            "Votre application fonctionne maintenant sur votre propre ordinateur. localhost désigne votre machine dans ce contexte. 3000 correspond au port utilisé par le serveur de développement.",
          items: [
            {
              title:
                "localhost",
              text:
                "Votre propre ordinateur.",
            },
            {
              title: "3000",
              text:
                "Port utilisé par le serveur.",
            },
            {
              title:
                "Local",
              text:
                "Le projet fonctionne chez vous.",
            },
            {
              title:
                "Internet",
              text:
                "Nous publierons le projet plus tard pour le rendre accessible publiquement.",
            },
          ],
        },

        {
          type: "action",
          title:
            "Ouvrez le site dans votre navigateur",
          text:
            "Gardez npm run dev actif.",
          actions: [
            "Ouvrez Chrome, Safari, Edge ou Firefox.",
            "Cliquez dans la barre d'adresse.",
            "Tapez http://localhost:3000.",
            "Appuyez sur Entrée.",
            "Attendez que la page s'affiche.",
          ],
        },

        {
          type:
            "visual-guide",
          eyebrow:
            "PREMIER RÉSULTAT",
          title:
            "Votre véritable application fonctionne localement",
          text:
            "Ce navigateur affiche le projet présent sur votre ordinateur. Ce n'est pas un faux site intégré à la formation.",
          visual:
            "localhost",
        },

        {
          type: "observe",
          title:
            "Votre environnement de développement est en place",
          text:
            "Voici désormais votre manière de travailler pendant le module.",
          result: `FORMATION
    ↓
vous guide

VS CODE
    ↓
vous codez

TERMINAL
    ↓
npm run dev

NEXT.JS
    ↓
serveur local

NAVIGATEUR
    ↓
localhost:3000
    ↓
résultat visible`,
        },

        // PAGE.TSX

        {
          type: "text",
          eyebrow:
            "DERNIER REPÈRE",
          title:
            "Retrouvez le fichier de la page d'accueil",
          text:
            "Nous allons maintenant identifier le premier fichier que vous modifierez réellement dans la leçon suivante.",
        },

        {
          type: "action",
          title:
            "Ouvrez app/page.tsx",
          text:
            "Regardez l'Explorer situé à gauche de VS Code.",
          actions: [
            "Repérez le dossier app.",
            "Cliquez sur la petite flèche située à côté de app s'il est fermé.",
            "Repérez le fichier page.tsx.",
            "Cliquez une fois sur page.tsx.",
            "Le fichier s'ouvre dans la grande zone centrale.",
          ],
        },

        {
          type:
            "visual-guide",
          eyebrow:
            "OÙ CLIQUER ?",
          title:
            "propertymatch → app → page.tsx",
          text:
            "C'est le chemin que vous devez suivre dans l'Explorer.",
          visual:
            "explorer",
        },

        {
          type: "concept",
          title:
            "À quoi sert page.tsx ?",
          text:
            "Pour le moment, retenez simplement que ce fichier correspond à la page d'accueil que vous voyez dans le navigateur. Dans la prochaine leçon, vous allez réellement remplacer son contenu.",
        },

        {
          type: "checkpoint",
          eyebrow:
            "VÉRIFICATION RÉELLE",
          title:
            "Votre ordinateur doit être prêt",
          text:
            "Ne validez pas simplement parce que vous avez lu la leçon. Vérifiez réellement chaque point.",
          items: [
            "VS Code est installé.",
            "Je reconnais l'Explorer.",
            "Je sais ouvrir Terminal → New Terminal.",
            "Je sais où taper une commande.",
            "Je sais qu'Entrée exécute la commande.",
            "node --version fonctionne.",
            "npm --version fonctionne.",
            "Le dossier propertymatch existe.",
            "PropertyMatch est ouvert dans VS Code.",
            "npm run dev fonctionne.",
            "localhost:3000 s'ouvre dans mon navigateur.",
            "Je sais ouvrir app/page.tsx.",
          ],
        },
      ];

    // ====================================================
    // 03 — COMPRENDRE LE PROJET + PREMIÈRE MODIFICATION
    // ====================================================

    case "03":
      return [
        {
          type: "text",
          eyebrow: "REPRENEZ LE MÊME PROJET",
          title: "Aujourd'hui, vous allez comprendre ce que Next.js a créé.",
          text:
            "Dans la leçon précédente, vous avez créé PropertyMatch et réussi à l'ouvrir sur localhost. Nous allons maintenant regarder les fichiers importants du projet, comprendre à quoi ils servent, puis modifier réellement la page d'accueil dans VS Code.",
        },

        {
          type: "concept",
          eyebrow: "AVANT DE TOUCHER AU CODE",
          title: "Un site moderne est composé de plusieurs fichiers.",
          text:
            "PropertyMatch n'est pas un seul fichier géant. Next.js a créé une structure de dossiers et de fichiers. Vous n'avez pas besoin de tout mémoriser aujourd'hui. Nous allons seulement identifier les éléments que vous allez utiliser très souvent.",
          items: [
            {
              title: "propertymatch/",
              text:
                "Le dossier principal. Tout votre projet se trouve à l'intérieur.",
            },
            {
              title: "app/",
              text:
                "Le dossier dans lequel nous allons notamment construire les pages de l'application.",
            },
            {
              title: "public/",
              text:
                "Un dossier destiné à certaines ressources publiques, par exemple des images.",
            },
            {
              title: "package.json",
              text:
                "Un fichier important qui décrit notamment le projet, ses dépendances et les scripts disponibles.",
            },
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "REPÈRE VISUEL",
          title: "Voici l'arborescence que vous avez devant vous.",
          text:
            "Dans VS Code, regardez l'Explorer à gauche. Il représente la structure réelle des fichiers présents dans votre dossier PropertyMatch.",
          visual: "project-map",
        },

        {
          type: "concept",
          eyebrow: "NOUVEAU MOT",
          title: "Qu'est-ce qu'une arborescence ?",
          text:
            "Une arborescence représente des dossiers contenant d'autres dossiers et fichiers. Imaginez une armoire : propertymatch est l'armoire principale, app est un tiroir et page.tsx est un document rangé dans ce tiroir.",
          items: [
            {
              title: "Dossier parent",
              text:
                "Un dossier qui contient un autre élément. Ici, app est le parent de page.tsx.",
            },
            {
              title: "Fichier",
              text:
                "Un document contenant du code ou d'autres informations.",
            },
            {
              title: "Chemin",
              text:
                "La suite de dossiers permettant de retrouver un fichier, par exemple app/page.tsx.",
            },
            {
              title: "Extension",
              text:
                "La partie après le point. Dans page.tsx, l'extension est .tsx.",
            },
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Ouvrez maintenant app/page.tsx.",
          text:
            "Suivez les repères dans l'Explorer : ouvrez app, puis cliquez sur page.tsx. C'est le premier fichier que vous allez réellement modifier.",
          visual: "explorer",
        },

        {
          type: "concept",
          title: "Pourquoi page.tsx est-il important ?",
          text:
            "Dans notre projet Next.js utilisant l'App Router, le fichier app/page.tsx correspond à la page accessible à l'adresse principale de l'application. Autrement dit, lorsque vous ouvrez localhost:3000, c'est cette page que Next.js utilise pour construire le contenu principal affiché.",
          items: [
            {
              title: "app/",
              text:
                "Le dossier dans lequel Next.js recherche ici les pages et routes de l'application.",
            },
            {
              title: "page.tsx",
              text:
                "Le fichier représentant la page d'une route. app/page.tsx correspond ici à la route principale /.",
            },
            {
              title: "/",
              text:
                "La route racine. Sur votre ordinateur, elle correspond actuellement à http://localhost:3000/.",
            },
            {
              title: ".tsx",
              text:
                "Un fichier TypeScript capable de contenir du JSX utilisé par React.",
            },
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "ZONE ÉDITEUR",
          title: "Quand vous cliquez sur page.tsx, il s'ouvre au centre.",
          text:
            "L'Explorer sert à choisir le fichier. La grande zone centrale appelée éditeur sert à lire et modifier son contenu.",
          visual: "page-editor",
        },

        {
          type: "concept",
          eyebrow: "AUTRE FICHIER IMPORTANT",
          title: "À quoi sert layout.tsx ?",
          text:
            "Vous voyez probablement aussi app/layout.tsx. Un layout sert à entourer des pages avec une structure commune. Plus tard, il pourra par exemple contenir des éléments ou réglages communs à plusieurs pages. Pour l'instant, nous ne le modifions pas.",
          items: [
            {
              title: "page.tsx",
              text:
                "Contenu spécifique de la page.",
            },
            {
              title: "layout.tsx",
              text:
                "Structure commune qui peut entourer les pages.",
            },
          ],
        },

        {
          type: "warning",
          title: "Ne modifiez pas tous les fichiers simplement parce qu'ils existent.",
          text:
            "Un débutant peut être tenté d'ouvrir package.json, layout.tsx, globals.css ou d'autres fichiers et de supprimer ce qu'il ne comprend pas. Ne faites pas cela. Nous modifierons chaque fichier uniquement lorsque nous saurons pourquoi nous en avons besoin.",
        },

        {
          type: "text",
          eyebrow: "PREMIÈRE VRAIE MODIFICATION",
          title: "Nous allons remplacer la page de démonstration par PropertyMatch.",
          text:
            "Next.js a créé une page de départ pour vérifier que le projet fonctionne. Nous n'en avons plus besoin. Nous allons remplacer le contenu de app/page.tsx par une première version extrêmement simple de notre propre application.",
        },

        {
          type: "action",
          eyebrow: "DANS PAGE.TSX",
          title: "Sélectionnez tout le contenu actuel du fichier.",
          text:
            "Assurez-vous d'avoir page.tsx ouvert dans l'éditeur central.",
          actions: [
            "Cliquez une fois dans le code de page.tsx.",
            "Sur Mac, utilisez ⌘ + A. Sur Windows, utilisez Ctrl + A.",
            "Tout le contenu du fichier doit être sélectionné.",
            "Appuyez sur Suppr ou Backspace pour supprimer l'ancien contenu.",
            "Votre fichier page.tsx doit maintenant être vide.",
          ],
        },

        {
          type: "code",
          eyebrow: "ÉCRIVEZ DANS VS CODE",
          title: "Collez maintenant cette première version de PropertyMatch.",
          text:
            "Copiez tout le bloc ci-dessous dans app/page.tsx. Nous allons ensuite le lire ligne par ligne.",
          code: `export default function Home() {
  return (
    <main>
      <h1>PropertyMatch</h1>

      <p>
        Trouvez le logement qui vous correspond.
      </p>
    </main>
  );
}`,
          explanations: [
            {
              code: "export default",
              text:
                "Indique ici que ce composant est l'élément principal exporté par ce fichier.",
            },
            {
              code: "function Home()",
              text:
                "Nous créons une fonction appelée Home. Elle représente ici notre composant de page.",
            },
            {
              code: "return",
              text:
                "La fonction renvoie la structure que React doit afficher.",
            },
            {
              code: "<main>",
              text:
                "Balise représentant le contenu principal de la page.",
            },
            {
              code: "<h1>",
              text:
                "Balise de titre principal.",
            },
            {
              code: "<p>",
              text:
                "Balise utilisée ici pour afficher un paragraphe.",
            },
          ],
        },

        {
          type: "concept",
          eyebrow: "NE MÉMORISEZ PAS TOUT",
          title: "Pour l'instant, comprenez surtout la structure générale.",
          text:
            "Nous approfondirons React, les composants et TypeScript plus tard. Aujourd'hui, retenez simplement qu'une fonction appelée Home renvoie une interface contenant un élément main, un titre et un paragraphe.",
          items: [
            {
              title: "Home",
              text:
                "Le nom donné à notre composant de page.",
            },
            {
              title: "return (...)",
              text:
                "La partie qui décrit ce que nous voulons afficher.",
            },
            {
              title: "JSX",
              text:
                "La syntaxe ressemblant à HTML que nous écrivons dans le composant React.",
            },
            {
              title: "Navigateur",
              text:
                "Il affichera le résultat généré à partir de cette interface.",
            },
          ],
        },

        {
          type: "code",
          eyebrow: "ZOOM",
          title: "Comprenez votre première balise JSX.",
          text:
            "Regardons uniquement la ligne du titre.",
          code: `<h1>PropertyMatch</h1>`,
          explanations: [
            {
              code: "<h1>",
              text:
                "Balise ouvrante : elle indique le début du titre.",
            },
            {
              code: "PropertyMatch",
              text:
                "Le texte que l'utilisateur verra.",
            },
            {
              code: "</h1>",
              text:
                "Balise fermante : le / indique la fin de l'élément.",
            },
          ],
        },

        {
          type: "concept",
          title: "Pourquoi certaines balises doivent-elles être fermées ?",
          text:
            "Le navigateur et React doivent savoir où commence et où se termine chaque élément. Ici, tout ce qui se trouve entre <h1> et </h1> appartient au titre.",
        },

        {
          type: "os-guide",
          eyebrow: "SAUVEGARDE",
          title: "Sauvegardez maintenant page.tsx.",
          text:
            "Écrire du code ne suffit pas : le fichier doit être sauvegardé pour que votre modification soit enregistrée.",
          mac: {
            title: "Sur Mac",
            steps: [
              "Cliquez dans page.tsx.",
              "Appuyez sur ⌘ + S.",
              "Attendez une seconde.",
              "Retournez dans votre navigateur.",
            ],
          },
          windows: {
            title: "Sur Windows",
            steps: [
              "Cliquez dans page.tsx.",
              "Appuyez sur Ctrl + S.",
              "Attendez une seconde.",
              "Retournez dans votre navigateur.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "CE QUI SE PASSE",
          title: "VS Code → sauvegarde → Next.js → navigateur.",
          text:
            "Lorsque le serveur de développement tourne, Next.js détecte généralement votre modification et met à jour la page. Vous n'avez pas besoin de redémarrer npm run dev à chaque changement.",
          visual: "save-refresh",
        },

        {
          type: "observe",
          eyebrow: "RÉSULTAT ATTENDU",
          title: "La page de démonstration Next.js a disparu.",
          text:
            "Sur localhost:3000, vous devez maintenant voir votre propre contenu : PropertyMatch et la phrase située en dessous. Le design est encore très simple, c'est volontaire.",
          result: `PropertyMatch

Trouvez le logement qui vous correspond.`,
        },

        {
          type: "warning",
          title: "Votre navigateur affiche toujours l'ancienne page ?",
          text:
            "Vérifiez d'abord que vous avez bien modifié app/page.tsx et sauvegardé le fichier. Vérifiez ensuite que npm run dev fonctionne toujours dans le terminal. Enfin, rechargez localhost:3000 si nécessaire.",
        },

        {
          type: "action",
          eyebrow: "MINI-DÉFI",
          title: "Prouvez-vous que vous contrôlez réellement la page.",
          text:
            "Ne copiez pas de nouveau code pour cette étape. Modifiez simplement ce que vous comprenez déjà.",
          actions: [
            "Dans <h1>, remplacez PropertyMatch par Mon premier site.",
            "Sauvegardez le fichier.",
            "Regardez le navigateur : le titre doit changer.",
            "Retournez dans VS Code.",
            "Remettez PropertyMatch.",
            "Dans le paragraphe, remplacez temporairement la phrase par Je modifie mon vrai site.",
            "Sauvegardez et observez le changement.",
            "Remettez enfin la phrase originale du cours.",
          ],
        },

        {
          type: "concept",
          eyebrow: "CE QUE VOUS VENEZ DE COMPRENDRE",
          title: "Votre code n'est plus abstrait.",
          text:
            "Vous avez maintenant vu la relation la plus importante de tout le début du module : un fichier précis contient du code, vous modifiez ce code dans VS Code, vous sauvegardez, puis le résultat change dans votre application locale.",
          items: [
            {
              title: "Explorer",
              text:
                "Permet de choisir le fichier à modifier.",
            },
            {
              title: "Éditeur",
              text:
                "Permet de modifier le contenu du fichier.",
            },
            {
              title: "Terminal",
              text:
                "Maintient ici le serveur de développement avec npm run dev.",
            },
            {
              title: "Navigateur",
              text:
                "Permet d'observer immédiatement le résultat.",
            },
          ],
        },

        {
          type: "checkpoint",
          eyebrow: "VÉRIFICATION RÉELLE",
          title: "Avant de valider la leçon 03",
          text:
            "Regardez réellement votre VS Code et votre navigateur.",
          items: [
            "Je sais reconnaître le dossier principal propertymatch.",
            "Je comprends ce qu'est une arborescence.",
            "Je sais retrouver app/page.tsx.",
            "Je sais globalement à quoi servent app, public, page.tsx, layout.tsx et package.json.",
            "Je sais que app/page.tsx correspond ici à la page d'accueil.",
            "J'ai remplacé la page de démonstration par mon propre code.",
            "Je sais sauvegarder avec ⌘ + S ou Ctrl + S.",
            "Je vois PropertyMatch sur localhost:3000.",
            "Je sais modifier un texte dans page.tsx et voir le changement dans le navigateur.",
          ],
        },
      ];

    // ====================================================
    // 04 — CONSTRUIRE LE VRAI FRONT PROPERTYMATCH
    // ====================================================

    case "04":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Transformer votre page très simple en vraie interface professionnelle.",
          text:
            "À la fin de cette leçon, votre localhost ne ressemblera plus à un exercice. Vous aurez un vrai header, un hero, une zone de recherche visuelle et des cartes de logements de démonstration. Pour cette leçon, nous allons surtout construire. Vous copiez, vous collez exactement au bon endroit, vous sauvegardez et vous comparez avec les visuels de la formation.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Voici à quoi votre site doit ressembler avant de commencer.",
          text:
            "Vous devez encore avoir la version simple créée dans la leçon 03 : un titre PropertyMatch et une phrase. Si votre page ressemble globalement à cela, vous pouvez continuer.",
          visual: "site-lesson03",
        },

        {
          type: "action",
          eyebrow: "AVANT DE CODER",
          title: "Préparez vos trois fenêtres.",
          text:
            "Pendant cette leçon, gardez la formation, VS Code et localhost ouverts. Vous allez constamment passer de l'un à l'autre.",
          actions: [
            "Gardez cette leçon ouverte dans votre navigateur.",
            "Ouvrez VS Code avec le dossier propertymatch.",
            "Dans VS Code, vérifiez que app/page.tsx existe toujours.",
            "Vérifiez que le terminal affiche toujours votre projet propertymatch.",
            "Si npm run dev n'est plus actif, lancez npm run dev.",
            "Ouvrez http://localhost:3000 dans un deuxième onglet ou une deuxième fenêtre.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Ouvrez exactement app/page.tsx.",
          text:
            "Cliquez dans l'Explorer à gauche : propertymatch → app → page.tsx. C'est le seul fichier que nous allons modifier dans cette première partie.",
          visual: "vscode-page04",
        },

        {
          type: "text",
          eyebrow: "MÉTHODE",
          title: "Pour éviter de vous perdre, nous allons remplacer tout le fichier à chaque grande étape.",
          text:
            "Vous n'avez donc pas à deviner où insérer cinquante lignes. À chaque étape importante : vous sélectionnez tout page.tsx, vous remplacez par le nouveau bloc complet, vous sauvegardez et vous regardez le résultat. Plus tard, quand vous serez plus à l'aise, nous modifierons des parties plus ciblées.",
        },

        // --------------------------------------------------
        // ETAPE A
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A — PRÉPARATION",
          title: "Videz app/page.tsx.",
          text:
            "Assurez-vous que page.tsx est bien ouvert dans la grande zone centrale de VS Code.",
          actions: [
            "Cliquez une fois dans le code de page.tsx.",
            "Sur Mac : appuyez sur ⌘ + A. Sur Windows : appuyez sur Ctrl + A.",
            "Tout le code doit être sélectionné.",
            "Appuyez sur Suppr ou Backspace.",
            "page.tsx doit maintenant être vide.",
          ],
        },

        {
          type: "code",
          eyebrow: "ÉTAPE A — COLLEZ TOUT",
          title: "Créez le header et le hero de PropertyMatch.",
          text:
            "Copiez TOUT ce bloc puis collez-le dans app/page.tsx. Ne cherchez pas à modifier le code pendant le collage.",
          code: `export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-black tracking-tight">
              PropertyMatch
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trouvez mieux. Décidez plus vite.
            </p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#recherche">Recherche</a>
            <a href="#logements">Logements</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "ÉTAPE A — SAUVEGARDE",
          title: "Sauvegardez maintenant le fichier.",
          text:
            "Une fois le bloc collé, ne touchez plus au code pour l'instant.",
          mac: {
            title: "Sur Mac",
            steps: [
              "Cliquez dans page.tsx.",
              "Appuyez sur ⌘ + S.",
              "Attendez une seconde.",
              "Passez sur localhost:3000.",
            ],
          },
          windows: {
            title: "Sur Windows",
            steps: [
              "Cliquez dans page.tsx.",
              "Appuyez sur Ctrl + S.",
              "Attendez une seconde.",
              "Passez sur localhost:3000.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "ÉTAPE A — RÉSULTAT",
          title: "Votre site doit maintenant ressembler à ceci.",
          text:
            "Comparez votre localhost avec ce visuel. Les textes, espacements ou dimensions peuvent varier légèrement selon votre écran, mais vous devez retrouver le header, le grand hero, le bouton et la carte de correspondance à droite.",
          visual: "site-header-hero",
        },

        {
          type: "warning",
          title: "Votre page est rouge ou affiche une erreur ?",
          text:
            "Ne passez pas à l'étape suivante. Retournez dans page.tsx et vérifiez que vous avez remplacé tout le fichier par le bloc complet, sans supprimer une accolade ou une parenthèse. Regardez aussi le terminal : Next.js indique souvent le fichier et la ligne en erreur.",
        },

        {
          type: "concept",
          eyebrow: "JUSTE CE QU'IL FAUT COMPRENDRE",
          title: "Pourquoi le site a-t-il changé autant ?",
          text:
            "Nous avons gardé le même principe qu'avant : JSX décrit les éléments et className leur donne une apparence. Vous n'avez pas besoin de mémoriser toutes les classes. Retenez simplement que des classes comme px-6, py-20, text-5xl, rounded-2xl ou bg-white modifient directement le rendu.",
          items: [
            {
              title: "text-5xl",
              text: "Change la taille du texte.",
            },
            {
              title: "bg-white",
              text: "Donne un fond blanc.",
            },
            {
              title: "rounded-2xl",
              text: "Arrondit les coins.",
            },
            {
              title: "px / py",
              text: "Ajoutent de l'espace à l'intérieur du bloc.",
            },
          ],
        },

        // --------------------------------------------------
        // ETAPE B
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Ajoutons maintenant la zone de recherche.",
          text:
            "Cette zone sera encore seulement visuelle. Les champs deviendront réellement interactifs dans une prochaine leçon. Aujourd'hui, nous voulons construire l'apparence du produit.",
        },

        {
          type: "action",
          title: "Remplacez encore tout page.tsx.",
          text:
            "Nous utilisons volontairement la même méthode pour éviter toute ambiguïté.",
          actions: [
            "Retournez dans VS Code.",
            "Cliquez dans app/page.tsx.",
            "Faites ⌘ + A sur Mac ou Ctrl + A sur Windows.",
            "Supprimez tout.",
            "Copiez ensuite le bloc complet ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "ÉTAPE B — COLLEZ TOUT",
          title: "Ajoutez une vraie zone de recherche visuelle.",
          text:
            "Ce fichier reprend le header et le hero, puis ajoute la section Votre recherche.",
          code: `export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-black tracking-tight">
              PropertyMatch
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trouvez mieux. Décidez plus vite.
            </p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#recherche">Recherche</a>
            <a href="#logements">Logements</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                placeholder="Paris"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget max
              </span>

              <input
                placeholder="2300 €"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres
              </span>

              <input
                placeholder="2"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
              Trouver mes logements
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Pour l'instant, ces champs sont uniquement visuels.
            Nous les rendrons fonctionnels plus tard.
          </p>
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez puis retournez sur localhost.",
          text:
            "Vous devez maintenant voir une nouvelle section sous le hero.",
          mac: {
            title: "Mac",
            steps: [
              "⌘ + S.",
              "Ouvrez localhost:3000.",
              "Descendez sous le hero.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Descendez sous le hero.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "ÉTAPE B — RÉSULTAT",
          title: "La zone de recherche doit apparaître comme ceci.",
          text:
            "Vous devez voir quatre zones : ville, budget, chambres et bouton. Elles ne fonctionnent pas encore réellement : c'est volontaire.",
          visual: "site-search-section",
        },

        {
          type: "action",
          eyebrow: "PETIT TEST VISUEL",
          title: "Cliquez dans les champs.",
          text:
            "Le but n'est pas encore de lancer une vraie recherche, seulement de vérifier que l'interface se comporte normalement.",
          actions: [
            "Cliquez dans Ville et tapez Paris.",
            "Cliquez dans Budget max et tapez 2300.",
            "Cliquez dans Chambres et tapez 2.",
            "Cliquez sur le bouton.",
            "Constat : le bouton ne lance encore aucun moteur. C'est normal.",
          ],
        },

        // --------------------------------------------------
        // ETAPE C
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Ajoutons des logements de démonstration.",
          text:
            "La prochaine leçon introduira les vraies données JavaScript. Pour l'instant, nous allons uniquement construire le rendu visuel des cartes afin que PropertyMatch ressemble déjà à un vrai produit.",
        },

        {
          type: "action",
          title: "Remplacez une dernière fois tout page.tsx.",
          text:
            "Cette troisième version est la version finale de la leçon 04.",
          actions: [
            "Retournez dans page.tsx.",
            "Sélectionnez tout.",
            "Supprimez tout.",
            "Copiez le fichier complet ci-dessous.",
            "Collez-le dans page.tsx.",
          ],
        },

        {
          type: "code",
          eyebrow: "ÉTAPE C — VERSION FINALE",
          title: "Ajoutez la section Logements recommandés.",
          text:
            "Copiez ce fichier complet. Les trois cartes sont encore écrites manuellement : nous corrigerons cela dans la leçon 05 grâce à JavaScript.",
          code: `export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-black tracking-tight">
              PropertyMatch
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trouvez mieux. Décidez plus vite.
            </p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#recherche">Recherche</a>
            <a href="#logements">Logements</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                placeholder="Paris"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget max
              </span>

              <input
                placeholder="2300 €"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres
              </span>

              <input
                placeholder="2"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
              Trouver mes logements
            </button>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            3 résultats de démonstration
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="h-44 bg-slate-200" />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Paris 16e
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Appartement lumineux
                  </h3>
                </div>

                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
                  92%
                </span>
              </div>

              <p className="mt-5 text-2xl font-black">
                2 180 €
                <span className="text-sm font-medium text-slate-500">
                  {" "}
                  / mois
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  2 chambres
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  62 m²
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  Balcon
                </span>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="h-44 bg-slate-300" />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Paris 15e
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Loft proche des quais
                  </h3>
                </div>

                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
                  84%
                </span>
              </div>

              <p className="mt-5 text-2xl font-black">
                1 950 €
                <span className="text-sm font-medium text-slate-500">
                  {" "}
                  / mois
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  1 chambre
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  54 m²
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  Sans balcon
                </span>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="h-44 bg-slate-200" />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Paris 17e
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Appartement familial
                  </h3>
                </div>

                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
                  79%
                </span>
              </div>

              <p className="mt-5 text-2xl font-black">
                2 450 €
                <span className="text-sm font-medium text-slate-500">
                  {" "}
                  / mois
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  3 chambres
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  78 m²
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  Balcon
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "ÉTAPE C — SAUVEGARDE",
          title: "Sauvegardez et regardez tout le site.",
          text:
            "Cette fois, faites défiler toute la page après la sauvegarde.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Remontez tout en haut.",
              "Faites défiler jusqu'aux cartes.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Remontez tout en haut.",
              "Faites défiler jusqu'aux cartes.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "ÉTAPE C — RÉSULTAT FINAL",
          title: "Voici le PropertyMatch attendu à la fin de la leçon 04.",
          text:
            "Comparez surtout les grandes zones : header, hero, formulaire, titre Logements recommandés et trois cartes. Les blocs gris des cartes représentent volontairement les futures images.",
          visual: "site-lesson04-final",
        },

        {
          type: "text",
          eyebrow: "IMPORTANT",
          title: "Pourquoi les logements sont-ils encore écrits trois fois ?",
          text:
            "Parce que cette leçon est consacrée au front. Dans la leçon 05, nous allons supprimer cette répétition : les logements seront stockés dans des données JavaScript et les cartes seront générées automatiquement.",
        },

        {
          type: "concept",
          eyebrow: "RESPONSIVE",
          title: "Votre site est déjà prévu pour changer de disposition selon la largeur.",
          text:
            "Vous n'avez pas besoin de connaître tous les détails maintenant. Les préfixes sm:, md: et lg: appliquent certaines règles seulement à partir de certaines tailles. Testons le résultat plutôt que de mémoriser les classes.",
        },

        {
          type: "action",
          eyebrow: "TEST MOBILE",
          title: "Réduisez la largeur du navigateur.",
          text:
            "Ne modifiez aucun code pendant ce test.",
          actions: [
            "Ouvrez localhost:3000.",
            "Réduisez progressivement la largeur de la fenêtre.",
            "Observez le hero : les deux colonnes doivent se placer l'une sous l'autre sur un petit écran.",
            "Observez la recherche : les quatre zones doivent se réorganiser.",
            "Observez les cartes : elles doivent passer progressivement de trois colonnes à moins de colonnes.",
            "Vérifiez qu'aucun texte important ne sort de l'écran.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "COMPARAISON",
          title: "Desktop et mobile n'ont pas la même disposition.",
          text:
            "Le contenu reste le même, mais l'organisation s'adapte. C'est exactement ce que nous recherchons.",
          visual: "site-responsive",
        },

        {
          type: "action",
          eyebrow: "MINI-DÉFI",
          title: "Faites une petite modification sans copier un nouveau fichier.",
          text:
            "Cette fois, vous allez toucher seulement une valeur que vous avez déjà vue.",
          actions: [
            "Dans page.tsx, trouvez le grand h1 du hero.",
            "Repérez text-5xl.",
            "Remplacez temporairement text-5xl par text-3xl.",
            "Sauvegardez et observez le titre devenir plus petit.",
            "Remettez text-5xl.",
            "Sauvegardez une dernière fois.",
          ],
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 04",
          title: "Vérifiez votre résultat avant de continuer.",
          text:
            "Le but n'est pas de connaître Tailwind par cœur. Le but est d'avoir réellement construit cette interface dans votre propre VS Code.",
          items: [
            "Mon app/page.tsx contient la version finale de la leçon.",
            "Mon localhost affiche un header PropertyMatch.",
            "Mon hero contient le grand titre et le bouton.",
            "La carte Meilleure correspondance apparaît à droite sur grand écran.",
            "La section Votre recherche apparaît.",
            "Je vois trois logements de démonstration.",
            "J'ai testé la page avec une fenêtre plus étroite.",
            "Je comprends globalement que className contrôle l'apparence.",
            "Je sais modifier une classe simple et observer son effet.",
          ],
        },
      ];

    // ====================================================
    // 05 — PASSER DES CARTES ÉCRITES À LA MAIN AUX DONNÉES
    // ====================================================

    case "05":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire afficher les logements à partir de vraies données JavaScript.",
          text:
            "À la fin de la leçon 04, votre site affiche trois belles cartes. Mais elles sont écrites trois fois directement dans le JSX. Dans cette leçon, nous allons garder quasiment le même rendu visuel tout en changeant complètement la manière dont le site fonctionne : les logements seront stockés dans une liste de données, puis le site créera automatiquement une carte pour chaque logement.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Voici le site que vous devez déjà avoir.",
          text:
            "Avant de modifier quoi que ce soit, ouvrez localhost:3000 et vérifiez que vous retrouvez le hero, la recherche et les trois logements de démonstration de la leçon 04.",
          visual: "site-lesson04-final",
        },

        {
          type: "text",
          eyebrow: "LE PROBLÈME ACTUEL",
          title: "Pour ajouter un logement, vous seriez obligé de recopier toute une carte.",
          text:
            "Cela fonctionne pour trois logements, mais pas pour une vraie application. Imaginez 50 ou 500 annonces : on ne va pas écrire 500 blocs <article>. Nous allons donc séparer les données des éléments visuels.",
        },

        {
          type: "observe",
          title: "Ce que nous allons changer",
          text:
            "Le résultat à l'écran restera presque identique au début. C'est le fonctionnement interne qui devient beaucoup plus propre.",
          result: `AVANT

Carte 1 écrite à la main
Carte 2 écrite à la main
Carte 3 écrite à la main

        ↓

APRÈS

Une liste "logements"
        ↓
le site parcourt la liste
        ↓
1 logement = 1 carte automatiquement`,
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Retournez dans app/page.tsx.",
          text:
            "Dans l'Explorer à gauche, cliquez sur app puis sur page.tsx. Nous allons encore travailler dans ce fichier afin de ne pas multiplier les fichiers trop tôt.",
          visual: "vscode-data-location",
        },

        // --------------------------------------------------
        // ETAPE A — PREMIER TABLEAU
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE A",
          title: "Nous allons créer la liste des logements.",
          text:
            "Pour éviter que vous cherchiez où placer le nouveau code, nous allons remplacer tout page.tsx par une nouvelle version complète. Vous verrez ensuite précisément ce qui a changé.",
        },

        {
          type: "action",
          title: "Videz page.tsx.",
          text:
            "Assurez-vous que app/page.tsx est bien ouvert.",
          actions: [
            "Cliquez dans le code.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Tout le fichier doit être sélectionné.",
            "Appuyez sur Suppr ou Backspace.",
            "L'éditeur doit être vide.",
          ],
        },

        {
          type: "code",
          eyebrow: "ÉTAPE A — COLLEZ TOUT",
          title: "Remplacez les trois cartes manuelles par une liste de logements.",
          text:
            "Copiez TOUT ce fichier et collez-le dans app/page.tsx.",
          code: `const logements = [
  {
    id: 1,
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
  },
  {
    id: 2,
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
  },
  {
    id: 3,
    quartier: "Paris 17e",
    titre: "Appartement familial",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-black tracking-tight">
              PropertyMatch
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trouvez mieux. Décidez plus vite.
            </p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#recherche">Recherche</a>
            <a href="#logements">Logements</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                placeholder="Paris"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget max
              </span>

              <input
                placeholder="2300 €"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres
              </span>

              <input
                placeholder="2"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
              Trouver mes logements
            </button>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {logements.length} résultats de démonstration
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logements.map((logement) => (
            <article
              key={logement.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-44 bg-slate-200" />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      {logement.quartier}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {logement.titre}
                    </h3>
                  </div>

                  <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
                    {logement.score}%
                  </span>
                </div>

                <p className="mt-5 text-2xl font-black">
                  {logement.prix.toLocaleString("fr-FR")} €
                  <span className="text-sm font-medium text-slate-500">
                    {" "}
                    / mois
                  </span>
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {logement.chambres} chambre(s)
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {logement.surface} m²
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {logement.balcon ? "Balcon" : "Sans balcon"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "SAUVEGARDE",
          title: "Sauvegardez puis regardez localhost.",
          text:
            "Le site doit continuer à afficher les trois mêmes logements. C'est exactement ce que nous voulons.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Passez sur localhost:3000.",
              "Descendez jusqu'à Logements recommandés.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Passez sur localhost:3000.",
              "Descendez jusqu'à Logements recommandés.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT",
          title: "Visuellement, presque rien n'a changé — et c'est une bonne nouvelle.",
          text:
            "Vous devez toujours voir trois cartes. Mais cette fois, elles proviennent toutes de la liste logements située en haut de page.tsx.",
          visual: "site-data-same-result",
        },

        {
          type: "concept",
          eyebrow: "À RETENIR",
          title: "Vous venez d'utiliser trois idées JavaScript importantes.",
          text:
            "Pas besoin d'apprendre toute la syntaxe par cœur aujourd'hui. Retenez seulement la logique générale.",
          items: [
            {
              title: "const logements = [...]",
              text: "Une variable nommée logements contient toute notre liste.",
            },
            {
              title: "{ ... }",
              text: "Chaque paire d'accolades représente ici un logement avec ses informations.",
            },
            {
              title: "logements.map(...)",
              text: "Le site parcourt la liste et fabrique une carte pour chaque logement.",
            },
          ],
        },

        // --------------------------------------------------
        // ETAPE B — MODIFIER UNE DONNEE
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Vérifions que les cartes dépendent vraiment des données.",
          text:
            "Vous allez changer UNE information en haut du fichier. Si tout est correctement connecté, la carte correspondante changera toute seule.",
        },

        {
          type: "action",
          title: "Modifiez le prix du premier logement.",
          text:
            "Cette fois, ne remplacez pas tout le fichier.",
          actions: [
            "Dans VS Code, restez dans app/page.tsx.",
            "Remontez complètement en haut du fichier.",
            "Dans le premier logement, repérez prix: 2180.",
            "Remplacez 2180 par 2250.",
            "Ne changez rien d'autre.",
            "Sauvegardez.",
            "Retournez sur localhost.",
          ],
        },

        {
          type: "observe",
          title: "Ce qui doit se passer",
          text:
            "La première carte doit maintenant afficher 2 250 € / mois. Vous n'avez pourtant jamais touché à la carte elle-même.",
          result: `DANS LES DONNÉES

prix: 2180
     ↓
prix: 2250

SUR LE SITE

2 180 € / mois
     ↓
2 250 € / mois`,
        },

        {
          type: "text",
          eyebrow: "IMPORTANT",
          title: "C'est exactement l'intérêt de séparer les données de l'affichage.",
          text:
            "La carte sait comment afficher un logement. Les données disent quel logement afficher. Plus tard, ces données pourront venir d'une API ou d'une base de données sans avoir à réécrire manuellement toutes les cartes.",
        },

        // --------------------------------------------------
        // ETAPE C — AJOUTER UN 4E LOGEMENT
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Ajoutez maintenant un quatrième logement sans créer de nouvelle carte.",
          text:
            "C'est le test le plus important de cette leçon. Vous allez seulement ajouter un objet à la liste logements.",
        },

        {
          type: "action",
          title: "Repérez la fin du troisième logement.",
          text:
            "En haut de page.tsx, trouvez l'objet qui commence par id: 3. Juste après sa fermeture }, et avant le ]; final du tableau, nous allons ajouter un nouvel objet.",
          actions: [
            "Remontez en haut de page.tsx.",
            "Repérez le troisième logement : id: 3.",
            "Descendez jusqu'à sa ligne score: 79.",
            "Repérez ensuite }, puis la fermeture ]; du tableau.",
            "Placez votre curseur entre les deux.",
          ],
        },

        {
          type: "code",
          eyebrow: "À AJOUTER",
          title: "Collez ce quatrième logement.",
          text:
            "Collez uniquement ce petit bloc à l'endroit indiqué. Ne remplacez pas tout page.tsx cette fois.",
          code: `  {
    id: 4,
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
  },`,
        },

        {
          type: "warning",
          title: "Attention à l'endroit où vous collez.",
          text:
            "Le nouvel objet doit être À L'INTÉRIEUR des crochets de const logements = [ ... ]. Si vous le collez après ];, JavaScript ne le considérera pas comme un élément de la liste.",
        },

        {
          type: "os-guide",
          title: "Sauvegardez puis observez le site.",
          text:
            "Vous ne devez ajouter aucun nouveau <article>. Le site doit créer la quatrième carte tout seul.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Retournez sur localhost.",
              "Descendez aux logements.",
              "Cherchez Deux-pièces avec terrasse.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Retournez sur localhost.",
              "Descendez aux logements.",
              "Cherchez Deux-pièces avec terrasse.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT ATTENDU",
          title: "Une quatrième carte doit être apparue automatiquement.",
          text:
            "C'est le déclic de la leçon : vous avez ajouté une donnée, et l'interface s'est agrandie automatiquement.",
          visual: "site-four-properties",
        },

        {
          type: "concept",
          eyebrow: "PETITE NOTION",
          title: "Pourquoi chaque logement possède-t-il un id différent ?",
          text:
            "L'id permet d'identifier un logement de manière unique. React utilise notamment key={logement.id} pour distinguer les éléments de la liste. Dans notre exemple, les ids sont 1, 2, 3 et 4.",
        },

        // --------------------------------------------------
        // ETAPE D — BOOLEEN / CONDITION
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Testons maintenant une information vraie ou fausse.",
          text:
            "Le balcon est stocké avec true ou false. true signifie oui, false signifie non.",
        },

        {
          type: "action",
          title: "Changez le balcon du loft.",
          text:
            "Dans le logement id: 2, le balcon vaut actuellement false.",
          actions: [
            "Repérez id: 2.",
            "Trouvez balcon: false.",
            "Remplacez false par true.",
            "Sauvegardez.",
            "Regardez la deuxième carte.",
            "Elle doit maintenant afficher Balcon.",
            "Remettez ensuite balcon: false pour conserver nos données de départ.",
            "Sauvegardez encore.",
          ],
        },

        {
          type: "concept",
          title: "Le site choisit quel texte afficher.",
          text:
            "Dans la carte, cette petite condition signifie simplement : si balcon vaut true, affiche Balcon ; sinon, affiche Sans balcon.",
          items: [
            {
              title: "true",
              text: "Le logement possède un balcon.",
            },
            {
              title: "false",
              text: "Le logement n'en possède pas.",
            },
            {
              title: "condition ? A : B",
              text: "Choisit A si la condition est vraie, sinon B.",
            },
          ],
        },

        // --------------------------------------------------
        // ETAPE E — FINAL
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "Terminons avec une version propre à quatre logements.",
          text:
            "Comme vous avez fait plusieurs petites manipulations, nous allons remettre une version finale complète afin que tout le monde termine la leçon avec exactement la même base pour la leçon 06.",
        },

        {
          type: "action",
          title: "Remplacez une dernière fois tout page.tsx.",
          text:
            "Cette version finale conserve les quatre logements et remet le premier prix à 2180.",
          actions: [
            "Cliquez dans page.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Copiez le fichier complet ci-dessous.",
            "Collez-le.",
            "Sauvegardez.",
          ],
        },

        {
          type: "code",
          eyebrow: "VERSION FINALE DE LA LEÇON 05",
          title: "Gardez exactement ce page.tsx pour la suite.",
          text:
            "À la leçon suivante, nous partirons de cette version pour apprendre à sortir la carte logement de page.tsx.",
          code: `const logements = [
  {
    id: 1,
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
  },
  {
    id: 2,
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
  },
  {
    id: 3,
    quartier: "Paris 17e",
    titre: "Appartement familial",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
  },
  {
    id: 4,
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-black tracking-tight">
              PropertyMatch
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trouvez mieux. Décidez plus vite.
            </p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#recherche">Recherche</a>
            <a href="#logements">Logements</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                placeholder="Paris"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget max
              </span>

              <input
                placeholder="2300 €"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres
              </span>

              <input
                placeholder="2"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
              Trouver mes logements
            </button>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {logements.length} résultats de démonstration
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logements.map((logement) => (
            <article
              key={logement.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-44 bg-slate-200" />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      {logement.quartier}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {logement.titre}
                    </h3>
                  </div>

                  <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
                    {logement.score}%
                  </span>
                </div>

                <p className="mt-5 text-2xl font-black">
                  {logement.prix.toLocaleString("fr-FR")} €
                  <span className="text-sm font-medium text-slate-500">
                    {" "}
                    / mois
                  </span>
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {logement.chambres} chambre(s)
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {logement.surface} m²
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {logement.balcon ? "Balcon" : "Sans balcon"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "visual-guide",
          eyebrow: "FIN DE LA LEÇON",
          title: "Voici votre PropertyMatch à quatre logements.",
          text:
            "Le changement essentiel n'est pas seulement visuel : ces quatre cartes sont maintenant générées à partir de quatre objets JavaScript.",
          visual: "site-data-final",
        },

        {
          type: "action",
          eyebrow: "DERNIÈRE VÉRIFICATION",
          title: "Testez que la liste contrôle réellement l'interface.",
          text:
            "Faites ce mini-test puis annulez votre modification.",
          actions: [
            "En haut du tableau, changez temporairement titre: \"Appartement lumineux\" par titre: \"TEST\".",
            "Sauvegardez.",
            "Vérifiez que la première carte affiche TEST.",
            "Remettez Appartement lumineux.",
            "Sauvegardez une dernière fois.",
          ],
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 05",
          title: "Vous pouvez continuer si ces points sont vrais.",
          text:
            "Vous n'avez pas besoin de savoir réécrire map de mémoire. Vous devez surtout avoir compris ce qui vient de se passer et avoir réussi à le faire dans votre projet.",
          items: [
            "Mon site affiche quatre logements.",
            "Les logements sont stockés dans const logements.",
            "Je sais qu'un objet regroupe les informations d'un logement.",
            "Je comprends qu'un tableau regroupe plusieurs logements.",
            "Je comprends globalement que map crée une carte pour chaque logement.",
            "J'ai modifié une donnée et vu la carte changer.",
            "J'ai ajouté un quatrième logement sans écrire un quatrième <article>.",
            "Mon page.tsx correspond à la version finale de la leçon.",
          ],
        },
      ];

    // ====================================================
    // 06 — ORGANISER LE SITE AVEC DES COMPOSANTS
    // ====================================================

    case "06":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Découper PropertyMatch en plusieurs fichiers sans casser le site.",
          text:
            "Votre application fonctionne, mais page.tsx commence déjà à devenir très long. Dans cette leçon, nous allons ranger le code comme dans un vrai projet : la carte logement aura son propre fichier, puis le header aura le sien. Le site doit rester visuellement identique pendant toute l'opération.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Votre site doit toujours afficher quatre logements.",
          text:
            "Ouvrez localhost:3000 avant de commencer. Nous allons réorganiser le code, pas changer le produit. À la fin, vous devrez retrouver le même rendu.",
          visual: "site-data-final",
        },

        {
          type: "observe",
          title: "Pourquoi ranger le code maintenant ?",
          text:
            "Imaginez que page.tsx continue à grossir pendant encore dix fonctionnalités. Il deviendrait très difficile de retrouver une partie précise.",
          result: `AUJOURD'HUI

page.tsx
├── données
├── header
├── hero
├── recherche
└── cartes

        ↓

APRÈS CETTE LEÇON

page.tsx
components/
├── Header.tsx
└── PropertyCard.tsx`,
        },

        {
          type: "text",
          eyebrow: "À RETENIR",
          title: "Un composant est simplement une partie de l'interface placée dans son propre bloc réutilisable.",
          text:
            "Nous n'allons pas faire un cours théorique complet sur React. Pour l'instant, retenez seulement ceci : PropertyCard.tsx saura afficher une carte logement. page.tsx lui donnera les informations du logement à afficher.",
        },

        // --------------------------------------------------
        // A — CREATE COMPONENTS FOLDER
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Créez le dossier components.",
          text:
            "Cette fois, nous allons réellement utiliser l'Explorer de VS Code.",
          actions: [
            "Dans VS Code, regardez la colonne Explorer à gauche.",
            "Repérez tout en haut le dossier principal PROPERTYMATCH.",
            "Faites clic droit directement sur PROPERTYMATCH.",
            "Cliquez sur New Folder.",
            "Tapez exactement : components",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "Le nouveau dossier doit être au même niveau que app.",
          text:
            "Ne créez pas components à l'intérieur de app. Il doit apparaître directement sous le dossier principal propertymatch.",
          visual: "vscode-components-folder",
        },

        {
          type: "action",
          eyebrow: "ÉTAPE B",
          title: "Créez PropertyCard.tsx dans components.",
          text:
            "Ce fichier contiendra l'apparence d'une seule carte logement.",
          actions: [
            "Dans l'Explorer, faites clic droit sur components.",
            "Cliquez sur New File.",
            "Tapez exactement : PropertyCard.tsx",
            "Appuyez sur Entrée.",
            "VS Code doit ouvrir le nouveau fichier vide.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VÉRIFIEZ AVANT DE CONTINUER",
          title: "Votre Explorer doit maintenant contenir PropertyCard.tsx.",
          text:
            "Si le fichier se trouve dans components, vous êtes au bon endroit.",
          visual: "vscode-property-card",
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/PROPERTYCARD.TSX",
          title: "Collez le code de la carte dans ce nouveau fichier.",
          text:
            "PropertyCard.tsx doit être vide. Copiez tout ce bloc et collez-le dedans.",
          code: `type PropertyCardProps = {
  quartier: string;
  titre: string;
  prix: number;
  chambres: number;
  surface: number;
  balcon: boolean;
  score: number;
};

export default function PropertyCard({
  quartier,
  titre,
  prix,
  chambres,
  surface,
  balcon,
  score,
}: PropertyCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="h-44 bg-slate-200" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              {quartier}
            </p>

            <h3 className="mt-2 text-xl font-black">
              {titre}
            </h3>
          </div>

          <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
            {score}%
          </span>
        </div>

        <p className="mt-5 text-2xl font-black">
          {prix.toLocaleString("fr-FR")} €
          <span className="text-sm font-medium text-slate-500">
            {" "}
            / mois
          </span>
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-2">
            {chambres} chambre(s)
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2">
            {surface} m²
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2">
            {balcon ? "Balcon" : "Sans balcon"}
          </span>
        </div>
      </div>
    </article>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez PropertyCard.tsx.",
          text:
            "Le navigateur ne changera pas encore : nous avons créé le composant, mais page.tsx ne l'utilise pas encore.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Restez dans VS Code.",
              "Ne vous inquiétez pas si localhost est identique.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Restez dans VS Code.",
              "Ne vous inquiétez pas si localhost est identique.",
            ],
          },
        },

        {
          type: "concept",
          eyebrow: "UNE SEULE NOTION",
          title: "Les informations entre parenthèses sont ce que la carte recevra.",
          text:
            "quartier, titre, prix, chambres, surface, balcon et score correspondent aux informations d'un logement. React appelle généralement ces informations des props. Vous n'avez pas besoin de mémoriser la syntaxe TypeScript maintenant.",
        },

        // --------------------------------------------------
        // C — PAGE TSX USE COMPONENT
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Maintenant, demandons à page.tsx d'utiliser PropertyCard.",
          text:
            "Pour éviter une modification compliquée au milieu du fichier, nous allons remplacer page.tsx par une version complète déjà connectée au nouveau composant.",
        },

        {
          type: "action",
          title: "Rouvrez app/page.tsx.",
          text:
            "Attention : ne supprimez pas PropertyCard.tsx. Nous changeons maintenant de fichier.",
          actions: [
            "Dans l'Explorer, cliquez sur app.",
            "Cliquez sur page.tsx.",
            "Vérifiez que l'onglet actif s'appelle bien page.tsx.",
            "Cliquez dans le code.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout le contenu.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — VERSION CONNECTÉE",
          title: "Collez ce fichier complet.",
          text:
            "La différence importante est l'import tout en haut et l'utilisation de <PropertyCard /> dans la liste.",
          code: `import PropertyCard from "@/components/PropertyCard";

const logements = [
  {
    id: 1,
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
  },
  {
    id: 2,
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
  },
  {
    id: 3,
    quartier: "Paris 17e",
    titre: "Appartement familial",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
  },
  {
    id: 4,
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-black tracking-tight">
              PropertyMatch
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trouvez mieux. Décidez plus vite.
            </p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#recherche">Recherche</a>
            <a href="#logements">Logements</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                placeholder="Paris"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget max
              </span>

              <input
                placeholder="2300 €"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres
              </span>

              <input
                placeholder="2"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
              Trouver mes logements
            </button>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {logements.length} résultats de démonstration
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logements.map((logement) => (
            <PropertyCard
              key={logement.id}
              quartier={logement.quartier}
              titre={logement.titre}
              prix={logement.prix}
              chambres={logement.chambres}
              surface={logement.surface}
              balcon={logement.balcon}
              score={logement.score}
            />
          ))}
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez les deux fichiers.",
          text:
            "PropertyCard.tsx et page.tsx doivent tous les deux être enregistrés.",
          mac: {
            title: "Mac",
            steps: [
              "Dans page.tsx, appuyez sur ⌘ + S.",
              "Cliquez sur l'onglet PropertyCard.tsx.",
              "Appuyez aussi sur ⌘ + S.",
              "Retournez sur localhost:3000.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Dans page.tsx, appuyez sur Ctrl + S.",
              "Cliquez sur l'onglet PropertyCard.tsx.",
              "Appuyez aussi sur Ctrl + S.",
              "Retournez sur localhost:3000.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT",
          title: "Le site doit rester visuellement identique.",
          text:
            "Si les quatre cartes sont toujours là, vous venez de déplacer leur code dans un composant sans changer le résultat pour l'utilisateur.",
          visual: "site-component-same",
        },

        {
          type: "warning",
          title: "Vous voyez une erreur « Cannot find module '@/components/PropertyCard' » ?",
          text:
            "Vérifiez d'abord l'orthographe : le dossier doit s'appeler components et le fichier PropertyCard.tsx. Vérifiez aussi que components se trouve à la racine du projet, au même niveau que app.",
        },

        {
          type: "action",
          eyebrow: "TEST RAPIDE",
          title: "Prouvez que toutes les cartes utilisent maintenant le même fichier.",
          text:
            "Nous allons modifier une seule classe dans PropertyCard.tsx.",
          actions: [
            "Ouvrez components/PropertyCard.tsx.",
            "Sur la balise <article>, repérez shadow-sm.",
            "Remplacez temporairement shadow-sm par shadow-xl.",
            "Sauvegardez.",
            "Regardez localhost : les quatre cartes doivent avoir une ombre plus forte.",
            "Remettez shadow-sm.",
            "Sauvegardez.",
          ],
        },

        {
          type: "text",
          eyebrow: "CE QUE VOUS VENEZ DE PROUVER",
          title: "Une seule modification peut maintenant changer toutes les cartes.",
          text:
            "C'est l'un des grands avantages des composants. Nous avons quatre logements, mais une seule définition visuelle de PropertyCard.",
        },

        // --------------------------------------------------
        // D — HEADER
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Sortons aussi le header de page.tsx.",
          text:
            "Vous connaissez maintenant la méthode. Nous allons créer un deuxième composant beaucoup plus simple.",
        },

        {
          type: "action",
          title: "Créez components/Header.tsx.",
          text:
            "Utilisez exactement le même dossier components.",
          actions: [
            "Dans l'Explorer, faites clic droit sur components.",
            "Cliquez sur New File.",
            "Tapez Header.tsx.",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "components doit maintenant contenir deux fichiers.",
          text:
            "PropertyCard.tsx et Header.tsx doivent apparaître ensemble.",
          visual: "vscode-header-component",
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/HEADER.TSX",
          title: "Collez le header dans son propre fichier.",
          text:
            "Copiez tout ce bloc dans Header.tsx.",
          code: `export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xl font-black tracking-tight">
            PropertyMatch
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Trouvez mieux. Décidez plus vite.
          </p>
        </div>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
          <a href="#recherche">Recherche</a>
          <a href="#logements">Logements</a>
        </nav>
      </div>
    </header>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez Header.tsx.",
          text:
            "Ensuite, nous allons faire la dernière modification de page.tsx.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Cliquez ensuite sur app/page.tsx.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Cliquez ensuite sur app/page.tsx.",
            ],
          },
        },

        {
          type: "text",
          eyebrow: "DERNIÈRE MODIFICATION",
          title: "Dans page.tsx, le gros header va devenir simplement <Header />.",
          text:
            "Pour éviter toute erreur de sélection, nous vous donnons encore la version finale complète de page.tsx.",
        },

        {
          type: "action",
          title: "Remplacez tout app/page.tsx une dernière fois.",
          text:
            "Ne touchez pas aux fichiers du dossier components.",
          actions: [
            "Ouvrez app/page.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Copiez le fichier final ci-dessous.",
            "Collez-le.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — VERSION FINALE LEÇON 06",
          title: "Votre page principale devient beaucoup plus lisible.",
          text:
            "Copiez tout ce fichier.",
          code: `import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";

const logements = [
  {
    id: 1,
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
  },
  {
    id: 2,
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
  },
  {
    id: 3,
    quartier: "Paris 17e",
    titre: "Appartement familial",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
  },
  {
    id: 4,
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <Header />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Décrivez vos besoins. PropertyMatch vous aidera à
            comparer les logements et à identifier les meilleures
            correspondances.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">
              Meilleure correspondance
            </p>

            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              92%
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-100 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Paris 16e
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Appartement lumineux
            </h2>

            <p className="mt-2 text-lg font-bold">
              2 180 € / mois
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <p>✓ 2 chambres</p>
              <p>✓ 62 m²</p>
              <p>✓ Balcon</p>
              <p>✓ Budget compatible</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                placeholder="Paris"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget max
              </span>

              <input
                placeholder="2300 €"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres
              </span>

              <input
                placeholder="2"
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
              Trouver mes logements
            </button>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {logements.length} résultats de démonstration
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logements.map((logement) => (
            <PropertyCard
              key={logement.id}
              quartier={logement.quartier}
              titre={logement.titre}
              prix={logement.prix}
              chambres={logement.chambres}
              surface={logement.surface}
              balcon={logement.balcon}
              score={logement.score}
            />
          ))}
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "SAUVEGARDE FINALE",
          title: "Sauvegardez puis rechargez PropertyMatch.",
          text:
            "Vous avez maintenant trois fichiers qui travaillent ensemble.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Vérifiez le header.",
              "Descendez jusqu'aux quatre cartes.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Vérifiez le header.",
              "Descendez jusqu'aux quatre cartes.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "Le site n'a pas changé pour l'utilisateur, mais votre projet est beaucoup mieux organisé.",
          text:
            "C'est une étape importante : nous améliorons maintenant la structure interne sans sacrifier le rendu.",
          visual: "site-component-final",
        },

        {
          type: "observe",
          eyebrow: "VOTRE PROJET À LA FIN",
          title: "Votre Explorer doit maintenant suivre cette organisation.",
          text:
            "Les trois fichiers principaux ont chacun un rôle plus clair.",
          result: `propertymatch/
├── app/
│   └── page.tsx
│
├── components/
│   ├── Header.tsx
│   └── PropertyCard.tsx
│
├── public/
└── package.json

page.tsx
→ assemble la page

Header.tsx
→ affiche l'en-tête

PropertyCard.tsx
→ affiche une carte logement`,
        },

        {
          type: "text",
          eyebrow: "PROCHAINE ÉTAPE VISUELLE",
          title: "Les blocs gris des logements vont bientôt disparaître.",
          text:
            "Nous avons volontairement conservé les placeholders gris pendant cette leçon pour ne pas mélanger organisation du code et gestion des images. Dans la suite, nous utiliserons le dossier public pour intégrer de vraies images de logements et rendre les cartes beaucoup plus réalistes.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 06",
          title: "Vous pouvez continuer si votre projet correspond à ceci.",
          text:
            "Vous n'avez pas besoin de savoir recréer TypeScript ou les props de mémoire. Vous devez comprendre le principe et avoir réussi la manipulation.",
          items: [
            "J'ai un dossier components au même niveau que app.",
            "components contient PropertyCard.tsx.",
            "components contient Header.tsx.",
            "page.tsx importe Header et PropertyCard.",
            "Les quatre cartes s'affichent toujours.",
            "Le header s'affiche toujours.",
            "J'ai testé qu'une modification de PropertyCard affecte toutes les cartes.",
            "Je comprends qu'un composant permet d'isoler une partie de l'interface.",
            "Mon site fonctionne toujours sur localhost.",
          ],
        },
      ];

    // ====================================================
    // 07 — RENDRE LA RECHERCHE VRAIMENT INTERACTIVE
    // ====================================================

    case "07":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire fonctionner pour de vrai la recherche de PropertyMatch.",
          text:
            "Jusqu'ici, les champs ressemblent à un formulaire mais ils ne contrôlent rien. Dans cette leçon, l'utilisateur pourra modifier son budget, son nombre de chambres et demander un balcon. Les cartes affichées changeront immédiatement selon ses critères.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Votre site doit toujours fonctionner avec Header.tsx et PropertyCard.tsx.",
          text:
            "Avant de commencer, ouvrez localhost:3000. Vérifiez que le header et les quatre logements sont toujours visibles.",
          visual: "site-component-final",
        },

        {
          type: "observe",
          title: "Ce que nous voulons obtenir",
          text:
            "Le formulaire ne sera plus décoratif. Il contrôlera réellement la liste située juste en dessous.",
          result: `L'UTILISATEUR CHANGE UN CRITÈRE

Budget : 2 300 €
Chambres : 2
Balcon : oui

          ↓

PROPERTYMATCH RECALCULE

          ↓

SEULS LES LOGEMENTS
COMPATIBLES RESTENT À L'ÉCRAN`,
        },

        {
          type: "text",
          eyebrow: "IMPORTANT AVANT DE CODER",
          title: "Cette leçon modifie seulement app/page.tsx.",
          text:
            "Ne supprimez ni Header.tsx ni PropertyCard.tsx. Ils restent dans components et continueront à être utilisés.",
        },

        // --------------------------------------------------
        // A — CLIENT COMPONENT
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Ouvrez app/page.tsx.",
          text:
            "Nous allons rendre cette page interactive.",
          actions: [
            "Dans l'Explorer de VS Code, cliquez sur app.",
            "Cliquez sur page.tsx.",
            "Vérifiez que l'onglet actif s'appelle page.tsx.",
            "Ne modifiez pas encore components/PropertyCard.tsx.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "Nous allons ajouter une instruction tout en haut du fichier.",
          text:
            "La première ligne de page.tsx va devenir \"use client\";. Elle doit se trouver avant les imports.",
          visual: "vscode-use-client",
        },

        {
          type: "concept",
          eyebrow: "UNE NOTION À COMPRENDRE",
          title: "Pourquoi \"use client\" ?",
          text:
            "Notre page va maintenant réagir à ce que fait l'utilisateur dans son navigateur. Next.js a besoin de savoir que ce composant utilise des fonctionnalités interactives de React comme useState. La directive \"use client\" sert à l'indiquer.",
        },

        {
          type: "text",
          eyebrow: "MÉTHODE",
          title: "Pour cette première version interactive, remplacez tout page.tsx.",
          text:
            "Cela évite de chercher plusieurs petits morceaux de code dans un fichier long. Nous analyserons ensuite les changements importants directement dans votre site.",
        },

        {
          type: "action",
          title: "Videz uniquement app/page.tsx.",
          text:
            "Assurez-vous une dernière fois que vous êtes dans page.tsx.",
          actions: [
            "Cliquez dans le code.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Appuyez sur Suppr ou Backspace.",
            "Le fichier page.tsx doit être vide.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — VERSION INTERACTIVE",
          title: "Copiez tout ce fichier dans page.tsx.",
          text:
            "Ne copiez pas seulement une partie : remplacez tout le contenu de page.tsx par ce code.",
          code: `"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";

const logements = [
  {
    id: 1,
    ville: "Paris",
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
  },
  {
    id: 2,
    ville: "Paris",
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
  },
  {
    id: 3,
    ville: "Paris",
    quartier: "Paris 17e",
    titre: "Appartement familial",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
  },
  {
    id: 4,
    ville: "Paris",
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
  },
];

export default function Home() {
  const [ville, setVille] = useState("Paris");
  const [budget, setBudget] = useState(2600);
  const [chambres, setChambres] = useState(1);
  const [balcon, setBalcon] = useState(false);

  const logementsFiltres = logements.filter((logement) => {
    const villeCompatible =
      logement.ville.toLowerCase().includes(ville.toLowerCase());

    const budgetCompatible = logement.prix <= budget;

    const chambresCompatibles =
      logement.chambres >= chambres;

    const balconCompatible =
      !balcon || logement.balcon;

    return (
      villeCompatible &&
      budgetCompatible &&
      chambresCompatibles &&
      balconCompatible
    );
  });

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <Header />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-slate-500">
            Recherche immobilière intelligente
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez le logement qui vous correspond vraiment.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Ajustez vos critères et observez les résultats
            se mettre à jour instantanément.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"
          >
            Commencer ma recherche
          </a>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Recherche en direct
          </p>

          <p className="mt-4 text-5xl font-black">
            {logementsFiltres.length}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            logement(s) correspondent actuellement
            à vos critères.
          </p>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Affinez votre recherche.
            </h2>

            <p className="mt-4 text-slate-600">
              Modifiez un champ : les résultats changent
              automatiquement.
            </p>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-100 p-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Ville
              </span>

              <input
                value={ville}
                onChange={(event) => setVille(event.target.value)}
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Budget maximum
              </span>

              <input
                type="number"
                value={budget}
                onChange={(event) =>
                  setBudget(Number(event.target.value))
                }
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="rounded-2xl bg-white p-4">
              <span className="text-xs font-black text-slate-500">
                Chambres minimum
              </span>

              <input
                type="number"
                min="1"
                value={chambres}
                onChange={(event) =>
                  setChambres(Number(event.target.value))
                }
                className="mt-2 w-full bg-transparent text-base font-bold outline-none"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4">
              <input
                type="checkbox"
                checked={balcon}
                onChange={(event) =>
                  setBalcon(event.target.checked)
                }
                className="h-5 w-5"
              />

              <span className="text-sm font-black">
                Balcon obligatoire
              </span>
            </label>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {logementsFiltres.length} résultat(s)
          </p>
        </div>

        {logementsFiltres.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {logementsFiltres.map((logement) => (
              <PropertyCard
                key={logement.id}
                quartier={logement.quartier}
                titre={logement.titre}
                prix={logement.prix}
                chambres={logement.chambres}
                surface={logement.surface}
                balcon={logement.balcon}
                score={logement.score}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-xl font-black">
              Aucun logement trouvé
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Essayez d'augmenter le budget ou de réduire
              le nombre de chambres.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "SAUVEGARDE",
          title: "Sauvegardez puis ouvrez localhost.",
          text:
            "Si votre serveur npm run dev tourne toujours, le navigateur doit se mettre à jour automatiquement.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Passez sur localhost:3000.",
              "Descendez jusqu'à Vos critères.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Passez sur localhost:3000.",
              "Descendez jusqu'à Vos critères.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "CE QUE VOUS DEVEZ VOIR",
          title: "Le formulaire a maintenant de vraies valeurs.",
          text:
            "Au départ : Paris, 2600 € de budget, 1 chambre minimum et balcon non obligatoire. Les quatre logements doivent être visibles.",
          visual: "site-search-live",
        },

        // --------------------------------------------------
        // B — TEST BUDGET
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST 1 — BUDGET",
          title: "Tapez 2000 dans Budget maximum.",
          text:
            "Faites cette manipulation directement dans votre site, pas dans VS Code.",
          actions: [
            "Cliquez dans le champ Budget maximum.",
            "Sélectionnez 2600.",
            "Tapez 2000.",
            "Ne rechargez pas la page.",
            "Regardez immédiatement les logements plus bas.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT ATTENDU",
          title: "Il ne doit rester que le loft à 1 950 €.",
          text:
            "Les logements à 2 050 €, 2 180 € et 2 450 € dépassent maintenant le budget et disparaissent automatiquement.",
          visual: "site-filter-budget",
        },

        {
          type: "concept",
          eyebrow: "CE QUI VIENT DE SE PASSER",
          title: "useState mémorise la valeur actuelle du champ.",
          text:
            "Quand vous tapez 2000, setBudget remplace l'ancienne valeur. React recalcule alors logementsFiltres et met l'écran à jour. Pour l'instant, retenez surtout cette chaîne : utilisateur → nouvelle valeur → nouveau filtre → nouvel affichage.",
        },

        {
          type: "observe",
          title: "La ligne essentielle pour le budget",
          text:
            "Le logement est conservé uniquement si son prix est inférieur ou égal au budget saisi.",
          result: `const budgetCompatible =
  logement.prix <= budget;

Exemple :

1 950 <= 2 000  → OUI  → affiché
2 180 <= 2 000  → NON  → masqué`,
        },

        // --------------------------------------------------
        // C — TEST CHAMBRES + BALCON
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST 2 — PLUSIEURS CRITÈRES",
          title: "Cherchez maintenant un logement avec au moins 2 chambres et un balcon.",
          text:
            "Nous allons combiner plusieurs critères.",
          actions: [
            "Remettez le budget à 2600.",
            "Dans Chambres minimum, tapez 2.",
            "Cochez Balcon obligatoire.",
            "Regardez les cartes restantes.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT ATTENDU",
          title: "Les logements sans assez de chambres ou sans balcon sont éliminés.",
          text:
            "PropertyMatch combine maintenant plusieurs conditions en même temps.",
          visual: "site-filter-balcony",
        },

        {
          type: "concept",
          title: "Le symbole && signifie « ET ».",
          text:
            "Pour qu'un logement reste affiché, la ville ET le budget ET le nombre de chambres ET la condition du balcon doivent être compatibles.",
          items: [
            {
              title: "villeCompatible",
              text: "La ville doit correspondre à la recherche.",
            },
            {
              title: "budgetCompatible",
              text: "Le prix ne doit pas dépasser le budget.",
            },
            {
              title: "chambresCompatibles",
              text: "Le logement doit avoir assez de chambres.",
            },
            {
              title: "balconCompatible",
              text: "Si le balcon est exigé, le logement doit en posséder un.",
            },
          ],
        },

        // --------------------------------------------------
        // D — ZERO RESULTS
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST 3 — AUCUN RÉSULTAT",
          title: "Forcez volontairement une recherche impossible.",
          text:
            "Un vrai site doit aussi savoir quoi afficher quand aucune donnée ne correspond.",
          actions: [
            "Dans Budget maximum, tapez 500.",
            "Observez la zone Logements recommandés.",
            "Vous ne devez pas voir une grande zone vide.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "ÉTAT VIDE",
          title: "PropertyMatch doit afficher un message propre.",
          text:
            "Le message Aucun logement trouvé explique à l'utilisateur quoi faire au lieu de laisser l'interface vide.",
          visual: "site-no-results",
        },

        {
          type: "concept",
          title: "C'est ce qu'on appelle souvent un état vide.",
          text:
            "Une interface sérieuse doit prévoir plusieurs situations : des résultats, aucun résultat, parfois un chargement ou une erreur. Nous commençons ici avec le cas aucun résultat.",
        },

        // --------------------------------------------------
        // E — SMALL CODE LOCATIONS
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "REGARDONS LE CODE SANS TOUT DÉCORTIQUER",
          title: "Vous devez surtout reconnaître quatre zones.",
          text:
            "Le but n'est pas de mémoriser tout le fichier. Vous devez pouvoir retrouver la logique générale lorsque vous relirez votre code.",
        },

        {
          type: "concept",
          title: "Les quatre zones importantes de page.tsx",
          text:
            "Repérez-les dans VS Code.",
          items: [
            {
              title: '"use client"',
              text: "Autorise notre page à utiliser les interactions React côté navigateur.",
            },
            {
              title: "useState(...)",
              text: "Mémorise les critères actuellement choisis.",
            },
            {
              title: "logements.filter(...)",
              text: "Construit la liste des logements compatibles.",
            },
            {
              title: "logementsFiltres.map(...)",
              text: "Affiche une PropertyCard pour chaque résultat restant.",
            },
          ],
        },

        {
          type: "action",
          eyebrow: "PETIT TEST DANS VS CODE",
          title: "Changez la valeur de départ du budget.",
          text:
            "Cela permet de vérifier que vous savez retrouver le state dans le fichier.",
          actions: [
            "Retournez dans app/page.tsx.",
            "Repérez const [budget, setBudget] = useState(2600);",
            "Remplacez temporairement 2600 par 2200.",
            "Sauvegardez.",
            "Rechargez localhost si nécessaire.",
            "Le champ Budget maximum doit maintenant commencer à 2200.",
            "Remettez ensuite 2600 et sauvegardez.",
          ],
        },

        // --------------------------------------------------
        // F — FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "FIN DE LA LEÇON",
          title: "Votre PropertyMatch est maintenant réellement interactif.",
          text:
            "L'utilisateur ne regarde plus seulement une maquette : ses choix modifient directement les logements affichés.",
          visual: "site-search-final",
        },

        {
          type: "text",
          eyebrow: "ET LES IMAGES ?",
          title: "La prochaine grosse amélioration visuelle sera l'intégration de vraies photos de logements.",
          text:
            "Nous avons maintenant la structure, les données, les composants et les filtres. Nous pouvons donc enrichir les cartes sans tout refaire. Nous montrerons précisément où placer les images dans public, comment les relier aux données et comment obtenir des cartes immobilières beaucoup plus premium.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 07",
          title: "Vous pouvez continuer si tout ceci fonctionne.",
          text:
            "Testez réellement les champs avant de valider.",
          items: [
            "app/page.tsx commence par \"use client\".",
            "Le site démarre avec Paris, 2600 €, 1 chambre et balcon non obligatoire.",
            "Modifier le budget fait disparaître ou réapparaître des logements.",
            "Modifier le nombre de chambres change les résultats.",
            "La case Balcon obligatoire fonctionne.",
            "Le compteur de résultats change automatiquement.",
            "Une recherche impossible affiche Aucun logement trouvé.",
            "Header.tsx et PropertyCard.tsx sont toujours dans components.",
            "Je comprends globalement le rôle de useState, filter et map.",
            "Le site fonctionne toujours sur localhost.",
          ],
        },
      ];

    // ====================================================
    // 08 — PHOTOS + DESIGN PREMIUM DES CARTES
    // ====================================================

    case "08":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Transformer les cartes de PropertyMatch en vraies cartes immobilières premium.",
          text:
            "La logique du site fonctionne maintenant. Il est temps de faire évoluer fortement son apparence. Dans cette leçon, nous allons ajouter de vraies photos aux logements, améliorer la hiérarchie visuelle, ajouter des badges, un bouton favori et des effets au survol. Vous verrez le site changer à plusieurs étapes.",
        },

        {
          type: "visual-guide",
          eyebrow: "AVANT",
          title: "Voici le principal problème visuel actuel.",
          text:
            "Les cartes sont propres mais les grands rectangles gris donnent encore l'impression d'une maquette. Nous allons conserver la logique de filtrage et améliorer uniquement la présentation.",
          visual: "site-premium-before",
        },

        {
          type: "observe",
          title: "Ce que nous allons obtenir",
          text:
            "La structure fonctionnelle reste la même. C'est la qualité visuelle des résultats qui monte d'un niveau.",
          result: `AVANT
rectangle gris
titre
prix
quelques informations

        ↓

APRÈS
photo du logement
badge de compatibilité
bouton favori
prix mieux hiérarchisé
caractéristiques avec icônes
effet au survol
cartes responsive`,
        },

        {
          type: "text",
          eyebrow: "IMPORTANT",
          title: "Nous allons modifier deux fichiers.",
          text:
            "D'abord app/page.tsx pour donner une image et un type à chaque logement. Ensuite components/PropertyCard.tsx pour utiliser ces nouvelles informations dans le design de la carte.",
        },

        // --------------------------------------------------
        // A — DATA WITH IMAGES
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Ouvrez app/page.tsx.",
          text:
            "Nous commençons par enrichir les données de chaque logement.",
          actions: [
            "Dans l'Explorer, cliquez sur app.",
            "Cliquez sur page.tsx.",
            "Remontez jusqu'à const logements = [...].",
            "Vous devez retrouver les quatre logements de la leçon précédente.",
          ],
        },

        {
          type: "text",
          eyebrow: "LES PHOTOS",
          title: "Pour cette étape, les images seront chargées depuis Internet.",
          text:
            "Cela permet d'obtenir immédiatement un résultat réaliste sans vous faire gérer des fichiers d'images en même temps que le design. Plus tard dans le module, nous verrons aussi comment stocker proprement vos propres médias. Si Internet est coupé, ces photos ne pourront simplement pas se charger.",
        },

        {
          type: "action",
          title: "Remplacez tout app/page.tsx.",
          text:
            "Comme nous ajoutons plusieurs nouvelles informations aux quatre logements, la méthode la plus sûre est de remplacer le fichier complet.",
          actions: [
            "Cliquez dans app/page.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Copiez le fichier complet ci-dessous.",
            "Collez-le dans page.tsx.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX",
          title: "Nouvelle version des données + recherche interactive.",
          text:
            "Chaque logement possède maintenant image, type et description. Le reste de la logique de filtrage est conservé.",
          code: `"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";

const logements = [
  {
    id: 1,
    ville: "Paris",
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    type: "Appartement",
    description: "Volumes généreux, lumière naturelle et balcon au calme.",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    ville: "Paris",
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    type: "Loft",
    description: "Un intérieur contemporain avec un grand espace de vie ouvert.",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    ville: "Paris",
    quartier: "Paris 17e",
    titre: "Appartement familial",
    type: "Appartement",
    description: "Trois chambres et de beaux espaces pour une vie de famille.",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 4,
    ville: "Paris",
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    type: "Deux-pièces",
    description: "Un appartement chaleureux prolongé par un espace extérieur.",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function Home() {
  const [ville, setVille] = useState("Paris");
  const [budget, setBudget] = useState(2600);
  const [chambres, setChambres] = useState(1);
  const [balcon, setBalcon] = useState(false);

  const logementsFiltres = logements.filter((logement) => {
    const villeCompatible =
      logement.ville.toLowerCase().includes(ville.toLowerCase());

    const budgetCompatible = logement.prix <= budget;

    const chambresCompatibles =
      logement.chambres >= chambres;

    const balconCompatible =
      !balcon || logement.balcon;

    return (
      villeCompatible &&
      budgetCompatible &&
      chambresCompatibles &&
      balconCompatible
    );
  });

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <Header />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Recherche personnalisée
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Trouvez un logement qui coche vraiment vos critères.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Ajustez votre recherche et comparez instantanément
            les logements les plus compatibles.
          </p>

          <a
            href="#recherche"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Explorer les logements
          </a>
        </div>

        <div className="relative overflow-hidden rounded-[36px] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Résultats en direct
          </p>

          <p className="mt-5 text-7xl font-black tracking-tight">
            {logementsFiltres.length}
          </p>

          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
            logement(s) correspondent actuellement
            à votre recherche.
          </p>

          <div className="mt-8 border-t border-white/10 pt-5 text-xs font-bold text-slate-400">
            Paris · jusqu'à {budget.toLocaleString("fr-FR")} € · {chambres}+ chambre(s)
          </div>
        </div>
      </section>

      <section
        id="recherche"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Recherche
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Vos critères essentiels
            </h2>
          </div>

          <div className="mt-7 grid gap-3 rounded-[28px] border border-slate-200 bg-[#f7f7f5] p-3 shadow-sm md:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-[20px] bg-white p-4">
              <span className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                Ville
              </span>

              <input
                value={ville}
                onChange={(event) => setVille(event.target.value)}
                className="mt-2 w-full bg-transparent text-base font-black outline-none"
              />
            </label>

            <label className="rounded-[20px] bg-white p-4">
              <span className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                Budget maximum
              </span>

              <div className="mt-2 flex items-center gap-1">
                <input
                  type="number"
                  value={budget}
                  onChange={(event) =>
                    setBudget(Number(event.target.value))
                  }
                  className="w-full bg-transparent text-base font-black outline-none"
                />
                <span className="font-black">€</span>
              </div>
            </label>

            <label className="rounded-[20px] bg-white p-4">
              <span className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                Chambres minimum
              </span>

              <input
                type="number"
                min="1"
                value={chambres}
                onChange={(event) =>
                  setChambres(Number(event.target.value))
                }
                className="mt-2 w-full bg-transparent text-base font-black outline-none"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-[20px] bg-white p-4">
              <input
                type="checkbox"
                checked={balcon}
                onChange={(event) =>
                  setBalcon(event.target.checked)
                }
                className="h-5 w-5 accent-slate-950"
              />

              <div>
                <span className="block text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Extérieur
                </span>
                <span className="mt-1 block text-sm font-black">
                  Balcon obligatoire
                </span>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section
        id="logements"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Notre sélection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logements recommandés
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Classés selon leur compatibilité avec votre recherche.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm">
            {logementsFiltres.length} résultat(s)
          </div>
        </div>

        {logementsFiltres.length > 0 ? (
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            {logementsFiltres.map((logement) => (
              <PropertyCard
                key={logement.id}
                quartier={logement.quartier}
                titre={logement.titre}
                type={logement.type}
                description={logement.description}
                prix={logement.prix}
                chambres={logement.chambres}
                surface={logement.surface}
                balcon={logement.balcon}
                score={logement.score}
                image={logement.image}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              ⌕
            </div>

            <p className="mt-5 text-xl font-black">
              Aucun logement trouvé
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Essayez d'augmenter votre budget ou de réduire
              le nombre de chambres.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez page.tsx.",
          text:
            "À ce stade, une erreur est normale : PropertyCard ne connaît pas encore les nouvelles informations type, description et image.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Restez dans VS Code.",
              "Passez maintenant à PropertyCard.tsx.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Restez dans VS Code.",
              "Passez maintenant à PropertyCard.tsx.",
            ],
          },
        },

        // --------------------------------------------------
        // B — PREMIUM CARD
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE B",
          title: "Ouvrez components/PropertyCard.tsx.",
          text:
            "C'est ici que nous allons faire le plus gros changement visuel.",
          actions: [
            "Dans l'Explorer, ouvrez components.",
            "Cliquez sur PropertyCard.tsx.",
            "Vérifiez le nom de l'onglet en haut.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "Le fichier de la carte est le bon endroit pour travailler le design.",
          text:
            "Comme toutes les annonces utilisent ce composant, une seule modification améliorera toutes les cartes.",
          visual: "vscode-propertycard-image",
        },

        {
          type: "action",
          title: "Videz PropertyCard.tsx.",
          text:
            "Nous remplaçons entièrement l'ancienne carte.",
          actions: [
            "Cliquez dans PropertyCard.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Gardez bien page.tsx ouvert dans son autre onglet.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/PROPERTYCARD.TSX",
          title: "Collez cette nouvelle carte premium.",
          text:
            "Copiez tout le code ci-dessous dans PropertyCard.tsx.",
          code: `type PropertyCardProps = {
  quartier: string;
  titre: string;
  type: string;
  description: string;
  prix: number;
  chambres: number;
  surface: number;
  balcon: boolean;
  score: number;
  image: string;
};

export default function PropertyCard({
  quartier,
  titre,
  type,
  description,
  prix,
  chambres,
  surface,
  balcon,
  score,
  image,
}: PropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          src={image}
          alt={titre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-2 text-[11px] font-black shadow-sm backdrop-blur">
            {type}
          </span>

          <button
            type="button"
            aria-label="Ajouter aux favoris"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm backdrop-blur transition hover:scale-105"
          >
            ♡
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white shadow-lg">
            {score}% compatible
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {quartier}
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-tight">
          {titre}
        </h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            ◫ {chambres} chambre(s)
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            ↔ {surface} m²
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            {balcon ? "◇ Balcon" : "Sans balcon"}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              Loyer mensuel
            </p>

            <p className="mt-1 text-2xl font-black">
              {prix.toLocaleString("fr-FR")} €
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Voir le bien
          </button>
        </div>
      </div>
    </article>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "SAUVEGARDE",
          title: "Sauvegardez PropertyCard.tsx puis regardez le site.",
          text:
            "Cette fois, le changement doit être immédiatement visible.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Passez dans votre navigateur.",
              "Ouvrez ou rechargez localhost:3000.",
              "Descendez jusqu'aux logements.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Passez dans votre navigateur.",
              "Ouvrez ou rechargez localhost:3000.",
              "Descendez jusqu'aux logements.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "APRÈS",
          title: "Les rectangles gris ont disparu.",
          text:
            "Chaque annonce possède maintenant une vraie image, un badge de type, un score, un favori, une description et un bouton d'action.",
          visual: "site-premium-cards",
        },

        // --------------------------------------------------
        // C — UNDERSTAND IMAGE
        // --------------------------------------------------

        {
          type: "concept",
          eyebrow: "JUSTE CE QU'IL FAUT COMPRENDRE",
          title: "Comment la bonne photo arrive-t-elle dans la bonne carte ?",
          text:
            "Chaque objet logement contient une adresse d'image. page.tsx envoie cette adresse à PropertyCard avec image={logement.image}. PropertyCard l'utilise ensuite dans src={image}.",
          items: [
            {
              title: "image: \"https://...\"",
              text: "L'adresse de la photo est stockée avec les autres données du logement.",
            },
            {
              title: "image={logement.image}",
              text: "page.tsx transmet cette image au composant.",
            },
            {
              title: "src={image}",
              text: "La balise img affiche réellement la photo.",
            },
          ],
        },

        {
          type: "warning",
          title: "Les photos ne s'affichent pas ?",
          text:
            "Vérifiez d'abord votre connexion Internet et assurez-vous d'avoir copié les adresses d'images entièrement. Une URL coupée ou une guillemet manquante suffit à empêcher l'image de fonctionner.",
        },

        // --------------------------------------------------
        // D — HOVER
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE C",
          title: "Passez votre souris sur une carte.",
          text:
            "Aucun code supplémentaire n'est nécessaire : les effets sont déjà dans le composant.",
          actions: [
            "Placez la souris sur une carte sans cliquer.",
            "Observez la carte monter très légèrement.",
            "Observez l'ombre devenir plus forte.",
            "Regardez aussi la photo : elle zoome très légèrement.",
            "Passez ensuite la souris sur Voir le bien.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "MICRO-INTERACTIONS",
          title: "Les petits mouvements donnent une impression de produit fini.",
          text:
            "Ils doivent rester discrets. Le but n'est pas de faire bouger toute la page, mais de signaler naturellement qu'un élément est interactif.",
          visual: "site-premium-hover",
        },

        {
          type: "concept",
          title: "Les classes hover: s'activent au passage de la souris.",
          text:
            "Par exemple hover:-translate-y-1 déplace très légèrement la carte vers le haut. group-hover:scale-105 agrandit légèrement la photo lorsque la souris se trouve sur la carte.",
        },

        // --------------------------------------------------
        // E — RESPONSIVE
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE D",
          title: "Vérifiez maintenant le rendu mobile.",
          text:
            "Un beau site desktop qui casse sur téléphone n'est pas un site terminé.",
          actions: [
            "Ouvrez localhost dans votre navigateur.",
            "Réduisez progressivement la largeur de la fenêtre.",
            "Les deux cartes par ligne doivent passer à une seule carte par ligne.",
            "Le contenu de chaque carte doit rester lisible.",
            "Aucun texte ne doit sortir de l'écran.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "RESPONSIVE",
          title: "La même carte doit fonctionner sur ordinateur et téléphone.",
          text:
            "La grille de page.tsx utilise md:grid-cols-2 : à partir d'une certaine largeur, deux cartes sont affichées côte à côte. Sur un petit écran, elles restent naturellement sur une seule colonne.",
          visual: "site-premium-mobile",
        },

        // --------------------------------------------------
        // F — VISUAL TEST
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST VISUEL",
          title: "Changez temporairement la photo d'un logement.",
          text:
            "Le but est de vérifier que vous avez compris où sont stockées les images.",
          actions: [
            "Retournez dans app/page.tsx.",
            "Repérez le premier logement.",
            "Repérez sa propriété image.",
            "Copiez l'URL image du deuxième logement.",
            "Remplacez temporairement l'URL du premier par celle-ci.",
            "Sauvegardez et regardez la première carte.",
            "Remettez ensuite l'URL d'origine.",
            "Sauvegardez.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch commence maintenant à ressembler à un vrai produit.",
          text:
            "Nous avons conservé les filtres de la leçon 07, mais l'interface des résultats est beaucoup plus crédible et plus agréable à parcourir.",
          visual: "site-premium-final",
        },

        {
          type: "text",
          eyebrow: "CE N'EST PAS FINI",
          title: "Le design continuera d'évoluer dans les prochaines leçons.",
          text:
            "Nous n'allons pas considérer cette version comme le design final. Les prochaines fonctionnalités apporteront notamment de vraies pages de détail, une navigation plus complète, des favoris fonctionnels, davantage d'états d'interface et une finition globale avant la mise en ligne.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 08",
          title: "Vérifiez votre site avant de continuer.",
          text:
            "Vous devez avoir un résultat visuel clairement meilleur qu'à la leçon précédente.",
          items: [
            "Les quatre logements possèdent une propriété image.",
            "Les quatre cartes affichent une photo.",
            "Chaque carte affiche son type de logement.",
            "Chaque carte affiche une courte description.",
            "Le score de compatibilité est visible sur la photo.",
            "Le bouton favori apparaît en haut de la photo.",
            "Le bouton Voir le bien apparaît en bas de la carte.",
            "Le survol d'une carte déclenche une animation discrète.",
            "Les filtres de la leçon 07 fonctionnent toujours.",
            "Sur une petite fenêtre, les cartes passent sur une colonne.",
            "Header.tsx est toujours intact.",
            "PropertyMatch fonctionne toujours sur localhost.",
          ],
        },
      ];

    // ====================================================
    // 09 — CRÉER UNE VRAIE PAGE DE DÉTAIL
    // ====================================================

    case "09":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire ouvrir une vraie fiche logement quand l'utilisateur clique sur « Voir le bien ».",
          text:
            "PropertyMatch possède maintenant de belles cartes, mais le bouton Voir le bien ne mène encore nulle part. Nous allons créer une vraie route Next.js dynamique : chaque logement aura sa propre URL et sa propre page de détail.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Nous repartons du PropertyMatch premium de la leçon 08.",
          text:
            "Les filtres, les photos et les cartes restent en place. Nous allons ajouter une nouvelle couche : la navigation vers une fiche complète.",
          visual: "site-premium-final",
        },

        {
          type: "observe",
          title: "Le parcours utilisateur que nous allons construire",
          text:
            "À la fin, l'utilisateur pourra réellement passer d'une liste de résultats à un logement précis.",
          result: `PAGE D'ACCUEIL

Appartement lumineux
2 180 € / mois
[ Voir le bien ]

        ↓ clic

/biens/1

        ↓

FICHE DU LOGEMENT
grande photo
prix
score
caractéristiques
description
bouton de contact`,
        },

        {
          type: "concept",
          eyebrow: "NOUVELLE NOTION",
          title: "Une route correspond à une adresse de votre site.",
          text:
            "Votre page d'accueil utilise /. Nous allons créer /biens/1, /biens/2, /biens/3 et /biens/4. Avec Next.js, nous n'avons pas besoin de créer quatre fichiers différents : un dossier [id] permettra à une seule page de recevoir l'identifiant du logement demandé.",
        },

        // --------------------------------------------------
        // A — ROUTE FOLDERS
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Créez le dossier biens dans app.",
          text:
            "Suivez exactement l'arborescence indiquée.",
          actions: [
            "Dans l'Explorer de VS Code, repérez le dossier app.",
            "Faites clic droit sur app.",
            "Cliquez sur New Folder.",
            "Tapez exactement : biens",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "action",
          title: "Dans biens, créez maintenant le dossier [id].",
          text:
            "Les crochets font partie du nom. Ne tapez pas simplement id.",
          actions: [
            "Faites clic droit sur le nouveau dossier biens.",
            "Cliquez sur New Folder.",
            "Tapez exactement : [id]",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "action",
          title: "Dans [id], créez page.tsx.",
          text:
            "Ce fichier deviendra le modèle de toutes les fiches logements.",
          actions: [
            "Faites clic droit sur [id].",
            "Cliquez sur New File.",
            "Tapez : page.tsx",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "Votre arborescence doit ressembler exactement à ceci.",
          text:
            "Le nouveau page.tsx est imbriqué dans app → biens → [id].",
          visual: "vscode-detail-route",
        },

        {
          type: "warning",
          title: "Ne confondez pas les deux page.tsx.",
          text:
            "app/page.tsx reste votre page d'accueil. app/biens/[id]/page.tsx est la nouvelle fiche logement. Vérifiez toujours l'arborescence dans l'Explorer avant de remplacer du code.",
        },

        // --------------------------------------------------
        // B — DETAIL PAGE
        // --------------------------------------------------

        {
          type: "code",
          eyebrow: "APP/BIENS/[ID]/PAGE.TSX",
          title: "Collez cette première vraie page de détail.",
          text:
            "Le fichier que vous venez de créer est vide. Copiez tout le code ci-dessous dedans.",
          code: `import Link from "next/link";
import { notFound } from "next/navigation";

const logements = [
  {
    id: 1,
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    type: "Appartement",
    description:
      "Volumes généreux, lumière naturelle et balcon au calme. Cet appartement offre une pièce de vie confortable et une distribution idéale pour un couple ou une petite famille.",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: 2,
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    type: "Loft",
    description:
      "Un intérieur contemporain avec un grand espace de vie ouvert. Une adresse pensée pour celles et ceux qui recherchent un logement moderne et fonctionnel.",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: 3,
    quartier: "Paris 17e",
    titre: "Appartement familial",
    type: "Appartement",
    description:
      "Trois chambres et de beaux espaces pour une vie de famille. Le séjour généreux et le balcon apportent confort et luminosité au quotidien.",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: 4,
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    type: "Deux-pièces",
    description:
      "Un appartement chaleureux prolongé par un espace extérieur. Son format compact et bien pensé convient parfaitement à une personne seule ou un couple.",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
  },
];

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetailPage({
  params,
}: DetailPageProps) {
  const { id } = await params;

  const logement = logements.find(
    (item) => item.id === Number(id)
  );

  if (!logement) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-black tracking-tight">
            PropertyMatch
          </Link>

          <Link
            href="/"
            className="text-sm font-bold text-slate-500 transition hover:text-slate-950"
          >
            ← Retour aux logements
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-[36px] bg-slate-200">
          <img
            src={logement.image}
            alt={logement.titre}
            className="h-[420px] w-full object-cover sm:h-[520px]"
          />
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">
                {logement.score}% compatible
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black">
                {logement.type}
              </span>
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              {logement.quartier}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {logement.titre}
            </h1>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-2xl bg-white px-4 py-3 text-sm font-bold shadow-sm">
                ◫ {logement.chambres} chambre(s)
              </span>

              <span className="rounded-2xl bg-white px-4 py-3 text-sm font-bold shadow-sm">
                ↔ {logement.surface} m²
              </span>

              <span className="rounded-2xl bg-white px-4 py-3 text-sm font-bold shadow-sm">
                {logement.balcon ? "◇ Balcon" : "Sans balcon"}
              </span>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-black">
                À propos de ce logement
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                {logement.description}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 lg:sticky lg:top-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Loyer mensuel
            </p>

            <p className="mt-2 text-4xl font-black">
              {logement.prix.toLocaleString("fr-FR")} €
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Cette annonce correspond à {logement.score}% aux critères de votre recherche.
            </p>

            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Contacter pour ce bien
            </button>

            <button
              type="button"
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black transition hover:bg-slate-50"
            >
              ♡ Ajouter aux favoris
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez la nouvelle page.",
          text:
            "Nous allons d'abord tester directement l'adresse avant de connecter les boutons.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez votre navigateur.",
              "Dans la barre d'adresse, tapez localhost:3000/biens/1.",
              "Appuyez sur Entrée.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez votre navigateur.",
              "Dans la barre d'adresse, tapez localhost:3000/biens/1.",
              "Appuyez sur Entrée.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT ATTENDU",
          title: "Vous devez maintenant avoir une vraie fiche immobilière.",
          text:
            "La photo occupe une place importante, puis viennent le score, le titre, les caractéristiques, la description et une carte de prix/contact.",
          visual: "site-detail-page",
        },

        {
          type: "action",
          eyebrow: "TEST DE LA ROUTE",
          title: "Changez uniquement le numéro dans l'adresse.",
          text:
            "Vous allez vérifier que [id] utilise bien la même page pour plusieurs logements.",
          actions: [
            "Dans la barre d'adresse, remplacez /biens/1 par /biens/2.",
            "Appuyez sur Entrée.",
            "Le loft du Paris 15e doit apparaître.",
            "Essayez ensuite /biens/3.",
            "Puis /biens/4.",
            "Les informations doivent changer sans créer de nouveau fichier.",
          ],
        },

        {
          type: "concept",
          eyebrow: "CE QUI SE PASSE",
          title: "[id] récupère le numéro présent dans l'URL.",
          text:
            "Quand vous ouvrez /biens/3, Next.js place 3 dans params.id. Notre code cherche ensuite dans logements l'objet dont id vaut 3. C'est ainsi qu'une seule page peut afficher plusieurs biens.",
        },

        {
          type: "observe",
          title: "Le chemin complet",
          text:
            "Voici la logique à retenir.",
          result: `/biens/3
   ↓
params.id = "3"
   ↓
Number(id) = 3
   ↓
logements.find(...)
   ↓
Appartement familial
   ↓
la page affiche ses données`,
        },

        // --------------------------------------------------
        // C — CONNECT CARDS
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Maintenant, connectons le bouton « Voir le bien ».",
          text:
            "Pour cela, PropertyCard doit connaître l'id du logement afin de construire une adresse comme /biens/1.",
        },

        {
          type: "action",
          title: "Ouvrez components/PropertyCard.tsx.",
          text:
            "Nous allons remplacer le composant complet pour éviter les erreurs de modification.",
          actions: [
            "Dans l'Explorer, ouvrez components.",
            "Cliquez sur PropertyCard.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout le contenu.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/PROPERTYCARD.TSX",
          title: "Remplacez la carte par cette version cliquable.",
          text:
            "Le design reste quasiment identique. La différence importante est l'ajout de Link et de id.",
          code: `import Link from "next/link";

type PropertyCardProps = {
  id: number;
  quartier: string;
  titre: string;
  type: string;
  description: string;
  prix: number;
  chambres: number;
  surface: number;
  balcon: boolean;
  score: number;
  image: string;
};

export default function PropertyCard({
  id,
  quartier,
  titre,
  type,
  description,
  prix,
  chambres,
  surface,
  balcon,
  score,
  image,
}: PropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          src={image}
          alt={titre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-2 text-[11px] font-black shadow-sm backdrop-blur">
            {type}
          </span>

          <button
            type="button"
            aria-label="Ajouter aux favoris"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm backdrop-blur transition hover:scale-105"
          >
            ♡
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white shadow-lg">
            {score}% compatible
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {quartier}
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-tight">
          {titre}
        </h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            ◫ {chambres} chambre(s)
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            ↔ {surface} m²
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            {balcon ? "◇ Balcon" : "Sans balcon"}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              Loyer mensuel
            </p>

            <p className="mt-1 text-2xl font-black">
              {prix.toLocaleString("fr-FR")} €
            </p>
          </div>

          <Link
            href={"/biens/" + id}
            className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Voir le bien
          </Link>
        </div>
      </div>
    </article>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez PropertyCard.tsx.",
          text:
            "Il reste encore une petite modification à faire dans page.tsx : nous devons réellement lui transmettre id.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Cliquez ensuite sur app/page.tsx.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Cliquez ensuite sur app/page.tsx.",
            ],
          },
        },

        {
          type: "action",
          eyebrow: "ÉTAPE C",
          title: "Ajoutez id={logement.id} à PropertyCard dans app/page.tsx.",
          text:
            "Cette fois, il n'est pas nécessaire de remplacer tout le fichier.",
          actions: [
            "Ouvrez app/page.tsx.",
            "Descendez jusqu'à logementsFiltres.map(...).",
            "Repérez <PropertyCard.",
            "Juste après key={logement.id}, ajoutez la nouvelle ligne montrée ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "PETITE MODIFICATION",
          title: "Votre début de PropertyCard doit ressembler à ceci.",
          text:
            "Ajoutez seulement id={logement.id}. Les autres propriétés restent identiques.",
          code: `<PropertyCard
  key={logement.id}
  id={logement.id}
  quartier={logement.quartier}
  titre={logement.titre}
  type={logement.type}
  description={logement.description}
  prix={logement.prix}
  chambres={logement.chambres}
  surface={logement.surface}
  balcon={logement.balcon}
  score={logement.score}
  image={logement.image}
/>`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez puis testez depuis la vraie page d'accueil.",
          text:
            "Nous ne voulons plus taper manuellement /biens/1.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Descendez aux logements.",
              "Cliquez sur Voir le bien du premier logement.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Descendez aux logements.",
              "Cliquez sur Voir le bien du premier logement.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "NAVIGATION RÉELLE",
          title: "Le bouton de la carte doit maintenant ouvrir /biens/1.",
          text:
            "Vous venez de connecter deux pages de votre application. Le bouton n'est plus décoratif.",
          visual: "site-card-clickable",
        },

        // --------------------------------------------------
        // D — RESPONSIVE + 404
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE D",
          title: "Testez la fiche sur une petite fenêtre.",
          text:
            "La colonne de prix doit passer sous les informations principales lorsque l'écran devient étroit.",
          actions: [
            "Restez sur une fiche logement.",
            "Réduisez progressivement la largeur du navigateur.",
            "La grande photo doit rester dans l'écran.",
            "Le titre doit rester lisible.",
            "La carte de prix/contact doit passer sous la description.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "MOBILE",
          title: "La fiche est également pensée pour les petits écrans.",
          text:
            "Sur mobile, les éléments sont empilés afin de conserver une lecture claire et un bouton de contact facilement accessible.",
          visual: "site-detail-mobile",
        },

        {
          type: "action",
          eyebrow: "TEST BONUS IMPORTANT",
          title: "Essayez une URL qui n'existe pas.",
          text:
            "Tapez volontairement un identifiant absent de notre liste.",
          actions: [
            "Dans la barre d'adresse, tapez localhost:3000/biens/99.",
            "Appuyez sur Entrée.",
            "Le site ne doit pas essayer d'afficher de fausses données.",
            "Next.js doit afficher sa page Not Found.",
            "Revenez ensuite à localhost:3000.",
          ],
        },

        {
          type: "concept",
          title: "notFound() protège la page lorsqu'aucun logement ne correspond.",
          text:
            "Si logements.find(...) ne trouve rien, nous appelons notFound(). Plus tard, nous pourrons même créer notre propre page 404 au design PropertyMatch.",
        },

        // --------------------------------------------------
        // E — FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch possède maintenant une vraie navigation catalogue → fiche produit.",
          text:
            "C'est une étape importante : le site commence à avoir la structure d'une véritable application immobilière plutôt que celle d'une simple page unique.",
          visual: "site-detail-final",
        },

        {
          type: "text",
          eyebrow: "CE QUI ARRIVE ENSUITE",
          title: "Nous continuerons à enrichir la fiche au lieu de la laisser statique.",
          text:
            "Les prochains développements pourront rendre les favoris réellement fonctionnels, améliorer encore la navigation et éviter la duplication actuelle des données entre la page d'accueil et la fiche. Nous avancerons progressivement pour que chaque nouvelle notion reste compréhensible.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 09",
          title: "Vérifiez ces points avant de continuer.",
          text:
            "Cliquez réellement sur plusieurs logements : ne validez pas uniquement parce que le code ne montre pas d'erreur.",
          items: [
            "J'ai créé app/biens/[id]/page.tsx.",
            "localhost:3000/biens/1 affiche le premier logement.",
            "localhost:3000/biens/2 affiche le deuxième logement.",
            "Le bouton Voir le bien est maintenant un vrai lien.",
            "Chaque PropertyCard reçoit id={logement.id}.",
            "Cliquer sur une carte ouvre la bonne fiche.",
            "La fiche possède une grande photo et un design complet.",
            "Le prix, le score, les chambres et la surface sont visibles.",
            "Le lien Retour aux logements fonctionne.",
            "La fiche reste lisible sur une petite fenêtre.",
            "/biens/99 déclenche un état Not Found.",
            "Les filtres de la page d'accueil fonctionnent toujours.",
          ],
        },
      ];

    // ====================================================
    // 10 — CENTRALISER LES DONNÉES
    // ====================================================

    case "10":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Arrêter de copier les mêmes logements dans plusieurs fichiers.",
          text:
            "À la leçon précédente, nous avons volontairement dupliqué les données pour apprendre les routes dynamiques sans ajouter trop de notions d'un coup. Maintenant, nous allons corriger cette architecture : une seule liste de logements alimentera la page d'accueil ET les fiches détaillées.",
        },

        {
          type: "observe",
          title: "Le problème actuel",
          text:
            "Le même appartement existe actuellement à deux endroits dans le code.",
          result: `app/page.tsx
const logements = [ ... ]

ET

app/biens/[id]/page.tsx
const logements = [ ... ]

PROBLÈME :
si le prix change,
il faut penser à le modifier deux fois.`,
        },

        {
          type: "concept",
          eyebrow: "NOUVELLE NOTION",
          title: "Une seule source de vérité.",
          text:
            "Nous allons créer un fichier dédié aux données. Les différentes pages importeront ensuite la même liste. Ainsi, si nous changeons le prix d'un logement à un seul endroit, tout le site utilisera automatiquement la nouvelle valeur.",
        },

        {
          type: "visual-guide",
          eyebrow: "ARCHITECTURE CIBLE",
          title: "Nous allons ajouter un dossier data à la racine du projet.",
          text:
            "Il sera au même niveau que app et components, pas à l'intérieur de l'un des deux.",
          visual: "vscode-data-folder",
        },

        // A — CREATE DATA
        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Créez le dossier data.",
          text:
            "Regardez bien l'Explorer avant de cliquer.",
          actions: [
            "Dans VS Code, repérez tout en haut le dossier principal PROPERTYMATCH.",
            "Faites clic droit directement sur PROPERTYMATCH.",
            "Cliquez sur New Folder.",
            "Tapez exactement : data",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "action",
          title: "Créez maintenant logements.ts dans data.",
          text:
            "Ce fichier contiendra les données partagées de notre application.",
          actions: [
            "Faites clic droit sur data.",
            "Cliquez sur New File.",
            "Tapez exactement : logements.ts",
            "Appuyez sur Entrée.",
            "Le nouvel onglet logements.ts doit s'ouvrir.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VÉRIFICATION VS CODE",
          title: "Votre nouveau fichier doit être ici.",
          text:
            "Si logements.ts se trouve dans app ou components, déplacez-le avant de continuer.",
          visual: "vscode-logements-file",
        },

        {
          type: "code",
          eyebrow: "DATA/LOGEMENTS.TS",
          title: "Copiez toute la liste des logements dans ce fichier.",
          text:
            "Le mot export placé devant const est important : il permettra aux autres fichiers d'utiliser cette liste.",
          code: `export const logements = [
  {
    id: 1,
    ville: "Paris",
    quartier: "Paris 16e",
    titre: "Appartement lumineux",
    type: "Appartement",
    description:
      "Volumes généreux, lumière naturelle et balcon au calme. Cet appartement offre une pièce de vie confortable et une distribution idéale pour un couple ou une petite famille.",
    prix: 2180,
    chambres: 2,
    surface: 62,
    balcon: true,
    score: 92,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: 2,
    ville: "Paris",
    quartier: "Paris 15e",
    titre: "Loft proche des quais",
    type: "Loft",
    description:
      "Un intérieur contemporain avec un grand espace de vie ouvert. Une adresse pensée pour celles et ceux qui recherchent un logement moderne et fonctionnel.",
    prix: 1950,
    chambres: 1,
    surface: 54,
    balcon: false,
    score: 84,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: 3,
    ville: "Paris",
    quartier: "Paris 17e",
    titre: "Appartement familial",
    type: "Appartement",
    description:
      "Trois chambres et de beaux espaces pour une vie de famille. Le séjour généreux et le balcon apportent confort et luminosité au quotidien.",
    prix: 2450,
    chambres: 3,
    surface: 78,
    balcon: true,
    score: 79,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: 4,
    ville: "Paris",
    quartier: "Paris 11e",
    titre: "Deux-pièces avec terrasse",
    type: "Deux-pièces",
    description:
      "Un appartement chaleureux prolongé par un espace extérieur. Son format compact et bien pensé convient parfaitement à une personne seule ou un couple.",
    prix: 2050,
    chambres: 1,
    surface: 49,
    balcon: true,
    score: 87,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
  },
];`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez logements.ts.",
          text:
            "Le site n'utilise pas encore ce fichier. C'est normal.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Gardez logements.ts ouvert.",
              "Nous allons maintenant connecter la page d'accueil.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Gardez logements.ts ouvert.",
              "Nous allons maintenant connecter la page d'accueil.",
            ],
          },
        },

        // B — HOME IMPORT
        {
          type: "action",
          eyebrow: "ÉTAPE B",
          title: "Ouvrez app/page.tsx.",
          text:
            "Nous allons supprimer sa copie locale des logements.",
          actions: [
            "Dans l'Explorer, ouvrez app.",
            "Cliquez sur page.tsx.",
            "Repérez les imports tout en haut.",
            "Puis repérez le grand bloc const logements = [...].",
          ],
        },

        {
          type: "code",
          eyebrow: "IMPORT À AJOUTER",
          title: "Ajoutez cet import avec les autres imports.",
          text:
            "Le symbole @/ représente ici la racine de votre projet configurée par Next.js.",
          code: `import { logements } from "@/data/logements";`,
        },

        {
          type: "action",
          title: "Supprimez ensuite la liste const logements = [...].",
          text:
            "Attention : supprimez seulement la grande constante logements. Ne supprimez pas export default function Home().",
          actions: [
            "Repérez la ligne const logements = [.",
            "Sélectionnez depuis cette ligne jusqu'au ]; qui ferme la liste des quatre logements.",
            "Supprimez cette sélection.",
            "Vérifiez que les imports restent en haut.",
            "Vérifiez que export default function Home() existe toujours.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "APRÈS LA MODIFICATION",
          title: "Le début de page.tsx devient beaucoup plus propre.",
          text:
            "La page importe désormais les données au lieu de les posséder elle-même.",
          visual: "vscode-import-data",
        },

        {
          type: "os-guide",
          title: "Sauvegardez et vérifiez la page d'accueil.",
          text:
            "Visuellement, rien ne doit changer. C'est justement le but : nous améliorons l'architecture sans casser le produit.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Vérifiez les quatre logements.",
              "Testez rapidement le budget.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Vérifiez les quatre logements.",
              "Testez rapidement le budget.",
            ],
          },
        },

        // C — DETAIL IMPORT
        {
          type: "action",
          eyebrow: "ÉTAPE C",
          title: "Connectez maintenant la fiche logement aux mêmes données.",
          text:
            "Ouvrez app/biens/[id]/page.tsx.",
          actions: [
            "Dans l'Explorer, ouvrez app → biens → [id].",
            "Cliquez sur page.tsx.",
            "Repérez import Link et import { notFound }.",
            "Nous allons ajouter un troisième import.",
          ],
        },

        {
          type: "code",
          eyebrow: "IMPORT À AJOUTER",
          title: "Ajoutez cette ligne en haut de la fiche.",
          text:
            "Elle importe exactement le même tableau que la page d'accueil.",
          code: `import { logements } from "@/data/logements";`,
        },

        {
          type: "action",
          title: "Supprimez aussi la copie de const logements = [...] dans cette fiche.",
          text:
            "Après cette suppression, la page continuera à utiliser logements, mais celui-ci viendra de data/logements.ts.",
          actions: [
            "Sélectionnez uniquement le grand bloc const logements = [...].",
            "Supprimez-le.",
            "Ne supprimez pas type DetailPageProps.",
            "Ne supprimez pas export default async function DetailPage.",
            "Sauvegardez.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "FLUX DES DONNÉES",
          title: "Les deux pages utilisent maintenant la même source.",
          text:
            "C'est beaucoup plus proche de la manière dont on organise une vraie application.",
          visual: "data-flow",
        },

        // D — TEST SOURCE OF TRUTH
        {
          type: "action",
          eyebrow: "TEST IMPORTANT",
          title: "Modifiez un prix une seule fois.",
          text:
            "Nous allons prouver que la centralisation fonctionne.",
          actions: [
            "Ouvrez data/logements.ts.",
            "Dans le premier logement, repérez prix: 2180.",
            "Remplacez temporairement 2180 par 2190.",
            "Sauvegardez.",
            "Ouvrez localhost:3000 et observez la première carte.",
            "Cliquez sur Voir le bien.",
            "Vérifiez aussi le prix sur /biens/1.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "UNE MODIFICATION → DEUX ÉCRANS",
          title: "Le nouveau prix doit apparaître sur la carte ET sur la fiche.",
          text:
            "Vous n'avez modifié qu'un seul fichier : data/logements.ts.",
          visual: "site-shared-data",
        },

        {
          type: "action",
          title: "Remettez maintenant le prix à 2180.",
          text:
            "Nous voulons conserver les données initiales pour la suite.",
          actions: [
            "Retournez dans data/logements.ts.",
            "Remplacez 2190 par 2180.",
            "Sauvegardez.",
          ],
        },

        // E — UNDERSTAND IMPORT EXPORT
        {
          type: "concept",
          eyebrow: "À COMPRENDRE",
          title: "export rend une valeur disponible pour d'autres fichiers.",
          text:
            "Dans logements.ts, nous écrivons export const logements. Cela signifie que ce fichier autorise les autres fichiers à récupérer cette constante.",
        },

        {
          type: "concept",
          title: "import récupère cette valeur là où nous en avons besoin.",
          text:
            "Dans page.tsx et dans la fiche, import { logements } from \"@/data/logements\" demande à JavaScript d'utiliser la constante exportée par ce fichier.",
          items: [
            {
              title: "data/logements.ts",
              text: "Stocke et exporte les données.",
            },
            {
              title: "app/page.tsx",
              text: "Importe les données pour filtrer et afficher les cartes.",
            },
            {
              title: "app/biens/[id]/page.tsx",
              text: "Importe les mêmes données pour trouver le logement correspondant à l'URL.",
            },
          ],
        },

        {
          type: "observe",
          title: "Votre architecture commence à se séparer en responsabilités.",
          text:
            "Chaque zone du projet a maintenant un rôle plus clair.",
          result: `data/
  logements.ts
  → LES DONNÉES

components/
  Header.tsx
  PropertyCard.tsx
  → LES ÉLÉMENTS RÉUTILISABLES

app/
  page.tsx
  biens/[id]/page.tsx
  → LES PAGES ET LES URLS`,
        },

        // F — FINAL
        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT",
          title: "Le visiteur ne voit presque aucune différence, mais votre projet est beaucoup plus solide.",
          text:
            "C'est une étape importante en développement : toutes les améliorations ne sont pas forcément visibles. Une bonne architecture permet surtout de continuer à développer le produit sans créer de chaos dans le code.",
          visual: "site-shared-data-final",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE ÉTAPE",
          title: "Nous allons pouvoir ajouter des fonctionnalités sans recopier les données partout.",
          text:
            "Cette base nous prépare notamment aux favoris, à davantage de logements et, plus tard, au remplacement de cette liste locale par de vraies données provenant d'un backend ou d'une base de données.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 10",
          title: "Vérifiez votre architecture avant de continuer.",
          text:
            "Le site doit fonctionner exactement comme avant, mais les données ne doivent plus être dupliquées.",
          items: [
            "J'ai créé data/logements.ts à la racine du projet.",
            "La liste des quatre logements n'existe plus dans app/page.tsx.",
            "app/page.tsx importe logements depuis @/data/logements.",
            "La liste des logements n'existe plus dans app/biens/[id]/page.tsx.",
            "La fiche importe elle aussi logements depuis @/data/logements.",
            "La page d'accueil affiche toujours les quatre logements.",
            "Les filtres fonctionnent toujours.",
            "Les boutons Voir le bien fonctionnent toujours.",
            "Modifier un prix dans logements.ts modifie la carte et la fiche.",
            "J'ai remis le premier prix à 2180.",
            "Je comprends globalement la différence entre export et import.",
          ],
        },
      ];

    // ====================================================
    // 11 — FAVORIS FONCTIONNELS
    // ====================================================

    case "11":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Transformer le cœur décoratif en vrai bouton favori.",
          text:
            "À la fin de cette leçon, l'utilisateur pourra cliquer sur le cœur d'un logement, voir immédiatement son état changer et conserver ce choix même après avoir rechargé la page. Le même bouton fonctionnera aussi sur la fiche détaillée.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Le cœur existe déjà, mais il ne mémorise rien.",
          text:
            "Sur les cartes premium, le bouton ♡ est actuellement uniquement visuel. Nous allons lui donner un vrai comportement sans casser les filtres, les routes ou le design.",
          visual: "site-favorite-before",
        },

        {
          type: "observe",
          title: "Le comportement que nous allons construire",
          text:
            "L'utilisateur doit comprendre immédiatement qu'une action a été enregistrée.",
          result: `♡
pas encore favori

↓ clic

♥
favori enregistré

↓ actualisation de la page

♥
le choix est toujours présent`,
        },

        {
          type: "concept",
          eyebrow: "UNE NOUVELLE NOTION",
          title: "localStorage permet au navigateur de conserver une petite information.",
          text:
            "Nous allons enregistrer uniquement les identifiants des logements favoris dans le navigateur. Pour l'instant, cela suffit : aucun compte utilisateur ni base de données ne sont nécessaires. Plus tard, une vraie application connectée pourra stocker les favoris côté serveur.",
        },

        // --------------------------------------------------
        // A — CREATE FAVORITE BUTTON
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Créez components/FavoriteButton.tsx.",
          text:
            "Nous allons isoler toute la logique du favori dans son propre composant afin de pouvoir le réutiliser sur les cartes et sur les fiches.",
          actions: [
            "Dans VS Code, ouvrez le dossier components.",
            "Faites clic droit sur components.",
            "Cliquez sur New File.",
            "Tapez exactement : FavoriteButton.tsx",
            "Appuyez sur Entrée.",
            "Le nouveau fichier vide doit s'ouvrir.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "Votre dossier components doit maintenant contenir trois fichiers.",
          text:
            "Header.tsx, PropertyCard.tsx et le nouveau FavoriteButton.tsx.",
          visual: "vscode-favorite-button",
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/FAVORITEBUTTON.TSX",
          title: "Collez tout ce composant dans le nouveau fichier.",
          text:
            "Ne cherchez pas à mémoriser toute la logique. Nous allons tester son comportement juste après.",
          code: `"use client";

import { useEffect, useState } from "react";

type FavoriteButtonProps = {
  id: number;
  variant?: "icon" | "full";
};

const STORAGE_KEY = "propertymatch-favorites";

export default function FavoriteButton({
  id,
  variant = "icon",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    const favorites = JSON.parse(stored) as number[];
    setIsFavorite(favorites.includes(id));
  }, [id]);

  function toggleFavorite() {
    const stored = localStorage.getItem(STORAGE_KEY);

    const favorites = stored
      ? (JSON.parse(stored) as number[])
      : [];

    const nextFavorites = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextFavorites)
    );

    setIsFavorite(nextFavorites.includes(id));
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggleFavorite}
        className={
          "mt-3 w-full rounded-2xl border px-5 py-4 text-sm font-black transition " +
          (isFavorite
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-200 bg-white text-slate-950 hover:bg-slate-50")
        }
      >
        {isFavorite
          ? "♥ Retirer des favoris"
          : "♡ Ajouter aux favoris"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={
        isFavorite
          ? "Retirer des favoris"
          : "Ajouter aux favoris"
      }
      className={
        "flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-sm backdrop-blur transition hover:scale-105 " +
        (isFavorite
          ? "bg-slate-950 text-white"
          : "bg-white/95 text-slate-950")
      }
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez FavoriteButton.tsx.",
          text:
            "Le site ne change pas encore : nous avons créé le bouton, mais aucune carte ne l'utilise pour l'instant.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Restez dans VS Code.",
              "Ouvrez ensuite PropertyCard.tsx.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Restez dans VS Code.",
              "Ouvrez ensuite PropertyCard.tsx.",
            ],
          },
        },

        {
          type: "concept",
          eyebrow: "JUSTE CE QU'IL FAUT COMPRENDRE",
          title: "Le bouton possède deux états : favori ou non favori.",
          text:
            "isFavorite vaut false ou true. Lorsque l'utilisateur clique, toggleFavorite ajoute ou retire l'id du logement dans localStorage, puis le visuel du bouton se met à jour.",
          items: [
            {
              title: "false",
              text: "Le logement n'est pas dans les favoris : ♡.",
            },
            {
              title: "true",
              text: "Le logement est favori : ♥.",
            },
            {
              title: "localStorage",
              text: "Conserve ici la liste des ids dans le navigateur.",
            },
          ],
        },

        // --------------------------------------------------
        // B — PROPERTY CARD
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Remplaçons maintenant le faux cœur de PropertyCard.",
          text:
            "Nous allons importer FavoriteButton et lui transmettre l'id du logement.",
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Le changement se fait dans components/PropertyCard.tsx.",
          text:
            "Ne modifiez pas app/page.tsx pour cette étape.",
          visual: "vscode-propertycard-favorite",
        },

        {
          type: "action",
          title: "Ouvrez PropertyCard.tsx et remplacez tout son contenu.",
          text:
            "La version ci-dessous reprend le design premium et connecte le nouveau bouton.",
          actions: [
            "Cliquez sur components/PropertyCard.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Copiez ensuite le fichier complet ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/PROPERTYCARD.TSX",
          title: "Collez cette version avec favoris.",
          text:
            "L'id est désormais utilisé à la fois pour la route Voir le bien et pour FavoriteButton.",
          code: `import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

type PropertyCardProps = {
  id: number;
  quartier: string;
  titre: string;
  type: string;
  description: string;
  prix: number;
  chambres: number;
  surface: number;
  balcon: boolean;
  score: number;
  image: string;
};

export default function PropertyCard({
  id,
  quartier,
  titre,
  type,
  description,
  prix,
  chambres,
  surface,
  balcon,
  score,
  image,
}: PropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          src={image}
          alt={titre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-2 text-[11px] font-black shadow-sm backdrop-blur">
            {type}
          </span>

          <FavoriteButton id={id} />
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white shadow-lg">
            {score}% compatible
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {quartier}
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-tight">
          {titre}
        </h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            ◫ {chambres} chambre(s)
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            ↔ {surface} m²
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            {balcon ? "◇ Balcon" : "Sans balcon"}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              Loyer mensuel
            </p>

            <p className="mt-1 text-2xl font-black">
              {prix.toLocaleString("fr-FR")} €
            </p>
          </div>

          <Link
            href={"/biens/" + id}
            className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Voir le bien
          </Link>
        </div>
      </div>
    </article>
  );
}`,
        },

        {
          type: "os-guide",
          eyebrow: "PREMIER TEST",
          title: "Sauvegardez puis cliquez sur un cœur.",
          text:
            "C'est le premier moment où le favori devient réellement fonctionnel.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Descendez jusqu'aux logements.",
              "Cliquez sur le cœur du premier logement.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Descendez jusqu'aux logements.",
              "Cliquez sur le cœur du premier logement.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT ATTENDU",
          title: "Le cœur doit devenir plein et sombre.",
          text:
            "Le changement doit être instantané : ♡ devient ♥. Cliquez une deuxième fois et il doit revenir à son état initial.",
          visual: "site-favorite-clicked",
        },

        {
          type: "action",
          eyebrow: "TEST DE PERSISTANCE",
          title: "Ajoutez un favori puis rechargez complètement la page.",
          text:
            "Nous allons vérifier que localStorage fait bien son travail.",
          actions: [
            "Cliquez sur le cœur d'un logement pour le rendre favori.",
            "Notez lequel vous avez choisi.",
            "Rechargez la page avec ⌘ + R sur Mac ou Ctrl + R sur Windows.",
            "Revenez jusqu'aux logements.",
            "Le cœur choisi doit toujours être plein.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "APRÈS RECHARGEMENT",
          title: "Le navigateur doit se souvenir du favori.",
          text:
            "Si le cœur reste actif après le rechargement, votre stockage local fonctionne.",
          visual: "site-favorite-persist",
        },

        // --------------------------------------------------
        // C — DETAIL PAGE
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Utilisons le même bouton sur la fiche détaillée.",
          text:
            "Le composant FavoriteButton est réutilisable. Nous allons lui demander une version plus large avec du texte.",
        },

        {
          type: "action",
          title: "Ouvrez app/biens/[id]/page.tsx.",
          text:
            "Nous allons ajouter un import et remplacer uniquement le faux bouton favori.",
          actions: [
            "Dans l'Explorer, ouvrez app → biens → [id].",
            "Cliquez sur page.tsx.",
            "Repérez les imports tout en haut.",
          ],
        },

        {
          type: "code",
          eyebrow: "IMPORT",
          title: "Ajoutez FavoriteButton avec les autres imports.",
          text:
            "Placez cette ligne en haut du fichier.",
          code: `import FavoriteButton from "@/components/FavoriteButton";`,
        },

        {
          type: "action",
          title: "Repérez le bouton « ♡ Ajouter aux favoris » dans la carte de prix.",
          text:
            "Supprimez uniquement ce bouton complet, puis remplacez-le par FavoriteButton.",
          actions: [
            "Descendez jusqu'au bloc <aside> de la fiche.",
            "Repérez le deuxième <button> qui contient ♡ Ajouter aux favoris.",
            "Sélectionnez ce bouton depuis <button jusqu'à </button>.",
            "Supprimez-le.",
          ],
        },

        {
          type: "code",
          eyebrow: "REMPLACEMENT",
          title: "Collez cette ligne à la place du bouton supprimé.",
          text:
            "variant=\"full\" demande la version large du composant.",
          code: `<FavoriteButton
  id={logement.id}
  variant="full"
/>`,
        },

        {
          type: "visual-guide",
          eyebrow: "EMPLACEMENT",
          title: "Le composant doit être placé sous le bouton de contact.",
          text:
            "Il utilise automatiquement l'id du logement actuellement ouvert.",
          visual: "vscode-detail-favorite",
        },

        {
          type: "os-guide",
          title: "Sauvegardez et ouvrez une fiche.",
          text:
            "Testez par exemple le premier logement.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000/biens/1.",
              "Regardez la carte de prix à droite.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000/biens/1.",
              "Regardez la carte de prix à droite.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "FICHE DÉTAILLÉE",
          title: "Le favori fonctionne maintenant également sur la fiche.",
          text:
            "Si le logement était déjà favori depuis la page d'accueil, la fiche doit retrouver le même état grâce à son id et à localStorage.",
          visual: "site-favorite-detail",
        },

        {
          type: "action",
          eyebrow: "TEST CROISÉ",
          title: "Vérifiez que la carte et la fiche utilisent le même favori.",
          text:
            "C'est important : nous ne voulons pas deux systèmes différents.",
          actions: [
            "Sur /biens/1, ajoutez le logement aux favoris.",
            "Cliquez sur Retour aux logements.",
            "Descendez jusqu'au premier logement.",
            "Son cœur doit être actif.",
            "Retirez-le depuis la carte.",
            "Rouvrez la fiche.",
            "Le bouton doit à nouveau indiquer Ajouter aux favoris.",
          ],
        },

        // --------------------------------------------------
        // D — WHAT IS STORED
        // --------------------------------------------------

        {
          type: "concept",
          eyebrow: "CE QUI EST RÉELLEMENT ENREGISTRÉ",
          title: "Nous ne sauvegardons pas toutes les données du logement.",
          text:
            "localStorage contient simplement une liste d'identifiants, par exemple [1, 4]. Comme les vraies informations du logement sont déjà dans data/logements.ts, il suffit de savoir quels ids l'utilisateur a choisis.",
          items: [
            {
              title: "[1, 4]",
              text: "Le logement 1 et le logement 4 sont favoris.",
            },
            {
              title: "data/logements.ts",
              text: "Contient toujours les vraies informations des logements.",
            },
            {
              title: "FavoriteButton",
              text: "Lit et modifie seulement la liste d'ids favoris.",
            },
          ],
        },

        {
          type: "warning",
          title: "Ces favoris sont liés à ce navigateur.",
          text:
            "Si vous ouvrez PropertyMatch sur un autre ordinateur ou si les données du navigateur sont effacées, ces favoris locaux disparaîtront. C'est une limite volontaire de cette étape. Une version avec comptes utilisateurs et base de données sera une évolution plus avancée.",
        },

        // --------------------------------------------------
        // E — FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch possède maintenant sa première donnée utilisateur persistante.",
          text:
            "Pour la première fois, le site se souvient d'une action effectuée par le visiteur après un rechargement de page.",
          visual: "site-favorite-final",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE ÉTAPE",
          title: "Nous allons maintenant améliorer le cœur même de PropertyMatch : son score de compatibilité.",
          text:
            "Jusqu'ici, les scores 92%, 84%, 79% et 87% sont écrits dans nos données. La prochaine étape sera de les calculer réellement à partir des critères choisis par l'utilisateur.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 11",
          title: "Testez vraiment les favoris avant de continuer.",
          text:
            "Vous devez pouvoir ajouter, retirer et retrouver un favori après un rechargement.",
          items: [
            "J'ai créé components/FavoriteButton.tsx.",
            "Le cœur de chaque PropertyCard est maintenant fonctionnel.",
            "Cliquer une fois transforme ♡ en ♥.",
            "Cliquer une deuxième fois retire le favori.",
            "Le favori reste actif après un rechargement complet.",
            "La fiche détaillée utilise également FavoriteButton.",
            "Le favori est cohérent entre la carte et la fiche.",
            "Je comprends que localStorage conserve ici une liste d'ids.",
            "Les filtres fonctionnent toujours.",
            "Les routes /biens/[id] fonctionnent toujours.",
            "PropertyMatch fonctionne toujours sur localhost.",
          ],
        },
      ];

    // ====================================================
    // 12 — MOTEUR DE MATCHING
    // ====================================================

    case "12":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire calculer le score de compatibilité par PropertyMatch.",
          text:
            "Jusqu'ici, les pourcentages affichés sur les logements sont écrits à la main dans data/logements.ts. Nous allons maintenant construire le premier vrai moteur de PropertyMatch : le score dépendra du budget, du nombre de chambres et du balcon choisis par l'utilisateur.",
        },

        {
          type: "visual-guide",
          eyebrow: "AVANT",
          title: "Le problème : 92%, 84%, 79% et 87% sont actuellement fixes.",
          text:
            "Même si l'utilisateur change ses critères, ces nombres ne changent pas. Ce n'est donc pas encore un vrai matching.",
          visual: "matching-before",
        },

        {
          type: "observe",
          title: "Ce que nous voulons obtenir",
          text:
            "Le même logement pourra recevoir un score différent selon la recherche.",
          result: `RECHERCHE A
Budget : 2 300 €
Chambres : 2
Balcon : oui

Appartement lumineux
→ 100% compatible

RECHERCHE B
Budget : 1 900 €
Chambres : 3
Balcon : oui

Appartement lumineux
→ score plus faible`,
        },

        {
          type: "concept",
          eyebrow: "LE PRINCIPE",
          title: "Un score est simplement un calcul basé sur plusieurs critères.",
          text:
            "Nous allons attribuer des points lorsque le logement respecte les choix de l'utilisateur. Le but n'est pas de créer une intelligence artificielle complexe : nous construisons d'abord une logique claire, testable et compréhensible.",
          items: [
            {
              title: "Budget",
              text: "Le logement gagne une partie des points s'il respecte le budget.",
            },
            {
              title: "Chambres",
              text: "Il gagne des points s'il possède assez de chambres.",
            },
            {
              title: "Balcon",
              text: "Si l'utilisateur demande un balcon, le logement gagne les points correspondants s'il en possède un.",
            },
          ],
        },

        // --------------------------------------------------
        // A — REMOVE FIXED SCORE
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Commencez dans data/logements.ts.",
          text:
            "Nous allons supprimer les anciens scores fixes afin qu'ils ne puissent plus tromper l'utilisateur.",
          actions: [
            "Dans VS Code, ouvrez le dossier data.",
            "Cliquez sur logements.ts.",
            "Dans chaque logement, repérez la ligne score: ...",
            "Supprimez score: 92, score: 84, score: 79 et score: 87.",
            "Ne supprimez aucune autre propriété.",
          ],
        },

        {
          type: "warning",
          title: "Des erreurs rouges peuvent apparaître juste après.",
          text:
            "C'est normal : PropertyCard reçoit encore logement.score dans app/page.tsx. Nous allons corriger cela dans quelques instants en calculant nous-mêmes le score.",
        },

        // --------------------------------------------------
        // B — FORM CRITERIA
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE B",
          title: "Ouvrez maintenant app/page.tsx.",
          text:
            "C'est ici que se trouvent déjà les états du formulaire et le filtrage créé dans les leçons précédentes.",
          actions: [
            "Dans l'Explorer, ouvrez app.",
            "Cliquez sur page.tsx.",
            "Repérez export default function Home().",
            "Repérez ensuite vos useState liés au budget, aux chambres et au balcon.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "REPÈRE VISUEL",
          title: "Le moteur part des critères déjà saisis dans le formulaire.",
          text:
            "Nous ne créons pas une deuxième recherche. Nous réutilisons le budget, les chambres et le balcon de PropertyMatch.",
          visual: "matching-form",
        },

        {
          type: "concept",
          title: "Nous allons calculer un score pour chaque logement.",
          text:
            "La fonction recevra un logement, commencera à 0, ajoutera des points selon les critères puis retournera un nombre entre 0 et 100.",
        },

        {
          type: "code",
          eyebrow: "DANS HOME()",
          title: "Ajoutez cette fonction avant logementsFiltres.",
          text:
            "Placez-la après vos useState et avant la ligne qui crée la liste filtrée. Nous utilisons ici les valeurs du formulaire déjà présentes dans votre page.",
          code: `function calculerScore(logement: {
  prix: number;
  chambres: number;
  balcon: boolean;
}) {
  let score = 0;

  // Budget : 50 points
  if (logement.prix <= budget) {
    score += 50;
  } else if (logement.prix <= budget + 200) {
    score += 30;
  } else if (logement.prix <= budget + 400) {
    score += 15;
  }

  // Chambres : 30 points
  if (logement.chambres >= chambres) {
    score += 30;
  } else if (logement.chambres === chambres - 1) {
    score += 15;
  }

  // Balcon : 20 points
  if (!balcon || logement.balcon) {
    score += 20;
  }

  return score;
}`,
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "La fonction doit être dans Home(), mais en dehors du JSX.",
          text:
            "Elle doit apparaître avant le return (...) de la page. Ne la collez pas au milieu des balises HTML/JSX.",
          visual: "matching-code",
        },

        {
          type: "concept",
          eyebrow: "LECTURE DU CALCUL",
          title: "Pourquoi 50 + 30 + 20 ?",
          text:
            "Nous avons décidé que le budget est le critère le plus important : il peut rapporter 50 points. Les chambres peuvent en rapporter 30 et le balcon 20. Le maximum est donc exactement 100.",
          items: [
            {
              title: "50 points",
              text: "Budget respecté.",
            },
            {
              title: "30 points",
              text: "Nombre de chambres suffisant.",
            },
            {
              title: "20 points",
              text: "Balcon compatible avec la demande.",
            },
          ],
        },

        {
          type: "concept",
          title: "Le score peut aussi être partiel.",
          text:
            "Un logement légèrement au-dessus du budget reçoit encore 30 ou 15 points au lieu de tomber immédiatement à zéro. Même principe pour un logement auquel il manque seulement une chambre. Cela produit un classement plus utile qu'un simple oui/non.",
        },

        // --------------------------------------------------
        // C — CALCULATE + SORT
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Ajoutons le score calculé à chaque logement.",
          text:
            "Nous allons créer une nouvelle liste à partir des logements filtrés. Chaque objet conservera ses données et recevra en plus un score calculé.",
        },

        {
          type: "code",
          eyebrow: "APRÈS LOGEMENTSFILTRES",
          title: "Ajoutez logementsAvecScore.",
          text:
            "Placez ce bloc après la création de logementsFiltres et avant return (...).",
          code: `const logementsAvecScore = logementsFiltres
  .map((logement) => ({
    ...logement,
    score: calculerScore(logement),
  }))
  .sort((a, b) => b.score - a.score);`,
        },

        {
          type: "concept",
          title: "map ajoute le score, sort classe les résultats.",
          text:
            "map parcourt chaque logement et crée une version contenant score. Ensuite sort place le score le plus élevé en premier. Le meilleur match remonte donc automatiquement en haut de la liste.",
        },

        {
          type: "observe",
          title: "Le nouveau trajet des données",
          text:
            "C'est le cœur de notre moteur.",
          result: `logements
   ↓
filtres
   ↓
logementsFiltres
   ↓
calculerScore(logement)
   ↓
score ajouté à chaque logement
   ↓
tri du meilleur au moins bon
   ↓
affichage des PropertyCard`,
        },

        // --------------------------------------------------
        // D — DISPLAY NEW LIST
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE D",
          title: "Faites afficher logementsAvecScore à la place de logementsFiltres.",
          text:
            "Descendez dans le JSX jusqu'à la zone où les cartes sont générées.",
          actions: [
            "Cherchez logementsFiltres.map.",
            "Ne modifiez pas PropertyCard.",
            "Remplacez uniquement logementsFiltres.map par logementsAvecScore.map.",
            "Laissez le reste du bloc identique.",
          ],
        },

        {
          type: "code",
          eyebrow: "VÉRIFICATION",
          title: "Le bloc d'affichage doit maintenant commencer comme ceci.",
          text:
            "PropertyCard reçoit bien logement.score, mais ce score vient maintenant du calcul.",
          code: `{logementsAvecScore.map((logement) => (
  <PropertyCard
    key={logement.id}
    id={logement.id}
    quartier={logement.quartier}
    titre={logement.titre}
    type={logement.type}
    description={logement.description}
    prix={logement.prix}
    chambres={logement.chambres}
    surface={logement.surface}
    balcon={logement.balcon}
    score={logement.score}
    image={logement.image}
  />
))}`,
        },

        {
          type: "os-guide",
          eyebrow: "PREMIER TEST",
          title: "Sauvegardez puis retournez sur PropertyMatch.",
          text:
            "Le site doit compiler et les cartes doivent toujours apparaître.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Descendez jusqu'aux résultats.",
              "Observez les nouveaux pourcentages.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Descendez jusqu'aux résultats.",
              "Observez les nouveaux pourcentages.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT",
          title: "Les cartes utilisent maintenant un score calculé.",
          text:
            "Le classement peut également changer : le logement qui correspond le mieux aux critères doit apparaître avant les autres.",
          visual: "matching-results",
        },

        // --------------------------------------------------
        // E — TEST BUDGET
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST 1 — BUDGET",
          title: "Faites varier fortement le budget.",
          text:
            "Nous voulons voir le moteur réagir, pas simplement constater que la page compile.",
          actions: [
            "Choisissez un budget qui accepte plusieurs logements.",
            "Observez les scores et leur ordre.",
            "Diminuez ensuite le budget.",
            "Les logements trop chers doivent perdre des points ou disparaître selon votre filtrage actuel.",
            "Remontez le budget et observez à nouveau.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "LE SCORE RÉAGIT",
          title: "Le budget influence maintenant réellement le matching.",
          text:
            "Les valeurs affichées ne sont plus décoratives : elles dépendent du choix effectué dans le formulaire.",
          visual: "matching-budget",
        },

        // --------------------------------------------------
        // F — TEST BEDROOMS
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST 2 — CHAMBRES",
          title: "Changez le nombre de chambres demandé.",
          text:
            "Un logement qui possède suffisamment de chambres doit recevoir davantage de points.",
          actions: [
            "Choisissez 1 chambre et observez les scores.",
            "Passez ensuite à 2 chambres.",
            "Puis essayez 3 chambres.",
            "Regardez quels logements remontent ou descendent dans le classement.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "CLASSEMENT",
          title: "Le meilleur résultat peut changer selon le besoin.",
          text:
            "C'est précisément le rôle d'un moteur de matching : le meilleur logement n'est pas universel, il dépend des critères de la recherche.",
          visual: "matching-bedroom",
        },

        // --------------------------------------------------
        // G — TEST BALCON
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST 3 — BALCON",
          title: "Activez puis désactivez le critère balcon.",
          text:
            "Lorsque le balcon est demandé, les logements qui en possèdent un doivent obtenir les 20 points correspondants.",
          actions: [
            "Effectuez une recherche sans exiger de balcon.",
            "Notez les scores.",
            "Activez ensuite le balcon.",
            "Comparez les scores et l'ordre des résultats.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "CRITÈRE SUPPLÉMENTAIRE",
          title: "Le score combine maintenant plusieurs informations.",
          text:
            "Budget, chambres et balcon participent ensemble au résultat final.",
          visual: "matching-balcony",
        },

        // --------------------------------------------------
        // H — IMPORTANT FIX FOR DETAIL PAGE
        // --------------------------------------------------

        {
          type: "warning",
          eyebrow: "UN DÉTAIL IMPORTANT",
          title: "La fiche logement ne doit plus lire logement.score.",
          text:
            "Nous avons supprimé score de data/logements.ts. Si votre fiche détaillée affiche encore logement.score, elle doit être adaptée. Le score dépend maintenant de la recherche faite sur la page d'accueil et n'est plus une propriété permanente du logement.",
        },

        {
          type: "action",
          title: "Ouvrez app/biens/[id]/page.tsx et retirez les anciennes références au score.",
          text:
            "Pour cette étape, nous gardons la fiche simple : elle affiche les caractéristiques du bien sans inventer un score fixe.",
          actions: [
            "Ouvrez app → biens → [id] → page.tsx.",
            "Cherchez logement.score.",
            "Supprimez le badge qui affiche {logement.score}% compatible.",
            "Cherchez aussi la phrase qui contient {logement.score}% dans la carte de prix.",
            "Remplacez cette phrase par le texte ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "TEXTE DE REMPLACEMENT",
          title: "Utilisez ce texte dans la carte de prix.",
          text:
            "La fiche ne prétend ainsi plus connaître un score qui dépend d'une recherche précédente.",
          code: `<p className="mt-3 text-sm leading-6 text-slate-500">
  Consultez les caractéristiques du logement puis contactez-nous
  si ce bien correspond à votre recherche.
</p>`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez puis testez une fiche.",
          text:
            "La navigation Voir le bien doit continuer à fonctionner normalement.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Retournez sur localhost:3000.",
              "Cliquez sur Voir le bien.",
              "Vérifiez que la fiche s'affiche sans erreur.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Retournez sur localhost:3000.",
              "Cliquez sur Voir le bien.",
              "Vérifiez que la fiche s'affiche sans erreur.",
            ],
          },
        },

        // --------------------------------------------------
        // I — FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch possède maintenant un vrai moteur de recommandation déterministe.",
          text:
            "L'utilisateur choisit ses critères, le code évalue chaque logement, attribue un score et classe les résultats. Le site commence réellement à porter son nom : PropertyMatch.",
          visual: "matching-final",
        },

        {
          type: "concept",
          eyebrow: "À RETENIR",
          title: "Ce n'est pas encore de l'IA — et c'est volontaire.",
          text:
            "Notre moteur suit des règles que nous avons écrites nous-mêmes. C'est un algorithme de scoring. Plus tard, une application pourrait utiliser des données historiques ou un modèle d'apprentissage automatique, mais il faut d'abord savoir construire et tester une logique fiable.",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE ÉTAPE",
          title: "Le moteur fonctionne. Nous allons maintenant améliorer le parcours complet du site.",
          text:
            "Dans la prochaine leçon, nous pourrons travailler la navigation et les différentes zones de PropertyMatch pour que l'application ressemble de plus en plus à un vrai produit complet.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 12",
          title: "Vérifiez le moteur avant de continuer.",
          text:
            "Ne validez pas uniquement parce que le site s'affiche : changez réellement plusieurs critères.",
          items: [
            "J'ai supprimé les scores fixes de data/logements.ts.",
            "J'ai créé calculerScore dans app/page.tsx.",
            "Le budget peut rapporter jusqu'à 50 points.",
            "Les chambres peuvent rapporter jusqu'à 30 points.",
            "Le balcon peut rapporter jusqu'à 20 points.",
            "Le score maximal est 100.",
            "J'ai créé logementsAvecScore avec map.",
            "Les résultats sont triés avec sort.",
            "PropertyCard reçoit maintenant le score calculé.",
            "Changer le budget peut modifier les scores.",
            "Changer les chambres peut modifier les scores.",
            "Changer le balcon peut modifier les scores.",
            "La fiche détaillée ne dépend plus d'un score fixe.",
            "Les favoris fonctionnent toujours.",
            "Les routes fonctionnent toujours.",
            "PropertyMatch fonctionne toujours sur localhost.",
          ],
        },
      ];

    // ====================================================
    // 13 — NAVIGATION COMPLÈTE
    // ====================================================

    case "13":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Transformer PropertyMatch en application avec plusieurs vraies pages.",
          text:
            "Nous avons déjà une page d'accueil et des fiches logements. Dans cette leçon, nous allons construire une vraie page Favoris, connecter la navigation du header et permettre à l'utilisateur de circuler proprement entre les différentes zones du site.",
        },

        {
          type: "visual-guide",
          eyebrow: "POINT DE DÉPART",
          title: "Le site fonctionne, mais sa navigation est encore incomplète.",
          text:
            "Le visiteur peut ouvrir une fiche avec Voir le bien, mais le header n'est pas encore un véritable menu d'application.",
          visual: "nav-before",
        },

        {
          type: "observe",
          title: "Le parcours que nous allons obtenir",
          text:
            "À la fin de la leçon, plusieurs URLs auront un rôle clair.",
          result: `/
Accueil + recherche

/favoris
Logements enregistrés

/biens/1
Fiche du logement 1

/biens/2
Fiche du logement 2

Le header permet de circuler
entre Accueil et Favoris.`,
        },

        {
          type: "concept",
          eyebrow: "NOUVELLE NOTION",
          title: "Une application web peut être composée de plusieurs routes.",
          text:
            "Avec Next.js, un dossier placé dans app peut devenir une adresse du site. Nous avons déjà utilisé ce principe avec app/biens/[id]. Nous allons maintenant créer app/favoris/page.tsx pour obtenir l'URL /favoris.",
        },

        // --------------------------------------------------
        // A — HEADER
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE A",
          title: "Commençons par rendre le Header réellement navigable.",
          text:
            "Ouvrez le composant Header que vous avez créé précédemment.",
          actions: [
            "Dans l'Explorer de VS Code, ouvrez components.",
            "Cliquez sur Header.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez le contenu du fichier.",
            "Nous allons le remplacer par une version complète.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/HEADER.TSX",
          title: "Collez ce Header avec de vrais liens.",
          text:
            "Le logo et Accueil renvoient vers /. Favoris ouvre la nouvelle route /favoris que nous allons créer juste après.",
          code: `import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-xl font-black tracking-tight"
        >
          PropertyMatch
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Accueil
          </Link>

          <Link
            href="/favoris"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Favoris
          </Link>
        </nav>
      </div>
    </header>
  );
}`,
        },

        {
          type: "visual-guide",
          eyebrow: "VS CODE",
          title: "Header.tsx contient maintenant deux vrais liens Next.js.",
          text:
            "Nous utilisons Link plutôt qu'une simple balise décorative afin que la navigation fonctionne réellement.",
          visual: "nav-header-code",
        },

        {
          type: "os-guide",
          title: "Sauvegardez puis regardez le header de la page d'accueil.",
          text:
            "Le design reste simple, mais Accueil et Favoris sont désormais de vrais liens.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez localhost:3000.",
              "Regardez le haut de la page.",
              "Ne cliquez pas encore sur Favoris.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez localhost:3000.",
              "Regardez le haut de la page.",
              "Ne cliquez pas encore sur Favoris.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "HEADER",
          title: "Le menu principal doit maintenant afficher Accueil et Favoris.",
          text:
            "Nous allons créer la destination de Favoris juste après.",
          visual: "nav-home",
        },

        // --------------------------------------------------
        // B — FAVORITES PAGE
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE B",
          title: "Créez maintenant la route /favoris.",
          text:
            "Comme pour biens, nous allons créer un nouveau dossier dans app.",
          actions: [
            "Dans l'Explorer, faites clic droit sur app.",
            "Cliquez sur New Folder.",
            "Tapez exactement : favoris",
            "Appuyez sur Entrée.",
            "Faites clic droit sur le nouveau dossier favoris.",
            "Cliquez sur New File.",
            "Tapez exactement : page.tsx",
            "Appuyez sur Entrée.",
          ],
        },

        {
          type: "observe",
          title: "Votre arborescence doit maintenant contenir cette nouvelle page.",
          text:
            "Vérifiez bien son emplacement.",
          result: `app/
├── page.tsx
├── favoris/
│   └── page.tsx      ← NOUVEAU
└── biens/
    └── [id]/
        └── page.tsx

components/
├── Header.tsx
├── PropertyCard.tsx
└── FavoriteButton.tsx

data/
└── logements.ts`,
        },

        {
          type: "concept",
          title: "La page Favoris doit lire localStorage.",
          text:
            "Nos favoris sont enregistrés dans le navigateur depuis la leçon 11. La nouvelle page devra donc récupérer cette liste d'identifiants, garder uniquement les logements correspondants puis les afficher.",
        },

        {
          type: "code",
          eyebrow: "APP/FAVORIS/PAGE.TSX",
          title: "Collez cette première version complète de la page Favoris.",
          text:
            "Cette page utilise useEffect et localStorage : elle commence donc par \"use client\".",
          code: `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { logements } from "@/data/logements";

const STORAGE_KEY = "propertymatch-favorites";

export default function FavorisPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setFavoriteIds(JSON.parse(stored) as number[]);
    }

    setLoaded(true);
  }, []);

  const logementsFavoris = logements.filter((logement) =>
    favoriteIds.includes(logement.id)
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <Header />

        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-bold text-slate-400">
            Chargement de vos favoris...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Votre sélection
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Vos logements favoris
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-500">
            Retrouvez ici les biens que vous avez enregistrés
            pendant votre recherche.
          </p>
        </div>

        {logementsFavoris.length === 0 ? (
          <div className="mt-10 rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              ♡
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Aucun favori pour le moment
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Revenez à la recherche puis cliquez sur le cœur
              d'un logement pour l'ajouter ici.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white"
            >
              Découvrir les logements
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                {logementsFavoris.length} logement(s) enregistré(s)
              </p>

              <Link
                href="/"
                className="text-sm font-black text-slate-950"
              >
                + Ajouter d'autres logements
              </Link>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {logementsFavoris.map((logement) => (
                <PropertyCard
                  key={logement.id}
                  id={logement.id}
                  quartier={logement.quartier}
                  titre={logement.titre}
                  type={logement.type}
                  description={logement.description}
                  prix={logement.prix}
                  chambres={logement.chambres}
                  surface={logement.surface}
                  balcon={logement.balcon}
                  score={100}
                  image={logement.image}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}`,
        },

        {
          type: "warning",
          title: "Pourquoi score={100} ici ?",
          text:
            "PropertyCard demande encore une propriété score pour afficher son badge. Mais la page Favoris n'a pas accès aux critères de recherche utilisés sur l'accueil. Nous mettons temporairement 100 uniquement pour que la carte reste compatible. Nous corrigerons proprement ce point lorsque nous améliorerons encore l'architecture du produit.",
        },

        {
          type: "os-guide",
          eyebrow: "PREMIER TEST",
          title: "Sauvegardez puis ouvrez directement /favoris.",
          text:
            "Commencez par tester la page sans ajouter de nouveau favori.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Dans le navigateur, tapez localhost:3000/favoris.",
              "Appuyez sur Entrée.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Dans le navigateur, tapez localhost:3000/favoris.",
              "Appuyez sur Entrée.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "CAS 1",
          title: "Sans favori, l'utilisateur obtient un vrai état vide.",
          text:
            "Une application de qualité ne laisse pas simplement une grande zone blanche. Elle explique ce qui se passe et propose une prochaine action.",
          visual: "nav-favorites-empty",
        },

        // --------------------------------------------------
        // C — TEST WITH FAVORITES
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE C",
          title: "Ajoutez maintenant deux logements aux favoris.",
          text:
            "Nous allons vérifier que la nouvelle page utilise réellement les choix enregistrés pendant la leçon 11.",
          actions: [
            "Cliquez sur Accueil dans le header.",
            "Descendez jusqu'aux logements.",
            "Ajoutez deux logements avec leur bouton cœur.",
            "Remontez en haut de la page.",
            "Cliquez sur Favoris dans le header.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "CAS 2",
          title: "La page doit afficher uniquement les logements enregistrés.",
          text:
            "Les données viennent toujours de data/logements.ts ; localStorage sert uniquement à savoir quels ids garder.",
          visual: "nav-favorites-filled",
        },

        {
          type: "concept",
          title: "filter construit la sélection des favoris.",
          text:
            "favoriteIds contient par exemple [1, 4]. logements.filter(...) parcourt alors les logements et conserve uniquement ceux dont l'id apparaît dans cette liste.",
        },

        {
          type: "observe",
          title: "Le flux de la page Favoris",
          text:
            "Deux sources se rencontrent pour construire l'écran.",
          result: `localStorage
[1, 4]
   ↓
favoriteIds

        +

data/logements.ts
tous les logements
   ↓

filter(...)
   ↓
logementsFavoris
   ↓
PropertyCard
   ↓
page /favoris`,
        },

        // --------------------------------------------------
        // D — REMOVE FAVORITE LIVE ISSUE
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Il reste un petit comportement à améliorer.",
          text:
            "Si vous retirez un cœur directement depuis /favoris, localStorage est bien modifié, mais la page ne sait pas encore qu'elle doit recalculer sa liste immédiatement. Nous allons connecter les composants avec un petit événement personnalisé.",
        },

        {
          type: "action",
          title: "Retournez dans components/FavoriteButton.tsx.",
          text:
            "Nous allons ajouter une seule instruction après localStorage.setItem(...).",
          actions: [
            "Ouvrez components/FavoriteButton.tsx.",
            "Repérez la fonction toggleFavorite().",
            "Repérez localStorage.setItem(...).",
            "Juste après cette instruction, ajoutez la ligne ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "FAVORITEBUTTON.TSX",
          title: "Ajoutez cet événement après l'enregistrement.",
          text:
            "Il signale au reste de l'application que les favoris viennent de changer.",
          code: `window.dispatchEvent(
  new Event("propertymatch-favorites-changed")
);`,
        },

        {
          type: "action",
          title: "Retournez ensuite dans app/favoris/page.tsx.",
          text:
            "Nous allons remplacer le useEffect actuel par une version qui sait écouter cet événement.",
          actions: [
            "Ouvrez app/favoris/page.tsx.",
            "Repérez le bloc useEffect(() => { ... }, []);",
            "Sélectionnez ce bloc complet.",
            "Remplacez-le par le code suivant.",
          ],
        },

        {
          type: "code",
          eyebrow: "NOUVEAU USEEFFECT",
          title: "Collez cette version.",
          text:
            "La fonction loadFavorites peut être appelée au chargement puis à chaque modification des favoris.",
          code: `useEffect(() => {
  function loadFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);

    setFavoriteIds(
      stored
        ? (JSON.parse(stored) as number[])
        : []
    );

    setLoaded(true);
  }

  loadFavorites();

  window.addEventListener(
    "propertymatch-favorites-changed",
    loadFavorites
  );

  return () => {
    window.removeEventListener(
      "propertymatch-favorites-changed",
      loadFavorites
    );
  };
}, []);`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez les deux fichiers puis testez.",
          text:
            "Cette fois, retirer un favori depuis la page Favoris doit retirer immédiatement sa carte.",
          mac: {
            title: "Mac",
            steps: [
              "Sauvegardez FavoriteButton.tsx avec ⌘ + S.",
              "Sauvegardez favoris/page.tsx avec ⌘ + S.",
              "Ouvrez localhost:3000/favoris.",
              "Cliquez sur le cœur plein d'une carte.",
              "La carte doit disparaître immédiatement.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Sauvegardez FavoriteButton.tsx avec Ctrl + S.",
              "Sauvegardez favoris/page.tsx avec Ctrl + S.",
              "Ouvrez localhost:3000/favoris.",
              "Cliquez sur le cœur plein d'une carte.",
              "La carte doit disparaître immédiatement.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "INTERACTION",
          title: "La page Favoris réagit maintenant sans rechargement.",
          text:
            "Le visiteur retire un logement et l'interface se met immédiatement à jour.",
          visual: "nav-favorites-page",
        },

        // --------------------------------------------------
        // E — DETAIL HEADER
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "Uniformisons aussi la navigation des fiches logements.",
          text:
            "La fiche utilise encore son propre petit header écrit directement dans page.tsx. Nous allons réutiliser Header pour que toutes les pages principales aient la même navigation.",
        },

        {
          type: "action",
          title: "Ouvrez app/biens/[id]/page.tsx.",
          text:
            "Ajoutez Header puis remplacez l'ancien bloc header.",
          actions: [
            "Ouvrez app → biens → [id] → page.tsx.",
            "Ajoutez l'import Header montré ci-dessous.",
            "Repérez le bloc <header>...</header> situé au début du return.",
            "Supprimez ce bloc complet.",
            "Placez <Header /> à sa place.",
          ],
        },

        {
          type: "code",
          eyebrow: "IMPORT",
          title: "Ajoutez Header en haut de la fiche.",
          text:
            "La fiche utilisera ainsi exactement le même composant que l'accueil et Favoris.",
          code: `import Header from "@/components/Header";`,
        },

        {
          type: "code",
          eyebrow: "DANS LE RETURN",
          title: "Remplacez l'ancien header par une seule ligne.",
          text:
            "Placez-la juste après l'ouverture de <main>.",
          code: `<Header />`,
        },

        {
          type: "concept",
          title: "C'est l'intérêt d'un composant réutilisable.",
          text:
            "Si nous modifions plus tard le logo ou le menu dans Header.tsx, l'accueil, Favoris et les fiches profiteront automatiquement de la modification. Nous évitons de maintenir trois headers différents.",
        },

        // --------------------------------------------------
        // F — FULL NAV TEST
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "TEST DU PARCOURS COMPLET",
          title: "Naviguez maintenant comme un vrai utilisateur.",
          text:
            "N'utilisez plus la barre d'adresse pour ce test.",
          actions: [
            "Ouvrez localhost:3000.",
            "Cliquez sur Favoris dans le header.",
            "Cliquez sur Accueil.",
            "Descendez jusqu'aux logements.",
            "Cliquez sur Voir le bien.",
            "Sur la fiche, cliquez sur Favoris.",
            "Depuis Favoris, cliquez sur Voir le bien d'un logement enregistré.",
            "Utilisez ensuite Accueil pour revenir à la recherche.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "PARCOURS UTILISATEUR",
          title: "Les différentes pages de PropertyMatch sont maintenant reliées.",
          text:
            "L'application commence à posséder une vraie architecture de navigation cohérente.",
          visual: "nav-flow",
        },

        // --------------------------------------------------
        // G — FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch n'est plus une simple page : c'est maintenant une petite application multi-pages.",
          text:
            "Accueil, favoris et fiches logements partagent les mêmes données, les mêmes composants et une navigation commune.",
          visual: "nav-final",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE ÉTAPE",
          title: "Nous allons maintenant pousser beaucoup plus loin le responsive.",
          text:
            "Le site s'adapte déjà partiellement aux écrans grâce aux classes Tailwind utilisées jusque-là. La prochaine leçon sera consacrée à une vraie vérification mobile, tablette et desktop afin d'obtenir une interface propre sur toutes les tailles.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 13",
          title: "Vérifiez toute la navigation avant de continuer.",
          text:
            "Testez les liens comme un visiteur normal, sans taper manuellement les URLs.",
          items: [
            "Header.tsx contient de vrais liens Accueil et Favoris.",
            "J'ai créé app/favoris/page.tsx.",
            "/favoris affiche un état vide lorsqu'aucun bien n'est enregistré.",
            "Ajouter des favoris depuis l'accueil les fait apparaître dans /favoris.",
            "La page Favoris utilise data/logements.ts.",
            "Retirer un favori depuis /favoris enlève immédiatement la carte.",
            "FavoriteButton envoie l'événement propertymatch-favorites-changed.",
            "La fiche logement utilise maintenant Header.",
            "Je peux passer d'Accueil à Favoris sans taper l'URL.",
            "Je peux ouvrir une fiche puis revenir vers les autres pages.",
            "Les favoris restent enregistrés après rechargement.",
            "Le moteur de matching de la leçon 12 fonctionne toujours.",
            "PropertyMatch fonctionne toujours sur localhost.",
          ],
        },
      ];

    // ====================================================
    // 14 — REFONTE PREMIUM DE L'ACCUEIL
    // ====================================================

    case "14":
      return [
        {
          type: "text",
          eyebrow: "NOUVELLE ÉTAPE DU PROJET",
          title: "PropertyMatch fonctionne. Maintenant, nous allons lui donner l'apparence d'un vrai produit immobilier premium.",
          text:
            "Les treize premières leçons nous ont permis de construire la logique du site : données, cartes, fiches, favoris, matching et navigation. À partir de maintenant, nous conservons cette base et nous travaillons comme une équipe produit : nous allons transformer progressivement l'interface pour atteindre notre maquette finale.",
        },

        {
          type: "visual-guide",
          eyebrow: "NOTRE CIBLE",
          title: "Voici la direction visuelle que nous allons construire.",
          text:
            "Grand hero immobilier, navigation sobre, recherche intégrée, photos très présentes, typographie forte et beaucoup d'espace. Nous ne construisons pas tout dans cette seule leçon : aujourd'hui, nous refaisons l'accueil.",
          visual: "premium-target",
        },

        {
          type: "concept",
          eyebrow: "IMPORTANT",
          title: "Nous ne recommençons pas le projet.",
          text:
            "Le moteur de matching, les logements, les favoris et les routes que vous avez déjà créés restent utiles. Nous allons surtout modifier la présentation et réorganiser certains éléments.",
        },

        {
          type: "visual-guide",
          eyebrow: "AVANT",
          title: "Notre accueil actuel a déjà la logique. Il lui manque maintenant la direction artistique finale.",
          text:
            "C'est exactement l'intérêt d'une refonte : conserver ce qui fonctionne et améliorer l'expérience visuelle.",
          visual: "premium-before",
        },

        // --------------------------------------------------
        // A — OUVRIR LE BON FICHIER
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE A",
          title: "Ouvrez la page d'accueil de PropertyMatch dans VS Code.",
          text:
            "Attention : nous ne modifions pas la page de la formation. Nous modifions le vrai site PropertyMatch que l'élève construit.",
        },

        {
          type: "action",
          title: "Dans l'Explorer de VS Code, ouvrez app/page.tsx.",
          text:
            "C'est la page affichée lorsque vous ouvrez localhost:3000.",
          actions: [
            "Regardez la colonne Explorer à gauche.",
            "Ouvrez le dossier app s'il est fermé.",
            "Cliquez sur page.tsx directement dans app.",
            "Ne cliquez pas sur app/formation/python/[lesson]/page.tsx : ce fichier appartient à la plateforme de formation.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Le fichier à modifier est app/page.tsx.",
          text:
            "C'est dans ce fichier que nous allons reconstruire l'accueil premium.",
          visual: "premium-vscode-home",
        },

        {
          type: "os-guide",
          title: "Gardez aussi le site ouvert à côté.",
          text:
            "Le plus pratique est d'avoir VS Code et le navigateur visibles afin de contrôler chaque changement.",
          mac: {
            title: "Mac",
            steps: [
              "Dans VS Code, vérifiez que le terminal affiche toujours le serveur Next.js.",
              "Si nécessaire, lancez npm run dev.",
              "Dans Safari ou Chrome, ouvrez http://localhost:3000.",
              "Utilisez ⌘ + Tab pour passer rapidement de VS Code au navigateur.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Dans VS Code, vérifiez que le terminal affiche toujours le serveur Next.js.",
              "Si nécessaire, lancez npm run dev.",
              "Dans Edge ou Chrome, ouvrez http://localhost:3000.",
              "Utilisez Alt + Tab pour passer rapidement de VS Code au navigateur.",
            ],
          },
        },

        // --------------------------------------------------
        // B — HEADER PREMIUM
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Commençons par le Header : il doit immédiatement donner l'impression d'un vrai service.",
          text:
            "Nous allons conserver le composant Header créé précédemment, mais lui donner une navigation plus complète et un bouton d'action.",
        },

        {
          type: "action",
          title: "Ouvrez components/Header.tsx.",
          text:
            "Le Header est séparé de la page d'accueil : nous pouvons donc le modifier une fois et retrouver le même style sur les autres pages.",
          actions: [
            "Dans l'Explorer, ouvrez components.",
            "Cliquez sur Header.tsx.",
            "Sélectionnez tout le contenu du fichier.",
            "Remplacez-le par le code ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/HEADER.TSX",
          title: "Remplacez tout Header.tsx par ce code.",
          text:
            "Les liens À propos et Contact pointeront vers des sections de l'accueil que nous compléterons plus tard.",
          code: `"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link
          href="/"
          className="text-xl font-black tracking-[-0.04em] text-white"
        >
          PropertyMatch
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            Accueil
          </Link>

          <Link
            href="/favoris"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            Favoris
          </Link>

          <a
            href="#apropos"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            À propos
          </a>

          <a
            href="#contact"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            Contact
          </a>
        </nav>

        <Link
          href="/favoris"
          className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-md transition hover:bg-white hover:text-slate-950"
        >
          Mes favoris
        </Link>
      </div>
    </header>
  );
}`,
        },

        {
          type: "os-guide",
          title: "Sauvegardez Header.tsx.",
          text:
            "Ne vous inquiétez pas si le header semble étrange pendant quelques secondes : nous n'avons pas encore créé le hero sombre qui sera placé derrière.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Regardez le terminal : aucune erreur rouge ne doit apparaître.",
              "Retournez dans le navigateur.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Regardez le terminal : aucune erreur rouge ne doit apparaître.",
              "Retournez dans le navigateur.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT VISÉ",
          title: "Le Header va se poser directement au-dessus de la grande photo.",
          text:
            "C'est pour cela que nous utilisons du texte blanc et position:absolute.",
          visual: "premium-header",
        },

        // --------------------------------------------------
        // C — REBUILD HOME PAGE
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Nous allons maintenant reconstruire la partie supérieure de app/page.tsx.",
          text:
            "Cette modification est plus importante. Pour éviter de chercher dix endroits différents, nous allons remplacer la page par une version complète qui conserve le matching et les favoris déjà créés.",
        },

        {
          type: "action",
          title: "Retournez dans app/page.tsx.",
          text:
            "Avant de remplacer le code, vérifiez simplement que vous êtes bien dans le projet PropertyMatch.",
          actions: [
            "Cliquez sur app/page.tsx.",
            "Regardez l'onglet ouvert en haut de VS Code.",
            "Le chemin doit être propertymatch/app/page.tsx.",
            "Sélectionnez tout le fichier.",
            "Supprimez son contenu.",
          ],
        },

        {
          type: "warning",
          title: "Ne collez pas ce code dans la page de la formation.",
          text:
            "Le fichier attendu est app/page.tsx du projet PropertyMatch. Le fichier app/formation/python/[lesson]/page.tsx sert uniquement à afficher cette leçon.",
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — PARTIE 1",
          title: "Commencez par les imports et la logique.",
          text:
            "Collez cette première partie dans le fichier vide.",
          code: `"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { logements } from "@/data/logements";

export default function HomePage() {
  const [ville, setVille] = useState("Paris");
  const [budget, setBudget] = useState(2300);
  const [chambres, setChambres] = useState(2);
  const [balcon, setBalcon] = useState(true);

  const logementsAvecScore = useMemo(() => {
    return logements
      .map((logement) => {
        let score = 0;

        if (
          logement.ville.toLowerCase() ===
          ville.trim().toLowerCase()
        ) {
          score += 35;
        }

        if (logement.prix <= budget) {
          score += 30;
        }

        if (logement.chambres >= chambres) {
          score += 25;
        }

        if (!balcon || logement.balcon) {
          score += 10;
        }

        return {
          ...logement,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [ville, budget, chambres, balcon]);

  const meilleurMatch = logementsAvecScore[0];`,
        },

        {
          type: "concept",
          title: "Cette logique n'est pas nouvelle.",
          text:
            "Nous reprenons les critères et le score déjà construits. La nouveauté de cette leçon est surtout la manière dont nous allons présenter ces informations.",
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — PARTIE 2",
          title: "Juste après meilleurMatch, ajoutez le return et le hero.",
          text:
            "La grande image de fond est chargée depuis Unsplash pour obtenir immédiatement un rendu immobilier crédible.",
          code: `  return (
    <main className="min-h-screen bg-[#f4f1eb] text-slate-950">
      <section className="relative min-h-[760px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90"
          alt="Intérieur contemporain d'un appartement"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-slate-950/35" />

        <Header />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-end px-6 pb-16 pt-36">
          <div className="w-full">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/65">
                Immobilier personnalisé
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white md:text-7xl lg:text-[92px]">
                Trouvez le logement
                <br />
                qui vous correspond.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                PropertyMatch analyse vos critères et classe les logements
                selon leur compatibilité avec votre recherche.
              </p>
            </div>`,
        },

        {
          type: "visual-guide",
          eyebrow: "APRÈS CETTE PARTIE",
          title: "L'accueil change déjà complètement d'échelle.",
          text:
            "Le header flotte sur une vraie photo immobilière et le message principal devient le point focal de la page.",
          visual: "premium-hero",
        },

        // --------------------------------------------------
        // D — SEARCH BAR
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Intégrons maintenant la recherche directement dans le hero.",
          text:
            "Au lieu d'avoir un formulaire qui ressemble à un exercice, nous voulons une grande barre blanche qui donne l'impression d'un vrai moteur de recherche immobilier.",
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — PARTIE 3",
          title: "Continuez directement après le texte du hero.",
          text:
            "Ne fermez pas encore les balises précédentes : collez cette partie à la suite.",
          code: `            <div className="mt-12 rounded-[28px] border border-white/20 bg-white p-3 shadow-2xl shadow-black/20">
              <div className="grid gap-2 lg:grid-cols-[1.15fr_1fr_0.8fr_0.8fr_auto]">
                <label className="rounded-[20px] px-5 py-4 transition hover:bg-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Localisation
                  </span>
                  <input
                    value={ville}
                    onChange={(event) => setVille(event.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-black outline-none"
                    placeholder="Paris"
                  />
                </label>

                <label className="rounded-[20px] px-5 py-4 transition hover:bg-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Budget maximum
                  </span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(event) =>
                      setBudget(Number(event.target.value))
                    }
                    className="mt-1 w-full bg-transparent text-sm font-black outline-none"
                  />
                </label>

                <label className="rounded-[20px] px-5 py-4 transition hover:bg-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Chambres
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={chambres}
                    onChange={(event) =>
                      setChambres(Number(event.target.value))
                    }
                    className="mt-1 w-full bg-transparent text-sm font-black outline-none"
                  />
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-[20px] px-5 py-4 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={balcon}
                    onChange={(event) =>
                      setBalcon(event.target.checked)
                    }
                    className="h-4 w-4 accent-slate-950"
                  />
                  <span>
                    <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Extérieur
                    </span>
                    <span className="mt-1 block text-sm font-black">
                      Balcon souhaité
                    </span>
                  </span>
                </label>

                <a
                  href="#resultats"
                  className="flex min-h-[74px] items-center justify-center rounded-[20px] bg-slate-950 px-7 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Voir les matchs
                </a>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-xs font-bold text-white/60">
              <span>✓ Matching personnalisé</span>
              <span>✓ Favoris enregistrés</span>
              <span>✓ Comparaison instantanée</span>
            </div>
          </div>
        </div>
      </section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "RECHERCHE PREMIUM",
          title: "Les critères ressemblent maintenant à une vraie barre de recherche produit.",
          text:
            "Les champs restent exactement les mêmes variables React : seule leur présentation change.",
          visual: "premium-search",
        },

        {
          type: "action",
          title: "Sauvegardez maintenant et regardez le navigateur.",
          text:
            "À ce stade, la partie haute de la page doit déjà ressembler à notre nouvelle direction.",
          actions: [
            "Sauvegardez app/page.tsx.",
            "Si VS Code affiche une erreur rouge, vérifiez que vous avez bien collé les trois parties dans l'ordre.",
            "Retournez sur localhost:3000.",
            "Rechargez la page si nécessaire.",
          ],
        },

        // --------------------------------------------------
        // E — TRUST / BEST MATCH
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "Ajoutons une transition élégante entre le hero et les résultats.",
          text:
            "Un vrai site ne doit pas enchaîner brutalement une grande photo puis une grille. Nous allons ajouter un bloc éditorial et mettre en avant le meilleur match.",
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — PARTIE 4",
          title: "Collez cette section juste après </section> du hero.",
          text:
            "Elle affiche quelques chiffres et le meilleur logement calculé par notre moteur.",
          code: `      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <div>
            <p className="text-3xl font-black tracking-[-0.04em]">
              {logements.length}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              logements analysés
            </p>
          </div>

          <div>
            <p className="text-3xl font-black tracking-[-0.04em]">
              {meilleurMatch?.score ?? 0}%
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              meilleur score actuel
            </p>
          </div>

          <div>
            <p className="text-3xl font-black tracking-[-0.04em]">
              Instantané
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              recalcul dès qu'un critère change
            </p>
          </div>
        </div>
      </section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "TRANSITION",
          title: "Cette bande blanche donne du rythme et valorise la logique du site.",
          text:
            "Le moteur de matching devient un argument produit visible, pas seulement du code caché.",
          visual: "premium-trust",
        },

        // --------------------------------------------------
        // F — RESULTS SECTION
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE F",
          title: "Terminons l'accueil avec une vraie introduction aux résultats.",
          text:
            "Les cartes seront entièrement redesignées dans la leçon 15. Aujourd'hui, nous préparons leur environnement et nous réutilisons le composant PropertyCard actuel.",
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX — PARTIE 5",
          title: "Ajoutez la section résultats puis fermez le composant.",
          text:
            "Cette dernière partie termine app/page.tsx.",
          code: `      <section
        id="resultats"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="flex flex-col gap-6 border-b border-slate-300 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Sélection personnalisée
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.045em] md:text-5xl">
              Les meilleurs matchs
              <br />
              pour votre recherche.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500">
            Les logements sont classés automatiquement selon votre ville,
            votre budget, le nombre de chambres et votre préférence pour
            un balcon.
          </p>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {logementsAvecScore.map((logement) => (
            <PropertyCard
              key={logement.id}
              id={logement.id}
              titre={logement.titre}
              ville={logement.ville}
              prix={logement.prix}
              chambres={logement.chambres}
              surface={logement.surface}
              balcon={logement.balcon}
              image={logement.image}
              score={logement.score}
            />
          ))}
        </div>
      </section>

      <section
        id="apropos"
        className="border-t border-slate-200 bg-slate-950 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              À propos
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">
              Moins de listes.
              <br />
              Plus de pertinence.
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-white/60">
            PropertyMatch transforme des critères simples en score de
            compatibilité afin d'aider l'utilisateur à repérer rapidement
            les logements les plus proches de ses besoins.
          </p>
        </div>
      </section>

      <footer
        id="contact"
        className="border-t border-white/10 bg-slate-950 text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-black tracking-[-0.03em]">
            PropertyMatch
          </p>

          <p className="text-sm text-white/40">
            Votre recherche immobilière, mieux classée.
          </p>
        </div>
      </footer>
    </main>
  );
}`,
        },

        {
          type: "visual-guide",
          eyebrow: "STRUCTURE DES RÉSULTATS",
          title: "La page possède maintenant une vraie narration visuelle.",
          text:
            "Hero → recherche → preuves → résultats → À propos → footer. Les cartes elles-mêmes seront notre prochain gros chantier.",
          visual: "premium-results-preview",
        },

        // --------------------------------------------------
        // G — TESTS
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE G",
          title: "Testons la refonte avant d'aller plus loin.",
          text:
            "Un joli écran ne suffit pas : les fonctions créées auparavant doivent toujours marcher.",
        },

        {
          type: "action",
          title: "Testez les critères dans le nouveau hero.",
          text:
            "Les résultats doivent continuer à réagir aux valeurs.",
          actions: [
            "Changez Paris par une autre ville présente dans vos données.",
            "Modifiez le budget.",
            "Modifiez le nombre de chambres.",
            "Cochez puis décochez Balcon souhaité.",
            "Regardez les scores et l'ordre des logements.",
          ],
        },

        {
          type: "action",
          title: "Testez ensuite les liens.",
          text:
            "Nous avons modifié le Header mais pas les routes.",
          actions: [
            "Cliquez sur Mes favoris.",
            "Vérifiez que /favoris s'ouvre.",
            "Revenez sur l'accueil.",
            "Cliquez sur À propos.",
            "La page doit descendre vers la section sombre.",
            "Cliquez sur Contact.",
            "La page doit descendre jusqu'au footer.",
          ],
        },

        {
          type: "action",
          title: "Testez enfin une carte.",
          text:
            "La refonte de l'accueil ne doit pas casser les composants existants.",
          actions: [
            "Cliquez sur le cœur d'un logement.",
            "Vérifiez que le favori est enregistré.",
            "Cliquez sur Voir le bien.",
            "Vérifiez que la fiche logement s'ouvre toujours.",
          ],
        },

        {
          type: "warning",
          title: "Une propriété TypeScript n'existe pas ?",
          text:
            "Si VS Code signale par exemple logement.surface ou logement.image, regardez les noms exacts utilisés dans votre data/logements.ts. Gardez les noms de votre fichier de données. Ne créez pas une deuxième structure de données juste pour faire disparaître l'erreur.",
        },

        {
          type: "concept",
          eyebrow: "CE QUI A CHANGÉ",
          title: "Nous avons séparé la logique produit de la direction artistique.",
          text:
            "Les critères, useState, useMemo et le score existaient déjà. Nous avons changé la composition visuelle autour d'eux. C'est une compétence importante : une application peut évoluer graphiquement sans jeter sa logique métier.",
        },

        {
          type: "visual-guide",
          eyebrow: "FIN DE LA LEÇON",
          title: "Voici le niveau visuel que l'accueil doit maintenant commencer à atteindre.",
          text:
            "Il n'est pas encore terminé : les cartes actuelles contrastent volontairement avec le nouveau hero. Dans la leçon 15, nous allons les reconstruire pour qu'elles rejoignent exactement cette direction premium.",
          visual: "premium-home-final",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE LEÇON",
          title: "Leçon 15 — Résultats & cartes premium.",
          text:
            "Nous allons refaire PropertyCard : grande photo, badge de compatibilité, cœur intégré à l'image, prix mieux hiérarchisé, caractéristiques avec icônes, états hover et vraie présentation de sélection immobilière.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 14",
          title: "Ne passez à la suite que lorsque l'accueil fonctionne réellement.",
          text:
            "Comparez votre localhost avec les visuels de cette leçon.",
          items: [
            "Le Header est superposé au hero.",
            "La grande photo immobilière occupe le haut de l'accueil.",
            "Le titre principal est blanc et très visible.",
            "La recherche est intégrée dans une grande barre blanche.",
            "Ville, budget, chambres et balcon fonctionnent encore.",
            "Le bouton Voir les matchs descend vers les résultats.",
            "La bande de statistiques s'affiche sous le hero.",
            "Les résultats sont précédés d'un vrai titre de section.",
            "À propos est accessible depuis le Header.",
            "Contact descend jusqu'au footer.",
            "Favoris fonctionne toujours.",
            "Voir le bien fonctionne toujours.",
            "Le matching fonctionne toujours.",
            "Aucune erreur rouge ne reste dans le terminal.",
          ],
        },
      ];

    // ====================================================
    // 15 — RÉSULTATS & CARTES PREMIUM
    // ====================================================

    case "15":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire des résultats de PropertyMatch la partie la plus convaincante du site.",
          text:
            "La leçon 14 a donné à l'accueil sa nouvelle direction premium. Mais juste en dessous du hero, nos cartes viennent encore d'une étape précédente du projet. Nous allons maintenant refaire PropertyCard pour obtenir de vraies annonces immobilières : grande photo, score bien visible, caractéristiques, cœur, prix, bouton d'action et micro-interactions.",
        },

        {
          type: "visual-guide",
          eyebrow: "NOTRE CIBLE",
          title: "Voici le style de résultats que nous allons construire.",
          text:
            "Les cartes doivent être suffisamment belles pour que le visiteur ait envie d'ouvrir les logements, tout en gardant immédiatement visibles le prix et le score de compatibilité.",
          visual: "cards-target",
        },

        {
          type: "visual-guide",
          eyebrow: "AVANT",
          title: "Le nouveau hero est premium. Les résultats doivent maintenant atteindre le même niveau.",
          text:
            "Nous ne touchons pas au moteur de matching : nous changeons principalement la manière dont un logement est présenté.",
          visual: "cards-before",
        },

        {
          type: "concept",
          eyebrow: "IDÉE IMPORTANTE",
          title: "PropertyCard est un composant : une seule refonte améliore toutes les annonces.",
          text:
            "Nous avons justement créé ce composant plus tôt pour éviter de recopier le même design. Les logements restent différents grâce aux props, mais leur structure visuelle vient d'un seul fichier.",
        },

        // --------------------------------------------------
        // A — OPEN PROPERTYCARD
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE A",
          title: "Ouvrez le fichier qui contrôle toutes les cartes.",
          text:
            "Nous allons travailler dans components/PropertyCard.tsx.",
        },

        {
          type: "action",
          title: "Dans l'Explorer, ouvrez components/PropertyCard.tsx.",
          text:
            "Avant de supprimer quoi que ce soit, vérifiez le chemin en haut de VS Code.",
          actions: [
            "Ouvrez le dossier components.",
            "Cliquez sur PropertyCard.tsx.",
            "Le chemin doit être propertymatch/components/PropertyCard.tsx.",
            "Ne modifiez pas FavoriteButton.tsx.",
            "Ne modifiez pas encore app/page.tsx.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Une seule carte est définie ici, puis réutilisée dans la grille.",
          text:
            "Nous allons remplacer le composant entier afin que tous les logements adoptent le nouveau design en même temps.",
          visual: "cards-vscode",
        },

        // --------------------------------------------------
        // B — REPLACE PROPERTY CARD
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE B",
          title: "Remplacez entièrement PropertyCard.tsx.",
          text:
            "Le code est long, mais l'élève n'a pas besoin de le mémoriser. Nous allons ensuite examiner les zones importantes visuellement.",
          actions: [
            "Cliquez dans PropertyCard.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout le contenu.",
            "Copiez le fichier complet ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/PROPERTYCARD.TSX",
          title: "Collez cette nouvelle carte premium.",
          text:
            "Elle réutilise FavoriteButton et Link que vous connaissez déjà.",
          code: `import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

type PropertyCardProps = {
  id: number;
  quartier: string;
  titre: string;
  type: string;
  description: string;
  prix: number;
  chambres: number;
  surface: number;
  balcon: boolean;
  image: string;
  score: number;
};

export default function PropertyCard({
  id,
  quartier,
  titre,
  type,
  description,
  prix,
  chambres,
  surface,
  balcon,
  image,
  score,
}: PropertyCardProps) {
  const matchLabel =
    score >= 90
      ? "Excellent match"
      : score >= 75
        ? "Très bon match"
        : score >= 60
          ? "Bon match"
          : "Match possible";

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="relative h-[285px] overflow-hidden bg-slate-200">
        <img
          src={image}
          alt={titre}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-700 shadow-sm backdrop-blur">
            {type}
          </span>
        </div>

        <div className="absolute right-4 top-4">
          <FavoriteButton id={id} />
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-2 text-sm font-black text-slate-950 shadow-lg">
            {score}% match
          </span>

          <span className="rounded-full border border-white/25 bg-slate-950/55 px-3 py-2 text-[10px] font-black text-white backdrop-blur">
            {matchLabel}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              {quartier}
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-[-0.035em] text-slate-950">
              {titre}
            </h3>
          </div>

          <div className="text-right">
            <p className="text-2xl font-black tracking-[-0.04em]">
              {prix.toLocaleString("fr-FR")} €
            </p>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              par mois
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f4f1eb] px-3 py-2 text-xs font-bold text-slate-700">
            ◫ {chambres} chambre(s)
          </span>

          <span className="rounded-full bg-[#f4f1eb] px-3 py-2 text-xs font-bold text-slate-700">
            ↔ {surface} m²
          </span>

          <span className="rounded-full bg-[#f4f1eb] px-3 py-2 text-xs font-bold text-slate-700">
            {balcon ? "◇ Balcon" : "Sans balcon"}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-xs font-bold text-slate-400">
            Annonce sélectionnée par PropertyMatch
          </p>

          <Link
            href={"/biens/" + id}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Voir le bien
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}`,
        },

        {
          type: "concept",
          eyebrow: "NE DÉCORTIQUEZ PAS TOUT",
          title: "Repérez seulement les quatre grandes zones de la carte.",
          text:
            "Photo en haut, score par-dessus la photo, informations du logement au centre, puis action en bas. C'est cette hiérarchie qui rend la carte facile à parcourir.",
          items: [
            {
              title: "Photo",
              text: "Elle attire immédiatement l'œil et occupe une vraie place dans la carte.",
            },
            {
              title: "Match",
              text: "Le score du moteur devient une information produit majeure.",
            },
            {
              title: "Informations",
              text: "Quartier, titre, prix, description et caractéristiques se lisent dans cet ordre.",
            },
            {
              title: "Action",
              text: "Voir le bien reste visible sans voler la vedette au contenu.",
            },
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "PHOTO",
          title: "L'image occupe désormais presque la moitié de la carte.",
          text:
            "Le léger dégradé sombre permet de garder les badges lisibles même sur une photo très claire.",
          visual: "cards-photo",
        },

        {
          type: "visual-guide",
          eyebrow: "MATCHING",
          title: "Le score n'est plus un petit chiffre perdu dans l'interface.",
          text:
            "Il devient un badge de décision : 96% match, Excellent match, Très bon match, etc.",
          visual: "cards-score",
        },

        // --------------------------------------------------
        // C — SAVE AND EXPECT PROP ERRORS
        // --------------------------------------------------

        {
          type: "os-guide",
          eyebrow: "SAUVEGARDE",
          title: "Sauvegardez PropertyCard.tsx.",
          text:
            "Une erreur TypeScript peut apparaître dans app/page.tsx : c'est normal si l'ancienne page ne transmet pas encore quartier, type et description.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Regardez le terminal.",
              "Si une erreur parle de props manquantes, continuez avec l'étape suivante.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Regardez le terminal.",
              "Si une erreur parle de props manquantes, continuez avec l'étape suivante.",
            ],
          },
        },

        // --------------------------------------------------
        // D — UPDATE APP/PAGE MAPPING
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Connectons maintenant la nouvelle carte aux données complètes.",
          text:
            "Notre data/logements.ts possède déjà quartier, type et description. Il suffit de les transmettre au composant.",
        },

        {
          type: "action",
          title: "Ouvrez app/page.tsx et descendez jusqu'à PropertyCard.",
          text:
            "Cherchez logementsAvecScore.map puis le composant PropertyCard situé à l'intérieur.",
          actions: [
            "Ouvrez app/page.tsx.",
            "Utilisez ⌘ + F sur Mac ou Ctrl + F sur Windows.",
            "Recherchez <PropertyCard.",
            "Sélectionnez seulement ce composant, de <PropertyCard jusqu'à />.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX",
          title: "Remplacez l'ancien PropertyCard par celui-ci.",
          text:
            "Cette version transmet exactement les props attendues par notre nouveau composant.",
          code: `<PropertyCard
  key={logement.id}
  id={logement.id}
  quartier={logement.quartier}
  titre={logement.titre}
  type={logement.type}
  description={logement.description}
  prix={logement.prix}
  chambres={logement.chambres}
  surface={logement.surface}
  balcon={logement.balcon}
  image={logement.image}
  score={logement.score}
/>`,
        },

        {
          type: "visual-guide",
          eyebrow: "CONNEXION DES DONNÉES",
          title: "Chaque information affichée sur la carte vient maintenant du logement correspondant.",
          text:
            "Il n'y a toujours qu'un seul design PropertyCard, mais quatre ensembles de données différents.",
          visual: "cards-details",
        },

        {
          type: "os-guide",
          title: "Sauvegardez app/page.tsx et observez le site.",
          text:
            "C'est le moment où la grille doit changer visuellement.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Retournez sur localhost:3000.",
              "Descendez jusqu'à Les meilleurs matchs.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Retournez sur localhost:3000.",
              "Descendez jusqu'à Les meilleurs matchs.",
            ],
          },
        },

        // --------------------------------------------------
        // E — GRID
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Donnons plus de présence aux résultats.",
          text:
            "Sur un écran large, notre cible affiche des cartes assez grandes. Avec quatre logements, une grille en deux colonnes est idéale : chaque photo reste spectaculaire.",
        },

        {
          type: "action",
          title: "Dans app/page.tsx, repérez la div qui entoure logementsAvecScore.map.",
          text:
            "Nous allons simplement affiner les espaces.",
          actions: [
            "Cherchez la ligne juste avant {logementsAvecScore.map.",
            "Vérifiez qu'il s'agit bien de la grille des résultats.",
            "Remplacez son className par celui-ci.",
          ],
        },

        {
          type: "code",
          eyebrow: "GRILLE",
          title: "Utilisez cette grille.",
          text:
            "Une colonne par défaut, deux à partir de md.",
          code: `className="mt-10 grid gap-8 md:grid-cols-2"`,
        },

        {
          type: "visual-guide",
          eyebrow: "GRILLE PREMIUM",
          title: "Deux grandes cartes valent mieux que quatre miniatures serrées.",
          text:
            "L'utilisateur peut comparer les résultats sans sacrifier la qualité des photos.",
          visual: "cards-grid",
        },

        // --------------------------------------------------
        // F — MICRO INTERACTIONS
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "Testez les micro-interactions que nous avons déjà ajoutées.",
          text:
            "Un site premium donne du feedback lorsqu'un élément est interactif, mais sans animation excessive.",
        },

        {
          type: "action",
          title: "Passez la souris sur une carte sans cliquer.",
          text:
            "Observez trois choses.",
          actions: [
            "La carte monte de quelques pixels.",
            "L'ombre devient légèrement plus présente.",
            "La photo zoome très doucement.",
            "Passez ensuite la souris sur Voir le bien.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "HOVER",
          title: "Le mouvement doit être presque imperceptible, mais rendre l'interface vivante.",
          text:
            "Nous évitons les animations spectaculaires : PropertyMatch doit rester sobre et immobilier.",
          visual: "cards-hover",
        },

        // --------------------------------------------------
        // G — MATCH TEST
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE F",
          title: "Vérifions que le design est réellement connecté au moteur.",
          text:
            "Un badge 96% n'a aucun intérêt s'il est simplement décoratif. Nous allons changer les critères dans le hero.",
        },

        {
          type: "action",
          title: "Modifiez les critères et observez les cartes.",
          text:
            "Le score et l'ordre doivent continuer à être recalculés.",
          actions: [
            "Changez le budget.",
            "Modifiez le nombre de chambres.",
            "Cochez ou décochez le balcon.",
            "Regardez les pourcentages.",
            "Regardez quelle carte se trouve en première position.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "MEILLEUR MATCH",
          title: "La première carte est désormais le meilleur résultat de la recherche.",
          text:
            "Le design et la logique travaillent ensemble : score calculé → tri → présentation premium.",
          visual: "cards-best-match",
        },

        // --------------------------------------------------
        // H — FAVORITE + ROUTE
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE G",
          title: "Vérifiez que les fonctions importantes ont survécu à la refonte.",
          text:
            "Nous avons beaucoup changé l'apparence du composant. Les fonctions doivent toujours être là.",
        },

        {
          type: "action",
          title: "Testez le cœur puis Voir le bien.",
          text:
            "Faites le test sur au moins deux cartes.",
          actions: [
            "Cliquez sur le cœur de la première carte.",
            "Vérifiez qu'il passe en favori.",
            "Rechargez la page : le cœur doit rester actif.",
            "Cliquez sur Voir le bien.",
            "Vérifiez que la bonne route /biens/[id] s'ouvre.",
            "Revenez à l'accueil et testez une deuxième carte.",
          ],
        },

        {
          type: "warning",
          title: "Le cœur n'est plus visible ?",
          text:
            "Vérifiez que PropertyCard importe bien FavoriteButton et que <FavoriteButton id={id} /> se trouve dans le bloc absolute right-4 top-4.",
        },

        // --------------------------------------------------
        // I — OPTIONAL DATA QUALITY
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE H",
          title: "Regardez maintenant les textes de vos quatre logements.",
          text:
            "Une belle carte perd immédiatement en crédibilité si toutes les descriptions sont trop longues, trop courtes ou répétitives.",
        },

        {
          type: "action",
          title: "Ouvrez data/logements.ts.",
          text:
            "Ne changez pas la structure. Vérifiez seulement la qualité du contenu.",
          actions: [
            "Chaque logement doit avoir un quartier clair.",
            "Chaque logement doit avoir un type.",
            "Chaque logement doit avoir une description courte et crédible.",
            "Chaque logement doit avoir une image différente.",
            "Vérifiez que les prix et surfaces sont cohérents.",
          ],
        },

        {
          type: "concept",
          title: "Le contenu fait partie du design.",
          text:
            "Deux interfaces avec le même CSS peuvent donner une impression complètement différente selon la qualité des photos et des textes. Pour un site immobilier, les médias sont particulièrement importants.",
        },

        // --------------------------------------------------
        // FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "Le hero et les résultats appartiennent maintenant au même produit.",
          text:
            "Nous nous rapprochons nettement de la maquette cible : grande photographie, tons crème et noir, cartes immobilières riches et matching mis en avant.",
          visual: "cards-final",
        },

        {
          type: "text",
          eyebrow: "CE QUI MANQUE ENCORE",
          title: "La prochaine grosse différence avec notre maquette cible se trouve maintenant dans la fiche logement.",
          text:
            "Notre accueil devient crédible. Dans la leçon 16, nous allons refaire /biens/[id] avec une vraie galerie de plusieurs photos, une colonne de réservation/contact, les équipements et une section expliquant le score de compatibilité.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 15",
          title: "Comparez visuellement vos résultats avec ceux de cette leçon.",
          text:
            "Ne passez pas à la fiche premium tant que les cartes ne sont pas propres.",
          items: [
            "PropertyCard possède une grande photo.",
            "Le type du logement apparaît sur la photo.",
            "Le cœur est positionné en haut à droite.",
            "Le score est clairement visible sur la photo.",
            "Un libellé Excellent / Très bon / Bon match accompagne le score.",
            "Le quartier apparaît au-dessus du titre.",
            "Le prix est immédiatement visible.",
            "La description est limitée visuellement.",
            "Chambres, surface et balcon sont visibles.",
            "Voir le bien est un vrai lien.",
            "Le hover fait légèrement monter la carte.",
            "La photo zoome légèrement au hover.",
            "Les résultats sont sur une colonne puis deux colonnes.",
            "Changer les critères modifie toujours les scores.",
            "Le meilleur match remonte en premier.",
            "Les favoris fonctionnent toujours.",
            "Les routes des fiches fonctionnent toujours.",
            "Aucune erreur rouge ne reste dans le terminal.",
          ],
        },
      ];

    // ====================================================
    // 16 — FICHE LOGEMENT PREMIUM
    // ====================================================

    case "16":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Transformer /biens/[id] en vraie fiche immobilière premium.",
          text:
            "L'accueil et les cartes ont maintenant une vraie identité. La fiche logement doit être au même niveau. Dans cette leçon, nous allons construire une page détaillée avec galerie photo, prix, caractéristiques, équipements, explication du matching et zone de contact.",
        },

        {
          type: "visual-guide",
          eyebrow: "NOTRE CIBLE",
          title: "La fiche doit donner envie de consulter le bien, pas seulement afficher ses données.",
          text:
            "La photo devient dominante, les informations essentielles sont hiérarchisées et le score de compatibilité est expliqué clairement.",
          visual: "detail-target",
        },

        {
          type: "visual-guide",
          eyebrow: "AVANT",
          title: "Notre fiche actuelle fonctionne, mais elle ressemble encore à une version de travail.",
          text:
            "Nous gardons la route dynamique et les données. Nous refaisons surtout la présentation.",
          visual: "detail-before",
        },

        {
          type: "concept",
          eyebrow: "IMPORTANT",
          title: "Une fiche premium combine contenu, données et action.",
          text:
            "Le visiteur doit comprendre trois choses très vite : quel est le logement, pourquoi il lui correspond et comment agir ensuite.",
          items: [
            {
              title: "Le bien",
              text: "Photos, quartier, titre, surface, chambres, balcon.",
            },
            {
              title: "Le match",
              text: "Score et raisons principales de compatibilité.",
            },
            {
              title: "L'action",
              text: "Prix, favoris et bouton de contact clairement visibles.",
            },
          ],
        },

        // --------------------------------------------------
        // A — DATA GALLERY
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE A",
          title: "Commençons par enrichir les données avec plusieurs photos.",
          text:
            "Une vraie fiche immobilière ne se contente généralement pas d'une seule image.",
        },

        {
          type: "action",
          title: "Ouvrez data/logements.ts.",
          text:
            "Nous allons ajouter une propriété galerie à chaque logement.",
          actions: [
            "Dans l'Explorer, ouvrez data.",
            "Cliquez sur logements.ts.",
            "Repérez le premier logement.",
            "Juste après image, ajoutez galerie.",
          ],
        },

        {
          type: "code",
          eyebrow: "DATA/LOGEMENTS.TS",
          title: "Ajoutez une galerie au premier logement.",
          text:
            "Vous pouvez utiliser ces URLs pour la formation.",
          code: `galerie: [
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
],`,
        },

        {
          type: "action",
          title: "Ajoutez aussi une galerie aux trois autres logements.",
          text:
            "Vous pouvez réutiliser des photos différentes de la même sélection pour l'instant.",
          actions: [
            "Chaque logement doit avoir galerie: [...].",
            "Gardez au moins 3 images par logement.",
            "Ne supprimez pas la propriété image : les cartes l'utilisent encore.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DONNÉES",
          title: "Chaque logement possède maintenant une image principale + une galerie.",
          text:
            "La carte utilise image. La fiche pourra utiliser galerie.",
          visual: "detail-data-gallery",
        },

        // --------------------------------------------------
        // B — OPEN DYNAMIC PAGE
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Ouvrez maintenant la page dynamique du logement.",
          text:
            "C'est le fichier qui affiche /biens/1, /biens/2, etc.",
        },

        {
          type: "action",
          title: "Dans VS Code, ouvrez app/biens/[id]/page.tsx.",
          text:
            "Vérifiez bien le chemin avant de remplacer le code.",
          actions: [
            "Ouvrez app.",
            "Ouvrez biens.",
            "Ouvrez [id].",
            "Cliquez sur page.tsx.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Nous travaillons bien dans app/biens/[id]/page.tsx.",
          text:
            "Cette page sera utilisée par tous les logements.",
          visual: "detail-vscode",
        },

        // --------------------------------------------------
        // C — REPLACE PAGE
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE C",
          title: "Remplacez entièrement la fiche actuelle.",
          text:
            "La route dynamique ne change pas. Nous reconstruisons simplement son interface.",
          actions: [
            "Cliquez dans app/biens/[id]/page.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Collez le fichier complet ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/BIENS/[ID]/PAGE.TSX",
          title: "Collez cette fiche premium complète.",
          text:
            "Le code réutilise Header, FavoriteButton et logements.",
          code: `import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import { logements } from "@/data/logements";
import { notFound } from "next/navigation";

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetailPage({
  params,
}: DetailPageProps) {
  const { id } = await params;

  const logement = logements.find(
    (item) => item.id === Number(id)
  );

  if (!logement) {
    notFound();
  }

  const galerie =
    logement.galerie?.length > 0
      ? logement.galerie
      : [logement.image];

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-slate-950">
      <div className="relative bg-slate-950">
        <Header />

        <div className="mx-auto max-w-7xl px-6 pb-10 pt-32">
          <a
            href="/"
            className="text-sm font-bold text-white/60 transition hover:text-white"
          >
            ← Retour aux résultats
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-[28px] bg-slate-200">
            <img
              src={galerie[0]}
              alt={logement.titre}
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="overflow-hidden rounded-[28px] bg-slate-200">
              <img
                src={galerie[1] ?? galerie[0]}
                alt={logement.titre}
                className="h-[254px] w-full object-cover"
              />
            </div>

            <div className="overflow-hidden rounded-[28px] bg-slate-200">
              <img
                src={galerie[2] ?? galerie[0]}
                alt={logement.titre}
                className="h-[254px] w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
                {logement.type}
              </span>

              <span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-700">
                {logement.quartier}
              </span>
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-[-0.05em]">
              {logement.titre}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {logement.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Chambres
                </p>
                <p className="mt-2 text-2xl font-black">
                  {logement.chambres}
                </p>
              </div>

              <div className="rounded-[22px] bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Surface
                </p>
                <p className="mt-2 text-2xl font-black">
                  {logement.surface} m²
                </p>
              </div>

              <div className="rounded-[22px] bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Extérieur
                </p>
                <p className="mt-2 text-2xl font-black">
                  {logement.balcon ? "Balcon" : "Non"}
                </p>
              </div>
            </div>

            <section className="mt-12 border-t border-slate-300 pt-10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Équipements
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                Tout ce qu'il faut pour s'installer.
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Cuisine équipée",
                  "Internet haut débit",
                  "Rangements intégrés",
                  "Chauffage individuel",
                  logement.balcon
                    ? "Balcon / extérieur"
                    : "Vue dégagée",
                  "Proche transports",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm font-bold"
                  >
                    ✓ {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-[30px] bg-slate-950 p-8 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                Pourquoi ce bien peut vous correspondre
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">
                PropertyMatch analyse vos critères.
              </h2>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] bg-white/5 p-5">
                  <p className="text-[10px] font-black uppercase text-white/40">
                    Budget
                  </p>
                  <p className="mt-2 font-black">
                    Prix clairement identifié
                  </p>
                </div>

                <div className="rounded-[20px] bg-white/5 p-5">
                  <p className="text-[10px] font-black uppercase text-white/40">
                    Espace
                  </p>
                  <p className="mt-2 font-black">
                    {logement.chambres} chambre(s)
                  </p>
                </div>

                <div className="rounded-[20px] bg-white/5 p-5">
                  <p className="text-[10px] font-black uppercase text-white/40">
                    Extérieur
                  </p>
                  <p className="mt-2 font-black">
                    {logement.balcon
                      ? "Balcon disponible"
                      : "Sans balcon"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-8">
            <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Loyer mensuel
              </p>

              <p className="mt-2 text-4xl font-black tracking-[-0.05em]">
                {logement.prix.toLocaleString("fr-FR")} €
              </p>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Consultez les caractéristiques du logement puis contactez-nous
                si ce bien correspond à votre recherche.
              </p>

              <button
                type="button"
                className="mt-7 w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Contacter l'agence
              </button>

              <FavoriteButton
                id={logement.id}
                variant="full"
              />

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-xs font-black">
                  Agence partenaire PropertyMatch
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Réponse généralement sous 24 h.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}`,
        },

        // --------------------------------------------------
        // D — SAVE AND TEST
        // --------------------------------------------------

        {
          type: "os-guide",
          eyebrow: "PREMIER TEST",
          title: "Sauvegardez puis ouvrez /biens/1.",
          text:
            "C'est le moment de vérifier que la nouvelle fiche compile.",
          mac: {
            title: "Mac",
            steps: [
              "Appuyez sur ⌘ + S.",
              "Ouvrez http://localhost:3000/biens/1.",
              "Attendez le rechargement.",
            ],
          },
          windows: {
            title: "Windows",
            steps: [
              "Appuyez sur Ctrl + S.",
              "Ouvrez http://localhost:3000/biens/1.",
              "Attendez le rechargement.",
            ],
          },
        },

        {
          type: "visual-guide",
          eyebrow: "GALERIE",
          title: "La page commence maintenant par une vraie galerie visuelle.",
          text:
            "Une grande image principale et deux images secondaires donnent immédiatement plus de valeur au logement.",
          visual: "detail-gallery",
        },

        {
          type: "visual-guide",
          eyebrow: "INFORMATIONS",
          title: "Titre, quartier et caractéristiques sont mieux hiérarchisés.",
          text:
            "Le visiteur peut scanner rapidement les informations essentielles.",
          visual: "detail-info",
        },

        // --------------------------------------------------
        // E — SIDEBAR
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Regardez maintenant la colonne de droite.",
          text:
            "Cette zone joue le rôle de carte d'action : prix, contact et favori restent visibles pendant que le visiteur parcourt la fiche.",
        },

        {
          type: "visual-guide",
          eyebrow: "COLONNE DE DROITE",
          title: "La carte de prix devient un vrai bloc commercial.",
          text:
            "Sur grand écran, sticky permet à la carte de rester visible lorsqu'on descend dans la page.",
          visual: "detail-sidebar",
        },

        {
          type: "concept",
          title: "sticky ne veut pas dire fixed.",
          text:
            "La carte reste dans sa colonne et suit le scroll seulement dans les limites de son conteneur. C'est souvent plus naturel qu'un élément totalement fixé à l'écran.",
        },

        // --------------------------------------------------
        // F — EQUIPMENT
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "La section Équipements enrichit la fiche sans créer de nouvelle base de données.",
          text:
            "Pour l'instant, nous affichons une petite liste crédible directement dans la page. Plus tard, une vraie base pourrait stocker ces équipements pour chaque bien.",
        },

        {
          type: "visual-guide",
          eyebrow: "ÉQUIPEMENTS",
          title: "Les informations secondaires sont regroupées dans une zone dédiée.",
          text:
            "Cela évite de surcharger le haut de la page.",
          visual: "detail-equipment",
        },

        // --------------------------------------------------
        // G — MATCH SECTION
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE F",
          title: "Ajoutons une vraie narration autour du matching.",
          text:
            "Sur l'accueil, le score sert à classer. Sur la fiche, nous voulons expliquer les critères qui rendent le logement intéressant.",
        },

        {
          type: "visual-guide",
          eyebrow: "MATCHING EXPLIQUÉ",
          title: "Le bloc sombre donne une identité forte à la logique PropertyMatch.",
          text:
            "Il ne remplace pas le moteur : il aide simplement le visiteur à comprendre les raisons principales.",
          visual: "detail-match",
        },

        {
          type: "warning",
          title: "Pourquoi n'affichons-nous pas un score fixe ici ?",
          text:
            "Le score dépend des critères saisis sur l'accueil. Comme nous n'avons pas encore transmis ces critères à la fiche, nous ne devons pas inventer un pourcentage permanent. Nous expliquons donc les caractéristiques sans afficher un faux score.",
        },

        // --------------------------------------------------
        // H — CONTACT
        // --------------------------------------------------

        {
          type: "text",
          eyebrow: "ÉTAPE G",
          title: "Le bouton Contacter l'agence est encore visuel.",
          text:
            "C'est volontaire pour cette leçon. Nous construisons d'abord la fiche premium. La page Contact et les interactions plus complètes seront finalisées dans la leçon 17.",
        },

        {
          type: "visual-guide",
          eyebrow: "CONTACT",
          title: "La fiche possède déjà une vraie zone d'action.",
          text:
            "Prix, contact, favori et information agence sont regroupés au même endroit.",
          visual: "detail-contact",
        },

        // --------------------------------------------------
        // I — TEST ALL IDS
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE H",
          title: "Testez les quatre logements.",
          text:
            "Une route dynamique doit fonctionner pour tous les ids, pas seulement le premier.",
          actions: [
            "Ouvrez /biens/1.",
            "Ouvrez /biens/2.",
            "Ouvrez /biens/3.",
            "Ouvrez /biens/4.",
            "Vérifiez que titre, prix, photos et caractéristiques changent.",
          ],
        },

        {
          type: "action",
          title: "Testez aussi depuis l'accueil.",
          text:
            "Nous voulons vérifier le parcours réel.",
          actions: [
            "Retournez sur localhost:3000.",
            "Descendez jusqu'aux résultats.",
            "Cliquez sur Voir le bien d'une carte.",
            "Vérifiez que la bonne fiche s'ouvre.",
            "Utilisez ← Retour aux résultats.",
          ],
        },

        // --------------------------------------------------
        // J — FAVORITE
        // --------------------------------------------------

        {
          type: "action",
          eyebrow: "ÉTAPE I",
          title: "Vérifiez que le favori reste synchronisé.",
          text:
            "La fiche et la carte utilisent le même FavoriteButton.",
          actions: [
            "Ajoutez un logement aux favoris depuis sa fiche.",
            "Retournez sur l'accueil.",
            "Le cœur de la carte correspondante doit être actif.",
            "Ouvrez Favoris.",
            "Le logement doit apparaître.",
          ],
        },

        {
          type: "concept",
          title: "La cohérence entre les pages donne une impression de vrai produit.",
          text:
            "Si le visiteur ajoute un favori sur une fiche et ne le retrouve pas ailleurs, l'application paraît immédiatement cassée. C'est pourquoi nous testons toujours les parcours complets.",
        },

        // --------------------------------------------------
        // FINAL
        // --------------------------------------------------

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch possède maintenant une vraie fiche immobilière premium.",
          text:
            "La galerie, les informations, les équipements, la zone matching et la colonne de contact rapprochent fortement le site de notre maquette cible.",
          visual: "detail-final",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE LEÇON",
          title: "Leçon 17 — Favoris, navigation & footer.",
          text:
            "Nous allons maintenant finaliser les pages qui entourent le cœur du produit : page Favoris premium, navigation plus aboutie, sections À propos / Contact et footer complet.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 16",
          title: "Testez au moins deux logements avant de continuer.",
          text:
            "La fiche doit fonctionner avec de vraies données différentes.",
          items: [
            "Chaque logement possède une galerie.",
            "La fiche affiche une grande image principale.",
            "Deux images secondaires apparaissent.",
            "Le quartier et le type sont visibles.",
            "Le titre est très lisible.",
            "Chambres, surface et balcon sont hiérarchisés.",
            "La description est visible.",
            "La section Équipements s'affiche.",
            "Le bloc PropertyMatch explique la compatibilité.",
            "La carte de prix est visible à droite sur grand écran.",
            "Le bouton Contacter l'agence apparaît.",
            "FavoriteButton fonctionne sur la fiche.",
            "/biens/1, /biens/2, /biens/3 et /biens/4 fonctionnent.",
            "Voir le bien ouvre la bonne fiche.",
            "Retour aux résultats fonctionne.",
            "Les favoris restent cohérents entre fiche et accueil.",
            "Aucune erreur rouge ne reste dans le terminal.",
          ],
        },
      ];

    // ====================================================
    // 17 — FAVORIS, NAVIGATION & FOOTER
    // ====================================================

    case "17":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire de PropertyMatch un site complet, pas seulement un accueil et des fiches.",
          text:
            "Nous avons maintenant le cœur du produit. Dans cette leçon, nous allons finaliser ce qui entoure l'expérience : une vraie page Favoris premium, un header cohérent, une section À propos, une vraie zone Contact et un footer plus complet.",
        },

        {
          type: "visual-guide",
          eyebrow: "NOTRE CIBLE",
          title: "À la fin, toutes les pages doivent sembler appartenir au même produit.",
          text:
            "Même typographie, mêmes arrondis, mêmes tons crème/noir, mêmes espacements et une navigation cohérente.",
          visual: "ecosystem-target",
        },

        // FAVORITES
        {
          type: "text",
          eyebrow: "ÉTAPE A",
          title: "Commençons par la page Favoris.",
          text:
            "Elle fonctionne déjà techniquement. Nous allons lui donner la même qualité visuelle que les résultats premium.",
        },

        {
          type: "visual-guide",
          eyebrow: "AVANT",
          title: "La logique des favoris est déjà là.",
          text:
            "Notre travail consiste à améliorer la présentation sans casser localStorage ni FavoriteButton.",
          visual: "favorites-before",
        },

        {
          type: "action",
          title: "Ouvrez app/favoris/page.tsx.",
          text:
            "C'est ce fichier que nous allons remplacer.",
          actions: [
            "Dans l'Explorer, ouvrez app.",
            "Ouvrez favoris.",
            "Cliquez sur page.tsx.",
            "Vérifiez le chemin en haut de VS Code.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "DANS VS CODE",
          title: "Le fichier attendu est app/favoris/page.tsx.",
          text:
            "Ne modifiez pas le composant PropertyCard : nous voulons justement le réutiliser ici.",
          visual: "favorites-vscode",
        },

        {
          type: "action",
          title: "Remplacez entièrement la page Favoris.",
          text:
            "Sélectionnez tout puis collez le code complet.",
          actions: [
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez l'ancien contenu.",
            "Collez le code ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/FAVORIS/PAGE.TSX",
          title: "Nouvelle page Favoris premium.",
          text:
            "Elle relit les ids enregistrés dans localStorage puis réutilise nos cartes premium.",
          code: `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { logements } from "@/data/logements";

export default function FavorisPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("propertymatch-favorites") || "[]"
    );

    setFavoriteIds(saved);
  }, []);

  const favoris = logements.filter((logement) =>
    favoriteIds.includes(logement.id)
  );

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Header />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-40">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
            Votre sélection
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-[-0.05em] md:text-7xl">
            Les logements
            <br />
            que vous avez retenus.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/55">
            Retrouvez ici les biens enregistrés pendant votre recherche
            et ouvrez leur fiche détaillée quand vous le souhaitez.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        {favoris.length > 0 ? (
          <>
            <div className="flex flex-col gap-5 border-b border-slate-300 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {favoris.length} logement(s) enregistré(s)
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">
                  Votre shortlist.
                </h2>
              </div>

              <Link
                href="/#resultats"
                className="text-sm font-black underline decoration-slate-300 underline-offset-4"
              >
                + Ajouter d'autres logements
              </Link>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {favoris.map((logement) => (
                <PropertyCard
                  key={logement.id}
                  id={logement.id}
                  quartier={logement.quartier}
                  titre={logement.titre}
                  type={logement.type}
                  description={logement.description}
                  prix={logement.prix}
                  chambres={logement.chambres}
                  surface={logement.surface}
                  balcon={logement.balcon}
                  image={logement.image}
                  score={100}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[32px] border border-slate-200 bg-white px-8 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f1eb] text-2xl">
              ♡
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-[-0.04em]">
              Aucun favori pour le moment.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
              Parcourez les résultats et utilisez le cœur pour conserver
              les logements qui vous intéressent.
            </p>

            <Link
              href="/#resultats"
              className="mt-7 inline-flex rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white"
            >
              Découvrir les logements
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}`,
        },

        {
          type: "warning",
          title: "Pourquoi utilisons-nous score={100} dans Favoris ?",
          text:
            "La page Favoris ne connaît pas les critères actuellement saisis sur l'accueil. Ce 100 ne doit donc pas être présenté comme un vrai score de matching. Si votre carte affiche « 100% match », remplacez provisoirement ce texte dans la carte par un état Favori pour cette page, ou gardez la version précédente de vos favoris. Dans une future version avec état global, nous pourrions transporter les critères entre les pages.",
        },

        {
          type: "visual-guide",
          eyebrow: "FAVORIS",
          title: "La shortlist utilise désormais les mêmes grandes cartes que l'accueil.",
          text:
            "Le visiteur ne change plus brutalement d'univers graphique en ouvrant Favoris.",
          visual: "favorites-premium",
        },

        {
          type: "action",
          title: "Testez aussi l'état vide.",
          text:
            "Une vraie application doit être dessinée même lorsqu'il n'y a aucune donnée.",
          actions: [
            "Retirez temporairement tous vos favoris avec les cœurs.",
            "Ouvrez /favoris.",
            "Vérifiez que le grand état vide apparaît.",
            "Cliquez sur Découvrir les logements.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "ÉTAT VIDE",
          title: "Même sans favori, la page reste volontairement dessinée.",
          text:
            "On explique ce qui se passe et on donne immédiatement une prochaine action.",
          visual: "favorites-empty",
        },

        // HEADER
        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Finalisons la navigation principale.",
          text:
            "Notre Header possède déjà Accueil, Favoris, À propos et Contact. Nous allons simplement vérifier qu'il reste cohérent sur les pages sombres.",
        },

        {
          type: "action",
          title: "Ouvrez components/Header.tsx.",
          text:
            "Vérifiez que votre fichier correspond toujours à la version créée dans la leçon 14.",
          actions: [
            "Le logo PropertyMatch doit pointer vers /.",
            "Accueil doit pointer vers /.",
            "Favoris doit pointer vers /favoris.",
            "À propos doit pointer vers /#apropos.",
            "Contact doit pointer vers /#contact.",
          ],
        },

        {
          type: "code",
          eyebrow: "PETITE CORRECTION",
          title: "Sur les liens À propos et Contact, utilisez des chemins complets.",
          text:
            "Ainsi, ils fonctionnent même lorsque l'utilisateur se trouve sur /favoris ou /biens/2.",
          code: `<a href="/#apropos">À propos</a>

<a href="/#contact">Contact</a>`,
        },

        {
          type: "visual-guide",
          eyebrow: "NAVIGATION",
          title: "Le Header relie maintenant toutes les grandes zones du produit.",
          text:
            "Accueil, sélection, présentation du service et contact sont accessibles partout.",
          visual: "header-final",
        },

        // ABOUT
        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Améliorons la section À propos de l'accueil.",
          text:
            "La version créée en leçon 14 était volontairement simple. Nous allons lui donner davantage de contenu.",
        },

        {
          type: "action",
          title: "Ouvrez app/page.tsx et recherchez id=\"apropos\".",
          text:
            "Remplacez uniquement cette section par la version ci-dessous.",
          actions: [
            "Mac : ⌘ + F. Windows : Ctrl + F.",
            "Recherchez id=\"apropos\".",
            "Sélectionnez la section complète jusqu'à son </section>.",
          ],
        },

        {
          type: "code",
          eyebrow: "SECTION À PROPOS",
          title: "Remplacez-la par cette version.",
          text:
            "Nous expliquons le produit en trois idées simples.",
          code: `<section
  id="apropos"
  className="bg-slate-950 text-white"
>
  <div className="mx-auto max-w-7xl px-6 py-24">
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
          À propos
        </p>

        <h2 className="mt-5 text-5xl font-black tracking-[-0.05em]">
          Moins de listes.
          <br />
          Plus de pertinence.
        </h2>
      </div>

      <div>
        <p className="max-w-xl text-lg leading-8 text-white/60">
          PropertyMatch transforme vos critères en une sélection
          immobilière classée pour vous aider à repérer plus vite
          les logements les plus pertinents.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Définissez vos critères"],
            ["02", "Comparez les matchs"],
            ["03", "Conservez vos favoris"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="rounded-[22px] border border-white/10 bg-white/5 p-5"
            >
              <p className="text-xs font-black text-white/30">
                {number}
              </p>
              <p className="mt-8 text-sm font-black">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "À PROPOS",
          title: "Cette section explique PropertyMatch sans transformer l'accueil en documentation.",
          text:
            "Trois étapes suffisent pour faire comprendre le principe.",
          visual: "about-section",
        },

        // CONTACT
        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Créons une vraie section Contact avant le footer.",
          text:
            "Le bouton de la fiche logement doit désormais avoir une destination crédible.",
        },

        {
          type: "action",
          title: "Dans app/page.tsx, placez cette section après À propos et avant le footer.",
          text:
            "Elle utilisera l'id contact déjà prévu dans la navigation.",
          actions: [
            "Repérez la fin de la section À propos.",
            "Collez le bloc suivant juste après.",
            "Retirez id=\"contact\" de l'ancien footer s'il s'y trouve encore.",
          ],
        },

        {
          type: "code",
          eyebrow: "SECTION CONTACT",
          title: "Ajoutez ce bloc.",
          text:
            "Pour l'instant, le formulaire est visuel. Il sera suffisant pour notre MVP de formation.",
          code: `<section
  id="contact"
  className="bg-[#e8e2d8]"
>
  <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        Contact
      </p>

      <h2 className="mt-5 text-5xl font-black tracking-[-0.05em]">
        Un logement
        <br />
        vous intéresse ?
      </h2>

      <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
        Laissez vos coordonnées et précisez le bien qui vous intéresse.
        Une agence partenaire pourra ensuite reprendre contact.
      </p>
    </div>

    <form className="rounded-[30px] bg-white p-7 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-xs font-black text-slate-500">
            Prénom
          </span>
          <input
            type="text"
            placeholder="Jean"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-slate-950"
          />
        </label>

        <label>
          <span className="text-xs font-black text-slate-500">
            Nom
          </span>
          <input
            type="text"
            placeholder="Martin"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-slate-950"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-black text-slate-500">
          Email
        </span>
        <input
          type="email"
          placeholder="jean.martin@email.com"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-slate-950"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-black text-slate-500">
          Message
        </span>
        <textarea
          rows={4}
          placeholder="Bonjour, je souhaite en savoir plus sur..."
          className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-slate-950"
        />
      </label>

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white"
      >
        Envoyer ma demande
      </button>
    </form>
  </div>
</section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "CONTACT",
          title: "Le bas de l'accueil devient une vraie zone de conversion.",
          text:
            "Le visiteur comprend quoi faire s'il souhaite aller plus loin.",
          visual: "contact-section",
        },

        // DETAIL CONTACT LINK
        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "Relions le bouton de la fiche à cette section.",
          text:
            "Le bouton Contacter l'agence ne doit plus être décoratif.",
        },

        {
          type: "action",
          title: "Ouvrez app/biens/[id]/page.tsx.",
          text:
            "Cherchez le bouton Contacter l'agence.",
          actions: [
            "Recherchez Contacter l'agence.",
            "Remplacez le <button> par le lien ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "FICHE LOGEMENT",
          title: "Remplacez le bouton par ce lien.",
          text:
            "Il renvoie vers la section Contact de l'accueil.",
          code: `<a
  href="/#contact"
  className="mt-7 block w-full rounded-full bg-slate-950 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-slate-800"
>
  Contacter l'agence
</a>`,
        },

        // FOOTER
        {
          type: "text",
          eyebrow: "ÉTAPE F",
          title: "Terminons avec un vrai footer.",
          text:
            "Le footer doit fermer visuellement le site et redonner accès aux destinations importantes.",
        },

        {
          type: "action",
          title: "Retournez dans app/page.tsx et remplacez l'ancien footer.",
          text:
            "Utilisez la version complète ci-dessous.",
          actions: [
            "Recherchez <footer.",
            "Sélectionnez l'ancien footer complet.",
            "Remplacez-le.",
          ],
        },

        {
          type: "code",
          eyebrow: "FOOTER",
          title: "Footer final de PropertyMatch.",
          text:
            "Il reste volontairement sobre.",
          code: `<footer className="bg-slate-950 text-white">
  <div className="mx-auto max-w-7xl px-6 py-16">
    <div className="grid gap-12 md:grid-cols-3">
      <div>
        <p className="text-2xl font-black tracking-[-0.04em]">
          PropertyMatch
        </p>

        <p className="mt-4 max-w-xs text-sm leading-6 text-white/40">
          Une expérience immobilière pensée autour de vos critères.
        </p>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
          Navigation
        </p>

        <div className="mt-5 flex flex-col gap-3 text-sm font-bold text-white/60">
          <a href="/">Accueil</a>
          <a href="/favoris">Favoris</a>
          <a href="/#apropos">À propos</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
          Projet
        </p>

        <p className="mt-5 text-sm leading-6 text-white/40">
          PropertyMatch — application web immobilière construite avec
          Next.js, React et Tailwind CSS.
        </p>
      </div>
    </div>

    <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
      <p>© 2026 PropertyMatch</p>
      <p>Projet pédagogique</p>
    </div>
  </div>
</footer>`,
        },

        {
          type: "visual-guide",
          eyebrow: "FOOTER",
          title: "Le site possède maintenant une vraie fin de page.",
          text:
            "La marque, la navigation et le contexte du projet restent accessibles.",
          visual: "footer-final",
        },

        // TESTS
        {
          type: "text",
          eyebrow: "ÉTAPE G",
          title: "Testons maintenant l'écosystème complet.",
          text:
            "Nous allons parcourir PropertyMatch comme un utilisateur.",
        },

        {
          type: "action",
          title: "Faites ce parcours sans toucher au code.",
          text:
            "Chaque étape doit fonctionner.",
          actions: [
            "Ouvrez l'accueil.",
            "Ajoutez deux logements aux favoris.",
            "Ouvrez Favoris depuis le Header.",
            "Ouvrez une fiche depuis Favoris.",
            "Cliquez sur Contacter l'agence.",
            "Vérifiez que vous arrivez à la section Contact.",
            "Cliquez sur À propos dans le Header.",
            "Revenez aux résultats.",
          ],
        },

        {
          type: "action",
          title: "Vérifiez enfin les liens depuis une autre page.",
          text:
            "C'est précisément pour cela que nous avons utilisé /#apropos et /#contact.",
          actions: [
            "Depuis /favoris, cliquez sur À propos.",
            "Depuis /favoris, cliquez sur Contact.",
            "Depuis /biens/1, cliquez sur Accueil.",
            "Vérifiez qu'aucun lien ne mène vers une page vide.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "PropertyMatch ressemble maintenant à un produit complet.",
          text:
            "Accueil, résultats, fiches, favoris, À propos, contact et footer partagent la même identité. La prochaine étape sera de rendre cette expérience propre sur toutes les tailles d'écran.",
          visual: "ecosystem-final",
        },

        {
          type: "text",
          eyebrow: "PROCHAINE LEÇON",
          title: "Leçon 18 — Responsive & finitions.",
          text:
            "Nous allons tester tout le site dans un navigateur étroit, sur tablette puis sur desktop, corriger le header, les galeries, les cartes, les formulaires et les espacements sans transformer PropertyMatch en application mobile.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 17",
          title: "PropertyMatch doit maintenant être navigable de bout en bout.",
          text:
            "Faites le parcours complet une dernière fois.",
          items: [
            "La page Favoris possède un hero premium.",
            "Les favoris utilisent les cartes du site.",
            "Un état vide est prévu.",
            "Accueil fonctionne depuis toutes les pages.",
            "Favoris fonctionne depuis toutes les pages.",
            "À propos fonctionne depuis toutes les pages.",
            "Contact fonctionne depuis toutes les pages.",
            "La section À propos explique le fonctionnement.",
            "La section Contact possède un formulaire visuel.",
            "Contacter l'agence mène vers Contact.",
            "Le footer possède la marque et la navigation.",
            "Une fiche reste accessible depuis Favoris.",
            "Les favoris restent enregistrés.",
            "Aucune route existante n'a été cassée.",
            "Aucune erreur rouge ne reste dans le terminal.",
          ],
        },
      ];

    // ====================================================
    // 18 — RESPONSIVE & FINITIONS
    // ====================================================

    case "18":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Adapter PropertyMatch aux différentes tailles d'écran.",
          text:
            "Nous ne construisons pas une application mobile séparée. Nous gardons le même site et nous faisons en sorte que son interface reste propre sur grand écran, tablette et petit écran.",
        },
        {
          type: "visual-guide",
          eyebrow: "NOTRE CIBLE",
          title: "Le même produit doit rester premium partout.",
          text:
            "Desktop peut afficher plusieurs colonnes. Tablette réduit la densité. Mobile empile les contenus et garde des boutons faciles à utiliser.",
          visual: "responsive-browser-wide",
        },
        {
          type: "concept",
          title: "Responsive ne signifie pas refaire trois sites.",
          text:
            "Avec Tailwind, les classes sans préfixe servent de base mobile, puis sm:, md: et lg: permettent d'adapter progressivement la mise en page.",
          items: [
            { title: "Mobile", text: "Une colonne et navigation compacte." },
            { title: "Tablette", text: "Deux colonnes lorsque l'espace le permet." },
            { title: "Desktop", text: "Galeries, cartes et blocs peuvent respirer." },
          ],
        },
        {
          type: "text",
          eyebrow: "ÉTAPE A",
          title: "Testez d'abord le site dans plusieurs largeurs.",
          text:
            "Nous allons vérifier le rendu réel avant de modifier le CSS.",
        },
        {
          type: "action",
          title: "Lancez le projet puis activez le mode responsive du navigateur.",
          text: "Le serveur doit être actif.",
          actions: [
            "Lancez npm run dev si nécessaire.",
            "Ouvrez http://localhost:3000.",
            "Ouvrez les DevTools.",
            "Activez le mode appareil / responsive.",
            "Testez une largeur desktop, tablette puis environ 390 px.",
          ],
        },
        {
          type: "visual-guide",
          eyebrow: "TABLETTE",
          title: "Les grilles commencent à se simplifier.",
          text: "Aucune partie importante ne doit être coupée.",
          visual: "responsive-browser-tablet",
        },
        {
          type: "visual-guide",
          eyebrow: "MOBILE",
          title: "Sur téléphone, le contenu doit s'empiler naturellement.",
          text:
            "Le site reste identique visuellement, mais les blocs passent les uns sous les autres.",
          visual: "responsive-browser-mobile",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE B",
          title: "Rendez le Header réellement responsive.",
          text:
            "Sur desktop, les quatre liens restent visibles. Sur mobile, ils sont remplacés par un bouton menu.",
        },
        {
          type: "action",
          title: "Ouvrez components/Header.tsx.",
          text: "Remplacez tout son contenu.",
          actions: [
            "Ouvrez components.",
            "Cliquez sur Header.tsx.",
            "Mac : ⌘ + A. Windows : Ctrl + A.",
            "Supprimez tout.",
            "Collez le code ci-dessous.",
          ],
        },
        {
          type: "code",
          eyebrow: "COMPONENTS/HEADER.TSX",
          title: "Collez ce Header responsive.",
          text: "Il conserve les mêmes destinations que notre navigation actuelle.",
          code: `"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/favoris", label: "Favoris" },
    { href: "/#apropos", label: "À propos" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-slate-950/80 px-5 py-3 text-white backdrop-blur-xl">
          <Link href="/" className="text-lg font-black tracking-[-0.04em]">
            PropertyMatch
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-white/65 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {open && (
          <nav className="mt-2 rounded-[24px] border border-white/10 bg-slate-950 p-3 text-white shadow-2xl md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-4 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}`,
        },
        {
          type: "visual-guide",
          eyebrow: "HEADER",
          title: "Desktop garde la navigation, mobile passe au menu.",
          text: "On ne réduit pas les quatre liens jusqu'à les rendre illisibles.",
          visual: "responsive-header",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE C",
          title: "Vérifiez la grille des logements.",
          text:
            "Les cartes doivent passer de trois colonnes à deux puis une seule.",
        },
        {
          type: "code",
          eyebrow: "PATTERN RESPONSIVE",
          title: "Utilisez cette grille pour les résultats.",
          text: "La carte elle-même reste le même composant.",
          code: `<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  {logements.map((logement) => (
    <PropertyCard
      key={logement.id}
      {...logement}
    />
  ))}
</div>`,
        },
        {
          type: "visual-guide",
          eyebrow: "CARTES",
          title: "3 → 2 → 1 colonne selon la largeur.",
          text: "La structure s'adapte sans créer une version mobile séparée.",
          visual: "responsive-cards",
        },
        {
          type: "warning",
          title: "Ne cherchez pas à tout faire tenir en miniature.",
          text:
            "Sur mobile, une bonne interface empile les informations. Elle ne tente pas de reproduire exactement la densité desktop.",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE D",
          title: "Adaptez la galerie de la fiche logement.",
          text:
            "Sur desktop, la grande photo et les deux secondaires peuvent être côte à côte. Sur mobile, elles doivent s'empiler.",
        },
        {
          type: "action",
          title: "Ouvrez app/biens/[id]/page.tsx.",
          text: "Recherchez la grille de galerie.",
          actions: [
            "Cherchez lg:grid-cols-[1.6fr_1fr].",
            "Vérifiez qu'il n'y a pas de largeur fixe excessive.",
            "Remplacez la galerie par le pattern ci-dessous si nécessaire.",
          ],
        },
        {
          type: "code",
          eyebrow: "GALERIE RESPONSIVE",
          title: "Utilisez cette structure.",
          text: "Les images restent grandes tout en devenant verticales sur mobile.",
          code: `<div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
  <div className="overflow-hidden rounded-[28px]">
    <img
      src={galerie[0]}
      alt={logement.titre}
      className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[520px]"
    />
  </div>

  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
    <img
      src={galerie[1] ?? galerie[0]}
      alt={logement.titre}
      className="h-[180px] w-full rounded-[28px] object-cover sm:h-[220px] lg:h-[254px]"
    />

    <img
      src={galerie[2] ?? galerie[0]}
      alt={logement.titre}
      className="h-[180px] w-full rounded-[28px] object-cover sm:h-[220px] lg:h-[254px]"
    />
  </div>
</div>`,
        },
        {
          type: "visual-guide",
          eyebrow: "GALERIE",
          title: "Sur mobile, la galerie devient une pile verticale.",
          text: "C'est plus lisible et beaucoup plus naturel sur téléphone.",
          visual: "responsive-gallery",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE E",
          title: "Gardez la carte prix sticky uniquement sur grand écran.",
          text:
            "La carte de droite de la fiche est utile sur desktop, mais doit redevenir un bloc normal sur mobile.",
        },
        {
          type: "code",
          eyebrow: "APP/BIENS/[ID]/PAGE.TSX",
          title: "Le pattern à conserver.",
          text: "lg:sticky active le comportement seulement à partir du grand écran.",
          code: `<aside className="h-fit lg:sticky lg:top-8">
  <div className="rounded-[30px] bg-white p-7">
    ...
  </div>
</aside>`,
        },
        {
          type: "text",
          eyebrow: "ÉTAPE F",
          title: "Adaptez le formulaire Contact.",
          text:
            "Les champs Prénom et Nom peuvent rester côte à côte sur écran plus large, puis passer en une colonne.",
        },
        {
          type: "code",
          eyebrow: "SECTION CONTACT",
          title: "Pattern responsive.",
          text: "sm:grid-cols-2 n'active les deux colonnes qu'à partir de sm.",
          code: `<div className="grid gap-4 sm:grid-cols-2">
  <label>
    <span>Prénom</span>
    <input className="mt-2 w-full rounded-2xl border px-4 py-4" />
  </label>

  <label>
    <span>Nom</span>
    <input className="mt-2 w-full rounded-2xl border px-4 py-4" />
  </label>
</div>`,
        },
        {
          type: "visual-guide",
          eyebrow: "CONTACT",
          title: "Sur mobile, les champs passent les uns sous les autres.",
          text: "Le formulaire reste simple à remplir au doigt.",
          visual: "responsive-contact",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE G",
          title: "Adaptez aussi les grands titres.",
          text:
            "Un titre 7xl parfait sur un grand écran peut prendre toute la hauteur d'un téléphone.",
        },
        {
          type: "code",
          eyebrow: "TAILWIND",
          title: "Utilisez des tailles progressives.",
          text: "La taille de base est mobile puis augmente.",
          code: `<h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-6xl lg:text-7xl">
  Les logements
  <br />
  que vous avez retenus.
</h1>`,
        },
        {
          type: "concept",
          title: "Retenez cette règle.",
          text:
            "La classe sans préfixe correspond à la base mobile. sm:, md: et lg: ajoutent des adaptations pour les écrans plus grands.",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE H",
          title: "Traquez le débordement horizontal.",
          text:
            "Sur téléphone, si toute la page peut glisser vers la droite, un élément est probablement trop large.",
        },
        {
          type: "action",
          title: "Si vous voyez un débordement, cherchez d'abord la cause.",
          text: "Ne cachez pas immédiatement le problème avec overflow-hidden.",
          actions: [
            "Cherchez les w-[...] trop grandes.",
            "Cherchez les min-w-[...] inutiles.",
            "Cherchez les images sans w-full.",
            "Cherchez les flex trop rigides.",
            "Cherchez les grilles avec un nombre de colonnes fixe.",
            "Corrigez l'élément responsable.",
          ],
        },
        {
          type: "warning",
          title: "overflow-x-hidden ne répare pas forcément le composant.",
          text:
            "Cela peut masquer le symptôme. Utilisez-le seulement lorsque vous savez pourquoi un élément doit réellement être coupé.",
        },
        {
          type: "text",
          eyebrow: "ÉTAPE I",
          title: "Faites maintenant une vraie passe de tests.",
          text:
            "Nous allons parcourir les trois grandes pages du produit sur desktop, tablette et mobile.",
        },
        {
          type: "action",
          title: "Testez l'accueil.",
          text: "Faites défiler toute la page.",
          actions: [
            "Hero lisible.",
            "Boutons accessibles.",
            "Formulaire sans débordement.",
            "Résultats en une colonne sur petit écran.",
            "À propos lisible.",
            "Contact utilisable.",
            "Footer lisible.",
          ],
        },
        {
          type: "action",
          title: "Testez Favoris.",
          text: "Testez avec et sans favoris.",
          actions: [
            "Header accessible.",
            "Cartes empilées.",
            "État vide correct.",
            "Boutons utilisables.",
          ],
        },
        {
          type: "action",
          title: "Testez la fiche logement.",
          text: "C'est le test le plus important.",
          actions: [
            "Galerie empilée.",
            "Titre lisible.",
            "Caractéristiques sans débordement.",
            "Équipements lisibles.",
            "Bloc matching lisible.",
            "Carte prix sous le contenu sur mobile.",
            "Bouton Contact accessible.",
            "FavoriteButton accessible.",
          ],
        },
        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT FINAL",
          title: "Le même PropertyMatch reste premium sur toutes les tailles.",
          text:
            "Nous n'avons pas créé une application mobile différente : nous avons rendu le site existant réellement responsive.",
          visual: "responsive-final",
        },
        {
          type: "action",
          eyebrow: "DERNIÈRE VÉRIFICATION",
          title: "Redémarrez le serveur et faites un dernier tour.",
          text: "On veut terminer la leçon avec un projet propre.",
          actions: [
            "Arrêtez le serveur avec Ctrl + C.",
            "Relancez npm run dev.",
            "Ouvrez l'accueil.",
            "Ouvrez Favoris.",
            "Ouvrez /biens/1.",
            "Testez desktop.",
            "Testez tablette.",
            "Testez mobile.",
          ],
        },
        {
          type: "text",
          eyebrow: "PROCHAINE LEÇON",
          title: "Leçon 19 — Tests, debug & GitHub.",
          text:
            "Le design est maintenant beaucoup plus proche d'un vrai produit. La prochaine étape sera de tester les parcours importants, nettoyer les erreurs et préparer le projet pour GitHub avant la mise en ligne.",
        },
        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 18",
          title: "Le site doit être propre sur desktop, tablette et mobile.",
          text:
            "Ne passez pas à la suite s'il reste un gros débordement horizontal.",
          items: [
            "Le Header fonctionne sur desktop.",
            "Le menu mobile s'ouvre.",
            "Le menu mobile se ferme après un clic.",
            "L'accueil ne déborde pas horizontalement.",
            "Le formulaire d'accueil reste lisible.",
            "Les cartes passent à une colonne sur petit écran.",
            "Les cartes restent espacées sur tablette.",
            "La galerie du logement s'empile sur mobile.",
            "La colonne prix n'est pas sticky sur mobile.",
            "Les titres sont redimensionnés progressivement.",
            "Les images sont fluides.",
            "À propos reste lisible.",
            "Contact reste utilisable.",
            "Le footer ne déborde pas.",
            "Favoris fonctionne en mobile.",
            "L'état vide Favoris fonctionne.",
            "La fiche logement fonctionne en mobile.",
            "Aucun scroll horizontal inutile ne reste.",
            "npm run dev compile sans erreur.",
          ],
        },
      ];

    // ====================================================
    // 19 — DESIGN FINAL : REPRODUIRE LA MAQUETTE
    // ====================================================

    case "19":
      return [
        {
          type: "text",
          eyebrow: "OBJECTIF DE LA LEÇON",
          title: "Faire correspondre le site à la maquette visuelle.",
          text:
            "Cette leçon est différente des précédentes : nous ne rajoutons presque aucune fonctionnalité. Nous allons reprendre l'interface visuelle de PropertyMatch et ajuster les pages pour retrouver l'aspect premium montré dans la maquette.",
        },

        {
          type: "visual-guide",
          eyebrow: "RÉFÉRENCE",
          title: "La maquette devient notre référence visuelle.",
          text:
            "À chaque étape, comparez votre navigateur avec le visuel. Si la structure, les proportions ou les espacements ne correspondent pas, corrigez avant de continuer.",
          visual: "design-reference",
        },

        {
          type: "concept",
          title: "Ce que nous cherchons à reproduire.",
          text:
            "Le site doit donner l'impression d'un véritable produit immobilier premium : beaucoup d'espace, une hiérarchie forte, de grandes images, des cartes propres et une palette sobre.",
          items: [
            { title: "Hiérarchie", text: "Un titre fort puis des informations secondaires plus discrètes." },
            { title: "Images", text: "Des visuels grands et bien cadrés plutôt que de petites vignettes." },
            { title: "Espace", text: "Des marges et respirations généreuses entre les sections." },
            { title: "Cohérence", text: "Le même langage visuel partout dans le site." },
          ],
        },

        // HEADER
        {
          type: "text",
          eyebrow: "ÉTAPE A — HEADER",
          title: "Commencez par la navigation.",
          text:
            "Le Header doit immédiatement donner l'impression d'un produit fini. Il doit être discret, arrondi et posé au-dessus du hero.",
        },

        {
          type: "action",
          title: "Ouvrez components/Header.tsx.",
          text:
            "Nous allons conserver la logique du menu responsive, mais renforcer son apparence.",
          actions: [
            "Ouvrez components.",
            "Ouvrez Header.tsx.",
            "Sélectionnez tout le fichier.",
            "Collez le code ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/HEADER.TSX",
          title: "Header final.",
          text:
            "Ne modifiez pas les destinations des liens. Nous changeons principalement la présentation.",
          code: `"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/favoris", label: "Favoris" },
  { href: "/#apropos", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-slate-950/70 px-5 py-3 text-white shadow-2xl backdrop-blur-xl">
          <Link
            href="/"
            className="text-base font-black tracking-[-0.04em] sm:text-lg"
          >
            PropertyMatch
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-white/60 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {open && (
          <nav className="mt-2 rounded-[24px] border border-white/10 bg-slate-950 p-3 text-white shadow-2xl md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-4 text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}`,
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTAT",
          title: "Le Header doit maintenant sembler intégré au hero.",
          text:
            "Il ne doit pas ressembler à une barre séparée collée au-dessus de la page.",
          visual: "design-header",
        },

        // HERO
        {
          type: "text",
          eyebrow: "ÉTAPE B — HERO",
          title: "Le hero est la zone qui donne le ton à tout le site.",
          text:
            "Nous voulons une grande zone sombre, un titre très fort, une courte explication et un bloc de recherche qui semble posé dans la page.",
        },

        {
          type: "action",
          title: "Ouvrez app/page.tsx.",
          text:
            "Recherchez le premier grand bloc de la page d'accueil.",
          actions: [
            "Cherchez le texte principal du hero.",
            "Ne touchez pas aux imports pour le moment.",
            "Repérez la section qui contient Header.",
            "Nous allons remplacer la partie visuelle du hero.",
          ],
        },

        {
          type: "code",
          eyebrow: "APP/PAGE.TSX",
          title: "Structure du hero final.",
          text:
            "Gardez vos variables et votre logique existantes. Cette structure concerne la présentation.",
          code: `<section className="relative min-h-[760px] overflow-hidden bg-slate-950 text-white">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_34%)]" />

  <Header />

  <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6 pb-20 pt-36 lg:px-8">
    <div className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-white/35">
        Recherche immobilière nouvelle génération
      </p>

      <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl md:text-7xl lg:text-8xl">
        Trouvez un logement
        <br />
        qui vous correspond.
      </h1>

      <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
        Définissez vos critères, comparez les logements et gardez
        uniquement les biens qui correspondent réellement à votre recherche.
      </p>
    </div>
  </div>
</section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "HERO",
          title: "Le hero doit occuper visuellement une vraie première partie de page.",
          text:
            "Le titre doit être l'élément dominant. Les éléments secondaires restent volontairement plus discrets.",
          visual: "design-hero",
        },

        // SEARCH
        {
          type: "text",
          eyebrow: "ÉTAPE C — RECHERCHE",
          title: "Faites ressortir le bloc de recherche.",
          text:
            "Le formulaire ne doit pas ressembler à un formulaire administratif. Il doit ressembler à un composant premium posé sur la page.",
        },

        {
          type: "action",
          title: "Repérez le formulaire de critères dans app/page.tsx.",
          text:
            "Conservez les inputs et les fonctions existantes. Changez uniquement le conteneur et la hiérarchie visuelle.",
          actions: [
            "Trouvez le formulaire qui contient budget, pièces ou critères.",
            "Gardez les name, value, onChange et onSubmit.",
            "Ajoutez les classes du conteneur ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "CONTENEUR DU FORMULAIRE",
          title: "Le bloc de recherche doit avoir cette forme.",
          text:
            "Le principe est : grand rayon, fond blanc, ombre légère et beaucoup d'espace intérieur.",
          code: `<div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-7">
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {/* vos champs existants */}
  </div>

  <button
    type="submit"
    className="mt-5 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800"
  >
    Rechercher les logements
  </button>
</div>`,
        },

        {
          type: "visual-guide",
          eyebrow: "RECHERCHE",
          title: "Le formulaire doit ressembler à un composant du produit.",
          text:
            "Il doit avoir suffisamment de présence pour être immédiatement identifiable, sans prendre toute l'attention du hero.",
          visual: "design-search",
        },

        // RESULTS
        {
          type: "text",
          eyebrow: "ÉTAPE D — RÉSULTATS",
          title: "La zone des résultats doit créer une vraie rupture visuelle.",
          text:
            "Après la grande partie sombre, utilisez une surface claire et beaucoup d'espace. C'est là que les cartes deviennent le contenu principal.",
        },

        {
          type: "code",
          eyebrow: "SECTION RÉSULTATS",
          title: "Structure visuelle recommandée.",
          text:
            "Ne changez pas votre logique de filtrage. Changez le wrapper et les titres.",
          code: `<section id="resultats" className="bg-[#f4f1eb]">
  <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
    <div className="flex flex-col gap-6 border-b border-slate-300 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Sélection PropertyMatch
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
          Des logements
          <br />
          sélectionnés pour vous.
        </h2>
      </div>

      <p className="max-w-sm text-sm leading-6 text-slate-500">
        Comparez les biens et ouvrez une fiche pour consulter tous les détails.
      </p>
    </div>

    <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {/* vos PropertyCard existantes */}
    </div>
  </div>
</section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "RÉSULTATS",
          title: "La section doit donner l'impression d'un catalogue premium.",
          text:
            "Le contenu respire : titre, description puis cartes suffisamment espacées.",
          visual: "design-results",
        },

        // PROPERTY CARD
        {
          type: "text",
          eyebrow: "ÉTAPE E — CARTE",
          title: "La PropertyCard est probablement l'élément le plus important après le hero.",
          text:
            "Si la carte est trop petite, trop chargée ou mal espacée, tout le site semblera amateur.",
        },

        {
          type: "action",
          title: "Ouvrez components/PropertyCard.tsx.",
          text:
            "Gardez toutes les props et la logique FavoriteButton. Nous allons surtout améliorer la hiérarchie.",
          actions: [
            "Ouvrez components/PropertyCard.tsx.",
            "Conservez id, titre, prix, surface, chambres et autres props.",
            "Conservez FavoriteButton.",
            "Remplacez la structure visuelle par le pattern ci-dessous.",
          ],
        },

        {
          type: "code",
          eyebrow: "COMPONENTS/PROPERTYCARD.TSX",
          title: "Structure visuelle d'une carte premium.",
          text:
            "Adaptez les noms de variables aux props que vous avez déjà.",
          code: `<article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
    <img
      src={image}
      alt={titre}
      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />

    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-black backdrop-blur">
      {score}% match
    </div>

    <div className="absolute right-4 top-4">
      <FavoriteButton id={id} />
    </div>
  </div>

  <div className="p-6">
    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
      {quartier}
    </p>

    <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">
      {titre}
    </h3>

    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
      {description}
    </p>

    <div className="mt-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-2xl font-black">{prix} €</p>
        <p className="mt-1 text-xs font-bold text-slate-400">
          {surface} m² · {chambres} ch.
        </p>
      </div>

      <Link
        href={\`/biens/\${id}\`}
        className="rounded-full bg-slate-950 px-5 py-3 text-xs font-black text-white"
      >
        Voir le bien
      </Link>
    </div>
  </div>
</article>`,
        },

        {
          type: "visual-guide",
          eyebrow: "CARTE",
          title: "C'est ce type de carte que nous voulons retrouver partout.",
          text:
            "Grande image, badge discret, favori, titre fort, informations courtes puis CTA.",
          visual: "design-property-card",
        },

        // DETAIL
        {
          type: "text",
          eyebrow: "ÉTAPE F — FICHE LOGEMENT",
          title: "La fiche doit donner l'impression d'entrer dans le logement.",
          text:
            "Nous gardons la galerie, mais nous augmentons son impact et réduisons les éléments inutiles autour.",
        },

        {
          type: "action",
          title: "Ouvrez app/biens/[id]/page.tsx.",
          text:
            "Commencez par la galerie et le bloc titre.",
          actions: [
            "La galerie doit être la première grande information visuelle.",
            "Le titre arrive juste après.",
            "Les caractéristiques sont regroupées.",
            "Le prix et le CTA restent visibles.",
          ],
        },

        {
          type: "code",
          eyebrow: "FICHE LOGEMENT",
          title: "Pattern de titre et informations.",
          text:
            "Conservez vos données existantes.",
          code: `<div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
  <div>
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
      {logement.quartier}
    </p>

    <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
      {logement.titre}
    </h1>

    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
      {logement.description}
    </p>

    <div className="mt-8 flex flex-wrap gap-3">
      <span className="rounded-full bg-white px-4 py-3 text-sm font-black">
        {logement.surface} m²
      </span>
      <span className="rounded-full bg-white px-4 py-3 text-sm font-black">
        {logement.chambres} chambres
      </span>
      <span className="rounded-full bg-white px-4 py-3 text-sm font-black">
        {logement.type}
      </span>
    </div>
  </div>

  <aside className="h-fit lg:sticky lg:top-8">
    <div className="rounded-[30px] bg-slate-950 p-7 text-white shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
        Prix
      </p>

      <p className="mt-3 text-4xl font-black">
        {logement.prix} €
      </p>

      <a
        href="/#contact"
        className="mt-7 block rounded-full bg-white px-5 py-4 text-center text-sm font-black text-slate-950"
      >
        Contacter l'agence
      </a>
    </div>
  </aside>
</div>`,
        },

        {
          type: "visual-guide",
          eyebrow: "FICHE",
          title: "La fiche doit paraître plus éditoriale que technique.",
          text:
            "La grande image et le titre dominent. Les détails viennent ensuite.",
          visual: "design-detail",
        },

        // ABOUT
        {
          type: "text",
          eyebrow: "ÉTAPE G — À PROPOS",
          title: "La section À propos doit conserver le même langage graphique.",
          text:
            "Pas de nouvelle palette. On garde le sombre, le crème et les cartes sobres.",
        },

        {
          type: "code",
          eyebrow: "SECTION À PROPOS",
          title: "Structure finale.",
          text:
            "Utilisez-la pour remplacer la version trop simple si nécessaire.",
          code: `<section id="apropos" className="bg-slate-950 text-white">
  <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
    <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
          À propos
        </p>

        <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.06em]">
          Moins de listes.
          <br />
          Plus de pertinence.
        </h2>
      </div>

      <div>
        <p className="max-w-2xl text-xl leading-9 text-white/55">
          PropertyMatch transforme vos critères en une sélection
          immobilière classée pour vous aider à trouver plus vite
          les logements qui correspondent réellement à votre recherche.
        </p>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Définissez"],
            ["02", "Comparez"],
            ["03", "Conservez"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xs font-black text-white/25">{number}</p>
              <p className="mt-12 text-sm font-black">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>`,
        },

        {
          type: "visual-guide",
          eyebrow: "À PROPOS",
          title: "La section doit prolonger l'identité du hero.",
          text:
            "Même noir profond, même typographie forte, même espace généreux.",
          visual: "design-about",
        },

        // CONTACT
        {
          type: "text",
          eyebrow: "ÉTAPE H — CONTACT",
          title: "Le contact devient une vraie section de conversion.",
          text:
            "Il faut une zone claire, un titre fort et un formulaire simple.",
        },

        {
          type: "visual-guide",
          eyebrow: "CONTACT",
          title: "Le formulaire doit ressembler à une vraie partie du produit.",
          text:
            "Pas besoin de fonctionnalités backend supplémentaires dans cette leçon : nous travaillons le rendu.",
          visual: "design-contact",
        },

        // FOOTER
        {
          type: "text",
          eyebrow: "ÉTAPE I — FOOTER",
          title: "Dernière zone : le footer.",
          text:
            "Il doit être sombre, très propre et beaucoup moins chargé que les zones principales.",
        },

        {
          type: "code",
          eyebrow: "FOOTER",
          title: "Footer final.",
          text:
            "Gardez vos liens existants.",
          code: `<footer className="bg-slate-950 text-white">
  <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
    <div className="grid gap-12 md:grid-cols-3">
      <div>
        <p className="text-2xl font-black tracking-[-0.04em]">
          PropertyMatch
        </p>

        <p className="mt-4 max-w-xs text-sm leading-6 text-white/35">
          Une expérience immobilière pensée autour de vos critères.
        </p>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/25">
          Navigation
        </p>

        <div className="mt-5 flex flex-col gap-3 text-sm font-bold text-white/55">
          <a href="/">Accueil</a>
          <a href="/favoris">Favoris</a>
          <a href="/#apropos">À propos</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/25">
          PropertyMatch
        </p>

        <p className="mt-5 text-sm leading-6 text-white/35">
          Recherche immobilière personnalisée.
        </p>
      </div>
    </div>

    <div className="mt-14 border-t border-white/10 pt-7 text-xs text-white/25">
      © 2026 PropertyMatch
    </div>
  </div>
</footer>`,
        },

        {
          type: "visual-guide",
          eyebrow: "FOOTER",
          title: "Le footer ferme la page sans voler l'attention.",
          text:
            "Il reprend le sombre du hero et crée une fin visuelle nette.",
          visual: "design-footer",
        },

        // FINAL COMPARISON
        {
          type: "text",
          eyebrow: "ÉTAPE J — COMPARAISON",
          title: "Maintenant, comparez réellement votre navigateur avec la maquette.",
          text:
            "Ne cherchez pas à comparer le code. Comparez uniquement ce que voit l'utilisateur.",
        },

        {
          type: "action",
          title: "Faites une capture de votre page d'accueil.",
          text:
            "Comparez-la avec la maquette de référence.",
          actions: [
            "Comparez la hauteur du hero.",
            "Comparez la taille du titre.",
            "Comparez la position du Header.",
            "Comparez la taille du formulaire.",
            "Comparez les espaces entre les sections.",
            "Comparez la taille des cartes.",
            "Comparez la palette générale.",
          ],
        },

        {
          type: "action",
          title: "Faites ensuite la même chose avec une fiche logement.",
          text:
            "Le rendu doit rester cohérent avec l'accueil.",
          actions: [
            "Comparez la taille de la galerie.",
            "Comparez le titre.",
            "Comparez les badges.",
            "Comparez la carte prix.",
            "Comparez les boutons.",
            "Comparez les espaces.",
          ],
        },

        {
          type: "visual-guide",
          eyebrow: "OBJECTIF FINAL",
          title: "Le site doit maintenant se rapprocher réellement de la maquette.",
          text:
            "Cette étape est celle où vous devez prendre le temps de corriger les différences visuelles restantes plutôt que d'ajouter encore des fonctionnalités.",
          visual: "design-final",
        },

        {
          type: "action",
          eyebrow: "IMPORTANT",
          title: "Si quelque chose ne ressemble pas à la photo, corrigez-le maintenant.",
          text:
            "Ne passez pas directement à la mise en ligne juste parce que le code compile.",
          actions: [
            "Corrigez les couleurs.",
            "Corrigez les tailles de titres.",
            "Corrigez les espacements.",
            "Corrigez les rayons des cartes.",
            "Corrigez les tailles d'images.",
            "Corrigez les boutons.",
            "Corrigez le Header.",
            "Rechargez le navigateur.",
            "Comparez encore une fois.",
          ],
        },

        {
          type: "text",
          eyebrow: "DERNIÈRE LEÇON",
          title: "Leçon 20 — Tests finaux & mise en ligne.",
          text:
            "Une fois le rendu validé, nous arrêterons les changements visuels et nous préparerons le projet pour sa publication.",
        },

        {
          type: "checkpoint",
          eyebrow: "FIN DE LA LEÇON 19",
          title: "Le design final doit être validé visuellement.",
          text:
            "Cette checklist concerne le rendu, pas uniquement le fonctionnement.",
          items: [
            "Le Header correspond à l'identité du site.",
            "Le hero possède une vraie présence visuelle.",
            "Le titre principal domine la page.",
            "Le formulaire ressemble à un composant premium.",
            "La section résultats possède une vraie hiérarchie.",
            "Les cartes ont de grandes images.",
            "Les cartes ont des rayons et ombres cohérents.",
            "Les badges ne surchargent pas les images.",
            "La fiche logement possède une galerie forte.",
            "La fiche possède une hiérarchie claire.",
            "La carte prix reste visible sur desktop.",
            "À propos utilise la même identité graphique.",
            "Contact ne ressemble pas à une page différente.",
            "Le footer reprend l'identité sombre.",
            "Les couleurs restent cohérentes partout.",
            "Les espacements sont généreux et réguliers.",
            "Le responsive de la leçon 18 fonctionne toujours.",
            "Le site ressemble réellement à la maquette de référence.",
            "Il ne reste pas de gros élément visuel qui paraît provisoire.",
          ],
        },
      ];

    default:
      return [];
  }
}

// ======================================================
// VISUAL GUIDE — INTERFACE VS CODE RECRÉÉE DANS L'APP
// ======================================================

function VisualGuide({
  type,
}: {
  type: VisualGuideType;
}) {
  if (type === "vscode-empty") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="Visual Studio Code" />

        <div className="grid min-h-[500px] grid-cols-[52px_1fr]">
          <VSCodeActivityBar active="explorer" />

          <div className="relative flex items-center justify-center bg-[#1e1e1e]">
            <div className="max-w-lg px-8 text-center">
              <div className="text-[92px] font-black leading-none text-[#252526]">
                ◇
              </div>

              <p className="mt-6 text-lg font-semibold text-[#9d9d9d]">
                Visual Studio Code
              </p>

              <p className="mt-3 text-sm leading-6 text-[#737373]">
                Aucun dossier n&apos;est encore ouvert. C&apos;est normal :
                PropertyMatch n&apos;existe pas encore.
              </p>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
                <GuideCallout
                  number="1"
                  title="Explorer"
                  text="La première icône à gauche affichera plus tard les fichiers du projet."
                />

                <GuideCallout
                  number="2"
                  title="Zone de travail"
                  text="Les fichiers que vous ouvrirez apparaîtront dans cette grande zone centrale."
                />
              </div>
            </div>

            <div className="absolute left-2 top-3 flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-2 text-[10px] font-black text-slate-950 shadow-lg">
                ① EXPLORER
              </span>
              <span className="text-lg text-white">←</span>
            </div>
          </div>
        </div>

        <VSCodeStatusBar text="Aucun projet ouvert" />
      </div>
    );
  }

  if (type === "vscode-terminal-open") {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
          <VSCodeChrome
            title="Visual Studio Code"
            highlightTerminal
            showTerminalMenu
          />

          <div className="grid min-h-[460px] grid-cols-[52px_1fr]">
            <VSCodeActivityBar />

            <div className="relative bg-[#1e1e1e]">
              <div className="flex h-full items-center justify-center text-sm text-[#5f5f5f]">
                Zone de travail
              </div>

              <div className="absolute right-6 top-6 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-2xl">
                ① TERMINAL
              </div>

              <div className="absolute right-24 top-[86px] rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-2xl">
                ② NEW TERMINAL
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
          <VSCodeChrome title="Visual Studio Code" />

          <div className="grid min-h-[500px] grid-cols-[52px_1fr]">
            <VSCodeActivityBar />

            <div className="grid grid-rows-[1fr_220px]">
              <div className="flex items-center justify-center bg-[#1e1e1e] text-sm text-[#5e5e5e]">
                Zone de travail
              </div>

              <VSCodeTerminalPanel
                prompt="jean@MacBook-Pro ~ %"
                callout="③ LE TERMINAL APPARAÎT ICI"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "vscode-terminal-cursor") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#181818] shadow-2xl">
        <div className="flex h-11 items-center gap-6 border-b border-[#303030] px-5 text-[10px] font-semibold text-[#777]">
          <span>PROBLEMS</span>
          <span>OUTPUT</span>
          <span className="h-full border-b border-white pt-[14px] text-white">
            TERMINAL
          </span>
        </div>

        <div className="p-7">
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#777]">
            REGARDEZ CETTE LIGNE
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-[#303030] bg-[#111] px-6 py-8">
            <div className="flex min-w-[540px] items-center font-mono text-[16px] text-[#d4d4d4]">
              <span>jean@MacBook-Pro ~ %</span>

              <span className="relative ml-2 inline-block h-[20px] w-[8px] bg-white">
                <span className="absolute left-1/2 top-9 w-[170px] -translate-x-1/2 rounded-xl bg-white px-3 py-3 text-center font-sans text-[10px] font-black text-slate-950 shadow-xl">
                  ÉCRIVEZ ICI
                  <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
                </span>
              </span>
            </div>

            <div className="h-20" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <GuideCallout
              number="1"
              title="Ne recopiez pas l'invite"
              text="jean@MacBook-Pro ~ % est affiché automatiquement par le terminal."
            />

            <GuideCallout
              number="2"
              title="Tapez après le symbole"
              text="Cliquez après le % ou le > puis écrivez uniquement la commande demandée."
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "project-map") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="propertymatch — Visual Studio Code" />

        <div className="grid min-h-[480px] grid-cols-[52px_270px_1fr]">
          <VSCodeActivityBar active="explorer" />

          <div className="border-r border-[#303030] bg-[#181818]">
            <div className="border-b border-[#303030] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">
                EXPLORER
              </p>
            </div>

            <div className="p-3 font-mono text-xs leading-8 text-[#bdbdbd]">
              <p className="rounded-md bg-[#252526] px-2 font-bold text-white">
                ▼ PROPERTYMATCH
              </p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">favicon.ico</p>
              <p className="pl-8">globals.css</p>
              <p className="pl-8">layout.tsx</p>
              <p className="pl-8 text-white">page.tsx</p>
              <p className="pl-4">▸ public</p>
              <p className="pl-4">package.json</p>
              <p className="pl-4">tsconfig.json</p>
            </div>
          </div>

          <div className="grid content-center gap-3 bg-[#1e1e1e] p-7">
            <GuideCallout
              number="1"
              title="propertymatch/"
              text="Le dossier principal qui contient tout le projet."
            />
            <GuideCallout
              number="2"
              title="app/"
              text="Le dossier que nous utiliserons notamment pour construire les pages."
            />
            <GuideCallout
              number="3"
              title="public/"
              text="Un emplacement pour certaines ressources publiques."
            />
            <GuideCallout
              number="4"
              title="package.json"
              text="Un fichier de configuration important du projet."
            />
          </div>
        </div>

        <VSCodeStatusBar text="propertymatch" />
      </div>
    );
  }

  if (type === "page-editor") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />

        <div className="grid min-h-[500px] grid-cols-[52px_235px_1fr]">
          <VSCodeActivityBar active="explorer" />

          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">
              EXPLORER
            </p>

            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-3">▼ app</p>
              <p className="pl-7">layout.tsx</p>
              <p className="rounded-md bg-[#37373d] pl-7 text-white">
                page.tsx
              </p>
              <p className="pl-3">▸ public</p>
              <p className="pl-3">package.json</p>
            </div>

            <div className="mt-6 rounded-lg bg-white px-3 py-2 text-center text-[9px] font-black text-slate-950">
              ① FICHIER SÉLECTIONNÉ
            </div>
          </div>

          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              page.tsx
            </div>

            <div className="p-6 font-mono text-[13px] leading-7 text-[#d4d4d4]">
              <p><span className="text-[#569cd6]">export default function</span> Home() {"{"}</p>
              <p className="pl-5"><span className="text-[#c586c0]">return</span> (</p>
              <p className="pl-10 text-[#808080]">&lt;!-- votre interface apparaîtra ici --&gt;</p>
              <p className="pl-5">);</p>
              <p>{"}"}</p>
            </div>

            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-xl">
              ② VOUS ÉCRIVEZ ICI
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "save-refresh") {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="overflow-hidden rounded-[22px] border border-[#343434] bg-[#1e1e1e] shadow-xl">
          <div className="border-b border-[#333] bg-[#181818] px-4 py-3 text-xs font-semibold text-white">
            VS Code — page.tsx
          </div>

          <div className="p-6 font-mono text-xs leading-7 text-[#d4d4d4]">
            <p>&lt;h1&gt;PropertyMatch&lt;/h1&gt;</p>
            <p>&lt;p&gt;</p>
            <p className="pl-4">Trouvez le logement qui vous correspond.</p>
            <p>&lt;/p&gt;</p>
          </div>

          <div className="border-t border-[#333] p-4">
            <p className="text-center text-xs font-bold text-white">
              ① ⌘ + S / Ctrl + S
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center text-3xl font-black text-slate-400">
          →
        </div>

        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
            <div className="rounded-lg bg-white px-4 py-2 text-center font-mono text-[10px] text-slate-600">
              http://localhost:3000
            </div>
          </div>

          <div className="p-8 text-center">
            <p className="text-2xl font-bold text-slate-950">
              PropertyMatch
            </p>

            <p className="mt-3 text-sm text-slate-500">
              Trouvez le logement qui vous correspond.
            </p>

            <div className="mt-6 inline-flex rounded-xl bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-500">
              ② RÉSULTAT MIS À JOUR
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "vscode-page04") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />

        <div className="grid min-h-[500px] grid-cols-[52px_245px_1fr]">
          <VSCodeActivityBar active="explorer" />

          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">
              EXPLORER
            </p>

            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-3">▼ app</p>

              <div className="relative rounded-md bg-[#37373d] pl-7 text-white">
                page.tsx
                <span className="absolute -right-2 top-0 translate-x-full rounded-lg bg-white px-3 py-1 font-sans text-[9px] font-black text-slate-950">
                  ① CLIQUEZ
                </span>
              </div>

              <p className="pl-3">▸ public</p>
              <p className="pl-3">package.json</p>
            </div>
          </div>

          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              page.tsx
            </div>

            <div className="p-6 font-mono text-[13px] leading-7 text-[#d4d4d4]">
              <p>export default function Home() {"{"}</p>
              <p className="pl-5">return (</p>
              <p className="pl-10">&lt;main&gt;</p>
              <p className="pl-14">&lt;h1&gt;PropertyMatch&lt;/h1&gt;</p>
              <p className="pl-10">&lt;/main&gt;</p>
              <p className="pl-5">);</p>
              <p>{"}"}</p>
            </div>

            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-xl">
              ② VOUS REMPLACEREZ TOUT CE FICHIER
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "site-lesson03") {
    return (
      <SiteBrowserFrame>
        <div className="flex min-h-[360px] items-center justify-center bg-white px-8">
          <div className="text-center">
            <h3 className="text-4xl font-black tracking-tight text-slate-950">
              PropertyMatch
            </h3>

            <p className="mt-4 text-base text-slate-600">
              Trouvez le logement qui vous correspond.
            </p>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-header-hero") {
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div>
                <p className="font-black">PropertyMatch</p>
                <p className="text-[9px] text-slate-500">
                  Trouvez mieux. Décidez plus vite.
                </p>
              </div>

              <div className="flex gap-5 text-[10px] font-bold text-slate-500">
                <span>Recherche</span>
                <span>Logements</span>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-7 px-6 py-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                Recherche immobilière intelligente
              </p>

              <h3 className="mt-3 text-3xl font-black leading-tight tracking-tight">
                Trouvez le logement qui vous correspond vraiment.
              </h3>

              <p className="mt-4 max-w-md text-xs leading-5 text-slate-600">
                Décrivez vos besoins et comparez les meilleures correspondances.
              </p>

              <div className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-[10px] font-black text-white">
                Commencer ma recherche
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black">
                  Meilleure correspondance
                </p>

                <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-black text-white">
                  92%
                </span>
              </div>

              <div className="mt-4 rounded-[18px] bg-slate-100 p-4">
                <p className="text-[9px] font-black uppercase text-slate-500">
                  Paris 16e
                </p>
                <p className="mt-2 text-lg font-black">Appartement lumineux</p>
                <p className="mt-1 text-sm font-bold">2 180 € / mois</p>
              </div>
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-search-section") {
    return (
      <SiteBrowserFrame>
        <div className="bg-white px-6 py-12 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
              Vos critères
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight">
              Décrivez le logement que vous recherchez.
            </h3>

            <div className="mt-6 grid gap-3 rounded-[22px] bg-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Ville", "Budget max", "Chambres"].map((label) => (
                <div
                  key={label}
                  className="rounded-xl bg-white p-4"
                >
                  <p className="text-[9px] font-black text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-800">
                    {label === "Ville"
                      ? "Paris"
                      : label === "Budget max"
                        ? "2300 €"
                        : "2"}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-center rounded-xl bg-slate-950 px-4 py-4 text-center text-[10px] font-black text-white">
                Trouver mes logements
              </div>
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-lesson04-final") {
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div>
                <p className="font-black">PropertyMatch</p>
                <p className="text-[9px] text-slate-500">
                  Trouvez mieux. Décidez plus vite.
                </p>
              </div>

              <div className="flex gap-5 text-[10px] font-bold text-slate-500">
                <span>Recherche</span>
                <span>Logements</span>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-7 px-6 py-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
                Recherche immobilière intelligente
              </p>
              <h3 className="mt-2 text-2xl font-black leading-tight">
                Trouvez le logement qui vous correspond vraiment.
              </h3>
              <p className="mt-3 text-[10px] leading-5 text-slate-600">
                Décrivez vos besoins et comparez les meilleures correspondances.
              </p>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-md">
              <div className="flex justify-between text-[9px] font-black">
                <span>Meilleure correspondance</span>
                <span className="rounded-full bg-slate-950 px-2 py-1 text-white">
                  92%
                </span>
              </div>
            </div>
          </div>

          <div className="border-y border-slate-200 bg-white px-6 py-8">
            <div className="mx-auto max-w-5xl">
              <p className="text-lg font-black">Votre recherche</p>

              <div className="mt-4 grid gap-2 rounded-xl bg-slate-100 p-3 sm:grid-cols-4">
                <div className="rounded-lg bg-white p-3 text-[9px] font-bold">Paris</div>
                <div className="rounded-lg bg-white p-3 text-[9px] font-bold">2300 €</div>
                <div className="rounded-lg bg-white p-3 text-[9px] font-bold">2 chambres</div>
                <div className="rounded-lg bg-slate-950 p-3 text-center text-[9px] font-black text-white">
                  Rechercher
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex items-end justify-between">
              <p className="text-xl font-black">Logements recommandés</p>
              <p className="text-[9px] text-slate-500">3 résultats</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Paris 16e", "Appartement lumineux", "2 180 €", "92%"],
                ["Paris 15e", "Loft proche des quais", "1 950 €", "84%"],
                ["Paris 17e", "Appartement familial", "2 450 €", "79%"],
              ].map(([zone, title, price, score], index) => (
                <div
                  key={title}
                  className="overflow-hidden rounded-[18px] border border-slate-200 bg-white"
                >
                  <div className={`h-20 ${index === 1 ? "bg-slate-300" : "bg-slate-200"}`} />
                  <div className="p-4">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-500">{zone}</p>
                        <p className="mt-1 text-xs font-black">{title}</p>
                      </div>
                      <span className="h-fit rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black text-white">
                        {score}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-black">{price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-responsive") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-center text-[10px] font-black tracking-[0.14em] text-slate-500">
            GRAND ÉCRAN
          </p>
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-xl">
            <div className="grid grid-cols-2 gap-4 bg-[#f7f7f5] p-6">
              <div>
                <div className="h-3 w-16 rounded bg-slate-300" />
                <div className="mt-3 h-6 w-4/5 rounded bg-slate-950" />
                <div className="mt-2 h-6 w-3/5 rounded bg-slate-950" />
              </div>
              <div className="h-28 rounded-2xl bg-white shadow" />
            </div>
            <div className="grid grid-cols-3 gap-2 p-5">
              <div className="h-20 rounded-xl bg-slate-100" />
              <div className="h-20 rounded-xl bg-slate-100" />
              <div className="h-20 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-center text-[10px] font-black tracking-[0.14em] text-slate-500">
            PETIT ÉCRAN
          </p>
          <div className="mx-auto max-w-[260px] overflow-hidden rounded-[26px] border-[6px] border-slate-950 bg-white shadow-xl">
            <div className="bg-[#f7f7f5] p-5">
              <div className="h-3 w-14 rounded bg-slate-300" />
              <div className="mt-3 h-6 w-full rounded bg-slate-950" />
              <div className="mt-2 h-6 w-4/5 rounded bg-slate-950" />
              <div className="mt-5 h-24 rounded-2xl bg-white shadow" />
            </div>
            <div className="space-y-2 p-4">
              <div className="h-16 rounded-xl bg-slate-100" />
              <div className="h-16 rounded-xl bg-slate-100" />
              <div className="h-16 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "vscode-data-location") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[470px] grid-cols-[52px_245px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">
              EXPLORER
            </p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-3">▼ app</p>
              <div className="rounded-md bg-[#37373d] pl-7 text-white">
                page.tsx
              </div>
              <p className="pl-3">▸ public</p>
              <p className="pl-3">package.json</p>
            </div>
          </div>
          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              page.tsx
            </div>
            <div className="p-6 font-mono text-[12px] leading-6 text-[#d4d4d4]">
              <p className="text-[#6a9955]">// La liste sera ajoutée ici, tout en haut</p>
              <p className="mt-3">export default function Home() {"{"}</p>
              <p className="pl-5">return (</p>
              <p className="pl-10">&lt;main ...&gt;</p>
              <p className="pl-14">...</p>
              <p className="pl-10">&lt;/main&gt;</p>
              <p className="pl-5">);</p>
              <p>{"}"}</p>
            </div>
            <div className="absolute right-6 top-14 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-xl">
              NOUS ALLONS AJOUTER LES DONNÉES ICI
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "site-data-same-result") {
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-6 py-9 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Sélection
                </p>
                <h3 className="mt-2 text-2xl font-black">
                  Logements recommandés
                </h3>
              </div>
              <p className="text-[9px] text-slate-500">3 résultats de démonstration</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Paris 16e", "Appartement lumineux", "2 180 €", "92%"],
                ["Paris 15e", "Loft proche des quais", "1 950 €", "84%"],
                ["Paris 17e", "Appartement familial", "2 450 €", "79%"],
              ].map(([zone, title, price, score]) => (
                <div key={title} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
                  <div className="h-20 bg-slate-200" />
                  <div className="p-4">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-500">{zone}</p>
                        <p className="mt-1 text-xs font-black">{title}</p>
                      </div>
                      <span className="h-fit rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black text-white">{score}</span>
                    </div>
                    <p className="mt-3 text-sm font-black">{price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-[10px] font-bold text-slate-500">
              Même rendu visuel — mais les 3 cartes viennent maintenant de const logements.
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-four-properties" || type === "site-data-final") {
    const properties = [
      ["Paris 16e", "Appartement lumineux", "2 180 €", "92%"],
      ["Paris 15e", "Loft proche des quais", "1 950 €", "84%"],
      ["Paris 17e", "Appartement familial", "2 450 €", "79%"],
      ["Paris 11e", "Deux-pièces avec terrasse", "2 050 €", "87%"],
    ];

    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-6 py-9 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Sélection
                </p>
                <h3 className="mt-2 text-2xl font-black">
                  Logements recommandés
                </h3>
              </div>
              <p className="text-[9px] text-slate-500">4 résultats de démonstration</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {properties.map(([zone, title, price, score], index) => (
                <div
                  key={title}
                  className={`overflow-hidden rounded-[18px] border bg-white ${
                    index === 3
                      ? "border-slate-950 shadow-lg"
                      : "border-slate-200"
                  }`}
                >
                  <div className={`h-16 ${index === 3 ? "bg-slate-300" : "bg-slate-200"}`} />
                  <div className="p-4">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-500">{zone}</p>
                        <p className="mt-1 text-xs font-black">{title}</p>
                      </div>
                      <span className="h-fit rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black text-white">{score}</span>
                    </div>
                    <p className="mt-3 text-sm font-black">{price}</p>
                  </div>
                </div>
              ))}
            </div>

            {type === "site-four-properties" && (
              <div className="mt-4 flex justify-end">
                <div className="rounded-xl bg-slate-950 px-4 py-2 text-[9px] font-black text-white">
                  ↑ Nouvelle carte créée automatiquement
                </div>
              </div>
            )}
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "vscode-components-folder") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="propertymatch — Visual Studio Code" />
        <div className="grid min-h-[440px] grid-cols-[52px_280px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="relative rounded-md bg-[#37373d] pl-4 font-bold text-white">
                ▸ components
                <span className="absolute left-[150px] top-0 rounded-lg bg-white px-3 py-1 font-sans text-[9px] font-black text-slate-950">
                  NOUVEAU
                </span>
              </p>
              <p className="pl-4">▸ public</p>
              <p className="pl-4">package.json</p>
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#1e1e1e] p-8">
            <div className="rounded-2xl border border-[#444] bg-[#252526] p-6 text-center">
              <p className="text-xs font-black text-white">BON EMPLACEMENT</p>
              <p className="mt-3 font-mono text-xs text-[#c5c5c5]">propertymatch/components/</p>
              <p className="mt-4 text-[10px] leading-5 text-[#999]">
                components est au même niveau que app.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "vscode-property-card") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="PropertyCard.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[440px] grid-cols-[52px_280px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▸ app</p>
              <p className="pl-4">▼ components</p>
              <p className="relative rounded-md bg-[#37373d] pl-8 font-bold text-white">
                PropertyCard.tsx
                <span className="absolute left-[165px] top-0 rounded-lg bg-white px-3 py-1 font-sans text-[9px] font-black text-slate-950">
                  ICI
                </span>
              </p>
              <p className="pl-4">▸ public</p>
              <p className="pl-4">package.json</p>
            </div>
          </div>
          <div className="bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">PropertyCard.tsx</div>
            <div className="p-7 font-mono text-xs text-[#888]">
              Le fichier est vide.<br /><br />
              C'est ici que vous allez coller le code de la carte.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "vscode-header-component") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="Header.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[420px] grid-cols-[52px_300px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▸ app</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">PropertyCard.tsx</p>
              <p className="rounded-md bg-[#37373d] pl-8 font-bold text-white">Header.tsx</p>
              <p className="pl-4">▸ public</p>
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#1e1e1e]">
            <div className="rounded-xl bg-white px-5 py-3 text-[10px] font-black text-slate-950">
              2 COMPOSANTS CRÉÉS ✓
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "site-component-same" || type === "site-component-final") {
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div>
                <p className="font-black">PropertyMatch</p>
                <p className="text-[9px] text-slate-500">Trouvez mieux. Décidez plus vite.</p>
              </div>
              <div className="flex gap-5 text-[9px] font-bold text-slate-500">
                <span>Recherche</span><span>Logements</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">Sélection</p>
                <h3 className="mt-2 text-2xl font-black">Logements recommandés</h3>
              </div>
              <p className="text-[9px] text-slate-500">4 résultats</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Paris 16e", "Appartement lumineux", "92%"],
                ["Paris 15e", "Loft proche des quais", "84%"],
                ["Paris 17e", "Appartement familial", "79%"],
                ["Paris 11e", "Deux-pièces avec terrasse", "87%"],
              ].map(([zone, title, score]) => (
                <div key={title} className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm">
                  <div className="h-16 bg-slate-200" />
                  <div className="p-3">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[7px] font-black uppercase text-slate-500">{zone}</p>
                        <p className="mt-1 text-[10px] font-black leading-tight">{title}</p>
                      </div>
                      <span className="h-fit rounded-full bg-slate-950 px-2 py-1 text-[7px] font-black text-white">{score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-[9px] font-bold text-slate-500">
              Même site visible — code désormais réparti entre page.tsx, Header.tsx et PropertyCard.tsx.
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "vscode-use-client") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[430px] grid-cols-[52px_250px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="rounded-md bg-[#37373d] pl-8 font-bold text-white">page.tsx</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
            </div>
          </div>
          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">page.tsx</div>
            <div className="p-6 font-mono text-[12px] leading-7">
              <p className="rounded bg-[#264f78] px-2 text-[#ce9178]">"use client";</p>
              <p className="mt-2 text-[#c586c0]">import <span className="text-[#dcdcaa]">{"{ useState }"}</span> <span className="text-white">from</span> <span className="text-[#ce9178]">"react"</span>;</p>
              <p className="mt-2 text-[#c586c0]">import <span className="text-[#9cdcfe]">Header</span> ...</p>
              <p className="text-[#c586c0]">import <span className="text-[#9cdcfe]">PropertyCard</span> ...</p>
            </div>
            <div className="absolute right-5 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              TOUT EN HAUT ↑
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "site-search-live" ||
    type === "site-filter-budget" ||
    type === "site-filter-balcony" ||
    type === "site-no-results" ||
    type === "site-search-final"
  ) {
    const mode =
      type === "site-filter-budget"
        ? "budget"
        : type === "site-filter-balcony"
          ? "balcony"
          : type === "site-no-results"
            ? "empty"
            : "all";

    const cards =
      mode === "budget"
        ? [["Paris 15e", "Loft proche des quais", "1 950 €", "84%"]]
        : mode === "balcony"
          ? [
              ["Paris 16e", "Appartement lumineux", "2 180 €", "92%"],
              ["Paris 17e", "Appartement familial", "2 450 €", "79%"],
            ]
          : mode === "empty"
            ? []
            : [
                ["Paris 16e", "Appartement lumineux", "2 180 €", "92%"],
                ["Paris 15e", "Loft proche des quais", "1 950 €", "84%"],
                ["Paris 17e", "Appartement familial", "2 450 €", "79%"],
                ["Paris 11e", "Deux-pièces avec terrasse", "2 050 €", "87%"],
              ];

    const budget = mode === "budget" ? "2000" : mode === "empty" ? "500" : "2600";
    const rooms = mode === "balcony" ? "2" : "1";
    const balcony = mode === "balcony";

    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div>
                <p className="text-sm font-black">PropertyMatch</p>
                <p className="text-[8px] text-slate-500">Trouvez mieux. Décidez plus vite.</p>
              </div>
              <p className="text-[8px] font-bold text-slate-500">Recherche · Logements</p>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-5 py-6">
            <div className="rounded-[20px] bg-slate-100 p-3">
              <div className="grid gap-2 sm:grid-cols-4">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[7px] font-black text-slate-500">VILLE</p>
                  <p className="mt-1 text-[10px] font-black">Paris</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[7px] font-black text-slate-500">BUDGET MAX</p>
                  <p className="mt-1 text-[10px] font-black">{budget} €</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[7px] font-black text-slate-500">CHAMBRES MIN.</p>
                  <p className="mt-1 text-[10px] font-black">{rooms}</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white p-3">
                  <div className={`flex h-4 w-4 items-center justify-center rounded border ${balcony ? "bg-slate-950 text-white" : "bg-white"}`}>
                    {balcony ? "✓" : ""}
                  </div>
                  <p className="text-[9px] font-black">Balcon obligatoire</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-slate-500">Sélection</p>
                <h3 className="mt-1 text-xl font-black">Logements recommandés</h3>
              </div>
              <div className="rounded-full bg-slate-950 px-3 py-1.5 text-[8px] font-black text-white">
                {cards.length} résultat{cards.length > 1 ? "s" : ""}
              </div>
            </div>

            {cards.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map(([zone, title, price, score]) => (
                  <div key={title} className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm">
                    <div className="h-14 bg-slate-200" />
                    <div className="p-3">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-[7px] font-black uppercase text-slate-500">{zone}</p>
                          <p className="mt-1 text-[9px] font-black leading-tight">{title}</p>
                        </div>
                        <span className="h-fit rounded-full bg-slate-950 px-2 py-1 text-[7px] font-black text-white">{score}</span>
                      </div>
                      <p className="mt-2 text-[10px] font-black">{price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-sm font-black">Aucun logement trouvé</p>
                <p className="mt-2 text-[9px] text-slate-500">Essayez d'augmenter le budget ou de réduire le nombre de chambres.</p>
              </div>
            )}
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "vscode-propertycard-image") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="PropertyCard.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[430px] grid-cols-[52px_280px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▸ app</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="rounded-md bg-[#37373d] pl-8 font-bold text-white">PropertyCard.tsx</p>
              <p className="pl-4">▸ public</p>
            </div>
          </div>
          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">PropertyCard.tsx</div>
            <div className="p-6 font-mono text-[11px] leading-6 text-[#d4d4d4]">
              <p><span className="text-[#569cd6]">export default function</span> <span className="text-[#dcdcaa]">PropertyCard</span>(...) {"{"}</p>
              <p className="pl-5 text-[#c586c0]">return</p>
              <p className="pl-10">&lt;article&gt;</p>
              <p className="pl-14 text-[#6a9955]">// photo + badges</p>
              <p className="pl-14 text-[#6a9955]">// contenu du logement</p>
              <p className="pl-14 text-[#6a9955]">// prix + bouton</p>
              <p className="pl-10">&lt;/article&gt;</p>
              <p>{"}"}</p>
            </div>
            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              LE DESIGN DES CARTES EST ICI
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "site-premium-before" ||
    type === "site-premium-cards" ||
    type === "site-premium-hover" ||
    type === "site-premium-mobile" ||
    type === "site-premium-final"
  ) {
    const premium = type !== "site-premium-before";
    const mobile = type === "site-premium-mobile";
    const hovered = type === "site-premium-hover";

    const cards = [
      ["Paris 16e", "Appartement lumineux", "2 180 €", "92%", "Appartement"],
      ["Paris 15e", "Loft proche des quais", "1 950 €", "84%", "Loft"],
      ["Paris 17e", "Appartement familial", "2 450 €", "79%", "Appartement"],
      ["Paris 11e", "Deux-pièces avec terrasse", "2 050 €", "87%", "Deux-pièces"],
    ];

    const imageBackgrounds = [
      "linear-gradient(135deg,#d8d3ca,#9f988e)",
      "linear-gradient(135deg,#c9c5bd,#7f7b75)",
      "linear-gradient(135deg,#ddd7cf,#a49a90)",
      "linear-gradient(135deg,#cbc4ba,#8e877d)",
    ];

    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div>
                <p className="text-sm font-black">PropertyMatch</p>
                <p className="text-[8px] text-slate-500">Trouvez mieux. Décidez plus vite.</p>
              </div>
              <p className="text-[8px] font-bold text-slate-500">Recherche · Logements</p>
            </div>
          </div>

          <div className={`mx-auto px-5 py-7 ${mobile ? "max-w-[320px]" : "max-w-5xl"}`}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.18em] text-slate-500">Notre sélection</p>
                <h3 className="mt-1 text-xl font-black">Logements recommandés</h3>
              </div>
              {!mobile && <span className="rounded-full border bg-white px-3 py-1.5 text-[8px] font-black">4 résultats</span>}
            </div>

            <div className={`mt-5 grid gap-4 ${mobile ? "grid-cols-1" : "sm:grid-cols-2"}`}>
              {cards.map(([zone, title, price, score, kind], index) => (
                <div
                  key={title}
                  className={`overflow-hidden border bg-white ${
                    premium ? "rounded-[20px]" : "rounded-[16px]"
                  } ${hovered && index === 0 ? "-translate-y-1 shadow-xl" : "shadow-sm"}`}
                >
                  {premium ? (
                    <div
                      className="relative h-28 overflow-hidden"
                      style={{ background: imageBackgrounds[index] }}
                    >
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(25deg,transparent 45%,rgba(255,255,255,.55) 46%,transparent 48%)" }} />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[7px] font-black">{kind}</span>
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs">♡</span>
                      <span className="absolute bottom-3 left-3 rounded-full bg-slate-950 px-2 py-1 text-[7px] font-black text-white">{score} compatible</span>
                    </div>
                  ) : (
                    <div className="h-28 bg-slate-200" />
                  )}

                  <div className="p-4">
                    <p className="text-[7px] font-black uppercase tracking-wide text-slate-400">{zone}</p>
                    <p className="mt-1 text-sm font-black">{title}</p>

                    {premium && (
                      <>
                        <p className="mt-2 text-[8px] leading-4 text-slate-500">Un intérieur soigné avec de beaux volumes et une atmosphère lumineuse.</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[7px] font-bold">◫ Chambres</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[7px] font-bold">↔ Surface</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[7px] font-bold">◇ Balcon</span>
                        </div>
                      </>
                    )}

                    <div className={`${premium ? "mt-4 border-t border-slate-100 pt-3" : "mt-3"} flex items-center justify-between`}>
                      <p className="text-xs font-black">{price}</p>
                      {premium && <span className="rounded-lg bg-slate-950 px-3 py-2 text-[7px] font-black text-white">Voir le bien</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {premium && type !== "site-premium-mobile" && (
              <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center text-[8px] font-bold text-slate-500">
                Dans votre vrai site, ces zones illustrées sont remplacées par les photos chargées depuis les URLs de page.tsx.
              </div>
            )}
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "vscode-detail-route" || type === "vscode-detail-page") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[450px] grid-cols-[52px_300px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-12">▼ [id]</p>
              <p className="rounded-md bg-[#37373d] pl-16 font-bold text-white">page.tsx</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
            </div>
          </div>
          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              app › biens › [id] › page.tsx
            </div>
            <div className="p-7 font-mono text-xs leading-7 text-[#d4d4d4]">
              <p className="text-[#6a9955]">// Cette page servira pour :</p>
              <p className="mt-3 text-[#ce9178]">/biens/1</p>
              <p className="text-[#ce9178]">/biens/2</p>
              <p className="text-[#ce9178]">/biens/3</p>
              <p className="text-[#ce9178]">/biens/4</p>
            </div>
            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              LE [id] CHANGE SELON L'URL
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "site-card-clickable") {
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-6 py-8 text-slate-950">
          <div className="mx-auto max-w-4xl">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">Notre sélection</p>
            <h3 className="mt-1 text-2xl font-black">Logements recommandés</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-lg">
                <div className="relative h-32 bg-gradient-to-br from-stone-200 to-stone-400">
                  <span className="absolute bottom-3 left-3 rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black text-white">92% compatible</span>
                </div>
                <div className="p-4">
                  <p className="text-[8px] font-black uppercase text-slate-400">Paris 16e</p>
                  <p className="mt-1 text-base font-black">Appartement lumineux</p>
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <p className="text-sm font-black">2 180 €</p>
                    <span className="rounded-lg bg-slate-950 px-3 py-2 text-[8px] font-black text-white">Voir le bien →</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white p-6 text-center">
                <div>
                  <p className="text-[10px] font-black">CLIC</p>
                  <p className="mt-2 text-2xl">→</p>
                  <p className="mt-2 font-mono text-[10px] font-bold">/biens/1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-detail-page" || type === "site-detail-final" || type === "site-detail-mobile") {
    const mobile = type === "site-detail-mobile";
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <div className={`mx-auto flex items-center justify-between ${mobile ? "max-w-[310px]" : "max-w-5xl"}`}>
              <p className="text-sm font-black">PropertyMatch</p>
              <p className="text-[8px] font-bold text-slate-500">← Retour aux logements</p>
            </div>
          </div>

          <div className={`mx-auto px-5 py-6 ${mobile ? "max-w-[310px]" : "max-w-5xl"}`}>
            <div className={`${mobile ? "h-44" : "h-64"} relative overflow-hidden rounded-[24px] bg-gradient-to-br from-stone-200 via-stone-300 to-stone-500`}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(25deg,transparent 46%,rgba(255,255,255,.7) 47%,transparent 49%)" }} />
            </div>

            <div className={`mt-6 grid gap-6 ${mobile ? "grid-cols-1" : "lg:grid-cols-[1fr_280px]"}`}>
              <div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[8px] font-black text-white">92% compatible</span>
                  <span className="rounded-full border bg-white px-3 py-1.5 text-[8px] font-black">Appartement</span>
                </div>
                <p className="mt-5 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Paris 16e</p>
                <h2 className={`${mobile ? "text-2xl" : "text-3xl"} mt-2 font-black tracking-tight`}>Appartement lumineux</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-white px-3 py-2 text-[8px] font-bold">◫ 2 chambres</span>
                  <span className="rounded-xl bg-white px-3 py-2 text-[8px] font-bold">↔ 62 m²</span>
                  <span className="rounded-xl bg-white px-3 py-2 text-[8px] font-bold">◇ Balcon</span>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="text-sm font-black">À propos de ce logement</p>
                  <p className="mt-2 text-[9px] leading-5 text-slate-500">Volumes généreux, lumière naturelle et balcon au calme. Un intérieur pensé pour être confortable au quotidien.</p>
                </div>
              </div>

              <div className="h-fit rounded-[20px] border border-slate-200 bg-white p-5 shadow-lg">
                <p className="text-[7px] font-black uppercase text-slate-400">Loyer mensuel</p>
                <p className="mt-1 text-2xl font-black">2 180 €</p>
                <p className="mt-2 text-[8px] leading-4 text-slate-500">Cette annonce correspond à 92% aux critères de votre recherche.</p>
                <div className="mt-4 rounded-xl bg-slate-950 px-4 py-3 text-center text-[8px] font-black text-white">Contacter pour ce bien</div>
                <div className="mt-2 rounded-xl border px-4 py-3 text-center text-[8px] font-black">♡ Ajouter aux favoris</div>
              </div>
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (
    type === "vscode-data-folder" ||
    type === "vscode-logements-file" ||
    type === "vscode-import-data"
  ) {
    const showFile = type !== "vscode-data-folder";
    const showImport = type === "vscode-import-data";

    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="propertymatch — Visual Studio Code" />
        <div className="grid min-h-[450px] grid-cols-[52px_300px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className={`${showImport ? "rounded-md bg-[#37373d] font-bold text-white" : ""} pl-8`}>page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-12">▸ [id]</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
              <p className={`${!showImport ? "font-bold text-white" : ""} pl-4`}>▼ data</p>
              {showFile && <p className={`${type === "vscode-logements-file" ? "rounded-md bg-[#37373d] font-bold text-white" : ""} pl-8`}>logements.ts</p>}
              <p className="pl-4">▸ public</p>
              <p className="pl-4">package.json</p>
            </div>
          </div>

          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              {showImport ? "page.tsx" : showFile ? "logements.ts" : "propertymatch"}
            </div>

            <div className="p-7 font-mono text-[11px] leading-7 text-[#d4d4d4]">
              {showImport ? (
                <>
                  <p><span className="text-[#c586c0]">"use client"</span>;</p>
                  <p className="mt-2"><span className="text-[#c586c0]">import</span> {"{ useState }"} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">"react"</span>;</p>
                  <p><span className="text-[#c586c0]">import</span> Header ...</p>
                  <p><span className="text-[#c586c0]">import</span> PropertyCard ...</p>
                  <p className="mt-2 rounded bg-[#264f78] px-2">
                    <span className="text-[#c586c0]">import</span> {"{ logements }"} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">"@/data/logements"</span>;
                  </p>
                  <p className="mt-5 text-[#6a9955]">// plus de grande liste ici</p>
                  <p><span className="text-[#569cd6]">export default function</span> <span className="text-[#dcdcaa]">Home</span>() ...</p>
                </>
              ) : showFile ? (
                <>
                  <p><span className="text-[#c586c0]">export const</span> <span className="text-[#9cdcfe]">logements</span> = [</p>
                  <p className="pl-5">{"{"}</p>
                  <p className="pl-10"><span className="text-[#9cdcfe]">id</span>: <span className="text-[#b5cea8]">1</span>,</p>
                  <p className="pl-10"><span className="text-[#9cdcfe]">ville</span>: <span className="text-[#ce9178]">"Paris"</span>,</p>
                  <p className="pl-10"><span className="text-[#9cdcfe]">titre</span>: <span className="text-[#ce9178]">"Appartement lumineux"</span>,</p>
                  <p className="pl-10">...</p>
                  <p className="pl-5">{"}"},</p>
                  <p>];</p>
                </>
              ) : (
                <>
                  <p className="text-[#6a9955]">// Nouveau dossier à créer ici :</p>
                  <p className="mt-4 text-[#dcdcaa]">PROPERTYMATCH/</p>
                  <p className="pl-5">app/</p>
                  <p className="pl-5">components/</p>
                  <p className="pl-5 font-bold text-white">data/ ← NOUVEAU</p>
                  <p className="pl-5">public/</p>
                </>
              )}
            </div>

            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              {showImport ? "LES DONNÉES SONT IMPORTÉES" : showFile ? "UN SEUL FICHIER DE DONNÉES" : "AU MÊME NIVEAU QUE APP"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "data-flow") {
    return (
      <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[20px] bg-slate-950 p-5 text-center text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Source unique</p>
            <p className="mt-2 font-mono text-sm font-black">data/logements.ts</p>
            <p className="mt-2 text-xs text-slate-300">4 logements</p>
          </div>
          <div className="py-4 text-center text-2xl">↓</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-slate-200 bg-[#f7f7f5] p-5 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Page d'accueil</p>
              <p className="mt-2 font-mono text-xs font-black">app/page.tsx</p>
              <p className="mt-3 text-[10px] text-slate-500">filtre puis affiche les cartes</p>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-[#f7f7f5] p-5 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Fiche logement</p>
              <p className="mt-2 font-mono text-xs font-black">app/biens/[id]/page.tsx</p>
              <p className="mt-3 text-[10px] text-slate-500">cherche le logement demandé</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "site-shared-data" || type === "site-shared-data-final") {
    const changed = type === "site-shared-data";
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-5 py-7 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
                <div className="h-28 bg-gradient-to-br from-stone-200 to-stone-400" />
                <div className="p-4">
                  <p className="text-[8px] font-black uppercase text-slate-400">Accueil · Paris 16e</p>
                  <p className="mt-1 text-base font-black">Appartement lumineux</p>
                  <p className="mt-4 text-lg font-black">{changed ? "2 190 €" : "2 180 €"}</p>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[8px] font-black uppercase text-slate-400">Fiche · /biens/1</p>
                <p className="mt-2 text-lg font-black">Appartement lumineux</p>
                <p className="mt-5 text-[8px] font-black uppercase text-slate-400">Loyer mensuel</p>
                <p className="mt-1 text-3xl font-black">{changed ? "2 190 €" : "2 180 €"}</p>
                <div className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-center text-[8px] font-black text-white">Contacter pour ce bien</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center text-[9px] font-black text-slate-600">
              {changed ? "1 modification dans logements.ts → les 2 écrans utilisent 2 190 €" : "Les deux écrans utilisent maintenant la même source de données."}
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (
    type === "vscode-favorite-button" ||
    type === "vscode-propertycard-favorite" ||
    type === "vscode-detail-favorite"
  ) {
    const mode =
      type === "vscode-favorite-button"
        ? "new"
        : type === "vscode-propertycard-favorite"
          ? "card"
          : "detail";

    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="propertymatch — Visual Studio Code" />
        <div className="grid min-h-[450px] grid-cols-[52px_310px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-12">▼ [id]</p>
              <p className={`${mode === "detail" ? "rounded-md bg-[#37373d] font-bold text-white" : ""} pl-16`}>page.tsx</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className={`${mode === "card" ? "rounded-md bg-[#37373d] font-bold text-white" : ""} pl-8`}>PropertyCard.tsx</p>
              <p className={`${mode === "new" ? "rounded-md bg-[#37373d] font-bold text-white" : ""} pl-8`}>FavoriteButton.tsx</p>
              <p className="pl-4">▼ data</p>
              <p className="pl-8">logements.ts</p>
            </div>
          </div>

          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              {mode === "new"
                ? "FavoriteButton.tsx"
                : mode === "card"
                  ? "PropertyCard.tsx"
                  : "app › biens › [id] › page.tsx"}
            </div>

            <div className="p-7 font-mono text-[11px] leading-7 text-[#d4d4d4]">
              {mode === "new" ? (
                <>
                  <p className="text-[#c586c0]">"use client";</p>
                  <p className="mt-3"><span className="text-[#569cd6]">export default function</span> FavoriteButton(...) {"{"}</p>
                  <p className="pl-5 text-[#6a9955]">// mémorise le favori</p>
                  <p className="pl-5 text-[#6a9955]">// localStorage</p>
                  <p className="pl-5 text-[#6a9955]">// affiche ♡ ou ♥</p>
                  <p>{"}"}</p>
                </>
              ) : mode === "card" ? (
                <>
                  <p><span className="text-[#c586c0]">import</span> FavoriteButton ...</p>
                  <p className="mt-4">&lt;div className="..."&gt;</p>
                  <p className="pl-5">&lt;span&gt;{"{type}"}&lt;/span&gt;</p>
                  <p className="pl-5 rounded bg-[#264f78] px-2">&lt;FavoriteButton id={"{"}id{"}"} /&gt;</p>
                  <p>&lt;/div&gt;</p>
                </>
              ) : (
                <>
                  <p><span className="text-[#c586c0]">import</span> FavoriteButton ...</p>
                  <p className="mt-4">&lt;aside&gt;</p>
                  <p className="pl-5">&lt;button&gt;Contacter...&lt;/button&gt;</p>
                  <p className="pl-5 rounded bg-[#264f78] px-2">&lt;FavoriteButton id={"{"}logement.id{"}"} variant="full" /&gt;</p>
                  <p>&lt;/aside&gt;</p>
                </>
              )}
            </div>

            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              {mode === "new"
                ? "NOUVEAU COMPOSANT"
                : mode === "card"
                  ? "REMPLACE LE FAUX CŒUR"
                  : "SOUS LE BOUTON CONTACT"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "site-favorite-before" ||
    type === "site-favorite-clicked" ||
    type === "site-favorite-persist" ||
    type === "site-favorite-final"
  ) {
    const active = type !== "site-favorite-before";

    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-5 py-7 text-slate-950">
          <div className="mx-auto max-w-4xl">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">Notre sélection</p>
            <h3 className="mt-1 text-2xl font-black">Logements recommandés</h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-lg">
                <div className="relative h-36 bg-gradient-to-br from-stone-200 to-stone-400">
                  <span className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-[8px] font-black">Appartement</span>
                  <span className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow ${active ? "bg-slate-950 text-white" : "bg-white text-slate-950"}`}>
                    {active ? "♥" : "♡"}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black text-white">92% compatible</span>
                </div>
                <div className="p-4">
                  <p className="text-[8px] font-black uppercase text-slate-400">Paris 16e</p>
                  <p className="mt-1 text-base font-black">Appartement lumineux</p>
                  <p className="mt-3 text-sm font-black">2 180 €</p>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white p-6 text-center">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {type === "site-favorite-before" ? "AVANT" : type === "site-favorite-persist" ? "APRÈS RECHARGEMENT" : "APRÈS CLIC"}
                  </p>
                  <p className="mt-3 text-4xl">{active ? "♥" : "♡"}</p>
                  <p className="mt-3 text-[10px] font-black">
                    {active ? "Favori enregistré" : "Bouton encore décoratif"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "site-favorite-detail") {
    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-5 py-7 text-slate-950">
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-[1fr_270px]">
            <div>
              <div className="h-44 rounded-[24px] bg-gradient-to-br from-stone-200 to-stone-400" />
              <p className="mt-5 text-[8px] font-black uppercase text-slate-400">Paris 16e</p>
              <h3 className="mt-1 text-2xl font-black">Appartement lumineux</h3>
            </div>

            <div className="h-fit rounded-[22px] border border-slate-200 bg-white p-5 shadow-lg">
              <p className="text-[8px] font-black uppercase text-slate-400">Loyer mensuel</p>
              <p className="mt-1 text-3xl font-black">2 180 €</p>
              <div className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-center text-[8px] font-black text-white">Contacter pour ce bien</div>
              <div className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-center text-[8px] font-black text-white">♥ Retirer des favoris</div>
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "matching-code") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[430px] grid-cols-[52px_285px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="rounded-md bg-[#37373d] pl-8 font-bold text-white">page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-12">▸ [id]</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">FavoriteButton.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
              <p className="pl-4">▼ data</p>
              <p className="pl-8">logements.ts</p>
            </div>
          </div>
          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">app › page.tsx</div>
            <div className="p-7 font-mono text-[11px] leading-7 text-[#d4d4d4]">
              <p><span className="text-[#569cd6]">export default function</span> Home() {"{"}</p>
              <p className="pl-5">const [budget, setBudget] = ...</p>
              <p className="pl-5">const [chambres, setChambres] = ...</p>
              <p className="pl-5">const [balcon, setBalcon] = ...</p>
              <p className="mt-3 rounded bg-[#264f78] px-2 pl-5"><span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">calculerScore</span>(logement) {"{"}</p>
              <p className="pl-10">let score = 0;</p>
              <p className="pl-10">...</p>
              <p className="pl-10">return score;</p>
              <p className="pl-5">{"}"}</p>
              <p className="mt-3 pl-5">const logementsFiltres = ...</p>
              <p className="pl-5">const logementsAvecScore = ...</p>
              <p className="mt-3 pl-5"><span className="text-[#c586c0]">return</span> (...)</p>
              <p>{"}"}</p>
            </div>
            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              AVANT LE RETURN
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "matching-before" ||
    type === "matching-form" ||
    type === "matching-results" ||
    type === "matching-budget" ||
    type === "matching-bedroom" ||
    type === "matching-balcony" ||
    type === "matching-final"
  ) {
    const before = type === "matching-before";
    const scores =
      type === "matching-budget"
        ? ["100%", "65%", "50%"]
        : type === "matching-bedroom"
          ? ["100%", "80%", "65%"]
          : type === "matching-balcony"
            ? ["100%", "80%", "50%"]
            : before
              ? ["92%", "84%", "79%"]
              : ["100%", "80%", "65%"];

    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] px-5 py-7 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[22px] bg-slate-950 p-5 text-white">
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">Votre recherche</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-900 p-3">
                  <p className="text-[7px] text-slate-500">Budget</p>
                  <p className="mt-1 text-[10px] font-black">{type === "matching-budget" ? "2 000 €" : "2 300 €"}</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-3">
                  <p className="text-[7px] text-slate-500">Chambres</p>
                  <p className="mt-1 text-[10px] font-black">{type === "matching-bedroom" ? "3" : "2"}</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-3">
                  <p className="text-[7px] text-slate-500">Balcon</p>
                  <p className="mt-1 text-[10px] font-black">{type === "matching-balcony" ? "Oui" : "Oui"}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {before ? "SCORES FIXES" : "MATCHING CALCULÉ"}
                </p>
                <p className="mt-1 text-lg font-black">Logements recommandés</p>
              </div>
              {!before && <span className="rounded-full bg-slate-950 px-3 py-2 text-[8px] font-black text-white">Meilleur score ↓</span>}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Paris 16e", "Appartement lumineux", "2 180 €"],
                ["Paris 11e", "Deux-pièces terrasse", "2 050 €"],
                ["Paris 15e", "Loft proche des quais", "1 950 €"],
              ].map((item, i) => (
                <div key={item[0]} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-24 bg-gradient-to-br from-stone-200 to-stone-400">
                    <span className="absolute bottom-2 left-2 rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black text-white">{scores[i]} compatible</span>
                  </div>
                  <div className="p-3">
                    <p className="text-[7px] font-black uppercase text-slate-400">{item[0]}</p>
                    <p className="mt-1 text-[11px] font-black">{item[1]}</p>
                    <p className="mt-3 text-[10px] font-black">{item[2]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center text-[9px] font-black text-slate-600">
              {before
                ? "Les pourcentages ne changent pas encore avec la recherche."
                : "Les critères → calcul du score → classement automatique."}
            </div>
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

  if (type === "nav-header-code") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="Header.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[420px] grid-cols-[52px_285px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-12">▸ [id]</p>
              <p className="pl-4">▼ components</p>
              <p className="rounded-md bg-[#37373d] pl-8 font-bold text-white">Header.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
              <p className="pl-8">FavoriteButton.tsx</p>
            </div>
          </div>
          <div className="relative bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">components › Header.tsx</div>
            <div className="p-7 font-mono text-[11px] leading-7 text-[#d4d4d4]">
              <p><span className="text-[#c586c0]">import</span> Link <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">"next/link"</span>;</p>
              <p className="mt-4">&lt;Link href=<span className="text-[#ce9178]">"/"</span>&gt;</p>
              <p className="pl-5">PropertyMatch</p>
              <p>&lt;/Link&gt;</p>
              <p className="mt-3 rounded bg-[#264f78] px-2">&lt;Link href=<span className="text-[#ce9178]">"/"</span>&gt;Accueil&lt;/Link&gt;</p>
              <p className="mt-2 rounded bg-[#264f78] px-2">&lt;Link href=<span className="text-[#ce9178]">"/favoris"</span>&gt;Favoris&lt;/Link&gt;</p>
            </div>
            <div className="absolute right-6 top-16 rounded-xl bg-white px-4 py-3 text-[9px] font-black text-slate-950 shadow-xl">
              DE VRAIES URLS
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "nav-before" ||
    type === "nav-home" ||
    type === "nav-favorites-empty" ||
    type === "nav-favorites-page" ||
    type === "nav-favorites-filled" ||
    type === "nav-flow" ||
    type === "nav-final"
  ) {
    const empty = type === "nav-favorites-empty";
    const favorites =
      type === "nav-favorites-page" ||
      type === "nav-favorites-filled";
    const flow = type === "nav-flow";

    if (flow) {
      return (
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-slate-950 p-5 text-center text-white">
                <p className="text-[9px] font-black uppercase text-slate-500">/</p>
                <p className="mt-2 text-sm font-black">Accueil</p>
                <p className="mt-2 text-[9px] text-slate-400">Recherche + matching</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-[#f7f7f5] p-5 text-center">
                <p className="text-[9px] font-black uppercase text-slate-400">/favoris</p>
                <p className="mt-2 text-sm font-black">Favoris</p>
                <p className="mt-2 text-[9px] text-slate-500">Biens enregistrés</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-[#f7f7f5] p-5 text-center">
                <p className="text-[9px] font-black uppercase text-slate-400">/biens/1</p>
                <p className="mt-2 text-sm font-black">Fiche</p>
                <p className="mt-2 text-[9px] text-slate-500">Détail d'un logement</p>
              </div>
            </div>
            <div className="mt-5 text-center text-xl">↔ &nbsp; ↔ &nbsp; ↔</div>
            <p className="mt-3 text-center text-[10px] font-black text-slate-500">Le même Header relie les différentes pages.</p>
          </div>
        </div>
      );
    }

    return (
      <SiteBrowserFrame>
        <div className="bg-[#f7f7f5] text-slate-950">
          <div className="border-b border-slate-200 bg-white px-5 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <p className="text-sm font-black">PropertyMatch</p>
              <div className="flex gap-2">
                <span className="rounded-lg px-3 py-2 text-[8px] font-black">Accueil</span>
                <span className={`rounded-lg px-3 py-2 text-[8px] font-black ${favorites || empty ? "bg-slate-950 text-white" : "bg-slate-100"}`}>Favoris</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-5 py-7">
            {empty ? (
              <>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Votre sélection</p>
                <h3 className="mt-2 text-2xl font-black">Vos logements favoris</h3>
                <div className="mt-6 rounded-[22px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-3xl">♡</p>
                  <p className="mt-3 text-base font-black">Aucun favori pour le moment</p>
                  <p className="mx-auto mt-2 max-w-sm text-[9px] leading-5 text-slate-500">Ajoutez un logement depuis la recherche pour le retrouver ici.</p>
                  <span className="mt-4 inline-block rounded-xl bg-slate-950 px-4 py-3 text-[8px] font-black text-white">Découvrir les logements</span>
                </div>
              </>
            ) : favorites ? (
              <>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Votre sélection</p>
                <h3 className="mt-2 text-2xl font-black">Vos logements favoris</h3>
                <p className="mt-2 text-[9px] text-slate-500">2 logements enregistrés</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Paris 16e", "Appartement lumineux", "2 180 €"],
                    ["Paris 11e", "Deux-pièces avec terrasse", "2 050 €"],
                  ].map((item) => (
                    <div key={item[0]} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
                      <div className="relative h-24 bg-gradient-to-br from-stone-200 to-stone-400">
                        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[10px] text-white">♥</span>
                      </div>
                      <div className="p-3">
                        <p className="text-[7px] font-black uppercase text-slate-400">{item[0]}</p>
                        <p className="mt-1 text-[11px] font-black">{item[1]}</p>
                        <p className="mt-3 text-[10px] font-black">{item[2]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[22px] bg-slate-950 p-6 text-white">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">PropertyMatch</p>
                  <h3 className="mt-2 text-2xl font-black">Trouvez le logement qui vous correspond.</h3>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-slate-900 p-3 text-[8px]">Paris</div>
                    <div className="rounded-xl bg-slate-900 p-3 text-[8px]">2 300 €</div>
                    <div className="rounded-xl bg-slate-900 p-3 text-[8px]">2 chambres</div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400">PARIS 16E</p>
                    <p className="mt-1 text-sm font-black">Appartement lumineux</p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400">PARIS 11E</p>
                    <p className="mt-1 text-sm font-black">Deux-pièces avec terrasse</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SiteBrowserFrame>
    );
  }

function PremiumMiniCard({
  title,
  score,
}: {
  title: string;
  score: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative h-24 bg-gradient-to-br from-stone-200 via-stone-300 to-stone-500">
        <span className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-[7px] font-black">
          {score} MATCH
        </span>
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[9px]">
          ♡
        </span>
      </div>
      <div className="p-3">
        <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
          Paris
        </p>
        <p className="mt-1 text-[10px] font-black">{title}</p>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-[10px] font-black">2 180 €</p>
          <p className="text-[7px] text-slate-400">2 ch · 68 m²</p>
        </div>
      </div>
    </div>
  );
}

function PremiumHomeMock({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-300 bg-[#f4f1eb] shadow-2xl">
      <div className={`relative overflow-hidden bg-slate-800 ${compact ? "min-h-[260px]" : "min-h-[390px]"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-500 via-slate-700 to-slate-950" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 flex items-center justify-between px-6 py-5 text-white">
          <p className="text-[11px] font-black">PropertyMatch</p>
          <div className="flex gap-4 text-[7px] font-bold text-white/70">
            <span>Accueil</span>
            <span>Favoris</span>
            <span>À propos</span>
            <span>Contact</span>
          </div>
        </div>

        <div className="relative z-10 px-6 pb-7 pt-12 text-white">
          <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/55">
            Immobilier personnalisé
          </p>
          <p className={`${compact ? "text-3xl" : "text-5xl"} mt-3 max-w-xl font-black leading-[0.92] tracking-[-0.055em]`}>
            Trouvez le logement
            <br />
            qui vous correspond.
          </p>
          <p className="mt-4 max-w-md text-[9px] leading-5 text-white/60">
            Des logements classés selon leur compatibilité avec vos critères.
          </p>

          <div className="mt-7 grid gap-1 rounded-2xl bg-white p-2 text-slate-950 md:grid-cols-5">
            {["Paris", "2 300 €", "2 chambres", "Balcon"].map((value) => (
              <div key={value} className="rounded-xl px-3 py-3">
                <p className="text-[5px] font-black uppercase tracking-wider text-slate-400">
                  Critère
                </p>
                <p className="mt-1 text-[7px] font-black">{value}</p>
              </div>
            ))}
            <div className="flex items-center justify-center rounded-xl bg-slate-950 px-3 py-3 text-[7px] font-black text-white">
              Voir les matchs
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b bg-white px-6 py-5">
        {[
          ["12", "logements"],
          ["96%", "meilleur match"],
          ["Live", "recalcul"],
        ].map(([a, b]) => (
          <div key={b}>
            <p className="text-sm font-black">{a}</p>
            <p className="mt-1 text-[6px] text-slate-400">{b}</p>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="p-6">
          <p className="text-[7px] font-black uppercase tracking-[0.18em] text-slate-400">
            Sélection personnalisée
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight">
            Les meilleurs matchs pour vous.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <PremiumMiniCard title="Appartement lumineux" score="96%" />
            <PremiumMiniCard title="Loft proche des quais" score="88%" />
          </div>
        </div>
      )}
    </div>
  );
}

  if (type === "premium-vscode-home") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[430px] grid-cols-[52px_280px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbb]">
              EXPLORER
            </p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="rounded bg-[#37373d] pl-8 font-bold text-white">
                page.tsx ← ICI
              </p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-8">▼ favoris</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
              <p className="pl-4">▼ data</p>
              <p className="pl-8">logements.ts</p>
            </div>
          </div>
          <div className="bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              app › page.tsx
            </div>
            <div className="p-6 font-mono text-[10px] leading-7 text-[#d4d4d4]">
              <p><span className="text-[#c586c0]">"use client"</span>;</p>
              <p className="mt-3"><span className="text-[#c586c0]">import</span> Header ...</p>
              <p><span className="text-[#c586c0]">import</span> PropertyCard ...</p>
              <p className="mt-4 text-[#6a9955]">// C'est cette page que nous refaisons.</p>
              <p className="mt-3 rounded bg-[#264f78] px-2">
                export default function HomePage() &#123;
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "premium-target" || type === "premium-home-final") {
    return (
      <div className="mx-auto max-w-5xl">
        <PremiumHomeMock />
      </div>
    );
  }

  if (type === "premium-before") {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            Avant
          </p>
          <div className="rounded-[24px] border border-slate-200 bg-[#f7f7f5] p-5">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-black">PropertyMatch</p>
              <p className="mt-8 text-3xl font-black">Trouvez votre logement.</p>
              <div className="mt-5 grid gap-2">
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            Direction premium
          </p>
          <PremiumHomeMock compact />
        </div>
      </div>
    );
  }

  if (
    type === "premium-header" ||
    type === "premium-hero" ||
    type === "premium-search"
  ) {
    return (
      <div className="mx-auto max-w-4xl">
        <PremiumHomeMock compact />
      </div>
    );
  }

  if (type === "premium-trust") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-8 md:grid-cols-3">
          {[
            ["12", "logements analysés"],
            ["96%", "meilleur score actuel"],
            ["Instantané", "recalcul des critères"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-3xl font-black tracking-[-0.04em]">{value}</p>
              <p className="mt-2 text-xs font-medium text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "premium-results-preview") {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-[#f4f1eb] p-7">
        <div className="flex items-end justify-between gap-6 border-b border-slate-300 pb-6">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
              Sélection personnalisée
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight">
              Les meilleurs matchs
              <br />
              pour votre recherche.
            </p>
          </div>
          <p className="max-w-xs text-[9px] leading-5 text-slate-500">
            Le design des cartes sera entièrement finalisé dans la leçon 15.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PremiumMiniCard title="Appartement lumineux" score="96%" />
          <PremiumMiniCard title="Loft proche des quais" score="88%" />
        </div>
      </div>
    );
  }

function ResultCardMock({
  score = "96%",
  title = "Appartement lumineux",
  featured = false,
}: {
  score?: string;
  title?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={
        "overflow-hidden rounded-[22px] border bg-white " +
        (featured
          ? "border-slate-950 shadow-xl"
          : "border-slate-200 shadow-sm")
      }
    >
      <div className="relative h-36 bg-gradient-to-br from-stone-200 via-stone-300 to-stone-500">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1.5 text-[7px] font-black uppercase">
          Appartement
        </span>
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px]">
          ♡
        </span>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="rounded-full bg-white px-2.5 py-1.5 text-[8px] font-black">
            {score} match
          </span>
          <span className="rounded-full bg-slate-950/70 px-2.5 py-1.5 text-[7px] font-black text-white">
            Excellent match
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-[6px] font-black uppercase tracking-wider text-slate-400">
              Paris 16e
            </p>
            <p className="mt-1 text-sm font-black">{title}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black">2 180 €</p>
            <p className="text-[6px] text-slate-400">PAR MOIS</p>
          </div>
        </div>
        <p className="mt-3 text-[8px] leading-4 text-slate-500">
          Volumes généreux, lumière naturelle et balcon au calme.
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="rounded-full bg-[#f4f1eb] px-2 py-1 text-[7px] font-bold">
            2 chambres
          </span>
          <span className="rounded-full bg-[#f4f1eb] px-2 py-1 text-[7px] font-bold">
            68 m²
          </span>
          <span className="rounded-full bg-[#f4f1eb] px-2 py-1 text-[7px] font-bold">
            Balcon
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-[6px] text-slate-400">Sélection PropertyMatch</span>
          <span className="rounded-full bg-slate-950 px-3 py-2 text-[7px] font-black text-white">
            Voir le bien →
          </span>
        </div>
      </div>
    </div>
  );
}

  if (type === "cards-vscode") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="PropertyCard.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[420px] grid-cols-[52px_285px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="rounded bg-[#37373d] pl-8 font-bold text-white">PropertyCard.tsx ← ICI</p>
              <p className="pl-8">FavoriteButton.tsx</p>
              <p className="pl-4">▼ data</p>
              <p className="pl-8">logements.ts</p>
            </div>
          </div>
          <div className="bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              components › PropertyCard.tsx
            </div>
            <div className="p-6 font-mono text-[10px] leading-7 text-[#d4d4d4]">
              <p><span className="text-[#c586c0]">import</span> Link ...</p>
              <p><span className="text-[#c586c0]">import</span> FavoriteButton ...</p>
              <p className="mt-4">type PropertyCardProps = &#123; ... &#125;;</p>
              <p className="mt-4 rounded bg-[#264f78] px-2">
                export default function PropertyCard(...)
              </p>
              <p className="mt-3 text-[#6a9955]">// Une modification ici = toutes les cartes changent.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "cards-target" ||
    type === "cards-photo" ||
    type === "cards-score" ||
    type === "cards-details" ||
    type === "cards-grid" ||
    type === "cards-hover" ||
    type === "cards-best-match" ||
    type === "cards-final"
  ) {
    const featured = type === "cards-best-match";
    return (
      <div className="rounded-[26px] border border-slate-200 bg-[#f4f1eb] p-6 shadow-sm">
        <div className="flex items-end justify-between gap-5 border-b border-slate-300 pb-5">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.18em] text-slate-400">
              Sélection personnalisée
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight">
              Les meilleurs matchs pour vous.
            </p>
          </div>
          <p className="text-[8px] text-slate-500">Classés par compatibilité ↓</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <ResultCardMock featured={featured} />
          <ResultCardMock score="84%" title="Loft proche des quais" />
        </div>
      </div>
    );
  }

  if (type === "cards-before") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[22px] border border-slate-200 bg-white p-5">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Avant</p>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <div className="h-20 bg-slate-200" />
            <div className="p-3">
              <p className="text-xs font-black">Appartement lumineux</p>
              <p className="mt-2 text-[9px] text-slate-500">2 180 € · 2 chambres · 68 m²</p>
            </div>
          </div>
        </div>
        <div className="rounded-[22px] border border-slate-200 bg-[#f4f1eb] p-5">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Après</p>
          <div className="mt-4">
            <ResultCardMock />
          </div>
        </div>
      </div>
    );
  }

function DetailGalleryMock() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <div className="h-64 rounded-[22px] bg-gradient-to-br from-stone-200 via-stone-300 to-stone-500" />
      <div className="grid gap-3">
        <div className="h-[122px] rounded-[22px] bg-gradient-to-br from-stone-100 to-stone-400" />
        <div className="h-[122px] rounded-[22px] bg-gradient-to-br from-stone-300 to-slate-500" />
      </div>
    </div>
  );
}

  if (type === "detail-vscode") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[420px] grid-cols-[52px_300px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-12">▼ [id]</p>
              <p className="rounded bg-[#37373d] pl-16 font-bold text-white">page.tsx ← ICI</p>
              <p className="pl-8">▼ favoris</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">Header.tsx</p>
              <p className="pl-8">PropertyCard.tsx</p>
            </div>
          </div>
          <div className="bg-[#1e1e1e]">
            <div className="border-b border-[#303030] bg-[#181818] px-4 py-2 text-xs text-white">
              app › biens › [id] › page.tsx
            </div>
            <div className="p-6 font-mono text-[10px] leading-7 text-[#d4d4d4]">
              <p><span className="text-[#c586c0]">import</span> Header ...</p>
              <p><span className="text-[#c586c0]">import</span> FavoriteButton ...</p>
              <p className="mt-4 rounded bg-[#264f78] px-2">
                export default async function DetailPage(...)
              </p>
              <p className="mt-4 text-[#6a9955]">// Une seule page pour /biens/1, /biens/2, etc.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "detail-data-gallery") {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
              data/logements.ts
            </p>
            <pre className="mt-4 overflow-hidden rounded-xl bg-slate-950 p-4 text-[9px] leading-6 text-slate-300">
{`image: "photo-principale",

galerie: [
  "photo-1",
  "photo-2",
  "photo-3",
]`}
            </pre>
          </div>
          <DetailGalleryMock />
        </div>
      </div>
    );
  }

  if (
    type === "detail-target" ||
    type === "detail-gallery" ||
    type === "detail-info" ||
    type === "detail-sidebar" ||
    type === "detail-match" ||
    type === "detail-equipment" ||
    type === "detail-contact" ||
    type === "detail-final"
  ) {
    return (
      <div className="rounded-[26px] border border-slate-200 bg-[#f4f1eb] p-6 shadow-sm">
        <DetailGalleryMock />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="flex gap-2">
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[7px] font-black text-white">Appartement</span>
              <span className="rounded-full border bg-white px-3 py-1.5 text-[7px] font-black">Paris 16e</span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight">Appartement lumineux</p>
            <p className="mt-2 max-w-xl text-[9px] leading-5 text-slate-500">
              Volumes généreux, lumière naturelle et balcon au calme.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                ["2", "Chambres"],
                ["68 m²", "Surface"],
                ["Balcon", "Extérieur"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-white p-3">
                  <p className="text-[6px] font-black uppercase text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-black">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-[7px] font-black uppercase tracking-wider text-white/40">Pourquoi ce bien vous correspond</p>
              <p className="mt-2 text-sm font-black">PropertyMatch analyse vos critères.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/5 p-3 text-[7px]">Budget</div>
                <div className="rounded-xl bg-white/5 p-3 text-[7px]">Espace</div>
                <div className="rounded-xl bg-white/5 p-3 text-[7px]">Balcon</div>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-[22px] bg-white p-5 shadow-lg">
            <p className="text-[7px] font-black uppercase text-slate-400">Loyer mensuel</p>
            <p className="mt-1 text-3xl font-black">2 180 €</p>
            <p className="mt-3 text-[8px] leading-4 text-slate-500">Consultez les caractéristiques puis contactez l'agence.</p>
            <div className="mt-4 rounded-full bg-slate-950 px-4 py-3 text-center text-[8px] font-black text-white">
              Contacter l'agence
            </div>
            <div className="mt-2 rounded-full border px-4 py-3 text-center text-[8px] font-black">
              ♡ Ajouter aux favoris
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "detail-before") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[22px] border border-slate-200 bg-white p-5">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Avant</p>
          <div className="mt-4 h-36 rounded-xl bg-slate-200" />
          <p className="mt-4 text-lg font-black">Appartement lumineux</p>
          <p className="mt-2 text-[9px] text-slate-500">2 chambres · 68 m² · 2 180 €</p>
        </div>
        <div className="rounded-[22px] border border-slate-200 bg-[#f4f1eb] p-5">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Après</p>
          <DetailGalleryMock />
        </div>
      </div>
    );
  }

  if (type === "favorites-vscode") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="page.tsx — favoris — propertymatch — Visual Studio Code" />
        <div className="grid min-h-[390px] grid-cols-[52px_290px_1fr]">
          <VSCodeActivityBar active="explorer" />
          <div className="border-r border-[#303030] bg-[#181818] p-3">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbb]">EXPLORER</p>
            <div className="mt-4 font-mono text-xs leading-8 text-[#aaa]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-4">▼ app</p>
              <p className="pl-8">page.tsx</p>
              <p className="pl-8">▼ biens</p>
              <p className="pl-8">▼ favoris</p>
              <p className="rounded bg-[#37373d] pl-12 font-bold text-white">page.tsx ← ICI</p>
              <p className="pl-4">▼ components</p>
              <p className="pl-8">PropertyCard.tsx</p>
            </div>
          </div>
          <div className="p-6 font-mono text-[10px] leading-7 text-[#d4d4d4]">
            <p><span className="text-[#c586c0]">"use client"</span>;</p>
            <p className="mt-3">const [favoriteIds, setFavoriteIds] = ...</p>
            <p className="mt-3 rounded bg-[#264f78] px-2">export default function FavorisPage()</p>
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "ecosystem-target" ||
    type === "favorites-premium" ||
    type === "header-final" ||
    type === "about-section" ||
    type === "contact-section" ||
    type === "footer-final" ||
    type === "ecosystem-final"
  ) {
    return (
      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-[#f4f1eb] shadow-sm">
        <div className="bg-slate-950 px-6 pb-12 pt-5 text-white">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black">PropertyMatch</p>
            <div className="flex gap-3 text-[6px] font-bold text-white/60">
              <span>Accueil</span><span>Favoris</span><span>À propos</span><span>Contact</span>
            </div>
          </div>
          <p className="mt-10 text-[7px] font-black uppercase tracking-wider text-white/35">Votre sélection</p>
          <p className="mt-2 text-3xl font-black leading-7">Les logements<br />que vous avez retenus.</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ResultCardMock score="96%" title="Appartement lumineux" />
            <ResultCardMock score="84%" title="Loft proche des quais" />
          </div>
        </div>
        <div className="bg-[#e8e2d8] p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-[7px] font-black uppercase text-slate-500">Contact</p>
              <p className="mt-2 text-2xl font-black">Un logement<br />vous intéresse ?</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="h-8 rounded-lg border" />
              <div className="mt-2 h-8 rounded-lg border" />
              <div className="mt-2 h-14 rounded-lg border" />
              <div className="mt-2 h-8 rounded-full bg-slate-950" />
            </div>
          </div>
        </div>
        <div className="bg-slate-950 p-6 text-white">
          <p className="text-sm font-black">PropertyMatch</p>
          <p className="mt-2 text-[7px] text-white/35">Une expérience immobilière pensée autour de vos critères.</p>
        </div>
      </div>
    );
  }

  if (type === "favorites-before") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[22px] border bg-white p-5">
          <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Avant</p>
          <p className="mt-5 text-2xl font-black">Vos favoris</p>
          <div className="mt-4 h-24 rounded-xl bg-slate-100" />
        </div>
        <div className="rounded-[22px] bg-slate-950 p-5 text-white">
          <p className="text-[8px] font-black uppercase tracking-wider text-white/30">Après</p>
          <p className="mt-5 text-3xl font-black">Les logements<br />que vous avez retenus.</p>
        </div>
      </div>
    );
  }

  if (type === "favorites-empty") {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f1eb] text-xl">♡</div>
        <p className="mt-5 text-2xl font-black">Aucun favori pour le moment.</p>
        <p className="mx-auto mt-3 max-w-sm text-[9px] leading-5 text-slate-500">Utilisez le cœur sur les logements que vous souhaitez conserver.</p>
        <span className="mt-5 inline-block rounded-full bg-slate-950 px-5 py-3 text-[8px] font-black text-white">Découvrir les logements</span>
      </div>
    );
  }

  if (
    type === "responsive-browser-wide" ||
    type === "responsive-browser-tablet" ||
    type === "responsive-browser-mobile" ||
    type === "responsive-final"
  ) {
    const mobile = type === "responsive-browser-mobile";
    const tablet = type === "responsive-browser-tablet";

    return (
      <div className="rounded-[28px] border border-slate-200 bg-slate-100 p-5 shadow-sm">
        <div
          className={[
            "mx-auto overflow-hidden rounded-[20px] border border-slate-300 bg-[#f4f1eb] shadow-xl",
            mobile ? "max-w-[300px]" : tablet ? "max-w-[620px]" : "max-w-[980px]",
          ].join(" ")}
        >
          <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <div className="ml-3 h-5 flex-1 rounded-full bg-slate-100" />
          </div>

          <div className="bg-slate-950 px-5 py-7 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black">PropertyMatch</p>
              {mobile ? (
                <span className="text-sm">☰</span>
              ) : (
                <div className="flex gap-4 text-[6px] font-bold text-white/55">
                  <span>Accueil</span>
                  <span>Favoris</span>
                  <span>À propos</span>
                  <span>Contact</span>
                </div>
              )}
            </div>

            <p className="mt-8 text-[7px] font-black uppercase tracking-wider text-white/35">
              Recherche immobilière
            </p>
            <p className="mt-2 text-2xl font-black leading-6">
              Trouvez un logement
              <br />
              qui vous correspond.
            </p>
          </div>

          <div className="p-5">
            <div className={mobile ? "grid gap-3" : "grid gap-3 md:grid-cols-3"}>
              <div className="h-16 rounded-xl bg-white" />
              <div className="h-16 rounded-xl bg-white" />
              <div className="h-16 rounded-xl bg-white" />
            </div>

            <div className={mobile ? "mt-5 grid gap-4" : "mt-5 grid gap-4 md:grid-cols-2"}>
              <ResultCardMock score="96%" title="Appartement lumineux" />
              <ResultCardMock score="84%" title="Loft proche des quais" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "responsive-header") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[24px] bg-slate-950 p-5 text-white">
          <p className="text-[7px] font-black uppercase tracking-wider text-white/30">Desktop</p>
          <div className="mt-5 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3">
            <p className="text-xs font-black">PropertyMatch</p>
            <div className="flex gap-4 text-[7px] font-bold text-white/60">
              <span>Accueil</span><span>Favoris</span><span>À propos</span><span>Contact</span>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-slate-950 p-5 text-white">
          <p className="text-[7px] font-black uppercase tracking-wider text-white/30">Mobile</p>
          <div className="mt-5 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3">
            <p className="text-xs font-black">PropertyMatch</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15">☰</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "responsive-cards") {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ResultCardMock score="96%" title="Appartement lumineux" />
          <ResultCardMock score="84%" title="Loft proche des quais" />
          <ResultCardMock score="78%" title="Maison avec jardin" />
        </div>
        <div className="mt-4 flex justify-between text-[7px] font-black uppercase tracking-wider text-slate-400">
          <span>Mobile: 1</span>
          <span>Tablette: 2</span>
          <span>Desktop: 3</span>
        </div>
      </div>
    );
  }

  if (type === "responsive-gallery") {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-[#f4f1eb] p-5">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-56 rounded-[20px] bg-gradient-to-br from-stone-200 to-stone-500" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="h-28 rounded-[20px] bg-gradient-to-br from-stone-100 to-stone-400" />
            <div className="h-28 rounded-[20px] bg-gradient-to-br from-stone-300 to-slate-500" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "responsive-contact") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[24px] bg-[#e8e2d8] p-5">
          <p className="text-[7px] font-black uppercase text-slate-500">Desktop</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-8 rounded-lg bg-white" />
            <div className="h-8 rounded-lg bg-white" />
          </div>
          <div className="mt-2 h-8 rounded-lg bg-white" />
          <div className="mt-2 h-14 rounded-lg bg-white" />
        </div>

        <div className="rounded-[24px] bg-[#e8e2d8] p-5">
          <p className="text-[7px] font-black uppercase text-slate-500">Mobile</p>
          <div className="mt-4 grid gap-2">
            <div className="h-8 rounded-lg bg-white" />
            <div className="h-8 rounded-lg bg-white" />
            <div className="h-8 rounded-lg bg-white" />
            <div className="h-14 rounded-lg bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (
    type === "design-reference" ||
    type === "design-header" ||
    type === "design-hero" ||
    type === "design-search" ||
    type === "design-results" ||
    type === "design-property-card" ||
    type === "design-detail" ||
    type === "design-about" ||
    type === "design-contact" ||
    type === "design-footer" ||
    type === "design-final"
  ) {
    return (
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[#f4f1eb] shadow-xl">
        <div className="bg-slate-950 px-5 py-3 text-white">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black">PropertyMatch</p>
            <div className="hidden gap-5 text-[6px] font-bold text-white/45 sm:flex">
              <span>Accueil</span>
              <span>Favoris</span>
              <span>À propos</span>
              <span>Contact</span>
            </div>
            <span className="text-xs sm:hidden">☰</span>
          </div>
        </div>

        <div className="bg-slate-950 px-7 pb-12 pt-14 text-white">
          <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
            Recherche immobilière nouvelle génération
          </p>
          <p className="mt-3 max-w-2xl text-4xl font-black leading-[0.9] tracking-[-0.06em]">
            Trouvez un logement
            <br />
            qui vous correspond.
          </p>
          <p className="mt-4 max-w-md text-[8px] leading-5 text-white/45">
            Définissez vos critères, comparez les logements et gardez les biens
            qui correspondent réellement à votre recherche.
          </p>
        </div>

        <div className="relative -mt-5 px-5">
          <div className="rounded-[24px] bg-white p-4 shadow-2xl">
            <div className="grid gap-2 sm:grid-cols-4">
              <div className="h-9 rounded-xl bg-slate-100" />
              <div className="h-9 rounded-xl bg-slate-100" />
              <div className="h-9 rounded-xl bg-slate-100" />
              <div className="h-9 rounded-xl bg-slate-950" />
            </div>
          </div>
        </div>

        <div className="px-6 py-12">
          <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
            Sélection PropertyMatch
          </p>
          <p className="mt-2 text-3xl font-black tracking-[-0.05em]">
            Des logements
            <br />
            sélectionnés pour vous.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <ResultCardMock score="96%" title="Appartement lumineux" />
            <ResultCardMock score="84%" title="Loft proche des quais" />
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-14 text-white">
          <p className="text-3xl font-black tracking-[-0.05em]">
            Moins de listes.
            <br />
            Plus de pertinence.
          </p>
        </div>

        <div className="bg-[#e8e2d8] px-6 py-12">
          <p className="text-[7px] font-black uppercase tracking-wider text-slate-500">
            Contact
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            <p className="text-3xl font-black tracking-[-0.05em]">
              Un logement
              <br />
              vous intéresse ?
            </p>
            <div className="rounded-[22px] bg-white p-4">
              <div className="h-8 rounded-lg border border-slate-200" />
              <div className="mt-2 h-8 rounded-lg border border-slate-200" />
              <div className="mt-2 h-14 rounded-lg border border-slate-200" />
              <div className="mt-2 h-8 rounded-full bg-slate-950" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-10 text-white">
          <p className="text-sm font-black">PropertyMatch</p>
          <p className="mt-2 text-[7px] text-white/30">
            Recherche immobilière personnalisée.
          </p>
        </div>
      </div>
    );
  }

  if (type === "vscode-project-open") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#343434] bg-[#1e1e1e] shadow-2xl">
        <VSCodeChrome title="propertymatch — Visual Studio Code" />

        <div className="grid min-h-[500px] grid-cols-[52px_250px_1fr]">
          <VSCodeActivityBar active="explorer" />

          <div className="border-r border-[#303030] bg-[#181818]">
            <div className="border-b border-[#303030] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#bbbbbb]">
                EXPLORER
              </p>
            </div>

            <div className="p-3 font-mono text-xs leading-8 text-[#bdbdbd]">
              <p className="font-bold text-white">▼ PROPERTYMATCH</p>
              <p className="pl-3">▼ app</p>
              <p className="pl-7">favicon.ico</p>
              <p className="pl-7">globals.css</p>
              <p className="pl-7">layout.tsx</p>
              <p className="rounded-md bg-[#37373d] pl-7 text-white">
                page.tsx
              </p>
              <p className="pl-3">▸ public</p>
              <p className="pl-3">package.json</p>
              <p className="pl-3">tsconfig.json</p>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-[#1e1e1e] p-8">
            <div className="max-w-sm rounded-2xl border border-[#373737] bg-[#181818] p-6">
              <p className="text-sm font-bold text-white">
                Votre projet est maintenant ouvert.
              </p>

              <p className="mt-3 text-xs leading-6 text-[#8d8d8d]">
                À gauche, l&apos;Explorer affiche désormais les vrais dossiers
                et fichiers créés par Next.js.
              </p>
            </div>

            <div className="absolute left-4 top-4 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-xl">
              ① VOTRE PROJET
            </div>
          </div>
        </div>

        <VSCodeStatusBar text="propertymatch" />
      </div>
    );
  }

  if (type === "explorer") {
    return (
      <div className="mx-auto max-w-xl overflow-hidden rounded-[24px] border border-[#343434] bg-[#181818] shadow-2xl">
        <div className="border-b border-[#333] px-5 py-4">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#999]">
            EXPLORER
          </p>
        </div>

        <div className="p-6 font-mono text-sm leading-10 text-[#aaa]">
          <p className="font-bold text-white">▼ PROPERTYMATCH</p>

          <div className="relative pl-5">
            <span>▼ app</span>
            <span className="absolute left-[120px] top-0 rounded-lg bg-white px-3 py-1 font-sans text-[9px] font-black text-slate-950">
              ① OUVREZ APP
            </span>
          </div>

          <p className="pl-10">layout.tsx</p>

          <div className="relative rounded-xl bg-white px-4 pl-10 font-bold text-slate-950">
            page.tsx
            <span className="absolute right-3 top-0 font-sans text-[10px] font-black tracking-wide">
              ② CLIQUEZ ICI
            </span>
          </div>

          <p className="pl-5">▸ public</p>
          <p className="pl-5">package.json</p>
        </div>

        <div className="border-t border-[#333] bg-[#101010] p-4">
          <p className="text-center text-xs font-bold text-[#aaa]">
            propertymatch → app → page.tsx
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>

        <div className="mx-auto rounded-lg bg-white px-7 py-2 font-mono text-xs text-slate-600 shadow-sm">
          http://localhost:3000
        </div>
      </div>

      <div className="flex min-h-[330px] items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
            P
          </div>

          <h3 className="mt-5 text-3xl font-bold tracking-tight">
            PropertyMatch
          </h3>

          <p className="mt-3 text-slate-500">
            Votre application fonctionne localement.
          </p>

          <div className="mt-7 inline-flex rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500">
            ✓ SERVEUR ACTIF
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// VS CODE UI HELPERS
// ======================================================

function VSCodeChrome({
  title,
  highlightTerminal = false,
  showTerminalMenu = false,
}: {
  title: string;
  highlightTerminal?: boolean;
  showTerminalMenu?: boolean;
}) {
  return (
    <>
      <div className="relative flex h-9 items-center border-b border-[#2b2b2b] bg-[#181818] px-3">
        <div className="flex gap-[7px]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        <p className="absolute left-1/2 -translate-x-1/2 text-[11px] text-[#999]">
          {title}
        </p>
      </div>

      <div className="relative flex h-9 items-center border-b border-[#2b2b2b] bg-[#181818] px-4 text-[11px] text-[#cccccc]">
        <div className="flex items-center gap-5">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>

          <div className="relative">
            <span
              className={
                highlightTerminal
                  ? "rounded border border-white px-2 py-1 font-semibold text-white"
                  : ""
              }
            >
              Terminal
            </span>

            {showTerminalMenu && (
              <div className="absolute left-0 top-7 z-30 w-[230px] rounded-md border border-[#444] bg-[#252526] py-1 text-[11px] text-[#ddd] shadow-2xl">
                <div className="flex items-center justify-between bg-[#094771] px-3 py-2 text-white">
                  <span>New Terminal</span>
                  <span className="text-[10px] opacity-70">⌃⇧`</span>
                </div>

                <div className="px-3 py-2">Split Terminal</div>

                <div className="border-t border-[#444] px-3 py-2">
                  Run Task...
                </div>

                <div className="px-3 py-2">Run Build Task...</div>
              </div>
            )}
          </div>

          <span>Help</span>
        </div>
      </div>
    </>
  );
}

function VSCodeActivityBar({
  active,
}: {
  active?: "explorer";
}) {
  return (
    <div className="border-r border-[#2b2b2b] bg-[#181818] py-2">
      <div
        className={`flex h-12 items-center justify-center border-l-2 text-xl ${
          active === "explorer"
            ? "border-white text-white"
            : "border-transparent text-[#888]"
        }`}
      >
        ◫
      </div>

      <div className="flex h-12 items-center justify-center text-xl text-[#777]">
        ⌕
      </div>

      <div className="flex h-12 items-center justify-center text-xl text-[#777]">
        ⎇
      </div>

      <div className="flex h-12 items-center justify-center text-xl text-[#777]">
        ▷
      </div>

      <div className="flex h-12 items-center justify-center text-xl text-[#777]">
        ◩
      </div>
    </div>
  );
}

function VSCodeTerminalPanel({
  prompt,
  callout,
}: {
  prompt: string;
  callout?: string;
}) {
  return (
    <div className="relative border-t border-[#333] bg-[#181818]">
      <div className="flex h-10 items-center gap-6 border-b border-[#292929] px-5 text-[10px] font-semibold text-[#888]">
        <span>PROBLEMS</span>
        <span>OUTPUT</span>
        <span>DEBUG CONSOLE</span>
        <span className="h-full border-b border-white pt-[13px] text-white">
          TERMINAL
        </span>
      </div>

      <div className="p-5">
        <p className="font-mono text-[13px] text-[#d4d4d4]">
          {prompt}{" "}
          <span className="inline-block h-[16px] w-[7px] bg-[#d4d4d4] align-middle" />
        </p>
      </div>

      {callout && (
        <div className="absolute bottom-7 right-7 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-slate-950 shadow-xl">
          {callout}
        </div>
      )}
    </div>
  );
}

function GuideCallout({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#353535] bg-[#181818] p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[9px] font-black text-slate-950">
          {number}
        </span>

        <p className="text-xs font-bold text-white">{title}</p>
      </div>

      <p className="mt-2 text-xs leading-5 text-[#888]">{text}</p>
    </div>
  );
}

function VSCodeStatusBar({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex h-6 items-center justify-between bg-[#181818] px-3 text-[9px] text-[#777]">
      <span>{text}</span>
      <span>Ln 1, Col 1</span>
    </div>
  );
}

// ======================================================
// VISUAL HELPERS
// ======================================================

function VSCodeTopBar() {
  return (
    <div className="flex h-12 items-center border-b border-[#323232] bg-[#181818] px-4">

      <div className="flex gap-2">

        <span className="h-2.5 w-2.5 rounded-full bg-[#555]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#555]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#555]" />

      </div>

      <div className="mx-auto rounded-lg border border-[#424242] bg-[#252525] px-20 py-1.5 text-[10px] text-[#aaa]">
        Search
      </div>

    </div>
  );
}

function VisualActivityIcon({
  children,
  active = false,
  label,
}: {
  children: ReactNode;
  active?: boolean;
  label?: string;
}) {
  return (
    <div className="relative">

      <div
        className={`flex h-8 items-center justify-center text-xl ${
          active
            ? "text-white"
            : "text-[#777]"
        }`}
      >
        {children}
      </div>

      {label && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-black text-black">
          {label}
        </span>
      )}

    </div>
  );
}

function SiteBrowserFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>

        <div className="mx-auto rounded-lg bg-white px-8 py-2 font-mono text-[10px] text-slate-600 shadow-sm">
          http://localhost:3000
        </div>
      </div>

      {children}
    </div>
  );
}

// ======================================================
// OTHER UI
// ======================================================

function HeroTag({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400">
      {children}
    </span>
  );
}

function WorkflowLine({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-950 p-4">

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[10px] font-bold text-slate-950">
        {number}
      </span>

      <div>

        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}

function WorkflowArrow() {
  return (
    <div className="pl-4 text-sm text-slate-700">
      ↓
    </div>
  );
}

function StepHeader({
  index,
  eyebrow,
  title,
}: {
  index: number;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex gap-4">

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        {String(index).padStart(
          2,
          "0"
        )}
      </span>

      <div>

        <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {title}
        </h2>

      </div>

    </div>
  );
}

function StepHeaderDark({
  index,
  eyebrow,
  title,
}: {
  index: number;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex gap-4">

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
        {String(index).padStart(
          2,
          "0"
        )}
      </span>

      <div>

        <p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {title}
        </h2>

      </div>

    </div>
  );
}

function CodeWindow({
  label,
  code,
}: {
  label: string;
  code: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] bg-slate-950">

      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">

        <div className="flex gap-1.5">

          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />

        </div>

        <p className="text-[9px] font-bold tracking-[0.14em] text-slate-500">
          {label}
        </p>

      </div>

      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-300">
        <code>
          {code}
        </code>
      </pre>

    </div>
  );
}

function CodeExplanations({
  explanations,
}: {
  explanations: Explanation[];
}) {
  return (
    <div className="mt-4 space-y-2">

      {explanations.map(
        (item) => (
          <div
            key={`${item.code}-${item.text}`}
            className="grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-[180px_1fr]"
          >

            <code className="text-sm font-bold text-slate-950">
              {item.code}
            </code>

            <p className="text-sm leading-6 text-slate-500">
              {item.text}
            </p>

          </div>
        )
      )}

    </div>
  );
}

function OSCard({
  icon,
  system,
  title,
  steps,
}: {
  icon: string;
  system: string;
  title: string;
  steps: string[];
}) {
  return (
    <div className="rounded-[22px] bg-slate-50 p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
          {icon}
        </div>

        <div>

          <p className="text-[10px] font-bold tracking-[0.15em] text-slate-400">
            {system.toUpperCase()}
          </p>

          <p className="mt-1 font-bold">
            {title}
          </p>

        </div>

      </div>

      <div className="mt-5 space-y-3">

        {steps.map(
          (item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex gap-3 rounded-xl bg-white p-3"
            >

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-bold text-white">
                {index + 1}
              </span>

              <p className="pt-0.5 text-sm leading-6 text-slate-600">
                {item}
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}

// ======================================================
// HELPERS
// ======================================================

function getDefaultEyebrow(
  type: Step["type"]
) {
  switch (type) {
    case "concept":
      return "À COMPRENDRE";

    case "action":
      return "À VOUS DE FAIRE";

    case "terminal":
      return "DANS LE TERMINAL";

    case "code":
      return "DANS VS CODE";

    case "checkpoint":
      return "CHECKPOINT";

    case "download":
      return "INSTALLATION";

    case "visual-guide":
      return "REPÈRE VISUEL";

    case "os-guide":
      return "MAC / WINDOWS";

    default:
      return "COURS";
  }
}
