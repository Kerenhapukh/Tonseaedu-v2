import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/apiAuth";

export async function GET() {
  const { response } = await requireRole(["admin"]);
  if (response) return response;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      users.map(({ password: _password, ...user }) => ({
        ...user,
        name: user.namaLengkap,
        email: user.email || user.username,
        namaSekolah: user.namaSekolah,
        nomorTelepon: user.nomorTelepon,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { response } = await requireRole(["admin"]);
  if (response) return response;

  try {
    const body = await req.json();
    const { username, email, password, name, namaLengkap, namaSekolah, nomorTelepon, role, kelas } = body;
    const displayName = name || namaLengkap;
    const loginIdentifier = (email || username || "").trim().toLowerCase();
    const normalizedRole = String(role || "guru").toLowerCase();
    const normalizedKelas = typeof kelas === "string" ? kelas.trim() : "";

    if (!loginIdentifier || !password || !displayName) {
      return NextResponse.json({ error: "Email/username, nama lengkap, dan password wajib diisi" }, { status: 400 });
    }

    if (normalizedRole === "siswa" && !normalizedKelas) {
      return NextResponse.json({ error: "Kelas wajib diisi untuk siswa" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: loginIdentifier },
          { email: loginIdentifier },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: loginIdentifier,
        email: loginIdentifier,
        password: hashedPassword,
        namaLengkap: displayName,
        namaSekolah: namaSekolah || null,
        nomorTelepon: nomorTelepon || null,
        kelas: normalizedRole === "siswa" ? normalizedKelas : kelas || null,
        role: normalizedRole,
      },
    });

    const { password: _password, ...safeUser } = user;
    return NextResponse.json({
      ...safeUser,
      name: user.namaLengkap,
      email: user.email || user.username,
      namaSekolah: user.namaSekolah,
      nomorTelepon: user.nomorTelepon,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
