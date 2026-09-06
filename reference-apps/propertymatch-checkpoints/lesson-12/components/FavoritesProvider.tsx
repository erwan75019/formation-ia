"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { FAVORITES_STORAGE_KEY, readFavoriteSlugs, toggleFavoriteSlug, writeFavoriteSlugs } from "@/lib/favorites";

type FavoritesContextValue = {
  favoriteSlugs: readonly string[];
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export default function FavoritesProvider({
  allowedSlugs,
  children,
}: {
  allowedSlugs: readonly string[];
  children: React.ReactNode;
}) {
  const store = useMemo(() => createFavoritesStore(allowedSlugs), [allowedSlugs]);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);

  const value = useMemo<FavoritesContextValue>(() => ({
    favoriteSlugs: snapshot.slugs,
    hydrated: snapshot.hydrated,
    isFavorite: (slug) => snapshot.slugs.includes(slug),
    toggleFavorite: store.toggle,
  }), [snapshot, store]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

const serverSnapshot = { slugs: [] as readonly string[], hydrated: false };
const getServerSnapshot = () => serverSnapshot;

function createFavoritesStore(allowedSlugs: readonly string[]) {
  let snapshot = serverSnapshot;
  const listeners = new Set<() => void>();

  const update = (slugs: readonly string[]) => {
    snapshot = { slugs, hydrated: true };
    listeners.forEach((listener) => listener());
  };

  const synchronizeTabs = (event: StorageEvent) => {
    if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
      update(readFavoriteSlugs(window.localStorage, allowedSlugs));
    }
  };

  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        window.addEventListener("storage", synchronizeTabs);
        update(readFavoriteSlugs(window.localStorage, allowedSlugs));
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", synchronizeTabs);
      };
    },
    toggle(slug: string) {
      const nextSlugs = toggleFavoriteSlug(snapshot.slugs, slug, allowedSlugs);
      writeFavoriteSlugs(window.localStorage, nextSlugs, allowedSlugs);
      update(nextSlugs);
    },
  };
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
  return context;
}
