import type { ProjectStatus, TaskPriority, TaskStatus } from "@/types/launchcraft";

const labels: Record<ProjectStatus | TaskPriority | TaskStatus, string> = { planning: "Planification", active: "Actif", paused: "En pause", completed: "Terminé", todo: "À faire", in_progress: "En cours", low: "Faible", medium: "Moyenne", high: "Haute" };

export default function StatusBadge({ value }: { value: ProjectStatus | TaskPriority | TaskStatus }) {
  return <span className={`badge badge-${value}`}>{labels[value]}</span>;
}
