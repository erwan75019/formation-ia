"use client";
import Link from "next/link";
import { useState } from "react";
const links=[["/dashboard","Vue d’ensemble"],["/projets","Projets"],["/taches","Tâches"],["/calendrier","Calendrier"],["/parametres","Paramètres"]] as const;
export default function MobileHeader(){const[open,setOpen]=useState(false);return <header className="mobile-header"><Link className="brand" href="/dashboard"><span>LC</span><strong>LaunchCraft</strong></Link><button type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen((value)=>!value)}><span className="sr-only">{open?"Fermer":"Ouvrir"} le menu</span><i/><i/><i/></button>{open&&<nav id="mobile-menu" aria-label="Navigation mobile">{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}</header>}
