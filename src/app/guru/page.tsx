"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users, FileText, CheckSquare } from "lucide-react";

async function logoutAll() {
  await fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => null);
  localStorage.removeItem('tonsea_admin');
  localStorage.removeItem('tonsea_admin_role');
  localStorage.removeItem('tonsea_user');
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
            <p className="text-slate-600">Kelola siswa, buat kuis, pilih kosakata/materi, dan lihat hasil.</p>
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
                <h3 className="text-xl font-bold">Kelola Akun Siswa</h3>
                <p className="text-sm text-slate-500">Tambahkan, edit, atau hapus akun siswa.</p>
              </div>
            </div>
          </Link>

          <Link href="/guru/create" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-3 rounded-xl text-green-600"><FileText /></div>
              <div>
                <h3 className="text-xl font-bold">Buat Kuis / Soal</h3>
                <p className="text-sm text-slate-500">Susun soal baru dari materi atau kosakata yang tersedia.</p>
              </div>
            </div>
          </Link>

          <Link href="/kosakata" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><CheckSquare /></div>
              <div>
                <h3 className="text-xl font-bold">Pilih Kosakata / Materi</h3>
                <p className="text-sm text-slate-500">Pilih kosakata atau materi untuk dijadikan soal kuis.</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/scores" className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600"><FileText /></div>
              <div>
                <h3 className="text-xl font-bold">Lihat Hasil Kuis Siswa</h3>
                <p className="text-sm text-slate-500">Pantau skor dan rekap nilai siswa setelah mereka mengerjakan kuis.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
