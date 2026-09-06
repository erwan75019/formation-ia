import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import { coveredCities, featuredProperties, properties } from "@/data/properties";

export default function HomePage() {
  return <><Header /><main id="main-content" tabIndex={-1}><Hero /><StatsStrip propertyCount={properties.length} cityCount={coveredCities.length} /><FeaturedProperties properties={featuredProperties} /></main><Footer /></>;
}
