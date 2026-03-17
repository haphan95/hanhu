import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/") return NextResponse.next();
  if (path.startsWith("/api/") || path === "/api") return NextResponse.next();
  if (path.startsWith("/thiepmoi")) return NextResponse.next();
  if (path.startsWith("/_next/")) return NextResponse.next();
  if (/\.(ico|svg|png|jpg|jpeg|gif|webp|css|js|woff2?|mp3|m4a|wav|ogg|webm)$/i.test(path)) return NextResponse.next();

  return NextResponse.redirect(new URL("/", request.url));
}
