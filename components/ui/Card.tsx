import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  muted?: boolean;
  interactive?: boolean;
}

export function Card({
  muted,
  interactive,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-card',
        muted ? 'bg-surface-muted' : '',
        interactive ? 'card-interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
