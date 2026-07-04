import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

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
  try {
    // 1. UBAH DARI request.json() MENJADI request.formData()
    const formData = await request.formData();
    
    const tonsea = formData.get('tonsea') as string;
    const indonesia = formData.get('indonesia') as string;
    const categoryName = formData.get('categoryName') as string;
    const kelas = formData.get('kelas') as string | null;
    
    // Ambil file audio mentah dari form data
    const audioFile = formData.get('audio') as File | null;

    let finalAudioUrl = null;

    // 2. PROSES PENYIMPANAN FILE AUDIO KE FOLDER PUBLIC
    if (audioFile && audioFile.size > 0) {
      // Konversi file ke Buffer agar bisa ditulis oleh sistem File System (fs)
      const bytes = await audioFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Buat nama file unik memakai timestamp agar tidak bentrok jika nama filenya sama
      const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
      
      // Tentukan folder tujuan penyimpanan: public/uploads/audio
      const uploadDir = path.join(process.cwd(), 'public/uploads/audio');
      
      // Pastikan folder tujuan sudah terbuat di dalam server hosting/lokal
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Tulis file audio ke folder tujuan
      const fullPath = path.join(uploadDir, fileName);
      await fs.writeFile(fullPath, buffer);

      // Path URL relatif inilah yang nantinya bisa diakses oleh frontend/siswa
      finalAudioUrl = `/uploads/audio/${fileName}`;
    }

    if (!tonsea || !indonesia || !categoryName) {
      return NextResponse.json({ error: "Data kata, arti, dan kategori wajib diisi" }, { status: 400 });
    }

    // 3. CARI ATAU BUAT KATEGORI (Logika Prisma bawaan kamu)
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } }
    });

    if (!category) {
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      category = await prisma.category.create({
        data: { name: categoryName, slug: slug }
      });
    }

    // 4. SIMPAN KOSAKATA BARU KE POSTGRESQL LEWAT PRISMA
    const newKosakata = await prisma.kosakata.create({
      data: {
        tonsea,
        indonesia,
        audioUrl: finalAudioUrl, // Menyimpan URL path audio lokal baru (/uploads/audio/...)
        categoryId: category.id,
        kelas: kelas || null,
      }
    });

    return NextResponse.json({ message: "Kosakata berhasil ditambahkan!", data: newKosakata }, { status: 201 });
  } catch (error) {
    console.error("Error pada API POST Kosakata:", error);
    return NextResponse.json({ error: "Gagal menambahkan kosakata" }, { status: 500 });
  }
}