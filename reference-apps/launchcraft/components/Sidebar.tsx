"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const links = [{ href: "/dashboard", label: "Vue d’ensemble", icon: "◫" }, { href: "/projets", label: "Projets", icon: "◇" }, { href: "/taches", label: "Tâches", icon: "✓" }, { href: "/calendrier", label: "Calendrier", icon: "□" }, { href: "/parametres", label: "Paramètres", icon: "⚙" }];
export default function Sidebar({firstName,email}:{firstName:string;email:string}) { const pathname = usePathname(); const initials=firstName.slice(0,2).toUpperCase()||"LC"; return <aside className="sidebar"><Link className="brand" href="/dashboard"><span>LC</span><strong>LaunchCraft</strong></Link><p className="nav-label">ESPACE DE TRAVAIL</p><nav aria-label="Navigation principale">{links.map((link)=>{const active=pathname.startsWith(link.href);return <Link href={link.href} key={link.href} className={active?"active":""} aria-current={active?"page":undefined}><span aria-hidden="true">{link.icon}</span>{link.label}</Link>;})}</nav><div className="sidebar-profile"><span>{initials}</span><div><strong>{firstName||"Mon profil"}</strong><small>{email}</small></div></div><form action={signOut}><button className="sidebar-signout" type="submit">Se déconnecter</button></form></aside>; }
