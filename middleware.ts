import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect admin routes in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return NextResponse.next();
}
