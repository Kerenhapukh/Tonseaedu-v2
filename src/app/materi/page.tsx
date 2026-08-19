"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  Search,
  Trophy,
  GraduationCap,
  Flame,
  Check
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Materi {
  id: number;
  title: string;
  content: string;
  bab?: string | null;
  ringkasan?: string | null;
  kelas?: string | null;
  sequence?: number;
}

interface ProgressItem {
  materiId: number;
  quizScore?: number | null;
}

const KELAS_ORDER = ['7', '8', '9', 'umum'];

const normalizeKelas = (kelas?: string | null) => {
  if (!kelas) return 'umum';
  const onlyNumber = kelas.replace(/\D/g, '');
  return onlyNumber || 'umum';
};

export default function UserMateriPage() {
  const { data: session } = useSession();
  const username = session?.user?.username ?? null;
  const studentKelas = session?.user?.kelas ?? null;

  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(() =>
    studentKelas ? normalizeKelas(studentKelas) : '7'
  );

  const kelasLabel = studentKelas ? `Kelas ${studentKelas.replace(/\D/g, '') || studentKelas}` : 'Semua Kelas';

  useEffect(() => {
    if (!username) return;

    const fetchMateri = async () => {
      try {
        let url = '/api/materi';
        if (studentKelas) url += `?kelas=${studentKelas}`;

        const [materiRes, progressRes] = await Promise.all([
          fetch(url),
          fetch(`/api/materi-progress?username=${encodeURIComponent(username)}`),
        ]);

        const materiData = await materiRes.json();
        const list = (materiData.data || materiData) as Materi[];
        const sorted = [...list].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
        setMateriList(sorted);

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          const ids = new Set<number>(
            (progressData.data as ProgressItem[]).map((p) => p.materiId)
          );
          setCompletedIds(ids);
        }
      } catch (error) {
        console.error('Gagal mengambil materi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, [username, studentKelas]);

  // Filter berdasarkan pencarian
  const filteredMateriList = useMemo(() => {
    if (!searchQuery.trim()) return materiList;
    const query = searchQuery.toLowerCase();
    return materiList.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        (m.ringkasan && m.ringkasan.toLowerCase().includes(query)) ||
        (m.bab && m.bab.toLowerCase().includes(query))
    );
  }, [materiList, searchQuery]);

  const groupedMateri = useMemo(() => {
    const groups: Record<string, Materi[]> = { '7': [], '8': [], '9': [], umum: [] };
    filteredMateriList.forEach((materi) => {
      const key = normalizeKelas(materi.kelas);
      if (!groups[key]) groups.umum.push(materi);
      else groups[key].push(materi);
    });
    return groups;
  }, [filteredMateriList]);

  // Unlock logic
  const isUnlocked = (groupItems: Materi[], index: number): boolean => {
    if (index === 0) return true;
    const prev = groupItems[index - 1];
    return completedIds.has(prev.id);
  };

  const progressPercent = materiList.length > 0
    ? Math.round((completedIds.size / materiList.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden py-8 px-4 md:px-8">
      {/* Gambar Latar Belakang Siswa Materi */}
      <img
        src="/images/siswa-materi-bg.jpg"
        alt="Background Siswa Materi"
        className="fixed inset-0 w-full h-[100dvh] object-cover object-center opacity-30 pointer-events-none scale-105 transition-all duration-1000"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Layer Gradient Overlay & Ambient Glow */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-slate-950/90 pointer-events-none z-[1]" />
      <div className="fixed top-0 right-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-[2]" />
      <div className="fixed bottom-0 left-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-[2]" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700/90 via-indigo-700/90 to-slate-900/90 text-white p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(29,78,216,0.4)] border border-white/10 backdrop-blur-xl">
          {/* Ambient Lighting & Background Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Materi Pembelajaran <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent">{studentKelas ? `Kelas ${studentKelas.replace(/\D/g, '') || studentKelas}` : ''}</span>
              </h1>

              <p className="text-blue-100/90 leading-relaxed text-base md:text-lg max-w-2xl">
                Pelajari materi bahasa Tonsea secara bertahap. Selesaikan waktu membaca pada tiap materi untuk membuka materi berikutnya.
              </p>
            </div>

            {/* Progress Card Component */}
            <div className="relative overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-7 min-w-[260px] shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl text-slate-900 shadow-md">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Progress Belajar</p>
                    <h3 className="text-2xl font-black text-white">{completedIds.size} / {materiList.length}</h3>
                  </div>
                </div>
                <span className="text-lg font-black text-cyan-300">{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-medium text-blue-100/80">
                <span>{materiList.length - completedIds.size} Materi tersisa</span>
                <span className="flex items-center gap-1 text-yellow-300 font-bold"><Flame size={14} /> Tetap Semangat!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200 shadow-sm">
          {/* Class Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {KELAS_ORDER.map((kKey) => {
              const label = kKey === 'umum' ? 'Materi Umum' : `Kelas ${kKey}`;
              const count = (groupedMateri[kKey] || []).length;
              if (count === 0 && activeTab !== kKey) return null;

              return (
                <button
                  key={kKey}
                  onClick={() => setActiveTab(kKey)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === kKey
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === kKey ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul atau ringkasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 font-bold text-sm">Menyiapkan materi pembelajaran...</p>
          </div>
        ) : materiList.length === 0 ? (
          <div className="bg-white p-14 rounded-[2.5rem] border border-dashed border-slate-300 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-4 shadow-inner">
              <BookOpen size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Belum Ada Materi untuk {kelasLabel}</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Materi pembelajaran belum tersedia untuk kelas ini. Guru akan segera menambahkan materi baru.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {KELAS_ORDER
              .filter((kelasKey) => activeTab === 'all' || activeTab === kelasKey)
              .filter((kelasKey) => (groupedMateri[kelasKey] || []).length > 0)
              .map((kelasKey) => {
                const items = groupedMateri[kelasKey];
                const label = kelasKey === 'umum' ? 'Materi Umum' : `Kelas ${kelasKey}`;

                return (
                  <section key={kelasKey} className="space-y-6">
                    {/* Section Title */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                          <GraduationCap size={22} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight text-slate-900">{label}</h2>
                          <p className="text-xs font-semibold text-slate-500">{items.length} materi pembelajaran terstruktur</p>
                        </div>
                      </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {items.map((materi, index) => {
                        const unlocked = isUnlocked(items, index);
                        const completed = completedIds.has(materi.id);

                        return (
                          <article
                            key={materi.id}
                            className={`group relative overflow-hidden rounded-[2.2rem] border bg-white shadow-sm transition-all duration-300 flex flex-col ${
                              unlocked
                                ? 'border-slate-200/90 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400'
                                : 'border-slate-200/70 bg-slate-50/80 opacity-75'
                            }`}
                          >
                            {/* Card Top Header Banner */}
                            <div className={`h-40 p-6 flex items-center justify-between relative overflow-hidden transition-colors ${
                              completed
                                ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-800'
                                : unlocked
                                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800'
                                : 'bg-gradient-to-br from-slate-500 to-slate-700'
                            }`}>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_40%)]" />
                              <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/10 blur-xl" />

                              {/* Number Badge */}
                              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white font-black text-xl shadow-lg backdrop-blur-md">
                                {index + 1}
                              </div>

                              {/* Status Badge Top Right */}
                              <div className="relative z-10">
                                {completed ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/25 px-3 py-1.5 text-xs font-black text-white border border-emerald-300/40 backdrop-blur-md shadow-sm">
                                    <CheckCircle2 size={14} className="text-emerald-300" /> Selesai
                                  </span>
                                ) : unlocked ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-black text-white border border-white/30 backdrop-blur-md">
                                    <BookOpen size={14} /> Terbuka
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-black text-slate-200 border border-white/10 backdrop-blur-md">
                                    <Lock size={14} /> Terkunci
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Content Body */}
                            <div className="p-7 flex flex-1 flex-col justify-between space-y-5">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-blue-700 border border-blue-100">
                                    {materi.bab || 'Materi Belajar'}
                                  </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                  {materi.title}
                                </h3>

                                <p className="mt-3 text-slate-500 text-xs leading-relaxed line-clamp-3">
                                  {materi.ringkasan || materi.content}
                                </p>
                              </div>

                              {/* Lock Alert Notice if locked */}
                              {!unlocked && (
                                <div className="rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/20">
                                  <p className="text-xs font-bold text-amber-800 flex items-center gap-2">
                                    <Lock size={14} className="shrink-0 text-amber-600" />
                                    Selesaikan membaca materi sebelumnya untuk membuka.
                                  </p>
                                </div>
                              )}

                              {/* Card Action Button */}
                              <div className="pt-2 border-t border-slate-100">
                                {unlocked ? (
                                  <Link
                                    href={`/materi/${materi.id}`}
                                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-black text-xs transition-all shadow-md ${
                                      completed
                                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 hover:shadow-blue-500/30'
                                    }`}
                                  >
                                    {completed ? 'Baca Ulang Materi' : 'Mulai Belajar'}
                                    <ChevronRight size={16} />
                                  </Link>
                                ) : (
                                  <button
                                    disabled
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-extrabold text-xs bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                  >
                                    <Lock size={14} /> Terkunci
                                  </button>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
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

