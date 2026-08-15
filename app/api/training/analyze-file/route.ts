import { NextResponse } from "next/server";
import { requireTrainingAccess } from "@/lib/training/access";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/chat";

const MODEL = "llama3.2:3b";

type RequestBody = {
  question?: string;
  fileName?: string;
  headers?: string[];
  rows?: Record<string, string>[];
};

export async function POST(
  request: Request
) {
  const access = await requireTrainingAccess("fondamentaux");

  if (!access.authorized) {
    return access.response;
  }

  try {
    const body =
      (await request.json()) as RequestBody;

    const question =
      body.question?.trim();

    const fileName =
      body.fileName?.trim() ||
      "fichier.csv";

    const headers =
      Array.isArray(
        body.headers
      )
        ? body.headers
        : [];

    const rows =
      Array.isArray(
        body.rows
      )
        ? body.rows
        : [];

    if (!question) {
      return NextResponse.json(
        {
          error:
            "Vous devez poser une question.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      headers.length === 0 ||
      rows.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Aucune donnée exploitable n'a été reçue.",
        },
        {
          status: 400,
        }
      );
    }

    const safeRows =
      rows.slice(0, 300);

    const systemPrompt = `
Tu es un assistant pédagogique.

Tu aides une personne débutante à comprendre un fichier.

Tu dois utiliser UNIQUEMENT les données fournies.

RÈGLES :

- n'invente aucune information ;
- si une information n'est pas disponible, dis-le clairement ;
- si tu fais un calcul, explique brièvement comment ;
- si tu compares des valeurs, indique les valeurs utilisées ;
- si une conclusion est incertaine, dis qu'elle est incertaine ;
- ne fais pas de jargon technique inutile ;
- réponds en français ;
- sois clair et concis.

Fichier :
${fileName}

Colonnes :
${headers.join(", ")}

Nombre de lignes reçues :
${rows.length}

Nombre de lignes analysées :
${safeRows.length}
`;

    const userPrompt = `
QUESTION

${question}

========================================

DONNÉES

${JSON.stringify(
  safeRows,
  null,
  2
)}

========================================

Réponds uniquement à partir de ces données.

Quand c'est utile, termine par :

"Comment j'ai vérifié :"

puis explique simplement les valeurs ou calculs utilisés.
`;

    const ollamaResponse =
      await fetch(
        OLLAMA_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model: MODEL,
            stream: false,

            messages: [
              {
                role: "system",
                content:
                  systemPrompt,
              },
              {
                role: "user",
                content:
                  userPrompt,
              },
            ],

            options: {
              temperature: 0.1,
              num_predict: 600,
            },
          }),
        }
      );

    if (
      !ollamaResponse.ok
    ) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama analyze-file :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "L'IA locale n'a pas pu analyser le fichier.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await ollamaResponse.json();

    const answer =
      data?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json(
        {
          error:
            "L'IA n'a retourné aucune réponse.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error(
      "Erreur analyze-file :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter l'assistant local.",
      },
      {
        status: 500,
      }
    );
  }
}
