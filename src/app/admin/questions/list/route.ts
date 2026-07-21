import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
     
      include: { 
        category: true,
        materi: true 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    return NextResponse.json(questions || []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}