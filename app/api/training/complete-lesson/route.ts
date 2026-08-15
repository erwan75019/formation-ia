import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Body = {
  lessonId?: string;
  score?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const lessonId = body.lessonId?.trim();
    const score = Math.max(
      0,
      Math.min(100, Math.round(Number(body.score ?? 0)))
    );

    if (!lessonId) {
      return NextResponse.json(
        { error: "lessonId obligatoire." },
        { status: 400 }
      );
    }

    if (score < 70) {
      return NextResponse.json(
        {
          error:
            "Un score minimum de 70/100 est nécessaire pour valider.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          score,
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

    if (error) {
      console.error(
        "Erreur progression automatisation :",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'enregistrer la progression.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lessonId,
      score,
    });
  } catch (error) {
    console.error(
      "Erreur complete-lesson :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer la progression.",
      },
      { status: 500 }
    );
  }
}
