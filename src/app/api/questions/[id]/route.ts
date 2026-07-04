import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Tunggu params selesai diproses (Next.js 15+)
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // 2. Langsung hapus soal (karena tidak ada relasi ke tabel Score)
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Soal berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error Detail:", error);
    return NextResponse.json(
      { error: "Gagal menghapus soal dari database." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();
    const { question, correct_answer, options, categoryId, kelas } = body;

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        pertanyaan: question, // diganti menjadi pertanyaan di db
        correctAnswer: correct_answer,
        options,
        categoryId: parseInt(categoryId),
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui soal" }, { status: 500 });
  }
}