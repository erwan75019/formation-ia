export type SearchCriteria = {
  city: string | null;
  maximumMonthlyRent: number | null;
  minimumBedrooms: number | null;
  balconyRequired: boolean;
};

export const searchSorts = [
  "compatibilite",
  "loyer-croissant",
  "loyer-decroissant",
  "surface-decroissante",
] as const;

export type SearchSort = (typeof searchSorts)[number];

export type SearchState = {
  criteria: SearchCriteria;
  sort: SearchSort;
  invalidParameters: readonly string[];
};
