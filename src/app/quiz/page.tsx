"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  ChevronRight, 
  Gamepad2, 
  Clock3, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  BookOpen,
  HelpCircle
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  correct_answer: string;
  options: string[];
}

interface UserKelasResult {
  username?: string;
  kelas?: string | null;
}

const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [studentKelas] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem("tonsea_user_kelas");
  });

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    latestScore: 0,
    totalQuestions: 0,
    streak: 0,
  });
  const [materiList, setMateriList] = useState<{ id: number; judul: string; kelas?: string | null }[]>([]);
  const [selectedMateriId, setSelectedMateriId] = useState<string>("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handleMateriChange = async (materiIdStr: string) => {
    setSelectedMateriId(materiIdStr);
    if (!materiIdStr) {
      setQuestions([]);
      return;
    }
    
    setLoadingQuestions(true);
    try {
      const res = await fetch(`/api/materi/${materiIdStr}/quiz`);
      const data = await res.json();
      const quizQuestions = (data.data || data) as QuizQuestion[];
      const randomized = shuffle(quizQuestions).map((q) => ({
        ...q,
        options: shuffle(q.options || []),
      }));
      setQuestions(randomized);
    } catch (error) {
      console.error("Gagal memuat soal kuis materi:", error);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };
  
  // State khusus Timer
  const SECONDS_PER_QUESTION = 15;
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const kelasLabel = studentKelas ? `Kelas ${studentKelas.replace(/\D/g, '') || studentKelas}` : 'Semua Kelas';

  // Fungsi untuk pindah soal (dibungkus useCallback agar stabil)
  const nextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setTimeLeft(SECONDS_PER_QUESTION); // Reset timer untuk soal baru
    } else {
      setShowResult(true);
    }
  }, [currentIndex, questions.length]);

  const handleAnswer = (selectedOption: string | null) => {
    if (selectedOption === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  const [user] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem("tonsea_user") || "";
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  // Effect untuk menyimpan skor ketika kuis selesai
  useEffect(() => {
    if (showResult && user && questions.length > 0) {
      const saveScore = async () => {
        try {
          const userKelas = localStorage.getItem("tonsea_user_kelas");
          await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user,
              kelas: userKelas || null,
              score: score,
              total_questions: questions.length
            })
          });
        } catch (error) {
          console.error("Gagal menyimpan skor", error);
        }
      };
      saveScore();
    }
  }, [showResult, user, score, questions.length]);

  // Effect untuk Timer
  useEffect(() => {
    if (loading || showResult || questions.length === 0 || !isStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion(); // Otomatis pindah soal jika waktu habis
          return SECONDS_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, showResult, questions.length, isStarted, nextQuestion]);

  useEffect(() => {
    const initDataAndQuestions = async () => {
      let userKelas = localStorage.getItem("tonsea_user_kelas");
      const savedUser = localStorage.getItem("tonsea_user");
      
      if (!userKelas && savedUser) {
        try {
          const res = await fetch('/api/admin/users');
          const users = (await res.json()) as UserKelasResult[];
          const currentUser = users.find((u) => u.username === savedUser);
          if (currentUser && currentUser.kelas) {
            userKelas = currentUser.kelas;
            localStorage.setItem("tonsea_user_kelas", currentUser.kelas as string);
          }
        } catch (e) {
          console.error(e);
        }
      }

      try {
        let materiUrl = '/api/materi';
        if (userKelas) {
          materiUrl += `?kelas=${userKelas}`;
        }
        const materiRes = await fetch(materiUrl);
        const materiJson = await materiRes.json();
        setMateriList(materiJson.data || []);

        if (savedUser) {
          const scoreRes = await fetch(`/api/scores?username=${encodeURIComponent(savedUser)}`);
          const scoreData = await scoreRes.json();
          if (scoreData.data) {
            setStats(scoreData.data);
          }
        }
      } catch (error) {
        console.error("Gagal memuat materi list atau stats kuis:", error);
      } finally {
        setLoading(false);
      }
    };
    initDataAndQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4" />
        <p className="font-bold text-slate-500 text-sm">Menyiapkan Kuis Tonsea...</p>
      </div>
    );
  }

  // Jika sudah mulai tetapi soal kosong
  if (isStarted && questions.length === 0) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-10 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-slate-200 text-center space-y-4">
          <HelpCircle size={48} className="mx-auto text-blue-500 animate-bounce" />
          <h3 className="text-xl font-black text-slate-900">Soal Belum Tersedia</h3>
          <p className="text-slate-500 font-semibold text-sm">Materi yang kamu pilih belum memiliki soal kuis saat ini.</p>
          <button 
            onClick={() => setIsStarted(false)} 
            className="w-full bg-blue-600 text-white py-3.5 rounded-full font-black text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            Kembali & Pilih Materi Lain
          </button>
        </div>
      </main>
    );
  }

  // INTRO / PEMBUKA KUIS STATE
  if (!isStarted) {
    const quizBestPercent = stats.totalQuestions > 0 
      ? Math.round((stats.bestScore / stats.totalQuestions) * 100) 
      : 0;

    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Navigation back button */}
          <Link 
            href="/materi" 
            className="group inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-sm font-bold text-slate-700 shadow-sm border border-slate-200/80 hover:bg-white hover:text-blue-600 transition-all hover:shadow-md hover:-translate-x-0.5"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-slate-500 group-hover:text-blue-600" />
            Kembali ke Daftar Materi
          </Link>

          {/* Hero Banner Section */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(29,78,216,0.35)]">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-400/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-200 border border-white/20 shadow-inner">
                  <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                  Kuis Mandiri Siswa
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                  Kuis Bahasa Tonsea <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent">{kelasLabel}</span>
                </h1>
                
                {/* Dropdown Pemilihan Materi */}
                <div className="mt-6 max-w-md space-y-2">
                  <label className="block text-xs font-extrabold text-blue-200 uppercase tracking-wider">
                    Langkah 1: Pilih Materi Kuis
                  </label>
                  <select
                    className="w-full p-3.5 bg-white/10 text-white backdrop-blur-md border border-white/25 rounded-2xl shadow-inner text-sm font-bold focus:ring-2 focus:ring-cyan-300 outline-none transition cursor-pointer"
                    value={selectedMateriId}
                    onChange={(e) => handleMateriChange(e.target.value)}
                  >
                    <option value="" className="text-slate-900 font-bold">-- Pilih Materi Pembelajaran --</option>
                    {materiList.map((m) => (
                      <option key={m.id} value={m.id} className="text-slate-900 font-medium">
                        {m.judul}
                      </option>
                    ))}
                  </select>
                  
                  <p className="text-xs text-blue-100/90 font-semibold pt-1">
                    {selectedMateriId ? (
                      loadingQuestions ? (
                        <span className="inline-flex items-center gap-2 text-cyan-300">
                          <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-cyan-300 border-t-transparent" />
                          Memuat soal kuis...
                        </span>
                      ) : (
                        `✓ ${questions.length} soal kuis tersedia untuk materi ini`
                      )
                    ) : (
                      "Pilih materi di atas untuk mengaktifkan kuis."
                    )}
                  </p>
                </div>
              </div>

              {/* Stats Cards Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-w-2xl w-full lg:w-auto">
                {/* Kuis dikerjakan */}
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-2xl min-w-[220px]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-xl bg-amber-400/20 p-2.5 text-amber-300 border border-amber-300/30">
                        <Gamepad2 size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200">Kuis Dikerjakan</p>
                        <h3 className="text-2xl font-black text-white">{stats.totalQuizzes}x</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-100/80 font-medium">Nilai: <span className="font-bold text-white">{quizBestPercent}%</span></p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-yellow-300">
                    <Clock3 size={14} />
                    Streak belajar {stats.streak} hari
                  </div>
                </div>

                {/* Skor terbaik */}
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-2xl min-w-[240px] space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <div className="rounded-xl bg-emerald-400/20 p-2 text-emerald-300 border border-emerald-300/30">
                      <Trophy size={18} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-200">Skor Terbaik</p>
                  </div>

                  <div className="space-y-2 text-left pt-0.5">
                    {/* Nilai */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                        🏅 Nilai
                      </span>
                      <span className="text-base font-black text-cyan-300">{quizBestPercent}%</span>
                    </div>

                    {/* Poin */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                        ⭐ Poin
                      </span>
                      <span className="text-xs font-black text-yellow-300">{stats.bestScore * 10} Poin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Trigger Box */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/90 shadow-sm text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Siap Mulai Menguji Pemahaman?</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
              Setiap soal memiliki batas waktu 15 detik. Pastikan kamu sudah memilih materi sebelum menekan tombol di bawah.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsStarted(true)}
                disabled={!selectedMateriId || loadingQuestions || questions.length === 0}
                className={`inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-black text-white transition-all shadow-lg ${
                  !selectedMateriId || loadingQuestions || questions.length === 0
                    ? "bg-slate-300 cursor-not-allowed opacity-60 shadow-none"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                Mulai Kuis Sekarang
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // HASIL KUIS STATE
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-10 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-200 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 shadow-lg shadow-amber-300/40 animate-bounce">
            <Trophy size={40} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900">Luar Biasa! 🎉</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Hasil Kuis Bahasa Tonsea - {kelasLabel}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Skor Akhir Kamu</span>
            <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {percentage}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm font-extrabold">
            <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl">
              <CheckCircle2 size={18} /> Benar: {score}
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl">
              <XCircle size={18} /> Salah: {questions.length - score}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              <RotateCcw size={18} /> Main Kuis Lagi
            </button>
            
            <Link 
              href="/materi" 
              className="block w-full text-slate-500 hover:text-blue-600 font-extrabold text-xs py-2 transition-colors"
            >
              Kembali ke Daftar Materi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // PERMAINAN KUIS SEDANG BERLANGSUNG
  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <BookOpen size={14} /> Soal {currentIndex + 1} dari {questions.length}
            </div>
            
            {/* Timer Counter */}
            <div className={`flex items-center gap-1.5 font-mono text-lg font-black px-3 py-1 rounded-xl border ${
              timeLeft <= 5 
                ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <Clock3 size={18} />
              {timeLeft}s
            </div>
          </div>

          {/* Progress Bar Timer */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                timeLeft <= 5 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`} 
              style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-slate-200/90 shadow-xl space-y-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
            {currentQuestion.question}
          </h1>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="group w-full p-5 text-left bg-slate-50/80 border-2 border-slate-200/80 rounded-2xl hover:border-blue-500 hover:bg-blue-50/60 hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white font-black text-sm text-slate-700 transition-colors shadow-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-base font-bold text-slate-800 group-hover:text-blue-950 transition-colors">
                    {option}
                  </span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}