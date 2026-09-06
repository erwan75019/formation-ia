export const lessonSevenFormatterCode = `export function formatMonthlyRent(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value) + " / mois";
}

export function formatSurface(value: number) {
  return value + " m²";
}
`;

export const lessonSevenPropertyCardCode = `import Image from "next/image";
import type { Property } from "@/types/property";
import { formatMonthlyRent, formatSurface } from "@/lib/formatters";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image src={property.imagePath || "/properties/fallback.svg"} alt={property.imageAlt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-sm font-bold text-[#07583f]">{property.city}</p>
        <h3 className="mt-2 text-xl font-bold">{property.title}</h3>
        <p className="mt-3 text-lg font-extrabold">{formatMonthlyRent(property.monthlyRent)}</p>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <li>{formatSurface(property.surface)}</li><li>{property.bedrooms} chambre{property.bedrooms > 1 ? "s" : ""}</li><li>{property.hasBalcony ? "Balcon" : "Sans balcon"}</li>
        </ul>
      </div>
    </article>
  );
}
`;

export const lessonSevenFeaturedCode = `import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

export default function FeaturedProperties() {
  const featured = properties.slice(0, 3);
  return (
    <section id="biens" className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 lg:px-16" aria-labelledby="featured-title">
      <h2 id="featured-title" className="text-3xl font-bold">Locations mises en avant</h2>
      <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((property) => <PropertyCard key={property.id} property={property} />)}
      </div>
    </section>
  );
}
`;

export const lessonEightSearchTypeCode = `export type SearchSort = "compatibilite" | "loyer-croissant" | "loyer-decroissant" | "surface-decroissante";
export type SearchCriteria = { city: string | null; maximumMonthlyRent: number | null; minimumBedrooms: number | null; balconyRequired: boolean };
export type SearchState = { criteria: SearchCriteria; sort: SearchSort; invalidParameters: string[] };
`;

export const lessonEightSearchCode = `import type { Property } from "@/types/property";
import type { SearchCriteria, SearchSort, SearchState } from "@/types/search";

export type SearchParameters = Record<string, string | string[] | undefined>;
const validSorts: SearchSort[] = ["compatibilite", "loyer-croissant", "loyer-decroissant", "surface-decroissante"];
const one = (value: string | string[] | undefined) => typeof value === "string" ? value : undefined;
const safeInteger = (value: string | undefined, min: number, max: number) => {
  if (!value || !/^\\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= min && number <= max ? number : null;
};

export function parseSearchParameters(parameters: SearchParameters, cities: readonly string[]): SearchState {
  const invalidParameters: string[] = [];
  const requestedCity = one(parameters.ville)?.trim();
  const city = requestedCity && cities.includes(requestedCity) ? requestedCity : null;
  if (requestedCity && !city) invalidParameters.push("ville");
  const budgetValue = one(parameters.budget);
  const maximumMonthlyRent = safeInteger(budgetValue, 300, 10000);
  if (budgetValue && maximumMonthlyRent === null) invalidParameters.push("budget");
  const bedroomsValue = one(parameters.chambres);
  const minimumBedrooms = safeInteger(bedroomsValue, 0, 10);
  if (bedroomsValue && minimumBedrooms === null) invalidParameters.push("chambres");
  const balconyValue = one(parameters.balcon);
  const balconyRequired = balconyValue === "oui";
  if (balconyValue && !["oui", "indifferent"].includes(balconyValue)) invalidParameters.push("balcon");
  const sortValue = one(parameters.tri);
  const sort = validSorts.includes(sortValue as SearchSort) ? sortValue as SearchSort : "compatibilite";
  if (sortValue && sortValue !== sort) invalidParameters.push("tri");
  return { criteria: { city, maximumMonthlyRent, minimumBedrooms, balconyRequired }, sort, invalidParameters };
}

export function filterProperties(properties: readonly Property[], criteria: SearchCriteria) {
  return properties.filter((property) => !criteria.city || property.city === criteria.city);
}

export function sortProperties(properties: readonly Property[], sort: SearchSort) {
  return properties.map((property, index) => ({ property, index })).sort((a, b) => {
    const difference = sort === "loyer-croissant" ? a.property.monthlyRent - b.property.monthlyRent : sort === "loyer-decroissant" ? b.property.monthlyRent - a.property.monthlyRent : sort === "surface-decroissante" ? b.property.surface - a.property.surface : 0;
    return difference || a.index - b.index;
  }).map(({ property }) => property);
}

export function searchProperties(properties: readonly Property[], state: Pick<SearchState, "criteria" | "sort">) {
  return sortProperties(filterProperties(properties, state.criteria), state.sort);
}
`;

export const lessonEightSearchFormCode = `import { properties } from "@/data/properties";
import type { SearchCriteria, SearchSort } from "@/types/search";
type Props = { cities?: readonly string[]; criteria?: SearchCriteria; sort?: SearchSort };
const defaults: SearchCriteria = { city: null, maximumMonthlyRent: null, minimumBedrooms: null, balconyRequired: false };
const catalogCities = [...new Set(properties.map((property) => property.city))];
export default function SearchForm({ cities = catalogCities, criteria = defaults, sort = "compatibilite" }: Props) {
  return <form action="/biens" method="get" className="mt-8 rounded-2xl bg-white p-5 text-[#06182f] shadow-xl"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><label className="grid gap-2 font-bold">Ville<select name="ville" defaultValue={criteria.city ?? ""} className="min-h-11 rounded-lg border px-3"><option value="">Toutes les villes</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label><label className="grid gap-2 font-bold">Budget maximum<input name="budget" type="number" min="300" max="10000" defaultValue={criteria.maximumMonthlyRent ?? ""} className="min-h-11 rounded-lg border px-3" /></label><label className="grid gap-2 font-bold">Chambres<input name="chambres" type="number" min="0" max="10" defaultValue={criteria.minimumBedrooms ?? ""} className="min-h-11 rounded-lg border px-3" /></label><label className="grid gap-2 font-bold">Balcon<select name="balcon" defaultValue={criteria.balconyRequired ? "oui" : "indifferent"} className="min-h-11 rounded-lg border px-3"><option value="indifferent">Indifférent</option><option value="oui">Obligatoire</option></select></label></div><input type="hidden" name="tri" value={sort} /><button type="submit" className="mt-5 min-h-12 w-full rounded-lg bg-[#07583f] font-bold text-white">Rechercher</button></form>;
}
`;

export const lessonEightSummaryCode = `import type { SearchCriteria, SearchSort } from "@/types/search";
export default function SearchSummary({ criteria, sort, resultCount }: { criteria: SearchCriteria; sort: SearchSort; resultCount: number }) {
  const filters = [criteria.city, criteria.maximumMonthlyRent !== null ? \`Budget : \${criteria.maximumMonthlyRent} €\` : null, criteria.minimumBedrooms !== null ? \`Chambres : \${criteria.minimumBedrooms}+\` : null, criteria.balconyRequired ? "Balcon obligatoire" : null].filter(Boolean);
  return <section className="mt-6 rounded-xl bg-slate-100 p-4" aria-label="Résumé de la recherche"><p><strong>{resultCount} résultat{resultCount > 1 ? "s" : ""}</strong> · Tri : {sort}</p><p className="mt-2 text-sm">{filters.length ? filters.join(" · ") : "Aucun filtre actif"}</p></section>;
}
`;

export const lessonEightEmptyCode = `export default function EmptyResults() { return <section className="mt-8 rounded-2xl border border-dashed p-10 text-center"><h2 className="text-2xl font-bold">Aucune location trouvée</h2><p className="mt-2">Modifiez la ville ou réinitialisez les filtres.</p><a href="/biens" className="mt-5 inline-flex font-bold text-[#07583f]">Réinitialiser la recherche</a></section>; }
`;

export const lessonEightResultsPageCode = `import EmptyResults from "@/components/EmptyResults";
import PropertyCard from "@/components/PropertyCard";
import SearchForm from "@/components/SearchForm";
import SearchSummary from "@/components/SearchSummary";
import { properties } from "@/data/properties";
import { parseSearchParameters, searchProperties, type SearchParameters } from "@/lib/search";
const cities = [...new Set(properties.map((property) => property.city))];
export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParameters> }) {
  const state = parseSearchParameters(await searchParams, cities);
  const results = searchProperties(properties, state);
  return <main className="mx-auto max-w-[1440px] px-5 py-10"><h1 className="text-4xl font-bold">{results.length} location{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}</h1>{state.invalidParameters.length > 0 && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4">Paramètres ignorés : {state.invalidParameters.join(", ")}.</p>}<SearchForm cities={cities} criteria={state.criteria} sort={state.sort} /><SearchSummary criteria={state.criteria} sort={state.sort} resultCount={results.length} /><form method="get" className="mt-6 flex flex-wrap items-end gap-4"><input type="hidden" name="ville" value={state.criteria.city ?? ""} /><input type="hidden" name="budget" value={state.criteria.maximumMonthlyRent ?? ""} /><input type="hidden" name="chambres" value={state.criteria.minimumBedrooms ?? ""} /><input type="hidden" name="balcon" value={state.criteria.balconyRequired ? "oui" : "indifferent"} /><label className="grid gap-2 font-bold">Trier<select name="tri" defaultValue={state.sort} className="min-h-11 rounded-lg border px-3"><option value="compatibilite">Compatibilité</option><option value="loyer-croissant">Loyer croissant</option><option value="loyer-decroissant">Loyer décroissant</option><option value="surface-decroissante">Surface décroissante</option></select></label><button className="min-h-11 rounded-lg bg-[#06182f] px-5 text-white">Appliquer</button><a href="/biens" className="py-3 font-bold text-[#07583f]">Réinitialiser</a></form>{results.length > 0 ? <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{results.map((property) => <PropertyCard key={property.id} property={property} />)}</section> : <EmptyResults />}</main>;
}
`;

export const lessonNineMatchingCode = `import type { Property } from "@/types/property";
import type { SearchCriteria } from "@/types/search";
export type CompatibilityCriterion = { key: string; label: string; explanation: string; pointsEarned: number; pointsPossible: number };
export type CompatibilityResult = { score: number | null; label: string | null; emptyMessage: string | null; criteria: CompatibilityCriterion[] };
export function getCompatibilityLabel(score: number) { if (score >= 85) return "Excellente correspondance"; if (score >= 70) return "Bonne correspondance"; if (score >= 50) return "Correspondance partielle"; return "Peu compatible"; }
export function calculateCompatibility(property: Property, preferences: SearchCriteria): CompatibilityResult {
  const active: ((points: number) => CompatibilityCriterion)[] = [];
  if (preferences.maximumMonthlyRent !== null) active.push((points) => { const difference = property.monthlyRent - preferences.maximumMonthlyRent!; const rate = difference / preferences.maximumMonthlyRent!; const ratio = difference <= 0 ? 1 : rate <= 0.1 ? 0.5 : 0; return { key: "budget", label: "Budget", explanation: difference <= 0 ? "Le loyer respecte votre budget." : rate <= 0.1 ? "Le dépassement reste inférieur ou égal à 10 %." : "Le dépassement est supérieur à 10 %.", pointsEarned: points * ratio, pointsPossible: points }; });
  if (preferences.minimumBedrooms !== null) active.push((points) => { const missing = preferences.minimumBedrooms! - property.bedrooms; const ratio = missing <= 0 ? 1 : missing === 1 ? 0.5 : 0; return { key: "chambres", label: "Chambres", explanation: missing <= 0 ? "Le minimum est atteint." : missing === 1 ? "Il manque une chambre." : "Il manque plusieurs chambres.", pointsEarned: points * ratio, pointsPossible: points }; });
  if (preferences.balconyRequired) active.push((points) => ({ key: "balcon", label: "Balcon", explanation: property.hasBalcony ? "Le logement possède un balcon." : "Le logement ne possède pas de balcon.", pointsEarned: property.hasBalcony ? points : 0, pointsPossible: points }));
  if (active.length === 0) return { score: null, label: null, emptyMessage: "Ajoutez des critères pour obtenir un score", criteria: [] };
  const criteria = active.map((evaluate) => evaluate(100 / active.length));
  const score = Math.max(0, Math.min(100, Math.round(criteria.reduce((sum, item) => sum + item.pointsEarned, 0))));
  return { score, label: getCompatibilityLabel(score), emptyMessage: null, criteria };
}
`;

export const lessonNineDetailsCode = `import type { CompatibilityResult } from "@/lib/matching";
export default function CompatibilityDetails({ result }: { result: CompatibilityResult }) {
  if (result.score === null) return <p className="mt-4 text-sm text-slate-600">{result.emptyMessage}</p>;
  return <div className="mt-4 border-t pt-4"><p><strong>{result.score} % compatible</strong> — {result.label}</p><details className="mt-3"><summary className="cursor-pointer font-bold text-[#07583f]">Pourquoi ce score ?</summary><ul className="mt-3 space-y-3">{result.criteria.map((item) => <li key={item.key}><strong>{item.label}</strong> : {item.pointsEarned.toFixed(1)} / {item.pointsPossible.toFixed(1)} points<p className="text-sm text-slate-600">{item.explanation}</p></li>)}</ul></details></div>;
}
`;

export const lessonNinePropertyCardCode = lessonSevenPropertyCardCode
  .replace('import { formatMonthlyRent, formatSurface } from "@/lib/formatters";', 'import { formatMonthlyRent, formatSurface } from "@/lib/formatters";\nimport CompatibilityDetails from "@/components/CompatibilityDetails";\nimport type { CompatibilityResult } from "@/lib/matching";')
  .replace('export default function PropertyCard({ property }: { property: Property })', 'export default function PropertyCard({ property, compatibility }: { property: Property; compatibility: CompatibilityResult })')
  .replace('        </ul>', '        </ul><CompatibilityDetails result={compatibility} />');

export const lessonNineSearchCode = lessonEightSearchCode
  .replace('import type { SearchCriteria, SearchSort, SearchState } from "@/types/search";', 'import type { SearchCriteria, SearchSort, SearchState } from "@/types/search";\nimport { calculateCompatibility } from "@/lib/matching";')
  .replace('export function sortProperties(properties: readonly Property[], sort: SearchSort) {', 'export function sortProperties(properties: readonly Property[], sort: SearchSort, criteria: SearchCriteria) {')
  .replace('const difference = sort === "loyer-croissant"', 'const difference = sort === "compatibilite" ? (calculateCompatibility(b.property, criteria).score ?? 0) - (calculateCompatibility(a.property, criteria).score ?? 0) : sort === "loyer-croissant"')
  .replace('return sortProperties(filterProperties(properties, state.criteria), state.sort);', 'return sortProperties(filterProperties(properties, state.criteria), state.sort, state.criteria);');

export const lessonNineResultsPageCode = lessonEightResultsPageCode
  .replace('import { parseSearchParameters', 'import { calculateCompatibility } from "@/lib/matching";\nimport { parseSearchParameters')
  .replace('<PropertyCard key={property.id} property={property} />', '<PropertyCard key={property.id} property={property} compatibility={calculateCompatibility(property, state.criteria)} />');
