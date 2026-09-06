import type { SearchCriteria, SearchSort } from "@/types/search";

type Props = { cities: readonly string[]; criteria?: SearchCriteria; sort?: SearchSort; compact?: boolean };
const defaults: SearchCriteria = { city: "Paris", maximumMonthlyRent: 2500, minimumBedrooms: 2, balconyRequired: true };

export default function SearchForm({ cities, criteria = defaults, sort = "compatibilite", compact = false }: Props) {
  return (
    <form className={`search-panel${compact ? " compact" : ""}`} action="/biens" method="get">
      <div className="search-fields">
        <label>Ville<select name="ville" defaultValue={criteria.city ?? ""}><option value="">Toutes les villes</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
        <label>Budget mensuel maximum<input name="budget" type="number" min="300" max="10000" step="50" defaultValue={criteria.maximumMonthlyRent ?? ""} placeholder="Sans maximum" aria-describedby="budget-unit" /><span id="budget-unit" className="field-help">Montant en € / mois</span></label>
        <label>Chambres minimales<input name="chambres" type="number" min="0" max="10" step="1" defaultValue={criteria.minimumBedrooms ?? ""} placeholder="Indifférent" /></label>
        <label>Balcon<select name="balcon" defaultValue={criteria.balconyRequired ? "oui" : "indifferent"}><option value="indifferent">Indifférent</option><option value="oui">Obligatoire</option></select></label>
      </div>
      <input type="hidden" name="tri" value={sort} />
      <button type="submit"><SearchIcon /> Rechercher</button>
    </form>
  );
}

function SearchIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>; }
