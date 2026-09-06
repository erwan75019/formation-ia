import type { Property } from "../types/property.ts";

export function findPropertyBySlug(
  properties: readonly Property[],
  slug: string
) {
  return properties.find((property) => property.slug === slug);
}
