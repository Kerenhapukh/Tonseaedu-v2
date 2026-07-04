import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    const { identifier, password, role } = await req.json();

    if (!identifier || !password || !role) {
      return NextResponse.json({ error: "Identifier, password, and role are required" }, { status: 400 });
    }

    if (!['admin', 'guru'].includes(role)) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }

    const normalizedIdentifier = String(identifier).trim();

    const account = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: normalizedIdentifier, mode: "insensitive" } },
          { email: { equals: normalizedIdentifier, mode: "insensitive" } },
        ],
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 401 });
    }

    if (String(account.role).toLowerCase() !== String(role).toLowerCase()) {
      return NextResponse.json({ error: "Peran tidak sesuai untuk akun ini" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: account.id, username: account.username, role: account.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Sesuaikan cara mengatur cookie untuk Next.js 15
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: account.id,
        username: account.username,
        email: account.email,
        namaLengkap: account.namaLengkap,
        role: account.role,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
