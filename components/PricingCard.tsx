'use client';

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  onCtaClick: () => void;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  highlighted = false,
  onCtaClick,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-lg p-8 ${
        highlighted
          ? 'border-2 border-risk-red bg-red-50'
          : 'border border-gray-200 bg-white'
      }`}
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{name}</h3>
      <div className="text-4xl font-bold text-risk-red mb-2">
        €{price}
        {name.toLowerCase() === 'pro' && <span className="text-lg">/mo</span>}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>

      <ul className="space-y-2 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="text-gray-700 text-sm">
            ✓ {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onCtaClick}
        className="w-full py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 transition"
      >
        {cta}
      </button>
    </div>
  );
}
