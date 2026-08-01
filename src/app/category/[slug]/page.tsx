'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// 1. Definisikan Interface
interface Kosakata {
  id: number;
  tonsea: string;
  indonesia: string;
  audio_url: string | null;
}

interface Materi {
  id: number;
  title: string;
  content: string;
  videoUrl?: string | null;
}

interface Category {
  id: number;
  name: string;
  description: string;
  kosakata: Kosakata[];
  materi: Materi[];
}

const getProgressKey = (username: string, kelas: string | null) => {
  const normalizedKelas = kelas ? kelas.replace(/\D/g, '') || 'umum' : 'umum';
  return `tonsea_progress_categories_${username}_${normalizedKelas}`;
};

const markCategoryProgress = (username: string, kelas: string | null, slug: string) => {
  if (typeof window === 'undefined' || !username) {
    return;
  }

  const key = getProgressKey(username, kelas);
  const rawValue = localStorage.getItem(key);
  let completedSlugs: string[] = [];

  if (rawValue) {
    try {
      completedSlugs = JSON.parse(rawValue);
    } catch {
      completedSlugs = [];
    }
  }

  if (!completedSlugs.includes(slug)) {
    completedSlugs.push(slug);
    localStorage.setItem(key, JSON.stringify(completedSlugs));
  }
};

// Mengubah link YouTube biasa (watch?v=, youtu.be/, shorts/) menjadi URL embed
const getYoutubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export default function CategoryDetail() {
  const params = useParams();
  const slug = params.slug;
  const { data: session } = useSession();
  const username = session?.user?.username ?? null;
  const userKelas = session?.user?.kelas ?? null;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'materi' | 'kosakata'>('materi');

  useEffect(() => {
    if (!slug) return;

    let url = `/categories/${slug}`;
    if (userKelas) {
      url += `?kelas=${userKelas}`;
    }

    api.get(url)
      .then(res => {
        console.log("Response API:", res.data);
        const data = res.data.data || res.data;
        setCategory(data);
        if (data?.materi?.length > 0 && username) {
          markCategoryProgress(username, userKelas, String(slug));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil detail kategori:", err);
        setError("Kosakata tidak ditemukan atau server bermasalah.");
        setLoading(false);
      });
  }, [slug, username, userKelas]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat kosakata...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm mx-auto">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/materi" className="text-blue-600 font-semibold hover:underline flex items-center justify-center">
            <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Materi
          </Link>
        </div>
      </div>
    );
  }

  const playAudio = (url: string | null) => {
    if (!url) return alert("Suara tidak tersedia untuk kosakata ini.");
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Gagal memainkan suara:", e));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Kembali */}
        <Link href="/materi" className="group inline-flex items-center text-blue-600 mb-8 font-medium hover:text-blue-700 transition-colors">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Daftar Materi
        </Link>

        {/* Header Kategori */}
        <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">{category.name}</h1>
              <p className="text-slate-500 italic">Bahasa Tonsea &mdash; Indonesia</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed">
            {category.description}
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8 border border-slate-200 max-w-sm">
          <button
            onClick={() => setActiveTab('materi')}
            className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'materi' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Materi
          </button>
          <button
            onClick={() => setActiveTab('kosakata')}
            className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'kosakata' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Kosakata
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'materi' && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 px-2">Materi Pembelajaran</h2>
            
            {category.materi && category.materi.length > 0 ? (
              <div className="grid gap-6">
                {category.materi.map((m) => {
                  const embedUrl = getYoutubeEmbedUrl(m.videoUrl);
                  return (
                    <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="text-xl font-bold text-blue-900 mb-3">{m.title}</h3>
                      <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {m.content}
                      </div>

                      {embedUrl && (
                        <div className="mt-5 aspect-video rounded-xl overflow-hidden border border-slate-200">
                          <iframe
                            src={embedUrl}
                            title={m.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl text-center border border-dashed border-slate-300">
                <p className="text-slate-400">Belum ada materi untuk kategori ini.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kosakata' && (
          <div className="grid gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 px-2">Daftar Kosakata</h2>
            
            {category.kosakata && category.kosakata.length > 0 ? (
              category.kosakata.map((vocab) => (
                <div 
                  key={vocab.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                      <h3 className="text-2xl font-bold text-blue-900">
                        {vocab.tonsea}
                      </h3>
                      <span className="text-slate-300">/</span>
                      <p className="text-lg text-slate-700 font-medium">
                        {vocab.indonesia}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => playAudio(vocab.audio_url)}
                    title={vocab.audio_url ? "Putar Suara" : "Suara belum tersedia"}
                    className={`ml-4 p-4 rounded-full transition-all group ${
                      vocab.audio_url 
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" 
                        : "bg-slate-50 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <Volume2 size={24} className={vocab.audio_url ? "group-active:scale-90 transition-transform" : ""} />
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white p-16 rounded-3xl text-center border border-dashed border-slate-300">
                <p className="text-slate-400 text-lg">Belum ada kosakata.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
