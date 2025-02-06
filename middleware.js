import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    '/login',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/static'
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );


  if (isPublicRoute) {

    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};