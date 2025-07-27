import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/analytics") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/analytics",
};
