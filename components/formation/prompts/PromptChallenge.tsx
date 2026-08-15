"use client";

import { useState } from "react";

const answers = [
  {
    id: "a",
    label:
      "Lui proposer immédiatement un système qui génère automatiquement ses publications.",
    correct: false,
    feedback:
      "Vous allez trop vite. Vous avez identifié une piste possible, mais vous ne savez pas encore exactement comment la boutique fonctionne ni ce qu’elle attend du résultat.",
  },
  {
    id: "b",
    label:
      "Lui demander son budget pour savoir quelle solution lui vendre.",
    correct: false,
    feedback:
      "Le budget sera important plus tard. Mais avant de parler de prix ou de technologie, il faut comprendre suffisamment bien le problème.",
  },
  {
    id: "c",
    label:
      "Comprendre comment elle prépare actuellement ses publications, quelles informations elle possède et ce qu’elle cherche réellement à obtenir.",
    correct: true,
    feedback:
      "C’est le bon réflexe. Le client vous décrit un problème. Votre première mission est de comprendre son fonctionnement actuel, les informations disponibles et le résultat recherché.",
  },
  {
    id: "d",
    label:
      "Lui préparer directement plusieurs publications pour lui montrer ce que l’IA peut produire.",
    correct: false,
    feedback:
      "Une démonstration peut être utile plus tard. Mais sans connaître la cible, l’objectif et le positionnement de la boutique, vous risquez de produire quelque chose de joli mais peu utile.",
  },
];

export default function PromptChallenge() {
  const [selected, setSelected] =
    useState<string | null>(null);

  const [validated, setValidated] =
    useState(false);

  const selectedAnswer =
    answers.find(
      (answer) =>
        answer.id === selected
    );

  function handleValidate() {
    if (!selected) {
      return;
    }

    setValidated(true);
  }

  function handleChangeAnswer(
    id: string
  ) {
    setSelected(id);
    setValidated(false);
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-slate-100 px-6 py-5 md:px-8">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              01
            </div>

            <div>

              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                MISSION CLIENT
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Comprendre avant de construire
              </p>

            </div>

          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            Situation réelle
          </span>

        </div>

      </div>

      {/* CLIENT */}

      <div className="bg-slate-50 px-6 py-7 md:px-8">

        <p className="text-sm font-semibold text-slate-900">
          Vous échangez avec la responsable d’une boutique de sneakers.
        </p>

        <div className="mt-5 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg">
              👤
            </div>

            <div>

              <p className="text-sm font-bold">
                Responsable de boutique
              </p>

              <p className="text-xs text-slate-400">
                Premier échange
              </p>

            </div>

          </div>

          <p className="mt-5 leading-7 text-slate-600">
            « On reçoit de nouvelles paires presque chaque semaine et on
            publie sur Instagram pour les annoncer. Le problème, c’est que
            je passe beaucoup de temps à trouver quoi écrire et nos
            publications ne sont pas toujours cohérentes. J’aimerais que
            ce soit beaucoup plus rapide. »
          </p>

        </div>

      </div>

      {/* QUESTION */}

      <div className="px-6 py-7 md:px-8">

        <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
          VOTRE DÉCISION
        </p>

        <h3 className="mt-3 max-w-3xl text-2xl font-bold leading-8">
          Quelle est la meilleure chose à faire avant de lui proposer une
          solution ?
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Choisissez la réaction que vous adopteriez face à ce client.
        </p>

        <div className="mt-7 space-y-3">

          {answers.map(
            (answer) => {
              const isSelected =
                selected ===
                answer.id;

              const showCorrect =
                validated &&
                answer.correct;

              const showWrong =
                validated &&
                isSelected &&
                !answer.correct;

              return (
                <button
                  key={
                    answer.id
                  }
                  type="button"
                  onClick={() =>
                    handleChangeAnswer(
                      answer.id
                    )
                  }
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    showCorrect
                      ? "border-emerald-300 bg-emerald-50"
                      : showWrong
                      ? "border-red-300 bg-red-50"
                      : isSelected
                      ? "border-slate-950 bg-slate-50"
                      : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      showCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : showWrong
                        ? "border-red-500 bg-red-500 text-white"
                        : isSelected
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-300 bg-white text-slate-500"
                    }`}
                  >
                    {showCorrect
                      ? "✓"
                      : showWrong
                      ? "×"
                      : answer.id.toUpperCase()}
                  </div>

                  <p className="pt-1 text-sm font-medium leading-6 text-slate-700">
                    {
                      answer.label
                    }
                  </p>

                </button>
              );
            }
          )}

        </div>

        {!validated && (
          <button
            type="button"
            onClick={
              handleValidate
            }
            disabled={
              !selected
            }
            className="mt-6 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Valider ma décision
          </button>
        )}

        {validated &&
          selectedAnswer && (
            <div
              className={`mt-6 rounded-2xl border p-6 ${
                selectedAnswer.correct
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >

              <p
                className={`font-bold ${
                  selectedAnswer.correct
                    ? "text-emerald-800"
                    : "text-red-800"
                }`}
              >
                {selectedAnswer.correct
                  ? "✓ Bon réflexe"
                  : "Pas encore"}
              </p>

              <p
                className={`mt-2 text-sm leading-6 ${
                  selectedAnswer.correct
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {
                  selectedAnswer.feedback
                }
              </p>

              {selectedAnswer.correct && (
                <div className="mt-5 rounded-xl bg-white/70 p-4">

                  <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                    RÉFLEXE PROFESSIONNEL
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                    Le client vous donne un problème. Votre rôle est de
                    comprendre ce problème avant de choisir comment l’IA
                    peut l’aider.
                  </p>

                </div>
              )}

              {!selectedAnswer.correct && (
                <button
                  type="button"
                  onClick={() =>
                    setValidated(
                      false
                    )
                  }
                  className="mt-5 text-sm font-semibold text-slate-700 underline underline-offset-4"
                >
                  Modifier ma réponse
                </button>
              )}

            </div>
          )}

      </div>

    </section>
  );
}