begin;

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
  status text not null default 'planning' check (status in ('planning','active','paused','completed')),
  color text not null default 'violet' check (color ~ '^[a-z0-9-]{1,30}$'),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_dates_check check (due_date is null or start_date is null or due_date >= start_date),
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
    (completed and completed_at is not null) or (not completed and completed_at is null)
  ),
  constraint objectives_project_owner_fkey foreign key (user_id, project_id)
    references public.projects(user_id, id) on delete cascade,
  constraint objectives_user_id_id_key unique (user_id, id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null,
  objective_id uuid references public.objectives(id) on delete set null,
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  status text not null default 'todo' check (status in ('todo','in_progress','completed')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_completion_check check (
    (status = 'completed' and completed_at is not null) or
    (status <> 'completed' and completed_at is null)
  ),
  constraint tasks_project_owner_fkey foreign key (user_id, project_id)
    references public.projects(user_id, id) on delete cascade
);

create index projects_user_status_idx on public.projects(user_id, status);
create index projects_user_due_date_idx on public.projects(user_id, due_date);
create index objectives_user_project_idx on public.objectives(user_id, project_id);
create index objectives_user_target_date_idx on public.objectives(user_id, target_date);
create index tasks_user_project_idx on public.tasks(user_id, project_id);
create index tasks_user_objective_idx on public.tasks(user_id, objective_id) where objective_id is not null;
create index tasks_user_status_due_date_idx on public.tasks(user_id, status, due_date);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger objectives_set_updated_at before update on public.objectives
for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, first_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 80))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.objectives enable row level security;
alter table public.tasks enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "projects_select_own" on public.projects for select to authenticated using ((select auth.uid()) = user_id);
create policy "projects_insert_own" on public.projects for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "projects_update_own" on public.projects for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "projects_delete_own" on public.projects for delete to authenticated using ((select auth.uid()) = user_id);

create policy "objectives_select_own" on public.objectives for select to authenticated using ((select auth.uid()) = user_id);
create policy "objectives_insert_own" on public.objectives for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid())
  )
);
create policy "objectives_update_own" on public.objectives for update to authenticated using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid())
  )
);
create policy "objectives_delete_own" on public.objectives for delete to authenticated using ((select auth.uid()) = user_id);

create policy "tasks_select_own" on public.tasks for select to authenticated using ((select auth.uid()) = user_id);
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check (
  (select auth.uid()) = user_id and
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid())) and
  (objective_id is null or exists (
    select 1 from public.objectives o
    where o.id = objective_id and o.project_id = project_id and o.user_id = (select auth.uid())
  ))
);
create policy "tasks_update_own" on public.tasks for update to authenticated using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id and
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid())) and
  (objective_id is null or exists (
    select 1 from public.objectives o
    where o.id = objective_id and o.project_id = project_id and o.user_id = (select auth.uid())
  ))
);
create policy "tasks_delete_own" on public.tasks for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.profiles, public.projects, public.objectives, public.tasks from anon;
grant select on public.profiles to authenticated;
grant update (first_name) on public.profiles to authenticated;
grant select, insert, update, delete on public.projects, public.objectives, public.tasks to authenticated;

commit;
