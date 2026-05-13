# ContractClear - Quick Setup Guide

## ✅ Project Structure Created

Your ContractClear SaaS application is now ready! Here's what was generated:

### Pages
- **`/`** — Landing page with hero, features, pricing, and CTAs
- **`/analyze`** — Main contract analyzer interface
- **`/success`** — Payment confirmation page

### API Routes
- **`POST /api/analyze`** — Claude AI contract analysis (returns JSON: summary, risky/favorable clauses, key numbers)
- **`POST /api/upload`** — Server-side PDF text extraction (handles files up to 10MB)
- **`POST /api/stripe/checkout`** — Creates Stripe checkout sessions
- **`POST /api/stripe/webhook`** — Handles Stripe payment webhooks

### Components
- **`UploadZone.tsx`** — PDF upload with drag-and-drop
- **`ResultsPanel.tsx`** — Displays analysis results (summary, clauses, numbers table)
- **`PaywallModal.tsx`** — Freemium upgrade prompt
- **`PricingCard.tsx`** — Reusable pricing card component

### Utilities
- **`lib/parseUsage.ts`** — localStorage helpers (tracks free uses, payment status)
- **`lib/anthropic.ts`** — Claude config and system prompt
- **`lib/stripe.ts`** — Stripe pricing plans and configuration

## 🚀 Getting Started

### 1. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**Where to get your keys:**
- **OpenAI**: https://platform.openai.com/api-keys (API Keys section)
- **Stripe**: https://dashboard.stripe.com/ (Developers → API Keys)

### 2. Create Stripe Price IDs

1. Go to Stripe Dashboard → **Products** → **Create product**
2. Create **Product 1** (One-time):
   - Name: "5 Contract Analyses"
   - Price: €3 (one-time payment)
   - Note the **Price ID**
3. Create **Product 2** (Subscription):
   - Name: "Pro Subscription"
   - Price: €8/month (recurring)
   - Billing period: Monthly
   - Note the **Price ID**
4. Update `/lib/stripe.ts` with your price IDs:

```typescript
export const PRICING_PLANS = {
  oneTime: {
    priceId: 'price_xxx_from_stripe', // Your one-time price ID
    ...
  },
  subscription: {
    priceId: 'price_yyy_from_stripe', // Your subscription price ID
    ...
  },
};
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Testing Checklist

Before going live, test:
- [ ] Landing page loads and looks good
- [ ] Upload PDF and paste contract text work
- [ ] 3 free analyses work correctly
- [ ] Paywall appears on 4th attempt
- [ ] Stripe checkout opens (use test card: 4242 4242 4242 4242)
- [ ] Payment succeeds and unlocks unlimited access
- [ ] Results display correctly (summary, clauses, numbers)
- [ ] Mobile responsive design works

## 🎨 Customization

### Change Free Tier Limit
Edit `/app/analyze/page.tsx`, line ~46:
```typescript
if (!paid && usageCount >= 3) {  // Change 3 here
  setShowPaywall(true);
```

### Change Pricing
Edit `/lib/stripe.ts` — update `price` and `description` fields

### Update OpenAI Model
Edit `/app/api/analyze/route.ts`, line ~48:
```typescript
model: 'gpt-4-turbo', // Change model here
```

### Customize System Prompt
Edit `/app/api/analyze/route.ts`, lines ~15-38 (update `SYSTEM_PROMPT`)

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
1. Set environment variables in Vercel dashboard
2. Configure Stripe webhook: `https://your-domain.com/api/stripe/webhook`
3. Update Stripe webhook secret in Vercel dashboard

## 📝 Key Features

✅ **3 free analyses** tracked in localStorage  
✅ **Freemium model** with easy upgrade  
✅ **PDF upload + text paste** support  
✅ **Smart AI analysis** using OpenAI GPT-4 Turbo  
✅ **Mobile responsive** design  
✅ **No authentication** needed (simple deployment)  
✅ **Stripe payments** (one-time + subscription)  
✅ **Server-side security** (all API calls secure)  

## 📞 Troubleshooting

**"Cannot find module 'pdfParse'"**
- Run `npm install` again

**"Stripe API error"**
- Verify all Stripe keys are correct
- Check price IDs exist in Stripe Dashboard

**"Anthropic API error"**
- Verify API key is active
- Check API usage in Anthropic console

**Build fails**
- Delete `node_modules` and `.next` folder
- Run `npm install` and `npm run build` again

## 🎉 You're All Set!

Your ContractClear SaaS is ready to analyze contracts. Start by:
1. Setting up your environment variables
2. Creating Stripe price IDs
3. Running `npm run dev`
4. Testing the full flow

Happy coding! 🚀
