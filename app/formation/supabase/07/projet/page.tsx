"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ArchitectureChoice = {
  id: string;
  label: string;
  description: string;
};

const correctArchitecture = [
  "auth.users",
  "projects",
  "messages",
];

const architectureChoices: ArchitectureChoice[] = [
  {
    id: "messages",
    label: "messages",
    description:
      "Contient les messages liés à un projet.",
  },
  {
    id: "auth.users",
    label: "auth.users",
    description:
      "Contient les utilisateurs authentifiés.",
  },
  {
    id: "projects",
    label: "projects",
    description:
      "Contient les projets appartenant aux utilisateurs.",
  },
];

const rlsAnswers = [
  {
    text: `auth.uid() = id`,
    correct: false,
  },
  {
    text: `auth.uid() = user_id`,
    correct: true,
  },
  {
    text: `project_id = user_id`,
    correct: false,
  },
  {
    text: `auth.uid() = project_id`,
    correct: false,
  },
];

export default function SupabaseProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedArchitecture, setSelectedArchitecture] =
    useState<string[]>([]);

  const [selectedRLS, setSelectedRLS] =
    useState<number | null>(null);

  const [validated, setValidated] =
    useState(false);

  const [passed, setPassed] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  function addArchitectureBlock(id: string) {
    if (
      validated ||
      selectedArchitecture.includes(id)
    ) {
      return;
    }

    setSelectedArchitecture((previous) => [
      ...previous,
      id,
    ]);
  }

  function removeArchitectureBlock(
    id: string
  ) {
    if (validated) {
      return;
    }

    setSelectedArchitecture((previous) =>
      previous.filter(
        (item) => item !== id
      )
    );
  }

  function resetProject() {
    setSelectedArchitecture([]);
    setSelectedRLS(null);
    setValidated(false);
    setPassed(false);
    setErrorMessage("");
  }

  async function validateProject() {
    if (
      selectedArchitecture.length !==
      correctArchitecture.length
    ) {
      setErrorMessage(
        "Construisez d'abord toute l'architecture."
      );

      return;
    }

    if (selectedRLS === null) {
      setErrorMessage(
        "Choisissez également la règle de sécurité."
      );

      return;
    }

    setErrorMessage("");

    const architectureCorrect =
      selectedArchitecture.every(
        (item, index) =>
          item ===
          correctArchitecture[index]
      );

    const rlsCorrect =
      rlsAnswers[selectedRLS].correct;

    setValidated(true);

    if (
      !architectureCorrect ||
      !rlsCorrect
    ) {
      setPassed(false);
      return;
    }

    setPassed(true);
    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
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
              "supabase-07-project",
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
        "Erreur progression :",
        error
      );

      setPassed(false);

      setErrorMessage(
        "Le projet est correct, mais votre progression n'a pas pu être enregistrée."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/supabase/07"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Mini-projet
          </span>

        </div>

        {/* HEADER */}

        <section className="mt-10">

          <p className="text-sm font-semibold tracking-[0.2em] text-violet-600">
            MODULE 08 · PROJET FINAL
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">
            Concevez la base de données d&apos;un SaaS
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Votre objectif est de construire une architecture
            multi-utilisateurs puis de choisir la règle de sécurité
            qui empêche un utilisateur d&apos;accéder aux projets
            des autres.
          </p>

        </section>

        {/* MISSION */}

        <section className="mt-8 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            MISSION
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Architecture d&apos;un SaaS avec projets et messages
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Un utilisateur peut posséder plusieurs projets.
            Chaque projet peut ensuite contenir plusieurs messages.
            Vous devez construire cette hiérarchie puis appliquer
            une règle RLS correcte.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <FlowStep text="Utilisateur" />

            <Arrow />

            <FlowStep text="Projets" />

            <Arrow />

            <FlowStep text="Messages" />

          </div>

        </section>

        {/* CONCEPTS */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <ConceptCard
            title="Auth"
            description="Identifier l’utilisateur connecté."
          />

          <ConceptCard
            title="Relation"
            description="Relier les ressources entre elles."
          />

          <ConceptCard
            title="user_id"
            description="Identifier le propriétaire d’un projet."
          />

          <ConceptCard
            title="RLS"
            description="Bloquer les accès non autorisés."
          />

        </section>

        {/* ARCHITECTURE */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
              ÉLÉMENTS DISPONIBLES
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Construisez la hiérarchie
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cliquez sur les éléments dans l&apos;ordre logique
              de l&apos;architecture.
            </p>

            <div className="mt-6 space-y-3">

              {architectureChoices.map(
                (choice) => {
                  const selected =
                    selectedArchitecture.includes(
                      choice.id
                    );

                  return (
                    <button
                      key={choice.id}
                      onClick={() =>
                        addArchitectureBlock(
                          choice.id
                        )
                      }
                      disabled={
                        selected ||
                        validated
                      }
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                          : "border-slate-200 hover:border-slate-950 hover:bg-slate-50"
                      }`}
                    >

                      <p className="font-semibold">
                        + {choice.label}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {choice.description}
                      </p>

                    </button>
                  );
                }
              )}

            </div>

          </section>

          <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-7">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                VOTRE ARCHITECTURE
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Base de données
              </h2>

            </div>

            <div className="min-h-[390px] bg-slate-950 p-6">

              {selectedArchitecture.length ===
              0 ? (
                <p className="text-sm text-slate-500">
                  Ajoutez les premières tables...
                </p>
              ) : (
                <div className="space-y-3">

                  {selectedArchitecture.map(
                    (item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-3"
                      >

                        <div className="flex flex-1 items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
                            {index + 1}
                          </div>

                          <div className="flex-1">

                            <p className="font-mono text-sm font-semibold text-white">
                              {item}
                            </p>

                            {item ===
                              "auth.users" && (
                              <p className="mt-1 text-xs text-slate-500">
                                Utilisateurs authentifiés
                              </p>
                            )}

                            {item ===
                              "projects" && (
                              <p className="mt-1 text-xs text-slate-500">
                                Contient user_id
                              </p>
                            )}

                            {item ===
                              "messages" && (
                              <p className="mt-1 text-xs text-slate-500">
                                Contient project_id
                              </p>
                            )}

                          </div>

                          {!validated && (
                            <button
                              onClick={() =>
                                removeArchitectureBlock(
                                  item
                                )
                              }
                              className="rounded-lg px-2 py-1 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                            >
                              ✕
                            </button>
                          )}

                        </div>

                        {index <
                          selectedArchitecture.length -
                            1 && (
                          <span className="hidden text-slate-600 sm:block">
                            ↓
                          </span>
                        )}

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </section>

        </div>

        {/* RELATIONS */}

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            RELATIONS ATTENDUES
          </p>

          <h2 className="mt-3 text-xl font-bold">
            Comment les données sont reliées
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-xs font-semibold text-slate-400">
                PROJECTS
              </p>

              <pre className="mt-3 overflow-x-auto text-sm leading-7 text-slate-700">
                <code>{`id
user_id
name
created_at`}</code>
              </pre>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-xs font-semibold text-slate-400">
                MESSAGES
              </p>

              <pre className="mt-3 overflow-x-auto text-sm leading-7 text-slate-700">
                <code>{`id
project_id
content
created_at`}</code>
              </pre>

            </div>

          </div>

        </section>

        {/* RLS */}

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            SÉCURITÉ
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Quelle règle protège les projets ?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            La table projects possède une colonne
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">
              user_id
            </code>
            contenant l&apos;identifiant du propriétaire.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950">

            <div className="border-b border-slate-800 px-5 py-3">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                POLICY
              </p>

            </div>

            <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
              <code>{`create policy "Users read own projects"
on projects
for select
to authenticated
using (
    ???
);`}</code>
            </pre>

          </div>

          <div className="mt-6 grid gap-3">

            {rlsAnswers.map(
              (answer, index) => {
                const selected =
                  selectedRLS === index;

                const correct =
                  validated &&
                  answer.correct;

                const wrong =
                  validated &&
                  selected &&
                  !answer.correct;

                return (
                  <button
                    key={answer.text}
                    disabled={validated}
                    onClick={() =>
                      setSelectedRLS(
                        index
                      )
                    }
                    className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
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

                    <code className="text-sm">
                      {answer.text}
                    </code>

                  </button>
                );
              }
            )}

          </div>

        </section>

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
                ? "✓ Architecture correcte"
                : "✕ Il reste quelque chose à corriger"}
            </h2>

            {passed ? (
              <div className="mt-3 space-y-3 leading-7">

                <p>
                  Vous avez correctement construit une
                  architecture multi-utilisateurs et identifié
                  la règle permettant de protéger les projets.
                </p>

                <p>
                  Chaque projet est associé à son propriétaire
                  via user_id, et les messages sont associés
                  aux projets via project_id.
                </p>

              </div>
            ) : (
              <div className="mt-3 space-y-2 leading-7">

                <p>
                  Vérifiez d&apos;abord l&apos;ordre de
                  l&apos;architecture.
                </p>

                <p>
                  L&apos;utilisateur doit posséder les projets,
                  puis les messages doivent appartenir aux projets.
                  Pour RLS, comparez l&apos;utilisateur connecté
                  au propriétaire de la ligne.
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
                selectedArchitecture.length !==
                  correctArchitecture.length ||
                selectedRLS === null ||
                saving
              }
              className={`rounded-2xl px-7 py-4 font-semibold transition ${
                selectedArchitecture.length !==
                  correctArchitecture.length ||
                selectedRLS === null ||
                saving
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-slate-950 text-white hover:scale-[1.02]"
              }`}
            >
              {saving
                ? "Enregistrement..."
                : "Valider mon architecture"}
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
                Terminer le module →
              </button>
            )}

        </div>

        {/* FIN */}

        <section className="mt-10 rounded-[30px] bg-slate-950 p-8 text-white shadow-xl">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            VOUS AVEZ MAINTENANT LES BRIQUES
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Il est temps de construire un vrai SaaS IA
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Vous savez maintenant manipuler Python, communiquer
            avec des API, gérer des utilisateurs et organiser une
            base de données sécurisée.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <DarkStep text="Frontend" />

            <Arrow />

            <DarkStep text="Backend" />

            <Arrow />

            <DarkStep text="Auth" />

            <Arrow />

            <DarkStep text="Database" />

            <Arrow />

            <DarkStep text="API IA" />

          </div>

          <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-400">
            Le Module 09 va assembler tout cela dans une
            application complète : inscription, dashboard,
            fonctionnalité IA, stockage des données et
            architecture SaaS.
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

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        DB
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
    <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
      {text}
    </div>
  );
}

function DarkStep({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm">
      {text}
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}