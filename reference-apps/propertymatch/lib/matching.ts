import type { Property } from "@/types/property";
import type { SearchCriteria } from "@/types/search";

export type CompatibilityCriterion = {
  key: "budget" | "bedrooms" | "balcony";
  label: string;
  explanation: string;
  pointsEarned: number;
  pointsPossible: number;
};

export type CompatibilityResult = {
  score: number | null;
  label: string | null;
  emptyMessage: string | null;
  criteria: readonly CompatibilityCriterion[];
};

type ActivePreference = {
  key: CompatibilityCriterion["key"];
  evaluate: (pointsPossible: number) => CompatibilityCriterion;
};

function pointsForPreference(count: number) {
  return 100 / count;
}

export function getCompatibilityLabel(score: number) {
  if (score >= 85) return "Excellente correspondance";
  if (score >= 70) return "Bonne correspondance";
  if (score >= 50) return "Correspondance partielle";
  return "Peu compatible";
}

export function calculateCompatibility(
  property: Property,
  preferences: SearchCriteria
): CompatibilityResult {
  const active: ActivePreference[] = [];

  if (preferences.maximumMonthlyRent !== null) {
    active.push({
      key: "budget",
      evaluate(pointsPossible) {
        const difference = property.monthlyRent - preferences.maximumMonthlyRent!;
        const overrunRate = difference / preferences.maximumMonthlyRent!;
        const ratio = difference <= 0 ? 1 : overrunRate <= 0.1 ? 0.5 : 0;
        const explanation = difference <= 0
          ? "Le loyer respecte votre budget mensuel."
          : overrunRate <= 0.1
            ? "Le loyer dépasse votre budget de 10 % ou moins."
            : "Le loyer dépasse votre budget de plus de 10 %.";
        return { key: "budget", label: "Budget mensuel", explanation, pointsEarned: pointsPossible * ratio, pointsPossible };
      },
    });
  }

  if (preferences.minimumBedrooms !== null) {
    active.push({
      key: "bedrooms",
      evaluate(pointsPossible) {
        const missing = preferences.minimumBedrooms! - property.bedrooms;
        const ratio = missing <= 0 ? 1 : missing === 1 ? 0.5 : 0;
        const explanation = missing <= 0
          ? "Le nombre de chambres demandé est atteint."
          : missing === 1
            ? "Il manque une chambre par rapport à votre préférence."
            : `Il manque ${missing} chambres par rapport à votre préférence.`;
        return { key: "bedrooms", label: "Chambres", explanation, pointsEarned: pointsPossible * ratio, pointsPossible };
      },
    });
  }

  if (preferences.balconyRequired) {
    active.push({
      key: "balcony",
      evaluate(pointsPossible) {
        return {
          key: "balcony",
          label: "Balcon",
          explanation: property.balcony ? "Le logement possède un balcon." : "Le logement ne possède pas de balcon.",
          pointsEarned: property.balcony ? pointsPossible : 0,
          pointsPossible,
        };
      },
    });
  }

  if (active.length === 0) {
    return { score: null, label: null, emptyMessage: "Ajoutez des critères pour obtenir un score", criteria: [] };
  }

  const criteria = active.map((preference) =>
    preference.evaluate(pointsForPreference(active.length))
  );
  const score = Math.max(0, Math.min(100, Math.round(
    criteria.reduce((total, criterion) => total + criterion.pointsEarned, 0)
  )));

  return { score, label: getCompatibilityLabel(score), emptyMessage: null, criteria };
}
