import Link from "next/link";

import LessonCoach from "@/components/formation/LessonCoach";

const files = [
  {
    path: "app/globals.css",
    action: "Remplacer entièrement",
    code: `@import "tailwindcss";

:root {
  --background: #07111f;
  --surface: #101d2d;
  --raised: #172638;
  --violet: #7c5cfc;
  --mint: #39d6a6;
  --text: #f7f8fa;
  --muted: #9cafc3;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

:focus-visible {
  outline: 3px solid var(--mint);
  outline-offset: 3px;
}`,
  },
  {
    path: "app/layout.tsx",
    action: "Remplacer entièrement",
    code: `import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchCraft",
  description: "Organisez le lancement de vos projets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}`,
  },
  {
    path: "components/AppShell.tsx",
    action: "Créer",
    code: `import type { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07111f] text-[#f7f8fa]">
      <Sidebar />
      <MobileHeader />
      <div className="min-h-screen md:ml-64">
        {children}
      </div>
    </div>
  );
}`,
  },
  {
    path: "components/Sidebar.tsx",
    action: "Créer",
    code: `import Link from "next/link";

const futureSections = ["Projets", "Tâches", "Calendrier", "Paramètres"];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0a1625] p-6 md:flex md:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 text-xl font-bold">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#7c5cfc] text-sm">
          LC
        </span>
        LaunchCraft
      </Link>

      <p className="mt-12 text-xs font-bold tracking-[0.18em] text-[#9cafc3]">
        ESPACE DE TRAVAIL
      </p>

      <nav aria-label="Navigation principale" className="mt-4 grid gap-2">
        <Link href="/dashboard" className="rounded-xl bg-[#172638] px-4 py-3 font-semibold">
          Vue d’ensemble
        </Link>
        {futureSections.map((label) => (
          <span key={label} aria-disabled="true" className="rounded-xl px-4 py-3 text-[#9cafc3]">
            {label} · bientôt
          </span>
        ))}
      </nav>

      <p className="mt-auto rounded-xl border border-white/10 bg-[#101d2d] p-4 text-sm text-[#9cafc3]">
        Version locale de départ
      </p>
    </aside>
  );
}`,
  },
  {
    path: "components/MobileHeader.tsx",
    action: "Créer",
    code: `"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a1625] p-4 md:hidden">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="font-bold">LaunchCraft</Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-white/15 px-3 py-2"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" aria-label="Navigation mobile" className="mt-4">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg bg-[#172638] p-3">
            Vue d’ensemble
          </Link>
        </nav>
      )}
    </header>
  );
}`,
  },
  {
    path: "app/dashboard/page.tsx",
    action: "Créer",
    code: `import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <p className="text-xs font-bold tracking-[0.18em] text-[#39d6a6]">
          TABLEAU DE BORD
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">
          Préparez votre prochain lancement.
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-[#9cafc3]">
          La structure de LaunchCraft est prête. Les projets, objectifs et tâches seront ajoutés dans les prochaines leçons.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Projets actifs", "0"],
            ["Tâches terminées", "0"],
            ["Prochaine échéance", "À définir"],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-[#101d2d] p-6 shadow-xl">
              <p className="text-sm text-[#9cafc3]">{label}</p>
              <p className="mt-5 text-3xl font-bold">{value}</p>
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}`,
  },
  {
    path: "app/page.tsx",
    action: "Remplacer entièrement",
    code: `import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}`,
  },
] as const;

export default function LaunchCraftLessonOne({
  lessonCompleted,
  moduleProgress,
}: {
  lessonCompleted: boolean;
  moduleProgress: number;
}) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/formation/api-ia" className="text-sm font-semibold text-slate-600">
            ← Retour au module
          </Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Leçon 01 · Progression du module {moduleProgress} %
          </span>
        </div>

        <header className="mt-10 rounded-[32px] bg-[#07111f] p-8 text-white shadow-xl md:p-12">
          <p className="text-xs font-bold tracking-[0.2em] text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">
            Créer la structure de l’application et son interface initiale
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#9cafc3]">
            Vous allez créer un nouveau projet Next.js, comprendre son arborescence puis construire le premier écran sombre et responsive de LaunchCraft.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <LessonBlock title="Résultat visible" tone="violet">
              À la fin, l’adresse <code>http://localhost:3000</code> redirige vers <code>/dashboard</code>. Sur ordinateur, une barre latérale apparaît ; sur mobile, elle est remplacée par un bouton Menu. Les trois statistiques restent honnêtement à zéro.
            </LessonBlock>

            <LessonBlock title="Avant de commencer">
              <ul className="list-disc space-y-2 pl-5">
                <li>PropertyMatch et le module 6 doivent être terminés.</li>
                <li>Node.js, npm et VS Code sont déjà installés.</li>
                <li>Fermez le serveur PropertyMatch avec <kbd>Ctrl + C</kbd> pour libérer le port 3000.</li>
                <li>LaunchCraft est un nouveau dossier indépendant : ne modifiez pas PropertyMatch.</li>
              </ul>
            </LessonBlock>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE 1</p>
              <h2 className="mt-3 text-2xl font-bold">Créer le projet dans le terminal</h2>
              <ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-slate-700">
                <li>Ouvrez VS Code, puis choisissez <strong>Terminal → Nouveau terminal</strong>.</li>
                <li>Placez-vous dans votre dossier parent <code>mes-projets</code>.</li>
                <li>Copiez la commande ci-dessous sans recopier le symbole <code>$</code>.</li>
              </ol>
              <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100"><code>npx create-next-app@latest launchcraft --typescript --tailwind --eslint --app --no-src-dir --import-alias=&quot;@/*&quot;</code></pre>
              <p className="mt-4 leading-7 text-slate-600">
                <code>create-next-app</code> crée le dossier, TypeScript vérifie les types, Tailwind sert au design et App Router organise les pages dans <code>app</code>.
              </p>
              <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-100 p-5 text-sm"><code>{`mes-projets/
└── launchcraft/
    ├── app/
    ├── public/
    ├── package.json
    └── tsconfig.json`}</code></pre>
              <Check>Dans le terminal, exécutez <code>cd launchcraft</code>, puis <code>npm run dev</code>. Ouvrez <code>http://localhost:3000</code> : la page Next.js de départ doit apparaître.</Check>
              <ErrorHelp cause="Vous voyez “port 3000 is already in use”." solution="Revenez au terminal de PropertyMatch, appuyez sur Ctrl + C, puis relancez npm run dev dans launchcraft." />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE 2</p>
              <h2 className="mt-3 text-2xl font-bold">Construire le shell, fichier par fichier</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Dans l’Explorateur de VS Code, créez d’abord le dossier <code>components</code>. Appliquez ensuite chaque action exactement dans l’ordre. « Remplacer entièrement » signifie sélectionner tout le fichier avant de coller le bloc complet.
              </p>
              <div className="mt-7 space-y-8">
                {files.map((file, index) => (
                  <CodeFile key={file.path} index={index + 1} {...file} />
                ))}
              </div>
            </section>

            <LessonBlock title="Comprendre les éléments importants">
              <dl className="space-y-4">
                <Explanation term="layout.tsx">Il entoure toutes les pages et définit la langue, le titre et les styles globaux.</Explanation>
                <Explanation term="AppShell">Il assemble la navigation et la zone dans laquelle chaque page sera affichée.</Explanation>
                <Explanation term="use client">MobileHeader utilise un clic et un état React ; il doit donc fonctionner dans le navigateur.</Explanation>
                <Explanation term="md:">Ce préfixe Tailwind applique une règle à partir de la largeur tablette. La sidebar est masquée avant cette largeur.</Explanation>
                <Explanation term="redirect">La page racine n’affiche rien : Next.js envoie directement le visiteur vers le dashboard.</Explanation>
              </dl>
            </LessonBlock>

            <LessonBlock title="Vérification guidée" tone="mint">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enregistrez tous les fichiers avec <kbd>Cmd + S</kbd> sur Mac ou <kbd>Ctrl + S</kbd> sur Windows.</li>
                <li>Vérifiez que le terminal affiche <code>Ready</code> sans erreur rouge.</li>
                <li>Ouvrez <code>http://localhost:3000</code> : l’URL doit devenir <code>/dashboard</code>.</li>
                <li>Élargissez la fenêtre : la sidebar apparaît.</li>
                <li>Réduisez-la : le bouton Menu apparaît et s’ouvre au clavier.</li>
              </ol>
            </LessonBlock>

            <LessonBlock title="Mini-exercice">
              Sans modifier la structure, remplacez le texte « Préparez votre prochain lancement » par une phrase liée à votre propre projet. Enregistrez et vérifiez que seul le grand titre change. Remettez ensuite le titre d’origine pour conserver le checkpoint commun.
            </LessonBlock>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Valider la leçon</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Le QCM vérifie la structure que vous venez de construire. Le score est calculé sur le serveur et 70 % sont nécessaires.
              </p>
              {lessonCompleted ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-xl bg-emerald-100 px-5 py-3 font-semibold text-emerald-800">Leçon validée ✓</span>
                  <Link href="/formation/api-ia/02" className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Continuer vers la leçon 02 →</Link>
                </div>
              ) : (
                <Link href="/formation/api-ia/01/exercice" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Faire le QCM sécurisé →</Link>
              )}
            </section>
          </div>

          <LessonCoach lessonId="api-01-intro" lessonLabel="LaunchCraft · Leçon 01" />
        </div>
      </div>
    </main>
  );
}

function LessonBlock({ title, children, tone = "default" }: { title: string; children: React.ReactNode; tone?: "default" | "violet" | "mint" }) {
  const colors = tone === "violet" ? "border-violet-200 bg-violet-50" : tone === "mint" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white";
  return <section className={`rounded-3xl border p-7 shadow-sm ${colors}`}><h2 className="text-2xl font-bold">{title}</h2><div className="mt-4 leading-7 text-slate-700">{children}</div></section>;
}

function CodeFile({ index, path, action, code }: { index: number; path: string; action: string; code: string }) {
  return <article><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">{index}. <code>{path}</code></h3><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">{action}</span></div><pre className="mt-3 max-h-[520px] overflow-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100"><code>{code}</code></pre><Check>Enregistrez ce fichier. Si le terminal signale une erreur, vérifiez d’abord le chemin et les imports avant de continuer.</Check></article>;
}

function Check({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><strong>Ce que vous devez vérifier — </strong>{children}</div>;
}

function ErrorHelp({ cause, solution }: { cause: string; solution: string }) {
  return <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900"><strong>Erreur fréquente :</strong> {cause}<br /><strong>Solution :</strong> {solution}</div>;
}

function Explanation({ term, children }: { term: string; children: React.ReactNode }) {
  return <div><dt className="font-bold text-slate-950"><code>{term}</code></dt><dd className="mt-1 text-slate-600">{children}</dd></div>;
}
