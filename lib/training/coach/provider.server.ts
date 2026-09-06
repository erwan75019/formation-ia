import "server-only";

import { requestOllamaCoach } from "./provider";

export { CoachProviderUnavailableError } from "./provider";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL ?? "http://127.0.0.1:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:3b";

export async function askCoachProvider(systemPrompt: string, question: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    return await requestOllamaCoach(
      fetch,
      OLLAMA_API_URL,
      OLLAMA_MODEL,
      systemPrompt,
      question,
      controller.signal
    );
  } finally {
    clearTimeout(timeout);
  }
}
