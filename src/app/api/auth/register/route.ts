import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const {
      namaLengkap,
      email,
      namaSekolah,
      nomorTelepon,
      password,
      konfirmasiPassword,
    } = await req.json();

    if (!namaLengkap || !email || !namaSekolah || !password || !konfirmasiPassword) {
      return NextResponse.json({ error: "Semua field wajib diisi, kecuali nomor telepon." }, { status: 400 });
    }

    if (password !== konfirmasiPassword) {
      return NextResponse.json({ error: "Password dan konfirmasi password tidak sama." }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: normalizedEmail },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guru = await prisma.user.create({
      data: {
        namaLengkap: namaLengkap.trim(),
        username: normalizedEmail,
        email: normalizedEmail,
        namaSekolah: namaSekolah.trim(),
        nomorTelepon: nomorTelepon?.trim() || null,
        password: hashedPassword,
        role: "guru",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Akun guru berhasil dibuat",
      user: {
        id: guru.id,
        username: guru.username,
        email: guru.email,
        namaLengkap: guru.namaLengkap,
        namaSekolah: guru.namaSekolah,
        nomorTelepon: guru.nomorTelepon,
        role: guru.role,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mendaftarkan guru." }, { status: 500 });
  }
}
