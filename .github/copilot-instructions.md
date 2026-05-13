# ContractClear - Copilot Instructions

This file provides Copilot with workspace-specific guidance for working on the ContractClear SaaS project.

## Project Overview

**ContractClear** is a Next.js 14 SaaS application that analyzes contracts using OpenAI GPT-4, explaining legal documents in plain language with a freemium business model.

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **AI Engine**: OpenAI API (GPT-4 Turbo)
- **Payments**: Stripe
- **PDF Parsing**: pdf-parse
- **Data Storage**: localStorage (no database)

## Key Architecture Decisions

1. **Freemium Model**: 3 free analyses per user (localStorage-tracked), then paywall
2. **No Authentication**: Uses localStorage for usage tracking and payment status
3. **Server-Side API Calls**: All sensitive API calls (OpenAI, Stripe) happen server-side
4. **Static Pricing**: Configured in `/lib/stripe.ts`

## File Structure

```
/app              - Next.js App Router pages and API routes
/components       - React components (UploadZone, ResultsPanel, PaywallModal, PricingCard)
/lib              - Utility functions and configuration
```

## Common Tasks

### Adding a New Feature
1. Create component in `/components/` if UI-related
2. Create API route in `/app/api/` if backend logic needed
3. Update `/app/analyze/page.tsx` or relevant page to integrate

### Modifying Pricing
- Edit `/lib/stripe.ts` for plan names, prices, descriptions
- Create new Stripe prices in Stripe Dashboard
- Update price IDs in `/lib/stripe.ts`

### Changing Free Tier Limit
- Edit `/app/analyze/page.tsx`, line with `usageCount >= 3`

### Updating OpenAI Model/Prompt
- Edit `/app/api/analyze/route.ts` for model selection and system prompt
- Update `/lib/anthropic.ts` (OpenAI config) for reference documentation

## Important Notes

- **Environment Variables**: All API keys must be in `.env.local` (not committed)
  - `OPENAI_API_KEY` from https://platform.openai.com/api-keys
  - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` from Stripe Dashboard
- **Stripe Webhook**: Must be configured in Stripe Dashboard for payment confirmation
- **PDF Upload**: Limited to 10MB files in browser, 50,000 chars extracted text
- **Contract Text Limit**: Hard limit of 50,000 characters per analysis

## Development Workflow

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Error Handling Guidelines

- **API Routes**: Always return proper HTTP status codes (400, 500, etc.)
- **Frontend**: Show user-friendly error messages in UI
- **Console Logging**: Use for debugging, remove before production
- **Error Types**: Handle both Stripe errors and Anthropic API errors distinctly

## Stripe Integration Notes

- **Keys**: `STRIPE_SECRET_KEY` (server-side) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend)
- **Webhook Secret**: Required for verifying webhook authenticity
- **Session Management**: Created in `/api/stripe/checkout`, confirmed in webhook
- **Checkout Modes**: "payment" for one-time, "subscription" for recurring

## OpenAI API Notes

- **Model**: `gpt-4-turbo` (most capable model)
- **Max Tokens**: 1500 (sufficient for JSON analysis response)
- **Temperature**: 0 (deterministic responses)
- **System Prompt**: Instructs GPT-4 to return JSON-only response
- **Error Handling**: Catch both API errors and JSON parse errors

## Testing Checklist

Before deploying:
- [ ] Analyze contract with free tier (3 tries)
- [ ] Verify paywall appears on 4th try
- [ ] Test one-time payment flow (use Stripe test card: 4242 4242 4242 4242)
- [ ] Test subscription payment
- [ ] Test PDF upload with various file sizes
- [ ] Test text input near 50k character limit
- [ ] Test error handling (network failures, invalid files)
- [ ] Check responsive design on mobile

## Deployment Checklist

- [ ] Set all environment variables in Vercel/hosting platform
- [ ] Configure Stripe webhook endpoint to production URL
- [ ] Verify OpenAI API key has sufficient credits
- [ ] Test payment flows in production
- [ ] Monitor error logs and Stripe dashboard
- [ ] Set up email notifications for critical errors
