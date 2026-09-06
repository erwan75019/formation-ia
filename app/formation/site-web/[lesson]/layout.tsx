import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isValidLessonCompletion } from "@/lib/training/catalog";
import {
  getWebLessonIdFromSlug,
  getWebLessonPrerequisite,
} from "@/lib/training/web/navigation";

export default async function SiteWebLessonLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lesson: string }>;
}>) {
  const { lesson: slug } = await params;
  if (!getWebLessonIdFromSlug(slug)) notFound();

  const prerequisite = getWebLessonPrerequisite(slug);
  if (!prerequisite) return children;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: progress, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id)
    .eq("lesson_id", prerequisite.lessonId)
    .maybeSingle();

  if (error || !progress || !isValidLessonCompletion(progress)) {
    redirect(
      `/formation/site-web/${prerequisite.slug}?required_for=${slug}`
    );
  }

  return children;
}
