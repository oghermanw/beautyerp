import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public routes and static assets
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path === '/login' ||
    path === '/'
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('salon_session')?.value;
  let userRole = 'SUPER'; // Default demo role if cookie not set

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie);
      userRole = parsed.role;
      if (parsed.status === 'DISABLED') {
        return NextResponse.redirect(new URL('/login?error=disabled', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Strict route authorization checks
  if (path.startsWith('/super') && userRole !== 'SUPER') {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  if (path.startsWith('/admin') && userRole === 'STAFF') {
    return NextResponse.redirect(new URL('/staff/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super/:path*', '/admin/:path*', '/staff/:path*'],
};
