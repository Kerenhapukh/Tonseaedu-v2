"use client";

import { use, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface Materi {
  id: number;
  title: string;
  content: string;
  bab?: string | null;
  ringkasan?: string | null;
  kelas?: string | null;
  videoUrl?: string | null;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

interface QuizQuestion {
  id: number;
  pertanyaan: string;
  correctAnswer: string;
  options: string[];
}

interface ProgressItem {
  materiId: number;
  quizScore?: number | null;
}

const READ_TIMER_SECONDS = 120;
const MAX_QUIZ_QUESTIONS = 5;
const PASSING_SCORE = 70;

const normalizeKelas = (kelas?: string | null) => {
  if (!kelas) return 'umum';
  const onlyNumber = kelas.replace(/\D/g, '');
  return onlyNumber || 'umum';
};

const formatKelasLabel = (kelas?: string | null) => {
  if (!kelas) return 'Semua Kelas';
  const normalized = kelas.replace(/\D/g, '');
  return normalized ? `Kelas ${normalized}` : 'Semua Kelas';
};

const getYoutubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const shuffleArray = <T,>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  const [materi, setMateri] = useState<Materi | null>(null);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Timer baca
  const [secondsLeft, setSecondsLeft] = useState(READ_TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /Kuis gerbang/ 
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizUnavailable, setQuizUnavailable] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; message: string } | null>(null);

  // Ambil username dari localStorage
  useEffect(() => {
    setUsername(localStorage.getItem('tonsea_user'));
  }, []);

  // Load data materi + daftar materi (untuk next/prev)
  useEffect(() => {
    const loadMateri = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          fetch(`/api/materi/${resolvedParams.id}`),
          fetch('/api/materi'),
        ]);

        const [detailData, listData] = await Promise.all([
          detailRes.json(),
          listRes.json(),
        ]);

        if (!detailRes.ok || !detailData?.data) {
          throw new Error(detailData?.error || 'Materi tidak ditemukan');
        }

        setMateri(detailData.data);
        setMateriList(Array.isArray(listData?.data) ? listData.data : []);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat materi');
      } finally {
        setLoading(false);
      }
    };

    loadMateri();
  }, [resolvedParams.id]);

  // Load progress siswa (materi mana saja yang sudah lulus)
  useEffect(() => {
    if (!username) return;

    const loadProgress = async () => {
      try {
        const res = await fetch(`/api/materi-progress?username=${encodeURIComponent(username)}`);
        const json = await res.json();
        const list: ProgressItem[] = Array.isArray(json?.data) ? json.data : [];
        setCompletedIds(new Set(list.map((p) => p.materiId)));
      } catch (err) {
        console.error('Gagal memuat progress:', err);
      } finally {
        setProgressLoaded(true);
      }
    };

    loadProgress();
  }, [username]);

  const alreadyCompleted = materi ? completedIds.has(materi.id) : false;

  // Reset semua state gerbang setiap kali pindah materi
  useEffect(() => {
    setSecondsLeft(READ_TIMER_SECONDS);
    setQuizQuestions([]);
    setQuizUnavailable(false);
    setAnswers({});
    setSubmitted(false);
    setQuizResult(null);
  }, [resolvedParams.id]);

  // Jalankan countdown timer baca (hanya kalau belum lulus sebelumnya)
  useEffect(() => {
    if (loading || error || alreadyCompleted || !progressLoaded) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, error, alreadyCompleted, progressLoaded, resolvedParams.id]);

  const siblingMateri = useMemo(() => {
    if (!materi) return [];
    const kelasKey = normalizeKelas(materi.kelas);
    return materiList.filter((item) => normalizeKelas(item.kelas) === kelasKey);
  }, [materi, materiList]);

  const siblingIndex = useMemo(() => {
    if (!materi) return -1;
    return siblingMateri.findIndex((item) => item.id === materi.id);
  }, [materi, siblingMateri]);

  const previousMateri = siblingIndex >= 0 ? siblingMateri[siblingIndex - 1] : undefined;
  const nextMateri = siblingIndex >= 0 ? siblingMateri[siblingIndex + 1] : undefined;
  const embedUrl = getYoutubeEmbedUrl(materi?.videoUrl);

  const timerDone = alreadyCompleted || secondsLeft <= 0;

  // Ambil soal kuis begitu timer baca selesai (dan belum pernah lulus)
  useEffect(() => {
    if (!timerDone || alreadyCompleted || !materi || quizQuestions.length > 0 || quizUnavailable || quizResult?.passed) return;

    const fetchQuiz = async () => {
      setQuizLoading(true);
      try {
        const url = `/api/materi/${materi.id}/quiz`;
        const res = await fetch(url);
        const json = await res.json();
        const list: QuizQuestion[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        if (list.length === 0) {
          setQuizUnavailable(true);
          return;
        }

        setQuizQuestions(shuffleArray(list).slice(0, MAX_QUIZ_QUESTIONS));
      } catch (err) {
        console.error('Gagal memuat soal kuis:', err);
        setQuizUnavailable(true);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuiz();
  }, [timerDone, alreadyCompleted, materi, quizQuestions.length, quizUnavailable, quizResult]);

  const handleSelectAnswer = (questionId: number, option: string) => {
    if (submitted && quizResult?.passed) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const allAnswered = quizQuestions.length > 0 && quizQuestions.every((q) => answers[q.id]);

  const handleSubmitQuiz = async () => {
    if (!materi || !username || !allAnswered) return;

    const correctCount = quizQuestions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correctCount / quizQuestions.length) * 100);

    setSubmitting(true);
    try {
      const res = await fetch('/api/materi-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, materiId: materi.id, quizScore: score }),
      });
      const json = await res.json();

      setSubmitted(true);
      setQuizResult({
        score,
        passed: !!json.passed,
        message: json.message || (json.passed ? 'Selamat, kamu lulus!' : `Skor kamu ${score}. Coba lagi ya.`),
      });

      if (json.passed) {
        setCompletedIds((prev) => new Set(prev).add(materi.id));
      }
    } catch (err) {
      console.error('Gagal mengirim hasil kuis:', err);
      alert('Terjadi kesalahan saat mengirim jawaban. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setQuizResult(null);
    setQuizQuestions((prev) => shuffleArray(prev));
  };

  const canProceedToNext = !nextMateri || alreadyCompleted || (submitted && quizResult?.passed) || quizUnavailable;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-8 px-4 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link 
          href="/materi" 
          className="group inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-sm font-bold text-slate-700 shadow-sm border border-slate-200/80 hover:bg-white hover:text-blue-600 transition-all hover:shadow-md hover:-translate-x-0.5"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-slate-500 group-hover:text-blue-600" />
          Kembali ke Daftar Materi
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-[2.5rem] border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4" />
            <p className="text-slate-500 font-bold text-sm">Memuat materi pembelajaran...</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm font-semibold">
            {error}
          </div>
        ) : materi ? (
          <article className="overflow-hidden rounded-[2.5rem] border border-slate-200/90 bg-white/95 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            {/* Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 px-8 py-10 md:px-12 md:py-14 text-white">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-extrabold uppercase tracking-wider text-white/90">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-md border border-white/20">
                    <BookOpen size={14} className="text-blue-300" />
                    Modul Pembelajaran
                  </span>
                  {materi.bab ? <span className="rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-md border border-white/20">{materi.bab}</span> : null}
                  {materi.category?.name ? <span className="rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-md border border-white/20">{materi.category.name}</span> : null}
                  {alreadyCompleted && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/30 px-3.5 py-1.5 backdrop-blur-md border border-emerald-300/40 text-emerald-200">
                      <CheckCircle2 size={14} /> Sudah Lulus
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-black tracking-tight leading-tight md:text-5xl text-white">
                  {materi.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-blue-200/90 pt-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 border border-white/10">
                    <CalendarDays size={14} />
                    {formatKelasLabel(materi.kelas)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-6 py-8 sm:px-8 md:px-12 md:py-10">

              {/* Timer baca - hanya kalau belum pernah lulus */}
              {!alreadyCompleted && !timerDone && (
                <div className="flex items-center gap-4 rounded-2xl border border-amber-300/60 bg-amber-500/10 p-5 backdrop-blur-sm">
                  <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md shrink-0">
                    <Clock3 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Waktu Membaca Wajib</p>
                    <p className="text-sm font-semibold text-amber-900 mt-0.5">
                      Silakan baca materi dengan teliti ada Kuis diakhir materi yang bisa diakses dalam{' '}
                      <span className="inline-flex px-2 py-0.5 rounded-lg bg-amber-200 text-amber-900 font-mono font-bold text-base shadow-inner">{secondsLeft}</span> detik.
                    </p>
                  </div>
                </div>
              )}

              {materi.ringkasan ? (
                <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Ringkasan</h2>
                  <p className="mt-3 whitespace-pre-wrap text-slate-700 leading-7 sm:leading-8">
                    {materi.ringkasan}
                  </p>
                </section>
              ) : null}

              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Isi Materi</h2>
                <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
                  <div className="whitespace-pre-wrap text-slate-700 leading-7 sm:leading-8">
                    {materi.content}
                  </div>
                </div>
              </section>

              {embedUrl ? (
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Video Pendukung</h2>
                  <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 shadow-sm">
                    <iframe
                      src={embedUrl}
                      title={materi.title}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              ) : null}

              {/* Gerbang Kuis - muncul kalau timer habis, belum lulus, dan bukan alreadyCompleted */}
              {!alreadyCompleted && timerDone && !quizUnavailable && (
                <section className="rounded-[1.5rem] border border-indigo-200 bg-indigo-50/70 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={18} className="text-indigo-600" />
                      <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-700">
                        Kuis Materi (Uji Pemahaman)
                      </h2>
                    </div>
                    {quizQuestions.length > 0 && (
                      <span className="text-xs font-bold text-indigo-500">
                        {quizQuestions.length} soal &middot; Minimal {PASSING_SCORE}% untuk lulus
                      </span>
                    )}
                  </div>

                  {quizLoading ? (
                    <p className="text-sm text-slate-500">Menyiapkan soal...</p>
                  ) : quizQuestions.length > 0 ? (
                    <div className="space-y-5">
                      {quizQuestions.map((q, idx) => {
                        const selected = answers[q.id];
                        const showFeedback = submitted;

                        return (
                          <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                            <p className="font-semibold text-slate-800 mb-3">
                              {idx + 1}. {q.pertanyaan}
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {q.options.map((option) => {
                                const isSelected = selected === option;
                                const isCorrectOption = option === q.correctAnswer;
                                const showCorrect = showFeedback && isCorrectOption;
                                const showWrong = showFeedback && isSelected && !isCorrectOption;

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSelectAnswer(q.id, option)}
                                    disabled={submitted && quizResult?.passed}
                                    className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                                      showCorrect
                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                        : showWrong
                                        ? 'border-red-300 bg-red-50 text-red-700'
                                        : isSelected
                                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'
                                    }`}
                                  >
                                    {option}
                                    {showCorrect && <CheckCircle2 size={16} className="shrink-0" />}
                                    {showWrong && <XCircle size={16} className="shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {!submitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={!allAnswered || submitting}
                          className="w-full rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                          {submitting ? 'Mengirim jawaban...' : 'Kumpulkan Jawaban'}
                        </button>
                      ) : (
                        <div
                          className={`rounded-2xl border p-4 text-center ${
                            quizResult?.passed
                              ? 'border-emerald-300 bg-emerald-50'
                              : 'border-red-300 bg-red-50'
                          }`}
                        >
                          <p className={`font-bold ${quizResult?.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                            Skor kamu: {quizResult?.score}%
                          </p>
                          <p className={`mt-1 text-sm ${quizResult?.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                            {quizResult?.message}
                          </p>

                          {!quizResult?.passed && (
                            <button
                              onClick={handleRetryQuiz}
                              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-red-300 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 transition-colors"
                            >
                              <RotateCcw size={14} />
                              Coba Lagi
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Tidak ada soal tersedia saat ini.</p>
                  )}
                </section>
              )}

              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Sebelumnya</p>
                  {previousMateri ? (
                    <Link
                      href={`/materi/${previousMateri.id}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      <ChevronLeft size={16} />
                      {previousMateri.title}
                    </Link>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">Tidak ada materi sebelumnya.</p>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm text-right sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Berikutnya</p>
                  {nextMateri ? (
                    canProceedToNext ? (
                      <Link
                        href={`/materi/${nextMateri.id}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                      >
                        {nextMateri.title}
                        <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <button
                        disabled
                        title={!timerDone ? 'Selesaikan waktu baca dulu' : 'Lulus kuis materi ini dulu'}
                        className="mt-3 inline-flex cursor-not-allowed items-center gap-2 text-sm font-semibold text-slate-400"
                      >
                        <Lock size={14} />
                        {nextMateri.title}
                      </button>
                    )
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">Tidak ada materi berikutnya.</p>
                  )}
                </div>
              </section>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}
