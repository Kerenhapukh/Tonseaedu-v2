import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadAudioFile, deleteAudioFile } from '@/lib/audioStorage';
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

    // Cari data kosakata terlebih dahulu untuk mengecek apakah ada file audio di storage
    const kosakata = await prisma.kosakata.findUnique({ where: { id } });

    // Jika ada file audio di Supabase Storage, hapus file nya
    await deleteAudioFile(kosakata?.audioUrl).catch(() => console.log("File audio di storage tidak ditemukan, abaikan."));

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
        finalAudioUrl = await uploadAudioFile(audioFile);
        await deleteAudioFile(oldKosakata?.audioUrl).catch(() => {});
      } catch (uploadError: any) {
        console.warn("Gagal mengunggah file audio baru ke Supabase Storage:", uploadError?.message);
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