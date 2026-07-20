"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookOpen, FileText, LogOut, ShieldCheck, Users } from "lucide-react";

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] px-6 py-10 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                <ShieldCheck size={14} />
                Guru / Pengelola Pembelajaran
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Dashboard Guru
              </h1>
              <p className="mt-2 max-w-xl text-slate-600">
                Kelola siswa, lihat hasil kuis, serta atur kuis dan materi pembelajaran dari satu tempat.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all w-fit"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Bento Grid Menu */}
        <div className="grid gap-5 md:grid-cols-3">

          {/* Featured / Card besar */}
          <Link
            href="/admin/scores"
            className="group relative md:col-span-2 md:row-span-2 overflow-hidden rounded-[2rem] bg-slate-900 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-1"
          >
            {/* Dekorasi blob */}
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between min-h-[260px] md:min-h-[340px]">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 mb-6">
                  <FileText size={28} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                  Lihat Hasil Kuis Siswa
                </h3>
                <p className="mt-3 max-w-md text-slate-300 leading-relaxed">
                  Pantau skor dan rekap nilai siswa secara real-time setelah mereka mengerjakan kuis, difilter per kelas.
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 group-hover:gap-3 transition-all">
                Buka rekap nilai
                <ArrowUpRight size={16} />
              </div>
            </div>
          </Link>

          {/* Kelola Siswa */}
          <Link
            href="/guru/students"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600 rounded-r-full" />
            <div className="pl-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-black text-slate-950">Kelola Siswa</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Tambahkan, edit, atau hapus akun siswa.
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                Kelola
                <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Kelola Kuis */}
          <Link
            href="/admin/questions"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500 rounded-r-full" />
            <div className="pl-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
                <BookOpen size={22} />
              </div>
              <h3 className="text-lg font-black text-slate-950">Kelola Kuis</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Tambah, ubah, dan hapus kuis yang digunakan siswa.
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                Kelola
                <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Kelola Materi - full width bawah */}
          <Link
            href="/admin/materi"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:col-span-3 md:flex md:items-center md:justify-between"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-orange-500 rounded-b-full md:hidden" />
            <div className="absolute inset-y-0 left-0 hidden w-1.5 bg-orange-500 rounded-r-full md:block" />
            <div className="pl-2 flex items-center gap-5">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">Kelola Materi</h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                  Atur materi pembelajaran yang menjadi acuan kuis dan aktivitas belajar siswa.
                </p>
              </div>
            </div>
            <div className="mt-4 pl-2 md:mt-0 md:pl-0 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 group-hover:gap-2.5 transition-all shrink-0">
              Kelola
              <ArrowUpRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
