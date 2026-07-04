import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// --- FUNGSI DELETE (HAPUS KOSAKATA + AUDIO NYA) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // Cari data kosakata terlebih dahulu untuk mengecek apakah ada file audio lokal
    const kosakata = await prisma.kosakata.findUnique({ where: { id } });

    // Jika ada file audio di folder public, hapus file fisiknya
    if (kosakata?.audioUrl && kosakata.audioUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', kosakata.audioUrl);
      await fs.unlink(filePath).catch(() => console.log("File fisik audio tidak ditemukan, abaikan."));
    }

    // Hapus data dari database PostgreSQL
    await prisma.kosakata.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kosakata dan file audio berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kosakata." },
      { status: 500 }
    );
  }
}

// --- FUNGSI PUT (EDIT KOSAKATA DENGAN UNGGAH AUDIO BARU) ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // 1. Ganti dari req.json() ke req.formData()
    const formData = await req.formData();
    
    const tonsea = formData.get('tonsea') as string;
    const indonesia = formData.get('indonesia') as string;
    const categoryName = formData.get('categoryName') as string;
    const kelas = formData.get('kelas') as string | null;
    
    // Ambil file audio mentah jika admin mengunggah file baru saat edit
    const audioFile = formData.get('audio') as File | null;

    if (!tonsea || !indonesia || !categoryName) {
      return NextResponse.json({ error: "Data kata, arti, dan kategori wajib diisi" }, { status: 400 });
    }

    // Ambil data lama untuk mempertahankan audio lama jika admin tidak menggantinya
    const oldKosakata = await prisma.kosakata.findUnique({ where: { id } });
    let finalAudioUrl = oldKosakata?.audioUrl; 

    // 2. Jika admin mengunggah file audio baru untuk mengganti yang lama
    if (audioFile && audioFile.size > 0) {
      const bytes = await audioFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Berikan penamaan unik berdasarkan timestamp
      const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
      
      // Pastikan folder tujuan tersedia
      await fs.mkdir(uploadDir, { recursive: true });
      const fullPath = path.join(uploadDir, fileName);
      await fs.writeFile(fullPath, buffer);

      // Hapus file audio
      if (oldKosakata?.audioUrl && oldKosakata.audioUrl.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), 'public', oldKosakata.audioUrl);
        await fs.unlink(oldFilePath).catch(() => console.log("Audio lama tidak ditemukan saat ingin dihapus, abaikan."));
      }

      // Gunakan URL path audio yang baru
      finalAudioUrl = `/uploads/audio/${fileName}`;
    }

    // 3. Cari atau buat kategori baru berdasarkan nama
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } }
    });

    if (!category) {
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      category = await prisma.category.create({
        data: { name: categoryName, slug: slug }
      });
    }

    // 4. Update data kosakata ke Prisma
    const updatedKosakata = await prisma.kosakata.update({
      where: { id },
      data: {
        tonsea,
        indonesia,
        audioUrl: finalAudioUrl, 
        categoryId: category.id,
        kelas: kelas || null, // Mendukung field data tingkat kelas (7, 8, atau 9)
      },
    });

    return NextResponse.json({ message: "Kosakata berhasil diperbarui!", data: updatedKosakata }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui kosakata" }, { status: 500 });
  }
}