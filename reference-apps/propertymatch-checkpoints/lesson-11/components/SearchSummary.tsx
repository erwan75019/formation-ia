import Link from "next/link";
import type { SearchCriteria, SearchSort } from "@/types/search";
import { countActiveFilters } from "@/lib/search";
import { formatMonthlyRent, pluralize } from "@/lib/formatters";

export default function SearchSummary({ criteria, sort, resultCount }: { criteria: SearchCriteria; sort: SearchSort; resultCount: number }) {
  const filters = [
    criteria.city,
    criteria.maximumMonthlyRent === null ? null : `Jusqu’à ${formatMonthlyRent(criteria.maximumMonthlyRent)}`,
    criteria.minimumBedrooms === null ? null : `${pluralize(criteria.minimumBedrooms, "chambre")} minimum`,
    criteria.balconyRequired ? "Balcon obligatoire" : null,
  ].filter((filter): filter is string => Boolean(filter));

  return <div className="results-controls"><div className="active-filters"><strong>{countActiveFilters(criteria)} critère{countActiveFilters(criteria) > 1 ? "s" : ""} actif{countActiveFilters(criteria) > 1 ? "s" : ""}</strong>{filters.length ? <ul>{filters.map((filter) => <li key={filter}>{filter}</li>)}</ul> : <span>Toutes les locations locales sont affichées, sans score.</span>}</div><form className="sort-form" action="/biens" method="get">{criteria.city && <input type="hidden" name="ville" value={criteria.city} />}{criteria.maximumMonthlyRent !== null && <input type="hidden" name="budget" value={criteria.maximumMonthlyRent} />}{criteria.minimumBedrooms !== null && <input type="hidden" name="chambres" value={criteria.minimumBedrooms} />}<input type="hidden" name="balcon" value={criteria.balconyRequired ? "oui" : "indifferent"} /><label>Trier les {resultCount} résultats<select name="tri" defaultValue={sort}><option value="compatibilite">Meilleure compatibilité</option><option value="loyer-croissant">Loyer croissant</option><option value="loyer-decroissant">Loyer décroissant</option><option value="surface-decroissante">Surface décroissante</option></select></label><button type="submit">Appliquer le tri</button></form><Link className="reset-link" href="/biens">Réinitialiser les critères</Link></div>;
}
