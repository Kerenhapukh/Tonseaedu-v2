"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, ChevronRight, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface QuizQuestion {
  id: number;
  question: string;
  correct_answer: string;
  options: string[];
}

const PASSING_SCORE = 70;
const SECONDS_PER_QUESTION = 15;

const shuffle = <T,>(array: T[]): T[] => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const formatQuizSchedule = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d).replace('.', ':');
};

export default function MateriQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username ?? null;
  const studentKelas = session?.user?.kelas ?? null;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [materiJudul, setMateriJudul] = useState<string>("");
  const [quizStartAt, setQuizStartAt] = useState<string | null>(null);
  const [quizEndAt, setQuizEndAt] = useState<string | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(true);
  const [quizStatusMessage, setQuizStatusMessage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const percent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const lulus = percent >= PASSING_SCORE;

  const nextQuestion = useCallback(() => {
    setCurrentIndex((idx) => {
      const next = idx + 1;
      if (next < questions.length) {
        setTimeLeft(SECONDS_PER_QUESTION);
        return next;
      }
      setShowResult(true);
      return idx;
    });
  }, [questions.length]);

  const handleAnswer = (option: string) => {
    if (option === questions[currentIndex].correct_answer) {
      setScore((s) => s + 1);
    }
    nextQuestion();
  };

  // Muat soal
  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/materi/${id}/quiz`);
        const data = await res.json();
        if (data?.materi?.judul) setMateriJudul(data.materi.judul);
        if (data?.materi?.quizStartAt) setQuizStartAt(data.materi.quizStartAt);
        if (data?.materi?.quizEndAt) setQuizEndAt(data.materi.quizEndAt);
        if (typeof data?.materi?.isQuizOpen === 'boolean') setIsQuizOpen(data.materi.isQuizOpen);
        if (data?.materi?.quizStatusMessage) setQuizStatusMessage(data.materi.quizStatusMessage);

        const qs = (data.data || []) as QuizQuestion[];
        const randomized = shuffle(qs).map((q) => ({ ...q, options: shuffle(q.options || []) }));
        setQuestions(randomized);
      } catch (e) {
        console.error("Gagal memuat soal:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, username]);

  // Timer
  useEffect(() => {
    if (loading || showResult || !isStarted || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return SECONDS_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, showResult, isStarted, questions.length, nextQuestion]);

  // Simpan progress saat selesai
  useEffect(() => {
    if (!showResult || saved || questions.length === 0) return;
    const save = async () => {
      setSaving(true);
      try {
        // Simpan progress materi (untuk unlock)
        await fetch("/api/materi-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materiId: parseInt(id, 10), quizScore: percent }),
        });
        // Simpan skor umum (biar dashboard/leaderboard tetap terisi seperti biasa)
        await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kelas: studentKelas || null,
            score,
            total_questions: questions.length,
          }),
        });
      } catch (e) {
        console.error("Gagal menyimpan progress:", e);
      } finally {
        setSaving(false);
        setSaved(true);
      }
    };
    save();
  }, [showResult, saved, id, percent, score, questions.length, studentKelas]);

  const wrap = "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fbff_0%,_#eef4ff_100%)] py-10 px-4 md:px-8";

  if (loading) {
    return <div className={`${wrap} flex items-center justify-center text-slate-500 font-bold`}>Menyiapkan kuis...</div>;
  }

  // Tidak ada soal sama sekali (materi belum punya soal & kelas juga kosong)
  if (questions.length === 0) {
    return (
      <main className={wrap}>
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href={`/materi/${id}`} className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" /> Kembali ke Materi
          </Link>
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-xl font-black text-amber-800 mb-2">Belum ada soal kuis</h2>
            <p className="text-amber-700">
              Materi ini belum memiliki soal kuis, dan belum ada soal untuk kelasnya.
              Minta guru menambahkan soal terlebih dahulu agar materi berikutnya bisa terbuka.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Layar pembuka
  if (!isStarted && !showResult) {
    const startFormatted = formatQuizSchedule(quizStartAt);
    const endFormatted = formatQuizSchedule(quizEndAt);

    return (
      <main className={wrap}>
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href={`/materi/${id}`} className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" /> Kembali ke Materi
          </Link>
          <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Trophy size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Kuis Materi</h1>
            {materiJudul && <p className="mt-1 text-slate-500 font-semibold">{materiJudul}</p>}

            {/* Badges Jadwal Kuis */}
            {(startFormatted || endFormatted) && (
              <div className="my-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs shadow-sm space-y-1 text-left">
                <p className="font-extrabold text-blue-900 text-sm mb-1">Batas Waktu Pengerjaan Kuis:</p>
                {startFormatted && (
                  <p className="text-slate-700 font-semibold text-sm">🗓️ <b>Dibuka:</b> {startFormatted}</p>
                )}
                {endFormatted && (
                  <p className="text-slate-700 font-semibold text-sm">⏰ <b>Ditutup:</b> {endFormatted}</p>
                )}
              </div>
            )}

            {!isQuizOpen && (
              <div className="my-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 font-bold text-sm">
                ⚠️ {quizStatusMessage || 'Kuis tidak dapat diakses saat ini.'}
              </div>
            )}

            <p className="mt-4 text-slate-600">
              Jawab {questions.length} soal. Nilai minimal <b>{PASSING_SCORE}%</b> untuk membuka materi berikutnya.
              Setiap soal punya waktu {SECONDS_PER_QUESTION} detik.
            </p>

            <button
              onClick={() => setIsStarted(true)}
              disabled={!isQuizOpen}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isQuizOpen ? 'Mulai Kuis' : 'Kuis Ditutup'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Hasil
  if (showResult) {
    return (
      <main className={wrap}>
        <div className="mx-auto max-w-md">
          <div className="p-8 md:p-10 bg-white rounded-[2rem] shadow-xl text-center border border-slate-200">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${lulus ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
              {lulus ? <CheckCircle2 size={34} /> : <XCircle size={34} />}
            </div>
            <h2 className="text-2xl font-black mb-1 text-slate-900">
              {lulus ? "Lulus! 🎉" : "Belum Lulus"}
            </h2>
            <p className="text-slate-500 mb-6">
              {lulus
                ? "Materi berikutnya sudah terbuka."
                : `Nilai minimal ${PASSING_SCORE} untuk lanjut. Coba lagi ya.`}
            </p>
            <div className={`text-7xl font-black mb-6 ${lulus ? "text-green-600" : "text-red-500"}`}>{percent}</div>
            <div className="flex justify-between bg-slate-50 p-4 rounded-2xl mb-8 text-sm font-medium">
              <div className="text-green-600">Benar: {score}</div>
              <div className="text-red-500">Salah: {questions.length - score}</div>
            </div>

            {saving && <p className="text-xs text-slate-400 mb-4">Menyimpan progress...</p>}

            {lulus ? (
              <Link
                href="/materi"
                className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-3"
              >
                Kembali ke Daftar Materi
              </Link>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-3 inline-flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Coba Lagi
              </button>
            )}
            <Link href={`/materi/${id}`} className="block text-slate-400 hover:text-slate-600 text-sm">
              Baca ulang materi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Soal berjalan
  const q = questions[currentIndex];
  return (
    <main className={wrap}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Soal {currentIndex + 1} / {questions.length}
          </div>
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-slate-700"}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full mb-10 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-10">{q.question}</h1>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="group w-full p-6 text-left bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-500 group-hover:text-white font-bold mr-4 text-sm transition-colors">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg font-semibold text-slate-700 group-hover:text-blue-900">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
