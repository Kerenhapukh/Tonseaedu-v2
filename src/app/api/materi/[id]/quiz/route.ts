// File tujuan: src/app/api/materi/[id]/quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/materi/[id]/quiz
 * Mengambil soal kuis untuk sebuah materi.
 *
 * Strategi (sesuai keputusan):
 * 1. Jika materi punya soal khusus (Question.materiId == id), pakai itu.
 * 2. Jika belum ada, fallback ke soal umum berdasarkan KELAS materi
 *    (perilaku sama seperti /api/quiz yang sudah ada), supaya kuis
 *    tetap jalan walau guru belum membuat soal khusus per materi.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const materiId = parseInt(id, 10);

    if (Number.isNaN(materiId)) {
      return NextResponse.json({ error: 'ID materi tidak valid' }, { status: 400 });
    }

    const materi = await prisma.materi.findUnique({ where: { id: materiId } });
    if (!materi) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    // 1) Soal khusus materi
    let questions = await prisma.question.findMany({
      where: { materiId: materiId },
      orderBy: { createdAt: 'desc' },
    });

    let source: 'materi' | 'kelas' = 'materi';

    // 2) Fallback: soal umum berdasarkan kelas dan kategori materi
    if (questions.length === 0) {
      source = 'kelas';
      const tingkatKelas = (materi.kelas || '').replace(/\D/g, '');
      const whereClause: any = {
        categoryId: materi.categoryId,
        materiId: null, // Hanya ambil soal kategori umum (bukan spesifik materi lain)
      };
      if (tingkatKelas) {
        whereClause.OR = [
          { kelas: null },
          { kelas: '' },
          { kelas: tingkatKelas },
        ];
      }
      questions = await prisma.question.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });
    }

    const formatted = questions.map((q) => ({
      id: q.id,
      pertanyaan: q.pertanyaan,
      question: q.pertanyaan,
      correctAnswer: q.correctAnswer,
      correct_answer: q.correctAnswer,
      options: q.options,
      kelas: q.kelas,
    }));

    const now = new Date();
    let isQuizOpen = true;
    let quizStatusMessage = 'Kuis Aktif';

    if (materi.quizStartAt && now < new Date(materi.quizStartAt)) {
      isQuizOpen = false;
      quizStatusMessage = 'Kuis Belum Dibuka';
    } else if (materi.quizEndAt && now > new Date(materi.quizEndAt)) {
      isQuizOpen = false;
      quizStatusMessage = 'Waktu Pengerjaan Kuis Telah Berakhir (Ditutup)';
    }

    return NextResponse.json({
      success: true,
      source, // "materi" jika soal khusus, "kelas" jika fallback
      materi: { 
        id: materi.id, 
        judul: materi.judul, 
        kelas: materi.kelas,
        quizStartAt: materi.quizStartAt,
        quizEndAt: materi.quizEndAt,
        isQuizOpen,
        quizStatusMessage,
      },
      data: formatted,
    });
  } catch (error) {
    console.error('Error GET materi quiz:', error);
    return NextResponse.json({ error: 'Gagal memuat soal kuis' }, { status: 500 });
  }
}
