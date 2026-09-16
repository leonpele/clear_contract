# ContractClear - Quick Setup Guide

This is a condensed setup checklist. See `README.md` for the full feature list and architecture, and `SUPABASE_SETUP.md` for Supabase-specific steps.

## ✅ Project Structure

### Pages
- **`/`** — Landing page with hero, features, pricing, and CTAs
- **`/login`, `/signup`** — Supabase auth (email/password + Google)
- **`/analyze`** — Main contract analyzer interface (requires sign-in)
- **`/account`** — Plan, usage, and subscription management
- **`/history`** — Past analyses
- **`/premium`** — Upgrade / checkout entry point
- **`/success`** — Payment confirmation page

### API Routes
- **`POST /api/analyze`** — Auth + quota check, OpenAI contract analysis, saves history
- **`POST /api/upload`** — Server-side PDF text extraction
- **`GET /api/profile`** — Current user's plan/quota info
- **`POST /api/stripe/checkout`** — Creates Stripe checkout sessions
- **`POST /api/stripe/webhook`** — Applies plan/quota entitlements from Stripe events

### Components
- **`UploadZone.tsx`** — PDF upload with drag-and-drop
- **`ResultsPanel.tsx`** — Displays risk score, summary, highlighted clauses, key numbers
- **`PaywallModal.tsx`** — Freemium upgrade prompt
- **`PricingCard.tsx`** — Reusable pricing card component
- **`contract-risk/`, `contract-highlight/`** — Risk score UI and clause-to-text highlighting
- **`auth/`** — Auth form, nav, shell

### Utilities
- **`lib/entitlements.ts`** — Plan/quota logic (source of truth for free-tier limits)
- **`lib/profile/service.ts`** — Supabase profile CRUD and Stripe entitlement updates
- **`lib/stripe.ts`** — Display pricing for the UI
- **`lib/supabase/`** — Client/server/admin Supabase clients + session middleware

## 🚀 Getting Started

### 1. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_PRICE_ONETIME=price_xxx
STRIPE_PRICE_SUBSCRIPTION=price_yyy
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to get your keys:**
- **OpenAI**: https://platform.openai.com/api-keys (API Keys section)
- **Stripe**: https://dashboard.stripe.com/ (Developers → API Keys)
- **Supabase**: https://app.supabase.com/ (Project Settings → API)

### 2. Set Up Supabase

Run `supabase/migrations/001_profiles_and_analyses.sql` in the Supabase SQL Editor. This creates `profiles`, `contract_analyses`, RLS policies, and the auto-profile-on-signup trigger.

### 3. Create Stripe Price IDs

1. Go to Stripe Dashboard → **Products** → **Create product**
2. Create **Product 1** (One-time): €3, one-time payment, grants 5 credits — note the **Price ID**
3. Create **Product 2** (Subscription): €8/month, recurring — note the **Price ID**
4. Put both Price IDs in `.env.local` as `STRIPE_PRICE_ONETIME` and `STRIPE_PRICE_SUBSCRIPTION`

### 4. Start Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Testing Checklist

Before going live, test:
- [ ] Landing page loads and looks good
- [ ] Sign up, sign in, and Google sign-in work
- [ ] Upload PDF and paste contract text work
- [ ] 3 free analyses per month work correctly, quota resets next month
- [ ] Paywall appears once the monthly quota is exhausted
- [ ] Stripe checkout opens (use test card: 4242 4242 4242 4242)
- [ ] One-time payment adds 5 credits; subscription unlocks unlimited access
- [ ] History page shows past analyses
- [ ] Results display correctly (risk score, summary, highlighted clauses, key numbers)
- [ ] Mobile responsive design works

## 🎨 Customization

### Change Free Tier Limit
Edit `FREE_ANALYSES_PER_MONTH` in `/lib/entitlements.ts` (single source of truth for UI and API).

### Change Pricing
Edit `/lib/stripe.ts` for display copy, and update the actual Stripe Price IDs in `.env.local`.

### Update OpenAI Model / Prompt
Edit `/app/api/analyze/route.ts` — `model`, `max_tokens`, and `SYSTEM_PROMPT`.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

After deployment:
1. Set all environment variables (including Supabase ones) in the Vercel dashboard
2. Configure the Stripe webhook: `https://your-domain.com/api/stripe/webhook`
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel to match

## 📝 Key Features

✅ **3 free analyses/month**, tracked server-side against the account (Supabase), resets automatically
✅ **Accounts** via Supabase Auth (email/password + Google)
✅ **Risk score + highlighted clauses**, matched back into the original contract text
✅ **History** of past analyses per user
✅ **Stripe payments** (one-time credits + subscription), entitlements applied via webhook
✅ **Server-side security** (OpenAI, Stripe, and Supabase service-role calls never touch the client)

## 📞 Troubleshooting

**"Cannot find module 'pdf-parse'"**
- Run `npm install` again

**"Sign in required to analyze contracts."**
- The analyzer is auth-gated; sign in or sign up first

**"Could not load your account profile."**
- Run the Supabase migration and confirm `SUPABASE_SERVICE_ROLE_KEY` is set

**"Stripe API error" / checkout fails**
- Verify all Stripe keys and price IDs are correct and in the same mode (test vs live)

**"OpenAI API error"**
- Verify the API key is active and has available quota

**Build fails**
- Delete `node_modules` and `.next`, then `npm install` and `npm run build` again

## 🎉 You're All Set!

1. Set up environment variables (OpenAI, Stripe, Supabase)
2. Run the Supabase migration
3. Create Stripe price IDs
4. `npm run dev`
5. Test the full flow: sign up → analyze → hit quota → upgrade
