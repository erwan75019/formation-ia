import Link from "next/link";
import type { ReactNode } from "react";

import LessonCoach from "@/components/formation/LessonCoach";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="min-w-0 rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold">{title}</h2><div className="mt-4 space-y-4 leading-7 text-slate-700">{children}</div></section>;
}

function FileBlock({ action, path, code }: { action: string; path: string; code: string }) {
  return <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200"><header className="flex flex-wrap justify-between gap-2 bg-slate-950 px-5 py-3 text-sm text-white"><strong>{action}</strong><code className="break-all">{path}</code></header><pre className="max-w-full overflow-x-auto bg-[#101d2d] p-5 text-xs leading-6 text-slate-100"><code>{code}</code></pre></article>;
}

const calendarTypes = `export type CalendarItem = {
  id: string;
  projectId: string;
  title: string;
  date: string;
  kind: "objective" | "task";
  completed: boolean;
  priority?: "low" | "medium" | "high";
};`;

const calendarHelpers = `import type { CalendarItem } from "@/types/calendar";

export type CalendarMonth = { year: number; month: number };
const pattern = /^(\\d{4})-(\\d{2})-(\\d{2})$/;

export function daysInMonth(year: number, month: number) {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function normalizeDateKey(value: unknown) {
  if (typeof value !== "string") return null;
  const match = pattern.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 2000 || year > 2100 || month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return value;
}

export function parseCalendarMonth(yearValue: unknown, monthValue: unknown, fallback: CalendarMonth) {
  const year = typeof yearValue === "string" && /^\\d{4}$/.test(yearValue) ? Number(yearValue) : NaN;
  const month = typeof monthValue === "string" && /^(?:[1-9]|1[0-2])$/.test(monthValue) ? Number(monthValue) : NaN;
  return year >= 2000 && year <= 2100 && month >= 1 && month <= 12 ? { year, month } : fallback;
}

export function moveCalendarMonth(value: CalendarMonth, delta: -1 | 1) {
  if (delta === 1 && value.month === 12) return { year: value.year + 1, month: 1 };
  if (delta === -1 && value.month === 1) return { year: value.year - 1, month: 12 };
  return { year: value.year, month: value.month + delta };
}

export function buildMonthGrid(year: number, month: number) {
  const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const cells: Array<{ date: string | null; day: number | null }> = Array.from(
    { length: offset }, () => ({ date: null, day: null })
  );
  for (let day = 1; day <= daysInMonth(year, month); day += 1) {
    cells.push({ day, date: year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0") });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
  return cells;
}

export function groupCalendarItems(items: readonly CalendarItem[]) {
  const groups: Record<string, CalendarItem[]> = {};
  for (const item of items) {
    const date = normalizeDateKey(item.date);
    if (!date) continue;
    groups[date] ??= [];
    groups[date].push(item);
  }
  return groups;
}

export function isOverdue(item: CalendarItem, today: string) {
  const date = normalizeDateKey(item.date);
  return Boolean(date && !item.completed && date < today);
}`;

const calendarComponent = `"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildMonthGrid, groupCalendarItems, isOverdue, moveCalendarMonth } from "@/lib/calendar";
import type { CalendarItem } from "@/types/calendar";

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Calendar({ items, year, month, today }: { items: CalendarItem[]; year: number; month: number; today: string }) {
  const router = useRouter();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const groups = useMemo(() => groupCalendarItems(items), [items]);
  const [selected, setSelected] = useState(today.startsWith(year + "-" + String(month).padStart(2, "0")) ? today : null);
  const selectedItems = selected ? groups[selected] ?? [] : [];
  const label = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));

  function openMonth(next: { year: number; month: number }) {
    router.push("/calendrier?year=" + next.year + "&month=" + next.month);
  }

  return <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
    <section className="rounded-3xl bg-[#101d2d] p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold capitalize">{label}</h2>
        <div className="flex gap-2"><button aria-label="Afficher le mois précédent" onClick={() => openMonth(moveCalendarMonth({ year, month }, -1))}>←</button><button onClick={() => { const now = new Date(); openMonth({ year: now.getFullYear(), month: now.getMonth() + 1 }); }}>Aujourd’hui</button><button aria-label="Afficher le mois suivant" onClick={() => openMonth(moveCalendarMonth({ year, month }, 1))}>→</button></div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1" role="grid" aria-label={"Calendrier de " + label}>
        {weekDays.map(day => <div key={day} role="columnheader" className="p-2 text-center text-xs text-[#9cafc3]">{day}</div>)}
        {cells.map((cell, index) => cell.date ? <button key={cell.date} role="gridcell" aria-label={cell.day + " " + label} aria-pressed={selected === cell.date} onClick={() => setSelected(cell.date)} className="min-h-20 rounded-xl border border-white/10 p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39d6a6]"><span>{cell.day}</span><span className="mt-2 block text-xs">{groups[cell.date]?.length ? groups[cell.date].length + " échéance(s)" : ""}</span></button> : <div key={"empty-" + index} aria-hidden="true" />)}
      </div>
    </section>
    <aside className="rounded-3xl bg-[#101d2d] p-6"><h2 className="text-xl font-bold">{selected ? "Échéances du " + selected : "Sélectionnez un jour"}</h2>{selectedItems.length === 0 ? <p className="mt-4 text-[#9cafc3]">Aucune échéance ce jour-là.</p> : <div className="mt-4 grid gap-3">{selectedItems.map(item => <article key={item.kind + item.id} className="rounded-2xl bg-[#172638] p-4"><p className="text-xs text-[#9cafc3]">{item.kind === "task" ? "Tâche" : "Objectif"}{item.priority ? " · priorité " + item.priority : ""}</p><strong className={item.completed ? "line-through opacity-70" : ""}>{item.title}</strong><p className="mt-2 text-sm">{item.completed ? "Terminé" : isOverdue(item, today) ? "En retard" : "À venir"}</p><Link className="mt-3 inline-block text-[#39d6a6]" href={"/projets/" + item.projectId}>Voir le projet →</Link></article>)}</div>}</aside>
  </div>;
}`;

const pageCode = `import { redirect } from "next/navigation";
import Calendar from "@/components/Calendar";
import { parseCalendarMonth, normalizeDateKey } from "@/lib/calendar";
import { createClient } from "@/lib/supabase/server";
import type { CalendarItem } from "@/types/calendar";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ year?: string; month?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  const { year, month } = parseCalendarMonth((await searchParams).year, (await searchParams).month, { year: now.getFullYear(), month: now.getMonth() + 1 });
  const [{ data: projects, error: projectError }, { data: objectives, error: objectiveError }, { data: tasks, error: taskError }] = await Promise.all([
    supabase.from("projects").select("id").eq("user_id", user.id),
    supabase.from("objectives").select("id,project_id,title,target_date,completed").eq("user_id", user.id).not("target_date", "is", null),
    supabase.from("tasks").select("id,project_id,title,due_date,status,priority").eq("user_id", user.id).not("due_date", "is", null),
  ]);
  if (projectError || objectiveError || taskError) throw new Error("CALENDAR_LOAD_FAILED");
  const projectIds = new Set((projects ?? []).map(project => project.id));
  const items: CalendarItem[] = [];
  for (const objective of objectives ?? []) {
    const date = normalizeDateKey(objective.target_date);
    if (date && projectIds.has(objective.project_id)) items.push({ id: objective.id, projectId: objective.project_id, title: objective.title, date, kind: "objective", completed: objective.completed });
  }
  for (const task of tasks ?? []) {
    const date = normalizeDateKey(task.due_date);
    if (date && projectIds.has(task.project_id)) items.push({ id: task.id, projectId: task.project_id, title: task.title, date, kind: "task", completed: task.status === "completed", priority: task.priority });
  }
  return <main id="main-content" className="mx-auto max-w-7xl p-5 md:p-10"><p className="text-[#39d6a6]">PLANNING</p><h1 className="mt-2 text-4xl font-bold">Calendrier</h1><p className="mt-3 text-[#9cafc3]">Objectifs et tâches datés de vos projets.</p><div className="mt-8"><Calendar items={items} year={year} month={month} today={today} /></div></main>;
}`;

const loadingCode = `export default function Loading() {
  return <main className="p-10"><h1 className="text-4xl font-bold">Calendrier</h1><p role="status" className="mt-6 text-[#9cafc3]">Chargement des échéances…</p></main>;
}`;

const errorCode = `"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="p-10"><h1 className="text-4xl font-bold">Calendrier indisponible</h1><p role="alert" className="mt-4 text-[#ffaaaa]">Impossible de charger vos échéances. Réessayez dans un instant.</p><button className="mt-6 rounded-xl bg-[#7c5cfc] px-5 py-3" onClick={reset}>Réessayer</button></main>;
}`;

const desktopNav = `import Link from "next/link";

const links = [{ href: "/dashboard", label: "Dashboard" }, { href: "/projets", label: "Projets" }, { href: "/calendrier", label: "Calendrier" }];

export default function Sidebar() {
  return <aside className="hidden min-h-screen w-72 bg-[#07111f] p-7 lg:block"><Link href="/dashboard" className="text-2xl font-bold">LaunchCraft</Link><nav aria-label="Navigation principale" className="mt-10 grid gap-2">{links.map(link => <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 hover:bg-[#172638] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39d6a6]">{link.label}</Link>)}</nav></aside>;
}`;

const mobileNav = `"use client";

import Link from "next/link";
import { useState } from "react";

const links = [{ href: "/dashboard", label: "Dashboard" }, { href: "/projets", label: "Projets" }, { href: "/calendrier", label: "Calendrier" }];

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  return <header className="bg-[#07111f] p-4 lg:hidden"><div className="flex items-center justify-between"><Link href="/dashboard" className="font-bold">LaunchCraft</Link><button aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>Menu</button></div>{open && <nav id="mobile-navigation" aria-label="Navigation mobile" className="mt-4 grid gap-2">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>}</header>;
}`;

export default function LaunchCraftLessonEight({ moduleProgress }: { lessonCompleted: boolean; moduleProgress: number }) {
  return <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8"><div className="mx-auto w-full max-w-7xl"><div className="flex flex-wrap justify-between gap-3 text-sm"><Link href="/formation/api-ia/07">← Leçon 07</Link><span>Checkpoint 08 / 9 · {moduleProgress} %</span></div><header className="mt-8 rounded-[32px] bg-[#07111f] p-8 text-white md:p-12"><p className="font-bold text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p><h1 className="mt-4 text-4xl font-bold md:text-6xl">Construire le calendrier des échéances</h1><p className="mt-5 max-w-3xl text-lg text-[#9cafc3]">Regroupez les dates des objectifs et tâches dans une vue mensuelle protégée, accessible et fiable.</p></header><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="min-w-0 space-y-7"><Panel title="Résultat visible"><p>La nouvelle route <code>/calendrier</code> affiche un mois, permet de changer de période et montre les éléments du jour sélectionné avec un lien vérifié vers leur projet.</p></Panel><Panel title="1. Comprendre une date civile"><p>Une valeur SQL <code>date</code> comme <code>2026-12-31</code> représente un jour, pas un instant UTC. Nous découpons et comparons cette chaîne sans <code>new Date(&quot;2026-12-31&quot;)</code>, qui peut afficher la veille selon le fuseau.</p><FileBlock action="Créer" path="types/calendar.ts" code={calendarTypes} /><FileBlock action="Créer" path="lib/calendar.ts" code={calendarHelpers} /></Panel><Panel title="2. Construire l’interface mensuelle"><p>Seul ce composant est client : il mémorise le jour choisi et navigue entre les mois. Sélectionner un jour ne relance aucune requête Supabase.</p><FileBlock action="Créer" path="components/Calendar.tsx" code={calendarComponent} /></Panel><Panel title="3. Charger uniquement les données du compte"><p>La page confirme la session, filtre les trois tables par <code>user.id</code>, puis conserve seulement les échéances dont le projet appartient à la même lecture sécurisée.</p><FileBlock action="Créer" path="app/calendrier/page.tsx" code={pageCode} /><FileBlock action="Créer" path="app/calendrier/loading.tsx" code={loadingCode} /><FileBlock action="Créer" path="app/calendrier/error.tsx" code={errorCode} /></Panel><Panel title="4. Ajouter Calendrier aux deux navigations"><FileBlock action="Remplacer entièrement" path="components/Sidebar.tsx" code={desktopNav} /><FileBlock action="Remplacer entièrement" path="components/MobileHeader.tsx" code={mobileNav} /></Panel><Panel title="Vérification guidée"><ol className="list-decimal space-y-2 pl-5"><li>Créez une tâche aujourd’hui, une future, une passée et une terminée.</li><li>Ajoutez un objectif avec une date cible.</li><li>Ouvrez <code>/calendrier</code> et sélectionnez chaque jour.</li><li>Vérifiez les libellés Tâche/Objectif, Terminé/En retard et priorité.</li><li>Ajoutez un élément au 31 décembre puis passez à janvier et revenez.</li><li>Testez le menu et la grille au clavier sur 390 px.</li></ol></Panel><Panel title="Erreurs fréquentes"><ul className="list-disc space-y-2 pl-5"><li><strong>Jour décalé :</strong> ne parsez pas une date SQL avec le constructeur UTC implicite.</li><li><strong>Mois injecté :</strong> passez toujours les paramètres par <code>parseCalendarMonth</code>.</li><li><strong>Données croisées :</strong> conservez <code>.eq(&quot;user_id&quot;, user.id)</code> sur chaque table.</li><li><strong>Élément terminé caché :</strong> affichez-le avec un état explicite au lieu de le supprimer.</li></ul></Panel><div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6"><strong>Étape suivante : finalisation.</strong><p className="mt-2">Réussir ce QCM valide uniquement la leçon 08 et ouvre la leçon 09 consacrée à la sécurité et aux tests finaux.</p></div><Link href="/formation/api-ia/08/exercice" className="inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white">Passer le QCM sécurisé</Link></div><aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Panel title="À retenir"><ul className="list-disc space-y-2 pl-5"><li>Dates civiles conservées en YYYY-MM-DD.</li><li>Trois lectures filtrées par user.id.</li><li>RLS reste active.</li><li>Aucun service_role.</li><li>Interaction client sans donnée autoritaire.</li></ul></Panel><LessonCoach lessonId="api-08-calendar" lessonLabel="LaunchCraft · Leçon 08" /></aside></div></div></main>;
}
