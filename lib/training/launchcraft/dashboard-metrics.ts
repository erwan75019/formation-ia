type ObjectiveInput = { completed: boolean };
type TaskInput = { id: string; title: string; project_id: string; status: string; due_date: string | null };

export function calculateLaunchCraftDashboardMetrics(
  projectCount: number,
  objectives: readonly ObjectiveInput[],
  tasks: readonly TaskInput[],
  today: string
) {
  const achievedObjectives = objectives.filter((item) => item.completed).length;
  const completedTasks = tasks.filter((item) => item.status === "completed").length;
  const overdueTasks = tasks.filter((item) => item.status !== "completed" && item.due_date !== null && item.due_date < today).length;
  const upcomingTasks = tasks.filter((item) => item.status !== "completed" && item.due_date !== null && item.due_date >= today)
    .toSorted((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  return {
    projects: projectCount,
    objectives: objectives.length,
    achievedObjectives,
    objectiveProgress: objectives.length === 0 ? 0 : Math.round((achievedObjectives / objectives.length) * 100),
    tasks: tasks.length,
    completedTasks,
    remainingTasks: tasks.length - completedTasks,
    overdueTasks,
    upcomingTasks,
  };
}
