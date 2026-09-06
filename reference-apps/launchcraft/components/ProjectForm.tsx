"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialFormState } from "@/app/actions/auth";
import { createProject, updateProject } from "@/app/actions/workspace";
import type { LaunchProject } from "@/types/launchcraft";

function Submit() { const {pending}=useFormStatus(); return <button className="button primary" type="submit" disabled={pending}>{pending?"Enregistrement…":"Enregistrer le projet"}</button>; }
export default function ProjectForm({project}:{project?:LaunchProject}){const action=project?updateProject.bind(null,project.id):createProject;const[state,formAction]=useActionState(action,initialFormState);return <form className="project-form" action={formAction}>{state.error&&<p className="form-error" role="alert">{state.error}</p>}<div className="form-grid"><label>Titre<input name="title" defaultValue={project?.title} minLength={3} maxLength={120} required/></label><label>Statut<select name="status" defaultValue={project?.status??"planning"}><option value="planning">Planification</option><option value="active">Actif</option><option value="paused">En pause</option><option value="completed">Terminé</option></select></label><label className="wide">Description<textarea name="description" rows={5} maxLength={2000} defaultValue={project?.description}/></label><label>Couleur<select name="color" defaultValue={project?.color??"violet"}><option value="violet">Violet</option><option value="mint">Menthe</option><option value="coral">Corail</option><option value="blue">Bleu</option></select></label><label>Date de début<input name="start_date" type="date" defaultValue={project?.startDate??""}/></label><label>Date d’échéance<input name="due_date" type="date" defaultValue={project?.dueDate??""}/></label></div><div className="form-actions"><Link className="button secondary" href={project?`/projets/${project.slug}`:"/projets"}>Annuler</Link><Submit/></div></form>}
