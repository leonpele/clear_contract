-- ContractClear: analyses run by visitors without an account.
-- The result stays server-side until the visitor signs up and claims it.
-- Run in Supabase SQL Editor or via Supabase CLI.

create table if not exists public.guest_analyses (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  contract_text text not null,
  analysis_json jsonb not null,
  claimed_by uuid references public.profiles (id) on delete set null,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Per-IP rate limiting looks up recent rows by hash.
create index if not exists guest_analyses_ip_created_idx
  on public.guest_analyses (ip_hash, created_at desc);

-- Cleanup of stale unclaimed rows.
create index if not exists guest_analyses_unclaimed_idx
  on public.guest_analyses (created_at)
  where claimed_by is null;

-- No RLS policies: this table is read and written only through the
-- service-role admin client (server-side). Anon/authenticated roles get
-- zero access, so a visitor can never read a result without claiming it.
alter table public.guest_analyses enable row level security;
