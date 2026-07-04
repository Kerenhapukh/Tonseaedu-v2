import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelas = searchParams.get('kelas');

  let whereClause = {};
  if (kelas) {
    const tingkatKelas = kelas.replace(/\D/g, ''); 
    if (tingkatKelas) {
      whereClause = {
        OR: [
          {
            materi: {
              some: {
                OR: [{ kelas: null }, { kelas: '' }, { kelas: tingkatKelas }]
              }
            }
          },
          {
            kosakata: {
              some: {
                OR: [{ kelas: null }, { kelas: '' }, { kelas: tingkatKelas }]
              }
            }
          },
          {
            questions: {
              some: {
                OR: [{ kelas: null }, { kelas: '' }, { kelas: tingkatKelas }]
              }
            }
          }
        ]
      };
    }
  }

  const categories = await prisma.category.findMany({
    where: whereClause
  });
  return NextResponse.json(categories);
}