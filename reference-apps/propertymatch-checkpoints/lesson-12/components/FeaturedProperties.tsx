import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types/property";
import Link from "next/link";

export default function FeaturedProperties({ properties }: { properties: readonly Property[] }) {
  return <section id="biens" className="featured" aria-labelledby="featured-title"><div className="section-heading"><div><p className="eyebrow dark">Sélection locale</p><h2 id="featured-title">Locations mises en avant</h2><p>Trois exemples issus de nos données fictives, sans classement personnalisé à ce stade.</p></div><Link href="/biens">Voir les 15 locations →</Link></div><div className="property-grid">{properties.map((property, index) => <PropertyCard key={property.id} property={property} imagePosition={["left", "center", "right"][index] ?? "center"} detailHref={`/biens/${property.slug}`} />)}</div></section>;
}
