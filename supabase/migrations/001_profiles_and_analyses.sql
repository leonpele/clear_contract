-- ContractClear: profiles, analysis history, RLS, auto-profile trigger
-- Run in Supabase SQL Editor or via Supabase CLI

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  purchase_type text check (purchase_type is null or purchase_type in ('one-time')),
  analyses_used integer not null default 0 check (analyses_used >= 0),
  analyses_limit integer not null default 3 check (analyses_limit >= 0),
  subscription_status text check (
    subscription_status is null
    or subscription_status in ('active', 'inactive', 'canceled', 'past_due')
  ),
  usage_month text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- contract_analyses (history per user)
-- ---------------------------------------------------------------------------
create table if not exists public.contract_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  contract_preview text,
  analysis_json jsonb not null,
  risk_score_percentage integer,
  created_at timestamptz not null default now()
);

create index if not exists contract_analyses_user_id_idx on public.contract_analyses (user_id);
create index if not exists contract_analyses_created_at_idx on public.contract_analyses (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, usage_month)
  values (
    new.id,
    new.email,
    to_char(now() at time zone 'utc', 'YYYY-MM')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.contract_analyses enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users read own analyses" on public.contract_analyses;
create policy "Users read own analyses"
  on public.contract_analyses for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own analyses" on public.contract_analyses;
create policy "Users insert own analyses"
  on public.contract_analyses for insert
  with check (auth.uid() = user_id);

-- Service role bypasses RLS for webhooks (use SUPABASE_SERVICE_ROLE_KEY server-side only)
