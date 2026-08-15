"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Question = {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

type Quiz = {
  lessonId: string;
  title: string;
  questions: Question[];
};

const quizzes: Record<string, Quiz> = {
  "01": {
    lessonId: "prompts-01-structure",
    title: "La structure d’un bon prompt",
    questions: [
      {
        question:
          "Quels éléments rendent généralement un prompt plus précis ?",
        answers: [
          "Objectif, contexte, contraintes et format",
          "Uniquement beaucoup de mots",
          "Un texte très compliqué",
          "Des majuscules partout",
        ],
        correctAnswer: 0,
        explanation:
          "Un prompt efficace précise généralement l’objectif, le contexte, les contraintes et le format attendu.",
      },
      {
        question:
          "Quel élément indique ce que l’utilisateur cherche réellement à obtenir ?",
        answers: [
          "Le contexte",
          "L’objectif",
          "La ponctuation",
          "La longueur du prompt",
        ],
        correctAnswer: 1,
        explanation:
          "L’objectif décrit clairement le résultat recherché.",
      },
      {
        question:
          "Pourquoi préciser des contraintes dans un prompt ?",
        answers: [
          "Pour guider la réponse selon certaines limites ou règles",
          "Pour empêcher ChatGPT de répondre",
          "Pour rendre systématiquement la réponse plus longue",
          "Pour modifier le modèle utilisé",
        ],
        correctAnswer: 0,
        explanation:
          "Les contraintes servent à préciser les règles à respecter : longueur, ton, niveau, format, etc.",
      },
    ],
  },

  "02": {
    lessonId: "prompts-02-role",
    title: "Attribuer un rôle à l’IA",
    questions: [
      {
        question:
          "Pourquoi peut-on attribuer un rôle à l’IA dans un prompt ?",
        answers: [
          "Pour orienter la manière dont elle répond",
          "Pour changer son mot de passe",
          "Pour lui donner accès à Internet automatiquement",
          "Pour garantir qu’elle ne se trompera jamais",
        ],
        correctAnswer: 0,
        explanation:
          "Attribuer un rôle permet d’orienter le ton, le niveau de détail ou la perspective de la réponse.",
      },
      {
        question:
          "Quel exemple utilise correctement un rôle ?",
        answers: [
          "Agis comme un professeur de Python et explique les fonctions à un débutant.",
          "Écris quelque chose.",
          "Réponds vite.",
          "Fais mieux.",
        ],
        correctAnswer: 0,
        explanation:
          "Le premier exemple définit clairement un rôle et un objectif.",
      },
      {
        question:
          "Un rôle doit-il forcément correspondre à une vraie profession ?",
        answers: [
          "Oui, obligatoirement",
          "Non, il peut simplement définir une manière de répondre",
          "Oui, sinon ChatGPT refuse",
          "Seulement avec un abonnement payant",
        ],
        correctAnswer: 1,
        explanation:
          "Un rôle peut être professionnel, pédagogique ou simplement décrire le comportement attendu.",
      },
    ],
  },

  "03": {
    lessonId: "prompts-03-templates",
    title: "Créer des prompts réutilisables",
    questions: [
      {
        question:
          "Quel est l’intérêt principal d’un template de prompt ?",
        answers: [
          "Pouvoir réutiliser une structure efficace",
          "Éviter complètement de réfléchir",
          "Obtenir toujours exactement la même réponse",
          "Supprimer les limites de ChatGPT",
        ],
        correctAnswer: 0,
        explanation:
          "Un template permet de conserver une bonne structure tout en remplaçant certaines informations selon le besoin.",
      },
      {
        question:
          "Quel exemple ressemble le plus à un template réutilisable ?",
        answers: [
          "Résume ce texte.",
          "Analyse [DOCUMENT] et produis un résumé de [LONGUEUR] destiné à [PUBLIC].",
          "Bonjour.",
          "Fais quelque chose avec ça.",
        ],
        correctAnswer: 1,
        explanation:
          "Les champs variables permettent de réutiliser la même structure dans plusieurs situations.",
      },
      {
        question:
          "Dans un template, à quoi servent des éléments comme [SUJET] ou [PUBLIC] ?",
        answers: [
          "À représenter des informations variables",
          "À lancer automatiquement du code",
          "À créer un compte utilisateur",
          "À chiffrer le prompt",
        ],
        correctAnswer: 0,
        explanation:
          "Ces placeholders indiquent les parties du prompt à remplacer selon la situation.",
      },
    ],
  },

  "04": {
    lessonId: "prompts-04-iteration",
    title: "Améliorer une réponse",
    questions: [
      {
        question:
          "Que signifie itérer avec ChatGPT ?",
        answers: [
          "Améliorer progressivement la réponse avec de nouvelles instructions",
          "Créer un nouveau compte à chaque réponse",
          "Poser exactement la même question sans changement",
          "Supprimer automatiquement la conversation",
        ],
        correctAnswer: 0,
        explanation:
          "L’itération consiste à reprendre une réponse et à demander des modifications ou des améliorations.",
      },
      {
        question:
          "Quelle instruction est un bon exemple d’itération ?",
        answers: [
          "Réécris cette réponse en plus court et ajoute un exemple concret.",
          "Bonjour.",
          "Supprime tout.",
          "N’importe quoi.",
        ],
        correctAnswer: 0,
        explanation:
          "Cette instruction précise clairement comment améliorer la réponse existante.",
      },
      {
        question:
          "Pourquoi itérer plutôt que recommencer systématiquement une nouvelle conversation ?",
        answers: [
          "Parce que l’IA peut utiliser le contexte déjà présent dans la conversation",
          "Parce que cela augmente la vitesse d’Internet",
          "Parce que ChatGPT interdit les nouvelles conversations",
          "Parce que le prompt devient automatiquement privé",
        ],
        correctAnswer: 0,
        explanation:
          "Le contexte de la conversation permet souvent d’améliorer progressivement un résultat sans repartir de zéro.",
      },
    ],
  },

  "05": {
    lessonId: "prompts-05-project",
    title: "Projet pratique",
    questions: [
      {
        question:
          "Vous voulez que ChatGPT prépare un plan d’apprentissage personnalisé. Quelle approche est la meilleure ?",
        answers: [
          "Donner votre niveau, votre objectif, votre temps disponible et demander un format précis",
          "Écrire seulement : Apprends-moi quelque chose",
          "Donner uniquement votre prénom",
          "Demander une réponse sans contexte",
        ],
        correctAnswer: 0,
        explanation:
          "Un bon prompt de projet combine plusieurs informations utiles afin d’obtenir un résultat réellement personnalisé.",
      },
      {
        question:
          "Si la première réponse n’est pas assez détaillée, que devriez-vous faire ?",
        answers: [
          "Demander une amélioration précise",
          "Abandonner immédiatement",
          "Créer obligatoirement un nouveau compte",
          "Considérer que ChatGPT ne peut pas faire mieux",
        ],
        correctAnswer: 0,
        explanation:
          "L’itération est une compétence essentielle : précisez ce qui doit être amélioré.",
      },
      {
        question:
          "Quelle combinaison correspond le mieux aux méthodes vues dans ce module ?",
        answers: [
          "Objectif + contexte + rôle + contraintes + format + itération",
          "Prompt vague + aucune précision",
          "Uniquement un rôle",
          "Uniquement un format",
        ],
        correctAnswer: 0,
        explanation:
          "Le module vise justement à combiner plusieurs techniques de prompting dans une même démarche.",
      },
    ],
  },
};

export default function PromptExercisePage() {
  const params = useParams<{ lesson: string }>();
  const router = useRouter();
  const supabase = createClient();

  const lessonSlug = params.lesson;
  const quiz = quizzes[lessonSlug];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    null
  );
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold">
            Exercice introuvable
          </h1>

          <Link
            href="/formation/prompts"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
          >
            Retour au module
          </Link>

        </div>
      </main>
    );
  }

  const question = quiz.questions[currentQuestion];

  const isCorrect =
    selectedAnswer === question.correctAnswer;

  function validateAnswer() {
    if (selectedAnswer === null || validated) {
      return;
    }

    if (selectedAnswer === question.correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }

    setValidated(true);
  }

  async function nextQuestion() {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(
        (previousQuestion) => previousQuestion + 1
      );

      setSelectedAnswer(null);
      setValidated(false);
      setSaveError("");

      return;
    }

    const finalScore = Math.round(
      (score / quiz.questions.length) * 100
    );

    if (finalScore >= 70) {
      setSaving(true);
      setSaveError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSaving(false);

        setSaveError(
          "Vous devez être connecté pour enregistrer votre progression."
        );

        return;
      }

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: quiz.lessonId,
            completed: true,
            score: finalScore,
            completed_at: now,
            last_viewed_at: now,
          },
          {
            onConflict: "user_id,lesson_id",
          }
        );

      setSaving(false);

      if (error) {
        console.error("Erreur Supabase :", error);

        setSaveError(
          "Impossible d'enregistrer votre progression."
        );

        return;
      }
    }

    setFinished(true);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setValidated(false);
    setScore(0);
    setFinished(false);
    setSaveError("");
  }

  const finalScore = Math.round(
    (score / quiz.questions.length) * 100
  );

  if (finished) {
    const passed = finalScore >= 70;

    const lessonNumber = Number(lessonSlug);

    const nextLesson =
      lessonNumber < 5
        ? String(lessonNumber + 1).padStart(2, "0")
        : null;

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
            RÉSULTAT
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {passed
              ? "Leçon validée !"
              : "Encore un petit effort"}
          </h1>

          <p className="mt-3 text-slate-500">
            {quiz.title}
          </p>

          <p className="mt-6 text-6xl font-bold">
            {finalScore}%
          </p>

          <p className="mt-4 text-slate-500">
            {score} bonne{score > 1 ? "s" : ""} réponse
            {score > 1 ? "s" : ""} sur{" "}
            {quiz.questions.length}.
          </p>

          {passed ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm leading-6 text-emerald-900">
              Félicitations. Cette leçon est maintenant validée et
              votre progression a été enregistrée.
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-orange-50 p-5 text-left text-sm leading-6 text-orange-900">
              Vous devez obtenir au moins 70 % pour valider cette leçon.
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {!passed && (
              <button
                onClick={restartQuiz}
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50"
              >
                Recommencer
              </button>
            )}

            {passed && nextLesson && (
              <button
                onClick={() =>
                  router.push(
                    `/formation/prompts/${nextLesson}`
                  )
                }
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                Leçon suivante →
              </button>
            )}

            {passed && !nextLesson && (
              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
              >
                Terminer le module ✓
              </button>
            )}

          </div>

        </section>

      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) /
      quiz.questions.length) *
    100;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between">

          <Link
            href={`/formation/prompts/${lessonSlug}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Question {currentQuestion + 1} /{" "}
            {quiz.questions.length}
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
            MODULE 02 · LEÇON {lessonSlug}
          </p>

          <h1 className="mt-3 text-lg font-semibold text-slate-500">
            {quiz.title}
          </h1>

          <h2 className="mt-6 text-3xl font-bold leading-tight">
            {question.question}
          </h2>

          <div className="mt-8 space-y-4">

            {question.answers.map((answer, index) => {
              const selected =
                selectedAnswer === index;

              const correct =
                validated &&
                index === question.correctAnswer;

              const wrong =
                validated &&
                selected &&
                index !== question.correctAnswer;

              return (
                <button
                  key={answer}
                  disabled={validated}
                  onClick={() =>
                    setSelectedAnswer(index)
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
                    {String.fromCharCode(65 + index)}
                  </div>

                  <p className="leading-6">
                    {answer}
                  </p>

                </button>
              );
            })}

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
                  ? "✓ Bonne réponse"
                  : "✕ Réponse incorrecte"}
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
                onClick={validateAnswer}
                disabled={selectedAnswer === null}
                className={`rounded-2xl px-7 py-4 font-semibold transition ${
                  selectedAnswer === null
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "bg-slate-950 text-white hover:scale-[1.02]"
                }`}
              >
                Valider ma réponse
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={saving}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : currentQuestion ===
                    quiz.questions.length - 1
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