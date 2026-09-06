type Props = { propertyCount: number; cityCount: number };

export default function StatsStrip({ propertyCount, cityCount }: Props) {
  const stats = [
    [String(propertyCount), "locations fictives"],
    [String(cityCount), "villes couvertes"],
    ["4", "critères de recherche"],
    ["100 %", "données locales et fictives"],
  ];
  return <section className="stats" aria-label="Informations sur les données de démonstration"><div className="stats-inner">{stats.map(([value, label]) => <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>;
}
