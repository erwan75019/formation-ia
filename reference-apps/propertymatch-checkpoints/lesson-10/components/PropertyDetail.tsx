import Image from "next/image";
import Link from "next/link";
import CompatibilityDetails from "@/components/CompatibilityDetails";
import PropertyFacts from "@/components/PropertyFacts";
import { formatMonthlyRent } from "@/lib/formatters";
import type { CompatibilityResult } from "@/lib/matching";
import type { Property } from "@/types/property";

const fallbackImage = {
  src: "/properties/fallback.svg",
  alt: "Illustration de remplacement pour une location fictive",
};

export default function PropertyDetail({
  property,
  compatibility,
  resultsUrl,
  invalidParameters,
}: {
  property: Property;
  compatibility: CompatibilityResult;
  resultsUrl: string;
  invalidParameters: readonly string[];
}) {
  const image = property.images[0] ?? fallbackImage;

  return (
    <main id="main-content" tabIndex={-1} className="property-detail-page">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link><span aria-hidden="true">/</span>
        <Link href={resultsUrl}>Locations</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{property.title}</span>
      </nav>

      <Link className="back-link" href={resultsUrl}>← Retour aux résultats</Link>

      {invalidParameters.length > 0 && (
        <p className="parameter-warning" role="status">
          Certains paramètres invalides ont été ignorés : {invalidParameters.join(", ")}.
        </p>
      )}

      <section className="property-detail-hero">
        <div className="property-detail-image">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 58vw"
          />
        </div>
        <div className="property-detail-summary">
          <p className="eyebrow dark">{property.city} · {property.district}</p>
          <h1>{property.title}</h1>
          <p className="property-detail-rent">{formatMonthlyRent(property.monthlyRent)}</p>
          <p className="demo-notice">Données 100 % fictives et locales — aucune offre commerciale réelle.</p>
          <CompatibilityDetails result={compatibility} />
        </div>
      </section>

      <div className="property-detail-content">
        <section aria-labelledby="description-title">
          <h2 id="description-title">Le logement</h2>
          <p>{property.description}</p>
          <PropertyFacts property={property} />
        </section>
        <aside aria-labelledby="features-title">
          <h2 id="features-title">Équipements</h2>
          <ul className="feature-list">
            {property.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <h2>Disponibilité</h2>
          <p>{property.availability}</p>
        </aside>
      </div>
    </main>
  );
}
