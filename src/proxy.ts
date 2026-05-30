import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('vybe_auth_session')?.value;
  const isAuthenticated = sessionCookie === 'active';
  const onboardingComplete = request.cookies.get('vybe_onboarding_complete')?.value === 'true';

  // Define paths to protect (require auth + completed onboarding)
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

  // Define authentication flow paths (login/signup)
  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ];

  // Onboarding path — requires auth but NOT completed onboarding
  const isOnboardingPath = pathname === '/onboarding' || pathname.startsWith('/onboarding/');

  // 1. If accessing onboarding without being authenticated → login
  if (isOnboardingPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If accessing onboarding but already completed → dashboard
  if (isOnboardingPath && isAuthenticated && onboardingComplete) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. If accessing a protected route without being authenticated → login
  const isProtected = protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If authenticated + protected route but onboarding NOT done → onboarding
  if (isProtected && isAuthenticated && !onboardingComplete) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // 5. If logged in and trying to access auth pages → dashboard (or onboarding if not done)
  const isAuthPath = authPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  if (isAuthPath && isAuthenticated) {
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
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
