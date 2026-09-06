import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import type { LaunchProject, LaunchTask } from "@/types/launchcraft";
import StatusBadge from "./StatusBadge";
export default function UpcomingTasks({tasks,projects}:{tasks:readonly LaunchTask[];projects:readonly LaunchProject[]}){return <section className="panel upcoming"><div className="panel-heading"><div><p className="eyebrow">À VENIR</p><h2>Prochaines actions</h2></div><Link href="/taches">Toutes les tâches</Link></div><div className="task-list">{tasks.map((task)=><article key={task.id}><span className={`task-dot priority-${task.priority}`}/><div><strong>{task.title}</strong><small>{projects.find((project)=>project.id===task.projectId)?.title}</small></div><time dateTime={task.dueDate??undefined}>{task.dueDate?formatDate(task.dueDate):"Sans date"}</time><StatusBadge value={task.priority}/></article>)}</div></section>}
