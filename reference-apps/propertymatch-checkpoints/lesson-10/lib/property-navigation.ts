import type { SearchState } from "../types/search.ts";
import { buildSearchUrl, type SearchParameters } from "./search.ts";

const searchKeys = ["ville", "budget", "chambres", "balcon", "tri"] as const;

export function hasSearchContext(parameters: SearchParameters) {
  return searchKeys.some((key) => parameters[key] !== undefined);
}

export function buildResultsUrl(
  state: Pick<SearchState, "criteria" | "sort">,
  includeSearchContext: boolean
) {
  return includeSearchContext
    ? buildSearchUrl(state.criteria, state.sort)
    : "/biens";
}

export function buildPropertyUrl(slug: string, resultsUrl = "/biens") {
  const queryIndex = resultsUrl.indexOf("?");
  const query = queryIndex >= 0 ? resultsUrl.slice(queryIndex) : "";
  return `/biens/${encodeURIComponent(slug)}${query}`;
}

export function buildPropertyReturnUrl(
  parameters: SearchParameters,
  state: Pick<SearchState, "criteria" | "sort">
) {
  if (hasSearchContext(parameters)) return buildResultsUrl(state, true);
  return "/biens";
}
