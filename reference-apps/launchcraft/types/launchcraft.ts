export type ProjectStatus = "planning" | "active" | "paused" | "completed";
export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type LaunchProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  status: ProjectStatus;
  color: string;
};

export type Objective = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string | null;
  completed: boolean;
  completedAt: string | null;
};

export type LaunchTask = {
  id: string;
  projectId: string;
  objectiveId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
};
