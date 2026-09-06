import type { ProjectStatus, TaskPriority, TaskStatus } from "@/types/launchcraft";

export type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };
const text = (value: FormDataEntryValue | null) => typeof value === "string" ? value.trim() : "";
const optionalDate = (value: FormDataEntryValue | null) => {
  const candidate = text(value);
  return candidate === "" ? null : /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : undefined;
};
const allowedProjectStatuses = new Set<ProjectStatus>(["planning", "active", "paused", "completed"]);
const allowedTaskStatuses = new Set<TaskStatus>(["todo", "in_progress", "completed"]);
const allowedPriorities = new Set<TaskPriority>(["low", "medium", "high"]);

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export function validateAuth(formData: FormData, signup: boolean): ValidationResult<{email:string;password:string;firstName:string}> {
  const email=text(formData.get("email")); const password=text(formData.get("password")); const firstName=text(formData.get("first_name"));
  if (!/^\S+@\S+\.\S+$/.test(email)) return {success:false,error:"Saisissez une adresse email valide."};
  if (password.length < 8 || password.length > 128) return {success:false,error:"Le mot de passe doit contenir entre 8 et 128 caractères."};
  if (signup && (firstName.length < 2 || firstName.length > 80)) return {success:false,error:"Le prénom doit contenir entre 2 et 80 caractères."};
  return {success:true,data:{email,password,firstName}};
}

export function validateProject(formData: FormData) {
  const title=text(formData.get("title")); const description=text(formData.get("description")); const color=text(formData.get("color")); const status=text(formData.get("status")) as ProjectStatus;
  const startDate=optionalDate(formData.get("start_date")); const dueDate=optionalDate(formData.get("due_date"));
  if (title.length < 3 || title.length > 120) return {success:false,error:"Le titre doit contenir entre 3 et 120 caractères."} as const;
  if (description.length > 2000) return {success:false,error:"La description ne doit pas dépasser 2 000 caractères."} as const;
  if (!allowedProjectStatuses.has(status)) return {success:false,error:"Statut de projet invalide."} as const;
  if (startDate === undefined || dueDate === undefined || (startDate && dueDate && dueDate < startDate)) return {success:false,error:"Les dates du projet sont invalides."} as const;
  if (!/^[a-z0-9-]{1,30}$/.test(color)) return {success:false,error:"Couleur invalide."} as const;
  return {success:true,data:{title,slug:slugify(title),description,status,color,start_date:startDate,due_date:dueDate}} as const;
}

export function validateObjective(formData: FormData) {
  const title=text(formData.get("title")); const description=text(formData.get("description")); const targetDate=optionalDate(formData.get("target_date"));
  if (title.length < 3 || title.length > 160) return {success:false,error:"Le titre de l’objectif est invalide."} as const;
  if (description.length > 1000 || targetDate === undefined) return {success:false,error:"Les informations de l’objectif sont invalides."} as const;
  return {success:true,data:{title,description,target_date:targetDate}} as const;
}

export function validateTask(formData: FormData) {
  const title=text(formData.get("title")); const description=text(formData.get("description")); const dueDate=optionalDate(formData.get("due_date"));
  const status=text(formData.get("status")) as TaskStatus; const priority=text(formData.get("priority")) as TaskPriority;
  if (title.length < 3 || title.length > 160) return {success:false,error:"Le titre de la tâche est invalide."} as const;
  if (description.length > 2000 || dueDate === undefined || !allowedTaskStatuses.has(status) || !allowedPriorities.has(priority)) return {success:false,error:"Les informations de la tâche sont invalides."} as const;
  return {success:true,data:{title,description,due_date:dueDate,status,priority}} as const;
}
