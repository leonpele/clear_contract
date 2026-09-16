import { AppHeader } from '@/components/ui/AppHeader';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { PageBackground } from '@/components/ui/PageBackground';
import { FadeIn } from '@/components/ui/FadeIn';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen">
      <PageBackground variant="auth" />
      <AppHeader showAuth={false} />
      <main className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
        <FadeIn>
          <div className="mb-8 text-center sm:text-left">
            <h1 className="mb-2">{title}</h1>
            <p className="prose-body text-sm">{subtitle}</p>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <Card className="max-w-md mx-auto sm:mx-0 shadow-card-hover animate-scale-in">
            {children}
          </Card>
        </FadeIn>
        <LegalDisclaimer className="mt-8 max-w-md mx-auto sm:mx-0" />
      </main>
    </div>
  );
}
