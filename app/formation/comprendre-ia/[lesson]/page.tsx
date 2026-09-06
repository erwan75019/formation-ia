import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonCoach from "@/components/formation/LessonCoach";
import FileExplorerLab from "@/components/formation/FileExplorerLab";
import FileIntroPractice from "@/components/formation/FileIntroPractice";
import Module04PracticeLab from "@/components/formation/Module04PracticeLab";
import ProjectValidationNotice from "@/components/formation/projects/ProjectValidationNotice";
import {
  getPreviousOfficialLessonId,
  isValidLessonCompletion,
} from "@/lib/training/catalog";

const lessons = [
  {
    slug: "01",
    id: "fichiers-01-comprendre",
    number: "01",
    title: "Faire comprendre un fichier à l’IA",
    duration: "12 min",
    description:
      "Apprenez à donner un fichier à l’IA et à comprendre simplement ce qu’il contient.",
  },
  {
    slug: "02",
    id: "fichiers-02-questions",
    number: "02",
    title: "Poser des questions à ses informations",
    duration: "20 min",
    description:
      "Apprenez à retrouver rapidement ce qui vous intéresse dans vos propres informations.",
  },
  {
    slug: "03",
    id: "fichiers-03-organiser",
    number: "03",
    title: "Nettoyer et organiser ses informations",
    duration: "22 min",
    description:
      "Utilisez l’IA pour remettre de l’ordre dans un fichier sans connaissances techniques.",
  },
  {
    slug: "04",
    id: "fichiers-04-dashboard",
    number: "04",
    title: "Transformer un fichier en tableau de bord",
    duration: "25 min",
    description:
      "Transformez vos informations en un outil visuel simple à comprendre.",
  },
  {
    slug: "05",
    id: "fichiers-05-decisions",
    number: "05",
    title: "Faire ressortir ce qui mérite votre attention",
    duration: "22 min",
    description:
      "Repérez les évolutions, anomalies et informations importantes avec l’aide de l’IA.",
  },
  {
    slug: "06",
    id: "fichiers-06-projet",
    number: "06",
    title: "Projet — Construire mon outil personnel",
    duration: "35 min",
    description:
      "Construisez un outil que vous pourrez réellement continuer à utiliser après la formation.",
  },
];

export default async function UnderstandAILessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: lessonSlug } = await params;

  const lesson = lessons.find(
    (item) => item.slug === lessonSlug
  );

  if (!lesson) {
    notFound();
  }

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
      .select("lesson_id, completed, completed_at, score")
      .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => isValidLessonCompletion(item))
      .map((item) => item.lesson_id) ?? []
  );

  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLessonId = getPreviousOfficialLessonId(lesson.id);

  const allowed =
    previousLessonId === null || completedIds.has(previousLessonId);

  if (!allowed) {
    redirect("/formation/comprendre-ia");
  }

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const lessonCompleted =
    completedIds.has(lesson.id);

  const lessonProgress = progressData?.find(
    (item) => item.lesson_id === lesson.id
  );

  const lessonScore =
    lessonProgress?.score ?? null;

  const lessonContent = getLessonContent(
    lesson.slug
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">

          <Link
            href="/formation/comprendre-ia"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au module
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Leçon {lesson.number} / {lessons.length}
          </span>

        </div>

        {/* HEADER */}
        <div className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold text-slate-400">
              LEÇON {lesson.number}
            </p>

            {lessonCompleted && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                ✓ Terminée
              </span>
            )}

            {lessonCompleted &&
              lessonScore !== null && (
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  Score : {lessonScore}%
                </span>
              )}

          </div>

          <h1 className="mt-3 text-4xl font-bold">
            {lesson.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            {lesson.description}
          </p>

        </div>

        {/* CONTENU */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          <section className="space-y-6">

            {/* COURS */}
            <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {lessonContent.heading}
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {lessonContent.introduction}
              </p>

              <div className="mt-7 space-y-4">

                {lessonContent.points.map(
                  (point, index) => (
                    <div
                      key={point.title}
                      className="rounded-2xl bg-slate-50 p-5"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div>

                          <h3 className="font-semibold">
                            {point.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {point.text}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* LAB PRATIQUE LEÇON 01 */}
            {lesson.slug === "01" && (
              <>
                <FileExplorerLab />
                <FileIntroPractice />
              </>
            )}

            {lesson.slug === "02" && (
              <Module04PracticeLab lesson="02" />
            )}

            {lesson.slug === "03" && (
              <Module04PracticeLab lesson="03" />
            )}

            {lesson.slug === "04" && (
              <Module04PracticeLab lesson="04" />
            )}

            {lesson.slug === "05" && (
              <Module04PracticeLab lesson="05" />
            )}

            {lesson.slug === "06" && (
              <Module04PracticeLab lesson="06" />
            )}

            {/* EXEMPLE */}
            <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                EXEMPLE SIMPLE
              </p>

              <h2 className="mt-4 text-xl font-bold">
                {lessonContent.exampleTitle}
              </h2>

              <div className="mt-5 rounded-2xl bg-slate-950 p-6 text-sm leading-7 text-slate-200">
                {lessonContent.example}
              </div>

            </div>

            {/* QCM */}
            {lesson.id === "fichiers-06-projet" ? (
              <ProjectValidationNotice completed={lessonCompleted} />
            ) : (
            <div className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                EXERCICE DE VALIDATION
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                Vérifiez votre compréhension
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-400">
                Répondez au QCM de cette leçon et obtenez au moins
                70 % pour débloquer la suite.
              </p>

              <Link
                href={`/formation/comprendre-ia/${lesson.slug}/exercice`}
                className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                {lessonCompleted
                  ? "Refaire l'exercice →"
                  : "Faire l'exercice →"}
              </Link>

            </div>
            )}

            {/* SUIVANTE */}
            {lessonCompleted && (
              <div>

                {nextLesson ? (
                  <Link
                    href={`/formation/comprendre-ia/${nextLesson.slug}`}
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Leçon suivante →
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Terminer le module ✓
                  </Link>
                )}

              </div>
            )}

          </section>

          {/* COACH IA */}
          <LessonCoach lessonId={lesson.id} lessonLabel={`Leçon ${lesson.number}`} />

        </div>

      </div>

    </main>
  );
}

function getLessonContent(
  slug: string
) {
  const contents = {
    "01": {
      heading:
        "Un fichier peut devenir beaucoup plus simple à comprendre avec l’IA.",

      introduction:
        "Vous avez probablement déjà reçu un tableau rempli de chiffres, une liste de dépenses, des notes ou un fichier professionnel sans savoir immédiatement quoi en faire. L’IA peut vous aider à comprendre ces informations, à condition de commencer par lui expliquer ce que vous voulez obtenir.",

      points: [
        {
          title:
            "Vous n’avez pas besoin d’être expert",
          text:
            "Vous n’avez pas besoin de connaître Excel, les statistiques ou la programmation. Votre rôle est d’expliquer ce que vous cherchez à comprendre.",
        },
        {
          title:
            "Une ligne représente généralement un élément",
          text:
            "Dans une liste de dépenses, une ligne peut représenter une dépense. Dans une liste de commandes, une ligne peut représenter une commande.",
        },
        {
          title:
            "Les colonnes décrivent cet élément",
          text:
            "Une dépense peut par exemple avoir une date, un nom, une catégorie et un montant. Ces informations apparaissent généralement dans différentes colonnes.",
        },
        {
          title:
            "Commencez par comprendre avant d’analyser",
          text:
            "Avant de demander des conclusions à l’IA, demandez-lui d’abord ce que contient le fichier, comment il est organisé et si certaines informations semblent manquer.",
        },
      ],

      exampleTitle:
        "Un simple fichier de dépenses",

      example:
        "Imaginez un fichier contenant vos dépenses du mois. Chaque ligne représente une opération. Les colonnes indiquent par exemple la date, le commerçant, la catégorie et le montant. Avant de demander « Où est-ce que je dépense trop ? », commencez par demander à l’IA de vous expliquer le fichier et de vérifier que les informations sont suffisamment claires.",
    },

    "02": {
      heading:
        "Une bonne question transforme un fichier en information utile.",

      introduction:
        "Une fois que vous comprenez ce que contient votre fichier, vous pouvez utiliser l’IA pour retrouver une information, comparer des éléments ou répondre à une question précise.",

      points: [
        {
          title:
            "Partez de votre besoin",
          text:
            "Demandez-vous ce que vous voulez réellement savoir avant d’interroger l’IA.",
        },
        {
          title:
            "Posez une question précise",
          text:
            "« Quelles sont mes trois catégories de dépenses les plus importantes ? » est plus utile que « Analyse ce fichier ».",
        },
        {
          title:
            "Demandez les chiffres",
          text:
            "Lorsque l’IA donne une conclusion, demandez-lui de montrer les informations utilisées pour arriver à cette conclusion.",
        },
        {
          title:
            "Continuez la conversation",
          text:
            "Une première réponse peut conduire à une nouvelle question. Vous pouvez progressivement approfondir ce qui vous intéresse.",
        },
      ],

      exampleTitle:
        "Passer d’une demande vague à une question utile",

      example:
        "Au lieu de demander « Analyse mes dépenses », vous pouvez demander : « Quelles sont les trois catégories dans lesquelles j’ai dépensé le plus ce mois-ci ? Donne-moi le montant de chacune et explique simplement ton calcul. »",
    },

    "03": {
      heading:
        "L’IA peut vous aider à remettre de l’ordre dans des informations désorganisées.",

      introduction:
        "Les fichiers du quotidien ne sont pas toujours propres. Une même information peut être écrite de plusieurs façons, certaines cases peuvent être vides et des éléments peuvent apparaître plusieurs fois.",

      points: [
        {
          title:
            "Repérer les incohérences",
          text:
            "L’IA peut vous aider à identifier des noms, dates ou catégories écrits de différentes manières.",
        },
        {
          title:
            "Repérer les doublons",
          text:
            "Une même ligne peut parfois apparaître plusieurs fois et fausser ce que vous comprenez du fichier.",
        },
        {
          title:
            "Repérer les informations manquantes",
          text:
            "Une case vide n’est pas forcément une erreur, mais elle doit être identifiée avant de tirer une conclusion.",
        },
        {
          title:
            "Toujours vérifier avant de remplacer",
          text:
            "L’IA peut proposer des corrections, mais elle ne doit pas inventer une information qu’elle ne connaît pas.",
        },
      ],

      exampleTitle:
        "Des dates écrites de plusieurs façons",

      example:
        "Un fichier peut contenir « 12/08/2026 », « 12 août 2026 » et « 2026-08-12 ». L’IA peut proposer de les mettre au même format afin de rendre le fichier plus facile à utiliser.",
    },

    "04": {
      heading:
        "Un tableau de bord permet de voir l’essentiel sans relire tout le fichier.",

      introduction:
        "Après avoir compris et organisé vos informations, vous pouvez demander à l’IA de vous aider à créer une vue simple avec les chiffres et graphiques qui comptent vraiment pour vous.",

      points: [
        {
          title:
            "Choisir ce qui compte",
          text:
            "Un bon tableau de bord ne montre pas tout. Il montre d’abord les informations dont vous avez réellement besoin.",
        },
        {
          title:
            "Utiliser des chiffres simples",
          text:
            "Total des dépenses, revenus, moyenne des notes ou nombre de commandes peuvent être affichés immédiatement.",
        },
        {
          title:
            "Ajouter des graphiques utiles",
          text:
            "Un graphique sert à comprendre plus rapidement une évolution ou une répartition, pas simplement à rendre la page plus jolie.",
        },
        {
          title:
            "Pouvoir actualiser l’outil",
          text:
            "L’objectif est de construire quelque chose que vous pourrez réutiliser lorsque de nouvelles informations seront disponibles.",
        },
      ],

      exampleTitle:
        "Transformer ses dépenses en tableau de bord",

      example:
        "Au lieu de parcourir 200 opérations une par une, vous pouvez afficher vos dépenses totales, votre reste disponible, vos principales catégories et leur évolution au cours des derniers mois.",
    },

    "05": {
      heading:
        "L’IA peut attirer votre attention sur ce que vous n’auriez pas remarqué immédiatement.",

      introduction:
        "Une fois vos informations organisées, l’IA peut vous aider à repérer des changements, des valeurs inhabituelles ou des éléments qui méritent une vérification.",

      points: [
        {
          title:
            "Repérer une évolution",
          text:
            "Une dépense, une note, une vente ou une activité peut augmenter ou diminuer au fil du temps.",
        },
        {
          title:
            "Repérer quelque chose d’inhabituel",
          text:
            "Une valeur très différente des autres peut mériter votre attention.",
        },
        {
          title:
            "Demander une justification",
          text:
            "Si l’IA affirme qu’une situation s’améliore ou se dégrade, demandez-lui quels chiffres soutiennent cette conclusion.",
        },
        {
          title:
            "Vous gardez la décision finale",
          text:
            "L’IA aide à voir et comprendre. Elle ne connaît pas nécessairement tout le contexte de votre situation.",
        },
      ],

      exampleTitle:
        "Une hausse inhabituelle",

      example:
        "L’IA remarque que vos dépenses de transport sont beaucoup plus élevées ce mois-ci. Avant d’en conclure qu’il existe un problème, vous vérifiez les opérations concernées et découvrez qu’un billet de train exceptionnel explique cette hausse.",
    },

    "06": {
      heading:
        "Construisez maintenant quelque chose qui vous appartient.",

      introduction:
        "Le projet final rassemble ce que vous avez appris. Vous allez choisir une situation réelle et transformer vos informations en un outil simple que vous pourrez continuer à utiliser.",

      points: [
        {
          title:
            "Choisissez votre besoin",
          text:
            "Budget, études, activité professionnelle, commandes, objectifs ou tout autre sujet qui vous est utile.",
        },
        {
          title:
            "Utilisez vos informations",
          text:
            "Vous pourrez partir d’un fichier personnel ou utiliser un exemple fourni par la formation.",
        },
        {
          title:
            "Construisez votre outil",
          text:
            "Choisissez les informations importantes, la manière de les présenter et les questions auxquelles votre outil doit répondre.",
        },
        {
          title:
            "Gardez-le après la formation",
          text:
            "Votre objectif n’est pas de réussir un exercice fictif mais de disposer d’un outil que vous pourrez réellement réutiliser.",
        },
      ],

      exampleTitle:
        "Votre projet peut être très simple",

      example:
        "Un étudiant peut construire un suivi de ses notes. Un salarié peut suivre ses tâches ou son activité. Un indépendant peut suivre ses revenus. Un particulier peut suivre son budget. Le meilleur projet est celui qui vous sera réellement utile.",
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}
