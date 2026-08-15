import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import {
  certificateDefinitions,
  hasCertificateAccess,
  isCertificateType,
} from "@/lib/certificates/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function createCertificateNumber() {
  const year = new Date().getFullYear();
  const code = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();

  return `AIA-${year}-FR-${code}`;
}

function formatName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getFullName(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const firstName = String(
    metadata.first_name ?? metadata.firstName ?? ""
  ).trim();
  const lastName = String(metadata.last_name ?? metadata.lastName ?? "").trim();
  const metadataFullName = String(
    metadata.full_name ?? metadata.name ?? ""
  ).trim();

  return formatName(
    metadataFullName ||
      `${firstName} ${lastName}`.trim() ||
      user.email?.split("@")[0] ||
      "Étudiant AI Academy"
  );
}

export async function POST(request: Request) {
  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    !("type" in body)
  ) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const requestedType = (body as { type?: unknown }).type;

  if (!isCertificateType(requestedType)) {
    return NextResponse.json(
      { error: "Type de certificat invalide." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const definition = certificateDefinitions[requestedType];

  const { data: existingCertificate, error: existingError } = await admin
    .from("certificates")
    .select("id, certificate_number, certificate_type, issued_at")
    .eq("user_id", user.id)
    .eq("certificate_type", requestedType)
    .maybeSingle();

  if (existingError) {
    console.error("Erreur lecture certificat :", existingError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  if (existingCertificate) {
    return NextResponse.json({ certificate: existingCertificate });
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Erreur lecture profil certificat :", profileError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  if (
    !hasCertificateAccess(
      requestedType,
      profile.plan,
      profile.subscription_status
    )
  ) {
    return NextResponse.json(
      { error: "Votre offre active ne permet pas ce certificat." },
      { status: 403 }
    );
  }

  const { data: progress, error: progressError } = await admin
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id)
    .in("lesson_id", [...definition.lessonIds]);

  if (progressError) {
    console.error("Erreur vérification progression :", progressError.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  const completedByLesson = new Map(
    (progress ?? []).map((item) => [item.lesson_id, item])
  );
  const requiredProgress = definition.lessonIds.map((lessonId) =>
    completedByLesson.get(lessonId)
  );
  const allCompleted = requiredProgress.every(
    (item) => item?.completed === true && typeof item.completed_at === "string"
  );

  if (!allCompleted) {
    return NextResponse.json(
      { error: "Toutes les leçons requises ne sont pas encore validées." },
      { status: 403 }
    );
  }

  const { data: certificate, error: insertError } = await admin
    .from("certificates")
    .insert({
      user_id: user.id,
      certificate_type: requestedType,
      certificate_number: createCertificateNumber(),
      full_name: getFullName(user),
      course_name: definition.name,
      issued_at: new Date().toISOString(),
    })
    .select("id, certificate_number, certificate_type, issued_at")
    .single();

  if (!insertError && certificate) {
    return NextResponse.json({ certificate }, { status: 201 });
  }

  if (insertError?.code === "23505") {
    const { data: concurrentCertificate, error: concurrentError } = await admin
      .from("certificates")
      .select("id, certificate_number, certificate_type, issued_at")
      .eq("user_id", user.id)
      .eq("certificate_type", requestedType)
      .maybeSingle();

    if (!concurrentError && concurrentCertificate) {
      return NextResponse.json({ certificate: concurrentCertificate });
    }
  }

  console.error("Erreur création certificat :", insertError?.message);
  return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
}
