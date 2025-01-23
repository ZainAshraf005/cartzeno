import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const adminAuth = request.cookies.get('admin-auth'); // Get the admin-auth cookie

  // Define paths that logged-in users should not access
  const restrictedForLoggedIn = ['/login', '/register'];

  // Redirect logged-in users away from restricted paths
  if (token && restrictedForLoggedIn.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  // Paths that are accessible only for logged-in users
  const restrictedForGuests = ['/dashboard', '/profile', '/admin']; // Add your restricted paths here

  // Redirect non-logged-in users trying to access logged-in-only routes
  if (!token && restrictedForGuests.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }

  // Protect the `/admin` route with a password
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (adminAuth?.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login-admin', request.nextUrl.origin));
    }
  }

  // Redirect non-logged-in users trying to access protected routes
  const excludedPaths = ['/', '/api/']; // Paths accessible without authentication
  if (!token && !excludedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/).*)', // Apply middleware to all routes except /api/*
  ],
};
