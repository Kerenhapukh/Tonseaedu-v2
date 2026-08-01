import { NextResponse } from "next/server";
import { auth } from "@/auth";

const GURU_PREFIXES = ["/guru"];
const ADMIN_PREFIXES = ["/admin", "/api/admin"];
const SISWA_PREFIXES = ["/quiz", "/materi", "/kosakata", "/leaderboard", "/category", "/dashboard"];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const role = req.auth?.user?.role;

  let requiredRoles: string[] | null = null;
  if (matchesPrefix(pathname, GURU_PREFIXES)) {
    requiredRoles = ["guru"];
  } else if (matchesPrefix(pathname, ADMIN_PREFIXES)) {
    requiredRoles = ["admin", "guru"];
  } else if (matchesPrefix(pathname, SISWA_PREFIXES)) {
    requiredRoles = ["siswa"];
  }

  if (!requiredRoles) {
    return NextResponse.next();
  }

  if (!req.auth) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", req.nextUrl.origin);
    if (requiredRoles.length === 1) {
      url.searchParams.set("role", requiredRoles[0]);
    }
    return NextResponse.redirect(url);
  }

  if (!role || !requiredRoles.includes(role)) {
    if (isApi) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const fallback = role === "admin" ? "/admin" : role === "guru" ? "/guru" : "/materi";
    return NextResponse.redirect(new URL(fallback, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/guru",
    "/guru/:path*",
    "/quiz",
    "/quiz/:path*",
    "/materi",
    "/materi/:path*",
    "/kosakata",
    "/kosakata/:path*",
    "/leaderboard",
    "/leaderboard/:path*",
    "/category",
    "/category/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/api/admin/:path*",
  ],
};
