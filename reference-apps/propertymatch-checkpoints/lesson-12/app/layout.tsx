import type { Metadata } from "next";
import type { ReactNode } from "react";
import FavoritesProvider from "@/components/FavoritesProvider";
import { properties } from "@/data/properties";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropertyMatch — locations fictives",
  description: "Application locale fictive de recherche de locations immobilières.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const allowedSlugs = properties.map(({ slug }) => slug);
  return <html lang="fr" data-scroll-behavior="smooth"><body><FavoritesProvider allowedSlugs={allowedSlugs}>{children}</FavoritesProvider></body></html>;
}
