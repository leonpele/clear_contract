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
      className={
        highlighted ? 'border-primary/30 ring-1 ring-primary/10' : 'shadow-none'
      }
    >
      {highlighted && (
        <p className="text-xs font-medium text-primary mb-2">Recommended</p>
      )}
      <h3 className="mb-1">{name}</h3>
      <p className="text-3xl font-semibold text-ink mb-1">
        €{price}
        {period && (
          <span className="text-base font-normal text-ink-muted">{period}</span>
        )}
      </p>
      <p className="text-sm text-ink-muted mb-6">{description}</p>
      <ul className="space-y-2 text-sm text-ink-secondary mb-8">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
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
