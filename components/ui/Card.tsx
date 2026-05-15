import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  muted?: boolean;
}

export function Card({ muted, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-card',
        muted ? 'bg-surface-muted' : '',
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
