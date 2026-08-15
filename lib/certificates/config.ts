import "server-only";

import { planLessonIds } from "@/lib/training/catalog";

export const certificateTypes = ["fondamentaux", "complet"] as const;

export type CertificateType = (typeof certificateTypes)[number];

export const certificateDefinitions = {
  fondamentaux: {
    title: "Certificat de maîtrise",
    name: "Fondamentaux et automatisation en intelligence artificielle",
    description:
      "a validé les compétences fondamentales nécessaires à l’utilisation efficace des outils d’intelligence artificielle et à l’automatisation de tâches.",
    requiredPlan: ["fondamentaux", "complet"] as const,
    lessonIds: planLessonIds.fondamentaux,
  },
  complet: {
    title: "Certificat de réussite",
    name: "Conception d’applications et de systèmes d’intelligence artificielle",
    description:
      "a validé les compétences nécessaires à la conception, au développement et au déploiement d’applications et de systèmes fondés sur l’intelligence artificielle.",
    requiredPlan: ["complet"] as const,
    lessonIds: planLessonIds.complet,
  },
} satisfies Record<
  CertificateType,
  {
    title: string;
    name: string;
    description: string;
    requiredPlan: readonly ("fondamentaux" | "complet")[];
    lessonIds: readonly string[];
  }
>;

export function isCertificateType(value: unknown): value is CertificateType {
  return (
    typeof value === "string" &&
    certificateTypes.includes(value as CertificateType)
  );
}
export function hasCertificateAccess(
  type: CertificateType,
  plan: unknown,
  subscriptionStatus: unknown
) {
  const hasActiveSubscription =
    subscriptionStatus === "active" || subscriptionStatus === "trialing";

  return (
    hasActiveSubscription &&
    certificateDefinitions[type].requiredPlan.some(
      (requiredPlan) => requiredPlan === plan
    )
  );
}
