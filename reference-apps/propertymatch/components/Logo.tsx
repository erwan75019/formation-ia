import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="PropertyMatch — accueil">
      <svg aria-hidden="true" viewBox="0 0 40 40"><path d="M5 19 20 6l15 13v16H24V24h-8v11H5Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M16 35V24h8v11" fill="none" stroke="#0A6A4A" strokeWidth="3"/></svg>
      <span>Property<span>Match</span></span>
    </Link>
  );
}
