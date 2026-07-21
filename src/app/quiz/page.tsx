"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Trophy, TimerReset, ChevronRight, Gamepad2, Clock3 } from "lucide-react";

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

  // Di dalam QuizPage komponen
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

  if (loading) return <div className="flex justify-center items-center h-screen text-xl font-bold bg-slate-50 text-slate-500">Menyiapkan Kuis Tonsea...</div>;

  // Jika sudah mulai tetapi soal kosong (misal materi terpilih tidak punya soal kuis)
  if (isStarted && questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto p-10 bg-white rounded-[2rem] shadow-xl border border-slate-200">
          <p className="text-slate-500 mb-6 font-semibold">Materi ini belum memiliki soal kuis.</p>
          <button 
            onClick={() => setIsStarted(false)} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </main>
    );
  }

  // Jika belum mulai, tampilkan layar pembuka quiz yang berdiri sendiri
  if (!isStarted) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fbff_0%,_#eef4ff_100%)] py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Link href="/materi" className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-800 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Kembali ke Daftar Materi
          </Link>

          <section className="rounded-[2rem] border border-blue-100 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-6 md:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                  <Sparkles size={14} />
                  Kuis Mandiri Siswa
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">Kuis Bahasa Tonsea {kelasLabel}</h1>
                
                {/* Dropdown Pemilihan Materi */}
                <div className="mt-6 max-w-md">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Materi Terlebih Dahulu</label>
                  <select
                    className="w-full p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedMateriId}
                    onChange={(e) => handleMateriChange(e.target.value)}
                  >
                    <option value="">-- Pilih Materi Kuis --</option>
                    {materiList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.judul}
                      </option>
                    ))}
                  </select>
                  
                  <p className="mt-3 text-sm text-slate-500 font-semibold">
                    {selectedMateriId ? (
                      loadingQuestions ? (
                        <span className="flex items-center gap-2 text-blue-600">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></span>
                          Memuat soal kuis...
                        </span>
                      ) : (
                        `${questions.length} soal kuis tersedia untuk materi ini`
                      )
                    ) : (
                      "Silakan pilih materi untuk menampilkan kuis."
                    )}
                  </p>
                </div>
              </div>

              {(() => {
                const quizBestPercent = stats.totalQuestions > 0 
                  ? Math.round((stats.bestScore / stats.totalQuestions) * 100) 
                  : 0;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-w-2xl w-full lg:w-auto">
                    {/* Kuis dikerjakan */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-w-[240px]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                            <Gamepad2 size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Kuis dikerjakan</p>
                            <h3 className="text-lg font-black text-slate-900">{stats.totalQuizzes}x</h3>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Aktif</span>
                      </div>
                      <p className="text-xs text-slate-500">Nilai terakhir {stats.latestScore}/{stats.totalQuestions || 0}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Clock3 size={14} className="text-slate-400" />
                        Streak belajar {stats.streak} hari
                      </div>
                    </div>

                    {/* Skor terbaik */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-w-[240px]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                            <Trophy size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Skor terbaik</p>
                            <h3 className="text-lg font-black text-slate-900">{stats.bestScore}/{stats.totalQuestions || 0}</h3>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{quizBestPercent}%</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate" title="Rata-rata performa kuis siswa">Rata-rata performa kuis siswa.</p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${quizBestPercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>

          <div className="text-center mb-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">Siap mulai kuis?</h2>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setIsStarted(true)}
              disabled={!selectedMateriId || loadingQuestions || questions.length === 0}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all ${
                !selectedMateriId || loadingQuestions || questions.length === 0
                  ? "bg-slate-300 cursor-not-allowed opacity-60 shadow-none"
                  : "bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              Mulai Kuis
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (showResult) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fbff_0%,_#eef4ff_100%)] py-20 px-4">
        <div className="max-w-md mx-auto p-10 bg-white rounded-[2rem] shadow-xl text-center border border-slate-200">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Trophy size={34} />
          </div>
          <h2 className="text-3xl font-black mb-2 text-slate-900">Luar Biasa! 🎉</h2>
          <p className="text-gray-500 mb-6">Hasil kuis bahasa Tonsea kamu untuk {kelasLabel}:</p>
          <div className="text-7xl font-black text-blue-600 mb-6">
            {Math.round((score / questions.length) * 100)}
          </div>
          <div className="flex justify-between bg-gray-50 p-4 rounded-2xl mb-8 text-sm font-medium">
            <div className="text-green-600">Benar: {score}</div>
            <div className="text-red-500">Salah: {questions.length - score}</div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-4"
          >
            Main Lagi
          </button>
          <Link href="/materi" className="block text-gray-400 hover:text-gray-600 text-sm">Kembali ke Daftar Materi</Link>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fbff_0%,_#eef4ff_100%)] py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
        {/* Indikator Soal */}
        <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Soal {currentIndex + 1} / {questions.length}
        </div>
        
        {/* Timer Visual */}
        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-3 rounded-full mb-10 overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-1000 ease-linear" 
          style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
        ></div>
      </div>

      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
          {currentQuestion.question}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="group w-full p-6 text-left bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-500 group-hover:text-white font-bold mr-4 text-sm transition-colors">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-900">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
      </div>
    </main>
  );
}