import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/apiAuth";

// Use context parameter type for Next.js App Router API routes
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireRole(["admin", "guru"]);
  if (response) return response;

  try {
    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
      where: { id: Number(resolvedParams.id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (session!.user.role === "guru" && user.role !== "siswa") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { password: _password, ...safeUser } = user;
    return NextResponse.json({
      ...safeUser,
      name: user.namaLengkap,
      email: user.email || user.username,
      namaSekolah: user.namaSekolah,
      nomorTelepon: user.nomorTelepon,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireRole(["admin", "guru"]);
  if (response) return response;

  try {
    const resolvedParams = await params;
    const targetId = Number(resolvedParams.id);
    const isGuru = session!.user.role === "guru";

    if (isGuru) {
      const existing = await prisma.user.findUnique({ where: { id: targetId } });
      if (!existing) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (existing.role !== "siswa") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const { username, email, password, name, namaLengkap, namaSekolah, nomorTelepon, role, kelas } = body;
    const displayName = name || namaLengkap;
    const loginIdentifier = (email || username || "").trim().toLowerCase();
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : undefined;
    const normalizedKelas = typeof kelas === "string" ? kelas.trim() : "";

    if (isGuru && normalizedRole && normalizedRole !== "siswa") {
      return NextResponse.json({ error: "Guru hanya dapat mengelola akun siswa" }, { status: 403 });
    }

    if (normalizedRole === "siswa" && !normalizedKelas) {
      return NextResponse.json({ error: "Kelas wajib diisi untuk siswa" }, { status: 400 });
    }

    const data: any = {};
    if (normalizedRole) {
      data.role = normalizedRole;
    }
    if (normalizedRole === "siswa") {
      data.kelas = normalizedKelas;
    } else if (kelas !== undefined) {
      data.kelas = kelas || null;
    }
    if (loginIdentifier) {
      data.username = loginIdentifier;
      data.email = loginIdentifier;
    }
    if (displayName) {
      data.namaLengkap = displayName;
    }
    if (namaSekolah !== undefined) {
      data.namaSekolah = namaSekolah || null;
    }
    if (nomorTelepon !== undefined) {
      data.nomorTelepon = nomorTelepon || null;
    }
    
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: targetId },
      data,
    });

    const { password: _password, ...safeUser } = user;
    return NextResponse.json({
      ...safeUser,
      name: user.namaLengkap,
      email: user.email || user.username,
      namaSekolah: user.namaSekolah,
      nomorTelepon: user.nomorTelepon,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireRole(["admin", "guru"]);
  if (response) return response;

  try {
    const resolvedParams = await params;
    const targetId = Number(resolvedParams.id);

    if (session!.user.role === "guru") {
      const existing = await prisma.user.findUnique({ where: { id: targetId } });
      if (!existing) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (existing.role !== "siswa") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await prisma.user.delete({
      where: { id: targetId },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
