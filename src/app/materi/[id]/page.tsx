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
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Materi {
  id: number;
  title: string;
  content: string;
  bab?: string | null;
  ringkasan?: string | null;
  kelas?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

interface ProgressItem {
  materiId: number;
  quizScore?: number | null;
}

const READ_TIMER_SECONDS = 120;

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

export default function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const username = session?.user?.username ?? null;

  const [materi, setMateri] = useState<Materi | null>(null);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Timer baca
  const [secondsLeft, setSecondsLeft] = useState(READ_TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Reset timer baca setiap kali pindah materi
  useEffect(() => {
    setSecondsLeft(READ_TIMER_SECONDS);
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

  // Bila timer membaca selesai (secondsLeft === 0), tandai materi sebagai diselesaikan di database
  useEffect(() => {
    if (secondsLeft === 0 && materi && username && !alreadyCompleted) {
      const markCompleted = async () => {
        try {
          await fetch('/api/materi-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              materiId: materi.id,
              quizScore: 100,
            }),
          });
          setCompletedIds((prev) => new Set([...prev, materi.id]));
        } catch (e) {
          console.error('Gagal mencatat progress membaca materi:', e);
        }
      };
      markCompleted();
    }
  }, [secondsLeft, materi, username, alreadyCompleted]);

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

  const canProceedToNext = !nextMateri || timerDone;

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden py-8 px-4 md:px-8">
      {/* Gambar Latar Belakang Siswa Detail Materi */}
      <img
        src="/images/siswa-materi-bg.jpg"
        alt="Background Detail Materi Siswa"
        className="fixed inset-0 w-full h-[100dvh] object-cover object-center opacity-30 pointer-events-none scale-105 transition-all duration-1000"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Layer Gradient Overlay & Ambient Glow */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-slate-950/90 pointer-events-none z-[1]" />
      <div className="fixed top-0 right-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-[2]" />
      <div className="fixed bottom-0 left-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-[2]" />

      <div className="mx-auto max-w-5xl space-y-6 relative z-10">
        <Link 
          href="/materi" 
          className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-bold text-white shadow-sm border border-white/20 hover:bg-white/20 hover:text-cyan-300 transition-all hover:shadow-md hover:-translate-x-0.5"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-white group-hover:text-cyan-300" />
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

              {materi.imageUrl ? (
                <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 shadow-sm">
                  <img
                    src={materi.imageUrl}
                    alt={materi.title}
                    className="max-h-[420px] w-full object-cover"
                  />
                </section>
              ) : null}

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
                        title="Selesaikan waktu baca dulu"
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
