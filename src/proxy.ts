import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (token) {
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
      return NextResponse.redirect(new URL('/academy', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup'],
};