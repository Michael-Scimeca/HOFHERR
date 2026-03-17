import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.isAdmin;
  const isTargetingAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isTargetingAdmin && !isLoginPage) {
    if (!isLoggedIn || !isAdmin) {
      return Response.redirect(new URL("/admin/login", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
