export type PaidAccessProfile = {
  plan: unknown;
  subscription_status: unknown;
  current_period_end: unknown;
};

export function hasCurrentPaidAccess(
  profile: PaidAccessProfile | null | undefined,
  now: Date = new Date()
) {
  if (
    !profile ||
    (profile.plan !== "fondamentaux" && profile.plan !== "complet") ||
    profile.subscription_status !== "active" ||
    typeof profile.current_period_end !== "string"
  ) {
    return false;
  }

  const periodEnd = new Date(profile.current_period_end);
  return !Number.isNaN(periodEnd.getTime()) && periodEnd.getTime() > now.getTime();
}
