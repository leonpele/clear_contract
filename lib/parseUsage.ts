/**
 * localStorage helpers for tracking free tier usage
 */

const USAGE_KEY = 'cc_uses';
const PAID_KEY = 'cc_paid';

export function parseUsage(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = localStorage.getItem(USAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = parseUsage();
    localStorage.setItem(USAGE_KEY, String(current + 1));
  } catch {
    // Silently fail
  }
}

export function resetUsage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(USAGE_KEY);
  } catch {
    // Silently fail
  }
}

export function isPaidUser(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(PAID_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPaidUser(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PAID_KEY, 'true');
  } catch {
    // Silently fail
  }
}

export function clearPaidUser(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(PAID_KEY);
  } catch {
    // Silently fail
  }
}
