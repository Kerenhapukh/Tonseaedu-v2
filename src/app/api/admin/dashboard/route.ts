import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/apiAuth';

export async function GET() {
  const { response } = await requireRole(['admin']);
  if (response) return response;

  try {
    const totalQuestions = await prisma.question.count();
    const totalMateri = await prisma.materi.count();
    const totalKosakata = await prisma.kosakata.count();
    
    // Hitung total unique users berdasarkan username di tabel Score
    const uniqueUsersCount = await prisma.score.findMany({
      select: {
        username: true,
      },
      distinct: ['username'],
    });

    const recentScores = await prisma.score.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalQuestions,
          totalMateri,
          totalKosakata,
          totalUsers: uniqueUsersCount.length,
        },
        recentScores
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}