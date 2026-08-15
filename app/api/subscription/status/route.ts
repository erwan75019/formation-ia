import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "plan, subscription_status, current_period_end, subscription_cancel_at_period_end"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Impossible de lire l'abonnement." },
      { status: 500 }
    );
  }

  const active =
    profile?.subscription_status === "active" ||
    profile?.subscription_status === "trialing";
  const plan =
    profile?.plan === "fondamentaux" || profile?.plan === "complet"
      ? profile.plan
      : null;

  return NextResponse.json({
    active: active && plan !== null,
    plan,
    status: profile?.subscription_status ?? "inactive",
    currentPeriodEnd: profile?.current_period_end ?? null,
    cancelAtPeriodEnd:
      profile?.subscription_cancel_at_period_end ?? false,
  });
}
