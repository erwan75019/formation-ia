import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion } from "@/lib/training/catalog";

export default async function SiteWebTrainingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: projectProgress, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id)
    .eq("lesson_id", "automation-07-project")
    .maybeSingle();

  if (error || !projectProgress || !isValidLessonCompletion(projectProgress)) {
    redirect("/formation/automatisation/07#evaluation-projet");
  }

  return children;
}
