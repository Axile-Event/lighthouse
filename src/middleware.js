import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 1. Get the shared auth cookie
  const authCookie = request.cookies.get('axile_shared_auth')?.value
  let isAuthenticated = !!authCookie

  // 2. Define path groups
  const isAuthPage = pathname === '/login'
  // Admin routes (everything except login, public assets, etc.)
  const isAdminRoute = pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/users') || 
                       pathname.startsWith('/organizations') ||
                       pathname.startsWith('/events') ||
                       pathname.startsWith('/payouts') ||
                       pathname.startsWith('/revenue') ||
                       pathname.startsWith('/audit-logs')

  // 3. Redirect Authenticated admins away from Login
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 4. Redirect Unauthenticated users away from Admin pages
  if (!isAuthenticated && isAdminRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/users/:path*',
    '/organizations/:path*',
    '/events/:path*',
    '/payouts/:path*',
    '/revenue/:path*',
    '/audit-logs/:path*'
  ],
}
