"use client";

import { useFavorites } from "@/components/FavoritesProvider";
import { useState } from "react";

export default function FavoriteButton({ slug, title }: { slug: string; title: string }) {
  const { hydrated, isFavorite, toggleFavorite } = useFavorites();
  const [announcement, setAnnouncement] = useState("");
  const favorite = hydrated && isFavorite(slug);
  const label = favorite
    ? `Retirer ${title} des favoris`
    : `Ajouter ${title} aux favoris`;

  return (
    <><button
      type="button"
      className={`favorite-button${favorite ? " active" : ""}`}
      aria-label={label}
      aria-pressed={favorite}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
        setAnnouncement(favorite ? `${title} retiré des favoris` : `${title} ajouté aux favoris`);
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
      <span>{favorite ? "Favori" : "Ajouter aux favoris"}</span>
    </button><span className="sr-only" aria-live="polite">{announcement}</span></>
  );
}
