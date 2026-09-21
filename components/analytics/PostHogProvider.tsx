'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  getConsent,
  initPostHog,
  isPostHogEnabled,
  posthog,
} from '@/lib/analytics/posthog-client';

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPostHogEnabled()) return;
    const query = searchParams.toString();
    posthog.capture('$pageview', {
      $current_url: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}

/** Resumes PostHog on return visits where consent was already granted. */
export function PostHogProvider() {
  useEffect(() => {
    if (getConsent() === 'granted') {
      initPostHog();
    }
  }, []);

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
