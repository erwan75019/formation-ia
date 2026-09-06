"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { FormState } from "./auth";
import { validateObjective, validateProject, validateTask } from "@/lib/validation";

const refresh = () => {
  revalidatePath("/dashboard"); revalidatePath("/projets");
  revalidatePath("/taches"); revalidatePath("/calendrier");
};

export async function createProject(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = validateProject(formData);
  if (!parsed.success) return { error: parsed.error };
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("projects").insert({ ...parsed.data, user_id: user.id });
  if (error) return { error: error.code === "23505" ? "Un projet utilise déjà ce titre." : "Impossible de créer le projet." };
  refresh(); redirect(`/projets/${parsed.data.slug}`);
}

export async function updateProject(projectId: string, _: FormState, formData: FormData): Promise<FormState> {
  const parsed = validateProject(formData);
  if (!parsed.success) return { error: parsed.error };
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("projects").update(parsed.data).eq("id", projectId).eq("user_id", user.id);
  if (error) return { error: "Impossible de modifier ce projet." };
  refresh(); redirect(`/projets/${parsed.data.slug}`);
}

export async function deleteProject(projectId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", user.id);
  if (error) throw new Error("Impossible de supprimer ce projet.");
  refresh(); redirect("/projets");
}

async function ownsProject(projectId: string) {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", user.id).maybeSingle();
  return { supabase, user, owns: Boolean(data) };
}

export async function createObjective(projectId: string, formData: FormData) {
  const parsed = validateObjective(formData); if (!parsed.success) throw new Error(parsed.error);
  const { supabase, user, owns } = await ownsProject(projectId); if (!owns) throw new Error("Projet inaccessible.");
  const { error } = await supabase.from("objectives").insert({ ...parsed.data, project_id: projectId, user_id: user.id, completed: false, completed_at: null });
  if (error) throw new Error("Impossible de créer l’objectif."); refresh();
}

export async function toggleObjective(objectiveId: string, completed: boolean) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("objectives").update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq("id", objectiveId).eq("user_id", user.id);
  if (error) throw new Error("Impossible de modifier l’objectif."); refresh();
}

export async function deleteObjective(objectiveId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("objectives").delete().eq("id", objectiveId).eq("user_id", user.id);
  if (error) throw new Error("Impossible de supprimer l’objectif."); refresh();
}

export async function createTask(projectId: string, formData: FormData) {
  const parsed = validateTask(formData); if (!parsed.success) throw new Error(parsed.error);
  const objectiveId = typeof formData.get("objective_id") === "string" && formData.get("objective_id") !== "" ? String(formData.get("objective_id")) : null;
  const { supabase, user, owns } = await ownsProject(projectId); if (!owns) throw new Error("Projet inaccessible.");
  if (objectiveId) {
    const { data } = await supabase.from("objectives").select("id").eq("id", objectiveId).eq("project_id", projectId).eq("user_id", user.id).maybeSingle();
    if (!data) throw new Error("Objectif inaccessible.");
  }
  const completedAt = parsed.data.status === "completed" ? new Date().toISOString() : null;
  const { error } = await supabase.from("tasks").insert({ ...parsed.data, project_id: projectId, objective_id: objectiveId, user_id: user.id, completed_at: completedAt });
  if (error) throw new Error("Impossible de créer la tâche."); refresh();
}

export async function createTaskForSelectedProject(formData: FormData) {
  const projectId = typeof formData.get("project_id") === "string"
    ? String(formData.get("project_id"))
    : "";
  if (!/^[0-9a-f-]{36}$/i.test(projectId)) throw new Error("Projet invalide.");
  return createTask(projectId, formData);
}

export async function updateTaskStatus(taskId: string, status: "todo"|"in_progress"|"completed") {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").update({ status, completed_at: status === "completed" ? new Date().toISOString() : null }).eq("id", taskId).eq("user_id", user.id);
  if (error) throw new Error("Impossible de modifier la tâche."); refresh();
}

export async function deleteTask(taskId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", user.id);
  if (error) throw new Error("Impossible de supprimer la tâche."); refresh();
}

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const firstName = typeof formData.get("first_name") === "string" ? String(formData.get("first_name")).trim() : "";
  if (firstName.length < 2 || firstName.length > 80) return { error: "Le prénom doit contenir entre 2 et 80 caractères." };
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("profiles").update({ first_name: firstName }).eq("id", user.id);
  if (error) return { error: "Impossible de mettre à jour le profil." };
  revalidatePath("/parametres"); return { error: "", success: "Profil mis à jour." };
}
