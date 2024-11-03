import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add your allowed IP addresses here
const ALLOWED_IPS = ['127.0.0.1']; // Add your IP addresses

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || '';
    
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