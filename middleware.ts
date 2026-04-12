import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'aiagent2024'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const password = request.nextUrl.searchParams.get('password')
    
    if (password !== DASHBOARD_PASSWORD) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}