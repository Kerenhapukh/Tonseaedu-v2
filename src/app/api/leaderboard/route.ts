import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelas = searchParams.get('kelas');

  let whereClause = {};
  if (kelas && kelas !== 'Semua') {
    whereClause = { kelas };
  }

  const rankings = await prisma.score.findMany({
    where: whereClause,
    orderBy: {
      score: 'desc'
    },
    take: 10 // Ambil 10 besar saja
  });

  // Map to name field so frontend handles it easily, and default to Auth username
  const users = await prisma.user.findMany({
    select: { username: true, namaLengkap: true }
  });
  const userMap: Record<string, string> = {};
  users.forEach(u => {
    userMap[u.username] = u.namaLengkap;
  });

  const formattedRankings = rankings.map(r => ({
    ...r,
    name: userMap[r.username] || r.username,
  }));

  return NextResponse.json({ data: formattedRankings });
}