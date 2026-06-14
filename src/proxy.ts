import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

// Protected routes require authentication
const protectedRoutes = ['/dashboard'];
// Public auth routes should redirect authenticated users
const publicRoutes = ['/login', '/register'];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) || path === '/';
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // Redirect to login if user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to students directory if user is authenticated and trying to access login/register
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard/students', req.nextUrl));
  }

  // Redirect root path to students directory if authenticated
  if (path === '/' && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard/students', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'],
};
