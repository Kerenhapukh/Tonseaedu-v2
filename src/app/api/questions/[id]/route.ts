import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

  
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
    const { question, correct_answer, options, categoryId, kelas, materiId } = body;

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        pertanyaan: question, 
        correctAnswer: correct_answer,
        options,
        categoryId: parseInt(categoryId),
        kelas: kelas || null,
        materiId: materiId ? parseInt(materiId) : null,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui soal" }, { status: 500 });
  }
}