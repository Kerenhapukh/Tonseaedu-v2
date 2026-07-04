'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Volume2, Search } from 'lucide-react';
import Link from 'next/link';

interface Kosakata {
  id: number;
  tonsea: string;
  indonesia: string;
  audio_url: string | null;
  category: { id: number; name: string };
}

export default function KosakataPage() {
  const [kosakata, setKosakata] = useState<Kosakata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const playAudio = (url: string | null) => {
    if (!url) return alert("Suara tidak tersedia untuk kosakata ini.");
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Gagal memainkan suara:", e));
  };

  const filteredKosakata = kosakata.filter((item) =>
    item.tonsea.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.indonesia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Volume2 size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Kamus Kosakata</h1>
              <p className="text-slate-500 italic">Bahasa Tonsea &mdash; Indonesia</p>
            </div>
          </div>
          
          {/* Pencarian */}
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari kata Tonsea atau Indonesia..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Memuat kamus...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredKosakata.length > 0 ? (
              filteredKosakata.map((vocab) => (
                <div 
                  key={vocab.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h3 className="text-2xl font-bold text-blue-900">
                        {vocab.tonsea}
                      </h3>
                      {vocab.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          {vocab.category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-lg">{vocab.indonesia}</p>
                  </div>
                  
                  {vocab.audio_url && (
                    <button 
                      onClick={() => playAudio(vocab.audio_url)}
                      className="ml-4 p-4 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all shadow-sm group"
                      title="Dengarkan pengucapan"
                    >
                      <Volume2 size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-500 text-lg">Kosakata tidak ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}