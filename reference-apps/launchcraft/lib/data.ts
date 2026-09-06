import { requireUser } from "@/lib/auth";
import type { LaunchProject, LaunchTask, Objective } from "@/types/launchcraft";

export async function getWorkspace() {
  const { supabase, user } = await requireUser();
  const [profileResult, projectsResult, objectivesResult, tasksResult] = await Promise.all([
    supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle(),
    supabase.from("projects").select("id,title,slug,description,status,color,start_date,due_date").eq("user_id", user.id).order("created_at"),
    supabase.from("objectives").select("id,project_id,title,description,target_date,completed,completed_at").eq("user_id", user.id).order("created_at"),
    supabase.from("tasks").select("id,project_id,objective_id,title,description,status,priority,due_date,completed_at").eq("user_id", user.id).order("created_at"),
  ]);
  const error = profileResult.error ?? projectsResult.error ?? objectivesResult.error ?? tasksResult.error;
  if (error) throw new Error("Impossible de charger les données LaunchCraft.");

  const projects = (projectsResult.data ?? []).map((item): LaunchProject => ({ id:item.id, title:item.title, slug:item.slug, description:item.description, status:item.status, color:item.color, startDate:item.start_date, dueDate:item.due_date }));
  const objectives = (objectivesResult.data ?? []).map((item): Objective => ({ id:item.id, projectId:item.project_id, title:item.title, description:item.description, targetDate:item.target_date, completed:item.completed, completedAt:item.completed_at }));
  const tasks = (tasksResult.data ?? []).map((item): LaunchTask => ({ id:item.id, projectId:item.project_id, objectiveId:item.objective_id, title:item.title, description:item.description, status:item.status, priority:item.priority, dueDate:item.due_date, completedAt:item.completed_at }));
  return { user, firstName: profileResult.data?.first_name || user.email?.split("@")[0] || "", projects, objectives, tasks };
}
