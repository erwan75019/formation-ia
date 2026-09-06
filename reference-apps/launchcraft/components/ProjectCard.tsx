import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import { calculateProgress } from "@/lib/metrics";
import type { LaunchProject, LaunchTask } from "@/types/launchcraft";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project, tasks }: { project: LaunchProject; tasks: readonly LaunchTask[] }) {
  return <article className={`project-card project-${project.color}`}><div className="project-card-top"><span>Projet de lancement</span><StatusBadge value={project.status}/></div><h2>{project.title}</h2><p>{project.description||"Aucune description."}</p><ProgressBar value={calculateProgress(project.id, tasks)}/><div className="project-meta"><span>Échéance · {project.dueDate?formatDate(project.dueDate):"Non définie"}</span><Link href={`/projets/${project.slug}`}>Voir le projet <span aria-hidden="true">→</span></Link></div></article>;
}
