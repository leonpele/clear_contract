import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover border border-transparent shadow-sm hover:shadow-glow',
  secondary:
    'bg-surface text-ink border border-border hover:bg-surface-muted hover:border-border-strong hover:shadow-card',
  ghost:
    'bg-transparent text-ink-secondary border border-transparent hover:bg-surface-subtle hover:text-ink',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      fullWidth,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          'btn-interactive inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
          variants[variant],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);
