import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/apiAuth';
import { uploadMateriImage, deleteMateriImage } from '@/lib/imageStorage';

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
        imageUrl: materi.imageUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching materi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string | null;
    const content = formData.get('content') as string | null;
    const categoryId = formData.get('categoryId') as string | null;
    const kelas = formData.get('kelas') as string | null;
    const judul = formData.get('judul') as string | null;
    const konten = formData.get('konten') as string | null;
    const bab = formData.get('bab') as string | null;
    const ringkasan = formData.get('ringkasan') as string | null;
    const summary = formData.get('summary') as string | null;
    const deskripsi = formData.get('deskripsi') as string | null;
    const videoUrl = formData.get('videoUrl') as string | null;
    const quizStartAt = formData.get('quizStartAt') as string | null;
    const quizEndAt = formData.get('quizEndAt') as string | null;
    const imageFile = formData.get('image') as File | null;
    const { id } = await params;

    const finalJudul = title || judul;
    const finalKonten = content || konten;
    const finalRingkasan = ringkasan || summary || deskripsi || null;
    const finalBab = bab || null;
    const finalVideoUrl = videoUrl || null;
    const finalQuizStartAt = quizStartAt !== null ? (quizStartAt ? new Date(quizStartAt) : null) : undefined;
    const finalQuizEndAt = quizEndAt !== null ? (quizEndAt ? new Date(quizEndAt) : null) : undefined;

    if (!finalJudul || !finalKonten) {
       return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const existingMateri = await prisma.materi.findUnique({
      where: { id: parseInt(id) },
      select: { categoryId: true, imageUrl: true },
    });

    if (!existingMateri) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    let finalImageUrl = existingMateri.imageUrl;
    if (imageFile && imageFile.size > 0) {
      try {
        finalImageUrl = await uploadMateriImage(imageFile);
        await deleteMateriImage(existingMateri.imageUrl).catch(() => {});
      } catch (uploadError: any) {
        console.warn("Gagal mengunggah gambar materi baru ke Supabase Storage:", uploadError?.message);
      }
    }

    const finalResolvedCategoryId = categoryId ? parseInt(categoryId) : existingMateri.categoryId;

    const updatedMateri = await prisma.materi.update({
      where: { id: parseInt(id) },
      data: {
        judul: finalJudul,
        konten: finalKonten,
        bab: finalBab,
        ringkasan: finalRingkasan,
        categoryId: finalResolvedCategoryId,
        kelas: kelas || null,
        videoUrl: finalVideoUrl,
        imageUrl: finalImageUrl,
        ...(finalQuizStartAt !== undefined && { quizStartAt: finalQuizStartAt }),
        ...(finalQuizEndAt !== undefined && { quizEndAt: finalQuizEndAt }),
      },
    });

    return NextResponse.json(updatedMateri);
  } catch (error) {
    console.error('Error updating materi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

  try {
    const { id } = await params;

    const existingMateri = await prisma.materi.findUnique({
      where: { id: parseInt(id) },
      select: { imageUrl: true },
    });

    await prisma.materi.delete({
      where: { id: parseInt(id) },
    });

    await deleteMateriImage(existingMateri?.imageUrl).catch(() => console.log("File gambar materi tidak ditemukan di storage, abaikan."));

    return NextResponse.json({ message: 'Materi berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting materi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}