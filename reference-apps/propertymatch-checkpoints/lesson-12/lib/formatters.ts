export function formatMonthlyRent(amount: number) {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} € / mois`;
}

export function formatSurface(surface: number) {
  return `${surface} m²`;
}

export function pluralize(value: number, singular: string, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}
