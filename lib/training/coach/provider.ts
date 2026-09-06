export class CoachProviderUnavailableError extends Error {}

type OllamaChatResponse = {
  message?: { content?: unknown };
};

export async function requestOllamaCoach(
  fetcher: typeof fetch,
  url: string,
  model: string,
  systemPrompt: string,
  question: string,
  signal?: AbortSignal
) {
  try {
    const response = await fetcher(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        options: { temperature: 0.25 },
      }),
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      throw new CoachProviderUnavailableError("Le fournisseur IA local a refusé la requête.");
    }

    const data = (await response.json()) as OllamaChatResponse;
    const answer = typeof data.message?.content === "string" ? data.message.content.trim() : "";
    if (!answer) {
      throw new CoachProviderUnavailableError("Le fournisseur IA local a renvoyé une réponse vide.");
    }

    return answer;
  } catch (error) {
    if (error instanceof CoachProviderUnavailableError) throw error;
    throw new CoachProviderUnavailableError("Le fournisseur IA local est indisponible.");
  }
}
