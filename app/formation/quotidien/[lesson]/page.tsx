import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import PracticalExercise from "@/components/formation/PracticalExercise";
import ProjectValidationNotice from "@/components/formation/projects/ProjectValidationNotice";
import {
  getPreviousOfficialLessonId,
  isValidLessonCompletion,
} from "@/lib/training/catalog";

// ======================================================
// TYPES
// ======================================================

type ExerciseField = {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  minLength?: number;
};

type EvaluationCriterion = {
  name: string;
  maxScore: number;
  description: string;
};

type PracticalExerciseData = {
  skill: string;
  title: string;
  estimatedTime: string;
  tools: string[];
  context: string;
  deliverable: string;
  mission: string;
  placeholder?: string;
  fields: ExerciseField[];
  successCriteria: string[];
  hints: string[];
  correction: string;
  advancedChallenge: string;
  evaluationCriteria: EvaluationCriterion[];
};

// ======================================================
// LEÇONS
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "quotidien-01-travail",
    number: "01",
    title:
      "Transformer une tâche en workflow IA",
    duration:
      "15 min",
    description:
      "Apprenez à décomposer une demande professionnelle en étapes précises, contrôlables et réutilisables.",
  },

  {
    slug: "02",
    id: "quotidien-02-etudes",
    number: "02",
    title:
      "Apprendre et travailler avec l’IA",
    duration:
      "15 min",
    description:
      "Construisez un véritable système d’apprentissage avec diagnostic, pratique, correction et progression.",
  },

  {
    slug: "03",
    id: "quotidien-03-recherche",
    number: "03",
    title:
      "Rechercher, analyser et vérifier",
    duration:
      "17 min",
    description:
      "Apprenez à comparer plusieurs solutions à partir de contraintes, de critères et d’informations vérifiables.",
  },

  {
    slug: "04",
    id: "quotidien-04-documents",
    number: "04",
    title:
      "Exploiter des documents avec l’IA",
    duration:
      "18 min",
    description:
      "Transformez un document long en informations structurées, vérifiables et directement utiles à une décision.",
  },

  {
    slug: "05",
    id: "quotidien-05-mission",
    number: "05",
    title:
      "Projet · Construire un workflow IA",
    duration:
      "30 min",
    description:
      "Réalisez une mission professionnelle complète et produisez un véritable rapport décisionnel.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default async function DailyLessonPage({
  params,
}: {
  params: Promise<{
    lesson: string;
  }>;
}) {
  const {
    lesson: lessonSlug,
  } = await params;

  const lesson =
    lessons.find(
      (item) =>
        item.slug ===
        lessonSlug
    );

  if (!lesson) {
    notFound();
  }

  // ======================================================
  // USER
  // ======================================================

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/connexion"
    );
  }

  // ======================================================
  // PROGRESSION
  // ======================================================

  const {
    data: progressData,
    error: progressError,
  } =
    await supabase
      .from(
        "lesson_progress"
      )
      .select(
        "lesson_id, completed, completed_at, score"
      )
      .eq(
        "user_id",
        user.id
      );

  if (
    progressError
  ) {
    console.error(
      "Erreur récupération progression :",
      progressError
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

  // ======================================================
  // NAVIGATION
  // ======================================================

  const currentIndex =
    lessons.findIndex(
      (item) =>
        item.id ===
        lesson.id
    );

  const previousLessonId = getPreviousOfficialLessonId(lesson.id);

  const allowed =
    previousLessonId === null || completedIds.has(previousLessonId);

  if (!allowed) {
    redirect(
      "/formation/quotidien"
    );
  }

  const nextLesson =
    currentIndex <
    lessons.length - 1
      ? lessons[
          currentIndex + 1
        ]
      : null;

  const lessonCompleted =
    completedIds.has(
      lesson.id
    );

  const lessonProgress =
    progressData?.find(
      (item) =>
        item.lesson_id ===
        lesson.id
    );

  const lessonScore =
    lessonProgress?.score ??
    null;

  // ======================================================
  // CONTENU
  // ======================================================

  const lessonContent =
    getLessonContent(
      lesson.slug
    );

  const practicalExercise =
    getPracticalExercise(
      lesson.slug
    );

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/quotidien"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au module
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Leçon{" "}
            {lesson.number} /{" "}
            {lessons.length}
          </span>

        </div>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              LEÇON{" "}
              {lesson.number}
            </p>

            {lessonCompleted && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                ✓ Terminée
              </span>
            )}

            {lessonCompleted &&
              lessonScore !==
                null && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Score :{" "}
                  {lessonScore}%
                </span>
              )}

          </div>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            {
              lesson.description
            }
          </p>

        </div>

        {/* ==================================================
            VIDEO
        ================================================== */}

        <div className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 shadow-2xl">

          <div className="flex aspect-video items-center justify-center">

            <button
              type="button"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-slate-950 shadow-xl transition hover:scale-105"
            >
              ▶
            </button>

          </div>

          <div className="border-t border-slate-800 px-6 py-4">

            <div className="flex justify-between text-sm">

              <span className="text-slate-400">
                {
                  lesson.title
                }
              </span>

              <span className="text-white">
                {
                  lesson.duration
                }
              </span>

            </div>

          </div>

        </div>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ==================================================
              GAUCHE
          ================================================== */}

          <div className="space-y-6">

            {/* ==================================================
                CONTENU
            ================================================== */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {
                  lessonContent.heading
                }
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {
                  lessonContent.introduction
                }
              </p>

              <div className="mt-8 space-y-4">

                {lessonContent.points.map(
                  (
                    point,
                    index
                  ) => (
                    <div
                      key={
                        point.title
                      }
                      className="rounded-2xl bg-slate-50 p-5"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
                          {String(
                            index +
                              1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div>

                          <h3 className="font-semibold">
                            {
                              point.title
                            }
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {
                              point.text
                            }
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* ==================================================
                MÉTHODE
            ================================================== */}

            <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                MÉTHODE
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {
                  lessonContent.exampleTitle
                }
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
                {
                  lessonContent.example
                }
              </p>

            </section>

            {/* ==================================================
                VRAI ATELIER
            ================================================== */}

            <PracticalExercise
              lessonId={
                lesson.id
              }

              skill={
                practicalExercise.skill
              }
              title={
                practicalExercise.title
              }
              context={
                practicalExercise.context
              }
              deliverable={
                practicalExercise.deliverable
              }
              mission={
                practicalExercise.mission
              }
              placeholder={
                practicalExercise.placeholder
              }
              hints={
                practicalExercise.hints
              }
              correction={
                practicalExercise.correction
              }
              successCriteria={
                practicalExercise.successCriteria
              }
              advancedChallenge={
                practicalExercise.advancedChallenge
              }
              tools={
                practicalExercise.tools
              }
              estimatedTime={
                practicalExercise.estimatedTime
              }

              // IMPORTANT :
              // active maintenant
              // le vrai exercice structuré.
              fields={
                practicalExercise.fields
              }

              evaluationCriteria={
                practicalExercise.evaluationCriteria
              }
            />

            {/* ==================================================
                QUIZ
            ================================================== */}

            {lesson.id === "quotidien-05-mission" ? (
              <ProjectValidationNotice completed={lessonCompleted} />
            ) : (
            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                VALIDATION
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                Vérifiez votre compréhension
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-500">
                L&apos;atelier vérifie votre capacité à produire
                un résultat concret. Le quiz vérifie maintenant
                que vous comprenez les principes utilisés.
              </p>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Score minimum : 70 %
              </p>

              <Link
                href={`/formation/quotidien/${lesson.slug}/exercice`}
                className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                {lessonCompleted
                  ? "Refaire le quiz →"
                  : "Faire le quiz →"}
              </Link>

            </section>
            )}

            {/* ==================================================
                NEXT
            ================================================== */}

            {lessonCompleted && (
              <div>

                {nextLesson ? (
                  <Link
                    href={`/formation/quotidien/${nextLesson.slug}`}
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Leçon suivante →
                  </Link>
                ) : (
                  <Link
                    href="/formation/quotidien"
                    className="inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                  >
                    Module terminé ✓
                  </Link>
                )}

              </div>
            )}

          </div>

          {/* ==================================================
              COACH
          ================================================== */}

          <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                ✦
              </div>

              <div>

                <p className="font-bold">
                  Coach IA
                </p>

                <p className="text-xs text-slate-400">
                  Leçon{" "}
                  {lesson.number}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Posez une question sur la méthode,
              demandez un autre exemple ou faites
              analyser une étape de votre travail.
            </div>

            <textarea
              placeholder="Votre question..."
              className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-slate-400"
            />

            <button
              type="button"
              className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
            >
              Envoyer
            </button>

          </aside>

        </div>

      </div>

    </main>
  );
}

// ======================================================
// CONTENU PÉDAGOGIQUE
// ======================================================

function getLessonContent(
  slug: string
) {
  const contents = {

    // ==================================================
    // 01
    // ==================================================

    "01": {
      heading:
        "Une tâche complexe devient plus fiable lorsqu’elle est décomposée.",

      introduction:
        "Dans un environnement professionnel, demander directement un résultat final à l’IA n’est pas toujours la meilleure méthode. Il faut comprendre la demande, identifier les informations disponibles, repérer ce qui manque, construire les étapes du travail puis vérifier le résultat.",

      points: [
        {
          title:
            "Comprendre",
          text:
            "Déterminez le résultat réellement attendu avant de commencer.",
        },
        {
          title:
            "Séparer",
          text:
            "Distinguez les informations disponibles des informations manquantes.",
        },
        {
          title:
            "Décomposer",
          text:
            "Transformez la mission en plusieurs étapes simples et contrôlables.",
        },
        {
          title:
            "Contrôler",
          text:
            "Ajoutez une vérification finale des chiffres, dates, sources et hypothèses.",
        },
      ],

      exampleTitle:
        "Brief → workflow → résultat",

      example: `DEMANDE

"Prépare la réunion client."

Ce n’est pas encore un workflow.

Il faut d’abord répondre à plusieurs questions :

→ Quel est l’objectif de la réunion ?
→ Quels documents sont disponibles ?
→ Quelles informations manquent ?
→ Quelles analyses doivent être réalisées ?
→ Quel résultat doit être présenté ?
→ Que faut-il vérifier ?

Le workflow devient ensuite :

CADRAGE
↓
COLLECTE
↓
ANALYSE
↓
SYNTHÈSE
↓
VÉRIFICATION
↓
LIVRABLE`,
    },

    // ==================================================
    // 02
    // ==================================================

    "02": {
      heading:
        "L’IA devient un véritable tuteur lorsqu’elle adapte la suite à vos réponses.",

      introduction:
        "Lire une réponse générée n’est pas la même chose qu’apprendre. Une bonne séance doit vous obliger à réfléchir, répondre, vous tromper éventuellement, comprendre l’erreur puis recommencer avec un niveau adapté.",

      points: [
        {
          title:
            "Diagnostic",
          text:
            "Mesurez le niveau initial avant de construire la séance.",
        },
        {
          title:
            "Explication",
          text:
            "Adaptez le niveau et utilisez un exemple concret.",
        },
        {
          title:
            "Pratique",
          text:
            "L’apprenant doit répondre avant de voir la solution.",
        },
        {
          title:
            "Adaptation",
          text:
            "La prochaine étape dépend des erreurs ou réussites observées.",
        },
      ],

      exampleTitle:
        "Créer une boucle d’apprentissage",

      example: `DIAGNOSTIC
↓
EXPLICATION
↓
QUESTION
↓
RÉPONSE DE L’APPRENANT
↓
CORRECTION
↓
NOUVEL EXERCICE
↓
DIFFICULTÉ ADAPTÉE
↓
RÉVISION

L’IA ne doit donc pas simplement produire du contenu.

Elle doit réagir à votre progression.`,
    },

    // ==================================================
    // 03
    // ==================================================

    "03": {
      heading:
        "Comparer correctement exige les mêmes critères pour chaque option.",

      introduction:
        "Une recherche sérieuse ne consiste pas à demander à l’IA quelle solution est la meilleure. Vous devez d’abord définir les contraintes, sélectionner les critères, récupérer les informations nécessaires puis appliquer la même grille à toutes les options.",

      points: [
        {
          title:
            "Contraintes",
          text:
            "Identifiez ce qui élimine immédiatement une option.",
        },
        {
          title:
            "Critères",
          text:
            "Définissez les dimensions réellement importantes pour la décision.",
        },
        {
          title:
            "Sources",
          text:
            "Vérifiez les informations sensibles ou susceptibles de changer.",
        },
        {
          title:
            "Décision",
          text:
            "Expliquez les compromis plutôt que de simplement annoncer un gagnant.",
        },
      ],

      exampleTitle:
        "Construire une grille de décision",

      example: `EXEMPLE : choisir un logiciel pour une équipe.

CONTRAINTES
- budget ;
- nombre d’utilisateurs ;
- compatibilité ;
- sécurité.

CRITÈRES
- fonctionnalités ;
- facilité d’utilisation ;
- intégrations ;
- support ;
- prix.

Puis :

OPTION A
OPTION B
OPTION C

Toutes doivent être comparées selon exactement la même grille.`,
    },

    // ==================================================
    // 04
    // ==================================================

    "04": {
      heading:
        "Un document devient utile lorsqu’il peut être interrogé avec précision.",

      introduction:
        "Le résumé est seulement le premier niveau. Dans une vraie mission, l’objectif consiste souvent à extraire des informations précises, conserver leur source, signaler les absences et préparer une décision.",

      points: [
        {
          title:
            "Cibler",
          text:
            "Déterminez précisément ce que vous cherchez avant l’analyse.",
        },
        {
          title:
            "Extraire",
          text:
            "Repérez dates, montants, obligations, risques et conditions.",
        },
        {
          title:
            "Tracer",
          text:
            "Conservez la page ou la section permettant de retrouver l’information.",
        },
        {
          title:
            "Signaler",
          text:
            "Une information absente ne doit jamais être inventée.",
        },
      ],

      exampleTitle:
        "Document → extraction → décision",

      example: `DOCUMENT
↓
QUESTIONS CIBLÉES
↓
EXTRACTION
↓
TABLEAU
↓
PAGE / SECTION
↓
INFORMATIONS ABSENTES
↓
POINTS D’ATTENTION
↓
DÉCISION

La traçabilité permet ensuite de vérifier rapidement chaque élément important.`,
    },

    // ==================================================
    // 05
    // ==================================================

    "05": {
      heading:
        "La compétence finale consiste à construire un système complet autour d’un besoin réel.",

      introduction:
        "Vous allez maintenant réunir toutes les compétences du module : cadrage, collecte, analyse, comparaison, contrôle et communication. Le résultat doit pouvoir être remis à un véritable responsable.",

      points: [
        {
          title:
            "Cadrer",
          text:
            "Comprenez le problème avant de chercher une solution.",
        },
        {
          title:
            "Collecter",
          text:
            "Identifiez précisément les données nécessaires.",
        },
        {
          title:
            "Analyser",
          text:
            "Appliquez une méthode cohérente aux différentes options.",
        },
        {
          title:
            "Recommander",
          text:
            "Produisez un rapport permettant réellement de prendre une décision.",
        },
      ],

      exampleTitle:
        "Le workflow complet",

      example: `BESOIN
↓
OBJECTIF
↓
CONTRAINTES
↓
INFORMATIONS MANQUANTES
↓
COLLECTE
↓
VÉRIFICATION
↓
ANALYSE
↓
COMPARAISON
↓
RECOMMANDATION
↓
PLAN D’ACTION
↓
RAPPORT FINAL`,
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ??
    contents["01"]
  );
}

// ======================================================
// EXERCICES PRATIQUES
// ======================================================

function getPracticalExercise(
  slug: string
): PracticalExerciseData {
  const exercises: Record<
    string,
    PracticalExerciseData
  > = {

    // ==================================================
    // LEÇON 01
    // ==================================================

    "01": {
      skill:
        "Transformer une demande professionnelle vague en workflow clair et contrôlable.",

      title:
        "Construire un workflow professionnel",

      estimatedTime:
        "15 à 20 min",

      tools: [
        "ChatGPT",
        "Brief professionnel",
      ],

      context: `Votre responsable vous écrit :

"Prépare la réunion client de vendredi.

Il faut reprendre les chiffres du dernier rapport,
comprendre pourquoi les ventes ont baissé,
préparer les sujets à discuter
et envoyer quelque chose à Sarah avant jeudi.

Je veux également savoir ce qu’on doit vérifier avant la réunion."

Vous ne disposez d’aucune autre information.`,

      deliverable: `Vous devez construire un workflow comprenant :

1. l’objectif réel ;
2. les informations disponibles ;
3. les informations manquantes ;
4. les étapes du travail ;
5. les contrôles ;
6. le livrable final.`,

      mission:
        "Analysez la demande comme si vous étiez réellement responsable de cette mission. N’inventez aucune information absente.",

      fields: [
        {
          id:
            "objectif",

          label:
            "Objectif de la mission",

          description:
            "Quel résultat votre responsable attend-il réellement ?",

          placeholder:
            "Décrivez le résultat attendu...",

          minLength:
            20,
        },

        {
          id:
            "informations",

          label:
            "Informations disponibles",

          description:
            "Listez uniquement ce que vous savez déjà.",

          placeholder:
            "Réunion vendredi, existence d’un rapport...",

          minLength:
            30,
        },

        {
          id:
            "manquantes",

          label:
            "Informations manquantes",

          description:
            "Que devez-vous demander avant de commencer correctement ?",

          placeholder:
            "Période du rapport, rôle de Sarah...",

          minLength:
            30,
        },

        {
          id:
            "workflow",

          label:
            "Étapes du workflow",

          description:
            "Décomposez le travail dans l’ordre.",

          placeholder: `1. ...
2. ...
3. ...
4. ...
5. ...`,

          minLength:
            60,
        },

        {
          id:
            "controles",

          label:
            "Contrôles à effectuer",

          description:
            "Que faut-il vérifier avant livraison ?",

          placeholder:
            "Chiffres, dates, cohérence, sources...",

          minLength:
            25,
        },

        {
          id:
            "livrable",

          label:
            "Livrable final",

          description:
            "Que recevra concrètement le responsable ?",

          placeholder:
            "Un dossier contenant...",

          minLength:
            25,
        },
      ],

      successCriteria: [
        "L’objectif est clairement identifié",
        "Les informations disponibles et manquantes sont séparées",
        "Aucune donnée absente n’est inventée",
        "Le workflow suit un ordre logique",
        "Une étape de vérification existe",
        "Le livrable final est concret",
      ],

      hints: [
        "La période du rapport n’est pas indiquée.",
        "Le rôle de Sarah n’est pas expliqué.",
        "Le livrable attendu avant jeudi n’est pas précisé.",
      ],

      correction: `OBJECTIF

Préparer un dossier permettant de conduire efficacement la réunion client et d’expliquer la baisse des ventes.

INFORMATIONS DISPONIBLES

- réunion vendredi ;
- un rapport existe ;
- baisse des ventes ;
- Sarah doit recevoir un élément avant jeudi.

INFORMATIONS MANQUANTES

- rapport concerné ;
- période ;
- données de ventes ;
- objectif précis de la réunion ;
- rôle de Sarah ;
- format attendu.

WORKFLOW

1. Clarifier les informations manquantes.
2. Récupérer le rapport.
3. Extraire les chiffres importants.
4. Identifier les évolutions.
5. Rechercher les causes possibles.
6. Séparer faits et hypothèses.
7. Préparer les sujets de discussion.
8. Construire le dossier.
9. Vérifier les chiffres.
10. Préparer l’envoi à Sarah.

LIVRABLE

Un dossier court avec :
- synthèse ;
- chiffres clés ;
- causes possibles ;
- questions ;
- sujets de discussion ;
- plan d’action.`,

      evaluationCriteria: [
        {
          name: "Cadrage de la mission",
          maxScore: 20,
          description:
            "L’objectif réel est identifié et les informations disponibles sont correctement distinguées des informations manquantes.",
        },
        {
          name: "Qualité du workflow",
          maxScore: 25,
          description:
            "Les étapes proposées sont logiques, ordonnées et permettent réellement de réaliser la mission.",
        },
        {
          name: "Gestion des informations",
          maxScore: 20,
          description:
            "L’apprenant n’invente aucune donnée absente et identifie correctement les éléments à clarifier.",
        },
        {
          name: "Contrôles",
          maxScore: 20,
          description:
            "Des vérifications pertinentes sont prévues avant la livraison.",
        },
        {
          name: "Qualité du livrable",
          maxScore: 15,
          description:
            "Le livrable final est concret, clair et exploitable par le responsable.",
        },
      ],

      advancedChallenge:
        "Transformez ce workflow en modèle réutilisable pour toutes les futures réunions clients.",
    },

    // ==================================================
    // LEÇON 02
    // ==================================================

    "02": {
      skill:
        "Construire un véritable programme d’apprentissage adaptatif avec l’IA.",

      title:
        "Créer votre tuteur IA personnel",

      estimatedTime:
        "15 à 20 min",

      tools: [
        "ChatGPT",
        "Cours ou compétence à apprendre",
      ],

      context: `Vous devez apprendre une compétence difficile.

Exemples :

- Python ;
- finance ;
- anglais ;
- statistiques ;
- marketing ;
- histoire ;
- cybersécurité.

Vous disposez de 7 jours.

Votre problème : vous comprenez généralement les explications mais vous avez du mal à appliquer les notions seul.`,

      deliverable: `Construisez un système comprenant :

1. objectif d’apprentissage ;
2. diagnostic ;
3. méthode d’explication ;
4. pratique ;
5. correction ;
6. adaptation ;
7. programme sur 7 jours.`,

      mission:
        "Construisez un tuteur qui vous oblige réellement à réfléchir avant de donner les réponses.",

      fields: [
        {
          id:
            "competence",

          label:
            "Compétence à apprendre",

          description:
            "Choisissez précisément ce que vous voulez maîtriser.",

          placeholder:
            "Exemple : comprendre et utiliser les boucles Python...",

          minLength:
            15,
        },

        {
          id:
            "objectif",

          label:
            "Objectif final",

          description:
            "Que devez-vous être capable de faire après 7 jours ?",

          placeholder:
            "À la fin, je dois être capable de...",

          minLength:
            25,
        },

        {
          id:
            "diagnostic",

          label:
            "Diagnostic initial",

          description:
            "Comment l’IA évaluera-t-elle votre niveau actuel ?",

          placeholder:
            "Elle commencera par me poser...",

          minLength:
            30,
        },

        {
          id:
            "methode",

          label:
            "Méthode d’apprentissage",

          description:
            "Décrivez la boucle explication → question → exercice → correction.",

          placeholder:
            "1. Explication...\n2. Question...\n3. Exercice...",

          minLength:
            60,
        },

        {
          id:
            "adaptation",

          label:
            "Règle d’adaptation",

          description:
            "Que doit faire l’IA après une réussite ou une erreur ?",

          placeholder:
            "Si je réussis..., si je bloque...",

          minLength:
            30,
        },

        {
          id:
            "planning",

          label:
            "Programme sur 7 jours",

          description:
            "Organisez une progression réaliste.",

          placeholder:
            "Jour 1 : ...\nJour 2 : ...",

          minLength:
            70,
        },
      ],

      successCriteria: [
        "L’objectif est observable",
        "Le niveau initial est évalué",
        "L’IA attend les réponses de l’apprenant",
        "Les erreurs modifient la suite",
        "La difficulté augmente progressivement",
        "Le programme contient de la révision",
      ],

      hints: [
        "Évitez les objectifs vagues comme « être meilleur ».",
        "Une erreur doit déclencher une explication ciblée.",
        "Prévoyez une révision des erreurs les plus fréquentes.",
      ],

      correction: `EXEMPLE : APPRENDRE PYTHON

OBJECTIF

Être capable d’écrire seul un petit programme utilisant conditions, boucles et fonctions.

DIAGNOSTIC

5 questions + 2 petits exercices.

MÉTHODE

1. Explication courte.
2. Exemple.
3. Question.
4. Attendre la réponse.
5. Exercice.
6. Correction du raisonnement.
7. Nouvel exercice.

ADAPTATION

Réussite :
→ difficulté légèrement supérieure.

Erreur :
→ nouvelle explication ciblée + exercice similaire.

PROGRAMME

Jour 1 : variables / conditions
Jour 2 : boucles
Jour 3 : fonctions
Jour 4 : listes / dictionnaires
Jour 5 : exercices mixtes
Jour 6 : mini-projet
Jour 7 : révision des erreurs + projet final.`,

      evaluationCriteria: [
        {
          name: "Objectif d’apprentissage",
          maxScore: 15,
          description:
            "La compétence et le résultat attendu après 7 jours sont précis et observables.",
        },
        {
          name: "Diagnostic",
          maxScore: 15,
          description:
            "Le système permet réellement d’évaluer le niveau initial de l’apprenant.",
        },
        {
          name: "Méthode pédagogique",
          maxScore: 25,
          description:
            "La boucle d’apprentissage oblige l’apprenant à réfléchir, répondre, pratiquer et recevoir une correction.",
        },
        {
          name: "Adaptation",
          maxScore: 20,
          description:
            "La suite de l’apprentissage évolue réellement selon les réussites et les erreurs.",
        },
        {
          name: "Programme sur 7 jours",
          maxScore: 25,
          description:
            "La progression est cohérente, réaliste et contient de la pratique ainsi que de la révision.",
        },
      ],

      advancedChallenge:
        "Ajoutez un système de répétition espacée basé uniquement sur les erreurs commises.",
    },

    // ==================================================
    // LEÇON 03
    // ==================================================

    "03": {
      skill:
        "Construire une étude comparative professionnelle avec contraintes, critères et recommandation.",

      title:
        "Choisir un outil pour une équipe internationale",

      estimatedTime:
        "20 min",

      tools: [
        "ChatGPT",
        "Recherche web",
        "Sources officielles",
      ],

      context: `Une entreprise possède des équipes en France, au Canada et au Japon.

Elle cherche un nouvel outil de gestion de projet.

Contraintes :

- 40 utilisateurs ;
- budget maximum : 700 € par mois ;
- application web et mobile ;
- gestion des droits utilisateurs ;
- intégration Slack ;
- historique des activités ;
- données accessibles depuis plusieurs pays.

Trois outils devront être comparés.`,

      deliverable: `Produisez :

1. les contraintes éliminatoires ;
2. les critères de comparaison ;
3. les informations à rechercher ;
4. les sources à utiliser ;
5. la grille comparative ;
6. la méthode de décision.`,

      mission:
        "Construisez d’abord la méthode de comparaison. Ne choisissez pas encore un outil au hasard.",

      fields: [
        {
          id:
            "contraintes",

          label:
            "Contraintes éliminatoires",

          description:
            "Qu’est-ce qu’un outil doit absolument respecter ?",

          placeholder:
            "Budget ≤ ..., intégration..., etc.",

          minLength:
            35,
        },

        {
          id:
            "criteres",

          label:
            "Critères de comparaison",

          description:
            "Quels éléments permettront de départager les solutions conformes ?",

          placeholder:
            "Prix, ergonomie, sécurité...",

          minLength:
            40,
        },

        {
          id:
            "recherche",

          label:
            "Informations à rechercher",

          description:
            "Quelles données doivent être collectées pour chaque outil ?",

          placeholder:
            "Tarifs exacts, fonctionnalités...",

          minLength:
            40,
        },

        {
          id:
            "sources",

          label:
            "Sources et vérification",

          description:
            "Où vérifierez-vous les informations ?",

          placeholder:
            "Documentation officielle, page tarifs...",

          minLength:
            30,
        },

        {
          id:
            "tableau",

          label:
            "Structure du tableau comparatif",

          description:
            "Préparez les colonnes de votre comparaison.",

          placeholder:
            "| Outil | Prix | ... |",

          minLength:
            45,
        },

        {
          id:
            "decision",

          label:
            "Règle de décision",

          description:
            "Comment déterminerez-vous le meilleur choix ?",

          placeholder:
            "Éliminer d’abord..., puis comparer...",

          minLength:
            35,
        },
      ],

      successCriteria: [
        "Les contraintes sont séparées des préférences",
        "Tous les outils sont comparés avec les mêmes critères",
        "Les prix doivent être vérifiés",
        "Les informations importantes ont une source",
        "La dimension internationale est prise en compte",
        "La décision repose sur une règle explicite",
      ],

      hints: [
        "700 € par mois est une contrainte, pas un simple critère.",
        "Pensez aux différences de fuseaux horaires et d’accès international.",
        "Les pages tarifaires officielles sont généralement préférables pour les prix.",
      ],

      correction: `CONTRAINTES

- coût total ≤ 700 €/mois ;
- 40 utilisateurs ;
- web + mobile ;
- droits utilisateurs ;
- Slack ;
- historique ;
- accès international.

CRITÈRES

- coût ;
- ergonomie ;
- automatisations ;
- sécurité ;
- intégrations ;
- support ;
- reporting.

SOURCES

- documentation officielle ;
- page tarifs ;
- documentation sécurité ;
- documentation intégrations.

TABLEAU

| Outil | Prix total | Slack | Permissions | Mobile | Sécurité | Automatisation | Support |

DÉCISION

1. Éliminer les outils hors contraintes.
2. Comparer les finalistes.
3. Identifier les compromis.
4. Recommander l’outil correspondant le mieux au besoin réel.`,

      evaluationCriteria: [
        {
          name: "Contraintes",
          maxScore: 20,
          description:
            "Les contraintes éliminatoires sont correctement identifiées et distinguées des simples préférences.",
        },
        {
          name: "Critères de comparaison",
          maxScore: 20,
          description:
            "Les critères permettent de comparer équitablement toutes les solutions selon les mêmes dimensions.",
        },
        {
          name: "Recherche et sources",
          maxScore: 20,
          description:
            "Les informations à rechercher sont pertinentes et les sources proposées permettent de vérifier les données importantes.",
        },
        {
          name: "Grille comparative",
          maxScore: 20,
          description:
            "Le tableau proposé permet une comparaison claire, homogène et exploitable des trois solutions.",
        },
        {
          name: "Méthode de décision",
          maxScore: 20,
          description:
            "La règle de décision élimine d’abord les solutions non conformes puis permet d’expliquer les compromis entre les finalistes.",
        },
      ],

      advancedChallenge:
        "L’entreprise passe à 120 utilisateurs répartis dans 8 pays. Recalculez les critères importants.",
    },

    // ==================================================
    // LEÇON 04
    // ==================================================

    "04": {
      skill:
        "Transformer un document professionnel en note d’analyse vérifiable.",

      title:
        "Auditer un contrat fournisseur",

      estimatedTime:
        "20 min",

      tools: [
        "ChatGPT",
        "PDF / document",
      ],

      context: `Votre entreprise reçoit un contrat de prestation.

Votre responsable veut rapidement comprendre :

- coût ;
- durée ;
- modalités de paiement ;
- renouvellement ;
- résiliation ;
- pénalités ;
- confidentialité ;
- traitement des données ;
- responsabilités.

Certaines informations peuvent être absentes.`,

      deliverable: `Construisez une méthode permettant de produire :

1. une grille d’extraction ;
2. la traçabilité vers les pages ;
3. les informations absentes ;
4. les points d’attention ;
5. les questions à poser avant décision.`,

      mission:
        "Votre analyse doit rester strictement limitée au document fourni.",

      fields: [
        {
          id:
            "objectif",

          label:
            "Objectif de l’analyse",

          description:
            "Que cherche précisément votre responsable ?",

          placeholder:
            "L’objectif est de...",

          minLength:
            25,
        },

        {
          id:
            "extraction",

          label:
            "Informations à extraire",

          description:
            "Listez les éléments précis à rechercher.",

          placeholder:
            "Prix, durée, résiliation...",

          minLength:
            40,
        },

        {
          id:
            "tableau",

          label:
            "Structure du tableau",

          description:
            "Construisez les colonnes nécessaires à la traçabilité.",

          placeholder:
            "| Sujet | Information | Page | Point d’attention |",

          minLength:
            40,
        },

        {
          id:
            "antiHallucination",

          label:
            "Règles anti-hallucination",

          description:
            "Que doit faire l’IA si une information n’apparaît pas ?", 

          placeholder:
            "Ne jamais..., signaler...",

          minLength:
            30,
        },

        {
          id:
            "risques",

          label:
            "Points d’attention",

          description:
            "Quels éléments méritent une vérification particulière ?",

          placeholder:
            "Renouvellement automatique...",

          minLength:
            30,
        },

        {
          id:
            "questions",

          label:
            "Questions après analyse",

          description:
            "Quelles questions poser au fournisseur ou au responsable ?",

          placeholder:
            "Existe-t-il des frais de... ?",

          minLength:
            40,
        },
      ],

      successCriteria: [
        "L’analyse reste limitée au document",
        "Les informations importantes sont ciblées",
        "Chaque information critique peut être reliée à une page",
        "Les absences sont explicitement signalées",
        "Les risques sont distingués des faits",
        "Des questions complémentaires sont prévues",
      ],

      hints: [
        "Une information absente doit être marquée « non trouvée ».",
        "Ajoutez une colonne page ou section.",
        "La synthèse ne remplace pas un avis juridique professionnel.",
      ],

      correction: `OBJECTIF

Préparer rapidement la lecture du contrat avant décision.

TABLEAU

| Sujet | Information trouvée | Page / section | Point d’attention |

SUJETS

- prix ;
- paiement ;
- durée ;
- renouvellement ;
- résiliation ;
- préavis ;
- pénalités ;
- confidentialité ;
- données ;
- responsabilités.

RÈGLES

- analyser uniquement le document ;
- ne jamais compléter une information absente ;
- écrire « non trouvé » lorsqu’elle manque ;
- conserver la page ou section.

QUESTIONS

- Le renouvellement est-il automatique ?
- Existe-t-il des frais de sortie ?
- Qui possède les données ?
- Quelles responsabilités sont limitées ?
- Que se passe-t-il en cas de non-respect des délais ?`,

      evaluationCriteria: [
        {
          name: "Cadrage de l’analyse",
          maxScore: 15,
          description:
            "L’objectif de l’analyse documentaire est clairement défini.",
        },
        {
          name: "Qualité de l’extraction",
          maxScore: 25,
          description:
            "Les informations importantes à rechercher dans le contrat sont correctement identifiées.",
        },
        {
          name: "Traçabilité",
          maxScore: 20,
          description:
            "La méthode permet de relier les informations importantes à leur page ou section d’origine.",
        },
        {
          name: "Fiabilité",
          maxScore: 20,
          description:
            "Les règles empêchent l’invention d’informations absentes et distinguent correctement faits, absences et points d’attention.",
        },
        {
          name: "Exploitation professionnelle",
          maxScore: 20,
          description:
            "Les risques et questions complémentaires permettent réellement de préparer une décision.",
        },
      ],

      advancedChallenge:
        "Comparez maintenant deux contrats concurrents en conservant la référence de chaque information.",
    },

    // ==================================================
    // LEÇON 05
    // ==================================================

    "05": {
      skill:
        "Produire un rapport décisionnel complet à partir d’un problème d’entreprise.",

      title:
        "Projet final · Recommander une solution à la direction",

      estimatedTime:
        "30 à 40 min",

      tools: [
        "ChatGPT",
        "Recherche",
        "Documents",
        "Tableur",
      ],

      context: `Une entreprise européenne de 80 salariés souhaite déployer un nouvel assistant IA interne.

Les équipes travaillent depuis :

- Paris ;
- Londres ;
- Toronto ;
- Singapour.

L’assistant devra :

- répondre aux questions internes ;
- exploiter les procédures de l’entreprise ;
- aider à retrouver des documents ;
- protéger les informations privées ;
- être utilisable par tous les salariés.

La direction dispose d’un budget initial de 30 000 €.

Elle vous demande un dossier permettant de décider comment lancer le projet.`,

      deliverable: `Vous devez produire la structure d’un véritable rapport décisionnel :

1. objectif ;
2. contraintes ;
3. informations manquantes ;
4. besoins utilisateurs ;
5. options possibles ;
6. critères de comparaison ;
7. risques ;
8. budget ;
9. recommandation ;
10. plan d’action.`,

      mission:
        "Agissez comme un consultant. Votre dossier doit permettre à la direction de comprendre le problème et de décider quoi faire ensuite.",

      fields: [
        {
          id:
            "objectif",

          label:
            "Objectif du projet",

          description:
            "Quel problème l’entreprise cherche-t-elle réellement à résoudre ?",

          placeholder:
            "L’objectif est de permettre aux salariés de...",

          minLength:
            30,
        },

        {
          id:
            "contraintes",

          label:
            "Contraintes",

          description:
            "Identifiez les limites techniques, financières et organisationnelles.",

          placeholder:
            "Budget, sécurité, plusieurs pays...",

          minLength:
            45,
        },

        {
          id:
            "manquantes",

          label:
            "Informations manquantes",

          description:
            "Que faut-il clarifier avant de choisir une solution ?",

          placeholder:
            "Volume documentaire, nombre de requêtes...",

          minLength:
            45,
        },

        {
          id:
            "besoins",

          label:
            "Besoins utilisateurs",

          description:
            "Que devront réellement pouvoir faire les salariés ?",

          placeholder:
            "Chercher..., poser..., retrouver...",

          minLength:
            45,
        },

        {
          id:
            "options",

          label:
            "Options à comparer",

          description:
            "Quelles familles de solutions pouvez-vous envisager ?",

          placeholder:
            "Solution SaaS, développement interne...",

          minLength:
            40,
        },

        {
          id:
            "criteres",

          label:
            "Critères de décision",

          description:
            "Sur quels éléments comparerez-vous les options ?",

          placeholder:
            "Coût, sécurité, rapidité...",

          minLength:
            45,
        },

        {
          id:
            "risques",

          label:
            "Risques",

          description:
            "Quels problèmes peuvent apparaître ?", 

          placeholder:
            "Données sensibles, hallucinations...",

          minLength:
            40,
        },

        {
          id:
            "budget",

          label:
            "Répartition du budget",

          description:
            "Comment réfléchiriez-vous à l’utilisation des 30 000 € ?",

          placeholder:
            "Prototype, développement, infrastructure...",

          minLength:
            40,
        },

        {
          id:
            "recommandation",

          label:
            "Recommandation",

          description:
            "Quelle approche recommanderiez-vous et pourquoi ?",

          placeholder:
            "Je recommande de commencer par...",

          minLength:
            60,
        },

        {
          id:
            "plan",

          label:
            "Plan d’action",

          description:
            "Transformez la recommandation en étapes concrètes.",

          placeholder: `Étape 1 : ...
Étape 2 : ...
Étape 3 : ...`,

          minLength:
            70,
        },
      ],

      successCriteria: [
        "Le problème métier est clairement défini",
        "Les contraintes sont identifiées",
        "Les inconnues sont signalées",
        "Les besoins utilisateurs sont concrets",
        "Plusieurs options peuvent être comparées",
        "La sécurité est prise en compte",
        "Le budget est considéré",
        "La recommandation est argumentée",
        "Un plan d’action concret est proposé",
      ],

      hints: [
        "Vous ne connaissez pas encore le volume de documents.",
        "Pensez aux droits d’accès entre salariés.",
        "Commencer par un prototype peut réduire le risque.",
      ],

      correction: `SYNTHÈSE EXÉCUTIVE

L’entreprise souhaite réduire le temps passé à rechercher ses procédures et documents internes.

INFORMATIONS À CLARIFIER

- volume de documents ;
- formats ;
- droits d’accès ;
- nombre de requêtes ;
- langues ;
- outils existants ;
- exigences réglementaires.

OPTIONS

A. SaaS existant.
B. Solution personnalisée.
C. Prototype limité puis extension.

CRITÈRES

- sécurité ;
- coût ;
- rapidité de déploiement ;
- qualité des réponses ;
- intégrations ;
- contrôle des accès ;
- maintenance.

RISQUES

- exposition de données privées ;
- réponses incorrectes ;
- mauvais contrôle des permissions ;
- coûts IA ;
- faible adoption.

RECOMMANDATION

Commencer par un prototype limité à un groupe de documents et un petit nombre d’utilisateurs.

PLAN

1. Identifier les cas d’usage.
2. Auditer les documents.
3. Définir les permissions.
4. Construire un prototype.
5. Tester avec un groupe pilote.
6. Mesurer qualité et coût.
7. Corriger.
8. Étendre progressivement.`,

      evaluationCriteria: [
        {
          name: "Cadrage stratégique",
          maxScore: 15,
          description:
            "Le problème métier, l’objectif, les contraintes et les informations manquantes sont correctement identifiés.",
        },
        {
          name: "Besoins utilisateurs",
          maxScore: 15,
          description:
            "Les besoins décrivent concrètement ce que les salariés devront pouvoir réaliser avec l’assistant.",
        },
        {
          name: "Analyse des options",
          maxScore: 20,
          description:
            "Plusieurs approches pertinentes sont envisagées et peuvent être comparées selon une grille cohérente.",
        },
        {
          name: "Risques et budget",
          maxScore: 20,
          description:
            "Les principaux risques sont identifiés et le budget de 30 000 € est utilisé de manière réaliste et argumentée.",
        },
        {
          name: "Recommandation",
          maxScore: 15,
          description:
            "La recommandation découle du raisonnement précédent et explique clairement pourquoi cette approche est préférable.",
        },
        {
          name: "Plan d’action",
          maxScore: 15,
          description:
            "Le plan transforme la recommandation en étapes concrètes, ordonnées et applicables.",
        },
      ],

      advancedChallenge:
        "Transformez votre travail en présentation de 5 diapositives destinée au comité de direction.",
    },
  };

  return (
    exercises[
      slug
    ] ??
    exercises["01"]
  );
}
