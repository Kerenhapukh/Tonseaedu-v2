import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { requireRole } from '@/lib/apiAuth';

// --- FUNGSI DELETE (HAPUS KOSAKATA + AUDIO NYA) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

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
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const formData = await req.formData();
    
    const tonsea = (formData.get('tonsea') as string || '').trim();
    const indonesia = (formData.get('indonesia') as string || '').trim();
    const categoryName = (formData.get('categoryName') as string || '').trim();
    const kelas = (formData.get('kelas') as string | null)?.trim() || null;
    
    const audioFile = formData.get('audio') as File | null;

    if (!tonsea || !indonesia || !categoryName) {
      return NextResponse.json({ error: "Data kata, arti, dan kategori wajib diisi" }, { status: 400 });
    }

    const oldKosakata = await prisma.kosakata.findUnique({ where: { id } });
    let finalAudioUrl = oldKosakata?.audioUrl; 

    if (audioFile && audioFile.size > 0) {
      try {
        const bytes = await audioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
        
        await fs.mkdir(uploadDir, { recursive: true });
        const fullPath = path.join(uploadDir, fileName);
        await fs.writeFile(fullPath, buffer);

        if (oldKosakata?.audioUrl && oldKosakata.audioUrl.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), 'public', oldKosakata.audioUrl);
          await fs.unlink(oldFilePath).catch(() => {});
        }

        finalAudioUrl = `/uploads/audio/${fileName}`;
      } catch (fsError: any) {
        console.warn("Gagal menyimpan file audio baru:", fsError?.message);
      }
    }

    const baseSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'kategori';

    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: categoryName, mode: 'insensitive' } },
          { slug: baseSlug }
        ]
      }
    });

    if (!category) {
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.category.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      category = await prisma.category.create({
        data: { name: categoryName, slug: slug }
      });
    }

    const updatedKosakata = await prisma.kosakata.update({
      where: { id },
      data: {
        tonsea,
        indonesia,
        audioUrl: finalAudioUrl, 
        categoryId: category.id,
        kelas: kelas || null,
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({ message: "Kosakata berhasil diperbarui!", data: updatedKosakata }, { status: 200 });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message || "Gagal memperbarui kosakata" }, { status: 500 });
  }
}