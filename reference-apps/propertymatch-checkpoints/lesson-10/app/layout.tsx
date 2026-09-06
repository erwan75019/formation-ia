import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropertyMatch — locations fictives",
  description: "Application locale fictive de recherche de locations immobilières.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="fr" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
