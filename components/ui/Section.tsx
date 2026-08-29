import { ReactNode } from 'react';
import { FadeIn } from './FadeIn';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
  className?: string;
  animate?: boolean;
}

export function Section({
  title,
  subtitle,
  children,
  id,
  className,
  animate = false,
}: SectionProps) {
  const content = (
    <section id={id} className={['space-y-5', className].filter(Boolean).join(' ')}>
      <header className="space-y-2">
        <h2>{title}</h2>
        {subtitle && <p className="prose-body text-sm">{subtitle}</p>}
      </header>
      {children}
    </section>
  );

  if (animate) {
    return <FadeIn>{content}</FadeIn>;
  }

  return content;
}

interface SectionDividerProps {
  spacious?: boolean;
}

export function SectionDivider({ spacious = false }: SectionDividerProps) {
  return (
    <hr
      className={
        spacious
          ? 'border-0 border-t border-border/80 my-28 sm:my-36'
          : 'border-0 border-t border-border/80 my-16 sm:my-20'
      }
      aria-hidden
    />
  );
}
