create table if not exists public.project_evaluation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  subject_version text not null,
  content_hash text not null,
  status text not null default 'processing',
  score smallint,
  passed boolean not null default false,
  rubric_details jsonb not null default '[]'::jsonb,
  improvements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  evaluated_at timestamptz,
  constraint project_evaluation_attempts_lesson_check check (
    lesson_id in (
      'prompts-05-project',
      'quotidien-05-mission',
      'fichiers-06-projet',
      'automation-07-project'
    )
  ),
  constraint project_evaluation_attempts_status_check check (
    status in ('processing', 'completed', 'failed')
  ),
  constraint project_evaluation_attempts_score_check check (
    score is null or score between 0 and 100
  ),
  constraint project_evaluation_attempts_content_hash_check check (
    content_hash ~ '^[0-9a-f]{64}$'
  ),
  constraint project_evaluation_attempts_unique_submission unique (
    user_id,
    lesson_id,
    subject_version,
    content_hash
  )
);

create index if not exists project_evaluation_attempts_user_lesson_created_idx
  on public.project_evaluation_attempts (user_id, lesson_id, created_at desc);

alter table public.project_evaluation_attempts enable row level security;

drop policy if exists "Users can read own project evaluation attempts"
  on public.project_evaluation_attempts;

create policy "Users can read own project evaluation attempts"
  on public.project_evaluation_attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.project_evaluation_attempts from anon, authenticated;
grant select on table public.project_evaluation_attempts to authenticated;
grant select, insert, update on table public.project_evaluation_attempts to service_role;

-- La route serveur est seule autorisée à valider les projets et doit pouvoir
-- conserver le meilleur score dans la progression officielle.
grant select, insert, update on table public.lesson_progress to service_role;
