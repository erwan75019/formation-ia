import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const supabase = await createClient();
  if (!supabase) redirect("/connexion?error=configuration");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return { supabase, user };
}
