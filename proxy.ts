import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/home', '/chat', '/product', '/mypage'];
const publicOnlyRoutes = ['/login', '/signup', '/slides'];

export async function proxy(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers
      }
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request: {
                headers: request.headers
              }
            });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          }
        }
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const isPublicOnlyRoute = publicOnlyRoutes.some(route => pathname.startsWith(route));
    if (isPublicOnlyRoute && user) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    if (pathname === '/' && user) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    return response;
  } catch {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
