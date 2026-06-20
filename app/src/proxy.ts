import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/analytics") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/analytics",
};
