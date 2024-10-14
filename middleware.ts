import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const protectedRoutes = ["/home"];
const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  if (
    publicRoutes.some((route) => pathname.startsWith(route)) &&
    session?.value
  ) {
    try {
      const validateResponse = await fetch(
        new URL("/api/auth/validate", request.url),
        {
          method: "POST",
          headers: {
            "x-session-token": session.value,
          },
        }
      );

      const { valid } = await validateResponse.json();

      if (valid) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      const response = NextResponse.next();
      response.cookies.delete("session");
      return response;
    } catch (error) {
      console.error("Error validando la sesión:", error);
      const response = NextResponse.next();
      response.cookies.delete("session");
      return response;
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const validateResponse = await fetch(
        new URL("/api/auth/validate", request.url),
        {
          method: "POST",
          headers: {
            "x-session-token": session.value,
          },
        }
      );

      const { valid } = await validateResponse.json();

      if (!valid) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("session");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Error validando la sesión:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/login", "/register"],
};
