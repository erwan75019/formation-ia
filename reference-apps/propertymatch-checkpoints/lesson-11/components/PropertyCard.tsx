import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types/property";
import { formatMonthlyRent, formatSurface, pluralize } from "@/lib/formatters";
import CompatibilityDetails from "@/components/CompatibilityDetails";
import type { CompatibilityResult } from "@/lib/matching";
import FavoriteButton from "@/components/FavoriteButton";

export default function PropertyCard({ property, imagePosition, compatibility, detailHref, priority = false }: { property: Property; imagePosition: string; compatibility?: CompatibilityResult; detailHref: string; priority?: boolean }) {
  const image = property.images[0] ?? { src: "/properties/fallback.svg", alt: "Illustration de remplacement pour une location fictive" };
  return (
    <article className="property-card">
      <div className="property-image"><Image src={image.src} alt={image.alt} fill priority={priority} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" style={{ objectPosition: imagePosition }} /><FavoriteButton slug={property.slug} title={property.title} /></div>
      <div className="property-body"><div className="property-heading"><div><span className="location-dot">●</span><h3>{property.district}</h3></div><strong>{formatMonthlyRent(property.monthlyRent)}</strong></div><p className="property-title">{property.title}</p><ul><li>{pluralize(property.bedrooms, "chambre")}</li><li>{property.balcony ? "Balcon" : "Sans balcon"}</li><li>{formatSurface(property.surface)}</li></ul>{compatibility && <CompatibilityDetails result={compatibility} />}<Link className="property-detail-link" href={detailHref}>Voir le logement</Link></div>
    </article>
  );
}
