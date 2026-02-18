import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

const LEGACY_PATHS = [
  "/new-year-offer",
  "/coffee-menu",
];

function isLegacyPath(pathname: string) {
  return LEGACY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, _next internals
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return;
  }

  // Skip legacy routes - let them through untouched
  if (isLegacyPath(pathname)) {
    return;
  }

  // Skip if already has a valid locale prefix
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  if (firstSegment && isValidLocale(firstSegment)) {
    return;
  }

  // Any other non-locale path → redirect to /en/...
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|images|favicon.ico).*)"],
};
