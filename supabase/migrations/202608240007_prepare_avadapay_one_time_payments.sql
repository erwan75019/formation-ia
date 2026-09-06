begin;

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  provider text not null default 'avadapay',
  plan text not null,
  operator text not null,
  provider_id smallint not null,
  amount numeric(12, 2) not null,
  currency text not null,
  status text not null default 'pending',
  transaction_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_orders_provider_check
    check (provider = 'avadapay'),
  constraint payment_orders_order_id_check
    check (char_length(order_id) between 12 and 100),
  constraint payment_orders_plan_check
    check (plan in ('fondamentaux', 'complet')),
  constraint payment_orders_operator_provider_check
    check (
      (operator = 'mpesa' and provider_id = 9) or
      (operator = 'orange_money' and provider_id = 10) or
      (operator = 'airtel_money' and provider_id = 17)
    ),
  constraint payment_orders_amount_check
    check (amount > 0),
  constraint payment_orders_currency_check
    check (currency ~ '^[A-Z]{3}$'),
  constraint payment_orders_status_check
    check (status in ('pending', 'processing', 'paid', 'failed', 'canceled', 'expired')),
  constraint payment_orders_paid_state_check
    check (
      (status = 'paid' and paid_at is not null and transaction_id is not null) or
      (status <> 'paid' and paid_at is null)
    ),
  constraint payment_orders_transaction_id_check
    check (transaction_id is null or char_length(transaction_id) between 1 and 255),
  constraint payment_orders_provider_transaction_key
    unique (provider, transaction_id)
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'avadapay',
  event_id text not null,
  order_id text references public.payment_orders(order_id) on delete restrict,
  event_type text not null,
  status text not null default 'received',
  payload_hash text not null,
  provider_created_at timestamptz,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_code text,
  constraint payment_events_provider_check
    check (provider = 'avadapay'),
  constraint payment_events_event_id_check
    check (char_length(event_id) between 1 and 255),
  constraint payment_events_event_type_check
    check (char_length(event_type) between 1 and 120),
  constraint payment_events_status_check
    check (status in ('received', 'processed', 'failed')),
  constraint payment_events_payload_hash_check
    check (payload_hash ~ '^[0-9a-f]{64}$'),
  constraint payment_events_processing_check
    check (
      (status = 'processed' and processed_at is not null and error_code is null) or
      (status = 'failed' and processed_at is null and error_code is not null) or
      (status = 'received' and processed_at is null and error_code is null)
    ),
  constraint payment_events_provider_event_key
    unique (provider, event_id)
);

create index payment_orders_user_created_idx
  on public.payment_orders (user_id, created_at desc);

create index payment_orders_user_status_idx
  on public.payment_orders (user_id, status);

create index payment_orders_pending_provider_idx
  on public.payment_orders (provider, created_at)
  where status in ('pending', 'processing');

create index payment_events_order_received_idx
  on public.payment_events (order_id, received_at desc);

create index payment_events_unprocessed_idx
  on public.payment_events (provider, received_at)
  where status = 'received';

create or replace function public.set_payment_order_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_payment_order_updated_at() from public;

create trigger payment_orders_set_updated_at
before update on public.payment_orders
for each row
execute function public.set_payment_order_updated_at();

alter table public.payment_orders enable row level security;
alter table public.payment_events enable row level security;

create policy "Users can read own payment orders"
  on public.payment_orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.payment_orders from anon, authenticated;
grant select on table public.payment_orders to authenticated;
grant select, insert, update on table public.payment_orders to service_role;

revoke all on table public.payment_events from anon, authenticated;
grant select, insert, update on table public.payment_events to service_role;

-- Le futur callback AvadaPay réutilisera ces colonnes sans les modifier ici.
grant select, update (
  plan,
  subscription_status,
  current_period_end
) on table public.profiles to service_role;

commit;
