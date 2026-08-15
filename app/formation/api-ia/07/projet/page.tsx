"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const correctBlocks = [
  `import requests`,
  `response = requests.get(
    "https://api.exemple.com/appartements/71"
)`,
  `if response.status_code == 200:`,
  `    appartement = response.json()`,
  `    budget = 2000`,
  `    if appartement["prix"] <= budget:`,
  `        print("Appartement compatible")`,
  `    else:`,
  `        print("Appartement trop cher")`,
  `else:`,
  `    print("Erreur API")`,
];

const availableBlocks = [
  `    budget = 2000`,
  `        print("Appartement trop cher")`,
  `if response.status_code == 200:`,
  `    print("Erreur API")`,
  `import requests`,
  `    appartement = response.json()`,
  `else:`,
  `    else:`,
  `response = requests.get(
    "https://api.exemple.com/appartements/71"
)`,
  `        print("Appartement compatible")`,
  `    if appartement["prix"] <= budget:`,
];

export default function APIProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(
    []
  );

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
        "Ajoutez toutes les lignes du programme avant de valider."
      );

      return;
    }

    setErrorMessage("");

    const isCorrect =
      selectedBlocks.every(
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

      setPassed(false);

      setErrorMessage(
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
            user_id: user.id,
            lesson_id:
              "api-07-project",
            completed: true,
            score: 100,
            completed_at: now,
            last_viewed_at: now,
          },
          {
            onConflict:
              "user_id,lesson_id",
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

      return;
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/api-ia/07"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet API
          </span>

        </div>

        {/* HEADER */}

        <div className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 07 · PROJET FINAL
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Construisez un programme connecté à une API
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            Reconstituez le programme dans le bon ordre.
            Il doit appeler une API, vérifier que la requête
            a réussi, récupérer les données JSON puis déterminer
            si l&apos;appartement correspond au budget.
          </p>

        </div>

        {/* MISSION */}

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Trouver automatiquement un appartement compatible
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Votre programme récupère l&apos;appartement numéro 71
            depuis une API. Si la requête réussit, il transforme la
            réponse JSON en données Python puis compare le prix au
            budget de 2000 €.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">

            <FlowStep text="Python" />

            <Arrow />

            <FlowStep text="GET API" />

            <Arrow />

            <FlowStep text="Status code" />

            <Arrow />

            <FlowStep text="JSON" />

            <Arrow />

            <FlowStep text="Condition" />

            <Arrow />

            <FlowStep text="Résultat" />

          </div>

        </section>

        {/* OBJECTIFS */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <ConceptCard
            title="GET"
            description="Demander une ressource à l’API."
          />

          <ConceptCard
            title="Status code"
            description="Vérifier si la requête a réussi."
          />

          <ConceptCard
            title="JSON"
            description="Transformer la réponse en données Python."
          />

          <ConceptCard
            title="Logique"
            description="Utiliser les données pour prendre une décision."
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
              Cliquez sur les lignes dans l&apos;ordre dans
              lequel Python doit les exécuter.
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

                      <pre className="whitespace-pre-wrap text-sm leading-6">
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

          {/* PROGRAMME */}

          <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-7">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                VOTRE PROGRAMME
              </p>

              <h2 className="mt-3 text-xl font-bold">
                api_appartement.py
              </h2>

            </div>

            <div className="min-h-[650px] bg-slate-950 p-6">

              {selectedBlocks.length === 0 ? (
                <p className="font-mono text-sm text-slate-500">
                  # Commencez à construire votre programme...
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
                : "✕ L'ordre du programme n'est pas encore correct"}
            </h2>

            {passed ? (
              <div className="mt-3 space-y-3 leading-7">

                <p>
                  Bravo. Vous avez correctement relié Python,
                  HTTP, une API, un status code, JSON et une
                  condition métier.
                </p>

                <p>
                  C&apos;est exactement la logique que l&apos;on
                  retrouvera ensuite dans des applications plus
                  avancées.
                </p>

              </div>
            ) : (
              <div className="mt-3 space-y-2 leading-7">

                <p>
                  Vérifiez le déroulement logique de votre programme.
                </p>

                <p>
                  Vous devez d&apos;abord importer la bibliothèque,
                  effectuer la requête puis vérifier son résultat
                  avant d&apos;essayer de lire le JSON.
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
                onClick={
                  resetProject
                }
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
                Terminer le module →
              </button>
            )}

        </div>

        {/* EXPLICATION */}

        <section className="mt-10 rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            CE QUE VOUS VENEZ DE CONSTRUIRE
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Votre premier flux complet client → API → données → logique
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Même si nous utilisons encore une API d&apos;exemple,
            l&apos;architecture est celle d&apos;une véritable
            application connectée à un service externe.
          </p>

          <div className="mt-7 rounded-2xl bg-slate-50 p-6">

            <div className="flex flex-wrap items-center gap-3 text-sm">

              <LightStep text="Votre programme" />

              <ArrowDark />

              <LightStep text="GET" />

              <ArrowDark />

              <LightStep text="Serveur externe" />

              <ArrowDark />

              <LightStep text="JSON" />

              <ArrowDark />

              <LightStep text="Décision" />

            </div>

          </div>

        </section>

        {/* API IA */}

        <section className="mt-6 overflow-hidden rounded-[26px] bg-slate-950 text-white shadow-xl">

          <div className="p-8">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              ET AVEC UNE IA ?
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              La logique est presque identique
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              Au lieu de demander un appartement à une API,
              votre application pourra envoyer des données à une
              API d&apos;IA puis exploiter la réponse générée.
            </p>

          </div>

          <div className="border-t border-slate-800 bg-slate-900 p-6">

            <pre className="overflow-x-auto text-sm leading-7 text-slate-300">
              <code>{`Utilisateur
    ↓
Votre SaaS
    ↓
Backend
    ↓
API IA
    ↓
Réponse JSON
    ↓
Votre logique
    ↓
Résultat utilisateur`}</code>
            </pre>

          </div>

        </section>

        {/* PROCHAINE ÉTAPE */}

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MODULE SUIVANT
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Module 08 — Bases de données & Supabase
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Vous savez maintenant obtenir des données depuis
            l&apos;extérieur. Il faut apprendre à les conserver.
            Dans le prochain module, vous travaillerez avec des
            tables, des utilisateurs, le CRUD, l&apos;authentification
            et la sécurité RLS.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">

            <Badge text="Tables" />

            <Badge text="CRUD" />

            <Badge text="Auth" />

            <Badge text="RLS" />

            <Badge text="Supabase" />

          </div>

        </section>

      </div>

    </main>
  );
}

// ======================================================
// COMPONENTS
// ======================================================

function ConceptCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        API
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

function FlowStep({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-950">
      {text}
    </div>
  );
}

function LightStep({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm">
      {text}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}

function ArrowDark() {
  return (
    <span className="text-slate-400">
      →
    </span>
  );
}

function Badge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
      {text}
    </span>
  );
}