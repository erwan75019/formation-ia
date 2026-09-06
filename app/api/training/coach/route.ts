import { NextResponse } from "next/server";

import { getOfficialLessonMinimumPlan, requireTrainingAccess } from "@/lib/training/access";
import { buildCoachSystemPrompt, getCoachLessonContext } from "@/lib/training/coach/contexts.server";
import { askCoachProvider, CoachProviderUnavailableError } from "@/lib/training/coach/provider.server";
import { consumeCoachRateLimit } from "@/lib/training/coach/rate-limit.server";
import { isQuizAnswerRequest, parseCoachRequest } from "@/lib/training/coach/request";

const requestErrors = {
  invalid_body: "La requête doit contenir uniquement lesson_id et question.",
  invalid_lesson: "L’identifiant de leçon est invalide.",
  empty_question: "Écrivez une question avant de l’envoyer.",
  question_too_long: "La question est trop longue (800 caractères maximum).",
} as const;

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: requestErrors.invalid_body }, { status: 400 });
  }

  const parsed = parseCoachRequest(rawBody);
  if (!parsed.ok) {
    return NextResponse.json({ error: requestErrors[parsed.error] }, { status: 400 });
  }

  const context = getCoachLessonContext(parsed.data.lesson_id);
  const minimumPlan = getOfficialLessonMinimumPlan(parsed.data.lesson_id);

  if (!context || !minimumPlan) {
    return NextResponse.json({ error: "Cette leçon n’est pas disponible pour le Coach IA." }, { status: 400 });
  }

  const access = await requireTrainingAccess(minimumPlan);
  if (!access.authorized) return access.response;

  const rateLimit = consumeCoachRateLimit(access.userId);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Vous avez envoyé trop de questions. Patientez un instant avant de réessayer." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  if (isQuizAnswerRequest(parsed.data.question)) {
    return NextResponse.json({
      answer:
        "Je ne peux pas fournir les réponses ou le corrigé du QCM. Je peux en revanche réexpliquer la notion de la leçon étape par étape ou proposer un exemple différent.",
    });
  }

  try {
    const answer = await askCoachProvider(
      buildCoachSystemPrompt(context),
      parsed.data.question
    );
    return NextResponse.json({ answer });
  } catch (error) {
    if (error instanceof CoachProviderUnavailableError) {
      return NextResponse.json(
        { error: "Le Coach IA local est momentanément indisponible. Vérifiez qu’Ollama est lancé, puis réessayez." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Le Coach IA n’a pas pu répondre. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
