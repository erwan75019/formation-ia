import Link from "next/link";
import type { ReactNode } from "react";

import LessonCoach from "@/components/formation/LessonCoach";

const lessonFiles = [
  {
    path: "types/task.ts", action: "Créer", code: `export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type Task = {
  id: string;
  project_id: string;
  objective_id: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
};`,
  },
  {
    path: "lib/task-validation.ts", action: "Créer", code: `import type { TaskPriority, TaskStatus } from "@/types/task";

const FIELDS = ["title", "description", "objective_id", "status", "priority", "due_date"] as const;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const statuses = new Set<TaskStatus>(["todo", "in_progress", "completed"]);
const priorities = new Set<TaskPriority>(["low", "medium", "high"]);

export const isTaskId = (value: unknown): value is string => typeof value === "string" && UUID.test(value);
export const isOptionalObjectiveId = (value: unknown): value is string | null => value === null || (typeof value === "string" && UUID.test(value));

export function validateTaskForm(formData: FormData) {
  const keys = [...formData.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (keys.length !== FIELDS.length || FIELDS.some((field) => !keys.includes(field))) return { success: false as const, error: "Champs inattendus." };
  const text = (field: string) => { const value = formData.get(field); return typeof value === "string" ? value.trim() : null; };
  const title = text("title"); const description = text("description"); const rawObjective = text("objective_id");
  const status = text("status") as TaskStatus | null; const priority = text("priority") as TaskPriority | null; const rawDate = text("due_date");
  if (title === null || description === null || rawObjective === null || status === null || priority === null || rawDate === null) return { success: false as const, error: "Données invalides." };
  if (title.length < 3 || title.length > 160) return { success: false as const, error: "Le titre doit contenir entre 3 et 160 caractères." };
  if (description.length > 2000) return { success: false as const, error: "La description ne doit pas dépasser 2 000 caractères." };
  const objectiveId = rawObjective === "" ? null : rawObjective;
  const dueDate = rawDate === "" ? null : rawDate;
  if (!isOptionalObjectiveId(objectiveId) || !statuses.has(status) || !priorities.has(priority) || (dueDate !== null && !/^\\d{4}-\\d{2}-\\d{2}$/.test(dueDate))) return { success: false as const, error: "Objectif, statut, priorité ou date invalide." };
  return { success: true as const, data: { title: title.replace(/\\s+/g, " "), description, objective_id: objectiveId, status, priority, due_date: dueDate } };
}`,
  },
  {
    path: "lib/task-metrics.ts", action: "Créer", code: `import type { Task } from "@/types/task";

export function calculateTaskMetrics(tasks: readonly Task[], today: string) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const overdue = tasks.filter((task) => task.status !== "completed" && task.due_date !== null && task.due_date < today).length;
  return { total: tasks.length, completed, remaining: tasks.length - completed, overdue };
}`,
  },
  {
    path: "app/actions/tasks.ts", action: "Créer", code: `"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isProjectId } from "@/lib/project-validation";
import { isTaskId, validateTaskForm } from "@/lib/task-validation";

export type TaskFormState = { error: string; success?: string };
export const initialTaskState: TaskFormState = { error: "" };

async function taskAccess(projectId: string, objectiveId: string | null = null) {
  const { supabase, user } = await requireUser();
  if (!isProjectId(projectId)) return null;
  const { data: project } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", user.id).maybeSingle();
  if (!project) return null;
  if (objectiveId) {
    const { data: objective } = await supabase.from("objectives").select("id").eq("id", objectiveId).eq("project_id", projectId).eq("user_id", user.id).maybeSingle();
    if (!objective) return null;
  }
  return { supabase, user };
}

function refresh(projectId: string) { revalidatePath("/dashboard"); revalidatePath("/projets"); revalidatePath("/projets/" + projectId); }

export async function createTask(projectId: string, _: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const parsed = validateTaskForm(formData); if (!parsed.success) return { error: parsed.error };
  const access = await taskAccess(projectId, parsed.data.objective_id); if (!access) return { error: "Projet ou objectif inaccessible." };
  const completedAt = parsed.data.status === "completed" ? new Date().toISOString() : null;
  const { error } = await access.supabase.from("tasks").insert({ ...parsed.data, project_id: projectId, user_id: access.user.id, completed_at: completedAt });
  if (error) return { error: "Impossible de créer la tâche." }; refresh(projectId); return { error: "", success: "Tâche créée." };
}

export async function updateTask(projectId: string, taskId: string, _: TaskFormState, formData: FormData): Promise<TaskFormState> {
  if (!isTaskId(taskId)) return { error: "Identifiant de tâche invalide." };
  const parsed = validateTaskForm(formData); if (!parsed.success) return { error: parsed.error };
  const access = await taskAccess(projectId, parsed.data.objective_id); if (!access) return { error: "Projet ou objectif inaccessible." };
  const completedAt = parsed.data.status === "completed" ? new Date().toISOString() : null;
  const { data, error } = await access.supabase.from("tasks").update({ ...parsed.data, completed_at: completedAt }).eq("id", taskId).eq("project_id", projectId).eq("user_id", access.user.id).select("id").maybeSingle();
  if (error || !data) return { error: "Tâche introuvable ou inaccessible." }; refresh(projectId); return { error: "", success: "Tâche modifiée." };
}

export async function toggleTask(projectId: string, taskId: string) {
  if (!isTaskId(taskId)) throw new Error("Tâche inaccessible."); const access = await taskAccess(projectId); if (!access) throw new Error("Projet inaccessible.");
  const { data: current } = await access.supabase.from("tasks").select("status").eq("id", taskId).eq("project_id", projectId).eq("user_id", access.user.id).maybeSingle();
  if (!current) throw new Error("Tâche inaccessible."); const status = current.status === "completed" ? "todo" : "completed";
  const { data, error } = await access.supabase.from("tasks").update({ status, completed_at: status === "completed" ? new Date().toISOString() : null }).eq("id", taskId).eq("project_id", projectId).eq("user_id", access.user.id).select("id").maybeSingle();
  if (error || !data) throw new Error("Impossible de modifier la tâche."); refresh(projectId);
}

export async function deleteTask(projectId: string, taskId: string, formData: FormData) {
  const keys = [...formData.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (!isTaskId(taskId) || keys.length !== 1 || formData.get("confirm") !== "yes") throw new Error("Suppression refusée.");
  const access = await taskAccess(projectId); if (!access) throw new Error("Projet inaccessible.");
  const { data, error } = await access.supabase.from("tasks").delete().eq("id", taskId).eq("project_id", projectId).eq("user_id", access.user.id).select("id").maybeSingle();
  if (error || !data) throw new Error("Tâche inaccessible."); refresh(projectId);
}`,
  },
  {
    path: "components/TaskForm.tsx", action: "Créer", code: `"use client";
import { useActionState } from "react"; import { useFormStatus } from "react-dom";
import { createTask, initialTaskState, updateTask } from "@/app/actions/tasks";
import type { Objective } from "@/types/objective"; import type { Task } from "@/types/task";
function Submit(){const{pending}=useFormStatus();return <button disabled={pending} className="rounded-xl bg-[#7c5cfc] px-4 py-3 font-bold">{pending?"Enregistrement…":"Enregistrer la tâche"}</button>}
export default function TaskForm({projectId,objectives,task}:{projectId:string;objectives:Objective[];task?:Task}){const action=task?updateTask.bind(null,projectId,task.id):createTask.bind(null,projectId);const[state,formAction]=useActionState(action,initialTaskState);return <form action={formAction} className="grid gap-4 rounded-2xl bg-[#101d2d] p-5"><label>Titre<input name="title" defaultValue={task?.title} minLength={3} maxLength={160} required className="mt-2 w-full rounded-xl bg-[#172638] p-3"/></label><label>Description<textarea name="description" defaultValue={task?.description} maxLength={2000} className="mt-2 w-full rounded-xl bg-[#172638] p-3"/></label><label>Objectif facultatif<select name="objective_id" defaultValue={task?.objective_id??""} className="mt-2 w-full rounded-xl bg-[#172638] p-3"><option value="">Aucun</option>{objectives.map((item)=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-3"><label>Statut<select name="status" defaultValue={task?.status??"todo"}><option value="todo">À faire</option><option value="in_progress">En cours</option><option value="completed">Terminée</option></select></label><label>Priorité<select name="priority" defaultValue={task?.priority??"medium"}><option value="low">Faible</option><option value="medium">Moyenne</option><option value="high">Haute</option></select></label><label>Échéance<input name="due_date" type="date" defaultValue={task?.due_date??""}/></label></div>{state.error&&<p role="alert" className="text-[#ffaaaa]">{state.error}</p>}{state.success&&<p role="status" className="text-[#39d6a6]">{state.success}</p>}<Submit/></form>}`,
  },
  {
    path: "components/TaskList.tsx", action: "Créer", code: `"use client";
import { useState } from "react"; import { deleteTask, toggleTask } from "@/app/actions/tasks"; import TaskForm from "./TaskForm"; import type { Objective } from "@/types/objective"; import type { Task,TaskPriority } from "@/types/task";
export default function TaskList({projectId,tasks,objectives}:{projectId:string;tasks:Task[];objectives:Objective[]}){const[status,setStatus]=useState("all");const[priority,setPriority]=useState("all");const visible=tasks.filter((task)=>(status==="all"||(status==="completed"?task.status==="completed":task.status!=="completed"))&&(priority==="all"||task.priority===priority));return <section><div className="flex flex-wrap gap-3"><select aria-label="Filtrer par état" value={status} onChange={(e)=>setStatus(e.target.value)}><option value="all">Toutes</option><option value="remaining">À faire</option><option value="completed">Terminées</option></select><select aria-label="Filtrer par priorité" value={priority} onChange={(e)=>setPriority(e.target.value)}><option value="all">Toutes priorités</option>{(["low","medium","high"] as TaskPriority[]).map((p)=><option key={p} value={p}>{p}</option>)}</select></div>{visible.length===0?<p className="mt-5 rounded-2xl border border-dashed border-white/20 p-6">Aucune tâche pour ces filtres.</p>:<div className="mt-5 grid gap-5">{visible.map((task)=><article key={task.id} className="rounded-3xl bg-[#172638] p-5"><div className="flex justify-between"><strong>{task.title}</strong><span>{task.priority}</span></div><p className="mt-2 text-[#9cafc3]">{task.due_date?"Échéance : "+task.due_date:"Sans échéance"}</p><div className="mt-4"><TaskForm projectId={projectId} objectives={objectives} task={task}/></div><div className="mt-4 flex gap-4"><form action={toggleTask.bind(null,projectId,task.id)}><button>{task.status==="completed"?"Rouvrir":"Terminer"}</button></form><form action={deleteTask.bind(null,projectId,task.id)} onSubmit={(e)=>{if(!window.confirm("Supprimer cette tâche ?"))e.preventDefault()}}><input type="hidden" name="confirm" value="yes"/><button className="text-[#ffaaaa]">Supprimer</button></form></div></article>)}</div>}</section>}`,
  },
  {
    path: "app/projets/[id]/page.tsx", action: "Remplacer entièrement", code: `import {notFound} from "next/navigation"; import ObjectiveCard from "@/components/ObjectiveCard"; import ObjectiveForm from "@/components/ObjectiveForm"; import TaskForm from "@/components/TaskForm"; import TaskList from "@/components/TaskList"; import {requireUser} from "@/lib/auth"; import {calculateObjectiveProgress} from "@/lib/objective-progress"; import {isProjectId} from "@/lib/project-validation"; import {calculateTaskMetrics} from "@/lib/task-metrics"; import type {Objective} from "@/types/objective"; import type {Task} from "@/types/task";
export default async function ProjectPage({params}:{params:Promise<{id:string}>}){const{id}=await params;if(!isProjectId(id))notFound();const{supabase,user}=await requireUser();const[{data:project},{data:objectiveRows},{data:taskRows}]=await Promise.all([supabase.from("projects").select("id,title,description").eq("id",id).eq("user_id",user.id).maybeSingle(),supabase.from("objectives").select("id,project_id,title,description,target_date,completed,completed_at,created_at").eq("project_id",id).eq("user_id",user.id),supabase.from("tasks").select("id,project_id,objective_id,title,description,status,priority,due_date,completed_at,created_at").eq("project_id",id).eq("user_id",user.id).order("created_at")]);if(!project)notFound();const objectives=(objectiveRows??[]) as Objective[];const tasks=(taskRows??[]) as Task[];const metrics=calculateTaskMetrics(tasks,new Date().toISOString().slice(0,10));return <main className="mx-auto max-w-5xl p-6 text-white"><h1 className="text-4xl font-bold">{project.title}</h1><p className="mt-3">Objectifs : {calculateObjectiveProgress(objectives)} %</p><section className="mt-10"><h2 className="text-2xl font-bold">Nouvelle tâche</h2><div className="mt-5"><TaskForm projectId={id} objectives={objectives}/></div></section><section className="mt-10"><h2 className="text-2xl font-bold">Tâches</h2><p className="mt-3 text-[#9cafc3]">{metrics.total} total · {metrics.completed} terminées · {metrics.remaining} restantes · {metrics.overdue} en retard</p><div className="mt-5"><TaskList projectId={id} tasks={tasks} objectives={objectives}/></div></section><section className="mt-12"><h2 className="text-2xl font-bold">Objectifs</h2><ObjectiveForm projectId={id}/><div className="mt-5 grid gap-4">{objectives.map((objective)=><ObjectiveCard key={objective.id} projectId={id} objective={objective}/>)}</div></section></main>}`,
  },
  {
    path: "app/dashboard/page.tsx", action: "Remplacer entièrement", code: `import AppShell from "@/components/AppShell"; import {requireUser} from "@/lib/auth"; import {calculateTaskMetrics} from "@/lib/task-metrics"; import type {Task} from "@/types/task";
export default async function DashboardPage(){const{supabase,user}=await requireUser();const[{data:profile},{data:projects},{data:taskRows,error}]=await Promise.all([supabase.from("profiles").select("first_name").eq("id",user.id).maybeSingle(),supabase.from("projects").select("id").eq("user_id",user.id),supabase.from("tasks").select("status,due_date").eq("user_id",user.id)]);const firstName=profile?.first_name||"Membre";const metrics=calculateTaskMetrics((taskRows??[]) as Task[],new Date().toISOString().slice(0,10));return <AppShell firstName={firstName} email={user.email||""}><main className="mx-auto max-w-6xl p-6 md:p-10"><h1 className="text-4xl font-bold">Bonjour {firstName}</h1>{error?<p role="alert">Indicateurs indisponibles.</p>:<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Projets",projects?.length??0],["Tâches terminées",metrics.completed],["Tâches restantes",metrics.remaining],["En retard",metrics.overdue]].map(([label,value])=><article key={label} className="rounded-2xl bg-[#101d2d] p-6"><p className="text-[#9cafc3]">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></article>)}</section>}</main></AppShell>}`,
  },
] as const;

export default function LaunchCraftLessonSix({lessonCompleted,moduleProgress}:{lessonCompleted:boolean;moduleProgress:number}){return <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8"><div className="mx-auto w-full max-w-7xl"><div className="flex flex-wrap justify-between gap-3"><Link href="/formation/api-ia/05">← Leçon 05</Link><span>Leçon 06 · {moduleProgress} %</span></div><header className="mt-10 rounded-[32px] bg-[#07111f] p-8 md:p-12 text-white"><p className="text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p><h1 className="mt-4 text-4xl font-bold md:text-6xl">Créer, prioriser et terminer les tâches</h1><p className="mt-5 max-w-3xl text-[#9cafc3]">Transformez chaque objectif en actions planifiées et obtenez des indicateurs réels.</p></header><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="min-w-0 space-y-7"><Block title="Relation projet → objectif → tâche" tone>Toute tâche appartient à un projet. Elle peut aussi pointer vers un objectif du même projet. Le serveur vérifie cette cohérence avant chaque écriture.</Block><section className="rounded-3xl bg-white p-7"><h2 className="text-2xl font-bold">Fichiers cumulatifs complets</h2><div className="mt-8 space-y-10">{lessonFiles.map((file,index)=><CodeFile key={file.path} index={index+1} {...file}/>)}</div></section><Block title="Vérifications intermédiaires"><ul className="list-disc space-y-2 pl-5"><li>Créez une tâche sans objectif puis avec un objectif du projet.</li><li>Changez priorité, statut et échéance.</li><li>Terminez puis rouvrez la tâche : <code>completed_at</code> suit le statut.</li><li>Testez les filtres et vérifiez les quatre indicateurs du dashboard.</li><li>Supprimez une tâche après confirmation.</li></ul></Block><Block title="Erreurs fréquentes"><ul className="list-disc space-y-2 pl-5"><li>Objectif inaccessible : il doit appartenir au projet courant.</li><li>Date refusée : utilisez <code>YYYY-MM-DD</code>.</li><li>Retard incorrect : comparez une date locale normalisée et ignorez les tâches terminées.</li><li>N’ajoutez jamais <code>user_id</code> ou <code>project_id</code> au formulaire.</li></ul></Block><Block title="Test avec deux comptes et deux projets"><ol className="list-decimal space-y-2 pl-5"><li>Avec A, créez les projets A1 et A2 et un objectif dans chacun.</li><li>Dans A1, vérifiez qu’un objectif de A2 ne peut pas être imposé à une tâche.</li><li>Avec B, ouvrez l’URL de A1 : elle reste introuvable.</li><li>Vérifiez que B ne peut modifier, terminer ou supprimer aucune tâche de A.</li></ol></Block><div className="flex gap-3"><Link href="/formation/api-ia/06/exercice" className="rounded-xl bg-slate-950 px-6 py-3 text-white">Passer le QCM sécurisé</Link>{lessonCompleted&&<Link href="/formation/api-ia/07" className="rounded-xl border px-6 py-3">Continuer vers la leçon 07 →</Link>}</div></div><aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Block title="Sécurité"><ul className="list-disc pl-5"><li>Session serveur</li><li>Projet parent vérifié</li><li>Objectif du même projet</li><li>Filtres tâche + projet + utilisateur</li><li>RLS active</li></ul></Block><LessonCoach lessonId="api-06-ai-call" lessonLabel="LaunchCraft · Leçon 06"/></aside></div></div></main>}
function Block({title,children,tone=false}:{title:string;children:ReactNode;tone?:boolean}){return <section className={tone?"rounded-3xl bg-violet-100 p-7":"rounded-3xl bg-white p-7 shadow-sm"}><h2 className="text-xl font-bold">{title}</h2><div className="mt-4 leading-7">{children}</div></section>}
function CodeFile({index,path,action,code}:{index:number;path:string;action:string;code:string}){return <article className="min-w-0"><p className="font-bold text-violet-700">FICHIER {index} · {action}</p><h3 className="mt-2 break-all font-mono font-bold">{path}</h3><pre className="mt-4 max-h-[34rem] max-w-full overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-white"><code>{code}</code></pre></article>}
