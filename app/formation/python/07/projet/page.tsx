"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const correctBlocks = [
  `prospects = [
    {"nom": "Lucas", "budget": 5000},
    {"nom": "Sarah", "budget": 1500},
    {"nom": "Amine", "budget": 3200}
]`,
  `def qualifier(prospect):`,
  `    if prospect["budget"] >= 3000:`,
  `        return "Prioritaire"`,
  `    return "Standard"`,
  `for prospect in prospects:`,
  `    resultat = qualifier(prospect)`,
  `    print(prospect["nom"], resultat)`,
];

const availableBlocks = [
  `    resultat = qualifier(prospect)`,
  `    if prospect["budget"] >= 3000:`,
  `def qualifier(prospect):`,
  `    print(prospect["nom"], resultat)`,
  `    return "Standard"`,
  `prospects = [
    {"nom": "Lucas", "budget": 5000},
    {"nom": "Sarah", "budget": 1500},
    {"nom": "Amine", "budget": 3200}
]`,
  `for prospect in prospects:`,
  `        return "Prioritaire"`,
];

export default function PythonProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);
  const [passed, setPassed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function addBlock(block: string) {
    if (
      validated ||
      selectedBlocks.includes(block)
    ) {
      return;
    }

    setSelectedBlocks((previous) => [
      ...previous,
      block,
    ]);
  }

  function removeBlock(block: string) {
    if (validated) {
      return;
    }

    setSelectedBlocks((previous) =>
      previous.filter(
        (item) => item !== block
      )
    );
  }

  function resetProject() {
    setSelectedBlocks([]);
    setValidated(false);
    setPassed(false);
    setErrorMessage("");
  }

  async function validateProject() {
    if (
      selectedBlocks.length !==
      correctBlocks.length
    ) {
      setErrorMessage(
        "Ajoutez toutes les lignes nécessaires avant de valider."
      );

      return;
    }

    setErrorMessage("");

    const isCorrect = selectedBlocks.every(
      (block, index) =>
        block === correctBlocks[index]
    );

    setValidated(true);

    if (!isCorrect) {
      setPassed(false);
      return;
    }

    setPassed(true);
    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);

      setErrorMessage(
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
          lesson_id: "python-07-project",
          completed: true,
          score: 100,
          completed_at: now,
          last_viewed_at: now,
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

    setSaving(false);

    if (error) {
      console.error(
        "Erreur Supabase :",
        error
      );

      setPassed(false);

      setErrorMessage(
        "Le programme est correct, mais la progression n'a pas pu être enregistrée."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/python/07"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet Python
          </span>

        </div>

        {/* HEADER */}

        <div className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 06 · PROJET FINAL
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Qualifier automatiquement des prospects
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            Reconstituez le programme Python dans le bon ordre.
            Vous devez utiliser les données, une fonction, une
            condition et une boucle pour traiter plusieurs prospects.
          </p>

        </div>

        {/* MISSION */}

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Créer une logique de qualification
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Chaque prospect possède un nom et un budget. Si son budget
            est supérieur ou égal à 3000, le programme doit le classer
            comme « Prioritaire ». Sinon, il doit être classé comme
            « Standard ».
          </p>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
              RÉSULTAT ATTENDU
            </p>

            <pre className="mt-4 overflow-x-auto text-sm leading-7 text-slate-300">
              <code>{`Lucas Prioritaire
Sarah Standard
Amine Prioritaire`}</code>
            </pre>

          </div>

        </section>

        {/* RÉSUMÉ DES NOTIONS */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <ConceptCard
            title="Liste"
            description="Contient plusieurs prospects."
          />

          <ConceptCard
            title="Dictionnaire"
            description="Contient le nom et le budget."
          />

          <ConceptCard
            title="Fonction"
            description="Détermine la catégorie."
          />

          <ConceptCard
            title="Boucle"
            description="Traite tous les prospects."
          />

        </section>

        {/* CONSTRUCTION */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* BLOCS DISPONIBLES */}

          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              BLOCS DISPONIBLES
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Construisez le programme
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cliquez sur les blocs dans l&apos;ordre dans lequel
              Python doit les exécuter.
            </p>

            <div className="mt-6 space-y-3">

              {availableBlocks.map(
                (block, index) => {
                  const alreadySelected =
                    selectedBlocks.includes(
                      block
                    );

                  return (
                    <button
                      key={`${block}-${index}`}
                      onClick={() =>
                        addBlock(block)
                      }
                      disabled={
                        alreadySelected ||
                        validated
                      }
                      className={`w-full overflow-x-auto rounded-2xl border p-4 text-left transition ${
                        alreadySelected
                          ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                          : "border-slate-200 hover:border-slate-950 hover:bg-slate-50"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap text-sm">
                        <code>
                          {block}
                        </code>
                      </pre>
                    </button>
                  );
                }
              )}

            </div>

          </section>

          {/* PROGRAMME UTILISATEUR */}

          <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-7">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                VOTRE PROGRAMME
              </p>

              <h2 className="mt-3 text-xl font-bold">
                main.py
              </h2>

            </div>

            <div className="min-h-[500px] bg-slate-950 p-6">

              {selectedBlocks.length === 0 ? (
                <p className="text-sm text-slate-500">
                  # Ajoutez vos premières lignes...
                </p>
              ) : (
                <div className="space-y-2">

                  {selectedBlocks.map(
                    (block, index) => (
                      <div
                        key={`${block}-${index}`}
                        className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"
                      >

                        <span className="mt-1 w-6 shrink-0 text-right font-mono text-xs text-slate-600">
                          {index + 1}
                        </span>

                        <pre className="flex-1 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-300">
                          <code>
                            {block}
                          </code>
                        </pre>

                        {!validated && (
                          <button
                            onClick={() =>
                              removeBlock(
                                block
                              )
                            }
                            className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-800 hover:text-white"
                          >
                            ✕
                          </button>
                        )}

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </section>

        </div>

        {/* FEEDBACK */}

        {validated && (
          <section
            className={`mt-6 rounded-[26px] p-7 ${
              passed
                ? "bg-emerald-50 text-emerald-900"
                : "bg-red-50 text-red-900"
            }`}
          >

            <h2 className="text-xl font-bold">
              {passed
                ? "✓ Programme correct"
                : "✕ Le programme n'est pas encore dans le bon ordre"}
            </h2>

            {passed ? (
              <p className="mt-3 leading-7">
                Bravo. Vous avez correctement utilisé une liste de
                dictionnaires, une fonction, une condition et une
                boucle pour automatiser le traitement des prospects.
              </p>
            ) : (
              <div className="mt-3 space-y-2 leading-7">

                <p>
                  Vérifiez l&apos;ordre logique du programme.
                </p>

                <p>
                  Commencez par créer les données, puis définissez la
                  fonction avant de l&apos;utiliser dans la boucle.
                </p>

              </div>
            )}

          </section>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-8 flex flex-wrap gap-3">

          {!validated && (
            <button
              onClick={
                validateProject
              }
              disabled={
                selectedBlocks.length !==
                  correctBlocks.length ||
                saving
              }
              className={`rounded-2xl px-7 py-4 font-semibold transition ${
                selectedBlocks.length !==
                  correctBlocks.length ||
                saving
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-slate-950 text-white hover:scale-[1.02]"
              }`}
            >
              {saving
                ? "Enregistrement..."
                : "Exécuter mon programme"}
            </button>
          )}

          {validated &&
            !passed && (
              <button
                onClick={resetProject}
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white"
              >
                Recommencer
              </button>
            )}

          {validated &&
            passed && (
              <button
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white"
              >
                Terminer Python →
              </button>
            )}

        </div>

        {/* EXPLICATION DU PROGRAMME */}

        <section className="mt-10 rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            CE QUE VOUS SAVEZ MAINTENANT FAIRE
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Vous avez construit une vraie logique de programme
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Le programme reste volontairement simple, mais sa structure
            est fondamentale. Dans le prochain module, les prospects
            ne seront plus écrits directement dans votre code :
            ils pourront venir d&apos;une API.
          </p>

          <div className="mt-7 overflow-hidden rounded-2xl bg-slate-950">

            <div className="border-b border-slate-800 px-5 py-3">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                PROCHAINE ÉTAPE
              </p>
            </div>

            <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
              <code>{`import requests

response = requests.get(
    "https://api.exemple.com/prospects"
)

prospects = response.json()

for prospect in prospects:
    resultat = qualifier(prospect)

    print(
        prospect["nom"],
        resultat
    )`}</code>
            </pre>

          </div>

          <p className="mt-5 leading-7 text-slate-500">
            Tu reconnais déjà presque tout : variable, dictionnaire,
            boucle, fonction et JSON. Les seules nouvelles notions seront
            principalement <strong>requests</strong>, <strong>HTTP</strong> et
            le fonctionnement d&apos;une <strong>API</strong>.
          </p>

        </section>

      </div>

    </main>
  );
}

function ConceptCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        PY
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}