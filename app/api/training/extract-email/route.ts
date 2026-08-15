import { NextResponse } from "next/server";
import { requireTrainingAccess } from "@/lib/training/access";

// ======================================================
// CONFIGURATION OLLAMA
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
};

type ExtractedEmail = {
  senderName: string | null;
  email: string | null;
  category: string | null;
  request: string | null;
  amount: string | null;
  reference: string | null;
  date: string | null;
  deadline: string | null;
  people: string | null;
  missingInformation: string[];
  confidence: number;
};

// ======================================================
// NETTOYAGE JSON
// ======================================================

function cleanJson(
  text: string
) {
  let cleaned =
    text.trim();

  cleaned =
    cleaned.replace(
      /^```json\s*/i,
      ""
    );

  cleaned =
    cleaned.replace(
      /^```\s*/i,
      ""
    );

  cleaned =
    cleaned.replace(
      /\s*```$/,
      ""
    );

  return cleaned.trim();
}

// ======================================================
// NORMALISATION
// ======================================================

function normalizeString(
  value: unknown
): string | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const cleaned =
    value.trim();

  if (
    !cleaned ||
    cleaned.toLowerCase() ===
      "null" ||
    cleaned.toLowerCase() ===
      "non fourni" ||
    cleaned.toLowerCase() ===
      "non fournie" ||
    cleaned.toLowerCase() ===
      "inconnu" ||
    cleaned.toLowerCase() ===
      "inconnue"
  ) {
    return null;
  }

  return cleaned;
}

// ======================================================
// POST
// ======================================================

export async function POST(
  request: Request
) {
  const access = await requireTrainingAccess("fondamentaux");

  if (!access.authorized) {
    return access.response;
  }

  try {
    // ==================================================
    // BODY
    // ==================================================

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

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !subject ||
      !emailBody
    ) {
      return NextResponse.json(
        {
          error:
            "Sujet et contenu de l'email obligatoires.",
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
Tu es un assistant spécialisé dans l'extraction fiable d'informations depuis des emails professionnels.

Ta mission est d'extraire UNIQUEMENT les informations réellement présentes dans l'email.

RÈGLES ABSOLUES :

1. N'invente jamais une information.
2. Ne déduis pas une donnée qui n'est pas explicitement présente.
3. Si une information est absente, utilise null.
4. Une information incertaine doit être considérée comme absente.
5. Ne prétends jamais qu'une action a été effectuée.
6. Réponds uniquement en JSON valide.
7. Aucun texte avant ou après le JSON.

EMAIL À ANALYSER :

Expéditeur affiché :
${senderName || "non fourni"}

Adresse email :
${from || "non fournie"}

Sujet :
${subject}

Contenu :
${emailBody}

Retourne exactement cette structure :

{
  "senderName": "nom explicitement disponible ou null",
  "email": "adresse email explicitement disponible ou null",
  "category": "Facturation | Commercial | Support | Rendez-vous | Information | Autre",
  "request": "résumé très court de la demande principale ou null",
  "amount": "montant explicitement présent avec devise ou null",
  "reference": "numéro de commande, facture ou autre référence explicitement présente ou null",
  "date": "date explicitement présente ou null",
  "deadline": "échéance explicitement demandée ou null",
  "people": "nombre de personnes explicitement mentionné ou null",
  "missingInformation": [
    "liste uniquement des informations qui seraient réellement utiles pour traiter cette demande mais qui sont absentes"
  ],
  "confidence": 0
}

Pour "confidence", utilise un entier entre 0 et 100 représentant ta confiance dans l'extraction, pas dans la résolution du problème.
`;

    // ==================================================
    // APPEL OLLAMA
    // ==================================================

    let ollamaResponse: Response;

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
                temperature: 0,
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
            "Impossible de contacter Ollama. Vérifiez qu'Ollama est lancé sur le port 11434.",
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
            "Ollama n'a pas réussi à analyser l'email.",
        },
        {
          status: 502,
        }
      );
    }

    // ==================================================
    // RÉPONSE OLLAMA
    // ==================================================

    const ollamaData =
      await ollamaResponse.json();

    const rawResponse =
      typeof ollamaData.response ===
      "string"
        ? ollamaData.response
        : "";

    if (!rawResponse) {
      return NextResponse.json(
        {
          error:
            "Ollama a retourné une réponse vide.",
        },
        {
          status: 502,
        }
      );
    }

    // ==================================================
    // PARSE JSON
    // ==================================================

    let parsed:
      Record<
        string,
        unknown
      >;

    try {
      parsed =
        JSON.parse(
          cleanJson(
            rawResponse
          )
        );
    } catch {
      console.error(
        "JSON Ollama invalide :",
        rawResponse
      );

      return NextResponse.json(
        {
          error:
            "La réponse d'Ollama n'était pas exploitable.",
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
    // INFORMATIONS MANQUANTES
    // ==================================================

    const missingInformation =
      Array.isArray(
        parsed.missingInformation
      )
        ? parsed.missingInformation
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
    // RÉSULTAT NORMALISÉ
    // ==================================================

    const extracted:
      ExtractedEmail = {
      senderName:
        normalizeString(
          parsed.senderName
        ),

      email:
        normalizeString(
          parsed.email
        ),

      category:
        normalizeString(
          parsed.category
        ),

      request:
        normalizeString(
          parsed.request
        ),

      amount:
        normalizeString(
          parsed.amount
        ),

      reference:
        normalizeString(
          parsed.reference
        ),

      date:
        normalizeString(
          parsed.date
        ),

      deadline:
        normalizeString(
          parsed.deadline
        ),

      people:
        normalizeString(
          parsed.people
        ),

      missingInformation,

      confidence,
    };

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json({
      success: true,

      model:
        OLLAMA_MODEL,

      extraction:
        extracted,
    });
  } catch (error) {
    console.error(
      "Erreur extract-email :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible d'analyser cet email.",
      },
      {
        status: 500,
      }
    );
  }
}
