/**
 * localStorage helpers: free tier = 3 analyses per calendar month (not paid users).
 */

const USAGE_KEY = 'cc_uses';
const USAGE_MONTH_KEY = 'cc_usage_month';
const PAID_KEY = 'cc_paid';

/** Free analyses allowed each calendar month (local timezone). */
export const FREE_ANALYSES_PER_MONTH = 3;

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Sync month bucket; reset count only when the calendar month changes. */
function ensureCurrentMonthBucket(): void {
  if (typeof window === 'undefined') return;
  const monthKey = currentMonthKey();
  const storedMonth = localStorage.getItem(USAGE_MONTH_KEY);

  if (storedMonth === monthKey) return;

  if (storedMonth === null) {
    // First run with monthly keys: keep legacy cc_uses for the current month
    localStorage.setItem(USAGE_MONTH_KEY, monthKey);
    return;
  }

  localStorage.setItem(USAGE_MONTH_KEY, monthKey);
  localStorage.setItem(USAGE_KEY, '0');
}

export function parseUsage(): number {
  if (typeof window === 'undefined') return 0;

  try {
    ensureCurrentMonthBucket();
    const stored = localStorage.getItem(USAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return;

  try {
    ensureCurrentMonthBucket();
    const current = parseInt(localStorage.getItem(USAGE_KEY) || '0', 10);
    localStorage.setItem(USAGE_KEY, String(current + 1));
  } catch {
    // Silently fail
  }
}

export function resetUsage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(USAGE_KEY);
    localStorage.removeItem(USAGE_MONTH_KEY);
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
