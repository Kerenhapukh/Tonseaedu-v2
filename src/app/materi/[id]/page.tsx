"use client";

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [materi, setMateri] = useState<Materi | null>(null);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fbff_0%,_#eef4ff_100%)] py-10 px-4 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/materi" className="group inline-flex items-center text-blue-700 font-semibold hover:text-blue-800 transition-colors">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Materi
        </Link>

        {loading ? (
          <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-10 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            Memuat materi...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {error}
          </div>
        ) : materi ? (
          <article className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white/95 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-8 md:px-10 md:py-12 text-white">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                  <BookOpen size={14} />
                  Materi Lengkap
                </span>
                {materi.bab ? <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">{materi.bab}</span> : null}
                {materi.category?.name ? <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">{materi.category.name}</span> : null}
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight leading-tight md:text-5xl">
                {materi.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/85">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatKelasLabel(materi.kelas)}
                </span>
              </div>
            </div>

            <div className="space-y-8 px-4 py-6 sm:px-6 md:px-10 md:py-10">
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
                    <Link
                      href={`/materi/${nextMateri.id}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {nextMateri.title}
                      <ChevronRight size={16} />
                    </Link>
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