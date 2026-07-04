import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// 1. Fungsi untuk MENGAMBIL soal (GET)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const kelasSiswa = searchParams.get('kelas');

    let whereClause: any = {};
    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }
    
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
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    
    const formattedQuestions = questions.map(q => ({
      ...q,
      question: q.pertanyaan
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// 2. Fungsi untuk MENAMBAH soal (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, correct_answer, options, categoryId, kelas } = body;

    const newQuestion = await prisma.question.create({
      data: {
        pertanyaan: question, // di db diganti jadi pertanyaan
        correctAnswer: correct_answer,
        options,
        categoryId: parseInt(categoryId),
        kelas: kelas || null,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah soal' }, { status: 500 });
  }
}