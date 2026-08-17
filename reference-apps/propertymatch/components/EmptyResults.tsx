import Link from "next/link";

export default function EmptyResults() {
  return <section className="empty-results"><span aria-hidden="true">⌂</span><h2>Aucune location ne correspond</h2><p>Choisissez une autre ville ou réinitialisez les critères pour afficher toutes les locations fictives.</p><Link href="/biens">Afficher les 15 locations</Link></section>;
}
