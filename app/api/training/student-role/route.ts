import { NextResponse } from "next/server";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2:3b";

type RequestBody = {
  prompt?: string;
};

const SUBJECT = `
SUJET DE DISSERTATION

"La révolution industrielle a-t-elle transformé durablement
les sociétés européennes au XIXe siècle ?"

CONTEXTE ÉTUDIANT

- niveau : première année d'université ;
- travail demandé : dissertation structurée ;
- l'étudiant doit produire son propre raisonnement ;
- aucune bibliographie n'a encore été fournie ;
- aucune source précise n'a encore été communiquée ;
- l'objectif pédagogique est d'aider l'étudiant à construire
  une problématique, un plan et des arguments solides ;
- l'IA ne doit pas inventer de références académiques.
`;

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const prompt =
      body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        {
          error:
            "Le prompt est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Le prompt est trop long.",
        },
        {
          status: 400,
        }
      );
    }

    const executionPrompt = `
Voici une consigne créée par un étudiant
pour utiliser une IA dans le cadre d'une dissertation.

---------------- CONSIGNE ----------------

${prompt}

-------------------------------------------

Voici maintenant la situation :

${SUBJECT}

Applique exactement la consigne de l'étudiant.

IMPORTANT

- n'invente pas de source ;
- n'invente pas de citation ;
- ne prétends pas avoir consulté une référence externe ;
- si la consigne demande de poser des questions,
  pose-les au lieu de faire le travail ;
- si la consigne demande une méthode,
  applique cette méthode ;
- si la consigne demande directement la dissertation,
  réponds conformément à la consigne afin que
  l'étudiant puisse observer les conséquences de son prompt.
`;

    const ollamaResponse =
      await fetch(OLLAMA_URL, {
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
              role: "user",
              content:
                executionPrompt,
            },
          ],

          options: {
            temperature: 0.5,
            num_predict: 700,
          },
        }),
      });

    if (!ollamaResponse.ok) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama student-role :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'exécuter le prompt étudiant.",
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
            "Le modèle n'a retourné aucune réponse.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error(
      "Erreur student-role :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter Ollama. Vérifiez que le modèle local fonctionne.",
      },
      {
        status: 500,
      }
    );
  }
}