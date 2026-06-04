import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('vybe_auth_session')?.value;
  const roleCookie = request.cookies.get('vybe_user_role')?.value;
  
  const isAuthenticated = sessionCookie === 'active';
  const role = roleCookie === 'brand' || roleCookie === 'creator' ? roleCookie : null;

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

  // Define authentication flow paths (login/signup)
  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ];

  // 1. If accessing a protected route without being authenticated → login
  const isProtected = protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based Route Protection for Dashboards
  if (isAuthenticated && pathname.startsWith('/dashboard')) {
    if (pathname.startsWith('/dashboard/brand') && role === 'creator') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (pathname.startsWith('/dashboard/creator') && role === 'brand') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Redirect base /dashboard to the correct sub-dashboard if they try to access it directly
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      if (role === 'creator') {
        return NextResponse.redirect(new URL('/dashboard/creator', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/brand', request.url));
      }
    }
  }

  // 3. If logged in and trying to access auth pages → dashboard
  const isAuthPath = authPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  if (isAuthPath && isAuthenticated) {
    if (role === 'creator') {
      return NextResponse.redirect(new URL('/dashboard/creator', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/brand', request.url));
    }
  }

  return NextResponse.next();
}

// Config to run proxy on all routes except static assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.css).*)',
  ],
};
