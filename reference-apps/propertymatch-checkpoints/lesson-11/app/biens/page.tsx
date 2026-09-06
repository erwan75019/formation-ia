import type { Metadata } from "next";
import EmptyResults from "@/components/EmptyResults";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import SearchForm from "@/components/SearchForm";
import SearchSummary from "@/components/SearchSummary";
import { coveredCities, properties } from "@/data/properties";
import { countMatchingProperties, parseSearchParameters, searchProperties, type SearchParameters } from "@/lib/search";
import { calculateCompatibility } from "@/lib/matching";
import { buildPropertyUrl, buildResultsUrl, hasSearchContext } from "@/lib/property-navigation";

export const metadata: Metadata = { title: "Locations | PropertyMatch", description: "Rechercher parmi quinze locations immobilières fictives et locales." };

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParameters> }) {
  const rawSearchParameters = await searchParams;
  const state = parseSearchParameters(rawSearchParameters, coveredCities);
  const results = searchProperties(properties, state);
  const resultsUrl = buildResultsUrl(state, hasSearchContext(rawSearchParameters));
  const resultCount = countMatchingProperties(properties, state.criteria);
  return <><Header /><main id="main-content" tabIndex={-1} className="results-page"><section className="results-intro"><p className="eyebrow dark">Recherche locale</p><h1>{resultCount} location{resultCount > 1 ? "s" : ""} trouvée{resultCount > 1 ? "s" : ""}</h1><p>La ville filtre strictement les résultats. Les autres préférences servent à calculer un score local et transparent.</p></section>{state.invalidParameters.length > 0 && <p className="parameter-warning" role="status">Certains paramètres invalides ont été ignorés : {state.invalidParameters.join(", ")}.</p>}<SearchForm cities={coveredCities} criteria={state.criteria} sort={state.sort} compact /><SearchSummary criteria={state.criteria} sort={state.sort} resultCount={resultCount} />{resultCount ? <section className="results-grid" aria-labelledby="results-grid-title"><h2 id="results-grid-title" className="sr-only">Locations correspondantes</h2>{results.map((property, index) => <PropertyCard key={property.id} property={property} imagePosition={["left", "center", "right"][index % 3]} compatibility={calculateCompatibility(property, state.criteria)} detailHref={buildPropertyUrl(property.slug, resultsUrl)} priority={index === 0} />)}</section> : <EmptyResults />}</main><Footer /></>;
}
