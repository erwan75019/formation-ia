begin;

alter table public.profiles
  add column if not exists stripe_price_id text,
  add column if not exists subscription_cancel_at_period_end boolean
    not null default false,
  add column if not exists stripe_event_created_at timestamptz;

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  stripe_created_at timestamptz not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

revoke all on table public.stripe_webhook_events from anon, authenticated;
grant all on table public.stripe_webhook_events to service_role;

commit;
