import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 6;
const requestsByUser = new Map<string, number[]>();

export function consumeCoachRateLimit(userId: string, now = Date.now()) {
  const recentRequests = (requestsByUser.get(userId) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recentRequests.length >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - recentRequests[0])) / 1000)
    );
    requestsByUser.set(userId, recentRequests);
    return { allowed: false as const, retryAfterSeconds };
  }

  recentRequests.push(now);
  requestsByUser.set(userId, recentRequests);
  return { allowed: true as const };
}
