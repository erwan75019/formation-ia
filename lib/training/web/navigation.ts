import {
  moduleLessonIds,
  trainingModules,
  webLessonCatalog,
  type OfficialLessonId,
} from "../catalog.ts";

const webLessonIds = moduleLessonIds[6];

export function getWebLessonIdFromSlug(slug: string): OfficialLessonId | null {
  if (!/^\d{2}$/.test(slug)) return null;
  const index = Number(slug) - 1;
  return webLessonIds[index] ?? null;
}

export function getWebLessonSlugFromIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function getWebLessonPrerequisite(slug: string) {
  const lessonId = getWebLessonIdFromSlug(slug);
  if (!lessonId) return null;
  const index = webLessonIds.indexOf(lessonId as (typeof webLessonIds)[number]);
  if (index <= 0) return null;
  return {
    lessonId: webLessonIds[index - 1],
    slug: getWebLessonSlugFromIndex(index - 1),
  };
}

export function getValidatedRequiredFor(currentSlug: string, value: unknown) {
  if (typeof value !== "string" || !/^\d{2}$/.test(value)) return null;
  const prerequisite = getWebLessonPrerequisite(value);
  return prerequisite?.slug === currentSlug ? value : null;
}

export type WebQuizContinuation = {
  href: string;
  label: "Continuer vers la leçon suivante →" | "Continuer vers le module suivant →";
};

export function getWebQuizContinuation(
  lessonId: string
): WebQuizContinuation | null {
  const lessonIndex = webLessonCatalog.findIndex(
    (lesson) => lesson.id === lessonId
  );

  if (lessonIndex === -1) return null;

  const nextLesson = webLessonCatalog[lessonIndex + 1];
  if (nextLesson) {
    return {
      href: `/formation/site-web/${nextLesson.number}`,
      label: "Continuer vers la leçon suivante →",
    };
  }

  const nextModule = trainingModules.find((module) => module.number === 7);
  if (!nextModule) return null;

  return {
    href: nextModule.route,
    label: "Continuer vers le module suivant →",
  };
}
