import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kelas = searchParams.get('kelas');

    let whereClause = {};
    if (kelas && kelas !== 'Semua') {
      whereClause = { kelas };
    }

    // Ambil data skor
    const scores = await prisma.score.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    // Ambil data user untuk mencocokkan namaLengkap berdasarkan username
    const users = await prisma.user.findMany({
      select: { username: true, namaLengkap: true }
    });

    // Buat pemetaan (mapping) username ke namaLengkap
    const userMap: Record<string, string> = {};
    users.forEach(u => {
      userMap[u.username] = u.namaLengkap;
    });

    // Gabungkan data skor dengan namaLengkap
    const formattedScores = scores.map(s => ({
      ...s,
      namaSiswa: userMap[s.username] || s.username // fallback ke username jika tak ada namaLengkap
    }));

    return NextResponse.json({ success: true, data: formattedScores });
  } catch (error) {
    console.error("Gagal memuat rekap nilai:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server saat memuat rekap nilai." },
      { status: 500 }
    );
  }
}
