# ContractClear - AI-Powered Contract Analyzer

A Next.js SaaS application that analyzes contracts using OpenAI GPT-4, explaining legal documents in plain language, with account-based quotas and history.

## Features

- 📄 **Smart Upload**: Upload PDFs or paste contract text (up to 50,000 chars)
- 🔢 **Risk Score**: 0-100 risk score with level (low/medium/high) and a plain-language explanation
- ⚠️ **Risk Detection**: AI identifies risky clauses (severity: high/warning) with plain-language explanations
- ✓ **Favorable Clauses**: Highlights favorable terms
- 🖍️ **Inline Highlighting**: Risky/favorable quotes are matched back into the original contract text and highlighted, synced with the explanation cards
- 🔢 **Key Numbers**: Extracts and organizes important dates, amounts, and durations
- 🔐 **Accounts**: Email/password and Google sign-in via Supabase Auth
- 📜 **History**: Past analyses are stored per user and browsable at `/history`
- 💰 **Freemium Model**: 3 free analyses per calendar month (server-tracked), then €3 one-time (5 credits) or €8/month (unlimited)
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Next.js 14** - App Router with TypeScript
- **Tailwind CSS** - Modern styling
- **Supabase** - Auth (email/password + Google) and Postgres database (profiles, analysis history, RLS)
- **OpenAI API** - AI analysis engine (GPT-4 Turbo)
- **Stripe** - Payment processing (one-time + subscription), entitlements applied via webhook
- **pdf-parse** - PDF text extraction

## Project Structure

```
/app
  /api
    /analyze/route.ts          # Auth check, quota check, OpenAI call, saves history
    /upload/route.ts           # Server-side PDF text extraction
    /profile/route.ts          # Returns current user's plan/quota info
    /stripe/checkout/route.ts  # Stripe checkout sessions
    /stripe/webhook/route.ts   # Applies entitlements from Stripe events
    /auth/...                  # Supabase auth routes
  /analyze/page.tsx            # Main analyzer interface (auth-gated)
  /account/page.tsx            # Plan, usage, subscription management
  /history/page.tsx            # Past analyses
  /premium/page.tsx            # Upgrade/checkout entry point
  /login, /signup              # Supabase auth forms
  /success/page.tsx            # Post-payment confirmation
  page.tsx                     # Landing page
  layout.tsx                   # Root layout
  globals.css                  # Global styles

/components
  UploadZone.tsx              # PDF upload & drag-drop
  ResultsPanel.tsx            # Analysis results display (score, summary, highlights, key numbers)
  PaywallModal.tsx            # Upgrade prompt modal
  PricingCard.tsx             # Reusable pricing card
  contract-risk/              # Risk score display + badge
  contract-highlight/         # Clause-to-text matching and highlighting UI
  auth/                       # Auth form, nav, shell
  ui/                         # Shared UI primitives (Button, Card, Section, AppHeader, ...)

/lib
  analysisTypes.ts            # Shared analysis result types
  entitlements.ts             # Plan/quota logic (source of truth for limits)
  clauseHighlights.ts / matchClauseInContract.ts  # Quote-to-text matching
  normalizeAnalysisResponse.ts # Defensive parsing of the OpenAI JSON response
  profile/service.ts          # Supabase profile CRUD, usage increment, entitlements from Stripe
  stripe.ts                   # Display pricing for the UI
  stripePriceIds.ts           # Fallback Stripe Price IDs
  supabase/                   # Client/server/admin Supabase clients + middleware session refresh

middleware.ts                 # Protects /analyze, /account, /history, /premium, /checkout, /dashboard
supabase/migrations/          # SQL schema: profiles, contract_analyses, RLS, triggers
```

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_PRICE_ONETIME=price_xxx        # one-time price, 5 credits
STRIPE_PRICE_SUBSCRIPTION=price_yyy   # recurring monthly price
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your keys:**
- **OpenAI**: https://platform.openai.com/api-keys
- **Stripe**: https://dashboard.stripe.com/
- **Supabase**: https://app.supabase.com/ (Project Settings → API)

### 3. Set Up Supabase

Run `supabase/migrations/001_profiles_and_analyses.sql` in the Supabase SQL Editor (or via the Supabase CLI). This creates `profiles`, `contract_analyses`, row-level security policies, and the trigger that auto-creates a profile on signup. See `SUPABASE_SETUP.md` for details.

### 4. Create Stripe Price IDs

In your Stripe Dashboard:
1. Go to **Products** → Create a new product
2. For "One-time": Create a one-time price for €3 (5 analysis credits)
3. For "Subscription": Create a recurring monthly price for €8
4. Copy the price IDs into `STRIPE_PRICE_ONETIME` / `STRIPE_PRICE_SUBSCRIPTION`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Landing Page (`/`)
- Hero section with value proposition
- Feature highlights
- Pricing comparison
- Call-to-action buttons

### Analyzer Page (`/analyze`)
- Requires sign-in (redirects to `/login?redirect=/analyze` otherwise)
- Upload PDF or paste text, real-time character count (max 50,000)
- Shows remaining analyses for the current plan
- Results display in real-time: risk score, summary, highlighted clauses, key numbers

### Freemium Logic
- Every account gets **3 free analyses per calendar month**, tracked server-side on the user's `profiles` row (`analyses_used` / `analyses_limit`), reset automatically when the month changes
- On the 4th attempt in a month, the API returns `402` and the paywall modal appears
- One-time purchase adds 5 credits to `analyses_limit` (`purchase_type = 'one-time'`)
- Active Pro subscribers (`plan = 'pro'`, `subscription_status = 'active'`) get unlimited analyses
- Entitlements are applied by the Stripe webhook, not the client — quota cannot be bypassed by clearing browser storage

### Results Display
- **Risk score**: 0-100 with low/medium/high level and an explanation citing the themes that drove the score
- **Summary**: 3-sentence plain language overview
- **Highlighted clauses**: risky/favorable quotes matched back into your original text, clickable and synced with explanation cards
- **Risky Clauses**: cards with quotes, explanations, and severity (high/warning)
- **Favorable Clauses**: cards with quotes and explanations
- **Key Numbers**: table of important dates, amounts, durations

### History (`/history`)
Past analyses (preview + risk score) are saved per user and listed newest-first.

### Account (`/account`)
Shows plan, status, remaining analyses, and links to upgrade, analyze, history, and sign out.

## API Routes

### POST `/api/analyze`
Requires an authenticated Supabase session. Checks quota, calls OpenAI, saves the result to history, and increments usage.

**Request:**
```json
{
  "text": "contract text here..."
}
```

**Response:** `AnalysisResult` — `summary`, `risk_score`, `risky_clauses`, `favorable_clauses`, `key_numbers`. Returns `401` if not signed in, `402` if the quota is exhausted.

### POST `/api/upload`
Extracts text from an uploaded PDF (server-side, via `pdf-parse`).

### GET `/api/profile`
Returns the current user's plan/quota info for the UI (remaining analyses, labels).

### POST `/api/stripe/checkout`
Creates a Stripe Checkout session for `planType: "one-time" | "subscription"`. Requires sign-in.

### POST `/api/stripe/webhook`
Applies entitlements from Stripe events (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`) to the user's profile.

## Deployment

### Deploy to Vercel

```bash
vercel
```

**Set environment variables** in Vercel dashboard: all of the variables listed in step 2 above.

### Configure Stripe Webhook

1. Go to Stripe Dashboard → **Webhooks**
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## Customization

### Change Pricing
Edit display pricing in `/lib/stripe.ts` (`PRICING_PLANS`). The actual charged amount comes from the Stripe Price IDs (`STRIPE_PRICE_ONETIME` / `STRIPE_PRICE_SUBSCRIPTION`), so update those in Stripe too.

### Change Free Tier Limit
Edit `FREE_ANALYSES_PER_MONTH` in `/lib/entitlements.ts` (this is the single source of truth used by both the UI and the API).

### Customize OpenAI Model / Prompt
Edit `/app/api/analyze/route.ts` — `model`, `max_tokens`, and `SYSTEM_PROMPT`.

## Security Notes

- All sensitive API calls (OpenAI, Stripe, Supabase service-role writes) happen server-side
- Stripe and Supabase secrets are never exposed to the frontend (only the anon key and publishable key are public, by design)
- PDF parsing happens server-side
- Quota and plan entitlements are enforced server-side against the database, not client-controlled state
- Row-level security on `profiles` and `contract_analyses` restricts each user to their own rows

## Limitations & Enhancements

**Current Limitations:**
- No email notifications
- Manual Stripe price ID configuration
- Single admin-managed pricing display (not synced live from Stripe)

**Possible Enhancements:**
- Email notifications for completed analyses
- Export analyses (PDF/CSV)
- Team/organization support

## Troubleshooting

**"Sign in required to analyze contracts."**
- The analyzer requires an account; sign in or sign up first

**"Contract text exceeds 50,000 characters"**
- Split long contracts into multiple uploads

**"Failed to extract text from PDF"**
- Ensure PDF is not corrupted or password-protected
- Try uploading a different PDF

**"Could not load your account profile." / history fails to load**
- Ensure `supabase/migrations/001_profiles_and_analyses.sql` has been run and `SUPABASE_SERVICE_ROLE_KEY` is set

**"API error" when analyzing**
- Check your OpenAI API key is valid and has available quota

**Stripe checkout fails**
- Verify all Stripe keys and price IDs are correctly set in `.env.local`
- Ensure the price mode (one-time vs recurring) matches `STRIPE_PRICE_ONETIME` / `STRIPE_PRICE_SUBSCRIPTION`
- Ensure the webhook endpoint is configured and reachable

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs in your Supabase/Stripe/OpenAI dashboard
3. Open an issue on GitHub
