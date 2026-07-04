import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Impor dari file yang baru dibuat

export async function GET() {
  try {
    // Tambahkan log untuk memastikan env terbaca
    console.log("DATABASE_URL check:", process.env.DATABASE_URL ? "Tersedia" : "HILANG");

    const questions = await prisma.question.findMany();

    return NextResponse.json({
      data: questions
    });
  } catch (error: any) {
    console.error("PRISMA_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal memuat database", details: error.message },
      { status: 500 }
    );
  }
}