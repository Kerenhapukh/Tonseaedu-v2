"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

interface Materi {
  id: number;
  title: string;
  content: string;
  bab?: string | null;
  ringkasan?: string | null;
  kelas?: string | null;
}

interface UserKelasResult {
  username?: string;
  kelas?: string | null;
}

const KELAS_ORDER = ['7', '8', '9', 'umum'];

const normalizeKelas = (kelas?: string | null) => {
  if (!kelas) return 'umum';
  const onlyNumber = kelas.replace(/\D/g, '');
  return onlyNumber || 'umum';
};

export default function UserMateriPage() {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentKelas, setStudentKelas] = useState<string | null>(null);

  const kelasLabel = studentKelas ? `Kelas ${studentKelas.replace(/\D/g, '') || studentKelas}` : 'Semua Kelas';

  useEffect(() => {
    const fetchMateriWithKelas = async (kelasFilter: string | null) => {
      try {
        let url = '/api/materi';
        if (kelasFilter) {
          url += `?kelas=${kelasFilter}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setMateriList(data.data || data);
        }
      } catch (error) {
        console.error('Gagal mengambil materi:', error);
      } finally {
        setLoading(false);
      }
    };

    const initData = async () => {
      const savedUser = localStorage.getItem('tonsea_user');
      let userKelas = localStorage.getItem('tonsea_user_kelas');

      if (!userKelas && savedUser) {
        try {
          const res = await fetch('/api/admin/users');
          const users = (await res.json()) as UserKelasResult[];
          const currentUser = users.find((u) => u.username === savedUser);
          if (currentUser && currentUser.kelas) {
            userKelas = currentUser.kelas;
            localStorage.setItem('tonsea_user_kelas', userKelas);
          }
        } catch {
          console.error('Gagal sinkronisasi data user');
        }
      }

      setStudentKelas(userKelas);
      fetchMateriWithKelas(userKelas);
    };

    initData();
  }, []);

  const groupedMateri = useMemo(() => {
    const groups: Record<string, Materi[]> = {
      '7': [],
      '8': [],
      '9': [],
      umum: [],
    };

    materiList.forEach((materi) => {
      const key = normalizeKelas(materi.kelas);
      if (!groups[key]) {
        groups.umum.push(materi);
        return;
      }
      groups[key].push(materi);
    });

    return groups;
  }, [materiList]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fbff_0%,_#eef4ff_100%)] py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href="/dashboard" className="group inline-flex items-center text-blue-700 font-semibold hover:text-blue-800 transition-colors">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <section className="rounded-[2rem] border border-blue-100 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                <Sparkles size={14} />
                Materi Otomatis Sesuai Kelas
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                Materi Pembelajaran {kelasLabel}
              </h1>
              <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                Materi ditampilkan per kelas agar siswa hanya melihat konten yang sesuai dengan levelnya.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm min-w-[220px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Kelas aktif</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{kelasLabel}</p>
              <p className="mt-1 text-sm text-slate-500">{materiList.length} materi tersedia</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Memuat materi untuk {kelasLabel}...</div>
        ) : materiList.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-300 text-center shadow-sm">
            <BookOpen size={52} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Materi untuk {kelasLabel}</h3>
            <p className="text-slate-500 max-w-xl mx-auto">
              Materi untuk kelas ini belum tersedia. Jika guru menambahkan materi khusus kelas 7, 8, atau 9, konten akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {KELAS_ORDER.map((kelasKey) => {
              const items = groupedMateri[kelasKey] || [];
              const label = kelasKey === 'umum' ? 'Materi Umum' : `Kelas ${kelasKey}`;

              return (
                <section key={kelasKey} className="rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] overflow-hidden">
                  <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">{label}</h2>
                      <p className="text-sm text-slate-500">{items.length} materi tersedia</p>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {kelasKey === 'umum' ? 'Tidak terikat kelas' : `Filter ${label}`}
                    </span>
                  </div>

                  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                    {items.length === 0 ? (
                      <div className="col-span-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                        Belum ada materi untuk {label}.
                      </div>
                    ) : (
                      items.map((materi) => (
                        <article key={materi.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-blue-300 flex flex-col">
                          <div className="h-36 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.32),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.18),_transparent_30%)]" />
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-sm">
                              <BookOpen size={34} />
                            </div>
                          </div>

                          <div className="p-6 flex flex-1 flex-col">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                {label}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                {materi.bab || 'BAB belum diisi'}
                              </span>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-snug">{materi.title}</h3>

                            <p className="mt-4 text-slate-500 text-sm line-clamp-4 flex-1 leading-relaxed">
                              {materi.ringkasan || materi.content}
                            </p>

                            <div className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">
                              Lihat Materi
                              <ChevronRight size={18} />
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
