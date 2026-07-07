import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const normalizedUsername = String(username).trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: normalizedUsername, mode: "insensitive" } },
          { email: { equals: normalizedUsername, mode: "insensitive" } },
          { namaLengkap: { equals: normalizedUsername, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
    }

    if (String(user.role).toLowerCase() !== "siswa") {
      return NextResponse.json({ error: "Akun ini bukan akun siswa" }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // You might want to use JWT here, but for now we emulate the current app logic
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.namaLengkap, // gunakan namaLengkap sesuai db
        kelas: user.kelas,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
