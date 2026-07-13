import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const materi = await prisma.materi.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });

    if (!materi) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...materi,
        title: materi.judul,
        content: materi.konten,
        bab: materi.bab,
        ringkasan: materi.ringkasan,
        videoUrl: materi.videoUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching materi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { title, content, categoryId, kelas, judul, konten, bab, ringkasan, summary, deskripsi, videoUrl } = body;
    const { id } = await params;
    
    const finalJudul = title || judul;
    const finalKonten = content || konten;
    const finalRingkasan = ringkasan || summary || deskripsi || null;
    const finalBab = bab || null;
    const finalVideoUrl = videoUrl || null;
    
    if (!finalJudul || !finalKonten) {
       return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const existingMateri = await prisma.materi.findUnique({
      where: { id: parseInt(id) },
      select: { categoryId: true },
    });

    if (!existingMateri) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    const finalResolvedCategoryId = categoryId ? parseInt(categoryId) : existingMateri.categoryId;

    const materi = await prisma.materi.update({
      where: { id: parseInt(id) },
      data: {
        judul: finalJudul, // title diganti menjadi judul di db
        konten: finalKonten, // content diganti menjadi konten di db
        bab: finalBab,
        ringkasan: finalRingkasan,
        categoryId: finalResolvedCategoryId,
        kelas: kelas || null,
        videoUrl: finalVideoUrl,
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
