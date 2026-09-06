import Link from "next/link";
import type { ReactNode } from "react";

import LessonCoach from "@/components/formation/LessonCoach";
import LessonVisualPreview from "@/components/formation/launchcraft/LessonVisualPreview";

const lessonFiles = [
  {
    path: ".env.example",
    action: "Créer",
    code: `NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_PUBLISHABLE_KEY=votre-cle-publique`,
  },
  {
    path: ".env.local",
    action: "Créer uniquement sur votre ordinateur",
    code: `NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_URL=COLLEZ_ICI_VOTRE_URL_PUBLIQUE
NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_PUBLISHABLE_KEY=COLLEZ_ICI_VOTRE_CLE_PUBLIQUE`,
  },
  {
    path: "lib/supabase/config.ts",
    action: "Créer",
    code: `export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Configuration Supabase LaunchCraft manquante.");
  }

  return { url, publishableKey };
}`,
  },
  {
    path: "lib/supabase/client.ts",
    action: "Créer",
    code: `import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export function createClient() {
  const { url, publishableKey } = getSupabaseConfig();
  return createBrowserClient(url, publishableKey);
}`,
  },
  {
    path: "lib/supabase/server.ts",
    action: "Créer",
    code: `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Un Server Component ne peut pas toujours écrire les cookies.
          // proxy.ts se charge alors de rafraîchir la session.
        }
      },
    },
  });
}`,
  },
  {
    path: "lib/supabase/proxy.ts",
    action: "Créer",
    code: `import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const authPage = pathname === "/connexion" || pathname === "/inscription";
  const protectedPage = pathname.startsWith("/dashboard");

  if (!user && protectedPage) {
    const urlToLogin = request.nextUrl.clone();
    urlToLogin.pathname = "/connexion";
    return NextResponse.redirect(urlToLogin);
  }
  if (user && authPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }
  return response;
}`,
  },
  {
    path: "proxy.ts",
    action: "Créer à la racine du projet",
    code: `import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};`,
  },
  {
    path: "lib/auth.ts",
    action: "Créer",
    code: `import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/connexion");
  return { supabase, user };
}`,
  },
  {
    path: "lib/validation.ts",
    action: "Créer",
    code: `export type AuthData = {
  email: string;
  password: string;
  firstName: string;
};

export function validateAuth(formData: FormData, signup: boolean) {
  const value = (name: string) => {
    const entry = formData.get(name);
    return typeof entry === "string" ? entry.trim() : "";
  };
  const email = value("email");
  const password = value("password");
  const firstName = value("first_name");

  if (!/^\\S+@\\S+\\.\\S+$/.test(email))
    return { success: false as const, error: "Adresse email invalide." };
  if (password.length < 8 || password.length > 128)
    return { success: false as const, error: "Le mot de passe doit contenir entre 8 et 128 caractères." };
  if (signup && (firstName.length < 2 || firstName.length > 80))
    return { success: false as const, error: "Le prénom doit contenir entre 2 et 80 caractères." };

  return { success: true as const, data: { email, password, firstName } };
}`,
  },
  {
    path: "app/actions/auth.ts",
    action: "Créer",
    code: `"use server";

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
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Email ou mot de passe incorrect." };
  redirect("/dashboard");
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = validateAuth(formData, true);
  if (!parsed.success) return { error: parsed.error };
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { first_name: parsed.data.firstName },
      emailRedirectTo: origin + "/auth/callback",
    },
  });
  if (error) return { error: "Impossible de créer le compte." };
  if (data.session) redirect("/dashboard");
  return { error: "", success: "Compte créé. Confirmez votre email." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}`,
  },
  {
    path: "components/AuthForm.tsx",
    action: "Créer",
    code: `"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialFormState, signIn, signUp } from "@/app/actions/auth";

function SubmitButton({ signup }: { signup: boolean }) {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Vérification…" : signup ? "Créer mon compte" : "Se connecter"}</button>;
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [state, action] = useActionState(signup ? signUp : signIn, initialFormState);
  return (
    <section className="mx-auto w-full max-w-md rounded-3xl bg-[#101d2d] p-8 shadow-2xl">
      <h1 className="text-3xl font-bold">{signup ? "Créer votre espace" : "Se connecter"}</h1>
      <form action={action} className="mt-7 grid gap-5">
        {signup && <label className="grid gap-2">Prénom<input className="rounded-xl bg-[#172638] p-3" name="first_name" minLength={2} maxLength={80} required /></label>}
        <label className="grid gap-2">Adresse email<input className="rounded-xl bg-[#172638] p-3" type="email" name="email" autoComplete="email" required /></label>
        <label className="grid gap-2">Mot de passe<input className="rounded-xl bg-[#172638] p-3" type="password" name="password" autoComplete={signup ? "new-password" : "current-password"} minLength={8} maxLength={128} required /></label>
        {state.error && <p role="alert" className="text-[#ffaaaa]">{state.error}</p>}
        {state.success && <p role="status" className="text-[#39d6a6]">{state.success}</p>}
        <SubmitButton signup={signup} />
      </form>
      <p className="mt-6 text-[#9cafc3]">{signup ? "Déjà inscrit ?" : "Nouveau ici ?"} <Link className="text-[#39d6a6]" href={signup ? "/connexion" : "/inscription"}>{signup ? "Se connecter" : "Créer un compte"}</Link></p>
    </section>
  );
}`,
  },
  {
    path: "app/connexion/page.tsx",
    action: "Créer",
    code: `import AuthForm from "@/components/AuthForm";

export default function ConnexionPage() {
  return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6 text-white"><AuthForm mode="login" /></main>;
}`,
  },
  {
    path: "app/inscription/page.tsx",
    action: "Créer",
    code: `import AuthForm from "@/components/AuthForm";

export default function InscriptionPage() {
  return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6 text-white"><AuthForm mode="signup" /></main>;
}`,
  },
  {
    path: "app/auth/callback/route.ts",
    action: "Créer",
    code: `import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/dashboard", url.origin));
  }
  return NextResponse.redirect(new URL("/connexion", url.origin));
}`,
  },
  {
    path: "components/AppShell.tsx",
    action: "Remplacer entièrement",
    code: `import type { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

export default function AppShell({ children, firstName, email }: { children: ReactNode; firstName: string; email: string }) {
  return <div className="min-h-screen bg-[#07111f] text-[#f7f8fa]"><Sidebar firstName={firstName} email={email} /><MobileHeader /><div className="min-h-screen md:ml-64">{children}</div></div>;
}`,
  },
  {
    path: "components/Sidebar.tsx",
    action: "Remplacer entièrement",
    code: `import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export default function Sidebar({ firstName, email }: { firstName: string; email: string }) {
  return <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0a1625] p-6 md:flex md:flex-col"><Link href="/dashboard" className="text-xl font-bold">LaunchCraft</Link><nav aria-label="Navigation principale" className="mt-12"><Link href="/dashboard" className="block rounded-xl bg-[#172638] px-4 py-3">Vue d’ensemble</Link></nav><div className="mt-auto rounded-xl bg-[#101d2d] p-4"><strong className="block">{firstName}</strong><small className="text-[#9cafc3]">{email}</small><form action={signOut}><button className="mt-4 text-sm text-[#39d6a6]" type="submit">Se déconnecter</button></form></div></aside>;
}`,
  },
  {
    path: "app/dashboard/page.tsx",
    action: "Remplacer entièrement",
    code: `import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle();
  const firstName = profile?.first_name || String(user.user_metadata.first_name || "Membre");

  return <AppShell firstName={firstName} email={user.email || ""}><main className="mx-auto max-w-6xl px-5 py-10 md:px-10"><p className="text-[#39d6a6]">TABLEAU DE BORD PROTÉGÉ</p><h1 className="mt-3 text-4xl font-bold">Bonjour {firstName}</h1><p className="mt-5 text-[#9cafc3]">Votre session a été vérifiée côté serveur. Votre profil LaunchCraft est bien relié à votre compte.</p></main></AppShell>;
}`,
  },
] as const;

export default function LaunchCraftLessonThree({ lessonCompleted, moduleProgress }: { lessonCompleted: boolean; moduleProgress: number }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/formation/api-ia/02" className="text-sm font-semibold text-slate-600">← Revenir à la leçon 02</Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">Leçon 03 · Progression {moduleProgress} %</span>
        </div>

        <header className="mt-10 rounded-[32px] bg-[#07111f] p-8 text-white shadow-xl md:p-12">
          <p className="text-xs font-bold tracking-[0.2em] text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">Inscription, connexion et protection des routes</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#9cafc3]">Reliez votre interface au projet Supabase créé à la leçon 02. À la fin, un utilisateur pourra créer son compte, se connecter, voir son identité et se déconnecter d’un dashboard réellement protégé.</p>
        </header>

        <LessonVisualPreview
          title="Voici ce que vous allez construire"
          description="Ces captures proviennent des véritables routes publiques de LaunchCraft. Observez la séparation entre la promesse du produit et le formulaire sécurisé, puis la façon dont la même interface s’adapte sur mobile."
          desktop={{
            src: "/formation/launchcraft/lesson-03/inscription-desktop.png",
            alt: "Page d’inscription LaunchCraft sur ordinateur avec présentation du produit à gauche et formulaire de création de compte à droite",
            caption: "Le formulaire d’inscription demande uniquement le prénom, l’adresse email et le mot de passe dans une mise en page desktop en deux colonnes.",
            width: 1440,
            height: 900,
          }}
          mobile={{
            src: "/formation/launchcraft/lesson-03/connexion-mobile.png",
            alt: "Formulaire de connexion LaunchCraft adapté à un écran mobile étroit",
            caption: "Sur mobile, la présentation et le formulaire s’empilent sans masquer les champs ni le bouton de connexion.",
            width: 780,
            height: 1688,
          }}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <Block title="Avant de commencer" tone="violet">Ouvrez le même dossier <code>launchcraft</code>. Le dashboard de la leçon 01 et la migration de la leçon 02 doivent être présents. N’utilisez jamais le projet Supabase d’AI Academy.</Block>

            <section className="rounded-3xl bg-white p-7 shadow-sm">
              <Step number="1" title="Appliquer la migration dans LaunchCraft" />
              <ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-slate-700"><li>Dans le tableau de bord du projet Supabase <strong>LaunchCraft</strong>, ouvrez <strong>SQL Editor → New query</strong>.</li><li>Ouvrez dans VS Code <code>supabase/migrations/202608220001_initial_launchcraft.sql</code>.</li><li>Copiez tout son contenu dans SQL Editor, relisez le nom du projet affiché, puis cliquez sur <strong>Run</strong>.</li><li>Dans Table Editor, vérifiez les quatre tables. Dans Authentication, vérifiez qu’aucun utilisateur n’existe encore.</li></ol>
              <Check>Le message de réussite apparaît et les tables <code>profiles</code>, <code>projects</code>, <code>objectives</code> et <code>tasks</code> sont visibles avec RLS activée.</Check>
            </section>

            <section className="rounded-3xl bg-white p-7 shadow-sm">
              <Step number="2" title="Installer les bibliothèques et récupérer les valeurs publiques" />
              <p className="mt-4 leading-7 text-slate-700">Dans le terminal de LaunchCraft, exécutez :</p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100"><code>npm install @supabase/ssr@0.12.4 @supabase/supabase-js@2.112.3</code></pre>
              <p className="mt-4 leading-7 text-slate-700">Dans <strong>Project Settings → API</strong>, copiez seulement l’URL et la clé publique nommée <em>Publishable key</em> (ou <em>anon public</em> sur une interface plus ancienne). Une clé publique peut être envoyée au navigateur parce que RLS protège les lignes. La clé <code>service_role</code> contourne ces protections : elle n’appartient jamais à ce cours, à <code>.env.local</code> côté client, ni à une variable <code>NEXT_PUBLIC_</code>.</p>
              <Check>Après avoir créé <code>.env.local</code>, arrêtez puis relancez <code>npm run dev</code>. Le serveur doit démarrer sans message « Configuration Supabase manquante ».</Check>
            </section>

            <section className="rounded-3xl bg-white p-7 shadow-sm">
              <Step number="3" title="Créer les fichiers complets" />
              <p className="mt-4 leading-7 text-slate-700">Créez les dossiers manquants depuis l’Explorateur VS Code. Pour chaque bloc, respectez l’action indiquée, copiez tout le fichier puis enregistrez.</p>
              <div className="mt-8 space-y-10">{lessonFiles.map((file, index) => <CodeFile key={file.path} index={index + 1} {...file} />)}</div>
            </section>

            <Block title="Pourquoi deux clients Supabase ?"><code>client.ts</code> est destiné aux interactions navigateur. <code>server.ts</code> lit les cookies de la requête sur le serveur. Le proxy rafraîchit ces cookies, mais le dashboard appelle encore <code>auth.getUser()</code> : la protection ne repose donc jamais sur <code>localStorage</code> ou sur une affirmation du navigateur.</Block>

            <section className="rounded-3xl bg-white p-7 shadow-sm">
              <Step number="4" title="Tester le parcours complet" />
              <ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-slate-700"><li>Ouvrez <code>http://localhost:3000/dashboard</code> dans une fenêtre privée : vous devez arriver sur <code>/connexion</code>.</li><li>Ouvrez <code>/inscription</code>, utilisez une adresse de test vous appartenant et un mot de passe inédit d’au moins huit caractères.</li><li>Si la confirmation email est activée, ouvrez le lien reçu. Sinon, la session mène immédiatement au dashboard.</li><li>Vérifiez votre prénom et votre email dans l’interface, puis cliquez sur <strong>Se déconnecter</strong>.</li><li>Essayez de rouvrir <code>/dashboard</code> : la connexion est de nouveau exigée.</li></ol>
              <Check>Dans Supabase Authentication, un utilisateur existe. Dans <code>profiles</code>, le trigger a créé exactement la ligne du même identifiant. Aucune clé secrète n’apparaît dans le navigateur.</Check>
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7"><h2 className="text-2xl font-bold text-amber-950">Erreurs fréquentes</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-amber-950"><li><strong>Invalid API key :</strong> vérifiez que les deux valeurs viennent du projet LaunchCraft, puis relancez le serveur.</li><li><strong>La page reste sur connexion :</strong> contrôlez l’URL de redirection et le callback, puis confirmez l’email si Supabase le demande.</li><li><strong>Le profil est absent :</strong> la migration n’a probablement pas été appliquée avant l’inscription. Vérifiez le trigger <code>on_auth_user_created</code>.</li><li><strong>Erreur de cookies :</strong> ne remplacez pas <code>getAll</code>/<code>setAll</code> par une valeur en localStorage.</li></ul></section>

            <Block title="Résultat visible" tone="violet">LaunchCraft possède désormais les routes <code>/inscription</code>, <code>/connexion</code> et <code>/dashboard</code>. Le dashboard affiche l’identité du compte vérifiée côté serveur et reste inaccessible après déconnexion.</Block>

            <LessonVisualPreview
              title="Comparez votre résultat"
              description="Ouvrez votre route /connexion à côté de cette référence. Vérifiez la hiérarchie des textes, les deux champs correctement libellés, le bouton principal et le lien vers l’inscription."
              desktop={{
                src: "/formation/launchcraft/lesson-03/connexion-desktop.png",
                alt: "Page de connexion LaunchCraft sur ordinateur avec deux champs et bouton violet dans la colonne droite",
                caption: "Le résultat final desktop conserve l’identité visuelle LaunchCraft et présente un parcours de connexion clair, sans donnée personnelle préremplie.",
                width: 1440,
                height: 900,
              }}
            />

            <div className="flex flex-wrap gap-3"><Link href="/formation/api-ia/03/exercice" className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white">Passer le QCM sécurisé</Link>{lessonCompleted && <Link href="/formation/api-ia/04" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold">Continuer vers la leçon 04 →</Link>}</div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Block title="À retenir"><ul className="list-disc space-y-2 pl-5"><li>URL et clé publishable/anon sont publiques.</li><li><code>service_role</code> reste strictement secrète et absente.</li><li>RLS reste activée.</li><li><code>auth.getUser()</code> confirme l’utilisateur côté serveur.</li><li>Le trigger crée le profil.</li></ul></Block><LessonCoach lessonId="api-03-requests" lessonLabel="LaunchCraft · Leçon 03" /></aside>
        </div>
      </div>
    </main>
  );
}

function Step({ number, title }: { number: string; title: string }) { return <div><p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE {number}</p><h2 className="mt-3 text-2xl font-bold">{title}</h2></div>; }
function Check({ children }: { children: ReactNode }) { return <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 leading-7 text-emerald-950"><strong>Vérification — </strong>{children}</div>; }
function Block({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "violet" }) { return <section className={tone === "violet" ? "rounded-3xl bg-violet-100 p-7" : "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"}><h2 className="text-xl font-bold">{title}</h2><div className="mt-4 leading-7 text-slate-700">{children}</div></section>; }
function CodeFile({ index, path, action, code }: { index: number; path: string; action: string; code: string }) { return <article><p className="text-sm font-bold text-violet-700">FICHIER {index} · {action}</p><h3 className="mt-2 font-mono text-base font-bold">{path}</h3><pre className="mt-4 max-h-[34rem] overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-100"><code>{code}</code></pre></article>; }
