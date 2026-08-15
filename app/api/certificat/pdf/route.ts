import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFFont,
  PDFPage,
} from "pdf-lib";

import { readFile } from "fs/promises";
import path from "path";

import {
  certificateDefinitions,
  isCertificateType,
} from "@/lib/certificates/config";
import { createClient } from "@/lib/supabase/server";

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

function drawCenteredWrappedText({
  page,
  text,
  font,
  size,
  y,
  lineHeight,
  maxWidth,
  color,
  pageWidth,
}: {
  page: PDFPage;
  text: string;
  font: PDFFont;
  size: number;
  y: number;
  lineHeight: number;
  maxWidth: number;
  color: ReturnType<typeof rgb>;
  pageWidth: number;
}) {
  const lines: string[] = [];
  let currentLine = "";

  for (const word of text.split(" ")) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    drawCenteredText({
      page,
      text: line,
      font,
      size,
      y: y - index * lineHeight,
      color,
      pageWidth,
    });
  });
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

function drawCertificateCorner({
  page,
  x,
  y,
  xDirection,
  yDirection,
  gold,
  navy,
}: {
  page: PDFPage;
  x: number;
  y: number;
  xDirection: 1 | -1;
  yDirection: 1 | -1;
  gold: ReturnType<typeof rgb>;
  navy: ReturnType<typeof rgb>;
}) {
  page.drawLine({
    start: { x, y },
    end: { x: x + 52 * xDirection, y },
    thickness: 1.4,
    color: gold,
  });
  page.drawLine({
    start: { x, y },
    end: { x, y: y + 52 * yDirection },
    thickness: 1.4,
    color: gold,
  });
  page.drawLine({
    start: { x: x + 7 * xDirection, y: y + 7 * yDirection },
    end: { x: x + 34 * xDirection, y: y + 7 * yDirection },
    thickness: 0.7,
    color: navy,
  });
  page.drawLine({
    start: { x: x + 7 * xDirection, y: y + 7 * yDirection },
    end: { x: x + 7 * xDirection, y: y + 34 * yDirection },
    thickness: 0.7,
    color: navy,
  });
  page.drawCircle({
    x: x + 12 * xDirection,
    y: y + 12 * yDirection,
    size: 2.5,
    color: gold,
  });
}

// ======================================================
// ROUTE
// ======================================================

export async function GET(request: Request) {
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

    const requestedType = new URL(request.url).searchParams.get("type");

    if (!isCertificateType(requestedType)) {
      return new Response("Type de certificat invalide.", { status: 400 });
    }

    const definition = certificateDefinitions[requestedType];

    // ==================================================
    // CERTIFICAT EXISTANT
    // ==================================================

    const {
      data: certificate,
      error: certificateSearchError,
    } = await supabase
      .from("certificates")
      .select(
        `
          id,
          certificate_number,
          certificate_type,
          full_name,
          course_name,
          issued_at
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "certificate_type",
        requestedType
      )
      .maybeSingle();

    if (certificateSearchError) {
      console.error(
        "Erreur certificat PDF :",
        certificateSearchError
      );
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
      definition.name
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
        6,
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
        gold,
      borderWidth:
        0.7,
    });

    drawCertificateCorner({
      page,
      x: 35,
      y: pageHeight - 35,
      xDirection: 1,
      yDirection: -1,
      gold,
      navy,
    });
    drawCertificateCorner({
      page,
      x: pageWidth - 35,
      y: pageHeight - 35,
      xDirection: -1,
      yDirection: -1,
      gold,
      navy,
    });
    drawCertificateCorner({
      page,
      x: 35,
      y: 35,
      xDirection: 1,
      yDirection: 1,
      gold,
      navy,
    });
    drawCertificateCorner({
      page,
      x: pageWidth - 35,
      y: 35,
      xDirection: -1,
      yDirection: 1,
      gold,
      navy,
    });

    const watermark = "AI";
    const watermarkSize = 190;

    page.drawText(watermark, {
      x: centeredX(watermark, serifBold, watermarkSize, pageWidth),
      y: 205,
      size: watermarkSize,
      font: serifBold,
      color: navy,
      opacity: 0.035,
    });

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

    let certificateTitleSize = 18;

    while (
      serifBold.widthOfTextAtSize(
        definition.name.toUpperCase(),
        certificateTitleSize
      ) > 650 &&
      certificateTitleSize > 11
    ) {
      certificateTitleSize -= 1;
    }

    drawCenteredText({
      page,
      text:
        definition.title.toUpperCase(),
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
        definition.name.toUpperCase(),
      font:
        serifBold,
      size:
        certificateTitleSize,
      y:
        239,
      color:
        navy,
      pageWidth,
    });

    // ==================================================
    // DESCRIPTION
    // ==================================================

    drawCenteredWrappedText({
      page,
      text: definition.description,
      font:
        regular,
      size:
        9,
      y:
        202,
      lineHeight:
        16,
      maxWidth:
        610,
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

    // ==================================================
    // SCEAU AI ACADEMY
    // ==================================================

    const sealCenterX = 145;
    const sealCenterY = 91;

    page.drawCircle({
      x: sealCenterX,
      y: sealCenterY,
      size: 43,
      borderColor: gold,
      borderWidth: 1.8,
    });
    page.drawCircle({
      x: sealCenterX,
      y: sealCenterY,
      size: 35,
      borderColor: navy,
      borderWidth: 0.8,
    });
    drawCenteredFooterText({
      page,
      text: "AI",
      centerX: sealCenterX,
      y: 88,
      size: 21,
      font: serifBold,
      color: navy,
    });
    drawCenteredFooterText({
      page,
      text: "AI ACADEMY",
      centerX: sealCenterX,
      y: 72,
      size: 6,
      font: bold,
      color: gold,
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
            `attachment; filename="certificat-${requestedType}-ai-academy-${safeName || "etudiant"}.pdf"`,

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
