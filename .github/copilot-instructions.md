# ContractClear - Copilot Instructions

This file provides Copilot with workspace-specific guidance for working on the ContractClear SaaS project.

## Project Overview

**ContractClear** is a Next.js 14 SaaS application that analyzes contracts using OpenAI GPT-4, explaining legal documents in plain language, with accounts, a monthly free-tier quota, and Stripe upgrades.

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **AI Engine**: OpenAI API (GPT-4 Turbo)
- **Auth & Data**: Supabase (Auth: email/password + Google; Postgres: `profiles`, `contract_analyses`, RLS)
- **Payments**: Stripe (one-time + subscription), entitlements applied via webhook

## Key Architecture Decisions

1. **Freemium Model**: 3 free analyses per calendar month, tracked server-side on the user's `profiles` row (`analyses_used` / `analyses_limit`) — see `lib/entitlements.ts`. Resets automatically when the month changes.
2. **Authentication Required**: `/analyze`, `/account`, `/history`, `/premium`, `/checkout` are auth-gated via `middleware.ts` + Supabase session. `/api/analyze` returns `401` if not signed in.
3. **Server-Side API Calls**: All sensitive API calls (OpenAI, Stripe, Supabase service-role writes) happen server-side.
4. **Entitlements from Stripe webhook, not the client**: `/api/stripe/webhook` calls `applyOneTimePurchase` / `applyProSubscription` / `deactivateProSubscription` in `lib/profile/service.ts` — never trust client-reported payment state.
5. **Static Display Pricing**: Copy shown in the UI lives in `/lib/stripe.ts`; the actual charged price comes from Stripe Price IDs (`STRIPE_PRICE_ONETIME` / `STRIPE_PRICE_SUBSCRIPTION` env vars).

## File Structure

```
/app              - Next.js App Router pages and API routes
/components       - React components (UploadZone, ResultsPanel, PaywallModal, PricingCard, contract-risk/, contract-highlight/, auth/, ui/)
/lib              - Utility functions, Supabase clients, entitlements, and configuration
/supabase/migrations - SQL schema (profiles, contract_analyses, RLS, triggers)
```

## Common Tasks

### Adding a New Feature
1. Create component in `/components/` if UI-related
2. Create API route in `/app/api/` if backend logic needed
3. Update `/app/analyze/page.tsx` or relevant page to integrate
4. If it touches quota/plan, update `lib/entitlements.ts` and `lib/profile/service.ts` together — don't duplicate quota logic elsewhere

### Modifying Pricing
- Edit `/lib/stripe.ts` for plan names, prices, descriptions (display only)
- Create/update the actual Stripe prices in the Stripe Dashboard
- Update `STRIPE_PRICE_ONETIME` / `STRIPE_PRICE_SUBSCRIPTION` in the environment

### Changing Free Tier Limit
- Edit `FREE_ANALYSES_PER_MONTH` in `/lib/entitlements.ts` (single source of truth, used by both API and UI)

### Updating OpenAI Model/Prompt
- Edit `/app/api/analyze/route.ts` — `model`, `max_tokens`, `temperature`, and `SYSTEM_PROMPT` (the prompt defines the exact JSON shape: `summary`, `risk_score`, `risky_clauses[].severity`, `favorable_clauses`, `key_numbers`)
- `lib/normalizeAnalysisResponse.ts` defensively normalizes/repairs the parsed JSON before it's used — update it if you change the prompt's output shape

## Important Notes

- **Environment Variables**: All secrets must be in `.env.local` (not committed)
  - `OPENAI_API_KEY` from https://platform.openai.com/api-keys
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ONETIME`, `STRIPE_PRICE_SUBSCRIPTION` from Stripe Dashboard
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from Supabase project settings
- **Stripe Webhook**: Must be configured in Stripe Dashboard for payment/subscription state to reach `profiles`
- **Supabase Migration**: `supabase/migrations/001_profiles_and_analyses.sql` must be applied before profiles/history work
- **PDF Upload**: Extracted text is capped at 50,000 characters (`/api/upload`); `/api/analyze` also rejects text over 50,000 characters
- **Row-Level Security**: `profiles` and `contract_analyses` have RLS — use the admin client (`lib/supabase/admin.ts`, service-role key) for writes that must bypass RLS (webhook, quota increments), never expose that key to the client

## Development Workflow

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Error Handling Guidelines

- **API Routes**: Always return proper HTTP status codes (401 for unauthenticated, 402 for quota exceeded, 400/500 otherwise)
- **Frontend**: Show user-friendly error messages in UI
- **Console Logging**: Use for debugging, remove before production
- **Error Types**: Handle Stripe errors (`Stripe.errors.StripeError`) and OpenAI errors (`OpenAI.APIError`) distinctly

## Stripe Integration Notes

- **Keys**: `STRIPE_SECRET_KEY` (server-side) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend)
- **Webhook Secret**: Required for verifying webhook authenticity
- **Session Management**: Created in `/api/stripe/checkout` (requires signed-in user; `client_reference_id` and `metadata.supabase_user_id` carry the user id), confirmed in `/api/stripe/webhook`
- **Checkout Modes**: `payment` for one-time, `subscription` for recurring
- **Price validation**: `/api/stripe/checkout` verifies the resolved Price ID's recurring-ness matches the requested `planType` before creating the session

## OpenAI API Notes

- **Model**: `gpt-4-turbo`
- **Max Tokens**: 2200 (JSON analysis response includes risk score + severities)
- **Temperature**: 0 (deterministic responses)
- **System Prompt**: Instructs GPT-4 to return JSON-only, with quotes copied verbatim so they can be matched back into the original text for highlighting
- **Error Handling**: Catch both API errors and JSON parse errors

## Testing Checklist

Before deploying:
- [ ] Sign up / sign in (including Google) works and a `profiles` row is created
- [ ] Analyze a contract with the free tier (3 tries in a calendar month)
- [ ] Verify the paywall appears once quota is exhausted, and resets next month
- [ ] Test one-time payment flow (Stripe test card: 4242 4242 4242 4242) and confirm credits are added
- [ ] Test subscription payment and confirm unlimited access + `/account` reflects Pro
- [ ] Test PDF upload with various file sizes
- [ ] Test text input near the 50k character limit
- [ ] Test error handling (network failures, invalid files, expired session)
- [ ] Check responsive design on mobile
- [ ] Confirm `/history` lists past analyses for the signed-in user only (RLS)

## Deployment Checklist

- [ ] Set all environment variables (OpenAI, Stripe, Supabase) in Vercel/hosting platform
- [ ] Apply the Supabase migration to the production project
- [ ] Configure Stripe webhook endpoint to production URL
- [ ] Verify OpenAI API key has sufficient credits
- [ ] Test payment flows in production
- [ ] Monitor error logs and Stripe/Supabase dashboards
