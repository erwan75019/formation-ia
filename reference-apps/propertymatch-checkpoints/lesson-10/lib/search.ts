import type { Property } from "@/types/property";
import type {
  SearchCriteria,
  SearchSort,
  SearchState,
} from "@/types/search";
import { calculateCompatibility } from "./matching.ts";

const validSorts: readonly SearchSort[] = ["compatibilite", "loyer-croissant", "loyer-decroissant", "surface-decroissante"];

export type SearchParameters = Record<
  string,
  string | string[] | undefined
>;

const safeInteger = (value: string | undefined, minimum: number, maximum: number) => {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
};

const singleValue = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;

export function parseSearchParameters(
  parameters: SearchParameters,
  allowedCities: readonly string[]
): SearchState {
  const invalidParameters: string[] = [];
  const requestedCity = singleValue(parameters.ville)?.trim();
  const city = requestedCity && allowedCities.includes(requestedCity)
    ? requestedCity
    : null;
  if (requestedCity && !city) invalidParameters.push("ville");

  const budgetValue = singleValue(parameters.budget);
  const maximumMonthlyRent = safeInteger(budgetValue, 300, 10_000);
  if (budgetValue && maximumMonthlyRent === null) invalidParameters.push("budget");

  const bedroomsValue = singleValue(parameters.chambres);
  const minimumBedrooms = safeInteger(bedroomsValue, 0, 10);
  if (bedroomsValue && minimumBedrooms === null) invalidParameters.push("chambres");

  const balconyValue = singleValue(parameters.balcon);
  const balconyRequired = balconyValue === "oui";
  if (balconyValue && balconyValue !== "oui" && balconyValue !== "indifferent") {
    invalidParameters.push("balcon");
  }

  const sortValue = singleValue(parameters.tri);
  const sort = validSorts.includes(sortValue as SearchSort)
    ? (sortValue as SearchSort)
    : "compatibilite";
  if (sortValue && sortValue !== sort) invalidParameters.push("tri");

  return {
    criteria: { city, maximumMonthlyRent, minimumBedrooms, balconyRequired },
    sort,
    invalidParameters,
  };
}

export function filterProperties(
  properties: readonly Property[],
  criteria: SearchCriteria
) {
  return properties.filter((property) =>
    !criteria.city || property.city === criteria.city
  );
}

export function countMatchingProperties(
  properties: readonly Property[],
  criteria: SearchCriteria
) {
  return filterProperties(properties, criteria).length;
}

export function sortProperties(
  properties: readonly Property[],
  sort: SearchSort,
  criteria: SearchCriteria
) {
  return properties
    .map((property, index) => ({ property, index }))
    .sort((left, right) => {
      let difference = 0;
      if (sort === "loyer-croissant") difference = left.property.monthlyRent - right.property.monthlyRent;
      if (sort === "loyer-decroissant") difference = right.property.monthlyRent - left.property.monthlyRent;
      if (sort === "surface-decroissante") difference = right.property.surface - left.property.surface;
      if (sort === "compatibilite") {
        difference = (calculateCompatibility(right.property, criteria).score ?? 0) -
          (calculateCompatibility(left.property, criteria).score ?? 0);
      }
      return difference || left.index - right.index;
    })
    .map(({ property }) => property);
}

export function searchProperties(
  properties: readonly Property[],
  state: Pick<SearchState, "criteria" | "sort">
) {
  return sortProperties(filterProperties(properties, state.criteria), state.sort, state.criteria);
}

export function buildSearchUrl(criteria: SearchCriteria, sort: SearchSort) {
  const parameters = new URLSearchParams();
  if (criteria.city) parameters.set("ville", criteria.city);
  if (criteria.maximumMonthlyRent !== null) parameters.set("budget", String(criteria.maximumMonthlyRent));
  if (criteria.minimumBedrooms !== null) parameters.set("chambres", String(criteria.minimumBedrooms));
  parameters.set("balcon", criteria.balconyRequired ? "oui" : "indifferent");
  parameters.set("tri", sort);
  return `/biens?${parameters.toString()}`;
}

export function countActiveFilters(criteria: SearchCriteria) {
  return Number(Boolean(criteria.city)) +
    Number(criteria.maximumMonthlyRent !== null) +
    Number(criteria.minimumBedrooms !== null) +
    Number(criteria.balconyRequired);
}
