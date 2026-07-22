import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelas = searchParams.get('kelas');

  let whereClause = {};
  if (kelas && kelas !== 'Semua') {
    whereClause = { kelas };
  }

  const allScores = await prisma.score.findMany({
    where: whereClause,
    orderBy: [
      { score: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // Group by username so each student only appears ONCE with their highest score
  const studentBestMap = new Map<string, typeof allScores[0]>();
  for (const item of allScores) {
    if (!studentBestMap.has(item.username)) {
      studentBestMap.set(item.username, item);
    } else {
      const existing = studentBestMap.get(item.username)!;
      if (item.score > existing.score) {
        studentBestMap.set(item.username, item);
      }
    }
  }

  const uniqueRankings = Array.from(studentBestMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // Map to name field so frontend handles it easily, and default to Auth username
  const users = await prisma.user.findMany({
    select: { username: true, namaLengkap: true }
  });
  const userMap: Record<string, string> = {};
  users.forEach(u => {
    userMap[u.username] = u.namaLengkap;
  });

  const formattedRankings = uniqueRankings.map(r => ({
    ...r,
    name: userMap[r.username] || r.username,
  }));

  return NextResponse.json({ data: formattedRankings });
}