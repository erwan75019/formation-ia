import type { Property } from "@/types/property";
import { formatSurface, pluralize } from "@/lib/formatters";

function formatFloor(floor: number | null, propertyType: Property["propertyType"]) {
  if (propertyType === "maison" || floor === null) return "Non applicable";
  if (floor === 0) return "Rez-de-chaussée";
  return `${floor}${floor === 1 ? "er" : "e"} étage`;
}

export default function PropertyFacts({ property }: { property: Property }) {
  const facts = [
    ["Surface", formatSurface(property.surface)],
    ["Chambres", pluralize(property.bedrooms, "chambre")],
    ["Salle de bain", pluralize(property.bathrooms, "salle de bain")],
    ["Balcon", property.balcony ? "Oui" : "Non"],
    ["Type", property.propertyType],
    ["Étage", formatFloor(property.floor, property.propertyType)],
    ["Location", property.furnished ? "Meublée" : "Non meublée"],
  ] as const;

  return (
    <dl className="property-facts">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

