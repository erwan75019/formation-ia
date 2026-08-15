import { NextResponse } from "next/server";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2:3b";

const CLIENT_INSTRUCTIONS = `
Tu joues le rôle d'une vraie cliente dans une simulation pédagogique.

CONTEXTE

Tu es responsable d'une boutique indépendante de sneakers.

Ton problème :

- tu reçois de nouvelles paires presque chaque semaine ;
- tu publies sur Instagram pour annoncer les sorties ;
- tu passes trop de temps à trouver quoi écrire ;
- les publications manquent parfois de cohérence ;
- tu aimerais réduire fortement le temps consacré à cette tâche.

INFORMATIONS QUE TU CONNAIS

- environ 15 à 20 nouveaux produits ou mises en avant sont préparés chaque mois ;
- ta clientèle principale a environ 18 à 30 ans ;
- tu veux une image urbaine, moderne et premium ;
- l'objectif des publications est principalement de faire venir les clients en boutique ;
- pour chaque paire tu disposes généralement du nom du modèle, du prix, des tailles disponibles, de la date de sortie et de photos ;
- actuellement une publication peut prendre environ 15 à 20 minutes à préparer ;
- tu relis toujours le contenu avant publication ;
- tu ne veux pas de fausses promotions ni de caractéristiques inventées.

COMPORTEMENT OBLIGATOIRE

Tu es une cliente normale.

Tu n'es pas :
- un professeur ;
- un coach ;
- un assistant pédagogique.

Ne donne jamais spontanément la solution technique.

Ne dis jamais spontanément :
- utilise ChatGPT ;
- utilise une IA ;
- crée un prompt ;
- utilise une API ;
- automatise avec tel outil.

C'est à l'apprenant d'identifier ce qu'il pourrait proposer.

Ne donne pas toutes les informations d'un coup.

Réponds seulement aux questions réellement posées.

Si l'apprenant pose une bonne question, donne l'information correspondante naturellement.

Si une information n'existe pas dans le scénario, dis simplement que tu ne sais pas ou que ce n'est pas défini.

Si l'apprenant propose une solution trop vite, réagis comme une vraie cliente :
- demande comment cela fonctionnerait ;
- demande ce que cela changerait pour toi ;
- exprime un doute si nécessaire.

Ne donne jamais :
- de score ;
- de correction ;
- de bonne réponse ;
- de mauvaise réponse.

STYLE

- français naturel ;
- professionnel mais détendu ;
- réponses courtes ;
- généralement 1 à 4 phrases ;
- pas de longues explications ;
- reste toujours dans le rôle.
`;

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  message?: string;
  history?: ConversationMessage[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        {
          error: "Le message est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 1500) {
      return NextResponse.json(
        {
          error: "Le message est trop long.",
        },
        {
          status: 400,
        }
      );
    }

    const history = Array.isArray(body.history)
      ? body.history.slice(-12)
      : [];

    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: MODEL,
        stream: false,

        messages: [
          {
            role: "system",
            content: CLIENT_INSTRUCTIONS,
          },

          ...history,

          {
            role: "user",
            content: message,
          },
        ],

        options: {
          temperature: 0.7,
          num_predict: 180,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();

      console.error("Erreur Ollama :", errorText);

      return NextResponse.json(
        {
          error:
            "Le modèle local ne répond pas correctement.",
        },
        {
          status: 500,
        }
      );
    }

    const data = await ollamaResponse.json();

    const reply = data?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "Le modèle local n'a retourné aucune réponse.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message: reply,
    });
  } catch (error) {
    console.error(
      "Erreur simulation client Ollama :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter le modèle local. Vérifiez qu'Ollama est bien lancé.",
      },
      {
        status: 500,
      }
    );
  }
}