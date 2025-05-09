import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const middleware = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const urlPath = request.nextUrl.pathname;
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const encoder = new TextEncoder();
    let isSessionValid = false;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, encoder.encode(secret));
        isSessionValid = !!payload;
        console.log({ payload });
      } catch {
        isSessionValid = false;
      }
    }

    const onlyPublicRoutes = [
      "/logout",
      "/signup",
      "/login",
      "/reset-password",
    ];

    // Not logged in & accessing protected page
    if (!isSessionValid && !onlyPublicRoutes.includes(urlPath)) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect_to", urlPath);
      return NextResponse.redirect(redirectUrl);
    }

    // Logged in & trying to access public-only route
    if (isSessionValid && onlyPublicRoutes.includes(urlPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Logged in & accessing private routes OR accessing public route normally
    return NextResponse.next();
  } catch {
    // Token error or unexpected failure
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: [
    "/profile/:path*",
    "/logout/:path*",
    "/login/:path*",
    "/signup/:path*",
  ],
};
