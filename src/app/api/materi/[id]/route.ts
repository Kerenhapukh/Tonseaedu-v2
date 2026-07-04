import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { title, content, categoryId, kelas, judul, konten } = body;
    const { id } = await params;
    
    const finalJudul = title || judul;
    const finalKonten = content || konten;
    
    if (!finalJudul || !finalKonten || !categoryId) {
       return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const materi = await prisma.materi.update({
      where: { id: parseInt(id) },
      data: {
        judul: finalJudul, // title diganti menjadi judul di db
        konten: finalKonten, // content diganti menjadi konten di db
        categoryId: parseInt(categoryId),
        kelas: kelas || null,
      },
    });

    return NextResponse.json(materi);
  } catch (error) {
    console.error('Error updating materi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.materi.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Materi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting materi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
