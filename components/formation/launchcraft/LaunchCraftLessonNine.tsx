import Link from "next/link";
import type { ReactNode } from "react";

import LessonCoach from "@/components/formation/LessonCoach";

function Panel({ title, children, tone = "white" }: { title: string; children: ReactNode; tone?: "white" | "navy" | "amber" }) {
  const colors = tone === "navy" ? "bg-[#07111f] text-white" : tone === "amber" ? "border border-amber-200 bg-amber-50 text-amber-950" : "bg-white text-slate-900";
  return <section className={`min-w-0 rounded-3xl p-7 shadow-sm ${colors}`}><h2 className="text-2xl font-bold">{title}</h2><div className="mt-5 space-y-4 leading-7">{children}</div></section>;
}

function CodeFile({ action, path, code }: { action: string; path: string; code: string }) {
  return <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200"><header className="flex flex-wrap justify-between gap-2 bg-slate-950 px-5 py-3 text-sm text-white"><strong>{action}</strong><code className="break-all">{path}</code></header><pre className="max-w-full overflow-x-auto bg-[#101d2d] p-5 text-xs leading-6 text-slate-100"><code>{code}</code></pre></article>;
}

const sidebarCode = `import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Vue d’ensemble" },
  { href: "/projets", label: "Projets" },
  { href: "/taches", label: "Tâches" },
  { href: "/calendrier", label: "Calendrier" },
];

export default function Sidebar({ firstName, email }: { firstName: string; email: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-[#0a1625] p-6 md:flex">
      <Link href="/dashboard" className="text-xl font-bold">LaunchCraft</Link>
      <nav aria-label="Navigation principale" className="mt-10 grid gap-2">
        {links.map((link) => <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 hover:bg-[#172638] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39d6a6]">{link.label}</Link>)}
      </nav>
      <div className="mt-auto min-w-0 rounded-xl bg-[#101d2d] p-4">
        <strong className="block truncate">{firstName}</strong>
        <small className="block truncate text-[#9cafc3]">{email}</small>
        <form action={signOut}><button className="mt-4 text-sm font-bold text-[#39d6a6]" type="submit">Se déconnecter</button></form>
      </div>
    </aside>
  );
}`;

const mobileHeaderCode = `"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/app/actions/auth";

const links = [{ href: "/dashboard", label: "Dashboard" }, { href: "/projets", label: "Projets" }, { href: "/taches", label: "Tâches" }, { href: "/calendrier", label: "Calendrier" }];

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a1625] p-4 md:hidden"><div className="flex items-center justify-between"><Link href="/dashboard" className="font-bold">LaunchCraft</Link><button type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)} className="rounded-lg border border-white/20 px-3 py-2">{open ? "Fermer le menu" : "Ouvrir le menu"}</button></div>{open && <nav id="mobile-navigation" aria-label="Navigation mobile" className="mt-4 grid gap-2">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-[#172638]">{link.label}</Link>)}<form action={signOut}><button className="w-full rounded-lg px-3 py-3 text-left text-[#39d6a6]">Se déconnecter</button></form></nav>}</header>;
}`;

const notFoundCode = `import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="grid min-h-screen place-items-center bg-[#07111f] p-6 text-center text-white"><section><p className="font-bold text-[#39d6a6]">RESSOURCE INACCESSIBLE</p><h1 className="mt-3 text-4xl font-bold">Page introuvable</h1><p className="mt-4 max-w-md text-[#9cafc3]">Cette ressource n’existe pas ou n’appartient pas à votre compte.</p><Link href="/dashboard" className="mt-7 inline-flex rounded-xl bg-[#7c5cfc] px-5 py-3 font-bold">Retour au dashboard</Link></section></main>;
}`;

const cssCode = `/* Ajouter à la fin du fichier existant. */
html { overflow-x: clip; }
button, input, select, textarea { font: inherit; }
:focus-visible { outline: 3px solid #39d6a6; outline-offset: 3px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}`;

const securityCommands = `npm run lint
npx tsc --noEmit
npm run build

# Rechercher les noms de secrets, jamais leurs valeurs :
rg "service_role|SUPABASE_SERVICE_ROLE_KEY|sk_live|sk_test" --glob '!node_modules/**' --glob '!.next/**'

# Vérifier que les fichiers locaux sensibles sont ignorés :
git check-ignore .env.local`;

const checklist = [
  "Les pages privées redirigent sans session.",
  "Chaque lecture privée utilise user.id et RLS.",
  "Aucun formulaire n’accepte user_id.",
  "Les UUID et longueurs sont validés côté serveur.",
  "Les mutations filtrent la ressource, son parent et user_id.",
  "Deux comptes ne voient et ne modifient jamais les mêmes données.",
  "Les erreurs affichées restent neutres et accessibles.",
  "Tous les contrôles sont utilisables au clavier avec un focus visible.",
  "Les vues 390, 768, 1024 et 1440 px ne débordent pas.",
  "Les états vide, chargement, erreur, succès et envoi sont présents.",
  "Lint, TypeScript et build terminent sans erreur.",
  "Inscription, connexion, projet, objectif, tâche, calendrier et déconnexion fonctionnent.",
];

export default function LaunchCraftLessonNine({ moduleProgress }: { lessonCompleted: boolean; moduleProgress: number }) {
  return <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8"><div className="mx-auto w-full max-w-7xl"><div className="flex flex-wrap justify-between gap-3 text-sm"><Link href="/formation/api-ia/08">← Leçon 08</Link><span>Checkpoint 09 / 9 · {moduleProgress} %</span></div><header className="mt-8 rounded-[32px] bg-[#07111f] p-8 text-white md:p-12"><p className="font-bold text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p><h1 className="mt-4 max-w-5xl text-4xl font-bold md:text-6xl">Sécuriser, tester et finaliser LaunchCraft</h1><p className="mt-5 max-w-3xl text-lg text-[#9cafc3]">Vérifiez l’application entière avec deux comptes, corrigez sa navigation cumulative et validez son accessibilité, ses états et son responsive.</p></header><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="min-w-0 space-y-7"><Panel title="Résultat final" tone="navy"><p>LaunchCraft possède une authentification réelle, des projets, objectifs et tâches isolés par compte, un dashboard calculé, un calendrier et une interface utilisable sur mobile comme au clavier. Aucun paiement ni appel IA n’est ajouté.</p></Panel><Panel title="1. Audit de sécurité"><ol className="list-decimal space-y-3 pl-5"><li>Ouvrez chaque route privée dans une fenêtre privée : dashboard, projets, fiche projet, tâches et calendrier doivent rediriger vers <code>/connexion</code>.</li><li>Dans VS Code, recherchez <code>auth.getUser()</code>, puis confirmez sa présence dans le helper d’accès et toutes les pages/actions sensibles.</li><li>Recherchez <code>service_role</code> et <code>user_id</code>. Aucun secret ni champ navigateur ne doit apparaître dans l’application.</li><li>Contrôlez les validateurs UUID, les listes exactes de champs et les limites de taille.</li><li>Pour chaque update/delete, vérifiez <code>id + project_id attendu + user_id</code> selon la ressource.</li><li>Dans Supabase → Authentication → Policies, relisez les politiques des quatre tables sans jamais utiliser une clé service_role dans LaunchCraft.</li><li>Vérifiez <code>getAll/setAll</code> dans le client serveur/proxy afin de préserver les cookies.</li></ol></Panel><Panel title="2. Test d’isolation avec deux comptes"><ol className="list-decimal space-y-3 pl-5"><li>Avec A, créez un projet, un objectif et une tâche ; copiez uniquement leurs UUID de développement.</li><li>Dans un autre profil de navigateur, connectez B : aucune donnée de A ne doit apparaître.</li><li>Avec B, ouvrez directement <code>/projets/[UUID-DE-A]</code> : la page doit être introuvable, sans révéler son titre.</li><li>Dans l’onglet Réseau des outils développeur, inspectez un formulaire de B. Si un UUID figure dans une action légitime, remplacez-le par celui de A puis renvoyez : la validation, les filtres et RLS doivent refuser l’opération.</li><li>Reconnectez A et confirmez que toutes ses données sont intactes.</li></ol><p>Dans Supabase, ouvrez les politiques et utilisez uniquement une session utilisateur de test pour vérifier les lignes. Ne placez jamais <code>service_role</code> dans l’application ou la console navigateur.</p></Panel><Panel title="3. Corriger la navigation cumulative"><p>Le checkpoint 08 avait simplifié la sidebar au point d’omettre l’identité et la déconnexion ajoutées au checkpoint 03. Remplacez entièrement ces deux fichiers pour conserver toutes les fonctions acquises.</p><div className="space-y-6"><CodeFile action="Remplacer entièrement" path="components/Sidebar.tsx" code={sidebarCode} /><CodeFile action="Remplacer entièrement" path="components/MobileHeader.tsx" code={mobileHeaderCode} /></div></Panel><Panel title="4. Accessibilité et page inaccessible"><p>Ajoutez une page neutre pour une ressource absente. Puis ajoutez les règles globales sans remplacer les styles LaunchCraft existants.</p><div className="space-y-6"><CodeFile action="Créer" path="app/not-found.tsx" code={notFoundCode} /><CodeFile action="Ajouter à la fin" path="app/globals.css" code={cssCode} /></div><ul className="list-disc space-y-2 pl-5"><li>Parcourez toute l’application avec Tab et Maj+Tab.</li><li>Chaque champ possède un label visible ; chaque erreur utilise <code>role=&quot;alert&quot;</code> et chaque succès <code>role=&quot;status&quot;</code> ou <code>aria-live</code>.</li><li>Les boutons d’envoi restent désactivés pendant <code>pending</code>.</li><li>Les suppressions demandent une confirmation et ne reposent jamais uniquement sur le corail.</li><li>Le calendrier expose ses boutons de jour, son mois précédent/suivant et ses états en texte.</li></ul></Panel><Panel title="5. Test responsive et états"><p>Dans les outils développeur du navigateur, testez successivement <strong>390, 768, 1024 et 1440 px</strong>. Vérifiez sidebar, menu mobile, formulaires, statistiques, listes, confirmations et calendrier. Aucun texte, bouton ou grille ne doit provoquer de défilement horizontal.</p><div className="grid gap-3 sm:grid-cols-2">{["Compte sans projet : état vide", "Chargement des listes", "Erreur réseau compréhensible", "Succès après création", "Bouton désactivé pendant l’envoi", "Double clic sans double mutation", "Suppression annulée puis confirmée", "UUID inaccessible : page introuvable", "Session expirée : retour connexion", "Calendrier au clavier"].map(item => <div key={item} className="rounded-xl border border-slate-200 p-4">□ {item}</div>)}</div></Panel><Panel title="6. Vérifications techniques"><p>Ouvrez le terminal dans le dossier LaunchCraft et exécutez chaque commande séparément. La recherche peut afficher les explications pédagogiques ; elle ne doit trouver aucune valeur secrète réelle.</p><CodeFile action="Exécuter dans le terminal" path="launchcraft/" code={securityCommands} /><p>Terminez par le parcours manuel : inscription → connexion → projet → objectif → tâche → dashboard → calendrier → déconnexion, puis recommencez avec une session expirée et en vue mobile.</p></Panel><Panel title="Checklist finale — sans effet sur la progression"><p>Cochez cette liste sur papier ou dans vos notes. Ces cases sont uniquement une vérification personnelle : elles n’écrivent rien dans AI Academy.</p><ul className="grid gap-3 sm:grid-cols-2">{checklist.map(item => <li key={item} className="rounded-xl border border-slate-200 p-4">□ {item}</li>)}</ul></Panel><Panel title="Erreurs fréquentes" tone="amber"><ul className="list-disc space-y-2 pl-5"><li><strong>Le test B réussit :</strong> contrôlez le filtre propriétaire et la politique RLS au lieu de masquer le bouton.</li><li><strong>Session apparemment active :</strong> ne faites pas confiance à localStorage ; utilisez <code>auth.getUser()</code>.</li><li><strong>Secret trouvé :</strong> retirez-le du fichier, renouvelez-le dans Supabase s’il a été exposé et vérifiez <code>.gitignore</code>.</li><li><strong>Erreur brute :</strong> journalisez seulement le minimum côté serveur et affichez un message neutre.</li><li><strong>Build différent du développement :</strong> corrigez l’erreur ; ne contournez pas <code>npm run build</code>.</li></ul></Panel><Link href="/formation/api-ia/09/exercice" className="inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white">Passer le QCM final sécurisé</Link></div><aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Panel title="Défense en profondeur"><ul className="list-disc space-y-2 pl-5"><li>Session vérifiée.</li><li>Entrées validées.</li><li>Parent rechargé.</li><li>Filtres de propriété.</li><li>RLS active.</li><li>Erreur neutre.</li></ul></Panel><LessonCoach lessonId="api-09-security" lessonLabel="LaunchCraft · Leçon 09" /></aside></div></div></main>;
}
