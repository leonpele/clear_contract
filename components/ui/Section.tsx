import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
}

export function Section({ title, subtitle, children, id }: SectionProps) {
  return (
    <section id={id} className="space-y-5">
      <header className="space-y-2">
        <h2>{title}</h2>
        {subtitle && <p className="prose-body text-sm">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

export function SectionDivider() {
  return <hr className="border-0 border-t border-border my-16 sm:my-20" aria-hidden />;
}
