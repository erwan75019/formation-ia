import { permanentRedirect } from "next/navigation";

import { getWebLessonIdFromSlug } from "@/lib/training/web/navigation";

export default async function LegacyWebExercisePage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  if (!getWebLessonIdFromSlug(lesson)) permanentRedirect("/formation/site-web/12");
  permanentRedirect(`/formation/site-web/${lesson}/qcm`);
}
