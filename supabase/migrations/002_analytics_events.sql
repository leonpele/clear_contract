-- ContractClear: product analytics events + dashboard metrics RPC
-- Run in Supabase SQL Editor or via Supabase CLI

-- ---------------------------------------------------------------------------
-- analytics_events
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event text not null check (event in (
    'signup',
    'first_document_uploaded',
    'analysis_completed',
    'checkout',
    'subscription_active'
  )),
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_idx on public.analytics_events (event);

-- signup and first_document_uploaded only ever happen once per account;
-- this lets writers insert unconditionally and rely on the DB to dedupe.
create unique index if not exists analytics_events_once_per_user
  on public.analytics_events (user_id, event)
  where event in ('signup', 'first_document_uploaded');

-- No RLS policies: this table is written and read only via the service-role
-- admin client (server-side). Anon/authenticated roles get zero access.
alter table public.analytics_events enable row level security;

-- ---------------------------------------------------------------------------
-- Dashboard metrics: activation, retention, documents per account
-- ---------------------------------------------------------------------------
create or replace function public.get_dashboard_metrics()
returns json
language sql
stable
security definer
set search_path = public
as $$
  with accounts as (
    select count(*)::int as total from public.profiles
  ),
  per_user_days as (
    select user_id, count(distinct date_trunc('day', created_at))::int as active_days
    from public.analytics_events
    where event = 'analysis_completed'
    group by user_id
  ),
  activation as (
    select count(*)::int as activated_n from per_user_days
  ),
  retention as (
    select count(*) filter (where active_days > 1)::int as returning_n
    from per_user_days
  ),
  docs as (
    select count(*)::int as total_documents
    from public.analytics_events
    where event = 'analysis_completed'
  )
  select json_build_object(
    'total_accounts', (select total from accounts),
    'activated_accounts', (select activated_n from activation),
    'activation_rate', case when (select total from accounts) = 0 then 0
      else round(100.0 * (select activated_n from activation) / (select total from accounts), 1) end,
    'returning_accounts', (select returning_n from retention),
    'retention_rate', case when (select activated_n from activation) = 0 then 0
      else round(100.0 * (select returning_n from retention) / (select activated_n from activation), 1) end,
    'total_documents', (select total_documents from docs),
    'documents_per_account', case when (select total from accounts) = 0 then 0
      else round((select total_documents from docs)::numeric / (select total from accounts), 2) end
  );
$$;

revoke all on function public.get_dashboard_metrics() from public;
revoke all on function public.get_dashboard_metrics() from anon;
revoke all on function public.get_dashboard_metrics() from authenticated;
grant execute on function public.get_dashboard_metrics() to service_role;
