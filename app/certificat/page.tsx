import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import CertificateGenerateButton from "@/components/certificates/CertificateGenerateButton";
import {
  certificateDefinitions,
  certificateTypes,
  hasCertificateAccess,
  type CertificateType,
} from "@/lib/certificates/config";
import { createClient } from "@/lib/supabase/server";

type Certificate = {
  id: string;
  certificate_number: string;
  certificate_type: CertificateType;
  full_name: string;
  course_name: string;
  issued_at: string;
};

function formatCertificateDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function CertificatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const [profileResult, progressResult, certificatesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, subscription_status")
      .eq("id", user.id)
      .single(),
    supabase
      .from("lesson_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", user.id),
    supabase
      .from("certificates")
      .select(
        "id, certificate_number, certificate_type, full_name, course_name, issued_at"
      )
      .eq("user_id", user.id),
  ]);

  if (profileResult.error) {
    console.error("Erreur profil certificats :", profileResult.error.message);
  }

  if (progressResult.error) {
    console.error("Erreur progression certificats :", progressResult.error.message);
  }

  if (certificatesResult.error) {
    console.error("Erreur lecture certificats :", certificatesResult.error.message);
  }

  const profile = profileResult.data;
  const progress = progressResult.data ?? [];
  const certificates = (certificatesResult.data ?? []) as Certificate[];
  const completedLessonIds = new Set(
    progress
      .filter(
        (item) => item.completed === true && typeof item.completed_at === "string"
      )
      .map((item) => item.lesson_id)
  );

  const certificatesByType = new Map(
    certificates.map((certificate) => [certificate.certificate_type, certificate])
  );

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#08172c] print:bg-white">
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          .certificate-sheet { break-after: page; }
        }
      `}</style>

      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 font-bold"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-[#07172c] text-white">
              AI
            </span>
            AI Academy
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Retour au dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="print:hidden">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Certifications AI Academy
          </p>
          <h1 className="mt-3 text-4xl font-bold">Mes certificats</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Chaque certificat est délivré après vérification sécurisée de votre
            offre et de toutes les leçons requises. Un certificat déjà délivré
            reste disponible même après la fin de l’abonnement.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {certificateTypes.map((type) => {
            const definition = certificateDefinitions[type];
            const certificate = certificatesByType.get(type);
            const completedCount = definition.lessonIds.filter((lessonId) =>
              completedLessonIds.has(lessonId)
            ).length;
            const lessonsCompleted =
              completedCount === definition.lessonIds.length;
            const planEligible = hasCertificateAccess(
              type,
              profile?.plan,
              profile?.subscription_status
            );
            const eligible = planEligible && lessonsCompleted;

            return (
              <article
                key={type}
                className={`rounded-3xl border border-slate-200 bg-white p-7 shadow-sm ${
                  certificate
                    ? "print:border-0 print:p-0 print:shadow-none"
                    : "print:hidden"
                }`}
              >
                <div className="flex items-start justify-between gap-4 print:hidden">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a5731e]">
                      Certificat {type}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold">
                      {definition.title}
                    </h2>
                    <p className="mt-1 font-serif text-lg text-slate-700">
                      {definition.name}
                    </p>
                    <p className="mt-4 leading-6 text-slate-600">
                      {definition.description}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      certificate
                        ? "bg-emerald-100 text-emerald-800"
                        : eligible
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {certificate
                      ? "Délivré"
                      : eligible
                        ? "Éligible"
                        : "À compléter"}
                  </span>
                </div>

                {certificate ? (
                  <div className="mt-7">
                    <CertificatePreview
                      certificate={certificate}
                      heading={definition.title}
                      title={definition.name}
                      description={definition.description}
                    />

                    <Link
                      href={`/api/certificat/pdf?type=${type}`}
                      className="mt-6 inline-flex rounded-xl bg-[#07172c] px-5 py-3 text-sm font-semibold text-white print:hidden"
                    >
                      Télécharger le PDF
                    </Link>
                  </div>
                ) : (
                  <div className="mt-7">
                    <p className="text-sm text-slate-600">
                      {completedCount} / {definition.lessonIds.length} leçons
                      validées
                    </p>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#07172c]"
                        style={{
                          width: `${Math.round(
                            (completedCount / definition.lessonIds.length) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-6">
                      {eligible ? (
                        <CertificateGenerateButton type={type} />
                      ) : !planEligible ? (
                        <div>
                          <p className="text-sm text-slate-500">
                            Une offre compatible active ou en période d’essai est
                            requise.
                          </p>
                          <Link
                            href="/tarifs"
                            className="mt-4 inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold"
                          >
                            Voir les offres
                          </Link>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Terminez toutes les leçons requises pour générer ce
                          certificat.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function CertificatePreview({
  certificate,
  heading,
  title,
  description,
}: {
  certificate: Certificate;
  heading: string;
  title: string;
  description: string;
}) {
  return (
    <section className="certificate-sheet relative mx-auto aspect-[297/210] w-full max-w-[1120px] overflow-hidden bg-[#fffdf7] p-[clamp(2.5rem,7vw,6rem)] text-[#07172c] shadow-[0_20px_60px_rgba(15,23,42,0.16)] print:shadow-none">
      <div className="pointer-events-none absolute inset-3 border-[6px] border-[#07172c]" />
      <div className="pointer-events-none absolute inset-6 border border-[#b88832]" />
      <div className="pointer-events-none absolute inset-[29px] border border-[#d0a759]" />

      <CertificateCorner className="left-[29px] top-[29px]" />
      <CertificateCorner className="right-[29px] top-[29px] rotate-90" />
      <CertificateCorner className="bottom-[29px] left-[29px] -rotate-90" />
      <CertificateCorner className="bottom-[29px] right-[29px] rotate-180" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[clamp(9rem,25vw,20rem)] font-bold text-[#07172c]/[0.035]">
        AI
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex justify-end">
          <div className="text-right">
            <p className="text-[clamp(0.45rem,1vw,0.65rem)] font-bold uppercase tracking-[0.16em] text-[#a5731e]">
              Certificat n°
            </p>
            <p className="mt-2 border-t border-[#b88832] pt-2 text-[clamp(0.55rem,1.3vw,0.8rem)] font-bold tracking-wide">
              {certificate.certificate_number}
            </p>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-[5%] text-center">
          <div className="mb-[clamp(0.5rem,1.5vw,1rem)] flex items-center gap-4 text-[#b88832]">
            <span className="h-px w-[clamp(3rem,9vw,7rem)] bg-current" />
            <span className="text-xs">◆</span>
            <span className="h-px w-[clamp(3rem,9vw,7rem)] bg-current" />
          </div>

          <h2 className="font-serif text-[clamp(1rem,2.8vw,2rem)] font-bold uppercase tracking-[0.06em]">
            {heading}
          </h2>

          <p className="mt-[clamp(0.5rem,1.2vw,0.8rem)] font-serif text-[clamp(0.7rem,1.6vw,1.1rem)] text-slate-600">
            AI Academy atteste que
          </p>
          <h3 className="mt-[clamp(0.5rem,1.4vw,1rem)] font-serif text-[clamp(1.7rem,5vw,4rem)] font-semibold leading-none">
            {certificate.full_name}
          </h3>
          <div className="mt-[clamp(0.6rem,1.6vw,1.1rem)] h-px w-1/2 bg-[#b88832]" />

          <h4 className="mt-[clamp(0.8rem,2vw,1.5rem)] max-w-4xl font-serif text-[clamp(0.9rem,2.3vw,1.65rem)] font-bold uppercase leading-tight tracking-[0.03em]">
            {title}
          </h4>
          <p className="mt-[clamp(0.6rem,1.5vw,1rem)] max-w-3xl text-[clamp(0.55rem,1.15vw,0.85rem)] leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        <footer className="grid grid-cols-3 items-end gap-6">
          <div className="flex justify-start">
            <div className="flex size-[clamp(4rem,9vw,6.5rem)] flex-col items-center justify-center rounded-full border-2 border-[#b88832] outline outline-1 outline-offset-[-7px] outline-[#07172c]">
              <span className="font-serif text-[clamp(1rem,2.5vw,1.8rem)] font-bold">
                AI
              </span>
              <span className="mt-1 text-[clamp(0.35rem,0.8vw,0.55rem)] font-bold uppercase tracking-[0.12em] text-[#a5731e]">
                AI Academy
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[clamp(0.4rem,0.9vw,0.6rem)] font-bold uppercase tracking-[0.16em] text-[#a5731e]">
              Délivré le
            </p>
            <p className="mt-2 border-t border-[#b88832] pt-2 font-serif text-[clamp(0.65rem,1.4vw,1rem)] font-bold">
              {formatCertificateDate(certificate.issued_at)}
            </p>
          </div>

          <div className="text-center">
            <div className="flex h-[clamp(2rem,5vw,3.5rem)] items-end justify-center">
              <Image
                src="/signature.png"
                alt="Signature de la direction AI Academy"
                width={300}
                height={120}
                className="max-h-full max-w-[70%] object-contain"
              />
            </div>
            <div className="mt-1 border-t border-[#b88832] pt-2">
              <p className="text-[clamp(0.4rem,0.9vw,0.6rem)] font-bold uppercase tracking-[0.16em] text-[#a5731e]">
                Direction
              </p>
              <p className="mt-1 font-serif text-[clamp(0.55rem,1.2vw,0.8rem)] font-bold">
                AI Academy
              </p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

function CertificateCorner({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute size-[clamp(2.5rem,6vw,5rem)] ${className}`}
    >
      <div className="absolute left-2 top-2 h-3/4 w-3/4 rounded-tl-[100%] border-l-2 border-t-2 border-[#b88832]" />
      <div className="absolute left-4 top-4 h-1/2 w-1/2 rounded-tl-[100%] border-l border-t border-[#07172c]" />
      <div className="absolute left-1 top-1 size-2 rotate-45 border border-[#b88832]" />
    </div>
  );
}
