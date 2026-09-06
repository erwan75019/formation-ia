import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion, moduleLessonIds } from "@/lib/training/catalog";

export default async function ApiIaTrainingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const requiredLessonId = moduleLessonIds[6].at(-1);
  const { data: progress, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id)
    .eq("lesson_id", requiredLessonId)
    .maybeSingle();

  if (error || !progress || !isValidLessonCompletion(progress, requiredLessonId)) {
    redirect("/formation/site-web/12?required_for=module-07");
  }

  return children;
}
