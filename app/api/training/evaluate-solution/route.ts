import { NextResponse } from "next/server";
import { requireTrainingAccess } from "@/lib/training/access";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2:3b";

type RequestBody = {
  solution?: string;
  conversation?: string;
};

type EvaluationPayload = {
  global_score?: number;
  level?: string;

  need_understanding?: number;
  solution_relevance?: number;
  client_value?: number;
  control_and_safety?: number;
  simplicity?: number;

  diagnosis?: string;

  strengths?: string[];
  weaknesses?: string[];

  next_version?: string[];
};

function clampScore(value: unknown) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(number))
  );
}

export async function POST(request: Request) {
  const access = await requireTrainingAccess("fondamentaux");

  if (!access.authorized) {
    return access.response;
  }

  try {
    const body =
      (await request.json()) as RequestBody;

    const solution =
      body.solution?.trim();

    const conversation =
      body.conversation?.trim() || "";

    if (!solution) {
      return NextResponse.json(
        {
          error:
            "La proposition est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (solution.length > 3000) {
      return NextResponse.json(
        {
          error:
            "La proposition est trop longue.",
        },
        {
          status: 400,
        }
      );
    }

    const systemPrompt = `
Tu es un coach expert en conception de services IA pour des clients.

Tu ne corriges PAS un devoir scolaire.

Tu analyses une proposition comme si tu aidais un futur prestataire IA à construire une solution réellement utile, simple et vendable.

==================================================
CAS CLIENT
==================================================

La cliente gère une boutique indépendante de sneakers.

PROBLÈME RÉEL

- elle reçoit régulièrement de nouvelles paires ;
- elle prépare des publications Instagram pour annoncer les sorties ;
- chaque publication peut lui prendre environ 15 à 20 minutes ;
- le style des publications manque parfois de cohérence ;
- elle veut gagner du temps ;
- elle veut conserver une image urbaine, moderne et premium.

INFORMATIONS DISPONIBLES

Pour chaque paire, elle dispose généralement de :

- nom du modèle ;
- prix ;
- tailles disponibles ;
- date de sortie ;
- photos.

OBJECTIF COMMERCIAL

Le contenu doit principalement aider à faire venir les clients en boutique.

GARDE-FOUS

- aucune promotion ne doit être inventée ;
- aucune caractéristique produit ne doit être inventée ;
- la cliente relit le contenu avant publication.

==================================================
IMPORTANT : UTILISE LA CONVERSATION
==================================================

Tu reçois aussi la conversation réelle entre l'apprenant et la cliente.

Tu dois en tenir compte.

Si l'apprenant a déjà demandé une information et que la cliente l'a donnée, NE DIS PAS qu'il manque cette information.

Par exemple :

si la cliente a déjà indiqué sa cible,
tu ne dois pas écrire :
"Il faudrait mieux connaître la cible."

Si l'information a été découverte pendant l'entretien, considère-la comme acquise.

Ne juge pas seulement le texte final.
Évalue aussi la qualité du raisonnement visible dans la conversation.

==================================================
CE QUE TU DOIS ÉVALUER
==================================================

1. COMPRÉHENSION DU BESOIN

L'apprenant a-t-il compris le vrai problème métier ?

Exemples :
- trop de temps passé ;
- manque de cohérence ;
- tâche répétitive ;
- besoin de produire régulièrement.

2. PERTINENCE DE LA SOLUTION

La solution proposée répond-elle réellement au problème ?

Une solution simple et adaptée doit être mieux notée qu'une solution très complexe inutilement.

3. VALEUR POUR LE CLIENT

La proposition explique-t-elle ce que la cliente gagne ?

Exemples :
- gain de temps ;
- cohérence ;
- rapidité ;
- facilité d'utilisation ;
- production plus régulière.

4. CONTRÔLE ET FIABILITÉ

La proposition prévoit-elle :
- de ne pas inventer de données ;
- une validation humaine ;
- une gestion des informations manquantes ;
- un minimum de contrôle avant publication ?

5. SIMPLICITÉ

La solution est-elle proportionnée au besoin ?

Évite de favoriser :
- des agents complexes ;
- des architectures lourdes ;
- des technologies inutiles.

Une bonne solution peut être très simple.

==================================================
CE QU'IL NE FAUT PAS FAIRE
==================================================

Ne récompense pas automatiquement :
- un texte long ;
- du vocabulaire technique ;
- des mots comme "IA", "API", "agent", "automation" ;
- des technologies non nécessaires.

Ne pénalise pas une proposition simplement parce qu'elle est courte.

Ne demande pas des éléments qui apparaissent déjà clairement dans la conversation.

Ne donne pas de conseils génériques du type :
"Soyez plus précis."

Tes retours doivent être liés au cas concret.

==================================================
FORMAT DE SORTIE
==================================================

Réponds UNIQUEMENT en JSON valide.

Aucun markdown.
Aucun texte avant ou après.

Structure exacte :

{
  "global_score": 0,
  "level": "",

  "need_understanding": 0,
  "solution_relevance": 0,
  "client_value": 0,
  "control_and_safety": 0,
  "simplicity": 0,

  "diagnosis": "",

  "strengths": [
    ""
  ],

  "weaknesses": [
    ""
  ],

  "next_version": [
    ""
  ]
}

==================================================
RÈGLES DES CHAMPS
==================================================

Tous les scores :
entiers entre 0 et 100.

level :
utilise exactement une valeur parmi :

"À retravailler"
"Bonne base"
"Solide"
"Très solide"

diagnosis :
2 ou 3 phrases maximum.
Explique globalement la qualité de la proposition.

strengths :
maximum 3 éléments.
Concrets et directement liés à ce qu'a écrit l'apprenant.

weaknesses :
maximum 3 éléments.
Uniquement des éléments réellement absents ou faibles.

next_version :
maximum 3 actions très concrètes.

Exemple de bonne prochaine version :

[
  "Précise quelles informations la cliente devra entrer pour chaque paire.",
  "Explique ce que le système produit exactement.",
  "Ajoute une étape de validation avant publication."
]

Évalue avec exigence mais sans chercher une réponse modèle unique.
`;

    const userPrompt = `
==================================================
CONVERSATION
==================================================

${conversation || "Aucune conversation fournie."}

==================================================
PROPOSITION DE L'APPRENANT
==================================================

${solution}

Analyse maintenant la proposition en tenant compte de toute la conversation.
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
          format: "json",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],

          options: {
            temperature: 0.15,
            num_predict: 700,
          },
        }),
      });

    if (!ollamaResponse.ok) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama évaluation :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'évaluer la proposition.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await ollamaResponse.json();

    const rawContent =
      data?.message?.content?.trim();

    if (!rawContent) {
      return NextResponse.json(
        {
          error:
            "Le coach n'a retourné aucune analyse.",
        },
        {
          status: 500,
        }
      );
    }

    let parsed: EvaluationPayload;

    try {
      parsed =
        JSON.parse(rawContent);
    } catch (error) {
      console.error(
        "JSON invalide retourné par Ollama :",
        rawContent,
        error
      );

      return NextResponse.json(
        {
          error:
            "Le coach a retourné une analyse invalide. Réessayez.",
        },
        {
          status: 500,
        }
      );
    }

    const scores = {
      need_understanding:
        clampScore(
          parsed.need_understanding
        ),

      solution_relevance:
        clampScore(
          parsed.solution_relevance
        ),

      client_value:
        clampScore(
          parsed.client_value
        ),

      control_and_safety:
        clampScore(
          parsed.control_and_safety
        ),

      simplicity:
        clampScore(
          parsed.simplicity
        ),
    };

    const calculatedGlobalScore =
      Math.round(
        scores.need_understanding *
          0.25 +
          scores.solution_relevance *
            0.3 +
          scores.client_value *
            0.2 +
          scores.control_and_safety *
            0.15 +
          scores.simplicity *
            0.1
      );

    let level =
      parsed.level;

    if (
      ![
        "À retravailler",
        "Bonne base",
        "Solide",
        "Très solide",
      ].includes(level || "")
    ) {
      if (
        calculatedGlobalScore >=
        85
      ) {
        level =
          "Très solide";
      } else if (
        calculatedGlobalScore >=
        70
      ) {
        level = "Solide";
      } else if (
        calculatedGlobalScore >=
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
      globalScore:
        calculatedGlobalScore,

      level,

      scores,

      diagnosis:
        typeof parsed.diagnosis ===
        "string"
          ? parsed.diagnosis
          : "",

      strengths:
        Array.isArray(
          parsed.strengths
        )
          ? parsed.strengths
              .filter(
                (item) =>
                  typeof item ===
                    "string" &&
                  item.trim()
              )
              .slice(0, 3)
          : [],

      weaknesses:
        Array.isArray(
          parsed.weaknesses
        )
          ? parsed.weaknesses
              .filter(
                (item) =>
                  typeof item ===
                    "string" &&
                  item.trim()
              )
              .slice(0, 3)
          : [],

      nextVersion:
        Array.isArray(
          parsed.next_version
        )
          ? parsed.next_version
              .filter(
                (item) =>
                  typeof item ===
                    "string" &&
                  item.trim()
              )
              .slice(0, 3)
          : [],
    });
  } catch (error) {
    console.error(
      "Erreur évaluation solution :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter le coach local. Vérifiez qu'Ollama fonctionne.",
      },
      {
        status: 500,
      }
    );
  }
}
