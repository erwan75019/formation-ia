export const lessonThreePageCode = `export default function HomePage() {
  return (
    <>
      <header>
        <a href="#accueil">PropertyMatch</a>
        <nav aria-label="Navigation principale">
          <a href="#accueil">Accueil</a>
          <a href="#biens">Biens</a>
          <a href="#favoris">Favoris</a>
          <a href="#a-propos">À propos</a>
        </nav>
      </header>
      <main id="accueil">
        <section aria-labelledby="hero-title">
          <p>Votre recherche de location, simplement</p>
          <h1 id="hero-title">Trouvez le logement qui vous correspond vraiment</h1>
          <p>Définissez vos critères pour préparer une recherche claire parmi les futurs logements fictifs de PropertyMatch.</p>
          <form aria-label="Critères de recherche">
            <div><label htmlFor="ville">Ville</label><select id="ville" name="ville" defaultValue=""><option value="">Toutes les villes</option></select></div>
            <div><label htmlFor="budget">Budget mensuel maximum</label><input id="budget" name="budget" type="number" min="0" placeholder="2 000 € / mois" /></div>
            <div><label htmlFor="chambres">Chambres minimum</label><select id="chambres" name="chambres" defaultValue=""><option value="">Indifférent</option></select></div>
            <div><label htmlFor="balcon">Balcon</label><select id="balcon" name="balcon" defaultValue="indifferent"><option value="indifferent">Indifférent</option><option value="oui">Obligatoire</option></select></div>
            <button type="button">Rechercher</button>
          </form>
        </section>
        <section aria-labelledby="indicators-title"><h2 id="indicators-title">Le projet en un coup d’œil</h2><ul><li>Locations fictives et locales</li><li>Quatre critères de recherche prévus</li><li>Aucune donnée personnelle</li></ul></section>
        <section id="biens" aria-labelledby="properties-title"><h2 id="properties-title">Logements à venir</h2><p>Les données et les cartes seront ajoutées dans les prochaines leçons.</p></section>
        <section id="favoris" aria-labelledby="favorites-title"><h2 id="favorites-title">Favoris à venir</h2><p>Cette fonctionnalité sera construite plus tard dans le module.</p></section>
      </main>
      <footer id="a-propos"><p>PropertyMatch — application pédagogique de locations fictives.</p></footer>
    </>
  );
}
`;

export const lessonFourGlobalsCode = `@import "tailwindcss";

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #fafaf8; color: #06182f; font-family: Arial, sans-serif; }
a { color: inherit; text-decoration: none; }
button, input, select { font: inherit; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {
  outline: 3px solid #31a37c;
  outline-offset: 3px;
}
`;

export const lessonFourPageCode = `export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#06182f]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[74px] max-w-[1440px] flex-col justify-center gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8 lg:px-16">
          <a href="#accueil" className="text-2xl font-extrabold">Property<span className="text-[#07583f]">Match</span></a>
          <nav aria-label="Navigation principale" className="flex flex-wrap gap-5 text-sm font-semibold md:gap-8">
            <a href="#accueil" className="hover:text-[#07583f]">Accueil</a><a href="#biens" className="hover:text-[#07583f]">Biens</a><a href="#favoris" className="hover:text-[#07583f]">Favoris</a><a href="#a-propos" className="hover:text-[#07583f]">À propos</a>
          </nav>
        </div>
      </header>
      <main id="accueil">
        <section aria-labelledby="hero-title" className="bg-[#06182f] text-white">
          <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Votre recherche de location, simplement</p>
            <h1 id="hero-title" className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">Trouvez le logement qui vous correspond vraiment</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Définissez vos critères pour préparer une recherche claire parmi les futurs logements fictifs de PropertyMatch.</p>
            <form aria-label="Critères de recherche" className="mt-8 rounded-2xl bg-white p-5 text-[#06182f] shadow-xl">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-2 text-sm font-bold">Ville<select name="ville" defaultValue="" className="min-h-11 rounded-lg border border-slate-300 px-3"><option value="">Toutes les villes</option></select></label>
                <label className="grid gap-2 text-sm font-bold">Budget mensuel maximum<input name="budget" type="number" min="0" placeholder="2 000 € / mois" className="min-h-11 rounded-lg border border-slate-300 px-3" /></label>
                <label className="grid gap-2 text-sm font-bold">Chambres minimum<select name="chambres" defaultValue="" className="min-h-11 rounded-lg border border-slate-300 px-3"><option value="">Indifférent</option></select></label>
                <label className="grid gap-2 text-sm font-bold">Balcon<select name="balcon" defaultValue="indifferent" className="min-h-11 rounded-lg border border-slate-300 px-3"><option value="indifferent">Indifférent</option><option value="oui">Obligatoire</option></select></label>
              </div>
              <button type="button" className="mt-5 min-h-12 w-full rounded-lg bg-[#07583f] font-bold text-white hover:bg-[#0a6a4a]">Rechercher</button>
            </form>
          </div>
        </section>
        <section aria-labelledby="indicators-title" className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 lg:px-16"><h2 id="indicators-title" className="text-2xl font-bold">Le projet en un coup d’œil</h2><ul className="mt-5 grid gap-4 md:grid-cols-3"><li className="rounded-xl bg-slate-50 p-4">Locations fictives et locales</li><li className="rounded-xl bg-slate-50 p-4">Quatre critères prévus</li><li className="rounded-xl bg-slate-50 p-4">Aucune donnée personnelle</li></ul></div></section>
        <section id="biens" aria-labelledby="properties-title" className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 lg:px-16"><h2 id="properties-title" className="text-3xl font-bold">Logements à venir</h2><div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Les données et les cartes seront ajoutées dans les prochaines leçons.</div></section>
        <section id="favoris" aria-labelledby="favorites-title" className="sr-only"><h2 id="favorites-title">Favoris à venir</h2></section>
      </main>
      <footer id="a-propos" className="bg-[#06182f] px-5 py-10 text-slate-300"><div className="mx-auto max-w-[1312px]"><strong className="text-white">PropertyMatch</strong><p className="mt-2">Application pédagogique de locations fictives.</p></div></footer>
    </div>
  );
}
`;

export const lessonFiveTypeCode = `export type Property = {
  id: string;
  slug: string;
  title: string;
  city: string;
  monthlyRent: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  hasBalcony: boolean;
  imagePath: string;
  imageAlt: string;
};
`;

export const lessonFiveStarterDataCode = `import type { Property } from "@/types/property";

export const properties: Property[] = [
  { id: "pm-001", slug: "lumineux-bastille", title: "Appartement lumineux près de Bastille", city: "Paris", monthlyRent: 2450, surface: 62, bedrooms: 2, bathrooms: 1, hasBalcony: true, imagePath: "/properties/paris-apartment.jpg", imageAlt: "Salon lumineux d’un appartement parisien fictif proposé à la location" },
  { id: "pm-002", slug: "atelier-convention", title: "Atelier calme à Convention", city: "Paris", monthlyRent: 2300, surface: 58, bedrooms: 2, bathrooms: 1, hasBalcony: true, imagePath: "/properties/lyon-modern.jpg", imageAlt: "Séjour moderne avec cuisine ouverte et balcon d’une location fictive" },
  { id: "pm-003", slug: "charme-montmartre", title: "Charme ancien à Montmartre", city: "Paris", monthlyRent: 2150, surface: 55, bedrooms: 2, bathrooms: 1, hasBalcony: false, imagePath: "/properties/bordeaux-stone.jpg", imageAlt: "Séjour aux murs en pierre d’une location fictive" },
];
`;

export const lessonFiveDataCode = `import type { Property } from "@/types/property";

export const properties: Property[] = [
  { id: "pm-001", slug: "lumineux-bastille", title: "Appartement lumineux près de Bastille", city: "Paris", monthlyRent: 2450, surface: 62, bedrooms: 2, bathrooms: 1, hasBalcony: true, imagePath: "/properties/paris-apartment.jpg", imageAlt: "Salon lumineux d’un appartement parisien fictif proposé à la location" },
  { id: "pm-002", slug: "atelier-convention", title: "Atelier calme à Convention", city: "Paris", monthlyRent: 2300, surface: 58, bedrooms: 2, bathrooms: 1, hasBalcony: true, imagePath: "/properties/lyon-modern.jpg", imageAlt: "Séjour moderne avec cuisine ouverte et balcon d’une location fictive" },
  { id: "pm-003", slug: "charme-montmartre", title: "Charme ancien à Montmartre", city: "Paris", monthlyRent: 2150, surface: 55, bedrooms: 2, bathrooms: 1, hasBalcony: false, imagePath: "/properties/bordeaux-stone.jpg", imageAlt: "Séjour aux murs en pierre d’une location fictive" },
  { id: "pm-004", slug: "studio-croix-rousse", title: "Studio à la Croix-Rousse", city: "Lyon", monthlyRent: 890, surface: 28, bedrooms: 0, bathrooms: 1, hasBalcony: false, imagePath: "/properties/lille-studio.jpg", imageAlt: "Studio locatif fictif avec coin nuit, bureau et cuisine compacte" },
  { id: "pm-005", slug: "familial-brotteaux", title: "Appartement familial aux Brotteaux", city: "Lyon", monthlyRent: 1780, surface: 91, bedrooms: 3, bathrooms: 2, hasBalcony: true, imagePath: "/properties/lyon-modern.jpg", imageAlt: "Séjour moderne d’un appartement familial fictif à Lyon" },
  { id: "pm-006", slug: "terrasse-chartrons", title: "Deux-pièces avec terrasse", city: "Bordeaux", monthlyRent: 1260, surface: 44, bedrooms: 1, bathrooms: 1, hasBalcony: true, imagePath: "/properties/bordeaux-stone.jpg", imageAlt: "Séjour en pierre d’un deux-pièces fictif à Bordeaux" },
  { id: "pm-007", slug: "maison-cauderan", title: "Maison calme à Caudéran", city: "Bordeaux", monthlyRent: 2400, surface: 128, bedrooms: 4, bathrooms: 2, hasBalcony: false, imagePath: "/properties/bordeaux-stone.jpg", imageAlt: "Pièce de vie en pierre d’une maison fictive à Bordeaux" },
  { id: "pm-008", slug: "vue-vieux-port", title: "Appartement près du Vieux-Port", city: "Marseille", monthlyRent: 1420, surface: 64, bedrooms: 2, bathrooms: 1, hasBalcony: true, imagePath: "/properties/lyon-modern.jpg", imageAlt: "Séjour moderne avec balcon d’une location fictive à Marseille" },
  { id: "pm-009", slug: "studio-castellane", title: "Studio pratique à Castellane", city: "Marseille", monthlyRent: 720, surface: 24, bedrooms: 0, bathrooms: 1, hasBalcony: false, imagePath: "/properties/lille-studio.jpg", imageAlt: "Studio fictif compact avec coin nuit et bureau à Marseille" },
  { id: "pm-010", slug: "t3-saint-cyprien", title: "T3 à Saint-Cyprien", city: "Toulouse", monthlyRent: 1180, surface: 67, bedrooms: 2, bathrooms: 1, hasBalcony: true, imagePath: "/properties/lyon-modern.jpg", imageAlt: "Séjour moderne avec balcon d’un T3 fictif à Toulouse" },
  { id: "pm-011", slug: "maison-rangueil", title: "Petite maison à Rangueil", city: "Toulouse", monthlyRent: 1650, surface: 98, bedrooms: 3, bathrooms: 2, hasBalcony: false, imagePath: "/properties/bordeaux-stone.jpg", imageAlt: "Pièce de vie d’une petite maison fictive à Toulouse" },
  { id: "pm-012", slug: "duplex-centre", title: "Duplex au centre-ville", city: "Nantes", monthlyRent: 1360, surface: 71, bedrooms: 2, bathrooms: 1, hasBalcony: false, imagePath: "/properties/paris-apartment.jpg", imageAlt: "Salon lumineux d’un duplex fictif à Nantes" },
  { id: "pm-013", slug: "ile-de-nantes", title: "Appartement sur l’île de Nantes", city: "Nantes", monthlyRent: 1090, surface: 48, bedrooms: 1, bathrooms: 1, hasBalcony: true, imagePath: "/properties/lyon-modern.jpg", imageAlt: "Séjour moderne avec loggia d’une location fictive à Nantes" },
  { id: "pm-014", slug: "wazemmes-renove", title: "T2 rénové à Wazemmes", city: "Lille", monthlyRent: 940, surface: 41, bedrooms: 1, bathrooms: 1, hasBalcony: false, imagePath: "/properties/lille-studio.jpg", imageAlt: "T2 locatif fictif rénové avec cuisine compacte à Lille" },
  { id: "pm-015", slug: "vauban-familial", title: "Appartement familial à Vauban", city: "Lille", monthlyRent: 1540, surface: 84, bedrooms: 3, bathrooms: 1, hasBalcony: true, imagePath: "/properties/lille-studio.jpg", imageAlt: "Appartement familial fictif avec balcon à Lille" },
];
`;

export const lessonFivePageCode = `import { properties } from "@/data/properties";

${lessonFourPageCode.replace("export default function HomePage()", "export default function HomePage()").replace("Locations fictives et locales", "{properties.length} locations fictives et locales")}`;

export const lessonSixComponents = {
  "components/Logo.tsx": `export default function Logo() { return <a href="#accueil" className="text-2xl font-extrabold">Property<span className="text-[#07583f]">Match</span></a>; }`,
  "components/Header.tsx": `import Logo from "@/components/Logo"; export default function Header() { return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex min-h-[74px] max-w-[1440px] flex-col justify-center gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8 lg:px-16"><Logo /><nav aria-label="Navigation principale" className="flex flex-wrap gap-5 text-sm font-semibold md:gap-8"><a href="#accueil">Accueil</a><a href="#biens">Biens</a><a href="#favoris">Favoris</a><a href="#a-propos">À propos</a></nav></div></header>; }`,
  "components/SearchForm.tsx": `export default function SearchForm() { return <form aria-label="Critères de recherche" className="mt-8 rounded-2xl bg-white p-5 text-[#06182f] shadow-xl"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><label className="grid gap-2 text-sm font-bold">Ville<select defaultValue="" className="min-h-11 rounded-lg border px-3"><option value="">Toutes les villes</option></select></label><label className="grid gap-2 text-sm font-bold">Budget mensuel maximum<input type="number" className="min-h-11 rounded-lg border px-3" /></label><label className="grid gap-2 text-sm font-bold">Chambres minimum<select defaultValue="" className="min-h-11 rounded-lg border px-3"><option value="">Indifférent</option></select></label><label className="grid gap-2 text-sm font-bold">Balcon<select defaultValue="indifferent" className="min-h-11 rounded-lg border px-3"><option value="indifferent">Indifférent</option></select></label></div><button type="button" className="mt-5 min-h-12 w-full rounded-lg bg-[#07583f] font-bold text-white">Rechercher</button></form>; }`,
  "components/Hero.tsx": `import SearchForm from "@/components/SearchForm"; export default function Hero() { return <section id="accueil" className="bg-[#06182f] text-white"><div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16 lg:px-16"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Votre recherche de location, simplement</p><h1 className="mt-4 max-w-3xl text-4xl font-extrabold md:text-5xl">Trouvez le logement qui vous correspond vraiment</h1><p className="mt-4 text-slate-300">Définissez vos critères parmi des locations fictives.</p><SearchForm /></div></section>; }`,
  "components/StatsStrip.tsx": `import { properties } from "@/data/properties"; export default function StatsStrip() { return <section className="border-b bg-white"><div className="mx-auto max-w-[1440px] px-5 py-8"><h2 className="text-2xl font-bold">Le projet en un coup d’œil</h2><ul className="mt-5 grid gap-4 md:grid-cols-3"><li>{properties.length} locations fictives et locales</li><li>Quatre critères prévus</li><li>Aucune donnée personnelle</li></ul></div></section>; }`,
  "components/FeaturedProperties.tsx": `export default function FeaturedProperties() { return <section id="biens" className="mx-auto max-w-[1440px] px-5 py-12"><h2 className="text-3xl font-bold">Logements à venir</h2><div className="mt-6 rounded-2xl border border-dashed p-10 text-center">Les cartes seront ajoutées à la leçon 7.</div></section>; }`,
  "components/Footer.tsx": `export default function Footer() { return <footer id="a-propos" className="bg-[#06182f] px-5 py-10 text-slate-300"><div className="mx-auto max-w-[1312px]"><strong className="text-white">PropertyMatch</strong><p>Application pédagogique de locations fictives.</p></div></footer>; }`,
} as const;

export const lessonSixPageCode = `import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";

export default function HomePage() {
  return <><Header /><main><Hero /><StatsStrip /><FeaturedProperties /></main><Footer /></>;
}
`;
