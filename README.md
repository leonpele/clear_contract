# ContractClear - AI-Powered Contract Analyzer

A modern SaaS application that analyzes contracts using OpenAI GPT-4, explaining legal documents in plain language.

## Features

- 📄 **Smart Upload**: Upload PDFs or paste contract text (up to 50,000 chars)
- ⚠️ **Risk Detection**: AI identifies risky clauses with plain-language explanations
- ✓ **Favorable Clauses**: Highlights favorable terms
- 🔢 **Key Numbers**: Extracts and organizes important dates, amounts, and durations
- 💰 **Freemium Model**: 3 free analyses, then flexible pricing (€3 one-time or €8/month)
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Next.js 14** - App Router with TypeScript
- **Tailwind CSS** - Modern styling
- **OpenAI API** - AI analysis engine (GPT-4 Turbo)
- **Stripe** - Payment processing
- **pdf-parse** - PDF text extraction
- **localStorage** - Free tier tracking (no database needed)

## Project Structure

```
/app
  /api
    /analyze/route.ts          # OpenAI API integration
    /stripe/checkout/route.ts  # Stripe checkout sessions
    /stripe/webhook/route.ts   # Stripe webhook handler
  /analyze/page.tsx            # Main analyzer interface
  /success/page.tsx            # Post-payment confirmation
  page.tsx                     # Landing page
  layout.tsx                   # Root layout
  globals.css                  # Global styles

/components
  UploadZone.tsx              # PDF upload & drag-drop
  ResultsPanel.tsx            # Analysis results display
  PaywallModal.tsx            # Upgrade prompt modal
  PricingCard.tsx             # Reusable pricing card

/lib
  anthropic.ts                # OpenAI configuration
  stripe.ts                   # Stripe pricing & config
  parseUsage.ts               # localStorage helpers
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
```

**Get your API keys:**
- **OpenAI**: https://platform.openai.com/api-keys
- **Stripe**: https://dashboard.stripe.com/

### 3. Create Stripe Price IDs

In your Stripe Dashboard:
1. Go to **Products** → Create a new product
2. For "One-time": Create a price for €3 (payment)
3. For "Subscription": Create a price for €8/month (recurring)
4. Copy the price IDs and update them in `/lib/stripe.ts`

### 4. Run Development Server

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
- Upload PDF or paste contract text
- Real-time character count (max 50,000)
- Analyze button with loading state
- Results display in real-time

### Freemium Logic
- First 3 analyses are **free** for all users
- Usage tracked in localStorage (`cc_uses`)
- On 4th attempt, paywall modal appears
- After payment, `cc_paid` flag is set (unlimited access)
- No authentication needed (localStorage-based)

### Results Display
- **Summary**: 3-sentence plain language overview
- **Risky Clauses**: Red-bordered cards with quotes and explanations
- **Favorable Clauses**: Green-bordered cards with quotes and explanations
- **Key Numbers**: Table of important dates, amounts, durations

## API Routes

### POST `/api/analyze`
Analyzes contract text using OpenAI API.

**Request:**
```json
{
  "text": "contract text here..."
}
```

**Response:**
```json
{
  "summary": "...",
  "risky_clauses": [...],
  "favorable_clauses": [...],
  "key_numbers": [...]
}
```

### POST `/api/stripe/checkout`
Creates a Stripe Checkout session.

**Request:**
```json
{
  "priceId": "price_xxx",
  "planType": "one-time" | "subscription"
}
```

### POST `/api/stripe/webhook`
Handles Stripe webhook events (payment confirmation, subscription updates).

## Deployment

### Deploy to Vercel

```bash
vercel
```

**Set environment variables** in Vercel dashboard:
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Configure Stripe Webhook

1. Go to Stripe Dashboard → **Webhooks**
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Listen for: `checkout.session.completed`, `customer.subscription.*`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## Customization

### Change Pricing
Edit `/lib/stripe.ts`:
```typescript
export const PRICING_PLANS = {
  oneTime: {
    price: 3,        // Change price in euros
    description: '5 analyses',
    priceId: 'price_xxx_xxxxxx', // Your Stripe price ID
    ...
  },
  ...
};
```

### Change Free Tier Limit
Edit `/app/analyze/page.tsx`:
```typescript
if (!paid && usageCount >= 3) {  // Change 3 to desired limit
  setShowPaywall(true);
  return;
}
```

### Customize OpenAI Model
Edit `/app/api/analyze/route.ts`:
```typescript
const message = await client.chat.completions.create({
  model: 'gpt-4-turbo', // Change model here
  max_tokens: 1500,
  ...
});
```

## Security Notes

- All sensitive API calls happen server-side
- Stripe keys are never exposed to frontend (except `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
- PDF parsing happens server-side
- No user data is stored (localStorage only)
- No authentication system (opt-in for simple deployment)

## Limitations & Enhancements

**Current Limitations:**
- localStorage-based usage tracking (resets if user clears browser data)
- No user accounts or persistent storage
- No email notifications
- Manual Stripe price ID configuration

**Future Enhancements:**
- Add user authentication (Auth0, Clerk, etc.)
- Database integration for usage history
- Email notifications for uploads/results
- Advanced filtering and export options
- Team/organization support

## Troubleshooting

**"Contract text exceeds 50,000 characters"**
- Split long contracts into multiple uploads

**"Failed to extract text from PDF"**
- Ensure PDF is not corrupted or password-protected
- Try uploading a different PDF

**"API error" when analyzing**
- Check your OpenAI API key is valid
- Ensure API rate limits haven't been exceeded
- Check CloudFormation logs for details

**Stripe checkout fails**
- Verify all Stripe keys are correctly set in `.env.local`
- Check Stripe price IDs are valid and published
- Ensure webhook endpoint is accessible

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs in your Stripe/OpenAI dashboard
3. Open an issue on GitHub
