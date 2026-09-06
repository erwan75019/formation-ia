import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import { coveredCities } from "@/data/properties";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-copy-inner">
          <p className="eyebrow">Locations fictives · données locales</p>
          <h1 id="hero-title">Trouvez la location qui vous correspond vraiment</h1>
          <p className="hero-lead">Définissez vos critères mensuels pour explorer nos logements de démonstration, sans envoyer aucune donnée.</p>
          <SearchForm cities={coveredCities} />
          <p className="reassurance"><ShieldIcon /> Matching local fondé uniquement sur les critères sélectionnés</p>
        </div>
      </div>
      <div className="hero-image"><Image src="/properties/paris-apartment.jpg" alt="Salon lumineux d’un appartement parisien fictif proposé à la location" fill priority sizes="(max-width: 767px) 100vw, 50vw" /></div>
    </section>
  );
}

function ShieldIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z"/><path d="m9 12 2 2 4-5"/></svg>; }
