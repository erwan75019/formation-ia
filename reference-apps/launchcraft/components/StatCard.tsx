export default function StatCard({ label, value, detail, tone = "violet" }: { label: string; value: string | number; detail: string; tone?: "violet" | "mint" | "coral" | "blue" }) {
  return <article className={`stat-card tone-${tone}`}><span aria-hidden="true" className="stat-orb"/><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}
