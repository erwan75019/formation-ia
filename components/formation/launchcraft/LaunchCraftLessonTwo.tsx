import Link from "next/link";

import LessonCoach from "@/components/formation/LessonCoach";

const typeFile = `export type ProjectStatus =
  | "planning"
  | "active"
  | "paused"
  | "completed";

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
};`;

const migrationFile = `begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 2000),
  status text not null default 'planning'
    check (status in ('planning', 'active', 'paused', 'completed')),
  color text not null default 'violet' check (color ~ '^[a-z0-9-]{1,30}$'),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_dates_check
    check (due_date is null or start_date is null or due_date >= start_date),
  constraint projects_user_slug_key unique (user_id, slug),
  constraint projects_user_id_id_key unique (user_id, id)
);

create table public.objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null,
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '' check (char_length(description) <= 1000),
  target_date date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint objectives_completion_check check (
    (completed and completed_at is not null) or
    (not completed and completed_at is null)
  ),
  constraint objectives_project_owner_fkey
    foreign key (user_id, project_id)
    references public.projects(user_id, id) on delete cascade,
  constraint objectives_user_id_id_key unique (user_id, id),
  constraint objectives_owner_project_id_key unique (user_id, project_id, id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null,
  objective_id uuid,
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'completed')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_completion_check check (
    (status = 'completed' and completed_at is not null) or
    (status <> 'completed' and completed_at is null)
  ),
  constraint tasks_project_owner_fkey
    foreign key (user_id, project_id)
    references public.projects(user_id, id) on delete cascade,
  constraint tasks_objective_owner_fkey
    foreign key (user_id, project_id, objective_id)
    references public.objectives(user_id, project_id, id)
    on delete set null (objective_id)
);

create index projects_user_status_idx
  on public.projects(user_id, status);
create index projects_user_due_date_idx
  on public.projects(user_id, due_date);
create index objectives_user_project_idx
  on public.objectives(user_id, project_id);
create index objectives_user_target_date_idx
  on public.objectives(user_id, target_date);
create index tasks_user_project_idx
  on public.tasks(user_id, project_id);
create index tasks_user_objective_idx
  on public.tasks(user_id, objective_id)
  where objective_id is not null;
create index tasks_user_status_due_date_idx
  on public.tasks(user_id, status, due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger objectives_set_updated_at
before update on public.objectives
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.objectives enable row level security;
alter table public.tasks enable row level security;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "projects_select_own"
  on public.projects for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "projects_insert_own"
  on public.projects for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "projects_update_own"
  on public.projects for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "projects_delete_own"
  on public.projects for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "objectives_select_own"
  on public.objectives for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "objectives_insert_own"
  on public.objectives for insert to authenticated
  with check (
    (select auth.uid()) = user_id and exists (
      select 1 from public.projects p
      where p.id = project_id
      and p.user_id = (select auth.uid())
    )
  );

create policy "objectives_update_own"
  on public.objectives for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id and exists (
      select 1 from public.projects p
      where p.id = project_id
      and p.user_id = (select auth.uid())
    )
  );

create policy "objectives_delete_own"
  on public.objectives for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "tasks_select_own"
  on public.tasks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "tasks_insert_own"
  on public.tasks for insert to authenticated
  with check (
    (select auth.uid()) = user_id and
    exists (
      select 1 from public.projects p
      where p.id = project_id
      and p.user_id = (select auth.uid())
    ) and
    (
      objective_id is null or exists (
        select 1 from public.objectives o
        where o.id = objective_id
        and o.project_id = project_id
        and o.user_id = (select auth.uid())
      )
    )
  );

create policy "tasks_update_own"
  on public.tasks for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id and
    exists (
      select 1 from public.projects p
      where p.id = project_id
      and p.user_id = (select auth.uid())
    ) and
    (
      objective_id is null or exists (
        select 1 from public.objectives o
        where o.id = objective_id
        and o.project_id = project_id
        and o.user_id = (select auth.uid())
      )
    )
  );

create policy "tasks_delete_own"
  on public.tasks for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.profiles, public.projects, public.objectives, public.tasks
  from anon;
grant select on public.profiles to authenticated;
grant update (first_name) on public.profiles to authenticated;
grant select, insert, update, delete
  on public.projects, public.objectives, public.tasks
  to authenticated;

commit;`;

const diagramFile = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title description">
  <title id="title">Schéma des données LaunchCraft</title>
  <desc id="description">Un profil possède des projets. Un projet possède des objectifs et des tâches. Une tâche peut appartenir à un objectif.</desc>
  <rect width="1200" height="720" fill="#07111f"/>
  <text x="60" y="70" fill="#f7f8fa" font-family="Arial" font-size="34" font-weight="700">Modèle de données LaunchCraft</text>
  <text x="60" y="105" fill="#9cafc3" font-family="Arial" font-size="18">Chaque ligne métier appartient à un utilisateur authentifié.</text>
  <g stroke="#7c5cfc" stroke-width="4" fill="none"><path d="M300 260 H450"/><path d="M750 260 H900"/><path d="M600 370 V480"/><path d="M750 560 H900"/></g>
  <g fill="#39d6a6" font-family="Arial" font-size="16" font-weight="700"><text x="352" y="248">1 → plusieurs</text><text x="785" y="248">1 → plusieurs</text><text x="615" y="430">1 → plusieurs</text><text x="780" y="548">optionnel</text></g>
  <g font-family="Arial">
    <g><rect x="60" y="170" width="240" height="190" rx="20" fill="#101d2d" stroke="#39d6a6"/><text x="85" y="210" fill="#39d6a6" font-size="22" font-weight="700">profiles</text><text x="85" y="245" fill="#f7f8fa" font-size="17">id</text><text x="85" y="275" fill="#f7f8fa" font-size="17">first_name</text><text x="85" y="305" fill="#9cafc3" font-size="15">created_at · updated_at</text></g>
    <g><rect x="450" y="150" width="300" height="220" rx="20" fill="#101d2d" stroke="#7c5cfc"/><text x="475" y="190" fill="#c7bcff" font-size="22" font-weight="700">projects</text><text x="475" y="225" fill="#f7f8fa" font-size="17">id · user_id</text><text x="475" y="255" fill="#f7f8fa" font-size="17">title · slug · description</text><text x="475" y="285" fill="#f7f8fa" font-size="17">status · color</text><text x="475" y="315" fill="#9cafc3" font-size="15">start_date · due_date</text></g>
    <g><rect x="900" y="160" width="250" height="210" rx="20" fill="#101d2d" stroke="#ff7a7a"/><text x="925" y="200" fill="#ffaaaa" font-size="22" font-weight="700">objectives</text><text x="925" y="235" fill="#f7f8fa" font-size="17">id · user_id</text><text x="925" y="265" fill="#f7f8fa" font-size="17">project_id · title</text><text x="925" y="295" fill="#f7f8fa" font-size="17">target_date</text><text x="925" y="325" fill="#9cafc3" font-size="15">completed · completed_at</text></g>
    <g><rect x="450" y="480" width="300" height="190" rx="20" fill="#101d2d" stroke="#64a8ff"/><text x="475" y="520" fill="#a8d0ff" font-size="22" font-weight="700">tasks</text><text x="475" y="555" fill="#f7f8fa" font-size="17">id · user_id · project_id</text><text x="475" y="585" fill="#f7f8fa" font-size="17">objective_id · title</text><text x="475" y="615" fill="#f7f8fa" font-size="17">status · priority · due_date</text></g>
  </g>
</svg>`;

const lessonFiles = [
  { path: "types/launchcraft.ts", action: "Créer", code: typeFile },
  {
    path: "supabase/migrations/202608220001_initial_launchcraft.sql",
    action: "Créer",
    code: migrationFile,
  },
  { path: "public/database-schema.svg", action: "Créer", code: diagramFile },
] as const;

export default function LaunchCraftLessonTwo({
  lessonCompleted,
  moduleProgress,
}: {
  lessonCompleted: boolean;
  moduleProgress: number;
}) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/formation/api-ia/01" className="text-sm font-semibold text-slate-600">
            ← Revenir à la leçon 01
          </Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Leçon 02 · Progression du module {moduleProgress} %
          </span>
        </div>

        <header className="mt-10 rounded-[32px] bg-[#07111f] p-8 text-white shadow-xl md:p-12">
          <p className="text-xs font-bold tracking-[0.2em] text-[#39d6a6]">MODULE 07 · LAUNCHCRAFT</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">
            Concevoir la base de données et ses protections
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#9cafc3]">
            L’interface existe déjà. Vous allez maintenant définir précisément les données dont LaunchCraft aura besoin, sans encore créer les écrans de connexion.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <InfoBlock title="Résultat visible" tone="violet">
              Vous pourrez ouvrir <code>http://localhost:3000/database-schema.svg</code> pour voir les quatre tables et leurs relations. Dans votre projet Supabase LaunchCraft séparé, le Table Editor affichera <code>profiles</code>, <code>projects</code>, <code>objectives</code> et <code>tasks</code>, toutes protégées par RLS.
            </InfoBlock>

            <InfoBlock title="Ce que vous conservez de la leçon 01">
              Ne recréez pas le projet et ne remplacez aucun composant visuel. Ouvrez le même dossier <code>launchcraft</code> dans VS Code. Le dashboard sombre doit continuer à fonctionner pendant toute cette leçon.
            </InfoBlock>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE 1</p>
              <h2 className="mt-3 text-2xl font-bold">Comprendre les quatre tables</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["profiles", "Le nom public associé au compte Supabase."],
                  ["projects", "Les projets de lancement appartenant à un utilisateur."],
                  ["objectives", "Les résultats précis à atteindre pour un projet."],
                  ["tasks", "Les actions avec statut, priorité et échéance."],
                ].map(([name, description]) => (
                  <article key={name} className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="font-bold"><code>{name}</code></h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </article>
                ))}
              </div>
              <p className="mt-5 leading-7 text-slate-600">
                Une clé primaire identifie une ligne. Une clé étrangère relie deux tables. <code>user_id</code> indique toujours le propriétaire ; il permettra ensuite à RLS d’isoler les comptes.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE 2</p>
              <h2 className="mt-3 text-2xl font-bold">Créer les fichiers dans VS Code</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-slate-600">
                <li>Dans l’Explorateur, créez les dossiers <code>types</code>, <code>supabase/migrations</code> puis utilisez le dossier <code>public</code> existant.</li>
                <li>Pour chaque fichier ci-dessous, cliquez sur le bon dossier puis sur l’icône Nouveau fichier.</li>
                <li>Copiez le bloc complet, enregistrez, puis effectuez la vérification avant de continuer.</li>
              </ol>
              <div className="mt-8 space-y-9">
                {lessonFiles.map((file, index) => (
                  <CodeFile key={file.path} index={index + 1} {...file} />
                ))}
              </div>
            </section>

            <InfoBlock title="Ce que protège le SQL">
              <ul className="list-disc space-y-2 pl-5">
                <li>Les contraintes refusent les titres trop courts, statuts inconnus et dates incohérentes.</li>
                <li>Les relations empêchent de rattacher un objectif au projet d’un autre utilisateur.</li>
                <li>Les index accélèrent les recherches par utilisateur, statut, projet et échéance.</li>
                <li>RLS applique la règle de propriété directement dans PostgreSQL.</li>
                <li>Le trigger de profil prépare la leçon 03, sans créer encore d’interface de connexion.</li>
              </ul>
            </InfoBlock>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold tracking-[0.18em] text-violet-700">ÉTAPE 3</p>
              <h2 className="mt-3 text-2xl font-bold">Créer un projet Supabase séparé</h2>
              <ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-slate-700">
                <li>Ouvrez le tableau de bord officiel Supabase et créez un projet nommé par exemple <code>launchcraft-dev</code>.</li>
                <li>Vérifiez que ce n’est jamais le projet Supabase d’AI Academy.</li>
                <li>Ouvrez <strong>SQL Editor → New query</strong>.</li>
                <li>Copiez le contenu complet de la migration créée dans VS Code, puis cliquez sur <strong>Run</strong>.</li>
                <li>Ouvrez <strong>Table Editor</strong> et vérifiez les quatre tables.</li>
              </ol>
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                N’ajoutez aucune clé dans le code à cette étape. Le client Supabase et les variables d’environnement seront introduits avec l’authentification dans la leçon 03.
              </div>
            </section>

            <InfoBlock title="Vérifications intermédiaires" tone="mint">
              <ol className="list-decimal space-y-2 pl-5">
                <li><code>npx tsc --noEmit</code> ne signale aucune erreur dans <code>types/launchcraft.ts</code>.</li>
                <li><code>/database-schema.svg</code> affiche quatre blocs lisibles.</li>
                <li>Supabase confirme la réussite du script sans créer de ligne.</li>
                <li>Les quatre tables indiquent que RLS est activée.</li>
                <li><code>npm run dev</code> affiche toujours le dashboard de la leçon 01.</li>
              </ol>
            </InfoBlock>

            <section className="rounded-3xl border border-orange-200 bg-orange-50 p-7 text-orange-950 shadow-sm">
              <h2 className="text-2xl font-bold">Erreurs fréquentes</h2>
              <div className="mt-5 space-y-4 text-sm leading-6">
                <p><strong>“relation already exists” :</strong> la migration a déjà été exécutée. Ne la relancez pas et vérifiez les tables existantes.</p>
                <p><strong>Vous ne voyez aucune donnée :</strong> c’est normal. Cette leçon crée la structure, pas de faux comptes ou projets.</p>
                <p><strong>Le SVG affiche du texte brut :</strong> vérifiez que le fichier se termine par <code>.svg</code> et se trouve directement dans <code>public</code>.</p>
                <p><strong>Vous êtes dans le mauvais projet Supabase :</strong> arrêtez-vous immédiatement. Cette formation exige un projet LaunchCraft totalement séparé.</p>
              </div>
            </section>

            <InfoBlock title="Mini-exercice">
              Dans le schéma SVG, repérez le chemin entre une tâche et son propriétaire : <code>tasks.user_id → auth.users.id</code>. Expliquez ensuite avec vos mots pourquoi conserver également <code>project_id</code> dans la tâche est utile. Ne modifiez pas encore le SQL.
            </InfoBlock>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Valider la leçon</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Le QCM vérifie les relations, contraintes et protections. Le navigateur n’envoie que vos quatre choix ; le serveur calcule le résultat.
              </p>
              {lessonCompleted ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-xl bg-emerald-100 px-5 py-3 font-semibold text-emerald-800">Leçon validée ✓</span>
                  <Link href="/formation/api-ia/03" className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Continuer vers la leçon 03 →</Link>
                </div>
              ) : (
                <Link href="/formation/api-ia/02/exercice" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Faire le QCM sécurisé →</Link>
              )}
            </section>
          </div>

          <LessonCoach lessonId="api-02-http" lessonLabel="LaunchCraft · Leçon 02" />
        </div>
      </div>
    </main>
  );
}

function InfoBlock({ title, children, tone = "default" }: { title: string; children: React.ReactNode; tone?: "default" | "violet" | "mint" }) {
  const colors = tone === "violet" ? "border-violet-200 bg-violet-50" : tone === "mint" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white";
  return <section className={`rounded-3xl border p-7 shadow-sm ${colors}`}><h2 className="text-2xl font-bold">{title}</h2><div className="mt-4 leading-7 text-slate-700">{children}</div></section>;
}

function CodeFile({ index, path, action, code }: { index: number; path: string; action: string; code: string }) {
  return <article><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">{index}. <code>{path}</code></h3><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">{action}</span></div><pre className="mt-3 max-h-[600px] overflow-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100"><code>{code}</code></pre><div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><strong>Vérification :</strong> enregistrez le fichier et vérifiez son chemin dans l’Explorateur avant de continuer.</div></article>;
}
