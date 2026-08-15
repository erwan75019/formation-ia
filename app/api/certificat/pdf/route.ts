import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFFont,
  PDFPage,
} from "pdf-lib";

import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import path from "path";

import { createClient } from "@/lib/supabase/server";

// ======================================================
// CONFIGURATION
// ======================================================

const finalProjectLessons = [
  "final-01-spec",
  "final-02-architecture",
  "final-03-data-security",
  "final-04-ai-features",
  "final-05-backend",
  "final-06-production",
  "final-07-project",
];

const COURSE_NAME =
  "Conception et développement de solutions d'intelligence artificielle";

// ======================================================
// NUMÉRO
// ======================================================

function createCertificateNumber() {
  const year =
    new Date().getFullYear();

  const code =
    randomUUID()
      .replaceAll("-", "")
      .slice(0, 8)
      .toUpperCase();

  return `AIA-${year}-FR-${code}`;
}

// ======================================================
// NOM
// ======================================================

function formatName(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part: string) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join(" ");
}

// ======================================================
// DATE
// ======================================================

function formatCertificateDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(date)
  );
}

// ======================================================
// CENTRAGE
// ======================================================

function centeredX(
  text: string,
  font: PDFFont,
  size: number,
  pageWidth: number
) {
  return (
    pageWidth / 2 -
    font.widthOfTextAtSize(
      text,
      size
    ) /
      2
  );
}

function drawCenteredText({
  page,
  text,
  font,
  size,
  y,
  color,
  pageWidth,
}: {
  page: PDFPage;
  text: string;
  font: PDFFont;
  size: number;
  y: number;
  color: ReturnType<typeof rgb>;
  pageWidth: number;
}) {
  page.drawText(
    text,
    {
      x: centeredX(
        text,
        font,
        size,
        pageWidth
      ),
      y,
      size,
      font,
      color,
    }
  );
}

function drawCenteredFooterText({
  page,
  text,
  centerX,
  y,
  size,
  font,
  color,
}: {
  page: PDFPage;
  text: string;
  centerX: number;
  y: number;
  size: number;
  font: PDFFont;
  color: ReturnType<typeof rgb>;
}) {
  const width =
    font.widthOfTextAtSize(
      text,
      size
    );

  page.drawText(
    text,
    {
      x:
        centerX -
        width / 2,
      y,
      size,
      font,
      color,
    }
  );
}

// ======================================================
// ROUTE
// ======================================================

export async function GET() {
  try {
    const supabase =
      await createClient();

    // ==================================================
    // USER
    // ==================================================

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return new Response(
        "Non autorisé.",
        {
          status: 401,
        }
      );
    }

    const previewMode =
      process.env.NODE_ENV ===
      "development";

    // ==================================================
    // PROGRESSION
    // ==================================================

    const {
      data: progressData,
      error: progressError,
    } = await supabase
      .from("lesson_progress")
      .select(
        `
          lesson_id,
          completed,
          completed_at
        `
      )
      .eq(
        "user_id",
        user.id
      );

    if (progressError) {
      console.error(
        "Erreur progression PDF :",
        progressError
      );

      return new Response(
        "Impossible de vérifier la progression.",
        {
          status: 500,
        }
      );
    }

    const progress =
      progressData ?? [];

    const completedIds =
      new Set(
        progress
          .filter(
            (item) =>
              item.completed === true
          )
          .map(
            (item) =>
              item.lesson_id
          )
      );

    const formationCompleted =
      finalProjectLessons.every(
        (lessonId) =>
          completedIds.has(
            lessonId
          )
      );

    if (
      !formationCompleted &&
      !previewMode
    ) {
      return new Response(
        "Formation non terminée.",
        {
          status: 403,
        }
      );
    }

    // ==================================================
    // VRAIE DATE DE FIN
    // ==================================================

    const finalLessonProgress =
      progress.find(
        (item) =>
          item.lesson_id ===
          "final-07-project"
      );

    const realCompletionDate =
      finalLessonProgress
        ?.completed_at ??
      null;

    if (
      formationCompleted &&
      !realCompletionDate
    ) {
      console.error(
        "final-07-project est terminé mais completed_at est vide."
      );

      return new Response(
        "Date de fin de formation introuvable.",
        {
          status: 400,
        }
      );
    }

    const completionDate =
      realCompletionDate ??
      (previewMode
        ? new Date().toISOString()
        : null);

    if (!completionDate) {
      return new Response(
        "Date de fin introuvable.",
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // NOM
    // ==================================================

    const metadata =
      user.user_metadata ?? {};

    const firstName =
      String(
        metadata.first_name ??
          metadata.firstName ??
          ""
      ).trim();

    const lastName =
      String(
        metadata.last_name ??
          metadata.lastName ??
          ""
      ).trim();

    const metadataFullName =
      String(
        metadata.full_name ??
          metadata.name ??
          ""
      ).trim();

    const generatedFullName =
      `${firstName} ${lastName}`.trim();

    const rawFullName =
      metadataFullName ||
      generatedFullName ||
      user.email?.split("@")[0] ||
      "Étudiant AI Academy";

    const fullName =
      formatName(
        rawFullName
      );

    // ==================================================
    // CERTIFICAT EXISTANT
    // ==================================================

    const {
      data: existingCertificate,
      error: certificateSearchError,
    } = await supabase
      .from("certificates")
      .select(
        `
          id,
          certificate_number,
          full_name,
          course_name,
          issued_at
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

    if (certificateSearchError) {
      console.error(
        "Erreur certificat PDF :",
        certificateSearchError
      );
    }

    let certificate =
      existingCertificate;

    // ==================================================
    // CRÉATION OFFICIELLE
    // ==================================================

    if (
      !certificate &&
      formationCompleted &&
      realCompletionDate
    ) {
      const certificateNumber =
        createCertificateNumber();

      const {
        data: createdCertificate,
        error: createError,
      } = await supabase
        .from("certificates")
        .insert({
          user_id:
            user.id,

          certificate_number:
            certificateNumber,

          full_name:
            fullName,

          course_name:
            COURSE_NAME,

          issued_at:
            realCompletionDate,
        })
        .select(
          `
            id,
            certificate_number,
            full_name,
            course_name,
            issued_at
          `
        )
        .single();

      if (createError) {
        console.error(
          "Erreur création certificat PDF :",
          createError
        );
      }

      certificate =
        createdCertificate;
    }

    // ==================================================
    // PREVIEW
    // ==================================================

    if (
      !certificate &&
      previewMode
    ) {
      certificate = {
        id:
          "preview",

        certificate_number:
          "AIA-2026-FR-PREVIEW",

        full_name:
          fullName,

        course_name:
          COURSE_NAME,

        issued_at:
          completionDate,
      };
    }

    if (!certificate) {
      return new Response(
        "Certificat introuvable.",
        {
          status: 404,
        }
      );
    }

    // ==================================================
    // DONNÉES FINALES
    // ==================================================

    const certificateFullName =
      formatName(
        String(
          certificate.full_name
        )
      );

    const certificateNumber =
      String(
        certificate.certificate_number
      );

    const issueDate =
      formatCertificateDate(
        String(
          certificate.issued_at
        )
      );

    // ==================================================
    // PDF
    // ==================================================

    const pdfDoc =
      await PDFDocument.create();

    pdfDoc.setTitle(
      `Certificat AI Academy - ${certificateFullName}`
    );

    pdfDoc.setAuthor(
      "AI Academy"
    );

    pdfDoc.setCreator(
      "AI Academy"
    );

    pdfDoc.setSubject(
      COURSE_NAME
    );

    // ==================================================
    // A4 PAYSAGE
    // ==================================================

    const pageWidth =
      841.89;

    const pageHeight =
      595.28;

    const page =
      pdfDoc.addPage([
        pageWidth,
        pageHeight,
      ]);

    // ==================================================
    // POLICES
    // ==================================================

    const regular =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    const bold =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    const serif =
      await pdfDoc.embedFont(
        StandardFonts.TimesRoman
      );

    const serifBold =
      await pdfDoc.embedFont(
        StandardFonts.TimesRomanBold
      );

    // ==================================================
    // COULEURS
    // ==================================================

    const navy =
      rgb(
        0.027,
        0.09,
        0.173
      );

    const gold =
      rgb(
        0.72,
        0.5,
        0.13
      );

    const cream =
      rgb(
        1,
        0.992,
        0.969
      );

    const slate =
      rgb(
        0.32,
        0.37,
        0.45
      );

    const white =
      rgb(
        1,
        1,
        1
      );

    // ==================================================
    // FOND
    // ==================================================

    page.drawRectangle({
      x: 0,
      y: 0,
      width:
        pageWidth,
      height:
        pageHeight,
      color:
        cream,
    });

    // ==================================================
    // CADRES
    // ==================================================

    page.drawRectangle({
      x: 14,
      y: 14,
      width:
        pageWidth - 28,
      height:
        pageHeight - 28,
      borderColor:
        navy,
      borderWidth:
        3,
    });

    page.drawRectangle({
      x: 21,
      y: 21,
      width:
        pageWidth - 42,
      height:
        pageHeight - 42,
      borderColor:
        gold,
      borderWidth:
        1,
    });

    page.drawRectangle({
      x: 27,
      y: 27,
      width:
        pageWidth - 54,
      height:
        pageHeight - 54,
      borderColor:
        navy,
      borderWidth:
        0.6,
    });

    // ==================================================
    // LOGO
    // ==================================================

    page.drawRectangle({
      x: 54,
      y:
        pageHeight - 104,
      width:
        54,
      height:
        54,
      color:
        navy,
    });

    page.drawText(
      "AI",
      {
        x: 69,
        y:
          pageHeight - 85,
        size:
          19,
        font:
          bold,
        color:
          white,
      }
    );

    page.drawText(
      "AI Academy",
      {
        x: 126,
        y:
          pageHeight - 71,
        size:
          24,
        font:
          serifBold,
        color:
          navy,
      }
    );

    page.drawText(
      "Certification",
      {
        x: 126,
        y:
          pageHeight - 90,
        size:
          9,
        font:
          regular,
        color:
          gold,
      }
    );

    // ==================================================
    // NUMÉRO
    // ==================================================

    const numberWidth =
      bold.widthOfTextAtSize(
        certificateNumber,
        9
      );

    page.drawText(
      "CERTIFICAT N°",
      {
        x:
          pageWidth -
          60 -
          numberWidth,
        y:
          pageHeight - 67,
        size:
          7,
        font:
          bold,
        color:
          gold,
      }
    );

    page.drawLine({
      start: {
        x:
          pageWidth -
          60 -
          numberWidth,
        y:
          pageHeight - 76,
      },
      end: {
        x:
          pageWidth -
          60,
        y:
          pageHeight - 76,
      },
      thickness:
        0.7,
      color:
        gold,
    });

    page.drawText(
      certificateNumber,
      {
        x:
          pageWidth -
          60 -
          numberWidth,
        y:
          pageHeight - 93,
        size:
          9,
        font:
          bold,
        color:
          navy,
      }
    );

    // ==================================================
    // DÉCOR TITRE
    // ==================================================

    page.drawLine({
      start: {
        x:
          pageWidth / 2 - 92,
        y:
          452,
      },
      end: {
        x:
          pageWidth / 2 - 22,
        y:
          452,
      },
      thickness:
        0.8,
      color:
        gold,
    });

    page.drawCircle({
      x:
        pageWidth / 2,
      y:
        452,
      size:
        2.5,
      color:
        gold,
    });

    page.drawLine({
      start: {
        x:
          pageWidth / 2 + 22,
        y:
          452,
      },
      end: {
        x:
          pageWidth / 2 + 92,
        y:
          452,
      },
      thickness:
        0.8,
      color:
        gold,
    });

    // ==================================================
    // TITRE
    // ==================================================

    drawCenteredText({
      page,
      text:
        "CERTIFICAT DE RÉUSSITE",
      font:
        serifBold,
      size:
        19,
      y:
        429,
      color:
        navy,
      pageWidth,
    });

    // ==================================================
    // INTRO
    // ==================================================

    drawCenteredText({
      page,
      text:
        "Ce certificat atteste que",
      font:
        serif,
      size:
        13,
      y:
        389,
      color:
        slate,
      pageWidth,
    });

    // ==================================================
    // NOM
    // ==================================================

    let nameSize =
      47;

    while (
      serifBold.widthOfTextAtSize(
        certificateFullName,
        nameSize
      ) >
        550 &&
      nameSize > 27
    ) {
      nameSize -= 1;
    }

    drawCenteredText({
      page,
      text:
        certificateFullName,
      font:
        serifBold,
      size:
        nameSize,
      y:
        333,
      color:
        navy,
      pageWidth,
    });

    // ==================================================
    // LIGNE SOUS NOM
    // ==================================================

    page.drawLine({
      start: {
        x: 215,
        y: 313,
      },
      end: {
        x:
          pageWidth / 2 - 10,
        y: 313,
      },
      thickness:
        0.7,
      color:
        gold,
    });

    page.drawCircle({
      x:
        pageWidth / 2,
      y:
        313,
      size:
        2.5,
      color:
        gold,
    });

    page.drawLine({
      start: {
        x:
          pageWidth / 2 + 10,
        y: 313,
      },
      end: {
        x:
          pageWidth - 215,
        y: 313,
      },
      thickness:
        0.7,
      color:
        gold,
    });

    // ==================================================
    // FORMATION
    // ==================================================

    drawCenteredText({
      page,
      text:
        "a terminé avec succès la formation",
      font:
        serif,
      size:
        11,
      y:
        285,
      color:
        slate,
      pageWidth,
    });

    drawCenteredText({
      page,
      text:
        "CONCEPTION ET DÉVELOPPEMENT DE SOLUTIONS",
      font:
        serifBold,
      size:
        18,
      y:
        251,
      color:
        navy,
      pageWidth,
    });

    drawCenteredText({
      page,
      text:
        "D'INTELLIGENCE ARTIFICIELLE",
      font:
        serifBold,
      size:
        18,
      y:
        228,
      color:
        navy,
      pageWidth,
    });

    // ==================================================
    // DESCRIPTION
    // ==================================================

    drawCenteredText({
      page,
      text:
        "et a validé les compétences nécessaires à la compréhension,",
      font:
        regular,
      size:
        9,
      y:
        202,
      color:
        slate,
      pageWidth,
    });

    drawCenteredText({
      page,
      text:
        "à la conception et au développement de solutions basées sur l'intelligence artificielle.",
      font:
        regular,
      size:
        9,
      y:
        186,
      color:
        slate,
      pageWidth,
    });

    // ==================================================
    // VRAIE DATE
    // ==================================================

    page.drawLine({
      start: {
        x:
          pageWidth / 2 - 32,
        y:
          178,
      },
      end: {
        x:
          pageWidth / 2 + 32,
        y:
          178,
      },
      thickness:
        0.7,
      color:
        gold,
    });

    drawCenteredText({
      page,
      text:
        "DÉLIVRÉ LE",
      font:
        bold,
      size:
        7,
      y:
        162,
      color:
        gold,
      pageWidth,
    });

    drawCenteredText({
      page,
      text:
        issueDate,
      font:
        serifBold,
      size:
        14,
      y:
        142,
      color:
        navy,
      pageWidth,
    });
    // ==================================================
    // SIGNATURE À DROITE
    // ==================================================

    const signatureCenterX =
      690;

    const signaturePath =
      path.join(
        process.cwd(),
        "public",
        "signature.png"
      );

    try {
      const signatureBytes =
        await readFile(
          signaturePath
        );

      const signatureImage =
        await pdfDoc.embedPng(
          signatureBytes
        );

      const maxWidth =
        115;

      const maxHeight =
        42;

      const scale =
        Math.min(
          maxWidth /
            signatureImage.width,
          maxHeight /
            signatureImage.height
        );

      const width =
        signatureImage.width *
        scale;

      const height =
        signatureImage.height *
        scale;

      page.drawImage(
        signatureImage,
        {
          x:
            signatureCenterX -
            width / 2,

          // REMONTÉ DE 20 POINTS
          y:
            92,

          width,
          height,
        }
      );
    } catch (error) {
      console.warn(
        "Signature non chargée :",
        error
      );
    }

    // ==================================================
    // LIGNE SOUS SIGNATURE
    // ==================================================

    page.drawLine({
      start: {
        x:
          signatureCenterX - 65,

        // REMONTÉ
        y:
          77,
      },

      end: {
        x:
          signatureCenterX + 65,

        y:
          77,
      },

      thickness:
        0.7,

      color:
        gold,
    });

    // ==================================================
    // DIRECTION
    // ==================================================

    drawCenteredFooterText({
      page,

      text:
        "DIRECTION",

      centerX:
        signatureCenterX,

      // REMONTÉ
      y:
        61,

      size:
        7,

      font:
        bold,

      color:
        gold,
    });

    // ==================================================
    // AI ACADEMY
    // ==================================================

    drawCenteredFooterText({
      page,

      text:
        "AI Academy",

      centerX:
        signatureCenterX,

      // REMONTÉ
      y:
        44,

      size:
        9,

      font:
        serifBold,

      color:
        navy,
    });

    // ==================================================
    // SAVE
    // ==================================================

    const pdfBytes =
      await pdfDoc.save();

    const safeName =
      certificateFullName
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-zA-Z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        )
        .toLowerCase();

    return new Response(
      Buffer.from(
        pdfBytes
      ),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="certificat-ai-academy-${safeName || "etudiant"}.pdf"`,

          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erreur génération PDF :",
      error
    );

    return new Response(
      "Erreur lors de la génération du certificat.",
      {
        status: 500,
      }
    );
  }
}