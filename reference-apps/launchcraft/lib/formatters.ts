export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

export function formatProjectType(value: string) {
  return ({ formation: "Formation", service: "Service", marque: "Marque", produit: "Produit" } as Record<string, string>)[value] ?? value;
}
