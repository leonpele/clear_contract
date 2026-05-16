import { AppHeader } from '@/components/ui/AppHeader';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <AppHeader showAuth={false} />
      <main className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8">
          <h1 className="mb-2">{title}</h1>
          <p className="prose-body text-sm">{subtitle}</p>
        </div>
        <Card className="max-w-md">{children}</Card>
        <LegalDisclaimer className="mt-8 max-w-md" />
      </main>
    </div>
  );
}
