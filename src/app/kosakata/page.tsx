'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Volume2, Search, BookMarked, Sparkles, VolumeX } from 'lucide-react';
import Link from 'next/link';

interface Kosakata {
  id: number;
  tonsea: string;
  indonesia: string;
  audioUrl?: string | null;
  category: { id: number; name: string } | null;
}

export default function KosakataPage() {
  const [kosakata, setKosakata] = useState<Kosakata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    api.get('/kosakata')
      .then(res => {
        setKosakata(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data kosakata:", err);
        setError("Gagal memuat daftar kosakata.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    try {
      const isUser = !!localStorage.getItem('tonsea_user');
      const isAdmin = !!localStorage.getItem('tonsea_admin');
      setIsStudent(isUser && !isAdmin);
    } catch (e) {
      setIsStudent(false);
    }
  }, []);

  const playAudio = (url: string | null | undefined) => {
    if (!url) return alert("Suara tidak tersedia untuk kosakata ini.");
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Gagal memainkan suara:", e));
  };

  const categories = Array.from(
    new Set(
      kosakata
        .map((item) => item.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  ).sort();

  const filteredKosakata = kosakata.filter((item) => {
    const matchesSearch =
      item.tonsea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indonesia.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      !selectedCategory || (item.category && item.category.name === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(29,78,216,0.35)]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Kamus <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent">Kosakata</span>
              </h1>
              <p className="text-blue-100/90 font-bold text-base md:text-lg">
                Bahasa Tonsea &mdash; Indonesia
              </p>
            </div>

            {/* Stat Pill Box */}
            <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl flex items-center gap-4 min-w-[220px]">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl text-white shadow-md">
                <BookMarked size={28} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Total Kosakata</p>
                <h3 className="text-3xl font-black text-white">{kosakata.length} <span className="text-sm font-semibold text-cyan-300">Kata</span></h3>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata Tonsea atau Bahasa Indonesia..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-full text-sm font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer transition-all"
            >
              <option value="">Semua Kategori ({categories.length})</option>
              {categories.map((cat) => {
                const count = kosakata.filter((item) => item.category?.name === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* List Kosakata */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 font-bold text-sm">Memuat kamus kosakata...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-[2.5rem] border border-red-200 text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredKosakata.length > 0 ? (
              filteredKosakata.map((vocab) => (
                <div 
                  key={vocab.id} 
                  className="group bg-white/90 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-400 transition-all duration-300"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {vocab.tonsea}
                      </h3>
                      {vocab.category && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                          {vocab.category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium text-base md:text-lg">{vocab.indonesia}</p>
                  </div>
                  
                  {vocab.audioUrl ? (
                    isStudent ? (
                      <button
                        onClick={() => playAudio(vocab.audioUrl)}
                        className="ml-4 p-4 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all shadow-lg shadow-blue-500/20 group-hover:scale-105 active:scale-95 flex items-center gap-2 font-bold text-xs"
                        title="Dengarkan pengucapan"
                      >
                        <Volume2 size={20} className="animate-pulse" />
                        <span className="hidden sm:inline">Dengar Audio</span>
                      </button>
                    ) : (
                      <div className="ml-4 px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                        Login Siswa untuk Audio
                      </div>
                    )
                  ) : null}
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-sm">
                <VolumeX size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Kosakata Tidak Ditemukan</h3>
                <p className="text-slate-500 text-sm mt-1">Coba gunakan kata kunci atau kategori yang lain.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}