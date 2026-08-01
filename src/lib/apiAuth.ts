import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireRole(allowedRoles: string[]) {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return {
      session: null,
      response: NextResponse.json(
        { error: session ? "Forbidden" : "Unauthorized" },
        { status: session ? 403 : 401 }
      ),
    };
  }

  return { session, response: null as NextResponse | null };
}
