export const FAVORITES_STORAGE_KEY = "propertymatch:favorites:v1";

export type FavoritesStorage = Pick<Storage, "getItem" | "setItem">;

export function normalizeFavoriteSlugs(
  value: unknown,
  allowedSlugs: readonly string[]
) {
  if (!Array.isArray(value)) return [];
  const requested = new Set(value.filter((slug): slug is string => typeof slug === "string"));
  return allowedSlugs.filter((slug) => requested.has(slug));
}
export function readFavoriteSlugs(
  storage: FavoritesStorage | null | undefined,
  allowedSlugs: readonly string[]
) {
  if (!storage) return [];
  try {
    const rawValue = storage.getItem(FAVORITES_STORAGE_KEY);
    return rawValue === null
      ? []
      : normalizeFavoriteSlugs(JSON.parse(rawValue), allowedSlugs);
  } catch {
    return [];
  }
}

export function writeFavoriteSlugs(
  storage: FavoritesStorage | null | undefined,
  slugs: unknown,
  allowedSlugs: readonly string[]
) {
  const normalized = normalizeFavoriteSlugs(slugs, allowedSlugs);
  if (!storage) return { success: false, slugs: normalized };
  try {
    storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalized));
    return { success: true, slugs: normalized };
  } catch {
    return { success: false, slugs: normalized };
  }
}

export function toggleFavoriteSlug(
  currentSlugs: readonly string[],
  slug: string,
  allowedSlugs: readonly string[]
) {
  const nextSlugs = currentSlugs.includes(slug)
    ? currentSlugs.filter((favoriteSlug) => favoriteSlug !== slug)
    : [...currentSlugs, slug];
  return normalizeFavoriteSlugs(nextSlugs, allowedSlugs);
}
