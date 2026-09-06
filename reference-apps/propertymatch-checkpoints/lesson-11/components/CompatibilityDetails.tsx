import type { CompatibilityResult } from "@/lib/matching";

const formatPoints = (points: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(points);

export default function CompatibilityDetails({ result }: { result: CompatibilityResult }) {
  if (result.score === null) {
    return <p className="compatibility-empty">{result.emptyMessage}</p>;
  }

  return (
    <div className="compatibility">
      <div className="compatibility-summary">
        <strong>{result.score} % compatible</strong>
        <span>{result.label}</span>
      </div>
      <details>
        <summary>Pourquoi ce score ?</summary>
        <ul>
          {result.criteria.map((criterion) => (
            <li key={criterion.key}>
              <div><strong>{criterion.label}</strong><span>{formatPoints(criterion.pointsEarned)} / {criterion.pointsPossible} points</span></div>
              <p>{criterion.explanation}</p>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
