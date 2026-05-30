import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('vybe_auth_session')?.value;
  const isAuthenticated = sessionCookie === 'active';

  // Define paths to protect
  const protectedPrefixes = [
    '/dashboard',
    '/contests',
    '/deals',
    '/creators',
    '/analytics',
    '/library',
    '/settings',
    '/upgrade'
  ];

  // Define authentication flow paths
  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ];

  // 1. If accessing a protected route without being authenticated, redirect to /login
  const isProtected = protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and trying to access auth pages, redirect to /dashboard
  const isAuthPath = authPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config to run proxy on all routes except static assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.css).*)',
  ],
};
