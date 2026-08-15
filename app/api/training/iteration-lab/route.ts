import { NextResponse } from "next/server";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/chat";

const MODEL =
  "llama3.2:3b";

type RequestBody = {
  prompt?: string;
};

type EvaluationJson = {
  factual_accuracy?: number;
  useful_information?: number;
  target_fit?: number;
  cta_quality?: number;
  clarity?: number;

  strengths?: string[];
  problems?: string[];
};

const EVENT_BRIEF = `
CONTEXTE RÉEL

Une association organise une course solidaire.

INFORMATIONS DISPONIBLES

Nom :
Course Solidaire Horizon

Date :
Samedi 12 septembre

Horaires bénévoles :
8h00 à 14h00

Lieu :
Parc des Rives

Besoin :
25 bénévoles

Missions possibles :
- accueil des participants ;
- ravitaillement ;
- orientation ;
- aide à l'installation.

Public recherché :
- étudiants ;
- habitants du quartier ;
- personnes souhaitant participer à une action solidaire.

Avantage :
le déjeuner est offert aux bénévoles.

Objectif :
obtenir des inscriptions de bénévoles.

Lien d'inscription :
association-horizon.fr/benevoles

IMPORTANT

Aucune rémunération n'est prévue.

Le déjeuner offert EST un avantage.

Il est donc FAUX de dire :
"aucun avantage n'est prévu".

Aucun autre avantage n'est annoncé.

Aucune expérience particulière n'est obligatoire.
`;

function normalizeScore(
  value: unknown
) {
  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return 0;
  }

  /*
    Certains petits modèles répondent parfois
    spontanément sur 10 malgré la consigne /100.

    Ex :
    8 au lieu de 80.

    On normalise donc automatiquement
    les valeurs comprises entre 0 et 10.
  */

  const normalized =
    number > 0 &&
    number <= 10
      ? number * 10
      : number;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        normalized
      )
    )
  );
}

function cleanArray(
  value: unknown,
  max: number
) {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item ===
          "string" &&
        item.trim()
    )
    .slice(
      0,
      max
    );
}

function getVerdict(
  score: number
) {
  if (
    score >= 85
  ) {
    return "Très bon";
  }

  if (
    score >= 70
  ) {
    return "Bon";
  }

  if (
    score >= 50
  ) {
    return "Correct";
  }

  return "Faible";
}

export async function POST(
  request: Request
) {
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

    if (
      prompt.length >
      5000
    ) {
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

    /*
    ==========================================================
    1. GÉNÉRATION
    ==========================================================
    */

    const generationResponse =
      await fetch(
        OLLAMA_URL,
        {
          method:
            "POST",

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

                  content: `
Tu exécutes les instructions fournies
par un utilisateur.

Tu disposes d'un brief contenant
les seules informations autorisées.

IMPORTANT

Le brief est une SOURCE,
pas une consigne pour utiliser
automatiquement toutes les informations.

Tu dois principalement suivre
le prompt de l'utilisateur.

Si le prompt est vague,
le résultat peut naturellement
être incomplet.

C'est volontaire :
nous voulons observer les conséquences
d'un prompt insuffisamment précis.

En revanche :

- n'invente aucune information ;
- ne transforme pas une information ;
- ne crée aucun avantage supplémentaire ;
- ne crée aucune rémunération ;
- ne crée aucune date ;
- ne crée aucune mission ;
- ne crée aucune adresse.

Attention :

"Le déjeuner est offert"
est bien un avantage.

Tu ne dois donc jamais écrire
qu'aucun avantage n'est prévu
si tu mentionnes le déjeuner offert.

Ne commente pas le prompt.
Ne l'évalue pas.

Produis uniquement le contenu demandé.
`,
                },

                {
                  role:
                    "user",

                  content: `
PROMPT DE L'UTILISATEUR

${prompt}

========================================

BRIEF DISPONIBLE

${EVENT_BRIEF}

========================================

Exécute maintenant le prompt.
`,
                },
              ],

              options: {
                temperature:
                  0.45,

                num_predict:
                  500,
              },
            }),
        }
      );

    if (
      !generationResponse.ok
    ) {
      const errorText =
        await generationResponse.text();

      console.error(
        "Erreur génération iteration-lab :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Impossible de générer le résultat.",
        },
        {
          status: 500,
        }
      );
    }

    const generationData =
      await generationResponse.json();

    const output =
      generationData
        ?.message
        ?.content
        ?.trim();

    if (!output) {
      return NextResponse.json(
        {
          error:
            "Le modèle n'a généré aucun résultat.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    ==========================================================
    2. ÉVALUATION
    ==========================================================
    */

    const evaluationSystemPrompt = `
Tu es un contrôleur qualité
d'un contenu destiné à recruter
des bénévoles.

Tu dois analyser objectivement
le résultat produit.

==================================================
BRIEF DE RÉFÉRENCE
==================================================

${EVENT_BRIEF}

==================================================
ÉCHELLE DE NOTATION
==================================================

IMPORTANT :

Chaque score doit être donné
SUR 100.

Exemples :

très mauvais :
10

médiocre :
30

moyen :
50

bon :
75

excellent :
95

N'UTILISE JAMAIS UNE ÉCHELLE SUR 5
OU SUR 10.

==================================================
CRITÈRES
==================================================

1. EXACTITUDE FACTUELLE

Le texte respecte-t-il strictement
les informations fournies ?

Une contradiction compte comme
une erreur factuelle.

Exemple :

"Le déjeuner est offert"
puis
"aucun avantage n'est prévu"

est une contradiction.

Cela doit fortement réduire
le score d'exactitude.

2. INFORMATIONS UTILES

Le texte contient-il
les éléments réellement importants ?

Par exemple :

- nom ;
- date ;
- horaires ;
- lieu ;
- besoin de bénévoles ;
- missions ;
- public ;
- déjeuner offert ;
- lien d'inscription.

IMPORTANT :

Le résultat n'est pas obligé
de contenir absolument tout.

Mais les informations nécessaires
à l'action doivent être présentes.

3. ADAPTATION À LA CIBLE

Le message parle-t-il correctement
aux personnes susceptibles
de devenir bénévoles ?

4. APPEL À L'ACTION

L'inscription est-elle claire ?

Le lien doit être utilisé
si cela est pertinent.

5. CLARTÉ

Le texte est-il :

- lisible ;
- naturel ;
- correctement structuré ;
- directement exploitable ?

==================================================
IMPORTANT
==================================================

Ne juge pas uniquement
la quantité d'informations.

Un texte long n'est pas forcément bon.

Un texte avec tous les faits
mais contradictoire
ne doit pas obtenir un bon score.

Un texte qui dit :

"Aucune rémunération n'est prévue,
pas même d'avantage"

alors qu'un déjeuner est offert
contient une erreur importante.

==================================================
FORMAT
==================================================

Réponds UNIQUEMENT
en JSON valide.

Structure exacte :

{
  "factual_accuracy": 0,
  "useful_information": 0,
  "target_fit": 0,
  "cta_quality": 0,
  "clarity": 0,

  "strengths": [
    ""
  ],

  "problems": [
    ""
  ]
}

Tous les scores doivent être
des entiers entre 0 et 100.

strengths :
maximum 3 éléments.

problems :
maximum 4 éléments.

Ne donne PAS :

- global_score ;
- verdict.

Ils seront calculés automatiquement
par l'application.

Aucun markdown.
`;

    const evaluationResponse =
      await fetch(
        OLLAMA_URL,
        {
          method:
            "POST",

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
                    evaluationSystemPrompt,
                },

                {
                  role:
                    "user",

                  content: `
PROMPT UTILISÉ

${prompt}

========================================

RÉSULTAT PRODUIT

${output}

========================================

Évalue maintenant ce résultat.

RAPPEL :

les notes doivent être
sur 100 et non sur 10.
`,
                },
              ],

              options: {
                temperature:
                  0,

                num_predict:
                  500,
              },
            }),
        }
      );

    if (
      !evaluationResponse.ok
    ) {
      const errorText =
        await evaluationResponse.text();

      console.error(
        "Erreur évaluation iteration-lab :",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Le résultat a été généré mais son évaluation a échoué.",
        },
        {
          status: 500,
        }
      );
    }

    const evaluationData =
      await evaluationResponse.json();

    const rawEvaluation =
      evaluationData
        ?.message
        ?.content
        ?.trim();

    if (
      !rawEvaluation
    ) {
      return NextResponse.json(
        {
          error:
            "Aucune évaluation n'a été retournée.",
        },
        {
          status: 500,
        }
      );
    }

    let parsed: EvaluationJson;

    try {
      parsed =
        JSON.parse(
          rawEvaluation
        );
    } catch (error) {
      console.error(
        "JSON invalide iteration-lab :",
        rawEvaluation,
        error
      );

      return NextResponse.json(
        {
          error:
            "L'évaluation retournée est invalide.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    ==========================================================
    3. NORMALISATION DES SCORES
    ==========================================================
    */

    const scores = {
      factualAccuracy:
        normalizeScore(
          parsed.factual_accuracy
        ),

      usefulInformation:
        normalizeScore(
          parsed.useful_information
        ),

      targetFit:
        normalizeScore(
          parsed.target_fit
        ),

      ctaQuality:
        normalizeScore(
          parsed.cta_quality
        ),

      clarity:
        normalizeScore(
          parsed.clarity
        ),
    };

    /*
    ==========================================================
    4. CALCUL DU SCORE GLOBAL
    ==========================================================
    */

    let globalScore =
      Math.round(
        scores.factualAccuracy *
          0.3 +
          scores.usefulInformation *
            0.25 +
          scores.targetFit *
            0.15 +
          scores.ctaQuality *
            0.15 +
          scores.clarity *
            0.15
      );

    /*
    ==========================================================
    5. DÉTECTION SIMPLE DE CONTRADICTIONS
    ==========================================================

    On ne laisse pas uniquement
    le LLM contrôler une erreur
    aussi évidente.
    */

    const normalizedOutput =
      output.toLowerCase();

    const mentionsFreeLunch =
      normalizedOutput.includes(
        "déjeuner"
      ) &&
      (
        normalizedOutput.includes(
          "offert"
        ) ||
        normalizedOutput.includes(
          "gratuit"
        )
      );

    const saysNoAdvantage =
      normalizedOutput.includes(
        "aucun avantage"
      ) ||
      normalizedOutput.includes(
        "pas même d'avantage"
      ) ||
      normalizedOutput.includes(
        "pas d'avantage"
      );

    const automaticProblems: string[] =
      [];

    if (
      mentionsFreeLunch &&
      saysNoAdvantage
    ) {
      automaticProblems.push(
        "La sortie se contredit : elle annonce un déjeuner offert puis affirme qu'aucun avantage n'est prévu."
      );

      scores.factualAccuracy =
        Math.min(
          scores.factualAccuracy,
          35
        );

      globalScore =
        Math.round(
          scores.factualAccuracy *
            0.3 +
            scores.usefulInformation *
              0.25 +
            scores.targetFit *
              0.15 +
            scores.ctaQuality *
              0.15 +
            scores.clarity *
              0.15
        );
    }

    /*
    ==========================================================
    6. VERDICT CALCULÉ PAR LE CODE
    ==========================================================
    */

    const verdict =
      getVerdict(
        globalScore
      );

    /*
    ==========================================================
    7. RÉPONSE
    ==========================================================
    */

    return NextResponse.json({
      output,

      evaluation: {
        globalScore,
        verdict,
        scores,

        strengths:
          cleanArray(
            parsed.strengths,
            3
          ),

        problems: [
          ...automaticProblems,

          ...cleanArray(
            parsed.problems,
            4
          ),
        ].slice(
          0,
          4
        ),
      },
    });
  } catch (error) {
    console.error(
      "Erreur iteration-lab :",
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