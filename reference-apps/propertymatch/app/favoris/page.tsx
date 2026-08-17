import type { Metadata } from "next";
import FavoritesGrid from "@/components/FavoritesGrid";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { properties } from "@/data/properties";

export const metadata: Metadata = {
  title: "Mes favoris | PropertyMatch",
  description: "Les locations fictives enregistrées localement dans votre navigateur.",
};

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="favorites-page">
        <p className="eyebrow dark">Stockage local</p>
        <h1>Mes favoris</h1>
        <p className="favorites-intro">Cette sélection reste uniquement dans votre navigateur. Aucun compte ni envoi distant n’est utilisé.</p>
        <FavoritesGrid properties={properties} />
      </main>
      <Footer />
    </>
  );
}
