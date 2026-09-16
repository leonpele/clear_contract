const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'peleleon4@gmail.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** Gates access to /admin and its API routes. Configure via ADMIN_EMAILS (comma-separated). */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
