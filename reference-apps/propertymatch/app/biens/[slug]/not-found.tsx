import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Logement introuvable | PropertyMatch" };

export default function PropertyNotFound() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="property-not-found">
        <p className="eyebrow dark">PropertyMatch</p>
        <h1>Logement introuvable</h1>
        <p>Ce logement fictif n’existe pas ou n’est plus présent dans les données locales de démonstration.</p>
        <Link href="/biens">Voir les locations</Link>
      </main>
      <Footer />
    </>
  );
}
