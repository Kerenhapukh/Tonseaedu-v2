// File tujuan: src/app/api/materi-progress/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/materi-progress?username=xxx
 * Mengembalikan daftar materiId yang SUDAH diselesaikan siswa (lulus kuis).
 * Halaman materi memakai ini untuk menghitung mana yang terkunci/terbuka.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const progress = await prisma.materiProgress.findMany({
      where: { userId: user.id, status: 'completed' },
      select: { materiId: true, quizScore: true, completedAt: true },
    });

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error GET materi-progress:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

/**
 * POST /api/materi-progress
 * Dipanggil setelah siswa menyelesaikan kuis sebuah materi.
 * Body: { username, materiId, quizScore }
 * Jika quizScore >= passing score (70), materi ditandai "completed"
 * sehingga materi berikutnya otomatis terbuka.
 */
const PASSING_SCORE = 70;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, materiId, quizScore } = body;

    if (!username || materiId === undefined || quizScore === undefined) {
      return NextResponse.json(
        { error: 'username, materiId, dan quizScore diperlukan' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const numericMateriId = parseInt(String(materiId), 10);
    const numericScore = Math.round(Number(quizScore));
    const lulus = numericScore >= PASSING_SCORE;

    // Simpan / perbarui progress. Sekali "completed", tetap completed
    // walau attempt berikutnya nilainya turun (biar materi tak terkunci lagi).
    const existing = await prisma.materiProgress.findUnique({
      where: { userId_materiId: { userId: user.id, materiId: numericMateriId } },
    });

    const alreadyCompleted = existing?.status === 'completed';
    const finalStatus = alreadyCompleted || lulus ? 'completed' : 'locked';

    const progress = await prisma.materiProgress.upsert({
      where: { userId_materiId: { userId: user.id, materiId: numericMateriId } },
      update: {
        status: finalStatus,
        quizScore: numericScore,
        completedAt: finalStatus === 'completed' ? (existing?.completedAt ?? new Date()) : null,
      },
      create: {
        userId: user.id,
        materiId: numericMateriId,
        status: finalStatus,
        quizScore: numericScore,
        completedAt: finalStatus === 'completed' ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      passed: lulus,
      passingScore: PASSING_SCORE,
      data: progress,
      message: lulus
        ? 'Selamat! Kamu lulus. Materi berikutnya terbuka.'
        : `Nilai ${numericScore}. Minimal ${PASSING_SCORE} untuk membuka materi berikutnya. Coba lagi ya.`,
    });
  } catch (error) {
    console.error('Error POST materi-progress:', error);
    return NextResponse.json({ error: 'Gagal menyimpan progress' }, { status: 500 });
  }
}
