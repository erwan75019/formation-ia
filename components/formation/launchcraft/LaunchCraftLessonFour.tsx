import Link from "next/link";
import type { ReactNode } from "react";

import LessonCoach from "@/components/formation/LessonCoach";

const lessonFiles = [
  {
    path: "types/project.ts",
    action: "Créer",
    code: `export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "planning" | "active" | "paused" | "completed";
  color: string;
  created_at: string;
};`,
  },
  {
    path: "lib/project-validation.ts",
    action: "Créer",
    code: `const PROJECT_FIELDS = ["title", "description"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isProjectId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function slugifyProjectTitle(value: string) {
  return value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
}

export function validateProjectForm(formData: FormData) {
  const keys = [...formData.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (keys.length !== PROJECT_FIELDS.length || PROJECT_FIELDS.some((field) => !keys.includes(field))) {
    return { success: false as const, error: "Le formulaire contient des champs inattendus." };
  }
  const titleEntry = formData.get("title");
  const descriptionEntry = formData.get("description");
  if (typeof titleEntry !== "string" || typeof descriptionEntry !== "string") {
    return { success: false as const, error: "Les données du projet sont invalides." };
  }
  const title = titleEntry.trim().replace(/\\s+/g, " ");
  const description = descriptionEntry.trim().replace(/\\r\\n/g, "\\n");
  if (title.length < 3 || title.length > 120) {
    return { success: false as const, error: "Le nom doit contenir entre 3 et 120 caractères." };
  }
  if (description.length > 2000) {
    return { success: false as const, error: "La description ne doit pas dépasser 2 000 caractères." };
  }
  return { success: true as const, data: { title, description } };
}`,
  },
  {
    path: "app/actions/projects.ts",
    action: "Créer",
    code: `"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isProjectId, slugifyProjectTitle, validateProjectForm } from "@/lib/project-validation";

export type ProjectFormState = { error: string };
export const initialProjectState: ProjectFormState = { error: "" };

function refreshProjects() {
  revalidatePath("/dashboard");
  revalidatePath("/projets");
}

export async function createProject(_: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const parsed = validateProjectForm(formData);
  if (!parsed.success) return { error: parsed.error };
  const { supabase, user } = await requireUser();
  const slug = slugifyProjectTitle(parsed.data.title) + "-" + randomUUID().slice(0, 8);
  const { data, error } = await supabase.from("projects").insert({
    ...parsed.data,
    slug,
    user_id: user.id,
    status: "planning",
    color: "violet",
  }).select("id").single();
  if (error || !data) return { error: "Impossible de créer le projet pour le moment." };
  refreshProjects();
  redirect("/projets/" + data.id);
}

export async function updateProject(projectId: string, _: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  if (!isProjectId(projectId)) return { error: "Identifiant de projet invalide." };
  const parsed = validateProjectForm(formData);
  if (!parsed.success) return { error: parsed.error };
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("projects").update(parsed.data)
    .eq("id", projectId).eq("user_id", user.id).select("id").maybeSingle();
  if (error || !data) return { error: "Projet introuvable ou inaccessible." };
  refreshProjects();
  revalidatePath("/projets/" + projectId);
  redirect("/projets/" + projectId);
}

export async function deleteProject(projectId: string, formData: FormData) {
  const keys = [...formData.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (!isProjectId(projectId) || formData.get("confirm") !== "yes" || keys.length !== 1 || keys[0] !== "confirm") {
    throw new Error("Suppression refusée.");
  }
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("projects").delete()
    .eq("id", projectId).eq("user_id", user.id).select("id").maybeSingle();
  if (error || !data) throw new Error("Projet introuvable ou inaccessible.");
  refreshProjects();
  redirect("/projets");
}`,
  },
  {
    path: "components/ProjectForm.tsx",
    action: "Créer",
    code: `"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProject, initialProjectState, updateProject } from "@/app/actions/projects";
import type { Project } from "@/types/project";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-xl bg-[#7c5cfc] px-5 py-3 font-bold">{pending ? "Enregistrement…" : "Enregistrer"}</button>;
}

export default function ProjectForm({ project }: { project?: Project }) {
  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction] = useActionState(action, initialProjectState);
  return <form action={formAction} className="grid gap-5 rounded-3xl border border-white/10 bg-[#101d2d] p-6"><label className="grid gap-2">Nom du projet<input name="title" defaultValue={project?.title} minLength={3} maxLength={120} required className="rounded-xl bg-[#172638] p-3" /></label><label className="grid gap-2">Description<textarea name="description" defaultValue={project?.description} maxLength={2000} rows={6} className="rounded-xl bg-[#172638] p-3" /></label>{state.error && <p role="alert" className="text-[#ffaaaa]">{state.error}</p>}<div className="flex flex-wrap gap-3"><SubmitButton /><Link href={project ? "/projets/" + project.id : "/projets"} className="rounded-xl border border-white/15 px-5 py-3">Annuler</Link></div></form>;
}`,
  },
  {
    path: "components/DeleteProjectButton.tsx",
    action: "Créer",
    code: `"use client";

import { deleteProject } from "@/app/actions/projects";

export default function DeleteProjectButton({ projectId, title }: { projectId: string; title: string }) {
  const action = deleteProject.bind(null, projectId);
  return <form action={action} onSubmit={(event) => { if (!window.confirm("Supprimer « " + title + " » définitivement ?")) event.preventDefault(); }}><input type="hidden" name="confirm" value="yes" /><button type="submit" className="rounded-xl border border-[#ff7a7a] px-5 py-3 text-[#ffaaaa]">Supprimer le projet</button></form>;
}`,
  },
  {
    path: "components/ProjectCard.tsx",
    action: "Créer",
    code: `import Link from "next/link";
import type { Project } from "@/types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return <article className="rounded-3xl border border-white/10 bg-[#101d2d] p-6 shadow-xl transition hover:-translate-y-1"><p className="text-xs font-bold tracking-[0.16em] text-[#39d6a6]">PROJET</p><h2 className="mt-3 text-xl font-bold">{project.title}</h2><p className="mt-3 line-clamp-3 text-[#9cafc3]">{project.description || "Aucune description."}</p><Link href={"/projets/" + project.id} className="mt-6 inline-flex text-sm font-bold text-[#c7bcff]">Voir et modifier →</Link></article>;
}`,
  },
  {
    path: "components/Sidebar.tsx",
    action: "Remplacer entièrement",
    code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const links = [{ href: "/dashboard", label: "Vue d’ensemble" }, { href: "/projets", label: "Projets" }];
export default function Sidebar({ firstName, email }: { firstName: string; email: string }) {
  const pathname = usePathname();
  return <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0a1625] p-6 md:flex md:flex-col"><Link href="/dashboard" className="text-xl font-bold">LaunchCraft</Link><nav aria-label="Navigation principale" className="mt-12 grid gap-2">{links.map((link) => { const active = pathname.startsWith(link.href); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={active ? "rounded-xl bg-[#172638] px-4 py-3" : "rounded-xl px-4 py-3 text-[#9cafc3]"}>{link.label}</Link>; })}</nav><div className="mt-auto rounded-xl bg-[#101d2d] p-4"><strong className="block">{firstName}</strong><small className="text-[#9cafc3]">{email}</small><form action={signOut}><button className="mt-4 text-sm text-[#39d6a6]">Se déconnecter</button></form></div></aside>;
}`,
  },
  {
    path: "lib/supabase/proxy.ts",
    action: "Remplacer entièrement",
    code: `import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, { cookies: { getAll: () => request.cookies.getAll(), setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const protectedPage = ["/dashboard", "/projets"].some((prefix) => pathname.startsWith(prefix));
  const authPage = pathname === "/connexion" || pathname === "/inscription";
  if (!user && protectedPage) { const urlToLogin = request.nextUrl.clone(); urlToLogin.pathname = "/connexion"; return NextResponse.redirect(urlToLogin); }
  if (user && authPage) { const dashboardUrl = request.nextUrl.clone(); dashboardUrl.pathname = "/dashboard"; return NextResponse.redirect(dashboardUrl); }
  return response;
}`,
  },
  {
    path: "app/projets/layout.tsx",
    action: "Créer",
    code: `import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";

export default async function ProjectsLayout({ children }: { children: ReactNode }) {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle();
  const firstName = profile?.first_name || String(user.user_metadata.first_name || "Membre");
  return <AppShell firstName={firstName} email={user.email || ""}>{children}</AppShell>;
}`,
  },
  {
    path: "app/projets/page.tsx",
    action: "Créer",
    code: `import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { requireUser } from "@/lib/auth";
import type { Project } from "@/types/project";

export default async function ProjectsPage() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("projects").select("id,title,slug,description,status,color,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return <main className="p-8 text-white"><h1>Vos projets</h1><p role="alert">Impossible de charger les projets pour le moment.</p></main>;
  const projects = (data ?? []) as Project[];
  return <main className="mx-auto max-w-6xl p-6 text-white md:p-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[#39d6a6]">PORTEFEUILLE</p><h1 className="mt-2 text-4xl font-bold">Vos projets</h1></div><Link href="/projets/nouveau" className="rounded-xl bg-[#7c5cfc] px-5 py-3 font-bold">+ Nouveau projet</Link></div>{projects.length === 0 ? <section className="mt-10 rounded-3xl border border-dashed border-white/20 p-10 text-center"><h2 className="text-2xl font-bold">Aucun projet</h2><p className="mt-3 text-[#9cafc3]">Créez votre premier projet de lancement.</p></section> : <section aria-label="Vos projets" className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</section>}</main>;
}`,
  },
  {
    path: "app/projets/nouveau/page.tsx",
    action: "Créer",
    code: `import ProjectForm from "@/components/ProjectForm";
import { requireUser } from "@/lib/auth";

export default async function NewProjectPage() {
  await requireUser();
  return <main className="mx-auto max-w-3xl p-6 text-white md:p-10"><p className="text-[#39d6a6]">NOUVEAU LANCEMENT</p><h1 className="mt-2 text-4xl font-bold">Créer un projet</h1><div className="mt-8"><ProjectForm /></div></main>;
}`,
  },
  {
    path: "app/projets/[id]/page.tsx",
    action: "Créer",
    code: `import { notFound } from "next/navigation";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import ProjectForm from "@/components/ProjectForm";
import { requireUser } from "@/lib/auth";
import { isProjectId } from "@/lib/project-validation";
import type { Project } from "@/types/project";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isProjectId(id)) notFound();
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("projects").select("id,title,slug,description,status,color,created_at").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (error || !data) notFound();
  const project = data as Project;
  return <main className="mx-auto max-w-3xl p-6 text-white md:p-10"><p className="text-[#39d6a6]">PROJET</p><h1 className="mt-2 text-4xl font-bold">{project.title}</h1><p className="mt-3 text-[#9cafc3]">Modifiez uniquement les informations introduites dans cette leçon.</p><div className="mt-8"><ProjectForm project={project} /></div><div className="mt-6"><DeleteProjectButton projectId={project.id} title={project.title} /></div></main>;
}`,
  },
  {
    path: "app/projets/loading.tsx",
    action: "Créer",
    code: `export default function ProjectsLoading() {
  return <main className="p-10 text-white" aria-busy="true"><h1 className="text-4xl font-bold">Vos projets</h1><p className="mt-4 text-[#9cafc3]">Chargement de vos projets…</p></main>;
}`,
  },
  {
    path: "app/projets/error.tsx",
    action: "Créer",
    code: `"use client";

export default function ProjectsError({ reset }: { reset: () => void }) {
  return <main className="p-10 text-white"><h1 className="text-4xl font-bold">Un problème est survenu</h1><p className="mt-4 text-[#9cafc3]">Les projets n’ont pas pu être affichés.</p><button onClick={reset} className="mt-6 rounded-xl bg-[#7c5cfc] px-5 py-3">Réessayer</button></main>;
}`,
  },
  {
    path: "app/dashboard/page.tsx",
    action: "Remplacer entièrement",
    code: `import Link from "next/link";
import AppShell from "@/components/AppShell";
import ProjectCard from "@/components/ProjectCard";
import { requireUser } from "@/lib/auth";
import type { Project } from "@/types/project";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { data, error }] = await Promise.all([supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle(), supabase.from("projects").select("id,title,slug,description,status,color,created_at").eq("user_id", user.id).order("created_at", { ascending: false })]);
  const firstName = profile?.first_name || String(user.user_metadata.first_name || "Membre");
  const projects = (data ?? []) as Project[];
  return <AppShell firstName={firstName} email={user.email || ""}><main className="mx-auto max-w-6xl p-6 md:p-10"><p className="text-[#39d6a6]">TABLEAU DE BORD</p><h1 className="mt-2 text-4xl font-bold">Bonjour {firstName}</h1>{error ? <p role="alert" className="mt-8 text-[#ffaaaa]">Impossible de charger les projets.</p> : <><div className="mt-8 rounded-3xl bg-[#101d2d] p-6"><p className="text-[#9cafc3]">Projets réels dans votre espace</p><p className="mt-2 text-4xl font-bold">{projects.length}</p></div><section className="mt-8 grid gap-5 sm:grid-cols-2">{projects.slice(0, 4).map((project) => <ProjectCard key={project.id} project={project} />)}</section><Link href="/projets" className="mt-7 inline-flex text-[#c7bcff]">Voir tous les projets →</Link></>}</main></AppShell>;
}`,
  },
] as const;

export default function LaunchCraftLessonFour({ lessonCompleted, moduleProgress }: { lessonCompleted: boolean; moduleProgress: number }) {
  return <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap justify-between gap-3"><Link href="/formation/api-ia/03" className="text-sm font-semibold text-slate-600">← Revenir à la leçon 03</Link><span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">Leçon 04 · Progression {moduleProgress} %</span></div><header className="mt-10 rounded-[32px] bg-[#07111f] p-8 text-white shadow-xl md:p-12"><p className="text-xs font-bold tracking-[0.2em] text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p><h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">Création et gestion des projets</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#9cafc3]">Transformez le dashboard protégé en véritable espace personnel : chaque compte voit, crée, modifie et supprime uniquement ses propres projets.</p></header><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-7"><Block title="Résultat visible" tone="violet">Les pages <code>/projets</code>, <code>/projets/nouveau</code> et <code>/projets/[id]</code> deviennent fonctionnelles. Le dashboard affiche un compteur et les projets réellement lus dans Supabase.</Block><Block title="Les trois rôles à distinguer"><ul className="list-disc space-y-2 pl-5"><li><strong>Server Component :</strong> lit les projets avant d’envoyer la page au navigateur.</li><li><strong>Client Component :</strong> gère l’état interactif du formulaire, son chargement et la confirmation.</li><li><strong>Server Action :</strong> reçoit le formulaire, vérifie la session, valide puis écrit dans Supabase.</li></ul></Block>
  <section className="rounded-3xl bg-white p-7 shadow-sm"><Step number="1" title="Créer le CRUD cumulatif" /><p className="mt-4 leading-7 text-slate-700">Conservez tous les fichiers des leçons 01 à 03. Créez ou remplacez exactement les fichiers ci-dessous, dans l’ordre.</p><div className="mt-8 space-y-10">{lessonFiles.map((file, index) => <CodeFile key={file.path} index={index + 1} {...file} />)}</div></section>
  <Block title="Pourquoi user_id et RLS sont complémentaires"><p>La Server Action obtient <code>user.id</code> avec <code>auth.getUser()</code>. Elle ne lit jamais de <code>user_id</code> dans le formulaire. Les requêtes de lecture, modification et suppression ajoutent le propriétaire aux filtres. RLS répète ensuite cette règle dans PostgreSQL : une erreur d’interface ou une URL devinée ne suffit pas pour franchir ces protections.</p></Block>
  <section className="rounded-3xl bg-white p-7 shadow-sm"><Step number="2" title="Vérifier chaque opération" /><div className="mt-5 grid gap-4 sm:grid-cols-2"><Check title="Lecture">Ouvrez <code>/projets</code>. L’état « Aucun projet » apparaît sans erreur.</Check><Check title="Création">Créez « Lancement de ma formation ». La fiche s’ouvre et la liste affiche immédiatement le projet.</Check><Check title="Modification">Changez le nom et la description. Enregistrez puis actualisez : les nouvelles valeurs restent.</Check><Check title="Suppression">Cliquez sur Supprimer, annulez une première fois, puis confirmez. Le projet disparaît de la liste et du dashboard.</Check></div></section>
  <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7"><h2 className="text-2xl font-bold text-amber-950">Erreurs fréquentes</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-amber-950"><li><strong>Projet inaccessible :</strong> vérifiez que l’URL contient un UUID valide et que le compte connecté est propriétaire.</li><li><strong>Le compteur ne change pas :</strong> assurez-vous que <code>revalidatePath</code> vise le dashboard et la liste.</li><li><strong>Erreur RLS :</strong> ne désactivez jamais RLS ; contrôlez plutôt la session et le <code>user_id</code> inséré côté serveur.</li><li><strong>Champ inattendu :</strong> le formulaire doit envoyer uniquement <code>title</code> et <code>description</code>.</li></ul></section>
  <section className="rounded-3xl border border-rose-200 bg-rose-50 p-7"><h2 className="text-2xl font-bold text-rose-950">Test d’isolation indispensable</h2><ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-rose-950"><li>Créez deux comptes de test A et B.</li><li>Avec A, créez un projet et copiez son URL.</li><li>Déconnectez A puis connectez B.</li><li>Vérifiez que B ne voit pas le projet dans la liste.</li><li>Collez l’URL du projet A : B doit obtenir la page introuvable.</li><li>Tentez modification et suppression uniquement depuis les interfaces disponibles : aucune action sur le projet A ne doit être possible.</li></ol></section>
  <div className="flex flex-wrap gap-3"><Link href="/formation/api-ia/04/exercice" className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white">Passer le QCM sécurisé</Link>{lessonCompleted && <Link href="/formation/api-ia/05" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold">Continuer vers la leçon 05 →</Link>}</div></div><aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Block title="Règles de sécurité"><ul className="list-disc space-y-2 pl-5"><li>Client utilisateur authentifié uniquement.</li><li>Jamais de <code>service_role</code>.</li><li>Aucun <code>user_id</code> envoyé.</li><li>Filtres <code>id + user_id</code>.</li><li>RLS toujours active.</li><li>Messages d’erreur neutres.</li></ul></Block><LessonCoach lessonId="api-04-status" lessonLabel="LaunchCraft · Leçon 04" /></aside></div></div></main>;
}

function Step({ number, title }: { number: string; title: string }) { return <><p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE {number}</p><h2 className="mt-3 text-2xl font-bold">{title}</h2></>; }
function Block({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "violet" }) { return <section className={tone === "violet" ? "rounded-3xl bg-violet-100 p-7" : "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"}><h2 className="text-xl font-bold">{title}</h2><div className="mt-4 leading-7 text-slate-700">{children}</div></section>; }
function Check({ title, children }: { title: string; children: ReactNode }) { return <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6">{children}</p></article>; }
function CodeFile({ index, path, action, code }: { index: number; path: string; action: string; code: string }) { return <article><p className="text-sm font-bold text-violet-700">FICHIER {index} · {action}</p><h3 className="mt-2 font-mono font-bold">{path}</h3><pre className="mt-4 max-h-[34rem] overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-100"><code>{code}</code></pre></article>; }
