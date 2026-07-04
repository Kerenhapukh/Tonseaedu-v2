'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BookOpen, ArrowRight, GraduationCap, Gamepad2, Trophy, Activity, Target, Flame } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalQuizzes: 0, bestScore: 0, latestScore: 0, totalQuestions: 0, streak: 0 });

  useEffect(() => {
    // Pastikan pengecekan dari sisi klien
    if (typeof window !== "undefined") {
      if (localStorage.getItem("tonsea_admin")) {
        router.replace("/admin");
        return;
      }

      const savedUser = localStorage.getItem("tonsea_user");
      if (!savedUser) {
        router.replace("/login");
        return;
      }

      setUsername(savedUser);
      setIsCheckingAuth(false);
      
      // Lanjut fetch data jika user sudah login
      fetch(`/api/scores?username=${encodeURIComponent(savedUser)}`)
        .then(res => res.json())
        .then(data => {
          if (data.data) setStats(data.data);
        })
        .catch(console.error);

      const userKelas = localStorage.getItem("tonsea_user_kelas");

      // Fungsi untuk memuat kategori dengan filter kelas
      const loadCategories = (kelasFilter: string | null) => {
        let categoriesUrl = '/categories';
        if (kelasFilter) {
          categoriesUrl += `?kelas=${kelasFilter}`;
        }

        api.get(categoriesUrl)
          .then(res => {
            const data = res.data.data || res.data; 
            setCategories(data);
            setLoading(false);
          })
          .catch(err => {
            console.error("Gagal ambil data:", err);
            setError("Gagal memuat kategori.");
            setLoading(false);
          });
      };

      if (!userKelas && savedUser) {
        // Fallback: Jika di localstorage tak ada kelas, kita ambil dari database (kasus jika session sudah lama)
        fetch(`/api/admin/users`)
          .then(res => res.json())
          .then(users => {
            const currentUser = users.find((u: any) => u.username === savedUser);
            if (currentUser && currentUser.kelas) {
              localStorage.setItem("tonsea_user_kelas", currentUser.kelas);
              loadCategories(currentUser.kelas);
            } else {
              loadCategories(null);
            }
          })
          .catch(() => loadCategories(null));
      } else {
        loadCategories(userKelas);
      }
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section - Sekarang lebih fokus ke konten, bukan menu lagi */}
      <section className="bg-blue-600 text-white py-20 px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
              <GraduationCap size={50} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Tonsea Edukasi</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform belajar Bahasa Tonsea <br/>Mari lestarikan budaya Minahasa Utara melalui Teknologi
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/quiz" className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-2xl font-black hover:bg-yellow-300 transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center">
              <Gamepad2 size={24} className="mr-2" />
              MULAI KUIS
            </Link>
          </div>
        </div>

        {/* Aksesoris Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto py-16 px-8 w-full">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 whitespace-nowrap">Pilih Materi</h2>
          <div className="h-[2px] w-full bg-slate-200"></div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 italic">Menyiapkan materi terbaik...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.id} className="group">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 group-hover:border-blue-500 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all h-full">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{category.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{category.description}</p>
                  <span className="text-blue-600 font-bold flex items-center text-sm">
                    Pelajari Sekarang <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Statistik Siswa - Hanya muncul di halaman utama bagian bawah */}
      {username && (
        <section className="max-w-6xl mx-auto px-8 pb-20 w-full">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-[2.5rem] shadow-xl p-8 border border-white flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg rotate-3">
                <span className="text-3xl font-black">{username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Halo, {username}! 👋</h3>
                <p className="text-slate-500 font-medium italic text-sm">Siap lanjut belajar hari ini?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto flex-1">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-3">
                <Flame className="text-orange-500" size={32} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Streak</p>
                  <p className="text-xl font-black text-slate-800">{stats.streak} Hari</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3">
                <Activity className="text-blue-500" size={32} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Kuis</p>
                  <p className="text-xl font-black text-slate-800">{stats.totalQuizzes}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-yellow-100 flex items-center gap-3 col-span-2 md:col-span-1">
                <Target className="text-yellow-500" size={32} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Terbaik</p>
                  <p className="text-xl font-black text-slate-800">{stats.bestScore}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}