import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kelasSiswa = searchParams.get('kelas');

    const whereClause: any = {
      materiId: null, // HANYA mengambil soal umum (bukan soal kuis gerbang materi)
    };
    if (kelasSiswa) {
      const tingkatKelas = kelasSiswa.replace(/\D/g, '');
      if (tingkatKelas) {
        whereClause.OR = [
          { kelas: null },
          { kelas: '' },
          { kelas: tingkatKelas }
        ];
      }
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      question: question.pertanyaan,
      correct_answer: question.correctAnswer,
      options: question.options,
      kelas: question.kelas,
    }));

    return NextResponse.json({
      data: formattedQuestions,
    });
  } catch (error: any) {
    console.error("PRISMA_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal memuat database", details: error.message },
      { status: 500 }
    );
  }
}