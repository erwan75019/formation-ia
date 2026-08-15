import { NextResponse } from "next/server";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/chat";

const MODEL =
  "llama3.2:3b";

type RequestBody = {
  template?: string;

  variables?: Record<
    string,
    string
  >;
};

function injectVariables(
  template: string,
  variables: Record<
    string,
    string
  >
) {
  let finalPrompt =
    template;

  for (const [
    key,
    value,
  ] of Object.entries(
    variables
  )) {
    finalPrompt =
      finalPrompt.replaceAll(
        `{{${key}}}`,
        value.trim() ||
          "[non renseigné]"
      );
  }

  return finalPrompt;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const template =
      body.template?.trim();

    const variables =
      body.variables;

    if (!template) {
      return NextResponse.json(
        {
          error:
            "Le template est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !variables ||
      typeof variables !==
        "object"
    ) {
      return NextResponse.json(
        {
          error:
            "Les variables sont obligatoires.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      template.length >
      8000
    ) {
      return NextResponse.json(
        {
          error:
            "Le template est trop long.",
        },
        {
          status: 400,
        }
      );
    }

    const finalPrompt =
      injectVariables(
        template,
        variables
      );

    const systemPrompt = `
Tu exécutes un template créé par un apprenant
dans une plateforme de formation.

Tu dois produire uniquement le livrable demandé.

RÈGLES GÉNÉRALES

- respecte strictement les informations fournies ;
- n'invente pas de prix ;
- n'invente pas de caractéristiques ;
- n'invente pas de source ;
- n'invente pas de témoignage ;
- n'invente pas de promotion ;
- n'invente pas de statistique ;
- n'invente pas de politique commerciale ;
- si une information essentielle manque, reste prudent ;
- respecte le ton demandé ;
- respecte le format demandé ;
- ne commente pas le template ;
- ne donne pas de cours sur le prompting ;
- ne commence pas par "Voici votre réponse" sauf si cela est demandé.
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

          body:
            JSON.stringify({
              model: MODEL,

              stream: false,

              messages: [
                {
                  role:
                    "system",

                  content:
                    systemPrompt,
                },

                {
                  role:
                    "user",

                  content:
                    finalPrompt,
                },
              ],

              options: {
                temperature:
                  0.5,

                num_predict:
                  600,
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
        "Erreur template-run Ollama :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'exécuter le template.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await ollamaResponse.json();

    const result =
      data?.message?.content?.trim();

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Le modèle n'a retourné aucun résultat.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      result,
      finalPrompt,
    });
  } catch (error) {
    console.error(
      "Erreur template-run :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter Ollama. Vérifiez qu'il fonctionne.",
      },
      {
        status: 500,
      }
    );
  }
}