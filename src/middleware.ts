import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
  '/authentication/login',
  '/authentication/register',
  '/about',
  '/support/talkToUs',
  '/',
];

const authRoutes = [
  '/authentication/login',
  '/authentication/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has('dailyiu_token') || 
                   request.headers.get('authorization')?.startsWith('Bearer ');

  if (hasToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!hasToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/authentication/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};