"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { useFavorites } from "@/components/FavoritesProvider";
import { buildFavoritePropertyUrl } from "@/lib/property-navigation";
import type { Property } from "@/types/property";

export default function FavoritesGrid({ properties }: { properties: readonly Property[] }) {
  const { favoriteSlugs, hydrated } = useFavorites();
  const favorites = properties.filter((property) => favoriteSlugs.includes(property.slug));

  if (!hydrated) {
    return <p className="favorites-loading" role="status">Chargement de vos favoris…</p>;
  }

  if (favorites.length === 0) {
    return (
      <section className="favorites-empty">
        <span aria-hidden="true">♡</span>
        <h2>Aucun favori pour le moment</h2>
        <p>Ajoutez des logements depuis les cartes ou les fiches. Ils resteront uniquement dans ce navigateur.</p>
        <Link href="/biens">Explorer les biens</Link>
      </section>
    );
  }

  return (
    <>
      <p className="favorites-count" aria-live="polite">
        {favorites.length} logement{favorites.length > 1 ? "s" : ""} enregistré{favorites.length > 1 ? "s" : ""}
      </p>
      <section className="results-grid" aria-labelledby="favorites-grid-title">
        <h2 id="favorites-grid-title" className="sr-only">Logements favoris</h2>
        {favorites.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            imagePosition={["left", "center", "right"][index % 3]}
            detailHref={buildFavoritePropertyUrl(property.slug)}
            priority={index === 0}
          />
        ))}
      </section>
    </>
  );
}
