import type { LaunchProject, LaunchTask } from "@/types/launchcraft";

export function getProjectTasks(projectId: string, allTasks: readonly LaunchTask[]) {
  return allTasks.filter((task) => task.projectId === projectId);
}

export function calculateProgress(projectId: string, allTasks: readonly LaunchTask[]) {
  const projectTasks = getProjectTasks(projectId, allTasks);
  if (projectTasks.length === 0) return null;
  const completed = projectTasks.filter((task) => task.status === "completed").length;
  return Math.round((completed / projectTasks.length) * 100);
}

export function isTaskOverdue(task: LaunchTask, today: string) {
  return task.status !== "completed" && task.dueDate !== null && task.dueDate < today;
}

export function getUpcomingTasks(allTasks: readonly LaunchTask[], today: string, limit = 6) {
  return allTasks.filter((task) => task.status !== "completed" && task.dueDate !== null && task.dueDate >= today).toSorted((a, b) => a.dueDate!.localeCompare(b.dueDate!)).slice(0, limit);
}

export function calculateDashboardStats(allProjects: readonly LaunchProject[], allTasks: readonly LaunchTask[], today: string) {
  const completedTasks = allTasks.filter((task) => task.status === "completed").length;
  const progresses = allProjects.map((project) => calculateProgress(project.id, allTasks)).filter((value): value is number => value !== null);
  return {
    activeProjects: allProjects.filter((project) => project.status === "active" || project.status === "planning").length,
    completedTasks,
    remainingTasks: allTasks.length - completedTasks,
    overdueTasks: allTasks.filter((task) => isTaskOverdue(task, today)).length,
    averageProgress: progresses.length ? Math.round(progresses.reduce((sum, value) => sum + value, 0) / progresses.length) : null,
  };
}

export function findProjectBySlug(slug: string, allProjects: readonly LaunchProject[]) {
  return allProjects.find((project) => project.slug === slug);
}
