'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { GraduationCap, Gamepad2, Trophy, Activity, Target, Flame, Clock3, BarChart3, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

interface DashboardUser {
  username?: string;
  kelas?: string | null;
}

const getProgressKey = (username: string, kelas: string | null) => {
  const normalizedKelas = kelas ? kelas.replace(/\D/g, '') || 'umum' : 'umum';
  return `tonsea_progress_categories_${username}_${normalizedKelas}`;
};

const formatKelasLabel = (kelas: string | null) => {
  if (!kelas) return 'Semua Kelas';
  const normalized = kelas.replace(/\D/g, '');
  return normalized ? `Kelas ${normalized}` : kelas;
};

const safePercentage = (part: number, total: number) => {
  if (!total) return 0;
  return Math.min(100, Math.round((part / total) * 100));
};

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [materialProgress, setMaterialProgress] = useState({ completed: 0, total: 0 });
  const [stats, setStats] = useState({ totalQuizzes: 0, bestScore: 0, latestScore: 0, totalQuestions: 0, streak: 0 });

  const session = useState(() => {
    if (typeof window === 'undefined') {
      return {
        username: null as string | null,
        kelas: null as string | null,
        adminRole: '',
        userRole: 'siswa',
      };
    }

    return {
      username: localStorage.getItem("tonsea_user"),
      kelas: localStorage.getItem("tonsea_user_kelas"),
      admin: localStorage.getItem("tonsea_admin"),
      adminRole: (localStorage.getItem("tonsea_admin_role") || "").toLowerCase(),
      userRole: (localStorage.getItem("tonsea_user_role") || "siswa").toLowerCase(),
    };
  })[0];

  const kelasLabel = formatKelasLabel(session.kelas);
  const materialProgressPercent = safePercentage(materialProgress.completed, materialProgress.total);
  const quizBestPercent = safePercentage(stats.bestScore, stats.totalQuestions);
  const savedUser = session.username;
  const userKelas = session.kelas;

  useEffect(() => {
    // Pastikan pengecekan dari sisi klien
    if (typeof window !== "undefined") {
      const adminRole = (session.adminRole || "").toLowerCase();
      if (session.admin) {
        if (adminRole === "guru") {
          router.replace("/guru");
          return;
        }

        if (adminRole === "admin") {
          router.replace("/admin");
          return;
        }
      }

      if (!savedUser) {
        router.replace("/login");
        return;
      }

      if (session.userRole !== "siswa") {
        router.replace("/login");
        return;
      }

      // Lanjut fetch data jika user sudah login
      fetch(`/api/scores?username=${encodeURIComponent(savedUser)}`)
        .then(res => res.json())
        .then(data => {
          if (data.data) setStats(data.data);
        })
        .catch(console.error);

      // Fungsi untuk memuat kategori dengan filter kelas
      const loadCategories = (kelasFilter: string | null, usernameValue: string) => {
        let categoriesUrl = '/categories';
        if (kelasFilter) {
          categoriesUrl += `?kelas=${kelasFilter}`;
        }

        api.get(categoriesUrl)
          .then(res => {
            const data = res.data.data || res.data;
            setCategories(data);
            const progressKey = getProgressKey(usernameValue, kelasFilter);
            let completedSlugs: string[] = [];

            try {
              const storedProgress = localStorage.getItem(progressKey);
              completedSlugs = storedProgress ? JSON.parse(storedProgress) : [];
            } catch {
              completedSlugs = [];
            }

            const availableSlugs = new Set((data as Category[]).map((category) => category.slug));
            const completedCount = completedSlugs.filter((slug) => availableSlugs.has(slug)).length;
            setMaterialProgress({ completed: completedCount, total: (data as Category[]).length });
            setLoading(false);
          })
          .catch(err => {
            console.error("Gagal ambil data:", err);
            setError("Gagal memuat kategori.");
            setLoading(false);
          });
      };

     const currentUsername: string = savedUser;

      if (!userKelas) {
        // Fallback: Jika di localstorage tak ada kelas, kita ambil dari database
        fetch(`/api/admin/users`)
          .then(res => res.json())
          .then((users: DashboardUser[]) => {
            const currentUser = users.find((u) => u.username === currentUsername);
            if (currentUser && currentUser.kelas) {
              localStorage.setItem("tonsea_user_kelas", currentUser.kelas);
              loadCategories(currentUser.kelas, currentUsername);
            } else {
              loadCategories(null, currentUsername);
            }
          })
          .catch(() => loadCategories(null, currentUsername));
      } else {
        loadCategories(userKelas, currentUsername);
      }
    }
  }, [router, session, savedUser, userKelas]);

  if (!session.username) {
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
          </div>
        </div>

        {/* Aksesoris Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </section>

      {/* Progress Cards */}
      <section className="max-w-6xl mx-auto py-16 px-8 w-full">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 whitespace-nowrap">Progress Belajar</h2>
          <div className="h-[2px] w-full bg-slate-200"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 italic">Menyiapkan ringkasan progress...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Layers3 size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Materi selesai</p>
                    <h3 className="text-2xl font-black text-slate-900">{materialProgress.completed}/{materialProgress.total}</h3>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">{materialProgressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${materialProgressPercent}%` }} />
              </div>
              <p className="mt-4 text-sm text-slate-500">{kelasLabel} mengikuti materi yang sudah ditandai selesai.</p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                    <Gamepad2 size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Kuis dikerjakan</p>
                    <h3 className="text-2xl font-black text-slate-900">{stats.totalQuizzes}x</h3>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-500">Aktif</span>
              </div>
              <p className="text-sm text-slate-500">Nilai terakhir {stats.latestScore}/{stats.totalQuestions || 0}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Clock3 size={16} className="text-slate-400" />
                Streak belajar {stats.streak} hari
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Skor terbaik</p>
                    <h3 className="text-2xl font-black text-slate-900">{stats.bestScore}/{stats.totalQuestions || 0}</h3>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">{quizBestPercent}%</span>
              </div>
              <p className="text-sm text-slate-500">Rata-rata performa kuis akan mengikuti data skor terbaru siswa.</p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${quizBestPercent}%` }} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                    <Flame size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Kelas aktif</p>
                    <h3 className="text-2xl font-black text-slate-900">{kelasLabel}</h3>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-500">{categories.length} topik</span>
              </div>
              <p className="text-sm text-slate-500">Siswa kelas {session.kelas?.replace(/\D/g, '') || '-'} melihat konten yang disesuaikan oleh guru.</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
