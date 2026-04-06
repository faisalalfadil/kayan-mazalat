import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to admin login page
  if (pathname === '/admin') {
    return NextResponse.next()
  }

  // Protect admin dashboard and API routes
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin')) {
    // Skip auth route
    if (pathname === '/api/admin/auth') {
      return NextResponse.next()
    }

    // Check for admin token in cookies
    const token = request.cookies.get('admin_token')?.value
    const authHeader = request.headers.get('authorization')

    if (!token && !authHeader) {
      // Redirect to login for page routes
      if (pathname.startsWith('/admin/dashboard')) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      // Return 401 for API routes
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
