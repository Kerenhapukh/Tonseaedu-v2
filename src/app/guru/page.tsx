"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, LogOut, Users } from "lucide-react";

async function logoutAll() {
  await fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => null);
  localStorage.removeItem('tonsea_admin');
  localStorage.removeItem('tonsea_admin_role');
  localStorage.removeItem('tonsea_user');
  localStorage.removeItem('tonsea_user_role');
  localStorage.removeItem('tonsea_user_name');
  localStorage.removeItem('tonsea_user_kelas');
}

export default function GuruDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('tonsea_admin_role') || '';
    const isAdmin = !!localStorage.getItem('tonsea_admin');
    if (!isAdmin || role.toLowerCase() !== 'guru') {
      router.replace('/login');
      return;
    }
  }, [router]);

  const handleLogout = async () => {
    await logoutAll();
    router.replace('/');
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Guru</h1>
            <p className="text-slate-600">Kelola siswa, lihat hasil kuis, serta atur kuis dan materi pembelajaran.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/guru/students" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users /></div>
              <div>
                <h3 className="text-xl font-bold">Kelola Siswa</h3>
                <p className="text-sm text-slate-500">Tambahkan, edit, atau hapus akun siswa.</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/scores" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><FileText /></div>
              <div>
                <h3 className="text-xl font-bold">Lihat Hasil Kuis Siswa</h3>
                <p className="text-sm text-slate-500">Pantau skor dan rekap nilai siswa setelah mereka mengerjakan kuis.</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/questions" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><BookOpen /></div>
              <div>
                <h3 className="text-xl font-bold">Kelola Kuis</h3>
                <p className="text-sm text-slate-500">Tambah, ubah, dan hapus kuis yang digunakan di kuis siswa.</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/materi" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-violet-50 p-3 rounded-xl text-violet-600"><BookOpen /></div>
              <div>
                <h3 className="text-xl font-bold">Kelola Materi</h3>
                <p className="text-sm text-slate-500">Atur materi pembelajaran yang menjadi acuan kuis dan aktivitas belajar.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
