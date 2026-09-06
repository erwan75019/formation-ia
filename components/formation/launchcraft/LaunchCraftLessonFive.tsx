import Link from "next/link";
import type { ReactNode } from "react";

import LessonCoach from "@/components/formation/LessonCoach";

const lessonFiles = [
  {
    path: "types/objective.ts",
    action: "Créer",
    code: `export type Objective = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  target_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
};`,
  },
  {
    path: "lib/objective-validation.ts",
    action: "Créer",
    code: `const OBJECTIVE_FIELDS = ["title", "description", "target_date"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isObjectiveId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function validateObjectiveForm(formData: FormData) {
  const keys = [...formData.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (keys.length !== OBJECTIVE_FIELDS.length || OBJECTIVE_FIELDS.some((field) => !keys.includes(field))) {
    return { success: false as const, error: "Le formulaire contient des champs inattendus." };
  }
  const titleEntry = formData.get("title");
  const descriptionEntry = formData.get("description");
  const dateEntry = formData.get("target_date");
  if (typeof titleEntry !== "string" || typeof descriptionEntry !== "string" || typeof dateEntry !== "string") {
    return { success: false as const, error: "Les données de l’objectif sont invalides." };
  }
  const title = titleEntry.trim().replace(/\\s+/g, " ");
  const description = descriptionEntry.trim().replace(/\\r\\n/g, "\\n");
  const targetDate = dateEntry.trim() === "" ? null : dateEntry.trim();
  if (title.length < 3 || title.length > 160) return { success: false as const, error: "Le titre doit contenir entre 3 et 160 caractères." };
  if (description.length > 1000) return { success: false as const, error: "La description ne doit pas dépasser 1 000 caractères." };
  if (targetDate !== null && !/^\\d{4}-\\d{2}-\\d{2}$/.test(targetDate)) return { success: false as const, error: "La date cible est invalide." };
  return { success: true as const, data: { title, description, target_date: targetDate } };
}`,
  },
  {
    path: "lib/objective-progress.ts",
    action: "Créer",
    code: `export function calculateObjectiveProgress(objectives: readonly { completed: boolean }[]) {
  if (objectives.length === 0) return 0;
  const completed = objectives.filter((objective) => objective.completed).length;
  return Math.round((completed / objectives.length) * 100);
}`,
  },
  {
    path: "app/actions/objectives.ts",
    action: "Créer",
    code: `"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isObjectiveId, validateObjectiveForm } from "@/lib/objective-validation";
import { isProjectId } from "@/lib/project-validation";

export type ObjectiveFormState = { error: string; success?: string };
export const initialObjectiveState: ObjectiveFormState = { error: "" };

async function requireOwnedProject(projectId: string) {
  const { supabase, user } = await requireUser();
  if (!isProjectId(projectId)) return null;
  const { data, error } = await supabase.from("projects").select("id")
    .eq("id", projectId).eq("user_id", user.id).maybeSingle();
  if (error || !data) return null;
  return { supabase, user };
}

function refresh(projectId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/projets");
  revalidatePath("/projets/" + projectId);
}

export async function createObjective(projectId: string, _: ObjectiveFormState, formData: FormData): Promise<ObjectiveFormState> {
  const parsed = validateObjectiveForm(formData);
  if (!parsed.success) return { error: parsed.error };
  const access = await requireOwnedProject(projectId);
  if (!access) return { error: "Projet introuvable ou inaccessible." };
  const { error } = await access.supabase.from("objectives").insert({
    ...parsed.data,
    project_id: projectId,
    user_id: access.user.id,
    completed: false,
    completed_at: null,
  });
  if (error) return { error: "Impossible de créer l’objectif pour le moment." };
  refresh(projectId);
  return { error: "", success: "Objectif créé." };
}

export async function updateObjective(projectId: string, objectiveId: string, _: ObjectiveFormState, formData: FormData): Promise<ObjectiveFormState> {
  if (!isObjectiveId(objectiveId)) return { error: "Identifiant d’objectif invalide." };
  const parsed = validateObjectiveForm(formData);
  if (!parsed.success) return { error: parsed.error };
  const access = await requireOwnedProject(projectId);
  if (!access) return { error: "Projet introuvable ou inaccessible." };
  const { data, error } = await access.supabase.from("objectives").update(parsed.data)
    .eq("id", objectiveId).eq("project_id", projectId).eq("user_id", access.user.id)
    .select("id").maybeSingle();
  if (error || !data) return { error: "Objectif introuvable ou inaccessible." };
  refresh(projectId);
  return { error: "", success: "Objectif modifié." };
}

export async function toggleObjective(projectId: string, objectiveId: string) {
  if (!isObjectiveId(objectiveId)) throw new Error("Objectif inaccessible.");
  const access = await requireOwnedProject(projectId);
  if (!access) throw new Error("Projet inaccessible.");
  const { data: current } = await access.supabase.from("objectives").select("completed").eq("id", objectiveId)
    .eq("project_id", projectId).eq("user_id", access.user.id).maybeSingle();
  if (!current) throw new Error("Objectif inaccessible.");
  const completed = !current.completed;
  const { data, error } = await access.supabase.from("objectives").update({ completed, completed_at: completed ? new Date().toISOString() : null })
    .eq("id", objectiveId).eq("project_id", projectId).eq("user_id", access.user.id)
    .select("id").maybeSingle();
  if (error || !data) throw new Error("Impossible de modifier cet objectif.");
  refresh(projectId);
}

export async function deleteObjective(projectId: string, objectiveId: string, formData: FormData) {
  const keys = [...formData.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (!isObjectiveId(objectiveId) || keys.length !== 1 || keys[0] !== "confirm" || formData.get("confirm") !== "yes") throw new Error("Suppression refusée.");
  const access = await requireOwnedProject(projectId);
  if (!access) throw new Error("Projet inaccessible.");
  const { data, error } = await access.supabase.from("objectives").delete()
    .eq("id", objectiveId).eq("project_id", projectId).eq("user_id", access.user.id)
    .select("id").maybeSingle();
  if (error || !data) throw new Error("Objectif introuvable ou inaccessible.");
  refresh(projectId);
}`,
  },
  {
    path: "components/ObjectiveForm.tsx",
    action: "Créer",
    code: `"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createObjective, initialObjectiveState, updateObjective } from "@/app/actions/objectives";
import type { Objective } from "@/types/objective";

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-xl bg-[#7c5cfc] px-4 py-3 font-bold">{pending ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Ajouter l’objectif"}</button>;
}

export default function ObjectiveForm({ projectId, objective }: { projectId: string; objective?: Objective }) {
  const action = objective ? updateObjective.bind(null, projectId, objective.id) : createObjective.bind(null, projectId);
  const [state, formAction] = useActionState(action, initialObjectiveState);
  return <form action={formAction} className="grid gap-4 rounded-2xl border border-white/10 bg-[#101d2d] p-5"><label className="grid gap-2">Titre<input name="title" defaultValue={objective?.title} minLength={3} maxLength={160} required className="rounded-xl bg-[#172638] p-3" /></label><label className="grid gap-2">Description<textarea name="description" defaultValue={objective?.description} maxLength={1000} rows={3} className="rounded-xl bg-[#172638] p-3" /></label><label className="grid gap-2">Date cible<input name="target_date" type="date" defaultValue={objective?.target_date ?? ""} className="rounded-xl bg-[#172638] p-3" /></label>{state.error && <p role="alert" className="text-[#ffaaaa]">{state.error}</p>}{state.success && <p role="status" className="text-[#39d6a6]">{state.success}</p>}<SubmitButton editing={Boolean(objective)} /></form>;
}`,
  },
  {
    path: "components/ObjectiveCard.tsx",
    action: "Créer",
    code: `"use client";

import { deleteObjective, toggleObjective } from "@/app/actions/objectives";
import ObjectiveForm from "./ObjectiveForm";
import type { Objective } from "@/types/objective";

export default function ObjectiveCard({ projectId, objective }: { projectId: string; objective: Objective }) {
  return <article className="rounded-3xl border border-white/10 bg-[#172638] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><span className={objective.completed ? "rounded-full bg-[#39d6a6]/20 px-3 py-1 text-sm text-[#70efc6]" : "rounded-full bg-white/10 px-3 py-1 text-sm text-[#9cafc3]"}>{objective.completed ? "Atteint" : "À atteindre"}</span><form action={toggleObjective.bind(null, projectId, objective.id)}><button className="text-sm text-[#c7bcff]">{objective.completed ? "Rouvrir" : "Marquer comme atteint"}</button></form></div><div className="mt-5"><ObjectiveForm projectId={projectId} objective={objective} /></div><form action={deleteObjective.bind(null, projectId, objective.id)} onSubmit={(event) => { if (!window.confirm("Supprimer cet objectif ?")) event.preventDefault(); }} className="mt-4"><input type="hidden" name="confirm" value="yes" /><button className="text-sm text-[#ffaaaa]">Supprimer l’objectif</button></form></article>;
}`,
  },
  {
    path: "components/ProjectCard.tsx",
    action: "Remplacer entièrement",
    code: `import Link from "next/link";
import { calculateObjectiveProgress } from "@/lib/objective-progress";
import type { Project } from "@/types/project";

export type ProjectWithObjectives = Project & { objectives: { completed: boolean }[] };
export default function ProjectCard({ project }: { project: ProjectWithObjectives }) {
  const progress = calculateObjectiveProgress(project.objectives);
  return <article className="rounded-3xl border border-white/10 bg-[#101d2d] p-6 shadow-xl"><p className="text-xs font-bold tracking-[0.16em] text-[#39d6a6]">PROJET</p><h2 className="mt-3 text-xl font-bold">{project.title}</h2><p className="mt-3 line-clamp-3 text-[#9cafc3]">{project.description || "Aucune description."}</p><div className="mt-5"><div className="flex justify-between text-sm"><span>Progression des objectifs</span><strong>{progress} %</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#39d6a6]" style={{ width: progress + "%" }} /></div></div><Link href={"/projets/" + project.id} className="mt-6 inline-flex text-sm font-bold text-[#c7bcff]">Voir le projet →</Link></article>;
}`,
  },
  {
    path: "app/projets/[id]/page.tsx",
    action: "Remplacer entièrement",
    code: `import { notFound } from "next/navigation";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import ObjectiveCard from "@/components/ObjectiveCard";
import ObjectiveForm from "@/components/ObjectiveForm";
import ProjectForm from "@/components/ProjectForm";
import { requireUser } from "@/lib/auth";
import { calculateObjectiveProgress } from "@/lib/objective-progress";
import { isProjectId } from "@/lib/project-validation";
import type { Objective } from "@/types/objective";
import type { Project } from "@/types/project";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isProjectId(id)) notFound();
  const { supabase, user } = await requireUser();
  const [{ data: projectData, error: projectError }, { data: objectiveData, error: objectiveError }] = await Promise.all([
    supabase.from("projects").select("id,title,slug,description,status,color,created_at").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("objectives").select("id,project_id,title,description,target_date,completed,completed_at,created_at").eq("project_id", id).eq("user_id", user.id).order("created_at"),
  ]);
  if (projectError || !projectData) notFound();
  if (objectiveError) throw new Error("Impossible de charger les objectifs.");
  const project = projectData as Project;
  const objectives = (objectiveData ?? []) as Objective[];
  const progress = calculateObjectiveProgress(objectives);
  return <main className="mx-auto max-w-4xl p-6 text-white md:p-10"><p className="text-[#39d6a6]">PROJET</p><h1 className="mt-2 text-4xl font-bold">{project.title}</h1><section className="mt-8 rounded-3xl bg-[#101d2d] p-6"><div className="flex justify-between"><h2 className="text-xl font-bold">Progression</h2><strong>{progress} %</strong></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#39d6a6]" style={{ width: progress + "%" }} /></div><p className="mt-3 text-sm text-[#9cafc3]">{objectives.filter((item) => item.completed).length} objectif(s) atteint(s) sur {objectives.length}.</p></section><section className="mt-10"><h2 className="text-2xl font-bold">Ajouter un objectif</h2><div className="mt-5"><ObjectiveForm projectId={project.id} /></div></section><section className="mt-10"><h2 className="text-2xl font-bold">Objectifs du projet</h2>{objectives.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-white/20 p-7 text-[#9cafc3]">Aucun objectif. Ajoutez le premier cap de ce lancement.</p> : <div className="mt-5 grid gap-5">{objectives.map((objective) => <ObjectiveCard key={objective.id} projectId={project.id} objective={objective} />)}</div>}</section><section className="mt-12"><h2 className="text-2xl font-bold">Modifier le projet</h2><div className="mt-5"><ProjectForm project={project} /></div><div className="mt-5"><DeleteProjectButton projectId={project.id} title={project.title} /></div></section></main>;
}`,
  },
  {
    path: "app/projets/page.tsx",
    action: "Remplacer entièrement",
    code: `import Link from "next/link";
import ProjectCard, { type ProjectWithObjectives } from "@/components/ProjectCard";
import { requireUser } from "@/lib/auth";

export default async function ProjectsPage() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("projects").select("id,title,slug,description,status,color,created_at,objectives(completed)").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) throw new Error("Impossible de charger les projets.");
  const projects = (data ?? []) as ProjectWithObjectives[];
  return <main className="mx-auto max-w-6xl p-6 text-white md:p-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[#39d6a6]">PORTEFEUILLE</p><h1 className="mt-2 text-4xl font-bold">Vos projets</h1></div><Link href="/projets/nouveau" className="rounded-xl bg-[#7c5cfc] px-5 py-3 font-bold">+ Nouveau projet</Link></div>{projects.length === 0 ? <p className="mt-10 rounded-3xl border border-dashed border-white/20 p-10 text-center">Aucun projet</p> : <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</section>}</main>;
}`,
  },
  {
    path: "app/dashboard/page.tsx",
    action: "Remplacer entièrement",
    code: `import Link from "next/link";
import AppShell from "@/components/AppShell";
import ProjectCard, { type ProjectWithObjectives } from "@/components/ProjectCard";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { data, error }] = await Promise.all([supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle(), supabase.from("projects").select("id,title,slug,description,status,color,created_at,objectives(completed)").eq("user_id", user.id).order("created_at", { ascending: false })]);
  const firstName = profile?.first_name || String(user.user_metadata.first_name || "Membre");
  const projects = (data ?? []) as ProjectWithObjectives[];
  return <AppShell firstName={firstName} email={user.email || ""}><main className="mx-auto max-w-6xl p-6 md:p-10"><p className="text-[#39d6a6]">TABLEAU DE BORD</p><h1 className="mt-2 text-4xl font-bold">Bonjour {firstName}</h1>{error ? <p role="alert" className="mt-8 text-[#ffaaaa]">Impossible de charger les projets.</p> : <><section className="mt-8 grid gap-5 sm:grid-cols-2">{projects.slice(0, 4).map((project) => <ProjectCard key={project.id} project={project} />)}</section><Link href="/projets" className="mt-7 inline-flex text-[#c7bcff]">Voir tous les projets →</Link></>}</main></AppShell>;
}`,
  },
] as const;

export default function LaunchCraftLessonFive({ lessonCompleted, moduleProgress }: { lessonCompleted: boolean; moduleProgress: number }) {
  return <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap justify-between gap-3"><Link href="/formation/api-ia/04" className="text-sm font-semibold text-slate-600">← Revenir à la leçon 04</Link><span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">Leçon 05 · Progression {moduleProgress} %</span></div><header className="mt-10 rounded-[32px] bg-[#07111f] p-8 text-white shadow-xl md:p-12"><p className="text-xs font-bold tracking-[0.2em] text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p><h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">Créer et valider les objectifs d’un projet</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#9cafc3]">Ajoutez des caps mesurables à chaque lancement, marquez-les comme atteints et laissez LaunchCraft calculer la progression réelle.</p></header><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-7"><Block title="Résultat visible" tone="violet">La fiche projet affiche ses objectifs, leur statut et une barre de progression. Les cartes du dashboard et de la liste utilisent le même calcul réel.</Block><Block title="Relation projet → objectifs">Un projet peut posséder plusieurs objectifs. Chaque objectif conserve à la fois <code>project_id</code> et <code>user_id</code>. Vérifier uniquement l’objectif serait insuffisant : le serveur contrôle aussi que le projet parent appartient au compte et que l’objectif reste rattaché au parent attendu.</Block><section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold">Créer les fichiers cumulatifs</h2><p className="mt-4 leading-7 text-slate-700">Conservez l’authentification et le CRUD projet. Appliquez chaque action « Créer » ou « Remplacer entièrement » ci-dessous.</p><div className="mt-8 space-y-10">{lessonFiles.map((file, index) => <CodeFile key={file.path} index={index + 1} {...file} />)}</div></section><Block title="Calcul de progression"><p>Sans objectif, la progression vaut <strong>0 %</strong>. Sinon : <code>objectifs atteints / total × 100</code>, arrondi à l’entier. Ce nombre est recalculé depuis les lignes Supabase ; le navigateur ne l’enregistre jamais comme vérité.</p></Block><section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold">Vérifications guidées</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Check title="Création">Ajoutez un objectif : il apparaît avec le statut « À atteindre » et la progression se recalcule.</Check><Check title="Modification">Changez son titre, sa description et sa date cible puis actualisez la page.</Check><Check title="Validation">Marquez-le atteint : le serveur fixe <code>completed_at</code> et la barre évolue.</Check><Check title="Suppression">Annulez puis confirmez la suppression. L’objectif disparaît et le pourcentage se recalcule.</Check></div></section><section className="rounded-3xl border border-amber-200 bg-amber-50 p-7"><h2 className="text-2xl font-bold text-amber-950">Erreurs fréquentes</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-amber-950"><li><strong>Objectif inaccessible :</strong> vérifiez les UUID et le compte connecté, sans désactiver RLS.</li><li><strong>Date refusée :</strong> utilisez le champ date, au format transmis <code>YYYY-MM-DD</code>.</li><li><strong>Progression immobile :</strong> vérifiez <code>revalidatePath</code> et ne stockez pas le pourcentage dans un state autoritaire.</li><li><strong>Relation invalide :</strong> aucun champ <code>project_id</code> ne doit être ajouté au formulaire.</li></ul></section><section className="rounded-3xl border border-rose-200 bg-rose-50 p-7"><h2 className="text-2xl font-bold text-rose-950">Test avec deux comptes</h2><ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-rose-950"><li>Avec A, créez un projet et un objectif.</li><li>Copiez les UUID visibles dans les URL ou le Table Editor de votre projet de développement.</li><li>Connectez B et vérifiez que le projet et l’objectif de A restent invisibles.</li><li>Tentez d’ouvrir l’URL de A : résultat introuvable.</li><li>Vérifiez qu’aucun formulaire ne permet de fournir ou déplacer <code>project_id</code>.</li></ol></section><div className="flex flex-wrap gap-3"><Link href="/formation/api-ia/05/exercice" className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white">Passer le QCM sécurisé</Link>{lessonCompleted && <Link href="/formation/api-ia/06" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold">Continuer vers la leçon 06 →</Link>}</div></div><aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Block title="Protections"><ul className="list-disc space-y-2 pl-5"><li>Projet parent rechargé.</li><li>Aucun <code>project_id</code> saisi.</li><li>Filtres objectif + projet + propriétaire.</li><li>UUID stricts.</li><li>RLS conservée.</li><li>Aucun <code>service_role</code>.</li></ul></Block><LessonCoach lessonId="api-05-keys-env" lessonLabel="LaunchCraft · Leçon 05" /></aside></div></div></main>;
}

function Block({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "violet" }) { return <section className={tone === "violet" ? "rounded-3xl bg-violet-100 p-7" : "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"}><h2 className="text-xl font-bold">{title}</h2><div className="mt-4 leading-7 text-slate-700">{children}</div></section>; }
function Check({ title, children }: { title: string; children: ReactNode }) { return <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6">{children}</p></article>; }
function CodeFile({ index, path, action, code }: { index: number; path: string; action: string; code: string }) { return <article><p className="text-sm font-bold text-violet-700">FICHIER {index} · {action}</p><h3 className="mt-2 font-mono font-bold">{path}</h3><pre className="mt-4 max-h-[34rem] overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-100"><code>{code}</code></pre></article>; }
