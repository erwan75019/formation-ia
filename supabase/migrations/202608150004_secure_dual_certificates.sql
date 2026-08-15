begin;

alter table public.certificates
  add column if not exists certificate_type text;

update public.certificates
set certificate_type = 'complet',
    course_name = 'Conception d’applications et de systèmes d’intelligence artificielle',
    issued_at = created_at
where certificate_type is null;

alter table public.certificates
  alter column certificate_type set not null;

alter table public.certificates
  drop constraint if exists certificates_certificate_type_check;

alter table public.certificates
  add constraint certificates_certificate_type_check
  check (certificate_type in ('fondamentaux', 'complet'));

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint as con
    where con.conrelid = 'public.certificates'::regclass
      and con.contype = 'u'
      and array_length(con.conkey, 1) = 1
      and con.conkey[1] = (
        select attnum
        from pg_attribute
        where attrelid = 'public.certificates'::regclass
          and attname = 'user_id'
          and not attisdropped
      )
  loop
    execute format(
      'alter table public.certificates drop constraint %I',
      constraint_name
    );
  end loop;
end;
$$;

alter table public.certificates
  drop constraint if exists certificates_user_id_certificate_type_key;

alter table public.certificates
  add constraint certificates_user_id_certificate_type_key
  unique (user_id, certificate_type);

do $$
declare
  policy_name text;
begin
  for policy_name in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'certificates'
      and cmd = 'INSERT'
  loop
    execute format(
      'drop policy %I on public.certificates',
      policy_name
    );
  end loop;
end;
$$;

revoke insert on table public.certificates from anon, authenticated;

grant select on table public.profiles to service_role;
grant select on table public.lesson_progress to service_role;
grant select, insert on table public.certificates to service_role;

commit;
