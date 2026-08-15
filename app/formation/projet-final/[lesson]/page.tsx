import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ======================================================
// MODULE 12 — PROJET FINAL
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "final-01-spec",
    number: "01",
    title: "Définir le produit",
    duration: "20 min",
    description:
      "Choisissez le problème à résoudre, les utilisateurs et les fonctionnalités essentielles.",
  },
  {
    slug: "02",
    id: "final-02-architecture",
    number: "02",
    title: "Concevoir l’architecture",
    duration: "25 min",
    description:
      "Assemblez frontend, backend, authentification, base de données, IA, agents et RAG.",
  },
  {
    slug: "03",
    id: "final-03-data-security",
    number: "03",
    title: "Données et sécurité",
    duration: "25 min",
    description:
      "Définissez les tables, relations, permissions et règles de sécurité de l’application.",
  },
  {
    slug: "04",
    id: "final-04-ai-features",
    number: "04",
    title: "Fonctionnalités IA",
    duration: "28 min",
    description:
      "Décidez quelles tâches relèvent d’un LLM simple, d’un agent ou d’un pipeline RAG.",
  },
  {
    slug: "05",
    id: "final-05-backend",
    number: "05",
    title: "Backend et intégrations",
    duration: "30 min",
    description:
      "Organisez les routes serveur, appels API, validation, erreurs et services externes.",
  },
  {
    slug: "06",
    id: "final-06-production",
    number: "06",
    title: "Préparer la production",
    duration: "26 min",
    description:
      "Sécurisez les secrets, surveillez les erreurs, contrôlez les coûts et préparez le déploiement.",
  },
  {
    slug: "07",
    id: "final-07-project",
    number: "07",
    title: "Projet final : SaaS IA complet",
    duration: "90 min",
    description:
      "Construisez l’architecture complète d’un produit IA prêt à être développé et déployé.",
  },
];

export default async function FinalLessonPage({
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
    redirect("/formation/projet-final");
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
  // PROGRESSION DU MODULE
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
            href="/formation/projet-final"
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
              MODULE 12 · LEÇON {lesson.number}
            </p>

            {isProject && (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                Projet final
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

        {/* CONTENU */}

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
                          {String(
                            index + 1
                          ).padStart(
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

            {/* ARCHITECTURE */}

            {content.architecture && (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  ARCHITECTURE
                </p>

                <h2 className="mt-3 text-xl font-bold">
                  {content.exampleTitle}
                </h2>

                <div className="mt-6 flex flex-wrap items-center gap-3">

                  {content.architecture.map(
                    (step, index) => (
                      <div
                        key={`${step}-${index}`}
                        className="contents"
                      >

                        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
                          {step}
                        </div>

                        {index <
                          content.architecture.length -
                            1 && (
                          <span className="text-slate-600">
                            →
                          </span>
                        )}

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

            {/* CODE */}

            {content.code && (
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

            {/* EXERCICE / PROJET */}

            {!isProject ? (
              <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  EXERCICE
                </p>

                <h2 className="mt-4 text-2xl font-bold">
                  Validez cette étape du projet
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Cette fois, les exercices ne testent plus seulement
                  une définition. Vous devez choisir des décisions
                  d’architecture cohérentes pour préparer le produit final.
                </p>

                <Link
                  href={`/formation/projet-final/${lesson.slug}/exercice`}
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
                  PROJET FINAL
                </p>

                <h2 className="mt-4 text-3xl font-bold">
                  Construisez votre SaaS IA complet
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  Vous allez assembler l’authentification, la base de
                  données, l’interface, les routes backend, une
                  fonctionnalité IA, un pipeline RAG, une capacité
                  agentique, la sécurité et la préparation à la production.
                </p>

                <Link
                  href="/formation/projet-final/07/projet"
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Revoir le projet final →"
                    : "Commencer le projet final →"}
                </Link>

              </section>
            )}

            {/* NEXT */}

            {lessonCompleted && (
              <div>

                {nextLesson ? (
                  <Link
                    href={`/formation/projet-final/${nextLesson.slug}`}
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Leçon suivante →
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-block rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-50"
                  >
                    Retour au dashboard ✓
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
                  Architecte IA
                </p>

                <p className="text-xs text-slate-400">
                  Projet final · {lesson.number}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Posez une question sur l’architecture, le backend,
              la sécurité, les agents, le RAG ou la mise en production.
            </div>

            <textarea
              placeholder="Ex : est-ce que cette fonctionnalité doit être un agent ou une simple route backend ?"
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
// CONTENU DES LEÇONS
// ======================================================

function getLessonContent(
  slug: string
) {
  const contents = {
    "01": {
      heading:
        "Un produit commence par un problème précis.",
      introduction:
        "Avant de choisir une technologie ou d’écrire du code, vous devez savoir pour qui vous construisez, quel problème vous résolvez et quelle action principale votre utilisateur doit pouvoir réaliser.",
      points: [
        {
          title: "Utilisateur cible",
          text: "Définissez clairement qui utilisera le produit et dans quel contexte.",
        },
        {
          title: "Problème",
          text: "Identifiez une difficulté concrète suffisamment importante pour justifier le produit.",
        },
        {
          title: "Proposition de valeur",
          text: "Expliquez simplement ce que votre application permet de faire mieux ou plus rapidement.",
        },
        {
          title: "MVP",
          text: "Commencez par les fonctionnalités indispensables plutôt que par une liste infinie de possibilités.",
        },
      ],
      exampleTitle:
        "Assistant documentaire pour entreprises",
      architecture: [
        "Entreprise",
        "Documents",
        "Question",
        "Recherche",
        "Réponse",
      ],
      code: `Produit :
Assistant documentaire IA

Utilisateur :
Entreprise possédant beaucoup de documents internes

Problème :
Les employés perdent du temps à chercher une information.

MVP :
- compte utilisateur
- import de document
- recherche RAG
- chat documentaire
- historique`,
      exampleExplanation:
        "Le produit n’est pas défini par « utiliser de l’IA ». Il est défini par le problème qu’il résout. L’IA n’est qu’une technologie utilisée lorsque cela apporte une vraie valeur.",
    },

    "02": {
      heading:
        "L’architecture découpe le produit en responsabilités.",
      introduction:
        "Une architecture claire permet de décider ce qui appartient au navigateur, au serveur, à la base de données ou aux services d’intelligence artificielle.",
      points: [
        {
          title: "Frontend",
          text: "Affiche les pages, formulaires, documents et résultats à l’utilisateur.",
        },
        {
          title: "Backend",
          text: "Valide les demandes, protège les secrets et orchestre les services.",
        },
        {
          title: "Database",
          text: "Stocke les utilisateurs, documents, conversations et autres ressources.",
        },
        {
          title: "IA",
          text: "Le LLM, le RAG et les agents sont utilisés uniquement là où leur rôle est nécessaire.",
        },
      ],
      exampleTitle:
        "Architecture SaaS finale",
      architecture: [
        "Utilisateur",
        "Frontend",
        "Backend",
        "Auth",
        "Database",
        "RAG",
        "LLM",
        "Agent",
      ],
      code: `Utilisateur
   ↓
Frontend
   ↓
Backend
   ├── Auth
   ├── Database
   ├── RAG
   ├── LLM
   └── Agent / outils
   ↓
Frontend`,
      exampleExplanation:
        "Le backend joue généralement le rôle d’orchestrateur. Le frontend ne doit pas décider seul des actions sensibles et les services d’IA ne doivent pas obtenir un accès incontrôlé à votre système.",
    },

    "03": {
      heading:
        "Une application multi-utilisateurs doit isoler les données.",
      introduction:
        "Un utilisateur ne doit pas pouvoir lire les documents, conversations ou résultats d’un autre utilisateur simplement en modifiant une requête.",
      points: [
        {
          title: "Propriétaire",
          text: "Les ressources privées doivent pouvoir être reliées à un user_id.",
        },
        {
          title: "Relations",
          text: "Les documents, conversations et messages doivent posséder des relations cohérentes.",
        },
        {
          title: "RLS",
          text: "La base doit imposer les autorisations au niveau des lignes lorsque c’est pertinent.",
        },
        {
          title: "Backend",
          text: "Les opérations sensibles nécessitent également une validation serveur.",
        },
      ],
      exampleTitle:
        "Structure des données",
      architecture: [
        "auth.users",
        "documents",
        "conversations",
        "messages",
        "document_chunks",
      ],
      code: `auth.users
   │
   ├── documents
   │      └── document_chunks
   │
   └── conversations
          └── messages

documents.user_id
conversations.user_id

RLS :
auth.uid() = user_id`,
      exampleExplanation:
        "La sécurité ne doit pas dépendre seulement de ce que le frontend affiche. Même si un utilisateur modifie manuellement une requête, la base et le backend doivent empêcher l’accès non autorisé.",
    },

    "04": {
      heading:
        "Toutes les fonctionnalités IA ne nécessitent pas un agent.",
      introduction:
        "Une erreur fréquente consiste à utiliser une architecture agentique pour chaque fonctionnalité. Choisissez la solution la plus simple capable de résoudre correctement le besoin.",
      points: [
        {
          title: "LLM simple",
          text: "Utilisez-le lorsqu’une demande peut être traitée directement à partir du prompt et du contexte disponible.",
        },
        {
          title: "RAG",
          text: "Utilisez-le lorsque la réponse doit s’appuyer sur des documents ou connaissances externes.",
        },
        {
          title: "Agent",
          text: "Utilisez-le lorsqu’il faut choisir entre plusieurs actions ou outils et éventuellement enchaîner plusieurs étapes.",
        },
        {
          title: "Code classique",
          text: "N’utilisez pas un LLM pour une règle déterministe qu’un simple if ou une requête SQL peut résoudre.",
        },
      ],
      exampleTitle:
        "Choisir la bonne architecture IA",
      architecture: [
        "Besoin",
        "Déterministe ?",
        "Code",
        "Document ?",
        "RAG",
        "Actions ?",
        "Agent",
      ],
      code: `Besoin : calculer un prix
→ code classique

Besoin : résumer un texte
→ LLM

Besoin : répondre depuis des PDF
→ RAG + LLM

Besoin : choisir puis exécuter plusieurs outils
→ Agent`,
      exampleExplanation:
        "La meilleure architecture n’est pas celle qui contient le plus d’IA. C’est celle qui résout le problème avec le moins de complexité inutile.",
    },

    "05": {
      heading:
        "Le backend orchestre les intégrations du produit.",
      introduction:
        "Les routes serveur reçoivent les demandes du frontend, vérifient les utilisateurs, valident les données puis appellent les services nécessaires.",
      points: [
        {
          title: "Routes API",
          text: "Chaque route doit avoir une responsabilité claire.",
        },
        {
          title: "Validation",
          text: "Les données reçues du client doivent être contrôlées avant leur utilisation.",
        },
        {
          title: "Services",
          text: "Séparez si possible la logique métier des appels à Supabase, au LLM ou à d’autres API.",
        },
        {
          title: "Erreurs",
          text: "Une erreur externe ne doit pas faire planter silencieusement toute l’application.",
        },
      ],
      exampleTitle:
        "Route de chat documentaire",
      architecture: [
        "Frontend",
        "POST /api/chat",
        "Auth",
        "Validation",
        "RAG",
        "LLM",
        "Database",
        "Réponse",
      ],
      code: `export async function POST(
  request: Request
) {
  // 1. vérifier l'utilisateur
  // 2. lire la question
  // 3. valider les données
  // 4. rechercher les chunks
  // 5. appeler le LLM
  // 6. enregistrer le message
  // 7. retourner la réponse
}`,
      exampleExplanation:
        "Une route claire permet de comprendre facilement le trajet d’une demande. Plus le projet grandit, plus il devient utile de déplacer la logique complexe vers des fonctions ou services dédiés.",
    },

    "06": {
      heading:
        "Un projet n’est pas terminé lorsqu’il fonctionne uniquement en local.",
      introduction:
        "Passer en production implique sécurité, variables d’environnement, gestion des erreurs, coûts, limitations, logs et stratégie de déploiement.",
      points: [
        {
          title: "Secrets",
          text: "Les clés privées restent dans les variables d’environnement serveur.",
        },
        {
          title: "Erreurs",
          text: "Les erreurs importantes doivent être enregistrées et présentées proprement à l’utilisateur.",
        },
        {
          title: "Coûts",
          text: "Les appels IA, embeddings et autres services externes doivent être contrôlés.",
        },
        {
          title: "Limites",
          text: "Ajoutez des quotas, limites de fichiers, limites d’étapes agentiques et autres protections adaptées.",
        },
      ],
      exampleTitle:
        "Checklist production",
      architecture: null,
      code: `Production checklist

[✓] secrets côté serveur
[✓] authentification
[✓] RLS
[✓] validation des inputs
[✓] gestion des erreurs
[✓] limites d'upload
[✓] MAX_STEPS agent
[✓] contrôle des coûts
[✓] logs
[✓] variables d'environnement
[✓] tests
[✓] déploiement`,
      exampleExplanation:
        "La production ajoute des contraintes que l’on peut ignorer lors d’un prototype. Un utilisateur réel peut envoyer des données inattendues, déclencher beaucoup d’appels ou rencontrer une panne d’un service externe.",
    },

    "07": {
      heading:
        "Le projet final assemble toutes les briques du parcours.",
      introduction:
        "Vous allez concevoir puis construire un SaaS documentaire intelligent multi-utilisateurs. Il possédera une interface, une authentification, une base de données sécurisée, un pipeline RAG, un LLM et une capacité agentique contrôlée.",
      points: [
        {
          title: "SaaS",
          text: "Comptes utilisateurs, dashboard et données privées.",
        },
        {
          title: "RAG",
          text: "Import, chunks, embeddings, vector database et recherche sémantique.",
        },
        {
          title: "Agent",
          text: "Une capacité contrôlée permettant de sélectionner certains outils.",
        },
        {
          title: "Production",
          text: "Sécurité, validation, erreurs, limites et préparation au déploiement.",
        },
      ],
      exampleTitle:
        "Architecture du projet final",
      architecture: [
        "Utilisateur",
        "Dashboard",
        "Backend",
        "Supabase",
        "RAG",
        "LLM",
        "Agent",
        "Résultat",
      ],
      code: `UTILISATEUR
     ↓
AUTH / DASHBOARD
     ↓
UPLOAD DOCUMENT
     ↓
BACKEND
     ↓
CHUNKS + EMBEDDINGS
     ↓
VECTOR DATABASE

UTILISATEUR
     ↓
QUESTION
     ↓
BACKEND
     ↓
RAG
     ↓
CONTEXTE
     ↓
LLM
     ↓
AGENT si action nécessaire
     ↓
RÉPONSE
     ↓
HISTORIQUE / DATABASE`,
      exampleExplanation:
        "Ce projet ne demande plus de reconnaître une définition isolée. Vous devez être capable de décider où placer chaque responsabilité et pourquoi.",
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}