import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
    }

    const userScores = await prisma.score.findMany({
      where: { username },
      orderBy: { createdAt: 'desc' }
    });

    const totalQuizzes = userScores.length;
    const bestScoreObj = userScores.reduce((max, current) => 
      (current.score > max.score ? current : max), 
      userScores[0] || { score: 0, totalQuestions: 0 }
    );

    // Menghitung Streak Hari (rentetan login/kuis berturut-turut)
    const uniqueDates = [...new Set(userScores.map(s => {
      const d = new Date(s.createdAt);
      return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    }))];

    let streak = 0;
    const todayD = new Date();
    const todayStr = new Date(todayD.getTime() - (todayD.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    
    const yesterdayD = new Date(todayD);
    yesterdayD.setDate(yesterdayD.getDate() - 1);
    const yesterdayStr = new Date(yesterdayD.getTime() - (yesterdayD.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    let checkDate = new Date();
    if (uniqueDates.includes(todayStr)) {
        streak = 1;
        checkDate = todayD;
    } else if (uniqueDates.includes(yesterdayStr)) {
        streak = 1;
        checkDate = yesterdayD;
    }

    if (streak > 0) {
        while(true) {
            checkDate.setDate(checkDate.getDate() - 1);
            const checkStr = new Date(checkDate.getTime() - (checkDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            if (uniqueDates.includes(checkStr)) {
                streak++;
            } else {
                break;
            }
        }
    }

    return NextResponse.json({
      data: {
        totalQuizzes,
        bestScore: bestScoreObj.score,
        latestScore: userScores[0]?.score || 0,
        totalQuestions: bestScoreObj.totalQuestions || 0,
        streak
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal memuat skor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, score, totalQuestions, total_questions, kelas } = body;
    
    // Support both old and new payload formats
    const finalTotalQuestions = totalQuestions ?? total_questions ?? 0;

    const newScore = await prisma.score.create({
      data: {
        username: username || "Anonim",
        score: Number(score),
        totalQuestions: Number(finalTotalQuestions),
        kelas: kelas || null,
      }
    });

    return NextResponse.json(
      { message: "Skor berhasil tersimpan!", data: newScore }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST_SCORE_ERROR:", error.message);
    return NextResponse.json(
      { error: "Gagal menyimpan skor ke database" }, 
      { status: 500 }
    );
  }
}
