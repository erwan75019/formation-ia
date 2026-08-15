"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Question = {
  type: "mcq" | "code" | "architecture";
  question: string;
  code?: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

type Exercise = {
  lessonId: string;
  title: string;
  questions: Question[];
};

const exercises: Record<string, Exercise> = {
  "01": {
    lessonId: "final-01-spec",
    title: "Définir le produit",
    questions: [
      {
        type: "mcq",
        question:
          "Quelle est la meilleure première étape avant de commencer à coder un SaaS IA ?",
        answers: [
          "Choisir immédiatement le modèle IA le plus puissant",
          "Définir le problème, l’utilisateur cible et le besoin principal",
          "Créer toutes les tables possibles",
          "Ajouter un agent IA dès le départ",
        ],
        correctAnswer: 1,
        explanation:
          "Le produit doit partir d’un besoin réel. Les choix techniques viennent ensuite.",
      },
      {
        type: "mcq",
        question:
          "Quel exemple correspond le mieux à un MVP ?",
        answers: [
          "Une première version avec compte utilisateur, upload de documents et chat RAG",
          "Une application avec 40 fonctionnalités avant le premier utilisateur",
          "Un site qui contient uniquement une page de présentation",
          "Un produit qui change complètement de fonction à chaque écran",
        ],
        correctAnswer: 0,
        explanation:
          "Un MVP contient les fonctionnalités essentielles nécessaires pour résoudre le problème principal.",
      },
      {
        type: "architecture",
        question:
          "Pour un assistant documentaire d’entreprise, quelle fonctionnalité apporte directement la valeur principale ?",
        answers: [
          "Changer la couleur du dashboard",
          "Répondre aux questions à partir des documents internes",
          "Afficher une animation au chargement",
          "Ajouter dix thèmes visuels",
        ],
        correctAnswer: 1,
        explanation:
          "La proposition de valeur centrale est ici la recherche et la réponse à partir des documents.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi éviter de mettre trop de fonctionnalités dans la première version ?",
        answers: [
          "Parce qu’un SaaS ne peut jamais évoluer",
          "Pour tester rapidement si le produit résout réellement le problème principal",
          "Parce que les bases de données limitent le nombre de fonctionnalités",
          "Parce qu’un frontend ne peut contenir qu’une seule page",
        ],
        correctAnswer: 1,
        explanation:
          "Une première version focalisée permet de tester la valeur du produit avant d’ajouter de la complexité.",
      },
    ],
  },

  "02": {
    lessonId: "final-02-architecture",
    title: "Concevoir l’architecture",
    questions: [
      {
        type: "architecture",
        question:
          "Quel trajet correspond le mieux à une demande sensible dans un SaaS IA ?",
        answers: [
          "Utilisateur → Frontend → Backend → Services nécessaires → Backend → Frontend",
          "Utilisateur → Database directement",
          "Frontend → clé API publique → LLM",
          "LLM → navigateur → Supabase sans contrôle",
        ],
        correctAnswer: 0,
        explanation:
          "Le backend sert d’orchestrateur et contrôle les opérations sensibles.",
      },
      {
        type: "mcq",
        question:
          "Quel élément appartient principalement au frontend ?",
        answers: [
          "La clé privée du fournisseur IA",
          "Le formulaire de question utilisateur",
          "La validation serveur",
          "L’exécution des outils agentiques sensibles",
        ],
        correctAnswer: 1,
        explanation:
          "Le formulaire est une partie de l’interface visible et interactive.",
      },
      {
        type: "mcq",
        question:
          "Quel élément doit généralement rester côté backend ?",
        answers: [
          "Le texte d’un bouton",
          "Les secrets et la logique sensible",
          "Le titre de la page",
          "La mise en page du dashboard",
        ],
        correctAnswer: 1,
        explanation:
          "Les secrets et les opérations sensibles doivent rester dans un environnement de confiance.",
      },
      {
        type: "architecture",
        question:
          "Une question doit être répondue à partir de documents privés. Quelle brique est indispensable ?",
        answers: [
          "Uniquement CSS",
          "Un pipeline RAG",
          "Uniquement un agent",
          "Une animation frontend",
        ],
        correctAnswer: 1,
        explanation:
          "Le RAG sert précisément à récupérer le contexte pertinent depuis des documents externes ou privés.",
      },
      {
        type: "mcq",
        question:
          "Le backend doit-il obligatoirement contenir toute la logique dans un seul fichier ?",
        answers: [
          "Oui",
          "Non, la logique complexe peut être séparée en services et fonctions dédiées",
          "Oui, sinon Next.js ne fonctionne pas",
          "Oui, surtout pour les projets importants",
        ],
        correctAnswer: 1,
        explanation:
          "Séparer les responsabilités rend l’application plus lisible, testable et maintenable.",
      },
    ],
  },

  "03": {
    lessonId: "final-03-data-security",
    title: "Données et sécurité",
    questions: [
      {
        type: "mcq",
        question:
          "Pourquoi une table `documents` doit-elle souvent contenir `user_id` ?",
        answers: [
          "Pour savoir à quel utilisateur appartient le document",
          "Pour stocker la clé API",
          "Pour remplacer l’ID du document",
          "Pour créer un embedding",
        ],
        correctAnswer: 0,
        explanation:
          "user_id permet de relier la ressource privée à son propriétaire.",
      },
      {
        type: "code",
        question:
          "Quelle policy correspond le mieux à une lecture des propres documents de l’utilisateur ?",
        code: `create policy "read own documents"
on documents
for select
to authenticated
using (
  ???
);`,
        answers: [
          "auth.uid() = user_id",
          "auth.uid() = id",
          "user_id = document_id",
          "true",
        ],
        correctAnswer: 0,
        explanation:
          "La policy compare l’utilisateur connecté au propriétaire de la ligne.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi le filtrage côté frontend ne suffit-il pas pour sécuriser les données ?",
        answers: [
          "Parce qu’un utilisateur peut contourner ou modifier les requêtes côté client",
          "Parce que React interdit les filtres",
          "Parce que Supabase ignore toujours les filtres",
          "Parce que le navigateur supprime les user_id",
        ],
        correctAnswer: 0,
        explanation:
          "La sécurité doit être appliquée côté serveur ou base, pas seulement dans l’interface.",
      },
      {
        type: "architecture",
        question:
          "Quelle relation est cohérente pour un chat documentaire ?",
        answers: [
          "Utilisateur → conversations → messages",
          "Messages → mot de passe → utilisateur",
          "Documents → CSS → messages",
          "API key → conversations → utilisateur",
        ],
        correctAnswer: 0,
        explanation:
          "Les conversations peuvent appartenir à un utilisateur et contenir plusieurs messages.",
      },
      {
        type: "mcq",
        question:
          "Que doit-il se passer si un utilisateur tente d’accéder à un document qui ne lui appartient pas ?",
        answers: [
          "L’accès doit être refusé",
          "Le document doit devenir public",
          "Le user_id doit être remplacé automatiquement",
          "Le frontend doit uniquement masquer le titre",
        ],
        correctAnswer: 0,
        explanation:
          "Une ressource privée doit être inaccessible aux utilisateurs non autorisés.",
      },
    ],
  },

  "04": {
    lessonId: "final-04-ai-features",
    title: "Fonctionnalités IA",
    questions: [
      {
        type: "mcq",
        question:
          "Quel outil utiliser pour calculer exactement une remise de 20 % sur un prix ?",
        answers: [
          "Un agent IA",
          "Un pipeline RAG",
          "Du code déterministe",
          "Un modèle d’embedding",
        ],
        correctAnswer: 2,
        explanation:
          "Un calcul déterministe ne nécessite pas de LLM.",
      },
      {
        type: "mcq",
        question:
          "Quel choix est le plus adapté pour résumer un texte déjà fourni par l’utilisateur ?",
        answers: [
          "Un LLM simple",
          "Une base vectorielle obligatoire",
          "Un agent multi-outils obligatoire",
          "Une policy RLS",
        ],
        correctAnswer: 0,
        explanation:
          "Si tout le contexte nécessaire est déjà fourni, un appel LLM simple peut suffire.",
      },
      {
        type: "mcq",
        question:
          "Quel choix est le plus adapté pour répondre à partir de 500 documents internes ?",
        answers: [
          "Un simple if",
          "RAG + LLM",
          "Uniquement une boucle JavaScript",
          "Uniquement un frontend React",
        ],
        correctAnswer: 1,
        explanation:
          "Le RAG permet de retrouver les passages pertinents avant la génération.",
      },
      {
        type: "architecture",
        question:
          "Un utilisateur demande : « Cherche les données, compare plusieurs résultats puis envoie une action si une condition est remplie. » Quelle architecture est la plus adaptée ?",
        answers: [
          "Agent avec outils contrôlés",
          "Uniquement CSS",
          "Uniquement embedding",
          "Uniquement stockage SQL",
        ],
        correctAnswer: 0,
        explanation:
          "Le besoin implique plusieurs décisions et actions, ce qui correspond davantage à une logique agentique.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi éviter de transformer chaque fonctionnalité en agent ?",
        answers: [
          "Parce qu’un agent ajoute de la complexité, du coût et des risques inutiles lorsque le problème est simple",
          "Parce qu’un agent ne peut jamais appeler d’API",
          "Parce que les agents ne fonctionnent pas avec un backend",
          "Parce que les agents sont uniquement destinés aux jeux vidéo",
        ],
        correctAnswer: 0,
        explanation:
          "Il faut choisir l’architecture la plus simple adaptée au besoin réel.",
      },
    ],
  },

  "05": {
    lessonId: "final-05-backend",
    title: "Backend et intégrations",
    questions: [
      {
        type: "architecture",
        question:
          "Quelle séquence est la plus saine pour une route de chat documentaire ?",
        answers: [
          "Auth → validation → retrieval → LLM → sauvegarde → réponse",
          "LLM → frontend → validation → auth",
          "Database → CSS → LLM",
          "Réponse → auth → question",
        ],
        correctAnswer: 0,
        explanation:
          "Le backend doit d’abord contrôler l’utilisateur et les données avant d’appeler les services externes.",
      },
      {
        type: "code",
        question:
          "Quel problème principal présente cette route ?",
        code: `export async function POST(request: Request) {
  const body = await request.json();

  const result =
    await expensiveAIService(body.prompt);

  return Response.json({
    result
  });
}`,
        answers: [
          "Elle n’effectue aucune validation ou vérification utilisateur avant l’appel coûteux",
          "Elle utilise une fonction async",
          "Elle retourne du JSON",
          "Elle possède un argument request",
        ],
        correctAnswer: 0,
        explanation:
          "Les entrées et les autorisations doivent être vérifiées avant d’exécuter des opérations sensibles ou coûteuses.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi gérer les erreurs d’un service externe ?",
        answers: [
          "Parce qu’une API externe peut échouer, expirer ou renvoyer une erreur",
          "Parce que toutes les API échouent toujours",
          "Parce que le frontend ne supporte jamais les réponses JSON",
          "Parce que les erreurs doivent être cachées au serveur",
        ],
        correctAnswer: 0,
        explanation:
          "Une dépendance externe peut être indisponible et l’application doit gérer proprement ce cas.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi séparer une logique complexe dans un service dédié ?",
        answers: [
          "Pour améliorer la lisibilité, la réutilisation et les tests",
          "Pour augmenter volontairement le nombre de fichiers",
          "Pour exposer les secrets",
          "Pour supprimer les routes API",
        ],
        correctAnswer: 0,
        explanation:
          "Une architecture modulaire facilite la maintenance.",
      },
      {
        type: "code",
        question:
          "Que manque-t-il souvent avant d’utiliser directement `body.prompt` ?",
        code: `const body =
  await request.json();

const prompt =
  body.prompt;`,
        answers: [
          "Une validation du type, de la présence et éventuellement de la taille du prompt",
          "Une deuxième base de données",
          "Une animation",
          "Un agent IA obligatoire",
        ],
        correctAnswer: 0,
        explanation:
          "Les données reçues du client ne doivent pas être considérées comme valides automatiquement.",
      },
    ],
  },

  "06": {
    lessonId: "final-06-production",
    title: "Préparer la production",
    questions: [
      {
        type: "mcq",
        question:
          "Où doit rester une clé API privée de production ?",
        answers: [
          "Dans une variable d’environnement serveur",
          "Dans le composant React",
          "Dans le HTML",
          "Dans l’URL publique",
        ],
        correctAnswer: 0,
        explanation:
          "Les secrets privés doivent rester côté serveur.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi limiter la taille des fichiers uploadés ?",
        answers: [
          "Pour réduire les abus, les coûts et les problèmes de ressources",
          "Parce qu’un fichier ne peut jamais dépasser 1 Ko",
          "Pour supprimer RLS",
          "Pour empêcher toute utilisation du produit",
        ],
        correctAnswer: 0,
        explanation:
          "Les uploads sans limite peuvent entraîner des abus et des coûts importants.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi limiter le nombre d’étapes d’un agent ?",
        answers: [
          "Pour éviter les boucles infinies et contrôler coûts et actions",
          "Pour rendre le modèle moins intelligent",
          "Pour désactiver le backend",
          "Pour supprimer les outils",
        ],
        correctAnswer: 0,
        explanation:
          "Une limite d’étapes protège contre les boucles non maîtrisées.",
      },
      {
        type: "architecture",
        question:
          "Quel ensemble correspond le mieux à une préparation production sérieuse ?",
        answers: [
          "Secrets + validation + logs + limites + gestion d’erreurs + tests",
          "CSS + emojis + animation uniquement",
          "Uniquement un modèle IA",
          "Uniquement une base de données",
        ],
        correctAnswer: 0,
        explanation:
          "La production implique plusieurs protections et mécanismes de contrôle.",
      },
      {
        type: "mcq",
        question:
          "Pourquoi surveiller les coûts des appels IA ?",
        answers: [
          "Parce que chaque appel peut avoir un coût et qu’un usage non contrôlé peut devenir cher",
          "Parce que les appels IA sont toujours gratuits",
          "Parce qu’un LLM ne peut fonctionner qu’une fois",
          "Parce que Supabase facture obligatoirement chaque caractère",
        ],
        correctAnswer: 0,
        explanation:
          "Les produits IA doivent suivre les volumes d’usage et imposer des limites adaptées.",
      },
      {
        type: "mcq",
        question:
          "Un projet est-il prêt pour la production simplement parce qu’il fonctionne sur votre Mac ?",
        answers: [
          "Oui",
          "Non, il faut aussi préparer sécurité, configuration, erreurs, tests et déploiement",
          "Oui, si le frontend est joli",
          "Oui, si aucun utilisateur ne l’a testé",
        ],
        correctAnswer: 1,
        explanation:
          "Le fonctionnement local est seulement une étape avant une mise en production fiable.",
      },
    ],
  },
};

export default function FinalExercisePage() {
  const params =
    useParams<{ lesson: string }>();

  const router = useRouter();
  const supabase = createClient();

  const lessonSlug =
    params.lesson;

  const exercise =
    exercises[lessonSlug];

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<number | null>(null);

  const [
    validated,
    setValidated,
  ] = useState(false);

  const [score, setScore] =
    useState(0);

  const [
    finished,
    setFinished,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState("");

  if (!exercise) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold">
            Exercice introuvable
          </h1>

          <p className="mt-3 text-slate-500">
            La leçon 07 utilise le projet final séparé.
          </p>

          <Link
            href="/formation/projet-final"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>

      </main>
    );
  }

  const question =
    exercise.questions[
      currentQuestion
    ];

  const isCorrect =
    selectedAnswer ===
    question.correctAnswer;

  function validateAnswer() {
    if (
      selectedAnswer === null ||
      validated
    ) {
      return;
    }

    if (
      selectedAnswer ===
      question.correctAnswer
    ) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );
    }

    setValidated(true);
  }

  async function nextQuestion() {
    if (
      currentQuestion <
      exercise.questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer(null);
      setValidated(false);
      setSaveError("");

      return;
    }

    const finalScore =
      Math.round(
        (score /
          exercise.questions.length) *
          100
      );

    if (finalScore >= 70) {
      setSaving(true);
      setSaveError("");

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        setSaving(false);

        setSaveError(
          "Vous devez être connecté pour enregistrer votre progression."
        );

        return;
      }

      const now =
        new Date().toISOString();

      const { error } =
        await supabase
          .from("lesson_progress")
          .upsert(
            {
              user_id:
                user.id,
              lesson_id:
                exercise.lessonId,
              completed:
                true,
              score:
                finalScore,
              completed_at:
                now,
              last_viewed_at:
                now,
            },
            {
              onConflict:
                "user_id,lesson_id",
            }
          );

      setSaving(false);

      if (error) {
        console.error(
          "Erreur progression :",
          error
        );

        setSaveError(
          "Impossible d'enregistrer votre progression."
        );

        return;
      }
    }

    setFinished(true);
  }

  function restartExercise() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setValidated(false);
    setScore(0);
    setFinished(false);
    setSaveError("");
  }

  const finalScore =
    Math.round(
      (score /
        exercise.questions.length) *
        100
    );

  // ======================================================
  // RÉSULTAT
  // ======================================================

  if (finished) {
    const passed =
      finalScore >= 70;

    const lessonNumber =
      Number(lessonSlug);

    const nextLesson =
      lessonNumber < 6
        ? String(
            lessonNumber + 1
          ).padStart(
            2,
            "0"
          )
        : "07";

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-10">

        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl">

          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
              passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {passed ? "✓" : "↻"}
          </div>

          <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-slate-400">
            PROJET FINAL · VALIDATION
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {passed
              ? "Étape validée !"
              : "À retravailler"}
          </h1>

          <p className="mt-3 text-slate-500">
            {exercise.title}
          </p>

          <p className="mt-6 text-6xl font-bold">
            {finalScore}%
          </p>

          <p className="mt-4 text-slate-500">
            {score} /{" "}
            {exercise.questions.length} bonnes réponses
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm leading-6 text-emerald-900">
              Cette étape du projet est validée. Vous pouvez continuer vers la prochaine décision d’architecture.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Vous devez obtenir au moins 70 %. Relisez les choix d’architecture avant de recommencer.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={
                  restartExercise
                }
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                Recommencer
              </button>
            )}

            {passed && (
              <button
                onClick={() =>
                  router.push(
                    `/formation/projet-final/${nextLesson}`
                  )
                }
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                {lessonSlug === "06"
                  ? "Passer au gros projet final →"
                  : "Étape suivante →"}
              </button>
            )}

          </div>

        </section>

      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) /
      exercise.questions.length) *
    100;

  // ======================================================
  // QUESTION
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/projet-final/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question{" "}
            {currentQuestion + 1}{" "}
            /{" "}
            {exercise.questions.length}
          </span>

        </div>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            PROJET FINAL · LEÇON {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {exercise.title}
          </h1>

          <div className="mt-5">

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {question.type ===
              "code"
                ? "Audit de code"
                : question.type ===
                  "architecture"
                ? "Décision d’architecture"
                : "Décision produit"}
            </span>

          </div>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

          {question.code && (
            <div className="mt-7 overflow-hidden rounded-2xl bg-slate-950">

              <div className="border-b border-slate-800 px-5 py-3">

                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  CODE À ANALYSER
                </p>

              </div>

              <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
                <code>
                  {question.code}
                </code>
              </pre>

            </div>
          )}

          <div className="mt-8 space-y-4">

            {question.answers.map(
              (
                answer,
                index
              ) => {
                const selected =
                  selectedAnswer ===
                  index;

                const correct =
                  validated &&
                  index ===
                    question.correctAnswer;

                const wrong =
                  validated &&
                  selected &&
                  index !==
                    question.correctAnswer;

                return (
                  <button
                    key={`${answer}-${index}`}
                    disabled={validated}
                    onClick={() =>
                      setSelectedAnswer(
                        index
                      )
                    }
                    className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                      correct
                        ? "border-emerald-400 bg-emerald-50"
                        : wrong
                        ? "border-red-400 bg-red-50"
                        : selected
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        correct
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : wrong
                          ? "border-red-500 bg-red-500 text-white"
                          : selected
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </div>

                    <span className="text-sm leading-6">
                      {answer}
                    </span>

                  </button>
                );
              }
            )}

          </div>

          {validated && (
            <div
              className={`mt-8 rounded-2xl p-5 ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-red-50 text-red-900"
              }`}
            >

              <p className="font-bold">
                {isCorrect
                  ? "✓ Bonne décision"
                  : "✕ Mauvaise décision"}
              </p>

              <p className="mt-2 text-sm leading-6">
                {question.explanation}
              </p>

            </div>
          )}

          {saveError && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {saveError}
            </div>
          )}

          <div className="mt-8 flex justify-end">

            {!validated ? (
              <button
                onClick={
                  validateAnswer
                }
                disabled={
                  selectedAnswer === null
                }
                className={`rounded-2xl px-7 py-4 font-semibold transition ${
                  selectedAnswer === null
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "bg-slate-950 text-white hover:scale-[1.02]"
                }`}
              >
                Valider mon choix
              </button>
            ) : (
              <button
                onClick={
                  nextQuestion
                }
                disabled={
                  saving
                }
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    exercise.questions.length -
                      1
                  ? "Voir mon résultat →"
                  : "Question suivante →"}
              </button>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}