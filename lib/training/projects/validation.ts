import type { ProjectWork } from "@/lib/training/projects/catalog";
import type { ProjectDefinition } from "@/lib/training/projects/definitions.server";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateProjectWork(
  definition: ProjectDefinition,
  work: unknown
): { valid: true; work: ProjectWork } | { valid: false; error: string } {
  if (!isPlainObject(work)) {
    return { valid: false, error: "Le travail doit être un objet." };
  }

  const expected = definition.fields.map(({ key }) => key);
  const received = Object.keys(work);
  if (
    received.length !== expected.length ||
    received.some((key) => !expected.includes(key))
  ) {
    return { valid: false, error: "La structure du travail est invalide." };
  }

  const normalized: ProjectWork = {};
  let total = 0;
  for (const field of definition.fields) {
    const value = work[field.key];
    if (typeof value !== "string") {
      return { valid: false, error: `${field.label} doit être un texte.` };
    }
    const clean = value.trim();
    if (clean.length < field.minLength) {
      return { valid: false, error: `${field.label} est trop court.` };
    }
    if (clean.length > field.maxLength) {
      return { valid: false, error: `${field.label} est trop volumineux.` };
    }
    total += clean.length;
    normalized[field.key] = clean;
  }

  if (total > 30_000) {
    return { valid: false, error: "Le travail complet est trop volumineux." };
  }

  return { valid: true, work: normalized };
}
