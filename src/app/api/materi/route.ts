import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
        createdAt: 'desc'
      }
    });

    const formattedMateri = materi.map(m => ({
      ...m,
      title: m.judul,
      content: m.konten
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
  try {
    const body = await request.json();
    const { judul, konten, categoryId, title, content, kelas } = body;
    
    const finalJudul = judul || title;
    const finalKonten = konten || content;

    if (!finalJudul || !finalKonten || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Judul, konten, dan categoryId wajib diisi." },
        { status: 400 }
      );
    }

    const newMateri = await prisma.materi.create({
      data: {
        judul: finalJudul,
        konten: finalKonten,
        categoryId: Number(categoryId),
        kelas: kelas || null,
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
