export type LaunchCraftTaskMetricInput = {
  status: "todo" | "in_progress" | "completed";
  due_date: string | null;
};

export function calculateLaunchCraftTaskMetrics(
  tasks: readonly LaunchCraftTaskMetricInput[],
  today: string
) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const overdue = tasks.filter(
    (task) => task.status !== "completed" && task.due_date !== null && task.due_date < today
  ).length;
  return { total: tasks.length, completed, remaining: tasks.length - completed, overdue };
}
