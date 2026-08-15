import { NextResponse } from "next/server";
import { requireTrainingAccess } from "@/lib/training/access";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2:3b";

type RequestBody = {
  prompt?: string;
};

const TEST_PRODUCT = `
PRODUIT À TRAITER

Nom :
Nike Air Max Dn8

Prix :
189,99 €

Date de sortie :
Samedi 15 novembre

Tailles disponibles :
40 à 46

Couleurs :
Noir / Gris

Disponibilité :
En boutique à partir de 10h

INFORMATIONS IMPORTANTES

- aucune promotion n'est prévue ;
- aucune autre caractéristique technique n'est fournie ;
- le contenu est destiné à Instagram.
`;

export async function POST(request: Request) {
  const access = await requireTrainingAccess("fondamentaux");

  if (!access.authorized) {
    return access.response;
  }

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

    const finalPrompt = `
Voici les instructions créées par l'utilisateur :

---------------- PROMPT ----------------

${prompt}

----------------------------------------

Voici maintenant les données réelles à traiter :

${TEST_PRODUCT}

Applique les instructions de l'utilisateur aux données ci-dessus.

Ne commente pas le prompt.
Ne l'évalue pas.
Exécute simplement la tâche demandée.
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
              content: finalPrompt,
            },
          ],

          options: {
            temperature: 0.7,
            num_predict: 500,
          },
        }),
      });

    if (!ollamaResponse.ok) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama test prompt :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'exécuter le prompt.",
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

      product: {
        name: "Nike Air Max Dn8",
        price: "189,99 €",
        releaseDate:
          "Samedi 15 novembre",
        sizes: "40 à 46",
        colors: "Noir / Gris",
        availability:
          "En boutique à partir de 10h",
      },
    });
  } catch (error) {
    console.error(
      "Erreur test prompt :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter le modèle local. Vérifiez qu'Ollama fonctionne.",
      },
      {
        status: 500,
      }
    );
  }
}
