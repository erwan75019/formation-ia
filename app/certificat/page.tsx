import Link from "next/link";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

const finalProjectLessons = [
  "final-01-spec",
  "final-02-architecture",
  "final-03-data-security",
  "final-04-ai-features",
  "final-05-backend",
  "final-06-production",
  "final-07-project",
];

const CERTIFICATE_COURSE_NAME =
  "Conception et développement de solutions d’intelligence artificielle";

// ======================================================
// NUMÉRO CERTIFICAT
// ======================================================

function createCertificateNumber() {
  const year = new Date().getFullYear();

  const code = randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase();

  return `AIA-${year}-FR-${code}`;
}

// ======================================================
// DATE
// ======================================================

function formatCertificateDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// ======================================================
// NOM
// ======================================================

function formatName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part: string) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join(" ");
}

// ======================================================
// PAGE
// ======================================================

export default async function CertificatePage() {
  const supabase = await createClient();

  // ======================================================
  // USER
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

  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select(`
      lesson_id,
      completed,
      completed_at
    `)
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression certificat :",
      progressError
    );
  }

  const progress = progressData ?? [];

  const completedIds = new Set(
    progress
      .filter((item) => item.completed === true)
      .map((item) => item.lesson_id)
  );

  const formationCompleted = finalProjectLessons.every((lessonId) =>
    completedIds.has(lessonId)
  );

  // ======================================================
  // PREVIEW DEV
  // ======================================================

  const previewMode = process.env.NODE_ENV === "development";

  if (!formationCompleted && !previewMode) {
    redirect("/dashboard");
  }

  // ======================================================
  // NOM COMPLET
  // ======================================================

  const metadata = user.user_metadata ?? {};

  const firstName = String(
    metadata.first_name ??
      metadata.firstName ??
      ""
  ).trim();

  const lastName = String(
    metadata.last_name ??
      metadata.lastName ??
      ""
  ).trim();

  const metadataFullName = String(
    metadata.full_name ??
      metadata.name ??
      ""
  ).trim();

  const generatedFullName =
    `${firstName} ${lastName}`.trim();

  const rawFullName =
    metadataFullName ||
    generatedFullName ||
    user.email?.split("@")[0] ||
    "Étudiant AI Academy";

  const fullName = formatName(rawFullName);

  // ======================================================
  // VRAIE DATE DE FIN
  // ======================================================

  const finalLessonProgress = progress.find(
    (item) =>
      item.lesson_id === "final-07-project"
  );

  const completionDate =
    finalLessonProgress?.completed_at ?? null;

  // ======================================================
  // CERTIFICAT EXISTANT
  // ======================================================

  const {
    data: existingCertificate,
    error: certificateSearchError,
  } = await supabase
    .from("certificates")
    .select(`
      id,
      certificate_number,
      full_name,
      course_name,
      issued_at
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (certificateSearchError) {
    console.error(
      "Erreur récupération certificat :",
      certificateSearchError
    );
  }

  let certificate = existingCertificate;

  // ======================================================
  // CRÉATION CERTIFICAT OFFICIEL
  // ======================================================

  if (
    !certificate &&
    formationCompleted &&
    completionDate
  ) {
    const certificateNumber =
      createCertificateNumber();

    const {
      data: newCertificate,
      error: certificateCreateError,
    } = await supabase
      .from("certificates")
      .insert({
        user_id: user.id,
        certificate_number: certificateNumber,
        full_name: fullName,
        course_name: CERTIFICATE_COURSE_NAME,

        // IMPORTANT :
        // la date enregistrée est celle où
        // final-07-project a été terminé.
        issued_at: completionDate,
      })
      .select(`
        id,
        certificate_number,
        full_name,
        course_name,
        issued_at
      `)
      .single();

    if (certificateCreateError) {
      console.error(
        "Erreur création certificat :",
        certificateCreateError
      );
    }

    certificate = newCertificate;
  }

  // ======================================================
  // PREVIEW DÉVELOPPEUR
  // ======================================================

  if (!certificate && previewMode) {
    certificate = {
      id: "preview",

      certificate_number:
        "AIA-2026-FR-PREVIEW",

      full_name: fullName,

      course_name:
        CERTIFICATE_COURSE_NAME,

      // Si la formation est réellement terminée :
      // vraie date.
      //
      // Sinon en preview :
      // date actuelle uniquement pour visualiser.
      issued_at:
        completionDate ??
        new Date().toISOString(),
    };
  }

  // ======================================================
  // ERREUR
  // ======================================================

  if (!certificate) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#07172c] font-bold text-white">
            AI
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Certificat indisponible
          </h1>

          <p className="mt-3 text-slate-500">
            Impossible de générer votre certificat.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-[#07172c] px-5 py-3 font-semibold text-white"
          >
            Retour au dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ======================================================
  // DONNÉES AFFICHÉES
  // ======================================================

  const certificateFullName = formatName(
    String(certificate.full_name)
  );

  const issueDate = formatCertificateDate(
    String(certificate.issued_at)
  );

  const initials = certificateFullName
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const canDownloadPdf =
    formationCompleted || previewMode;

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#08172c]">
      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <div className="flex items-center gap-9">
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center bg-[#07172c] font-bold text-white"
            >
              AI
            </Link>

            <nav className="hidden h-16 items-center gap-8 lg:flex">
              <Link
                href="/dashboard"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Tableau de bord
              </Link>

              <Link
                href="/dashboard#parcours"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Ma formation
              </Link>

              <Link
                href="/projets"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Mes projets
              </Link>

              <Link
                href="/certificat"
                className="flex h-16 items-center border-b-2 border-[#07172c] text-sm font-semibold"
              >
                Mon certificat
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#07172c] text-[11px] font-bold text-white">
              {initials || "AI"}
            </div>

            <span className="hidden text-sm font-semibold sm:block">
              {certificateFullName}
            </span>
          </div>
        </div>
      </header>

      {/* ==================================================
          PAGE
      ================================================== */}

      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
        {/* ACTIONS */}

        <div className="mx-auto mb-6 flex max-w-[1260px] flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            ← Retour au dashboard
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/projets"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold shadow-sm transition hover:border-slate-300"
            >
              Mes projets
            </Link>

            {canDownloadPdf ? (
              <Link
                href="/api/certificat/pdf"
                className="rounded-xl bg-[#07172c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01]"
              >
                ↓ Télécharger le PDF
              </Link>
            ) : (
              <div className="cursor-not-allowed rounded-xl bg-slate-300 px-6 py-3 text-sm font-semibold text-slate-500">
                PDF après validation
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW */}

        {previewMode && !formationCompleted && (
          <div className="mx-auto mb-5 max-w-[1260px] rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-xs font-semibold text-slate-500">
            Aperçu développeur — certificat non officiellement délivré.
          </div>
        )}

        {/* ==================================================
            CERTIFICAT
        ================================================== */}

        <section className="mx-auto max-w-[1260px] overflow-x-auto pb-2">
          <div className="min-w-[920px] bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)]">
            <div
              className="relative overflow-hidden"
              style={{
                backgroundColor: "#fffdf7",
                width: "100%",
                height: "820px",
              }}
            >
              {/* CADRES */}

              <div className="pointer-events-none absolute inset-[8px] border-[4px] border-[#07172c]" />

              <div className="pointer-events-none absolute inset-[17px] border border-[#b88832]" />

              <div className="pointer-events-none absolute inset-[23px] border border-[#07172c]" />

              <div className="pointer-events-none absolute inset-[29px] border border-[#d0a759]" />

              {/* COINS */}

              <CertificateCorner position="tl" />
              <CertificateCorner position="tr" />
              <CertificateCorner position="bl" />
              <CertificateCorner position="br" />

              {/* ==================================================
                  CONTENU
              ================================================== */}

              <div className="relative z-10 flex h-full flex-col px-[72px] pb-[40px] pt-[46px]">
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="grid grid-cols-[1fr_auto_1fr] items-start">
                  <div className="flex items-center gap-4">
                    <div className="flex h-[70px] w-[70px] items-center justify-center bg-[#07172c] text-2xl font-bold text-white">
                      AI
                    </div>

                    <div>
                      <p className="font-serif text-[30px] font-semibold leading-none">
                        AI Academy
                      </p>

                      <p className="mt-2 text-[10px] font-semibold text-[#a5731e]">
                        Certification
                      </p>
                    </div>
                  </div>

                  <div />

                  <div className="text-right">
                    <p className="text-[10px] font-semibold tracking-[0.05em] text-[#a5731e]">
                      CERTIFICAT N°
                    </p>

                    <div className="ml-auto mt-2 h-px w-[190px] bg-[#b88832]" />

                    <p className="mt-3 text-[12px] font-bold">
                      {certificate.certificate_number}
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    TITRE
                ================================================== */}

                <div className="mt-8 text-center">
                  <CertificateDivider />

                  <h1 className="mt-3 font-serif text-[27px] font-bold uppercase tracking-[0.04em]">
                    Certificat de réussite
                  </h1>
                </div>

                {/* ==================================================
                    CONTENU CENTRAL
                ================================================== */}

                <div className="mt-8 text-center">
                  <p className="font-serif text-[17px] text-slate-600">
                    Ce certificat atteste que
                  </p>

                  <h2 className="mt-5 font-serif text-[56px] font-semibold leading-none tracking-tight">
                    {certificateFullName}
                  </h2>

                  {/* LIGNE SOUS NOM */}

                  <div className="mx-auto mt-6 flex max-w-[570px] items-center">
                    <div className="h-px flex-1 bg-[#b88832]" />

                    <span className="mx-3 text-[10px] text-[#b88832]">
                      ●
                    </span>

                    <div className="h-px flex-1 bg-[#b88832]" />
                  </div>

                  <p className="mt-6 font-serif text-[16px] text-slate-600">
                    a terminé avec succès la formation
                  </p>

                  <h3 className="mx-auto mt-4 max-w-[800px] font-serif text-[25px] font-bold uppercase leading-[1.22]">
                    Conception et développement de solutions
                    <br />
                    d&apos;intelligence artificielle
                  </h3>

                  <p className="mx-auto mt-5 max-w-[690px] text-[13px] leading-[1.7] text-slate-600">
                    et a validé les compétences nécessaires à la compréhension,
                    <br />
                    à la conception et au développement de solutions basées sur
                    l&apos;intelligence artificielle.
                  </p>

                  {/* ==================================================
                      DATE
                  ================================================== */}

                  <div className="mt-2">
                    <div className="mx-auto h-px w-[95px] bg-[#b88832]" />

                    <p className="mt-3 text-[9px] font-bold uppercase text-[#a5731e]">
                      Délivré le
                    </p>

                    <p className="mt-2 font-serif text-[20px] font-bold">
                      {formationCompleted || previewMode
                        ? issueDate
                        : "Date de fin de formation"}
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    SIGNATURE
                    REMONTÉE POUR NE PLUS DÉBORDER
                ================================================== */}

                <div className="mt-auto flex justify-end pb-[28px] pr-[55px]">
                  <div className="w-[220px] text-center">
                    {/* SIGNATURE */}

                    <div className="flex h-[55px] items-end justify-center">
                      <img
                        src="/signature.png"
                        alt="Signature Direction AI Academy"
                        className="max-h-[50px] max-w-[150px] object-contain"
                      />
                    </div>

                    {/* LIGNE */}

                    <div className="mx-auto mt-1 h-px w-[180px] bg-[#b88832]" />

                    {/* DIRECTION */}

                    <p className="mt-3 text-[8px] font-bold uppercase text-[#a5731e]">
                      DIRECTION
                    </p>

                    {/* AI ACADEMY */}

                    <p className="mt-2 font-serif text-[14px] font-bold text-[#08172c]">
                      AI Academy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ======================================================
// DIVIDER
// ======================================================

function CertificateDivider() {
  return (
    <div className="flex items-center justify-center gap-7">
      <div className="h-px w-[100px] bg-[#b88832]" />

      <span className="text-[11px] text-[#b88832]">
        ●
      </span>

      <div className="h-px w-[100px] bg-[#b88832]" />
    </div>
  );
}

// ======================================================
// COINS
// ======================================================

function CertificateCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const classes = {
    tl: "left-[17px] top-[17px]",
    tr: "right-[17px] top-[17px] rotate-90",
    bl: "bottom-[17px] left-[17px] -rotate-90",
    br: "bottom-[17px] right-[17px] rotate-180",
  };

  return (
    <div
      className={`pointer-events-none absolute h-[68px] w-[68px] ${classes[position]}`}
    >
      <div className="absolute left-0 top-0 h-[58px] w-[58px] rounded-tl-[38px] border-l-2 border-t-2 border-[#b88832]" />

      <div className="absolute left-[7px] top-[7px] h-[45px] w-[45px] rounded-tl-[32px] border-l border-t border-[#07172c]" />
    </div>
  );
}