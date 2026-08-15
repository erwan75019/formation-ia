"use client";

import { useMemo, useState } from "react";

// ======================================================
// TYPES
// ======================================================

export type TrainingEmail = {
  id: string;
  from: string;
  senderName: string;
  subject: string;
  body: string;
  receivedAt: string;
  unread: boolean;
  starred: boolean;
  folder: "inbox" | "archive";
};

export type EmailClassification = {
  category: string;
  priority: string;
  action: string;
};

type Props = {
  onSelectEmail?: (
    email: TrainingEmail
  ) => void;

  classifications?: Record<
    string,
    EmailClassification
  >;

  onClassificationChange?: (
    emailId: string,
    value: EmailClassification
  ) => void;

  trainingMode?: boolean;
};

// ======================================================
// EMAILS DE SIMULATION
// ======================================================

const INITIAL_EMAILS: TrainingEmail[] = [
  {
    id: "mail-001",
    from: "marie@atelier-nova.fr",
    senderName:
      "Marie · Atelier Nova",
    subject:
      "Facture de juillet manquante",
    body:
      "Bonjour,\n\nJe n’ai toujours pas reçu la facture de juillet pour notre abonnement. Pouvez-vous me la transmettre avant vendredi ?\n\nMerci,\nMarie",
    receivedAt: "09:12",
    unread: true,
    starred: false,
    folder: "inbox",
  },

  {
    id: "mail-002",
    from: "lucas@studio-arc.fr",
    senderName:
      "Lucas · Studio Arc",
    subject:
      "Demande de tarif pour 12 personnes",
    body:
      "Bonjour,\n\nNous sommes une équipe de 12 personnes et nous aimerions connaître vos tarifs ainsi que les délais de mise en place.\n\nBien cordialement,\nLucas",
    receivedAt: "08:47",
    unread: true,
    starred: true,
    folder: "inbox",
  },

  {
    id: "mail-003",
    from: "client@exemple.fr",
    senderName:
      "Client · Exemple",
    subject:
      "Double paiement de 89 €",
    body:
      "Bonjour,\n\nJ’ai été débité deux fois de 89 € aujourd’hui. Pouvez-vous vérifier rapidement ?\n\nNuméro de commande : CMD-4821.\n\nMerci.",
    receivedAt: "Hier",
    unread: false,
    starred: false,
    folder: "inbox",
  },

  {
    id: "mail-004",
    from:
      "camille@horizon-conseil.fr",
    senderName:
      "Camille · Horizon Conseil",
    subject:
      "Déplacer notre rendez-vous",
    body:
      "Bonjour,\n\nSerait-il possible de déplacer notre rendez-vous de jeudi à vendredi après-midi ?\n\nMerci d’avance,\nCamille",
    receivedAt: "Hier",
    unread: false,
    starred: false,
    folder: "inbox",
  },

  {
    id: "mail-005",
    from:
      "newsletter@outils-pro.fr",
    senderName: "Outils Pro",
    subject:
      "Les nouveautés de la semaine",
    body:
      "Découvrez nos dernières nouveautés, nos conseils et notre sélection de la semaine.",
    receivedAt: "Lun.",
    unread: false,
    starred: false,
    folder: "inbox",
  },
];

// ======================================================
// OPTIONS PÉDAGOGIQUES
// ======================================================

const CATEGORIES = [
  "Facturation",
  "Commercial",
  "Support",
  "Rendez-vous",
  "Information",
  "À vérifier",
];

const PRIORITIES = [
  "Haute",
  "Normale",
  "Faible",
];

const ACTIONS = [
  "Vérifier manuellement",
  "Préparer une réponse",
  "Créer une tâche",
  "Classer uniquement",
  "Ignorer",
];

// ======================================================
// COMPOSANT
// ======================================================

export default function AutomationInbox({
  onSelectEmail,
  classifications = {},
  onClassificationChange,
  trainingMode = false,
}: Props) {
  const [
    emails,
    setEmails,
  ] =
    useState<TrainingEmail[]>(
      INITIAL_EMAILS
    );

  const [
    selectedId,
    setSelectedId,
  ] =
    useState<string>(
      INITIAL_EMAILS[0].id
    );

  const [
    filter,
    setFilter,
  ] =
    useState<
      "all" |
      "unread" |
      "starred"
    >("all");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    toast,
    setToast,
  ] =
    useState("");

  // ====================================================
  // EMAIL SÉLECTIONNÉ
  // ====================================================

  const selected =
    emails.find(
      (email) =>
        email.id === selectedId
    ) ??
    emails[0];

  // ====================================================
  // EMAILS VISIBLES
  // ====================================================

  const visibleEmails =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return emails.filter(
        (email) => {
          if (
            email.folder !==
            "inbox"
          ) {
            return false;
          }

          if (
            filter ===
              "unread" &&
            !email.unread
          ) {
            return false;
          }

          if (
            filter ===
              "starred" &&
            !email.starred
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return [
            email.senderName,
            email.from,
            email.subject,
            email.body,
          ].some(
            (value) =>
              value
                .toLowerCase()
                .includes(query)
          );
        }
      );
    }, [
      emails,
      filter,
      search,
    ]);

  // ====================================================
  // STATS
  // ====================================================

  const unreadCount =
    emails.filter(
      (email) =>
        email.folder ===
          "inbox" &&
        email.unread
    ).length;

  const classifiedCount =
    Object.values(
      classifications
    ).filter(
      (classification) =>
        classification.category &&
        classification.priority &&
        classification.action
    ).length;

  // ====================================================
  // SÉLECTION EMAIL
  // ====================================================

  function selectEmail(
    email: TrainingEmail
  ) {
    setSelectedId(
      email.id
    );

    setEmails(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            email.id
              ? {
                  ...item,
                  unread: false,
                }
              : item
        )
    );

    onSelectEmail?.({
      ...email,
      unread: false,
    });
  }

  // ====================================================
  // FAVORI
  // ====================================================

  function toggleStar(
    id: string
  ) {
    setEmails(
      (current) =>
        current.map(
          (email) =>
            email.id === id
              ? {
                  ...email,
                  starred:
                    !email.starred,
                }
              : email
        )
    );
  }

  // ====================================================
  // ARCHIVE
  // ====================================================

  function archiveSelected() {
    if (!selected) {
      return;
    }

    setEmails(
      (current) =>
        current.map(
          (email) =>
            email.id ===
            selected.id
              ? {
                  ...email,
                  folder:
                    "archive",
                }
              : email
        )
    );

    const remaining =
      visibleEmails.filter(
        (email) =>
          email.id !==
          selected.id
      );

    if (
      remaining[0]
    ) {
      setSelectedId(
        remaining[0].id
      );

      onSelectEmail?.(
        remaining[0]
      );
    }

    showToast(
      "Email archivé"
    );
  }

  // ====================================================
  // NON LU
  // ====================================================

  function markUnread() {
    if (!selected) {
      return;
    }

    setEmails(
      (current) =>
        current.map(
          (email) =>
            email.id ===
            selected.id
              ? {
                  ...email,
                  unread: true,
                }
              : email
        )
    );

    showToast(
      "Email marqué comme non lu"
    );
  }

  // ====================================================
  // RESET
  // ====================================================

  function resetInbox() {
    setEmails(
      INITIAL_EMAILS
    );

    setSelectedId(
      INITIAL_EMAILS[0].id
    );

    setFilter("all");

    setSearch("");

    onSelectEmail?.(
      INITIAL_EMAILS[0]
    );

    showToast(
      "Boîte de réception réinitialisée"
    );
  }

  // ====================================================
  // TOAST
  // ====================================================

  function showToast(
    message: string
  ) {
    setToast(message);

    window.setTimeout(
      () =>
        setToast(""),
      1800
    );
  }

  // ====================================================
  // CLASSIFICATION
  // ====================================================

  function updateClassification(
    field:
      | "category"
      | "priority"
      | "action",
    value: string
  ) {
    if (
      !selected ||
      !onClassificationChange
    ) {
      return;
    }

    const current =
      classifications[
        selected.id
      ] ?? {
        category: "",
        priority: "",
        action: "",
      };

    onClassificationChange(
      selected.id,
      {
        ...current,
        [field]: value,
      }
    );
  }

  const selectedClassification =
    selected
      ? classifications[
          selected.id
        ] ?? {
          category: "",
          priority: "",
          action: "",
        }
      : null;

  // ====================================================
  // UI
  // ====================================================

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">

        <div>

          <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
            BOÎTE MAIL DE FORMATION
          </p>

          <h3 className="mt-1 text-xl font-bold">
            Inbox simulation
          </h3>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          {trainingMode && (
            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              {classifiedCount}/
              {INITIAL_EMAILS.length}{" "}
              emails traités
            </div>
          )}

          <button
            type="button"
            onClick={
              resetInbox
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
          >
            Réinitialiser
          </button>

        </div>

      </div>

      {/* ==================================================
          INBOX
      ================================================== */}

      <div className="grid min-h-[620px] lg:grid-cols-[220px_320px_1fr]">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">

          <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">

            Réception

            <span className="ml-2 text-slate-400">
              {unreadCount}
            </span>

          </div>

          <div className="mt-4 space-y-1">

            <SidebarFilter
              active={
                filter === "all"
              }
              onClick={() =>
                setFilter(
                  "all"
                )
              }
            >
              Tous les emails
            </SidebarFilter>

            <SidebarFilter
              active={
                filter ===
                "unread"
              }
              onClick={() =>
                setFilter(
                  "unread"
                )
              }
            >
              Non lus
            </SidebarFilter>

            <SidebarFilter
              active={
                filter ===
                "starred"
              }
              onClick={() =>
                setFilter(
                  "starred"
                )
              }
            >
              Favoris
            </SidebarFilter>

          </div>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4">

            <p className="text-xs font-semibold tracking-[0.12em] text-slate-400">
              OBJECTIF
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Cette boîte mail
              est fictive.
              Vous pouvez
              expérimenter sans
              risque avant de
              travailler avec de
              vrais emails.
            </p>

          </div>

          {trainingMode && (
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">

              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                MISSION
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Pour chaque
                email, choisissez
                une catégorie,
                une priorité et
                l&apos;action que
                votre workflow
                devra effectuer.
              </p>

            </div>
          )}

        </aside>

        {/* ==================================================
            LISTE EMAILS
        ================================================== */}

        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">

          <div className="border-b border-slate-200 p-4">

            <input
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Rechercher un email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            />

          </div>

          <div className="max-h-[620px] overflow-y-auto">

            {visibleEmails.map(
              (email) => {
                const active =
                  selected?.id ===
                  email.id;

                const classification =
                  classifications[
                    email.id
                  ];

                const complete =
                  Boolean(
                    classification
                      ?.category &&
                      classification
                        ?.priority &&
                      classification
                        ?.action
                  );

                return (
                  <button
                    key={
                      email.id
                    }
                    type="button"
                    onClick={() =>
                      selectEmail(
                        email
                      )
                    }
                    className={`w-full border-b border-slate-100 p-4 text-left transition ${
                      active
                        ? "bg-slate-950 text-white"
                        : "hover:bg-slate-50"
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <p
                          className={`truncate text-sm ${
                            email.unread
                              ? "font-bold"
                              : "font-medium"
                          }`}
                        >
                          {
                            email.senderName
                          }
                        </p>

                        <p
                          className={`mt-1 truncate text-sm ${
                            active
                              ? "text-slate-300"
                              : "text-slate-700"
                          }`}
                        >
                          {
                            email.subject
                          }
                        </p>

                      </div>

                      <span
                        className={`shrink-0 text-xs ${
                          active
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {
                          email.receivedAt
                        }
                      </span>

                    </div>

                    <p
                      className={`mt-2 line-clamp-2 text-xs leading-5 ${
                        active
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {email.body.replace(
                        /\n/g,
                        " "
                      )}
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      {email.unread && (
                        <span
                          className={`h-2 w-2 rounded-full ${
                            active
                              ? "bg-white"
                              : "bg-slate-950"
                          }`}
                        />
                      )}

                      {email.starred && (
                        <span
                          className={`text-xs ${
                            active
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          ★
                        </span>
                      )}

                      {trainingMode &&
                        complete && (
                          <span
                            className={`ml-auto rounded-full px-2 py-1 text-[10px] font-bold ${
                              active
                                ? "bg-white text-slate-950"
                                : "bg-slate-950 text-white"
                            }`}
                          >
                            ✓ TRAITÉ
                          </span>
                        )}

                    </div>

                  </button>
                );
              }
            )}

            {visibleEmails.length ===
              0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                Aucun email
                dans cette vue.
              </div>
            )}

          </div>

        </div>

        {/* ==================================================
            CONTENU EMAIL
        ================================================== */}

        <div className="p-5 md:p-6">

          {selected ? (
            <>

              {/* ACTIONS */}

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      toggleStar(
                        selected.id
                      )
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:bg-slate-50"
                  >
                    {selected.starred
                      ? "★ Favori"
                      : "☆ Favori"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      markUnread
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:bg-slate-50"
                  >
                    Non lu
                  </button>

                </div>

                <button
                  type="button"
                  onClick={
                    archiveSelected
                  }
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Archiver
                </button>

              </div>

              {/* EMAIL */}

              <div className="mt-7">

                <p className="text-xs font-semibold tracking-[0.12em] text-slate-400">
                  EMAIL
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  {
                    selected.subject
                  }
                </h2>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">

                  <div>

                    <p className="font-semibold">
                      {
                        selected.senderName
                      }
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {
                        selected.from
                      }
                    </p>

                  </div>

                  <span className="text-sm text-slate-400">
                    {
                      selected.receivedAt
                    }
                  </span>

                </div>

                <p className="mt-6 whitespace-pre-line leading-8 text-slate-700">
                  {
                    selected.body
                  }
                </p>

              </div>

              {/* ==================================================
                  MODE FORMATION
              ================================================== */}

              {trainingMode &&
                selectedClassification &&
                onClassificationChange && (
                  <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5">

                    <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                      TRAITEMENT DU WORKFLOW
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      Que doit faire
                      votre système ?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Analysez
                      uniquement ce
                      qui est présent
                      dans le message.
                    </p>

                    {/* CATÉGORIE */}

                    <div className="mt-6">

                      <p className="text-sm font-bold">
                        1. Catégorie
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {CATEGORIES.map(
                          (
                            category
                          ) => (
                            <OptionButton
                              key={
                                category
                              }
                              active={
                                selectedClassification.category ===
                                category
                              }
                              onClick={() =>
                                updateClassification(
                                  "category",
                                  category
                                )
                              }
                            >
                              {
                                category
                              }
                            </OptionButton>
                          )
                        )}

                      </div>

                    </div>

                    {/* PRIORITÉ */}

                    <div className="mt-6">

                      <p className="text-sm font-bold">
                        2. Priorité
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {PRIORITIES.map(
                          (
                            priority
                          ) => (
                            <OptionButton
                              key={
                                priority
                              }
                              active={
                                selectedClassification.priority ===
                                priority
                              }
                              onClick={() =>
                                updateClassification(
                                  "priority",
                                  priority
                                )
                              }
                            >
                              {
                                priority
                              }
                            </OptionButton>
                          )
                        )}

                      </div>

                    </div>

                    {/* ACTION */}

                    <div className="mt-6">

                      <p className="text-sm font-bold">
                        3. Action
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {ACTIONS.map(
                          (
                            action
                          ) => (
                            <OptionButton
                              key={
                                action
                              }
                              active={
                                selectedClassification.action ===
                                action
                              }
                              onClick={() =>
                                updateClassification(
                                  "action",
                                  action
                                )
                              }
                            >
                              {
                                action
                              }
                            </OptionButton>
                          )
                        )}

                      </div>

                    </div>

                    {/* RÉSUMÉ */}

                    {selectedClassification.category &&
                      selectedClassification.priority &&
                      selectedClassification.action && (
                        <div className="mt-6 rounded-2xl bg-white p-4">

                          <p className="text-xs font-semibold tracking-[0.12em] text-slate-400">
                            DÉCISION
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            <strong>
                              {
                                selectedClassification.category
                              }
                            </strong>
                            {" · "}
                            Priorité{" "}
                            <strong>
                              {
                                selectedClassification.priority
                              }
                            </strong>
                            {" · "}
                            {
                              selectedClassification.action
                            }
                          </p>

                        </div>
                      )}

                  </div>
                )}

              {/* MODE NORMAL */}

              {!trainingMode && (
                <div className="mt-8 rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                    PROCHAINE ÉTAPE
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Dans la suite
                    du module, cet
                    email pourra être
                    classé, analysé,
                    transformé en
                    données puis
                    utilisé pour
                    préparer une
                    action.
                  </p>

                </div>
              )}

            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Sélectionnez un
              email.
            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          TOAST
      ================================================== */}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}

    </section>
  );
}

// ======================================================
// SIDEBAR FILTER
// ======================================================

function SidebarFilter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

// ======================================================
// OPTION BUTTON
// ======================================================

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {children}
    </button>
  );
}