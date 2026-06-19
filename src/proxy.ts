import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'ar'];
const defaultLocale = 'fr';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const requestedLocales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale] = lang.split(';');
      return locale.trim().split('-')[0];
    });

  for (const locale of requestedLocales) {
    if (locales.includes(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Language Routing
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale = defaultLocale;
  let pathnameWithoutLocale = pathname;

  if (pathnameHasLocale) {
    locale = pathname.split('/')[1];
    pathnameWithoutLocale = pathname.substring(locale.length + 1) || '/';
  } else {
    locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 2. Authentication Logic
  const sessionCookie = request.cookies.get('vybe_auth_session')?.value;
  const roleCookie = request.cookies.get('vybe_user_role')?.value;
  
  const isAuthenticated = sessionCookie === 'active';
  const role = roleCookie === 'brand' || roleCookie === 'creator' ? roleCookie : null;

  const protectedPrefixes = [
    '/dashboard',
    '/contests',
    '/deals',
    '/creators',
    '/creators_side',
    '/analytics',
    '/library',
    '/settings',
    '/upgrade'
  ];

  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ];

  const isProtected = protectedPrefixes.some(prefix => pathnameWithoutLocale === prefix || pathnameWithoutLocale.startsWith(prefix + '/'));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated) {
    if (pathnameWithoutLocale.startsWith('/dashboard/brand') && role === 'creator') {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
    if (pathnameWithoutLocale.startsWith('/creators_side') && role === 'brand') {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
    if (pathnameWithoutLocale.startsWith('/dashboard/creator') && role === 'brand') {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
    
    if (pathnameWithoutLocale === '/dashboard' || pathnameWithoutLocale === '/dashboard/') {
      if (role === 'creator') {
        return NextResponse.redirect(new URL(`/${locale}/creators_side`, request.url));
      } else {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/brand`, request.url));
      }
    }
  }

  const isAuthPath = authPaths.some(path => pathnameWithoutLocale === path || pathnameWithoutLocale.startsWith(path + '/'));
  if (isAuthPath && isAuthenticated) {
    if (role === 'creator') {
      return NextResponse.redirect(new URL(`/${locale}/creators_side`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/brand`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.css|.*\\.woff2?|.*\\.otf).*)',
  ],
};
