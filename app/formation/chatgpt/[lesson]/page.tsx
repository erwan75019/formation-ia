import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type LessonContent = {
  heading: string;
  introduction: string;

  flow?: {
    title: string;
    text: string;
  }[];

  examplesTitle: string;

  examples: {
    icon: string;
    title: string;
    prompt: string;
  }[];

  comparison?: {
    before: {
      label: string;
      text: string;
      result: string;
    };

    after: {
      label: string;
      text: string;
      result: string;
    };
  };

  warningTitle: string;
  warning: string;

  takeaways: string[];
};

const lessons = [
  {
    slug: "01",
    id: "chatgpt-01-intro",
    number: "01",
    title:
      "Qu’est-ce que ChatGPT ?",
    duration: "6 min",
    description:
      "Découvrez simplement ce qu’est ChatGPT, ce qu’il peut faire et ses principales limites.",
  },

  {
    slug: "02",
    id: "chatgpt-02-interface",
    number: "02",
    title:
      "Découvrir l’interface",
    duration: "8 min",
    description:
      "Apprenez à utiliser une conversation, retrouver vos échanges et fournir des informations à ChatGPT.",
  },

  {
    slug: "03",
    id: "chatgpt-03-prompt",
    number: "03",
    title:
      "Écrire son premier prompt",
    duration: "8 min",
    description:
      "Comprenez comment formuler une demande simple pour obtenir une réponse plus utile.",
  },

  {
    slug: "04",
    id: "chatgpt-04-contexte",
    number: "04",
    title:
      "Donner du contexte",
    duration: "8 min",
    description:
      "Voyez comment quelques informations supplémentaires peuvent complètement améliorer une réponse.",
  },

  {
    slug: "05",
    id: "chatgpt-05-format",
    number: "05",
    title:
      "Demander un format précis",
    duration: "7 min",
    description:
      "Apprenez à demander un tableau, une liste, un résumé, un email ou des étapes.",
  },
];

export default async function LessonPage({
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

  const currentIndex =
    lessons.findIndex(
      (item) =>
        item.id ===
        lesson.id
    );

  const {
    data: progressData,
    error: progressError,
  } =
    await supabase
      .from(
        "lesson_progress"
      )
      .select(
        "lesson_id, completed, score"
      )
      .eq(
        "user_id",
        user.id
      );

  if (progressError) {
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
            item.completed
        )
        .map(
          (item) =>
            item.lesson_id
        ) ?? []
    );

  // Compatibilité avec l'ancien identifiant
  if (
    completedIds.has(
      "chatgpt-prompt-01"
    )
  ) {
    completedIds.add(
      "chatgpt-03-prompt"
    );
  }

  const previousLesson =
    currentIndex > 0
      ? lessons[
          currentIndex - 1
        ]
      : null;

  const allowed =
    currentIndex === 0 ||
    previousLesson === null ||
    completedIds.has(
      previousLesson.id
    );

  if (!allowed) {
    redirect(
      "/formation/chatgpt"
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

  const content =
    getLessonContent(
      lesson.slug
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-5xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between gap-4">

          <Link
            href="/formation/chatgpt"
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

        {/* HEADER */}

        <header className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold tracking-[0.18em] text-slate-400">
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
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  Score :{" "}
                  {lessonScore}%
                </span>
              )}

          </div>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            {
              lesson.description
            }
          </p>

        </header>

        {/* VIDEO */}

        <section className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 shadow-xl">

          <div className="flex aspect-video items-center justify-center">

            <button
              type="button"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-slate-950 shadow-xl transition hover:scale-105"
            >
              ▶
            </button>

          </div>

          <div className="border-t border-slate-800 px-6 py-4">

            <div className="flex items-center justify-between gap-4 text-sm">

              <span className="text-slate-400">
                {
                  lesson.title
                }
              </span>

              <span className="font-medium text-white">
                {
                  lesson.duration
                }
              </span>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <div className="mt-8 space-y-6">

          {/* ESSENTIEL */}

          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

            <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
              L’ESSENTIEL
            </p>

            <h2 className="mt-4 text-2xl font-bold md:text-3xl">
              {
                content.heading
              }
            </h2>

            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
              {
                content.introduction
              }
            </p>

          </section>

          {/* FLOW */}

          {content.flow?.length ? (
            <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

              <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
                COMMENT ÇA FONCTIONNE
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">

                {content.flow.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.title
                      }
                      className="rounded-2xl bg-slate-50 p-5"
                    >

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold shadow-sm">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <h3 className="mt-4 font-bold">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {
                          item.text
                        }
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          ) : null}

          {/* EXAMPLES */}

          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

            <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
              EXEMPLES
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {
                content.examplesTitle
              }
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              {content.examples.map(
                (example) => (
                  <ExampleCard
                    key={
                      example.title
                    }
                    icon={
                      example.icon
                    }
                    title={
                      example.title
                    }
                    prompt={
                      example.prompt
                    }
                  />
                )
              )}

            </div>

          </section>

          {/* COMPARISON */}

          {content.comparison ? (
            <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

              <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
                VOYEZ LA DIFFÉRENCE
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <ComparisonCard
                  label={
                    content
                      .comparison
                      .before
                      .label
                  }
                  text={
                    content
                      .comparison
                      .before
                      .text
                  }
                  result={
                    content
                      .comparison
                      .before
                      .result
                  }
                  type="before"
                />

                <ComparisonCard
                  label={
                    content
                      .comparison
                      .after
                      .label
                  }
                  text={
                    content
                      .comparison
                      .after
                      .text
                  }
                  result={
                    content
                      .comparison
                      .after
                      .result
                  }
                  type="after"
                />

              </div>

            </section>
          ) : null}

          {/* WARNING */}

          <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-7 md:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                ⚠️
              </div>

              <div>

                <p className="text-xs font-bold tracking-[0.16em] text-amber-700">
                  À SAVOIR
                </p>

                <h2 className="mt-2 text-xl font-bold text-amber-950">
                  {
                    content.warningTitle
                  }
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-amber-900">
                  {
                    content.warning
                  }
                </p>

              </div>

            </div>

          </section>

          {/* TAKEAWAYS */}

          <section className="rounded-[28px] bg-slate-950 p-7 text-white shadow-xl md:p-8">

            <p className="text-xs font-bold tracking-[0.18em] text-slate-500">
              À RETENIR
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Trois idées suffisent
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-3">

              {content.takeaways.map(
                (
                  takeaway,
                  index
                ) => (
                  <div
                    key={`${takeaway}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                      ✓
                    </div>

                    <p className="mt-4 text-sm font-medium leading-6 text-slate-200">
                      {
                        takeaway
                      }
                    </p>

                  </div>
                )
              )}

            </div>

          </section>

          {/* QUIZ */}

          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

            <div className="flex flex-wrap items-end justify-between gap-6">

              <div>

                <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
                  VALIDATION
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  Vérifiez que vous avez compris
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Quelques questions suffisent
                  pour valider cette leçon.
                  Vous devez obtenir au moins
                  70 %.
                </p>

              </div>

              <Link
                href={`/formation/chatgpt/${lesson.slug}/exercice`}
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                {lessonCompleted
                  ? "Refaire le QCM →"
                  : "Faire le QCM →"}
              </Link>

            </div>

          </section>

          {/* NAVIGATION */}

          {lessonCompleted && (
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">

              <Link
                href="/formation/chatgpt"
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
              >
                ← Toutes les leçons
              </Link>

              {nextLesson ? (
                <Link
                  href={`/formation/chatgpt/${nextLesson.slug}`}
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                >
                  Leçon suivante →
                </Link>
              ) : (
                <Link
                  href="/formation/chatgpt"
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                >
                  Module terminé ✓
                </Link>
              )}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}

/* ============================================================
   CONTENT
============================================================ */

function getLessonContent(
  slug: string
): LessonContent {
  const contents: Record<
    string,
    LessonContent
  > = {
    "01": {
      heading:
        "ChatGPT est un assistant avec lequel vous communiquez en langage naturel.",

      introduction:
        "Vous écrivez une demande comme vous le feriez à une personne. ChatGPT analyse votre message puis génère une réponse. Il peut vous aider à créer, comprendre, résumer, organiser ou transformer des informations.",

      flow: [
        {
          title:
            "Vous écrivez",
          text:
            "Vous posez une question ou expliquez ce que vous voulez faire.",
        },

        {
          title:
            "ChatGPT analyse",
          text:
            "Il prend en compte votre demande et le contexte disponible.",
        },

        {
          title:
            "Il répond",
          text:
            "Il génère une réponse adaptée aux instructions qu'il a comprises.",
        },
      ],

      examplesTitle:
        "Quelques usages très simples",

      examples: [
        {
          icon:
            "✍️",
          title:
            "Créer",
          prompt:
            "Donne-moi 10 idées de noms pour une marque de vêtements.",
        },

        {
          icon:
            "🧠",
          title:
            "Comprendre",
          prompt:
            "Explique-moi l'inflation comme si j'avais 15 ans.",
        },

        {
          icon:
            "📄",
          title:
            "Transformer",
          prompt:
            "Résume ce texte en 5 points importants.",
        },
      ],

      warningTitle:
        "Une réponse convaincante peut être fausse.",

      warning:
        "ChatGPT peut se tromper, mal comprendre une information ou produire quelque chose d'inexact. Pour les informations importantes, récentes ou sensibles, il faut vérifier.",

      takeaways: [
        "Vous pouvez communiquer avec ChatGPT en langage naturel.",
        "Il peut créer, expliquer, analyser et transformer du contenu.",
        "Il ne faut pas considérer automatiquement toutes ses réponses comme vraies.",
      ],
    },

    "02": {
      heading:
        "Une conversation permet de travailler avec ChatGPT progressivement.",

      introduction:
        "Vous n'avez pas besoin de tout demander dans un seul message. Une conversation permet de préciser, corriger ou continuer une demande au fur et à mesure.",

      flow: [
        {
          title:
            "Premier message",
          text:
            "Vous commencez par expliquer votre besoin.",
        },

        {
          title:
            "Première réponse",
          text:
            "ChatGPT vous propose une base de travail.",
        },

        {
          title:
            "Vous continuez",
          text:
            "Vous pouvez ensuite demander une modification ou ajouter une information.",
        },
      ],

      examplesTitle:
        "Une conversation peut évoluer",

      examples: [
        {
          icon:
            "💬",
          title:
            "Continuer",
          prompt:
            "Maintenant, rends cette explication plus courte.",
        },

        {
          icon:
            "📎",
          title:
            "Ajouter",
          prompt:
            "Utilise aussi le document que je viens de joindre.",
        },

        {
          icon:
            "🔄",
          title:
            "Corriger",
          prompt:
            "Conserve les idées mais utilise un ton plus professionnel.",
        },
      ],

      comparison: {
        before: {
          label:
            "NOUVELLE CONVERSATION",

          text:
            "Écris un email professionnel.",

          result:
            "ChatGPT dispose de peu d'informations sur votre situation.",
        },

        after: {
          label:
            "CONVERSATION EN COURS",

          text:
            "Rends maintenant l'email plus court.",

          result:
            "ChatGPT peut reprendre le travail déjà présent dans la conversation.",
        },
      },

      warningTitle:
        "Le contexte disponible dépend de la conversation.",

      warning:
        "Une nouvelle conversation peut nécessiter de redonner certaines informations importantes. Ne supposez pas que chaque nouveau chat connaît automatiquement tous vos échanges précédents.",

      takeaways: [
        "Vous pouvez améliorer une réponse progressivement.",
        "Vous pouvez ajouter des informations sans recommencer entièrement.",
        "Une nouvelle conversation peut nécessiter de redonner du contexte.",
      ],
    },

    "03": {
      heading:
        "Un prompt est simplement la demande que vous adressez à ChatGPT.",

      introduction:
        "Vous n'avez pas besoin d'une formule compliquée. Commencez par expliquer clairement ce que vous voulez obtenir. Plus l'objectif est compréhensible, plus la réponse a de chances d'être utile.",

      examplesTitle:
        "Commencez par une action claire",

      examples: [
        {
          icon:
            "📝",
          title:
            "Rédiger",
          prompt:
            "Rédige un email pour demander un rendez-vous.",
        },

        {
          icon:
            "📚",
          title:
            "Expliquer",
          prompt:
            "Explique simplement comment fonctionne la photosynthèse.",
        },

        {
          icon:
            "🔎",
          title:
            "Comparer",
          prompt:
            "Compare ces deux offres et explique leurs principales différences.",
        },
      ],

      comparison: {
        before: {
          label:
            "TROP VAGUE",

          text:
            "Parle-moi du sport.",

          result:
            "La réponse peut partir dans beaucoup de directions.",
        },

        after: {
          label:
            "PLUS CLAIR",

          text:
            "Explique les principaux bénéfices de la musculation pour un débutant.",

          result:
            "L'objectif de la réponse est beaucoup plus précis.",
        },
      },

      warningTitle:
        "Plus long ne signifie pas forcément meilleur.",

      warning:
        "Un bon prompt n'est pas celui qui contient le plus de mots. Il doit surtout rendre votre objectif compréhensible. Les techniques avancées seront vues dans le module consacré au prompting.",

      takeaways: [
        "Un prompt est simplement votre demande à ChatGPT.",
        "Commencez par expliquer clairement l'action attendue.",
        "Une demande précise donne généralement une réponse plus ciblée.",
      ],
    },

    "04": {
      heading:
        "Le contexte aide ChatGPT à adapter sa réponse à votre situation.",

      introduction:
        "Une même question peut avoir plusieurs bonnes réponses selon la personne, son objectif ou ses contraintes. Quelques informations utiles peuvent éviter une réponse trop générique.",

      examplesTitle:
        "Les informations qui peuvent aider",

      examples: [
        {
          icon:
            "👤",
          title:
            "Votre situation",
          prompt:
            "Je suis débutant et je n'ai jamais utilisé Excel.",
        },

        {
          icon:
            "🎯",
          title:
            "Votre objectif",
          prompt:
            "Je veux préparer une présentation orale de 5 minutes.",
        },

        {
          icon:
            "⏱️",
          title:
            "Vos contraintes",
          prompt:
            "Je dispose de seulement 30 minutes par jour.",
        },
      ],

      comparison: {
        before: {
          label:
            "SANS CONTEXTE",

          text:
            "Donne-moi un programme de révision.",

          result:
            "ChatGPT doit deviner votre niveau, votre matière et votre disponibilité.",
        },

        after: {
          label:
            "AVEC CONTEXTE",

          text:
            "Je prépare un examen d'histoire dans 10 jours. J'ai 1 heure par soir et 6 chapitres à revoir. Fais-moi un planning.",

          result:
            "Le programme peut maintenant être adapté à votre situation réelle.",
        },
      },

      warningTitle:
        "Ajoutez seulement le contexte utile.",

      warning:
        "Vous n'avez pas besoin de raconter toute votre situation. Donnez surtout les informations qui peuvent réellement modifier la réponse : objectif, niveau, budget, délai, contraintes ou public concerné.",

      takeaways: [
        "Le contexte permet de personnaliser la réponse.",
        "Donnez les informations qui peuvent réellement changer le résultat.",
        "Objectifs et contraintes sont souvent les éléments les plus utiles.",
      ],
    },

    "05": {
      heading:
        "Vous pouvez choisir comment ChatGPT doit présenter sa réponse.",

      introduction:
        "Une réponse peut être correcte mais difficile à utiliser. Vous pouvez demander un format adapté à votre besoin : liste, tableau, résumé, email ou étapes.",

      examplesTitle:
        "Un même contenu peut prendre plusieurs formes",

      examples: [
        {
          icon:
            "📋",
          title:
            "Liste",
          prompt:
            "Donne-moi les 5 points essentiels sous forme de liste.",
        },

        {
          icon:
            "📊",
          title:
            "Tableau",
          prompt:
            "Compare ces trois options dans un tableau.",
        },

        {
          icon:
            "✉️",
          title:
            "Email",
          prompt:
            "Transforme ces informations en email professionnel.",
        },
      ],

      comparison: {
        before: {
          label:
            "FORMAT LIBRE",

          text:
            "Compare ces trois abonnements.",

          result:
            "La réponse peut être présentée en plusieurs paragraphes difficiles à comparer.",
        },

        after: {
          label:
            "FORMAT PRÉCIS",

          text:
            "Compare ces trois abonnements dans un tableau avec prix, avantages et inconvénients, puis recommande-en un.",

          result:
            "La réponse devient beaucoup plus facile à lire et à comparer.",
        },
      },

      warningTitle:
        "Choisissez le format selon votre objectif.",

      warning:
        "Un tableau est utile pour comparer, une liste pour retenir des points, un email pour communiquer et des étapes pour agir. Il n'existe pas un format meilleur dans toutes les situations.",

      takeaways: [
        "Vous pouvez demander explicitement la forme de la réponse.",
        "Le bon format dépend de l'usage que vous allez faire du résultat.",
        "Tableaux, listes, emails, résumés et étapes couvrent déjà beaucoup de besoins.",
      ],
    },
  };

  return (
    contents[slug] ??
    contents["01"]
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function ExampleCard({
  icon,
  title,
  prompt,
}: {
  icon: string;
  title: string;
  prompt: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <div className="mt-3 rounded-xl bg-white p-4">

        <p className="text-sm leading-6 text-slate-600">
          « {prompt} »
        </p>

      </div>

    </div>
  );
}

function ComparisonCard({
  label,
  text,
  result,
  type,
}: {
  label: string;
  text: string;
  result: string;
  type:
    | "before"
    | "after";
}) {
  const after =
    type ===
    "after";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        after
          ? "border-slate-300 bg-slate-100"
          : "border-slate-200 bg-slate-50"
      }`}
    >

      <p
        className={`text-xs font-bold tracking-[0.14em] ${
          after
            ? "text-slate-950"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <div className="mt-4 rounded-xl bg-white p-4">

        <p className="text-sm font-medium leading-6 text-slate-800">
          « {text} »
        </p>

      </div>

      <p
        className={`mt-4 text-sm leading-6 ${
          after
            ? "text-slate-700"
            : "text-slate-500"
        }`}
      >
        {result}
      </p>

    </div>
  );
}