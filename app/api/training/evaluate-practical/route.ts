import { NextResponse } from "next/server";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/chat";

const MODEL = "llama3.2:3b";

// ======================================================
// TYPES
// ======================================================

type Criterion = {
  name: string;
  maxScore: number;
  description: string;
};

type RequestBody = {
  lessonId?: string;
  title?: string;
  context?: string;
  mission?: string;
  answers?: Record<string, string>;
  criteria?: Criterion[];
};

type ParsedCriterion = {
  name?: string;
  score?: number;
  max_score?: number;
  feedback?: string;
};

type ParsedEvaluation = {
  score?: number;
  verdict?: string;
  summary?: string;

  criteria?: ParsedCriterion[];

  strengths?: string[];
  improvements?: string[];

  advice?: string;
};

// ======================================================
// HELPERS
// ======================================================

function clampScore(
  value: unknown,
  max = 100
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
      max,
      Math.round(number)
    )
  );
}

function cleanArray(
  value: unknown,
  max: number
): string[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item ===
          "string" &&
        item.trim().length >
          0
    )
    .map(
      (item) =>
        String(item).trim()
    )
    .slice(0, max);
}

// ======================================================
// POST
// ======================================================

export async function POST(
  request: Request
) {
  try {
    // ==================================================
    // BODY
    // ==================================================

    const body =
      (await request.json()) as RequestBody;

    const lessonId =
      body.lessonId?.trim() ??
      "";

    const title =
      body.title?.trim();

    const context =
      body.context?.trim();

    const mission =
      body.mission?.trim();

    const answers =
      body.answers;

    const criteria =
      body.criteria ?? [];

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !title ||
      !mission ||
      !answers ||
      criteria.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Données d'évaluation incomplètes.",
        },
        {
          status: 400,
        }
      );
    }

    const hasAnswers =
      Object.values(
        answers
      ).some(
        (value) =>
          typeof value ===
            "string" &&
          value.trim().length >
            0
      );

    if (!hasAnswers) {
      return NextResponse.json(
        {
          error:
            "Le livrable est vide.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // CHECK CRITERIA
    // ==================================================

    const invalidCriterion =
      criteria.some(
        (criterion) =>
          !criterion.name ||
          !criterion.description ||
          !Number.isFinite(
            criterion.maxScore
          ) ||
          criterion.maxScore <=
            0
      );

    if (
      invalidCriterion
    ) {
      return NextResponse.json(
        {
          error:
            "La grille d'évaluation contient un critère invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const totalMax =
      criteria.reduce(
        (
          total,
          criterion
        ) =>
          total +
          criterion.maxScore,
        0
      );

    if (
      totalMax !== 100
    ) {
      return NextResponse.json(
        {
          error:
            "La grille d'évaluation doit totaliser exactement 100 points.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // SYSTEM PROMPT
    // ==================================================

    const systemPrompt = `
Tu es un évaluateur pédagogique professionnel.

Tu corriges le livrable d'un apprenant dans une formation
à l'utilisation professionnelle de l'intelligence artificielle.

Ton rôle est de mesurer la QUALITÉ du travail.

Le fait que toutes les sections soient remplies ne signifie
absolument pas que le travail mérite 100/100.

==================================================
PRINCIPES DE NOTATION
==================================================

Tu dois être exigeant, cohérent et juste.

Tu évalues UNIQUEMENT ce que l'apprenant a réellement écrit.

Tu ne dois jamais :

- inventer une compétence absente ;
- supposer une information qui n'est pas écrite ;
- compléter mentalement une réponse incomplète ;
- donner des points uniquement parce qu'une section est remplie ;
- récompenser la longueur si le contenu est mauvais ;
- donner automatiquement une bonne note.

Une réponse peut être remplie mais recevoir très peu de points.

Une réponse vague, générique ou superficielle doit perdre
des points.

Une réponse hors sujet doit recevoir très peu de points.

Une réponse incorrecte doit perdre des points.

Une réponse pertinente mais incomplète peut recevoir
une partie des points.

Une réponse précise, logique, applicable et professionnelle
peut recevoir une note élevée.

==================================================
ÉLÉMENTS À OBSERVER
==================================================

Selon la grille fournie, vérifie notamment :

- la compréhension du problème ;
- la qualité du raisonnement ;
- la logique de la méthode ;
- la précision des réponses ;
- la prise en compte des contraintes ;
- la distinction entre faits, hypothèses et informations manquantes ;
- la présence de contrôles pertinents ;
- la qualité professionnelle du résultat ;
- la capacité du livrable à être réellement utilisé.

==================================================
NOTATION
==================================================

Chaque critère possède son propre nombre maximal de points.

Pour chaque critère :

0 à 25 % du maximum :
travail absent, incorrect ou très insuffisant.

26 à 49 % :
compréhension partielle, beaucoup d'éléments manquent.

50 à 69 % :
travail acceptable mais incomplet ou trop générique.

70 à 84 % :
bon travail, pertinent et globalement exploitable.

85 à 94 % :
très bon travail, précis et professionnel.

95 à 100 % :
travail exceptionnel, complet, précis et difficile à améliorer.

N'utilise donc pas 95-100 facilement.

==================================================
SORTIE
==================================================

Réponds UNIQUEMENT en JSON valide.

Aucun markdown.

Aucun texte avant ou après le JSON.

Utilise exactement cette structure :

{
  "score": 0,
  "verdict": "",
  "summary": "",
  "criteria": [
    {
      "name": "",
      "score": 0,
      "max_score": 0,
      "feedback": ""
    }
  ],
  "strengths": [],
  "improvements": [],
  "advice": ""
}

==================================================
RÈGLES JSON
==================================================

score :
entier entre 0 et 100.

verdict :
exactement une des valeurs suivantes :

"Insuffisant"
"À améliorer"
"Bon"
"Très bon"
"Excellent"

summary :
maximum 3 phrases.

criteria :
retourne exactement un élément pour chaque critère fourni,
dans exactement le même ordre.

name :
reprends exactement le nom du critère fourni.

score :
entier compris entre 0 et le maximum du critère.

max_score :
reprends exactement le maxScore du critère.

feedback :
explique brièvement pourquoi cette note est attribuée.

strengths :
maximum 4 points forts réellement observés.
Si aucun point fort notable n'existe, retourne [].

improvements :
maximum 4 améliorations concrètes.

advice :
maximum 3 phrases.
Le conseil doit expliquer à l'apprenant comment améliorer
concrètement son prochain essai.

IMPORTANT :

La somme des scores des critères doit correspondre
au score global.
`;

    // ==================================================
    // USER PROMPT
    // ==================================================

    const userPrompt = `
==================================================
IDENTIFIANT DE LA LEÇON
==================================================

${lessonId || "Non renseigné"}

==================================================
EXERCICE
==================================================

Titre :

${title}

==================================================
BRIEF
==================================================

${context || "Aucun contexte supplémentaire fourni."}

==================================================
MISSION
==================================================

${mission}

==================================================
RÉPONSES DE L'APPRENANT
==================================================

${JSON.stringify(
  answers,
  null,
  2
)}

==================================================
GRILLE D'ÉVALUATION
==================================================

${JSON.stringify(
  criteria,
  null,
  2
)}

==================================================
INSTRUCTION FINALE
==================================================

Évalue maintenant le travail.

Ne juge pas si les champs sont remplis :
ils le sont déjà.

Juge uniquement la qualité des réponses.

Respecte strictement les maximums de la grille.

Retourne uniquement le JSON demandé.
`;

    // ==================================================
    // CALL OLLAMA
    // ==================================================

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

              format: "json",

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
                  0.1,

                num_predict:
                  1400,
              },
            }),
        }
      );

    // ==================================================
    // OLLAMA ERROR
    // ==================================================

    if (
      !ollamaResponse.ok
    ) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama evaluate-practical :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'évaluer le livrable avec le correcteur local.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // READ OLLAMA RESPONSE
    // ==================================================

    const data =
      await ollamaResponse.json();

    const rawContent =
      data?.message?.content?.trim();

    if (
      !rawContent
    ) {
      return NextResponse.json(
        {
          error:
            "Le correcteur local n'a retourné aucune évaluation.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // PARSE JSON
    // ==================================================

    let parsed:
      ParsedEvaluation;

    try {
      parsed =
        JSON.parse(
          rawContent
        );
    } catch (error) {
      console.error(
        "JSON Ollama invalide :",
        rawContent
      );

      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            "Le correcteur local a retourné une évaluation invalide.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // NORMALIZE CRITERIA
    //
    // On ne fait PAS confiance aux maxScore renvoyés
    // par le modèle.
    //
    // Les vrais maximums viennent de notre application.
    // ==================================================

    const returnedCriteria =
      Array.isArray(
        parsed.criteria
      )
        ? parsed.criteria
        : [];

    const normalizedCriteria =
      criteria.map(
        (
          expectedCriterion,
          index
        ) => {
          const returned =
            returnedCriteria[
              index
            ];

          const criterionScore =
            clampScore(
              returned?.score,
              expectedCriterion.maxScore
            );

          const feedback =
            typeof returned?.feedback ===
              "string" &&
            returned.feedback.trim()
              .length > 0
              ? returned.feedback.trim()
              : "Aucun commentaire détaillé n'a été retourné.";

          return {
            name:
              expectedCriterion.name,

            score:
              criterionScore,

            maxScore:
              expectedCriterion.maxScore,

            feedback,
          };
        }
      );

    // ==================================================
    // REAL GLOBAL SCORE
    //
    // On recalcule nous-mêmes le score.
    // On ignore le score global proposé par Ollama.
    // ==================================================

    const globalScore =
      normalizedCriteria.reduce(
        (
          total,
          criterion
        ) =>
          total +
          criterion.score,
        0
      );

    // ==================================================
    // VERDICT
    //
    // Le verdict est calculé par notre code,
    // pas par Ollama.
    // ==================================================

    let verdict:
      | "Insuffisant"
      | "À améliorer"
      | "Bon"
      | "Très bon"
      | "Excellent";

    if (
      globalScore >= 90
    ) {
      verdict =
        "Excellent";
    } else if (
      globalScore >= 80
    ) {
      verdict =
        "Très bon";
    } else if (
      globalScore >= 70
    ) {
      verdict =
        "Bon";
    } else if (
      globalScore >= 50
    ) {
      verdict =
        "À améliorer";
    } else {
      verdict =
        "Insuffisant";
    }

    // ==================================================
    // CLEAN TEXT
    // ==================================================

    const summary =
      typeof parsed.summary ===
        "string"
        ? parsed.summary.trim()
        : "";

    const advice =
      typeof parsed.advice ===
        "string"
        ? parsed.advice.trim()
        : "";

    const strengths =
      cleanArray(
        parsed.strengths,
        4
      );

    const improvements =
      cleanArray(
        parsed.improvements,
        4
      );

    // ==================================================
    // RETURN
    // ==================================================

    return NextResponse.json({
      score:
        globalScore,

      verdict,

      summary,

      criteria:
        normalizedCriteria,

      strengths,

      improvements,

      advice,
    });
  } catch (error) {
    console.error(
      "Erreur evaluate-practical :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de contacter le correcteur local.",
      },
      {
        status: 500,
      }
    );
  }
}