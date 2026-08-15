import { NextResponse } from "next/server";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2:3b";

type RequestBody = {
  prompt?: string;
  output?: string;
};

type ParsedEvaluation = {
  global_score?: number;
  factual_accuracy?: number;
  objective_fit?: number;
  tone_fit?: number;
  cta_quality?: number;
  concision?: number;

  verdict?: string;
  summary?: string;

  respected?: string[];
  problems?: string[];
  hallucinations?: string[];

  recommended_changes?: string[];
};

const PRODUCT_REFERENCE = `
DONNÉES PRODUIT AUTORISÉES

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

AUTRES INFORMATIONS

- aucune promotion n'est prévue ;
- aucune remise n'est annoncée ;
- aucune caractéristique technique supplémentaire n'est fournie ;
- aucune information sur le confort n'est fournie ;
- aucune information sur la matière n'est fournie ;
- aucune information sur les performances sportives n'est fournie ;
- le contenu est destiné à Instagram ;
- l'objectif commercial est d'inciter à venir découvrir la paire en boutique ;
- le positionnement souhaité est urbain, moderne et premium.
`;

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
  try {
    const body =
      (await request.json()) as RequestBody;

    const prompt =
      body.prompt?.trim();

    const output =
      body.output?.trim();

    if (!prompt || !output) {
      return NextResponse.json(
        {
          error:
            "Le prompt et la sortie sont obligatoires.",
        },
        {
          status: 400,
        }
      );
    }

    const systemPrompt = `
Tu es un contrôleur qualité spécialisé dans les systèmes IA.

Tu dois analyser une sortie générée par un LLM.

Tu n'évalues PAS la beauté du texte uniquement.

Tu vérifies surtout :

1. si les faits utilisés proviennent réellement des données disponibles ;
2. si aucune caractéristique, promotion ou information n'a été inventée ;
3. si la sortie respecte l'objectif demandé ;
4. si le ton correspond au positionnement ;
5. si l'appel à l'action est utile ;
6. si la réponse est suffisamment concise et exploitable.

==================================================
RÈGLE CRITIQUE : HALLUCINATIONS
==================================================

Une hallucination correspond à une information présentée comme vraie
alors qu'elle ne figure pas dans les données autorisées.

Exemples d'hallucinations :

- dire qu'une paire est "ultra confortable" si le confort n'est pas fourni ;
- dire qu'elle utilise une technologie particulière sans donnée ;
- annoncer une remise ;
- annoncer une quantité limitée ;
- inventer une matière ;
- inventer une performance ;
- inventer une collaboration ou une exclusivité.

En revanche, une formulation marketing générale comme :

"Découvrez la nouvelle Air Max"

n'est pas automatiquement une hallucination.

Sois strict sur les faits,
mais ne pénalise pas inutilement les formulations publicitaires normales.

==================================================
DONNÉES DE RÉFÉRENCE
==================================================

${PRODUCT_REFERENCE}

==================================================
FORMAT DE SORTIE
==================================================

Réponds UNIQUEMENT en JSON valide.

Structure exacte :

{
  "global_score": 0,

  "factual_accuracy": 0,
  "objective_fit": 0,
  "tone_fit": 0,
  "cta_quality": 0,
  "concision": 0,

  "verdict": "",
  "summary": "",

  "respected": [
    ""
  ],

  "problems": [
    ""
  ],

  "hallucinations": [
    ""
  ],

  "recommended_changes": [
    ""
  ]
}

RÈGLES

Tous les scores sont des entiers entre 0 et 100.

verdict doit être exactement une de ces valeurs :

"À corriger"
"Utilisable avec corrections"
"Bonne sortie"
"Prête à présenter"

summary :
maximum 3 phrases.

respected :
maximum 4 éléments.

problems :
maximum 4 éléments.

hallucinations :
liste uniquement les informations réellement inventées.
Si aucune hallucination n'est détectée, retourne [].

recommended_changes :
maximum 4 modifications concrètes.

Ne donne aucun markdown.
`;

    const userPrompt = `
PROMPT CRÉÉ PAR L'APPRENANT

${prompt}

==================================================

SORTIE GÉNÉRÉE

${output}

==================================================

Analyse cette sortie par rapport au prompt et aux données de référence.
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
            temperature: 0.1,
            num_predict: 700,
          },
        }),
      });

    if (!ollamaResponse.ok) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama analyse sortie :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'analyser la sortie.",
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
            "Le contrôleur n'a retourné aucune analyse.",
        },
        {
          status: 500,
        }
      );
    }

    let parsed: ParsedEvaluation;

    try {
      parsed =
        JSON.parse(rawContent);
    } catch (error) {
      console.error(
        "JSON invalide analyse sortie :",
        rawContent,
        error
      );

      return NextResponse.json(
        {
          error:
            "Le contrôleur a retourné une analyse invalide.",
        },
        {
          status: 500,
        }
      );
    }

    const scores = {
      factualAccuracy:
        clampScore(
          parsed.factual_accuracy
        ),

      objectiveFit:
        clampScore(
          parsed.objective_fit
        ),

      toneFit:
        clampScore(
          parsed.tone_fit
        ),

      ctaQuality:
        clampScore(
          parsed.cta_quality
        ),

      concision:
        clampScore(
          parsed.concision
        ),
    };

    const globalScore =
      Math.round(
        scores.factualAccuracy * 0.35 +
          scores.objectiveFit * 0.25 +
          scores.toneFit * 0.15 +
          scores.ctaQuality * 0.15 +
          scores.concision * 0.1
      );

    let verdict =
      typeof parsed.verdict === "string"
        ? parsed.verdict
        : "";

    if (
      ![
        "À corriger",
        "Utilisable avec corrections",
        "Bonne sortie",
        "Prête à présenter",
      ].includes(verdict)
    ) {
      if (globalScore >= 88) {
        verdict =
          "Prête à présenter";
      } else if (
        globalScore >= 75
      ) {
        verdict =
          "Bonne sortie";
      } else if (
        globalScore >= 55
      ) {
        verdict =
          "Utilisable avec corrections";
      } else {
        verdict =
          "À corriger";
      }
    }

    const cleanArray = (
      value: unknown,
      max: number
    ) => {
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
    };

    return NextResponse.json({
      globalScore,
      verdict,
      scores,

      summary:
        typeof parsed.summary ===
        "string"
          ? parsed.summary
          : "",

      respected:
        cleanArray(
          parsed.respected,
          4
        ),

      problems:
        cleanArray(
          parsed.problems,
          4
        ),

      hallucinations:
        cleanArray(
          parsed.hallucinations,
          4
        ),

      recommendedChanges:
        cleanArray(
          parsed.recommended_changes,
          4
        ),
    });
  } catch (error) {
    console.error(
      "Erreur evaluate-output :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter le contrôleur local.",
      },
      {
        status: 500,
      }
    );
  }
}