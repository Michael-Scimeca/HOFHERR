import { auth } from '@/auth';

export default auth((req) => {
  const isGodMode =
    process.env.NODE_ENV !== 'production' &&
    req.cookies.get('hofherr_god_mode')?.value === 'true';
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.isAdmin || isGodMode;
  const path = req.nextUrl.pathname;
  // Admin-only areas: the admin dashboard and the internal product identity pages
  const isTargetingAdmin =
    path.startsWith('/admin') || path === '/product-identity' || path.startsWith('/product-identity/');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isTargetingAdmin && !isLoginPage) {
    if (!isLoggedIn && !isGodMode) {
      return Response.redirect(new URL('/admin/login', req.nextUrl));
    }
    if (!isAdmin) {
      return Response.redirect(new URL('/admin/login', req.nextUrl));
    }
  }
});

export const config = {
  matcher: ['/admin/:path*', '/admin-dashboard/:path*', '/admin-dashbaord/:path*', '/product-identity/:path*'],
};
