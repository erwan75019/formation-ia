import "server-only";

import { NextResponse } from "next/server";

import { certificateDefinitions } from "@/lib/certificates/config";
import { createClient } from "@/lib/supabase/server";

export type TrainingPlan = "fondamentaux" | "complet";

type TrainingProfile = {
  plan: TrainingPlan;
  subscription_status: "active" | "trialing";
};

type TrainingAccessResult =
  | {
      authorized: true;
      userId: string;
      profile: TrainingProfile;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

const activeStatuses = new Set(["active", "trialing"]);

function forbidden(message: string) {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function getMinimumPlanError(
  currentPlan: TrainingPlan,
  minimumPlan: TrainingPlan
) {
  if (minimumPlan === "complet" && currentPlan !== "complet") {
    return forbidden("Cette fonctionnalité nécessite l’offre Complet.");
  }

  return null;
}

export async function requireTrainingAccess(
  minimumPlan: TrainingPlan
): Promise<TrainingAccessResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    (profile.plan !== "fondamentaux" && profile.plan !== "complet") ||
    !activeStatuses.has(profile.subscription_status)
  ) {
    return {
      authorized: false,
      response: forbidden("Un abonnement actif est requis."),
    };
  }

  const minimumPlanError = getMinimumPlanError(profile.plan, minimumPlan);

  if (minimumPlanError) {
    return {
      authorized: false,
      response: minimumPlanError,
    };
  }

  return {
    authorized: true,
    userId: user.id,
    profile: {
      plan: profile.plan,
      subscription_status: profile.subscription_status,
    },
  };
}

const fondamentauxLessonIds = new Set<string>(
  certificateDefinitions.fondamentaux.lessonIds
);
const completeLessonIds = new Set<string>(
  certificateDefinitions.complet.lessonIds
);

export function getOfficialLessonMinimumPlan(
  lessonId: unknown
): TrainingPlan | null {
  if (typeof lessonId !== "string") {
    return null;
  }

  const normalizedLessonId = lessonId.trim();

  if (fondamentauxLessonIds.has(normalizedLessonId)) {
    return "fondamentaux";
  }

  if (completeLessonIds.has(normalizedLessonId)) {
    return "complet";
  }

  return null;
}

const practicalEvaluationPrefixes = [
  "quotidien-",
  "fichiers-",
  "automation-",
  "web-",
] as const;

export function getPracticalEvaluationMinimumPlan(
  lessonId: unknown
): TrainingPlan | null {
  if (
    typeof lessonId !== "string" ||
    !practicalEvaluationPrefixes.some((prefix) =>
      lessonId.trim().startsWith(prefix)
    )
  ) {
    return null;
  }

  return getOfficialLessonMinimumPlan(lessonId);
}
