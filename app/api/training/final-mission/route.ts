import { NextResponse } from "next/server";
import { requireTrainingAccess } from "@/lib/training/access";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/chat";

const MODEL =
  "llama3.2:3b";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  action?:
    | "client"
    | "run"
    | "evaluate";

  message?: string;

  history?: ConversationMessage[];

  solution?: string;

  prompt?: string;

  output?: string;

  conversation?: string;
};

const BUSINESS_CONTEXT = `
ENTREPRISE

Pulse Studio

TYPE

Salle de sport indépendante.

SITUATION

La responsable reçoit beaucoup de demandes
par Instagram et par email.

Elle répond souvent aux mêmes questions.

Elle trouve cela répétitif et perd beaucoup
de temps dans la journée.

INFORMATIONS QUE LA RESPONSABLE CONNAÎT

Abonnement mensuel :
49 € / mois

Sans engagement.

Frais d'inscription :
20 € une seule fois.

Séance d'essai :
gratuite sur réservation.

Horaires :
- lundi au vendredi : 6h30 à 22h00
- samedi : 8h00 à 20h00
- dimanche : 9h00 à 18h00

Cours collectifs :
- yoga
- boxing
- HIIT
- cycling

Les cours sont inclus dans l'abonnement.

Coaching individuel :
possible mais facturé séparément.

Le tarif du coaching dépend du coach
et n'est pas défini dans ce scénario.

La salle possède :
- espace musculation ;
- espace cardio ;
- vestiaires ;
- douches.

Le parking n'est PAS gratuit.
Aucune information de prix parking
n'est disponible.

La salle ne propose PAS actuellement :
- piscine ;
- sauna.

OBJECTIF DE LA RESPONSABLE

Répondre plus rapidement aux prospects
tout en gardant des réponses naturelles.

Elle souhaite aussi éviter :
- les mauvaises informations ;
- les promesses inventées ;
- les réponses trop robotiques.

Elle veut toujours pouvoir relire une réponse
avant son envoi.

VOLUME

Environ 30 à 40 demandes par jour.

TEMPS ACTUEL

Environ 2 à 3 heures par jour peuvent être
consacrées à lire et répondre aux demandes.

TYPE DE QUESTIONS FRÉQUENTES

- tarifs ;
- horaires ;
- séance d'essai ;
- cours disponibles ;
- équipements ;
- abonnement ;
- coaching individuel.

IMPORTANT

La responsable ne connaît pas spécialement
les outils IA.

Elle ne demande jamais spontanément :
- ChatGPT ;
- une API ;
- un agent ;
- un chatbot ;
- une automatisation.

C'est à l'apprenant d'identifier
ce qu'il pourrait proposer.
`;

const TEST_LEAD = `
DEMANDE TEST

Prénom :
Sarah

Message :

"Bonjour, je cherche une salle près de chez moi.
Je voudrais surtout faire du HIIT et un peu de musculation.
Est-ce que les cours sont compris dans l'abonnement ?
Je termine souvent le travail à 20h donc je voulais aussi savoir
jusqu'à quelle heure vous êtes ouverts.
Et est-ce que je peux essayer avant de m'inscrire ? Merci !"

CANAL :
Instagram

OBJECTIF :

Préparer une réponse que la responsable
pourrait relire puis envoyer.
`;

function cleanArray(
  value: unknown,
  max: number
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item ===
          "string" &&
        item.trim()
    )
    .slice(0, max);
}

function clampScore(
  value: unknown
) {
  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number)
    )
  );
}

/* ======================================================
   CLIENT SIMULÉ
====================================================== */

async function handleClient(
  body: RequestBody
) {
  const message =
    body.message?.trim();

  if (!message) {
    return NextResponse.json(
      {
        error:
          "Le message est obligatoire.",
      },
      {
        status: 400,
      }
    );
  }

  const history =
    Array.isArray(
      body.history
    )
      ? body.history.slice(
          -16
        )
      : [];

  const systemPrompt = `
Tu joues le rôle de la responsable
de Pulse Studio.

Voici toutes les informations que tu connais :

${BUSINESS_CONTEXT}

COMPORTEMENT

Tu es une vraie cliente.

Tu ne dois surtout pas jouer le professeur.

Tu ne donnes jamais spontanément
toutes les informations.

Tu réponds uniquement aux questions
réellement posées.

Si l'apprenant pose une question pertinente,
donne l'information correspondante.

S'il propose une solution,
tu peux lui poser une question naturelle
sur son fonctionnement ou son intérêt.

Tu peux exprimer une objection réaliste.

Exemples :

"Mais comment je vérifie qu'il ne donne pas
une mauvaise information ?"

ou

"Est-ce que je dois écrire quelque chose
à chaque fois ?"

Ne propose jamais toi-même :

- ChatGPT ;
- une IA ;
- une API ;
- un chatbot ;
- un agent ;
- une automatisation.

Tu n'es pas coach.

Tu ne dis jamais :
- bonne réponse ;
- mauvaise réponse ;
- bravo ;
- score.

STYLE

- français naturel ;
- réponses courtes ;
- généralement 1 à 4 phrases ;
- ton professionnel mais détendu ;
- reste toujours dans le rôle.
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
            model:
              MODEL,

            stream:
              false,

            messages: [
              {
                role:
                  "system",
                content:
                  systemPrompt,
              },

              ...history,

              {
                role:
                  "user",
                content:
                  message,
              },
            ],

            options: {
              temperature:
                0.7,

              num_predict:
                220,
            },
          }),
      }
    );

  if (
    !ollamaResponse.ok
  ) {
    throw new Error(
      "Erreur Ollama client final"
    );
  }

  const data =
    await ollamaResponse.json();

  const reply =
    data?.message?.content?.trim();

  if (!reply) {
    throw new Error(
      "Aucune réponse client"
    );
  }

  return NextResponse.json({
    message: reply,
  });
}

/* ======================================================
   EXÉCUTION DU SERVICE
====================================================== */

async function handleRun(
  body: RequestBody
) {
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

  const systemPrompt = `
Tu exécutes un système conçu
par un apprenant.

Tu dois appliquer son prompt
aux données métier disponibles.

RÈGLES ABSOLUES

- ne crée aucun tarif ;
- ne crée aucun équipement ;
- ne crée aucun avantage ;
- ne crée aucun horaire ;
- ne crée aucune promotion ;
- ne crée aucune politique commerciale ;
- ne crée aucun tarif de coaching individuel ;
- ne dis jamais qu'il existe une piscine ;
- ne dis jamais qu'il existe un sauna ;
- ne dis jamais que le parking est gratuit.

Si une information n'est pas disponible,
reste prudent.

La réponse produite est destinée
à être relue par un humain avant envoi.

Tu ne dois pas expliquer le prompt.
Tu dois simplement produire
le résultat demandé.
`;

  const userPrompt = `
PROMPT CONÇU PAR L'APPRENANT

${prompt}

========================================

DONNÉES MÉTIER

${BUSINESS_CONTEXT}

========================================

${TEST_LEAD}

========================================

Exécute maintenant
le prompt de l'apprenant.
`;

  const response =
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
            model:
              MODEL,

            stream:
              false,

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
                  userPrompt,
              },
            ],

            options: {
              temperature:
                0.55,

              num_predict:
                450,
            },
          }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Erreur génération mission finale"
    );
  }

  const data =
    await response.json();

  const output =
    data?.message?.content?.trim();

  if (!output) {
    throw new Error(
      "Aucune sortie générée"
    );
  }

  return NextResponse.json({
    output,

    testLead: {
      name:
        "Sarah",

      channel:
        "Instagram",

      message:
        "Bonjour, je cherche une salle près de chez moi. Je voudrais surtout faire du HIIT et un peu de musculation. Est-ce que les cours sont compris dans l'abonnement ? Je termine souvent le travail à 20h donc je voulais aussi savoir jusqu'à quelle heure vous êtes ouverts. Et est-ce que je peux essayer avant de m'inscrire ? Merci !",
    },
  });
}

/* ======================================================
   ÉVALUATION FINALE
====================================================== */

async function handleEvaluate(
  body: RequestBody
) {
  const solution =
    body.solution?.trim();

  const prompt =
    body.prompt?.trim();

  const output =
    body.output?.trim();

  const conversation =
    body.conversation?.trim() ||
    "";

  if (
    !solution ||
    !prompt ||
    !output
  ) {
    return NextResponse.json(
      {
        error:
          "La solution, le prompt et la sortie sont obligatoires.",
      },
      {
        status: 400,
      }
    );
  }

  const evaluationPrompt = `
Tu es évaluateur final
d'une mission professionnelle IA.

Tu dois juger l'ensemble
de la démarche d'un apprenant.

Il ne s'agit PAS d'un devoir scolaire.

Tu évalues sa capacité à construire
un petit service IA réellement utile.

==================================================
CAS CLIENT RÉEL
==================================================

${BUSINESS_CONTEXT}

==================================================
DEMANDE TEST
==================================================

${TEST_LEAD}

==================================================
ÉLÉMENTS À ÉVALUER
==================================================

1. DÉCOUVERTE CLIENT

La conversation montre-t-elle
que l'apprenant a cherché
à comprendre :

- le volume ;
- le temps perdu ;
- les questions fréquentes ;
- les informations disponibles ;
- les attentes ;
- les risques ;
- le processus de validation ?

Il n'est PAS nécessaire
qu'il ait demandé chaque élément.

Juge la qualité globale
de sa découverte.

2. SOLUTION PROPOSÉE

La solution répond-elle réellement
au problème ?

Elle doit être proportionnée.

Une solution simple mais utile
doit être mieux évaluée
qu'un système complexe inutile.

3. PROMPT

Le prompt définit-il correctement :

- l'objectif ;
- le contexte ;
- les informations disponibles ;
- les règles ;
- la fiabilité ;
- le format attendu ?

4. SORTIE

La sortie répond-elle correctement
à Sarah ?

Elle devrait notamment pouvoir répondre
avec les faits disponibles :

- HIIT disponible ;
- musculation disponible ;
- cours inclus ;
- fermeture semaine à 22h ;
- essai gratuit sur réservation.

5. FIABILITÉ

Vérifie qu'aucune information
n'a été inventée.

6. VALEUR MÉTIER

Le système peut-il réellement
faire gagner du temps
à la responsable ?

==================================================
RÉPONDS UNIQUEMENT EN JSON
==================================================

Structure exacte :

{
  "global_score": 0,

  "discovery": 0,
  "solution": 0,
  "prompt_quality": 0,
  "output_quality": 0,
  "reliability": 0,
  "business_value": 0,

  "level": "",

  "summary": "",

  "strengths": [
    ""
  ],

  "weaknesses": [
    ""
  ],

  "client_value": "",

  "next_step": ""
}

Tous les scores sont compris
entre 0 et 100.

level doit être exactement :

"À retravailler"
"Bonne base"
"Solide"
"Prêt pour la suite"

strengths :
maximum 4 éléments.

weaknesses :
maximum 4 éléments.

client_value :
une phrase expliquant
ce que le client gagne réellement.

next_step :
une seule étape logique
pour faire évoluer ce prototype.

Ne récompense pas :
- la longueur ;
- le vocabulaire technique ;
- les mots IA, API ou agent.

Récompense :
- la pertinence ;
- la simplicité ;
- la fiabilité ;
- la valeur.
`;

  const userPrompt = `
CONVERSATION

${conversation}

========================================

SOLUTION PROPOSÉE

${solution}

========================================

PROMPT

${prompt}

========================================

SORTIE DU SYSTÈME

${output}

========================================

Analyse maintenant
la mission complète.
`;

  const response =
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
            model:
              MODEL,

            stream:
              false,

            format:
              "json",

            messages: [
              {
                role:
                  "system",
                content:
                  evaluationPrompt,
              },

              {
                role:
                  "user",
                content:
                  userPrompt,
              },
            ],

            options: {
              temperature:
                0.1,

              num_predict:
                750,
            },
          }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Erreur évaluation finale"
    );
  }

  const data =
    await response.json();

  const raw =
    data?.message?.content?.trim();

  if (!raw) {
    throw new Error(
      "Aucune évaluation"
    );
  }

  let parsed;

  try {
    parsed =
      JSON.parse(raw);
  } catch {
    console.error(
      "JSON invalide :",
      raw
    );

    return NextResponse.json(
      {
        error:
          "L'évaluation finale est invalide. Réessayez.",
      },
      {
        status: 500,
      }
    );
  }

  const scores = {
    discovery:
      clampScore(
        parsed.discovery
      ),

    solution:
      clampScore(
        parsed.solution
      ),

    promptQuality:
      clampScore(
        parsed.prompt_quality
      ),

    outputQuality:
      clampScore(
        parsed.output_quality
      ),

    reliability:
      clampScore(
        parsed.reliability
      ),

    businessValue:
      clampScore(
        parsed.business_value
      ),
  };

  const globalScore =
    Math.round(
      scores.discovery *
        0.15 +
        scores.solution *
          0.2 +
        scores.promptQuality *
          0.2 +
        scores.outputQuality *
          0.2 +
        scores.reliability *
          0.15 +
        scores.businessValue *
          0.1
    );

  let level =
    parsed.level;

  if (
    ![
      "À retravailler",
      "Bonne base",
      "Solide",
      "Prêt pour la suite",
    ].includes(level)
  ) {
    if (
      globalScore >=
      85
    ) {
      level =
        "Prêt pour la suite";
    } else if (
      globalScore >=
      70
    ) {
      level =
        "Solide";
    } else if (
      globalScore >=
      50
    ) {
      level =
        "Bonne base";
    } else {
      level =
        "À retravailler";
    }
  }

  return NextResponse.json({
    globalScore,
    level,
    scores,

    summary:
      typeof parsed.summary ===
      "string"
        ? parsed.summary
        : "",

    strengths:
      cleanArray(
        parsed.strengths,
        4
      ),

    weaknesses:
      cleanArray(
        parsed.weaknesses,
        4
      ),

    clientValue:
      typeof parsed.client_value ===
      "string"
        ? parsed.client_value
        : "",

    nextStep:
      typeof parsed.next_step ===
      "string"
        ? parsed.next_step
        : "",
  });
}

/* ======================================================
   ROUTE
====================================================== */

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

    switch (
      body.action
    ) {
      case "client":
        return await handleClient(
          body
        );

      case "run":
        return await handleRun(
          body
        );

      case "evaluate":
        return await handleEvaluate(
          body
        );

      default:
        return NextResponse.json(
          {
            error:
              "Action inconnue.",
          },
          {
            status: 400,
          }
        );
    }
  } catch (error) {
    console.error(
      "Erreur mission finale :",
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
