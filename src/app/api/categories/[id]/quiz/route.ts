import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/categories/[id]/quiz
 * Mengambil soal kuis umum untuk sebuah kategori tertentu (Kuis Navbar / Leaderboard).
 * 
 * Syarat Eksklusif:
 * HANYA mengambil soal dengan materiId: null (soal umum kategori)
 * dan TIDAK mengambil soal yang sudah dikaitkan ke materiId manapun.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    const { searchParams } = new URL(request.url);
    const kelasSiswa = searchParams.get('kelas');

    if (Number.isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'ID kategori tidak valid' },
        { status: 400 }
      );
    }

    // Query Prisma: Wajib materiId: null untuk memisahkan dari kuis gerbang materi
    const whereClause: any = {
      categoryId: categoryId,
      materiId: null, // Eksklusif untuk kuis umum/leaderboard
    };

    if (kelasSiswa) {
      const tingkatKelas = kelasSiswa.replace(/\D/g, '');
      if (tingkatKelas) {
        whereClause.OR = [
          { kelas: null },
          { kelas: '' },
          { kelas: tingkatKelas },
        ];
      }
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      pertanyaan: q.pertanyaan,
      question: q.pertanyaan,
      correctAnswer: q.correctAnswer,
      correct_answer: q.correctAnswer,
      options: q.options,
      kelas: q.kelas,
      categoryId: q.categoryId,
      categoryName: q.category?.name,
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuestions,
    });
  } catch (error: any) {
    console.error('Error GET category quiz:', error);
    return NextResponse.json(
      { error: 'Gagal memuat soal kuis kategori', details: error.message },
      { status: 500 }
    );
  }
}
