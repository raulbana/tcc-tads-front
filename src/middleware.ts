import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/authentication/login",
  "/authentication/register",
  "/support/talkToUs",
  "/",
];

const authRoutes = ["/authentication/login", "/authentication/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenFromCookie = request.cookies.get("dailyiu_token")?.value;
  const authHeader = request.headers.get("authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const hasToken = !!(tokenFromCookie || tokenFromHeader);

  if (hasToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !hasToken &&
    !publicRoutes.includes(pathname) &&
    !pathname.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL("/authentication/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
