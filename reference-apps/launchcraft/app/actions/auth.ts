"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateAuth } from "@/lib/validation";

export type FormState = { error: string; success?: string };
export const initialFormState: FormState = { error: "" };

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = validateAuth(formData, false);
  if (!parsed.success) return { error: parsed.error };
  const supabase = await createClient();
  if (!supabase) return { error: "Configurez d’abord le projet Supabase LaunchCraft." };
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: "Email ou mot de passe incorrect." };
  redirect("/dashboard");
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = validateAuth(formData, true);
  if (!parsed.success) return { error: parsed.error };
  const supabase = await createClient();
  if (!supabase) return { error: "Configurez d’abord le projet Supabase LaunchCraft." };
  const origin = (await headers()).get("origin") ?? "http://localhost:3200";
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { first_name: parsed.data.firstName },
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) return { error: "Impossible de créer le compte. Vérifiez les informations." };
  if (data.session) redirect("/dashboard");
  return { error: "", success: "Compte créé. Consultez votre email pour confirmer l’inscription." };
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/connexion");
}
