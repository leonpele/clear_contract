import { LinkButton } from '@/components/ui/LinkButton';
import { Card } from '@/components/ui/Card';

interface PricingCardProps {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  checkoutHref: string;
  ctaLabel: string;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted,
  checkoutHref,
  ctaLabel,
}: PricingCardProps) {
  return (
    <Card
      interactive
      className={
        highlighted
          ? 'border-primary/30 ring-1 ring-primary/15 shadow-glow flex flex-col h-full'
          : 'flex flex-col h-full'
      }
    >
      {highlighted && (
        <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
          Recommended
        </p>
      )}
      <h3 className="mb-1">{name}</h3>
      <p className="text-3xl font-semibold text-ink mb-1">
        €{price}
        {period && (
          <span className="text-base font-normal text-ink-muted">{period}</span>
        )}
      </p>
      <p className="text-sm text-ink-muted mb-6">{description}</p>
      <ul className="space-y-3 text-sm text-ink-secondary mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <svg
              className="h-4 w-4 text-primary shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <LinkButton
        href={checkoutHref}
        variant={highlighted ? 'primary' : 'secondary'}
        className="w-full"
      >
        {ctaLabel}
      </LinkButton>
    </Card>
  );
}
