import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add your allowed IP addresses here
const ALLOWED_IPS = ['2.222.86.36']; // Add your IP addresses

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const ip =
      request.headers.get('x-forwarded-for') || // Commonly used header for client IP
      request.headers.get('x-real-ip') || // Alternative header for client IP
      '';

    if (!ALLOWED_IPS.includes(ip)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return NextResponse.next();
}
