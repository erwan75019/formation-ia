import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import type { LaunchProject, LaunchTask } from "@/types/launchcraft";
import EmptyState from "./EmptyState";

export default function Calendar({tasks,projects}:{tasks:readonly LaunchTask[];projects:readonly LaunchProject[]}) {const dated=tasks.filter((task)=>task.dueDate).toSorted((a,b)=>a.dueDate!.localeCompare(b.dueDate!));return <section className="panel calendar"><div className="panel-heading"><div><p className="eyebrow">ÉCHÉANCES</p><h2>Calendrier de lancement</h2></div><span className="demo-chip">{dated.length} dates</span></div>{dated.length===0?<EmptyState title="Aucune échéance" description="Ajoutez une date à une tâche pour la retrouver ici." href="/taches" label="Créer une tâche"/>:<div className="calendar-events">{dated.map((task)=>{const project=projects.find((item)=>item.id===task.projectId);return <article key={task.id}><time dateTime={task.dueDate!}>{formatDate(task.dueDate!)}</time><div><strong>{task.title}</strong><small>{project?.title??"Projet supprimé"}</small></div>{project&&<Link href={`/projets/${project.slug}`}>Voir</Link>}</article>})}</div>}</section>}
