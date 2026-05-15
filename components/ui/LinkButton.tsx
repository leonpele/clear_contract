import Link from 'next/link';
import { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover border border-transparent shadow-sm',
  secondary:
    'bg-surface text-ink border border-border hover:bg-surface-muted hover:border-border-strong',
  ghost:
    'bg-transparent text-ink-secondary border border-transparent hover:bg-surface-subtle hover:text-ink',
};

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Variant;
}

export function LinkButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
        'transition-colors duration-200 ease-out',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Link>
  );
}
