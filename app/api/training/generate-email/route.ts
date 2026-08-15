import { NextResponse } from "next/server";

// ======================================================
// OLLAMA
// ======================================================

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/generate";

const OLLAMA_MODEL =
  "llama3.2:3b";

// ======================================================
// TYPES
// ======================================================

type RequestBody = {
  senderName?: string;
  from?: string;
  subject?: string;
  body?: string;
  facts?: string;
};

type GeneratedEmail = {
  summary: string;
  draft: string;
  checks: string[];
  riskLevel:
    | "Faible"
    | "Moyen"
    | "Élevé";
  requiresHumanValidation: boolean;
  confidence: number;
};

// ======================================================
// JSON
// ======================================================

function cleanJson(
  text: string
) {
  return text
    .trim()
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/,
      ""
    )
    .trim();
}

// ======================================================
// POST
// ======================================================

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const senderName =
      body.senderName?.trim() ??
      "";

    const from =
      body.from?.trim() ??
      "";

    const subject =
      body.subject?.trim() ??
      "";

    const emailBody =
      body.body?.trim() ??
      "";

    const facts =
      body.facts?.trim() ??
      "";

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !subject ||
      !emailBody ||
      !facts
    ) {
      return NextResponse.json(
        {
          error:
            "Email et faits obligatoires.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // PROMPT
    // ==================================================

    const prompt = `
Tu es un assistant professionnel chargé de PRÉPARER des brouillons d'emails.

Tu ne peux jamais envoyer réellement un email.

RÈGLES ABSOLUES :

1. Utilise uniquement les informations contenues dans l'email original et dans les faits validés.
2. N'invente jamais un remboursement, une décision, une date, un rendez-vous confirmé ou une action effectuée.
3. Si une information manque, formule la réponse avec prudence.
4. Ne dis jamais qu'une action est terminée si elle ne l'est pas.
5. Le brouillon doit être clair, professionnel et naturel.
6. Il doit rester relativement court.
7. Identifie les points qui doivent être vérifiés par une personne avant envoi.
8. Réponds uniquement avec du JSON valide.
9. Aucun texte avant ou après le JSON.

EMAIL :

Expéditeur :
${senderName || "non fourni"}

Adresse :
${from || "non fournie"}

Sujet :
${subject}

Contenu :
${emailBody}

FAITS VALIDÉS PAR L'UTILISATEUR :

${facts}

Retourne exactement :

{
  "summary": "résumé très court de la demande",
  "draft": "brouillon complet de réponse",
  "checks": [
    "élément à vérifier avant envoi"
  ],
  "riskLevel": "Faible | Moyen | Élevé",
  "requiresHumanValidation": true,
  "confidence": 0
}

RÈGLE POUR requiresHumanValidation :

- true si la réponse concerne argent, paiement, remboursement, engagement, rendez-vous, promesse, données sensibles ou décision importante.
- false uniquement pour une réponse réellement simple et sans conséquence importante.

confidence doit être un entier entre 0 et 100.
`;

    // ==================================================
    // APPEL OLLAMA
    // ==================================================

    let ollamaResponse:
      Response;

    try {
      ollamaResponse =
        await fetch(
          OLLAMA_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              model:
                OLLAMA_MODEL,

              prompt,

              stream: false,

              format: "json",

              options: {
                temperature: 0.2,
              },
            }),

            cache: "no-store",
          }
        );
    } catch (error) {
      console.error(
        "Connexion Ollama impossible :",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de contacter Ollama. Vérifiez qu'Ollama est lancé.",
        },
        {
          status: 503,
        }
      );
    }

    // ==================================================
    // ERREUR OLLAMA
    // ==================================================

    if (
      !ollamaResponse.ok
    ) {
      const details =
        await ollamaResponse.text();

      console.error(
        "Erreur Ollama :",
        details
      );

      return NextResponse.json(
        {
          error:
            "Ollama n'a pas réussi à générer le brouillon.",
        },
        {
          status: 502,
        }
      );
    }

    const data =
      await ollamaResponse.json();

    const raw =
      typeof data.response ===
      "string"
        ? data.response
        : "";

    if (!raw) {
      return NextResponse.json(
        {
          error:
            "Réponse Ollama vide.",
        },
        {
          status: 502,
        }
      );
    }

    // ==================================================
    // PARSE
    // ==================================================

    let parsed:
      Record<
        string,
        unknown
      >;

    try {
      parsed =
        JSON.parse(
          cleanJson(raw)
        );
    } catch {
      console.error(
        "JSON Ollama invalide :",
        raw
      );

      return NextResponse.json(
        {
          error:
            "La réponse générée par Ollama n'était pas exploitable.",
        },
        {
          status: 502,
        }
      );
    }

    // ==================================================
    // CONFIDENCE
    // ==================================================

    const rawConfidence =
      Number(
        parsed.confidence
      );

    const confidence =
      Number.isFinite(
        rawConfidence
      )
        ? Math.max(
            0,
            Math.min(
              100,
              Math.round(
                rawConfidence
              )
            )
          )
        : 0;

    // ==================================================
    // RISK
    // ==================================================

    const riskLevel =
      parsed.riskLevel ===
        "Élevé" ||
      parsed.riskLevel ===
        "Moyen" ||
      parsed.riskLevel ===
        "Faible"
        ? parsed.riskLevel
        : "Moyen";

    // ==================================================
    // CHECKS
    // ==================================================

    const checks =
      Array.isArray(
        parsed.checks
      )
        ? parsed.checks
            .filter(
              (
                value
              ): value is string =>
                typeof value ===
                "string"
            )
            .map(
              (value) =>
                value.trim()
            )
            .filter(Boolean)
            .slice(
              0,
              6
            )
        : [];

    // ==================================================
    // RESULT
    // ==================================================

    const result:
      GeneratedEmail = {
      summary:
        typeof parsed.summary ===
        "string"
          ? parsed.summary.trim()
          : "",

      draft:
        typeof parsed.draft ===
        "string"
          ? parsed.draft.trim()
          : "",

      checks,

      riskLevel,

      requiresHumanValidation:
        parsed.requiresHumanValidation ===
        true,

      confidence,
    };

    if (
      !result.draft
    ) {
      return NextResponse.json(
        {
          error:
            "Ollama n'a pas produit de brouillon exploitable.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      success: true,

      model:
        OLLAMA_MODEL,

      result,
    });
  } catch (error) {
    console.error(
      "Erreur generate-email :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de générer le brouillon.",
      },
      {
        status: 500,
      }
    );
  }
}