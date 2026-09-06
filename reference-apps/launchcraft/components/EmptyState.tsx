import Link from "next/link";
export default function EmptyState({title,description,href,label}:{title:string;description:string;href:string;label:string}){return <section className="empty-state"><span aria-hidden="true">◇</span><h2>{title}</h2><p>{description}</p><Link className="button primary" href={href}>{label}</Link></section>}
