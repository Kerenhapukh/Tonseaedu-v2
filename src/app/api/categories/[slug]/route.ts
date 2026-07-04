import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const { searchParams } = new URL(request.url);
    const kelasSiswa = searchParams.get('kelas');

    let materiWhere: any = {};
    let kosakataWhere: any = {};

    if (kelasSiswa) {
      const tingkatKelas = kelasSiswa.replace(/\D/g, ''); 
      if (tingkatKelas) {
        materiWhere = {
          OR: [
            { kelas: null },
            { kelas: '' },
            { kelas: tingkatKelas }
          ]
        };
        kosakataWhere = {
          OR: [
            { kelas: null },
            { kelas: '' },
            { kelas: tingkatKelas }
          ]
        };
      }
    }

    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: {
        materi: {
          where: materiWhere
        },
        kosakata: {
          where: kosakataWhere
        },
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const formattedCategory = {
      ...category,
      materi: category.materi.map((m: any) => ({
        ...m,
        title: m.judul,
        content: m.konten
      }))
    };

    return NextResponse.json(formattedCategory);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memuat kategori" },
      { status: 500 }
    );
  }
}
