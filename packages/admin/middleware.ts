import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale } from './i18n';

export function middleware(request: NextRequest) {
  // Simple middleware - just pass through
  // Locale is handled client-side via cookies
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

