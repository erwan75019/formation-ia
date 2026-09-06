import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyDetail from "@/components/PropertyDetail";
import { coveredCities, properties } from "@/data/properties";
import { calculateCompatibility } from "@/lib/matching";
import { buildPropertyReturnUrl } from "@/lib/property-navigation";
import { findPropertyBySlug } from "@/lib/properties";
import { parseSearchParameters, type SearchParameters } from "@/lib/search";

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParameters>;
};

export function generateStaticParams() {
  return properties.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = findPropertyBySlug(properties, (await params).slug);
  if (!property) notFound();
  return {
    title: `${property.title} à louer | PropertyMatch`,
    description: `${property.propertyType} fictif de ${property.surface} m² à ${property.city}, proposé à ${property.monthlyRent} € par mois dans la démonstration PropertyMatch.`,
  };
}

export default async function PropertyPage({ params, searchParams }: PropertyPageProps) {
  const property = findPropertyBySlug(properties, (await params).slug);
  if (!property) notFound();

  const rawSearchParameters = await searchParams;
  const searchState = parseSearchParameters(rawSearchParameters, coveredCities);
  const resultsUrl = buildPropertyReturnUrl(rawSearchParameters, searchState);

  return (
    <>
      <Header />
      <PropertyDetail
        property={property}
        compatibility={calculateCompatibility(property, searchState.criteria)}
        resultsUrl={resultsUrl}
        invalidParameters={searchState.invalidParameters}
      />
      <Footer />
    </>
  );
}
