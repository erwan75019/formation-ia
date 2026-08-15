import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import ClientSimulation from "@/components/formation/prompts/ClientSimulation";
import StudentRoleLab from "@/components/formation/prompts/StudentRoleLab";
import PromptTemplateLab from "@/components/formation/prompts/PromptTemplateLab";
import IterationLab from "@/components/formation/prompts/IterationLab";
import FinalMissionLab from "@/components/formation/prompts/FinalMissionLab";

const lessons = [
  {
    slug: "01",
    id: "prompts-01-structure",
    number: "01",
    title:
      "La structure d’un bon prompt",
    duration: "18 min",
    description:
      "Apprenez à transformer un problème réel en solution IA, puis à tester et contrôler le résultat.",
  },

  {
    slug: "02",
    id: "prompts-02-role",
    number: "02",
    title:
      "Attribuer un rôle utile à l’IA",
    duration: "15 min",
    description:
      "Comprenez comment un rôle peut réellement modifier la méthode et la qualité d’une réponse.",
  },

  {
    slug: "03",
    id: "prompts-03-templates",
    number: "03",
    title:
      "Créer des prompts réutilisables",
    duration: "18 min",
    description:
      "Transformez un prompt en moteur réutilisable derrière une interface simple.",
  },

  {
    slug: "04",
    id: "prompts-04-iteration",
    number: "04",
    title:
      "Améliorer une réponse",
    duration: "18 min",
    description:
      "Diagnostiquez une sortie moyenne, corrigez le prompt et mesurez réellement l’amélioration.",
  },

  {
    slug: "05",
    id: "prompts-05-project",
    number: "05",
    title:
      "Mission client",
    duration: "30 min",
    description:
      "Menez une mission complète en autonomie et transformez un besoin réel en premier service IA.",
  },
];

export default async function PromptLessonPage({
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
            item.completed
        )
        .map(
          (item) =>
            item.lesson_id
        ) ?? []
    );

  const currentIndex =
    lessons.findIndex(
      (item) =>
        item.id ===
        lesson.id
    );

  const previousLesson =
    currentIndex > 0
      ? lessons[
          currentIndex - 1
        ]
      : null;

  const allowed =
    currentIndex === 0 ||
    previousLesson ===
      null ||
    completedIds.has(
      previousLesson.id
    );

  if (!allowed) {
    redirect(
      "/formation/prompts"
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

      <div className="mx-auto max-w-6xl">

        {/* TOP */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/prompts"
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

        <div className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              LEÇON{" "}
              {lesson.number}
            </p>

            {lessonCompleted && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
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

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            {
              lesson.description
            }
          </p>

        </div>

        {/* VIDEO */}

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

        {/* BODY */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          <div className="space-y-6">

            {/* THEORY */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {
                  content.heading
                }
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {
                  content.introduction
                }
              </p>

              <div className="mt-8 space-y-4">

                {content.points.map(
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

            {/* LABS */}

            {lesson.slug ===
              "01" && (
              <ClientSimulation />
            )}

            {lesson.slug ===
              "02" && (
              <StudentRoleLab />
            )}

            {lesson.slug ===
              "03" && (
              <PromptTemplateLab />
            )}

            {lesson.slug ===
              "04" && (
              <IterationLab />
            )}

            {lesson.slug ===
              "05" && (
              <FinalMissionLab />
            )}

            {/* PRINCIPLE */}

            <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                PRINCIPE CLÉ
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {
                  content.exampleTitle
                }
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
                {
                  content.example
                }
              </p>

            </section>

            {/* QUIZ */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                VALIDATION
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Validez la leçon
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                La pratique constitue
                le cœur de cette leçon.
                Le quiz final vérifie
                les principes fondamentaux
                avant de valider votre progression.
              </p>

              <Link
                href={`/formation/prompts/${lesson.slug}/exercice`}
                className="mt-5 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                {lessonCompleted
                  ? "Refaire le quiz →"
                  : "Faire le quiz →"}
              </Link>

            </section>

            {/* NAVIGATION */}

            {lessonCompleted && (
              <div>

                {nextLesson ? (
                  <Link
                    href={`/formation/prompts/${nextLesson.slug}`}
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Leçon suivante →
                  </Link>
                ) : (
                  <Link
                    href="/formation/prompts"
                    className="inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                  >
                    Module terminé ✓
                  </Link>
                )}

              </div>
            )}

          </div>

          {/* COACH */}

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
              Posez une question
              sur la méthode ou demandez
              un autre exemple d’application.
            </div>

            <textarea
              className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none"
              placeholder="Votre question..."
            />

            <button
              type="button"
              className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white"
            >
              Envoyer
            </button>

          </aside>

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
        "Un bon prompt commence par la compréhension du problème.",

      introduction:
        "Lorsque vous travaillez pour un client, écrire immédiatement un prompt est rarement la meilleure première étape. Il faut comprendre le problème, les informations disponibles et le résultat recherché.",

      points: [
        {
          title:
            "Comprendre",
          text:
            "Identifiez ce qui prend du temps, coûte de l'argent ou crée des difficultés.",
        },

        {
          title:
            "Clarifier",
          text:
            "Déterminez précisément le résultat recherché.",
        },

        {
          title:
            "Construire",
          text:
            "Transformez ensuite le besoin en instructions exploitables.",
        },

        {
          title:
            "Contrôler",
          text:
            "Testez la sortie et vérifiez ce que l'IA produit réellement.",
        },
      ],

      exampleTitle:
        "Le prompt n’est qu’une partie du service",

      example: `Un client ne vous paie pas simplement pour écrire un prompt.

Il vous paie parce que vous êtes capable de :

- comprendre son problème ;
- proposer une solution pertinente ;
- obtenir un résultat fiable ;
- améliorer son processus.`,
    },

    "02": {
      heading:
        "Un rôle est utile lorsqu’il modifie réellement la façon de travailler de l’IA.",

      introduction:
        "Écrire « tu es le meilleur expert du monde » apporte rarement beaucoup. Un bon rôle donne surtout une perspective, une méthode ou un comportement utile à la tâche.",

      points: [
        {
          title:
            "Perspective",
          text:
            "Le rôle indique depuis quel point de vue l'IA doit examiner le problème.",
        },

        {
          title:
            "Méthode",
          text:
            "Un rôle pertinent définit comment l'IA doit accompagner l'utilisateur.",
        },

        {
          title:
            "Interaction",
          text:
            "L'IA peut questionner, critiquer, vérifier ou guider au lieu de simplement générer.",
        },

        {
          title:
            "Limites",
          text:
            "Le rôle ne remplace jamais l'objectif, les données et les règles du prompt.",
        },
      ],

      exampleTitle:
        "Rédacteur ou tuteur ?",

      example: `Un rôle utile ne sert pas à impressionner.

Il sert à modifier le comportement.

"Tuteur universitaire"
peut par exemple :

→ poser des questions ;
→ challenger un raisonnement ;
→ corriger une méthode ;
→ avancer étape par étape.`,
    },

    "03": {
      heading:
        "Un bon prompt peut devenir le moteur invisible d’un service.",

      introduction:
        "Lorsqu'une tâche revient régulièrement, vous ne devez pas reconstruire le prompt à chaque fois. Vous gardez les instructions permanentes et transformez les informations qui changent en variables.",

      points: [
        {
          title:
            "Identifier le fixe",
          text:
            "La méthode, les règles, le ton et le format peuvent rester identiques.",
        },

        {
          title:
            "Identifier les variables",
          text:
            "Le nom du client, le contenu à traiter ou l'objectif peuvent changer à chaque utilisation.",
        },

        {
          title:
            "Créer une interface",
          text:
            "Les variables peuvent être récupérées avec un formulaire au lieu de demander au client de modifier le prompt.",
        },

        {
          title:
            "Créer de la valeur",
          text:
            "Votre savoir-faire devient une méthode réutilisable que le client peut utiliser plusieurs fois.",
        },
      ],

      exampleTitle:
        "Prompt → Template → Produit",

      example: `PROMPT
Vous modifiez manuellement les informations.

↓

TEMPLATE
Les informations variables deviennent des champs.

↓

OUTIL
Le client remplit un formulaire.

↓

PRODUIT
Votre logique fonctionne sans exposer le prompt.`,
    },

    "04": {
      heading:
        "Une bonne itération commence par un diagnostic précis.",

      introduction:
        "Lorsqu'une réponse ne convient pas, le mauvais réflexe consiste à demander simplement « fais mieux ». Il faut identifier ce qui manque, ce qui est incorrect ou ce qui ne répond pas à l'objectif.",

      points: [
        {
          title:
            "Observer",
          text:
            "Regardez le résultat réellement produit, pas seulement le prompt.",
        },

        {
          title:
            "Diagnostiquer",
          text:
            "Identifiez les critères précis qui sont insuffisants.",
        },

        {
          title:
            "Modifier",
          text:
            "Corrigez les instructions responsables du problème.",
        },

        {
          title:
            "Mesurer",
          text:
            "Comparez la nouvelle sortie à l'ancienne selon les mêmes critères.",
        },
      ],

      exampleTitle:
        "L’itération n’est pas « refaire »",

      example: `Une vraie itération ressemble à :

SORTIE 1
→ problème observable

DIAGNOSTIC
→ cause probable dans le prompt

CORRECTION
→ modification ciblée

SORTIE 2
→ nouvelle mesure

Vous améliorez un système au lieu de simplement demander une autre réponse.`,
    },

    "05": {
      heading:
        "La vraie compétence est de transformer un problème en service utilisable.",

      introduction:
        "Cette mission rassemble tout ce que vous avez appris : entretien client, cadrage, choix de la solution, construction du prompt, test, contrôle et compréhension de la valeur créée.",

      points: [
        {
          title:
            "Découvrir",
          text:
            "Le client vous donne un problème, pas nécessairement la solution.",
        },

        {
          title:
            "Concevoir",
          text:
            "Choisissez une solution suffisamment simple pour répondre au besoin réel.",
        },

        {
          title:
            "Tester",
          text:
            "Une idée n'a de valeur que lorsqu'elle produit un résultat exploitable.",
        },

        {
          title:
            "Vendre un résultat",
          text:
            "Le client paie pour gagner du temps, améliorer la qualité ou résoudre un problème, pas simplement pour obtenir un prompt.",
        },
      ],

      exampleTitle:
        "Votre premier vrai changement de niveau",

      example: `Au début du module :

"Je sais demander quelque chose à une IA."

À la fin :

"Je sais interroger un client,
identifier une opportunité,
concevoir une solution,
construire le moteur IA,
tester sa sortie
et expliquer la valeur du service."

C'est cette deuxième compétence qui peut devenir professionnelle.`,
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ??
    contents["01"]
  );
}