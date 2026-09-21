'use client';

import posthog from 'posthog-js';

const CONSENT_KEY = 'cc_analytics_consent';

export type ConsentStatus = 'granted' | 'denied' | null;

export function getConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

function setConsent(value: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Worst case the banner reappears next visit — not worth failing on.
  }
}

let initialized = false;

/**
 * Starts PostHog. Only call after consent is granted. Session recording
 * and autocapture both skip any element (or subtree) with the
 * "ph-no-capture" class — used on the contract textarea, upload zone,
 * results panel, and history list, since those can contain the full text
 * of a user's contract.
 */
export function initPostHog(): void {
  if (initialized || typeof window === 'undefined') return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    capture_pageview: false, // tracked manually on route change, see PostHogProvider
    autocapture: true,
    session_recording: {
      maskAllInputs: true,
      blockClass: 'ph-no-capture',
    },
  });
  initialized = true;
}

export function isPostHogEnabled(): boolean {
  return initialized;
}

export function grantConsent(): void {
  setConsent('granted');
  initPostHog();
}

export function denyConsent(): void {
  setConsent('denied');
}

export { posthog };
