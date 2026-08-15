begin;

-- La colonne email est requise par le trigger de création de profil.
alter table public.profiles
  add column if not exists email text;

-- Retirer l'ancien contrat avant de convertir les valeurs existantes.
alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  alter column plan drop default;

update public.profiles
set plan = case
  when plan = 'starter' then 'fondamentaux'
  when plan in ('pro', 'expert') then 'complet'
  else plan
end
where plan in ('starter', 'pro', 'expert');

alter table public.profiles
  add constraint profiles_plan_check
  check (plan is null or plan in ('fondamentaux', 'complet'));

-- Créer un profil sans accorder de droits à partir des métadonnées client.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    email,
    plan,
    subscription_status
  )
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    new.email,
    null,
    'inactive'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Supprimer exactement une politique parmi une paire de SELECT identiques.
do $$
declare
  duplicate_policy_name text;
begin
  select second_policy.policyname
  into duplicate_policy_name
  from pg_policies as first_policy
  join pg_policies as second_policy
    on second_policy.schemaname = first_policy.schemaname
   and second_policy.tablename = first_policy.tablename
   and second_policy.cmd = first_policy.cmd
   and second_policy.permissive = first_policy.permissive
   and second_policy.roles = first_policy.roles
   and second_policy.qual is not distinct from first_policy.qual
   and second_policy.with_check is not distinct from first_policy.with_check
   and second_policy.policyname > first_policy.policyname
  where first_policy.schemaname = 'public'
    and first_policy.tablename = 'profiles'
    and first_policy.cmd = 'SELECT'
  order by second_policy.policyname
  limit 1;

  if duplicate_policy_name is null then
    raise exception
      'Aucune paire de politiques SELECT dupliquées trouvée sur public.profiles';
  end if;

  execute format(
    'drop policy %I on public.profiles',
    duplicate_policy_name
  );
end;
$$;

commit;
