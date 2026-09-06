import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonCoach from "@/components/formation/LessonCoach";

// ======================================================
// MODULE 08 — BASES DE DONNÉES & SUPABASE
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "supabase-01-database",
    number: "01",
    title: "Comprendre une base de données",
    duration: "14 min",
    description:
      "Découvrez tables, lignes, colonnes et la manière dont une application organise ses données.",
  },
  {
    slug: "02",
    id: "supabase-02-tables",
    number: "02",
    title: "Créer des tables et des colonnes",
    duration: "18 min",
    description:
      "Apprenez à concevoir une table propre avec des types de données adaptés.",
  },
  {
    slug: "03",
    id: "supabase-03-crud",
    number: "03",
    title: "CRUD : créer, lire, modifier et supprimer",
    duration: "20 min",
    description:
      "Comprenez les quatre opérations fondamentales utilisées par presque toutes les applications.",
  },
  {
    slug: "04",
    id: "supabase-04-relations",
    number: "04",
    title: "Relations entre les données",
    duration: "18 min",
    description:
      "Apprenez à relier des utilisateurs, projets, commandes ou autres ressources.",
  },
  {
    slug: "05",
    id: "supabase-05-auth",
    number: "05",
    title: "Authentification et utilisateurs",
    duration: "20 min",
    description:
      "Comprenez comment gérer les comptes utilisateurs et associer des données à chaque personne.",
  },
  {
    slug: "06",
    id: "supabase-06-rls",
    number: "06",
    title: "Sécuriser avec RLS",
    duration: "22 min",
    description:
      "Apprenez comment contrôler précisément quelles lignes chaque utilisateur peut lire ou modifier.",
  },
  {
    slug: "07",
    id: "supabase-07-project",
    number: "07",
    title: "Mini-projet : base de données d’un SaaS",
    duration: "40 min",
    description:
      "Concevez la structure de données d’une application avec utilisateurs, ressources et règles de sécurité.",
  },
];

export default async function SupabaseLessonPage({
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

  const { data: progressData, error: progressError } =
    await supabase
      .from("lesson_progress")
      .select("lesson_id, completed, score")
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

  // ======================================================
  // INDEX
  // ======================================================

  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  // ======================================================
  // VERROUILLAGE
  // ======================================================

  const allowed =
    currentIndex === 0 ||
    previousLesson === null ||
    completedIds.has(previousLesson.id);

  if (!allowed) {
    redirect("/formation/supabase");
  }

  const lessonCompleted =
    completedIds.has(lesson.id);

  const lessonProgress =
    progressData?.find(
      (item) =>
        item.lesson_id === lesson.id
    );

  const lessonScore =
    lessonProgress?.score ?? null;

  const content =
    getLessonContent(lesson.slug);

  const isProject =
    lesson.slug === "07";

  // ======================================================
  // PROGRESSION MODULE
  // ======================================================

  const completedCount =
    lessons.filter((item) =>
      completedIds.has(item.id)
    ).length;

  const moduleProgress =
    Math.round(
      (completedCount /
        lessons.length) *
        100
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between gap-4">

          <Link
            href="/formation/supabase"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au module
          </Link>

          <div className="flex items-center gap-3">

            {lessonCompleted && (
              <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                ✓ Terminée
              </span>
            )}

            {lessonCompleted &&
              lessonScore !== null && (
                <span className="rounded-full bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                  Score : {lessonScore}%
                </span>
              )}

            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              Leçon {lesson.number} / {lessons.length}
            </span>

          </div>

        </div>

        {/* HEADER */}

        <section className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              MODULE 08 · LEÇON {lesson.number}
            </p>

            {isProject && (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                Mini-projet
              </span>
            )}

          </div>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            {lesson.description}
          </p>

        </section>

        {/* VIDEO */}

        <section className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 shadow-2xl">

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
                {lesson.title}
              </span>

              <span className="text-white">
                {lesson.duration}
              </span>

            </div>

          </div>

        </section>

        {/* PROGRESSION */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between text-sm">

            <span className="font-medium text-slate-500">
              Progression du module
            </span>

            <span className="font-semibold">
              {moduleProgress}%
            </span>

          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-500"
              style={{
                width: `${moduleProgress}%`,
              }}
            />

          </div>

          <p className="mt-3 text-xs text-slate-400">
            {completedCount} / {lessons.length} leçons terminées
          </p>

        </section>

        {/* CONTENT */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          <div className="space-y-6">

            {/* COURS */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {content.heading}
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {content.introduction}
              </p>

              <div className="mt-7 space-y-4">

                {content.points.map(
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

            </section>

            {/* SCHÉMA / TABLE */}

            {content.table ? (
              <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-8 py-5">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    EXEMPLE
                  </p>

                  <h2 className="mt-3 text-xl font-bold">
                    {content.exampleTitle}
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[650px] text-left text-sm">

                    <thead className="bg-slate-950 text-slate-400">

                      <tr>
                        {content.table.headers.map(
                          (header) => (
                            <th
                              key={header}
                              className="px-6 py-4 font-medium"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {content.table.rows.map(
                        (row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="bg-white"
                          >
                            {row.map(
                              (cell, cellIndex) => (
                                <td
                                  key={`${cell}-${cellIndex}`}
                                  className="px-6 py-4 text-slate-600"
                                >
                                  {cell}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </section>
            ) : (
              <section className="overflow-hidden rounded-[26px] bg-slate-950 shadow-xl">

                <div className="border-b border-slate-800 px-6 py-4">

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    EXEMPLE
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-white">
                    {content.exampleTitle}
                  </h2>

                </div>

                <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                  <code>
                    {content.code}
                  </code>
                </pre>

              </section>
            )}

            {/* EXPLICATION */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                COMPRENDRE L&apos;EXEMPLE
              </p>

              <p className="mt-4 leading-7 text-slate-500">
                {content.exampleExplanation}
              </p>

            </section>

            {/* ACTION */}

            {!isProject ? (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  EXERCICE
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Vérifiez votre compréhension
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Validez l&apos;exercice pour terminer cette leçon
                  et débloquer la suivante.
                </p>

                <Link
                  href={`/formation/supabase/${lesson.slug}/exercice`}
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Refaire l'exercice →"
                    : "Faire l'exercice →"}
                </Link>

              </section>
            ) : (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">
                  MINI-PROJET
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Concevez la base de données d&apos;un SaaS
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Vous allez définir les tables, les relations et
                  les règles de sécurité nécessaires pour une
                  application multi-utilisateurs.
                </p>

                <Link
                  href="/formation/supabase/07/projet"
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Revoir le projet →"
                    : "Commencer le mini-projet →"}
                </Link>

              </section>
            )}

            {/* NEXT */}

            {lessonCompleted && (
              <div>

                {nextLesson ? (
                  <Link
                    href={`/formation/supabase/${nextLesson.slug}`}
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

          </div>

          {/* COACH */}

          <LessonCoach lessonId={lesson.id} lessonLabel={`Base de données · Leçon ${lesson.number}`} />

        </div>

      </div>

    </main>
  );
}

// ======================================================
// CONTENU DES LEÇONS
// ======================================================

function getLessonContent(
  slug: string
) {
  const contents = {
    "01": {
      heading:
        "Une base de données organise les informations dont une application a besoin.",
      introduction:
        "Au lieu d'écrire toutes les données directement dans votre code, vous pouvez les conserver dans une base et les récupérer lorsque votre application en a besoin.",
      points: [
        {
          title: "Table",
          text: "Une table regroupe un même type de données, par exemple des projets ou des commandes.",
        },
        {
          title: "Colonne",
          text: "Une colonne décrit une propriété : nom, prix, statut ou user_id.",
        },
        {
          title: "Ligne",
          text: "Une ligne représente un élément précis de la table.",
        },
        {
          title: "Identifiant",
          text: "Une colonne id permet généralement d'identifier chaque ligne de manière unique.",
        },
      ],
      exampleTitle:
        "Une table projets",
      table: {
        headers: [
          "id",
          "user_id",
          "nom",
          "statut",
        ],
        rows: [
          [
            "101",
            "usr_42",
            "Assistant commercial",
            "actif",
          ],
          [
            "102",
            "usr_18",
            "Analyse documents",
            "brouillon",
          ],
        ],
      },
      code: "",
      exampleExplanation:
        "Chaque ligne représente un projet. Les colonnes décrivent les informations associées à ce projet. user_id permet de savoir à quel utilisateur appartient la ligne.",
    },

    "02": {
      heading:
        "Une bonne structure de table commence par de bonnes colonnes.",
      introduction:
        "Chaque colonne possède un nom et un type. Le type détermine quelles valeurs peuvent être enregistrées dans la colonne.",
      points: [
        {
          title: "text",
          text: "Convient aux chaînes de caractères comme un titre ou une description.",
        },
        {
          title: "integer",
          text: "Convient aux nombres entiers.",
        },
        {
          title: "boolean",
          text: "Permet de stocker une valeur vraie ou fausse.",
        },
        {
          title: "timestamp",
          text: "Permet notamment d'enregistrer une date et une heure.",
        },
      ],
      exampleTitle:
        "Structure d'une table projets",
      table: {
        headers: [
          "colonne",
          "type",
          "exemple",
        ],
        rows: [
          [
            "id",
            "uuid",
            "550e8400...",
          ],
          [
            "user_id",
            "uuid",
            "auth user",
          ],
          [
            "nom",
            "text",
            "Assistant IA",
          ],
          [
            "actif",
            "boolean",
            "true",
          ],
        ],
      },
      code: "",
      exampleExplanation:
        "Le type doit correspondre à la donnée stockée. Un identifiant utilisateur ou de ressource peut par exemple utiliser le type UUID, tandis qu'un nom sera du texte.",
    },

    "03": {
      heading:
        "CRUD représente les quatre opérations fondamentales sur les données.",
      introduction:
        "CRUD signifie Create, Read, Update et Delete. La majorité des fonctionnalités d'une application repose sur ces quatre opérations.",
      points: [
        {
          title: "Create",
          text: "Créer une nouvelle ligne.",
        },
        {
          title: "Read",
          text: "Lire une ou plusieurs lignes.",
        },
        {
          title: "Update",
          text: "Modifier une ligne existante.",
        },
        {
          title: "Delete",
          text: "Supprimer une ligne.",
        },
      ],
      exampleTitle:
        "Lire puis modifier un projet",
      table: null,
      code: `const { data, error } = await supabase
  .from("projects")
  .select("id, name, status");

const { error: updateError } = await supabase
  .from("projects")
  .update({
    status: "active"
  })
  .eq("id", projectId);`,
      exampleExplanation:
        "select() permet de lire des colonnes d'une table. update() modifie les valeurs indiquées et le filtre eq() permet ici de cibler uniquement le projet correspondant à projectId.",
    },

    "04": {
      heading:
        "Les relations évitent de dupliquer inutilement les informations.",
      introduction:
        "Une application contient souvent plusieurs types de données liés entre eux. On peut par exemple relier plusieurs projets à un même utilisateur.",
      points: [
        {
          title: "Clé primaire",
          text: "Elle identifie une ligne de manière unique.",
        },
        {
          title: "Clé étrangère",
          text: "Elle permet de faire référence à une ligne d'une autre table.",
        },
        {
          title: "Un utilisateur, plusieurs projets",
          text: "Plusieurs lignes de projects peuvent contenir le même user_id.",
        },
        {
          title: "Relations",
          text: "On peut ensuite récupérer des informations liées entre plusieurs tables.",
        },
      ],
      exampleTitle:
        "Relier users et projects",
      table: {
        headers: [
          "projects.id",
          "projects.user_id",
          "projects.name",
        ],
        rows: [
          [
            "p_01",
            "user_A",
            "Assistant commercial",
          ],
          [
            "p_02",
            "user_A",
            "Résumé documents",
          ],
          [
            "p_03",
            "user_B",
            "Agent immobilier",
          ],
        ],
      },
      code: "",
      exampleExplanation:
        "Les deux premiers projets appartiennent à user_A. Il n'est pas nécessaire de recopier toutes les informations de cet utilisateur dans chaque projet : on conserve simplement son identifiant.",
    },

    "05": {
      heading:
        "L'authentification permet à l'application de connaître l'utilisateur connecté.",
      introduction:
        "Une fois l'utilisateur authentifié, votre application peut récupérer son identifiant puis l'utiliser pour associer les données créées à son compte.",
      points: [
        {
          title: "Compte",
          text: "Un utilisateur possède une identité gérée par le système d'authentification.",
        },
        {
          title: "Session",
          text: "La session permet de savoir quel utilisateur est actuellement connecté.",
        },
        {
          title: "user.id",
          text: "L'identifiant de l'utilisateur peut être enregistré avec ses ressources.",
        },
        {
          title: "Données personnelles",
          text: "Chaque ressource peut ainsi être reliée à son propriétaire.",
        },
      ],
      exampleTitle:
        "Créer un projet pour l'utilisateur connecté",
      table: null,
      code: `const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return;
}

const { error } = await supabase
  .from("projects")
  .insert({
    user_id: user.id,
    name: "Assistant IA",
    status: "draft",
  });`,
      exampleExplanation:
        "Le programme récupère d'abord l'utilisateur authentifié. Le nouvel enregistrement contient ensuite user.id, ce qui permet de savoir à qui appartient le projet.",
    },

    "06": {
      heading:
        "RLS applique les règles de sécurité directement au niveau des lignes.",
      introduction:
        "Dans une application multi-utilisateurs, cacher les données dans l'interface ne suffit pas. La base elle-même doit vérifier que l'utilisateur a réellement le droit de lire ou modifier chaque ligne.",
      points: [
        {
          title: "Row Level Security",
          text: "RLS signifie Row Level Security : sécurité au niveau des lignes.",
        },
        {
          title: "Politique",
          text: "Une policy décrit les conditions dans lesquelles une opération est autorisée.",
        },
        {
          title: "auth.uid()",
          text: "Cette fonction permet notamment de comparer l'utilisateur authentifié au propriétaire d'une ligne.",
        },
        {
          title: "Protection réelle",
          text: "Même si quelqu'un tente une requête directement, les règles de la base continuent de s'appliquer.",
        },
      ],
      exampleTitle:
        "Autoriser un utilisateur à voir uniquement ses projets",
      table: null,
      code: `alter table projects
enable row level security;

create policy "Users read own projects"
on projects
for select
to authenticated
using (
  (select auth.uid()) = user_id
);`,
      exampleExplanation:
        "La policy autorise la lecture uniquement lorsque l'identifiant de l'utilisateur connecté correspond au user_id de la ligne. RLS doit être activé sur les tables exposées et les règles doivent être conçues selon les opérations autorisées. :contentReference[oaicite:1]{index=1}",
    },

    "07": {
      heading:
        "Vous allez maintenant concevoir la couche de données d'un véritable SaaS.",
      introduction:
        "Le mini-projet rassemble structure de tables, relations, authentification et sécurité afin de préparer le module suivant consacré à la création d'un SaaS complet.",
      points: [
        {
          title: "Utilisateurs",
          text: "Les utilisateurs seront gérés par l'authentification.",
        },
        {
          title: "Projects",
          text: "Chaque projet sera associé à un user_id.",
        },
        {
          title: "Messages",
          text: "Les messages pourront être reliés à un projet.",
        },
        {
          title: "RLS",
          text: "Chaque utilisateur devra uniquement accéder à ses propres ressources.",
        },
      ],
      exampleTitle:
        "Architecture cible",
      table: null,
      code: `auth.users
    │
    │ user_id
    ▼
projects
    │
    │ project_id
    ▼
messages

RLS:
auth.uid() = projects.user_id`,
      exampleExplanation:
        "Le système possède plusieurs niveaux liés entre eux. Un utilisateur peut avoir plusieurs projets et chaque projet peut posséder plusieurs messages. Les politiques de sécurité doivent empêcher l'accès aux ressources appartenant aux autres utilisateurs.",
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}
