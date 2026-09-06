"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

const links = [{ href: "/", label: "Accueil" }, { href: "/biens", label: "Biens" }, { href: "/#a-propos", label: "À propos" }];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link className="skip-link" href="#main-content" onClick={() => document.getElementById("main-content")?.focus()}>Aller au contenu principal</Link>
      <div className="header-inner">
        <Logo />
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((value) => !value)}><span className="sr-only">{open ? "Fermer" : "Ouvrir"} la navigation</span><span/><span/><span/></button>
        <nav className="desktop-nav" aria-label="Navigation principale">{links.map((link) => { const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href); return <Link className={active ? "active" : ""} aria-current={active ? "page" : undefined} href={link.href} key={link.label}>{link.label}</Link>; })}</nav>
        <Link className="account-placeholder" href="/biens"><SearchIcon /> Explorer les biens</Link>
      </div>
      {open && <nav id="mobile-nav" className="mobile-nav" aria-label="Navigation mobile">{links.map((link) => { const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href); return <Link aria-current={active ? "page" : undefined} href={link.href} key={link.label} onClick={() => setOpen(false)}>{link.label}</Link>; })}</nav>}
    </header>
  );
}

function SearchIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>; }
