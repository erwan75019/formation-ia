"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialFormState, signIn, signUp } from "@/app/actions/auth";

function SubmitButton({ signup }: { signup: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Vérification…" : signup ? "Créer mon compte" : "Se connecter"}</button>;
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [state, action] = useActionState(signup ? signUp : signIn, initialFormState);
  return <section className="auth-card"><span className="demo-chip">Espace sécurisé</span><h1>{signup ? "Créer votre espace" : "Bon retour parmi nous"}</h1><p>{signup ? "Préparez votre prochain lancement avec une vue claire." : "Retrouvez vos projets, tâches et échéances."}</p><form action={action}>{signup && <label>Prénom<input type="text" name="first_name" autoComplete="given-name" minLength={2} maxLength={80} required /></label>}<label>Adresse email<input type="email" name="email" autoComplete="email" required /></label><label>Mot de passe<input type="password" name="password" autoComplete={signup ? "new-password" : "current-password"} minLength={8} maxLength={128} required /></label>{state.error && <p className="form-error" role="alert">{state.error}</p>}{state.success && <p className="form-success" role="status">{state.success}</p>}<SubmitButton signup={signup}/></form><p className="auth-switch">{signup ? "Déjà un espace ?" : "Pas encore d’espace ?"} <Link href={signup ? "/connexion" : "/inscription"}>{signup ? "Se connecter" : "S’inscrire"}</Link></p></section>;
}
