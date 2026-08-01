import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { requireRole } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kelasSiswa = searchParams.get('kelas');
    
    let whereClause: any = {};
    if (kelasSiswa) {
      const tingkatKelas = kelasSiswa.replace(/\D/g, ''); 
      if (tingkatKelas) {
        whereClause = {
          OR: [
            { kelas: null },
            { kelas: '' },
            { kelas: tingkatKelas }
          ]
        };
      }
    }

    const kosakata = await prisma.kosakata.findMany({
      where: whereClause,
      include: {
        category: true
      }
    });
    return NextResponse.json(kosakata);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat kosakata" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

  try {
    const formData = await request.formData();
    
    const tonsea = (formData.get('tonsea') as string || '').trim();
    const indonesia = (formData.get('indonesia') as string || '').trim();
    const categoryName = (formData.get('categoryName') as string || '').trim();
    const kelas = (formData.get('kelas') as string | null)?.trim() || null;
    
    // Ambil file audio mentah dari form data
    const audioFile = formData.get('audio') as File | null;

    if (!tonsea || !indonesia || !categoryName) {
      return NextResponse.json({ error: "Data kata Bahasa Tonsea, Bahasa Indonesia, dan Kategori wajib diisi" }, { status: 400 });
    }

    let finalAudioUrl = null;

    // PROSES PENYIMPANAN FILE AUDIO KE FOLDER PUBLIC
    if (audioFile && audioFile.size > 0) {
      try {
        const bytes = await audioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
        
        await fs.mkdir(uploadDir, { recursive: true });
        const fullPath = path.join(uploadDir, fileName);
        await fs.writeFile(fullPath, buffer);

        finalAudioUrl = `/uploads/audio/${fileName}`;
      } catch (fsError: any) {
        console.warn("Gagal menyimpan berkas audio fisik:", fsError?.message);
      }
    }

    // CARI ATAU BUAT KATEGORI SECARA AMAN (Cegah Bentrok Unique Slug Constraint)
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

    // SIMPAN KOSAKATA BARU LEWAT PRISMA
    const newKosakata = await prisma.kosakata.create({
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

    return NextResponse.json({ message: "Kosakata berhasil ditambahkan!", data: newKosakata }, { status: 201 });
  } catch (error: any) {
    console.error("Error pada API POST Kosakata:", error);
    return NextResponse.json({ error: error.message || "Gagal menambahkan kosakata" }, { status: 500 });
  }
}