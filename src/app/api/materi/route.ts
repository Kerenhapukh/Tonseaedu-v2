import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/apiAuth';
import { uploadMateriImage } from '@/lib/imageStorage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kelasSiswa = searchParams.get('kelas'); // Misal "7A", "8B"

    // Jika filter kelas diberikan
    let whereClause: any = {};
    if (kelasSiswa) {
      // Ambil angka kelas saja (misal "7A" -> "7")
      const tingkatKelas = kelasSiswa.replace(/\D/g, ''); 
      
      if (tingkatKelas) {
        // Hanya tampilkan materi yang 'kelas'-nya null/kosong ATAU sesuai dengan kelas siswa
        whereClause = {
          OR: [
            { kelas: null },
            { kelas: '' },
            { kelas: tingkatKelas }
          ]
        };
      }
    }

    const materi = await prisma.materi.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const formattedMateri = materi.map(m => ({
      ...m,
      title: m.judul,
      content: m.konten,
      bab: m.bab,
      ringkasan: m.ringkasan,
      videoUrl: m.videoUrl,
      imageUrl: m.imageUrl,
    }));

    return NextResponse.json({ success: true, data: formattedMateri });
  } catch (error) {
    console.error("Gagal mengambil data materi:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server saat memuat materi." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string | null;
    const konten = formData.get('konten') as string | null;
    const categoryId = formData.get('categoryId') as string | null;
    const title = formData.get('title') as string | null;
    const content = formData.get('content') as string | null;
    const kelas = formData.get('kelas') as string | null;
    const bab = formData.get('bab') as string | null;
    const ringkasan = formData.get('ringkasan') as string | null;
    const summary = formData.get('summary') as string | null;
    const deskripsi = formData.get('deskripsi') as string | null;
    const videoUrl = formData.get('videoUrl') as string | null;
    const imageFile = formData.get('image') as File | null;

    const finalJudul = judul || title;
    const finalKonten = konten || content;
    const finalRingkasan = ringkasan || summary || deskripsi || null;
    const finalBab = bab || null;
    const finalVideoUrl = videoUrl || null;

    if (!finalJudul || !finalKonten) {
      return NextResponse.json(
        { success: false, error: "Judul dan konten wajib diisi." },
        { status: 400 }
      );
    }

    let finalImageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      try {
        finalImageUrl = await uploadMateriImage(imageFile);
      } catch (uploadError: any) {
        console.warn("Gagal mengunggah gambar materi ke Supabase Storage:", uploadError?.message);
      }
    }

    let finalResolvedCategoryId = categoryId ? Number(categoryId) : null;
    if (!finalResolvedCategoryId) {
      const defaultCategory = await prisma.category.findFirst({
        orderBy: { id: 'asc' },
      });

      if (!defaultCategory) {
        return NextResponse.json(
          { success: false, error: "Tidak ada kategori yang tersedia untuk materi." },
          { status: 400 }
        );
      }

      finalResolvedCategoryId = defaultCategory.id;
    }

    const newMateri = await prisma.materi.create({
      data: {
        judul: finalJudul,
        konten: finalKonten,
        bab: finalBab,
        ringkasan: finalRingkasan,
        categoryId: finalResolvedCategoryId,
        kelas: kelas || null,
        videoUrl: finalVideoUrl,
        imageUrl: finalImageUrl,
      }
    });

    return NextResponse.json({ success: true, data: newMateri }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambahkan materi:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan materi ke server." },
      { status: 500 }
    );
  }
}
