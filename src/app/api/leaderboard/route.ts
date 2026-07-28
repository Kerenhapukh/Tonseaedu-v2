import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelas = searchParams.get('kelas');

  const cleanDigit = (kelas && kelas !== 'Semua') ? kelas.replace(/\D/g, '') : null;

  // 1. Ambil semua User untuk mapping namaLengkap, role, dan kelas terdaftar
  const allUsers = await prisma.user.findMany({
    select: { username: true, namaLengkap: true, role: true, kelas: true }
  });

  const userMap: Record<string, string> = {};
  const userRoleMap: Record<string, string> = {};
  const userKelasMap: Record<string, string> = {};

  const setLookup = (key: string, user: typeof allUsers[0]) => {
    if (!key) return;
    const lowerKey = key.trim().toLowerCase();
    userMap[lowerKey] = user.namaLengkap;
    userRoleMap[lowerKey] = (user.role || '').toLowerCase();
    const digit = (user.kelas || '').replace(/\D/g, '');
    userKelasMap[lowerKey] = digit;
  };

  allUsers.forEach(u => {
    setLookup(u.username, u);
    setLookup(u.namaLengkap, u);
  });

  // 2. Ambil semua data skor
  const allScores = await prisma.score.findMany({
    orderBy: [
      { score: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // 3. Group by username: Ambil skor tertinggi per siswa yang kelasnya COCOK dengan filter
  const studentBestMap = new Map<string, typeof allScores[0]>();

  for (const item of allScores) {
    const itemKey = (item.username || '').trim().toLowerCase();

    // Abaikan jika akun ini adalah admin / guru
    const role = userRoleMap[itemKey] || userRoleMap[item.username] || '';
    if (role === 'admin' || role === 'guru') continue;

    // Jika filter kelas aktif, pastikan kelas terdaftar siswa SAMA DENGAN kelas yang difilter!
    if (cleanDigit) {
      const registeredClassDigit = userKelasMap[itemKey] !== undefined ? userKelasMap[itemKey] : userKelasMap[item.username];
      const scoreClassDigit = (item.kelas || '').replace(/\D/g, '');
      const studentClassDigit = (registeredClassDigit !== undefined && registeredClassDigit !== '') 
        ? registeredClassDigit 
        : scoreClassDigit;

      if (studentClassDigit !== cleanDigit) {
        continue; // Lewati jika kelas siswa tidak cocok dengan filter
      }
    }

    // Key unik grouping berdasarkan username/nama terdaftar agar tidak ada duplikasi
    const canonicalName = userMap[itemKey] || userMap[item.username] || item.username;
    const groupKey = canonicalName.trim().toLowerCase();

    if (!studentBestMap.has(groupKey)) {
      studentBestMap.set(groupKey, item);
    } else {
      const existing = studentBestMap.get(groupKey)!;
      if (item.score > existing.score) {
        studentBestMap.set(groupKey, item);
      }
    }
  }

  const uniqueRankings = Array.from(studentBestMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const formattedRankings = uniqueRankings.map(r => {
    const key = (r.username || '').trim().toLowerCase();
    return {
      ...r,
      name: userMap[key] || userMap[r.username] || r.username,
    };
  });

  return NextResponse.json({ data: formattedRankings });
}