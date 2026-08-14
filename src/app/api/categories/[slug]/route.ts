import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/apiAuth';

// Catatan: parameter path ini bernama `slug` untuk menghindari konflik rute dengan
// GET di atas, tapi pada PUT nilainya adalah ID numerik kategori (lihat pemanggilnya).
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { response } = await requireRole(['admin', 'guru']);
  if (response) return response;

  try {
    const id = (await params).slug;
    const body = await req.json();
    const { quizStartAt, quizEndAt } = body;

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        quizStartAt: quizStartAt ? new Date(quizStartAt) : null,
        quizEndAt: quizEndAt ? new Date(quizEndAt) : null,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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
