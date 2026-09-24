'use client';

import { useEffect, useState } from 'react';
import { getConsent, grantConsent, denyConsent } from '@/lib/analytics/posthog-client';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md px-5 py-4 shadow-card-hover sm:px-8">
      <div className="mx-auto flex max-w-wide flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-secondary max-w-2xl">
          Nous utilisons un cookie de mesure d&apos;audience (pages visitées,
          clics) pour améliorer le service. Le texte de vos contrats
          n&apos;est jamais inclus. Voir notre{' '}
          <a
            href="/confidentialite"
            className="text-primary hover:text-primary-hover underline"
          >
            politique de confidentialité
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => {
              denyConsent();
              setVisible(false);
            }}
            className="btn-interactive rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink-secondary hover:bg-surface-muted"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => {
              grantConsent();
              setVisible(false);
            }}
            className="btn-interactive rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
