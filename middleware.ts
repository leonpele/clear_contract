import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/history/:path*',
    '/premium/:path*',
    '/login',
    '/signup',
    '/analyze',
    '/checkout',
    '/api/:path*',
  ],
};
