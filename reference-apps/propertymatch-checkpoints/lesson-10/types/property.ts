export type PropertyImage = {
  src: string;
  alt: string;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  balcony: boolean;
  propertyType: "appartement" | "maison" | "studio";
  floor: number | null;
  furnished: boolean;
  availability: string;
  description: string;
  features: readonly string[];
  images: readonly PropertyImage[];
  featured: boolean;
};
