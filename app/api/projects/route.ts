import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProjectPayload = {
  moduleId?: string;
  lessonId?: string;

  title?: string;
  company?: string;

  projectType?: string;

  description?: string;

  solution?: string;
  prompt?: string;
  output?: string;

  score?: number | null;
  level?: string;

  clientValue?: string;
  nextStep?: string;
};

/* ============================================================
   GET
   Récupérer les projets de l'utilisateur connecté
============================================================ */

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Vous devez être connecté.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "student_projects"
        )
        .select(
          `
            id,
            module_id,
            lesson_id,
            title,
            company,
            project_type,
            description,
            solution,
            prompt,
            output,
            score,
            level,
            client_value,
            next_step,
            created_at,
            updated_at
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .order(
          "updated_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.error(
        "Erreur récupération projets :",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message ||
            "Impossible de récupérer les projets.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      projects:
        data ?? [],
    });
  } catch (error) {
    console.error(
      "Erreur GET /api/projects :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   POST
   Créer ou mettre à jour un projet
============================================================ */

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Vous devez être connecté.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as ProjectPayload;

    const moduleId =
      body.moduleId?.trim();

    const lessonId =
      body.lessonId?.trim();

    const title =
      body.title?.trim();

    if (
      !moduleId ||
      !lessonId ||
      !title
    ) {
      return NextResponse.json(
        {
          error:
            "Le module, la leçon et le titre sont obligatoires.",
        },
        {
          status: 400,
        }
      );
    }

    const rawScore =
      body.score;

    const score =
      typeof rawScore ===
        "number"
        ? Math.max(
            0,
            Math.min(
              100,
              Math.round(
                rawScore
              )
            )
          )
        : null;

    const projectData = {
      user_id:
        user.id,

      module_id:
        moduleId,

      lesson_id:
        lessonId,

      title,

      company:
        body.company?.trim() ||
        null,

      project_type:
        body.projectType?.trim() ||
        "ai_service",

      description:
        body.description?.trim() ||
        null,

      solution:
        body.solution?.trim() ||
        null,

      prompt:
        body.prompt?.trim() ||
        null,

      output:
        body.output?.trim() ||
        null,

      score,

      level:
        body.level?.trim() ||
        null,

      client_value:
        body.clientValue?.trim() ||
        null,

      next_step:
        body.nextStep?.trim() ||
        null,

      updated_at:
        new Date().toISOString(),
    };

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "student_projects"
        )
        .upsert(
          projectData,
          {
            onConflict:
              "user_id,module_id,lesson_id",
          }
        )
        .select(
          `
            id,
            module_id,
            lesson_id,
            title,
            company,
            project_type,
            description,
            solution,
            prompt,
            output,
            score,
            level,
            client_value,
            next_step,
            created_at,
            updated_at
          `
        )
        .single();

    if (error) {
      console.error(
        "Erreur sauvegarde projet :",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message ||
            "Impossible de sauvegarder le projet.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      project:
        data,

      saved:
        true,
    });
  } catch (error) {
    console.error(
      "Erreur POST /api/projects :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de sauvegarder le projet.",
      },
      {
        status: 500,
      }
    );
  }
}