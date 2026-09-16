# Supabase setup — ContractClear

## 1. Create project

1. [supabase.com](https://supabase.com) → New project
2. Copy **Project URL**, **anon key**, and **service_role key** into `.env.local`

## 2. Run SQL migration

In **SQL Editor**, run the full contents of:

`supabase/migrations/001_profiles_and_analyses.sql`

This creates `profiles`, `contract_analyses`, RLS policies, and the auto-profile trigger.

## 3. Auth providers

### Email / password

Authentication → Providers → Email → enable.

### Google

1. Authentication → Providers → Google → enable
2. Add OAuth client in Google Cloud Console
3. Redirect URL: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Site URL in Supabase: `http://localhost:3000` (dev) and your Vercel URL (prod)

### Redirect URLs (Auth → URL configuration)

- `http://localhost:3000/auth/callback`
- `https://your-domain.com/auth/callback`

## 4. Stripe webhook

Point Stripe webhook to `/api/stripe/webhook` and include:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Checkout sessions attach `supabase_user_id` in metadata (requires signed-in user).

## 5. Vercel env vars

Add the same Supabase and Stripe variables as `.env.local.example`.
