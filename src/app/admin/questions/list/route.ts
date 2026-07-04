import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Paksa Next.js untuk tidak menggunakan cache agar data selalu segar
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: { 
        category: true 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    // Ini baris yang paling krusial
    return NextResponse.json(questions || []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}