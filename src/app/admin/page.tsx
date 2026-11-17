"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Users,
  ChevronRight,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const adminModules = [
  {
    href: "/admin/students",
    icon: GraduationCap,
    title: "Kelola Siswa",
    description: "Tambah, ubah, dan hapus akun siswa serta atur kelas pembelajaran.",
    accent: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-500/10 text-blue-600",
    ring: "hover:ring-blue-200",
    badge: "Siswa",
    badgeColor: "bg-blue-50 text-blue-700",
  },
  {
    href: "/admin/guru",
    icon: Users,
    title: "Kelola Guru",
    description: "Atur akun admin dan guru yang memiliki akses ke sistem pengelolaan.",
    accent: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/10 text-violet-600",
    ring: "hover:ring-violet-200",
    badge: "Pengguna",
    badgeColor: "bg-violet-50 text-violet-700",
  },
  {
    href: "/admin/kosakata",
    icon: BookOpen,
    title: "Kelola Kosakata",
    description: "Tambah, ubah, dan hapus kosakata beserta audio pelafalan Tonsea.",
    accent: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    ring: "hover:ring-emerald-200",
    badge: "Kosakata",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const ready = status === "authenticated" && session?.user?.role === "admin";
  const name = session?.user?.namaLengkap ?? session?.user?.username ?? "Admin";

  useEffect(() => {
    if (status === "loading") return;
    if (!ready) router.replace("/login");
  }, [status, ready, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-slate-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* ── Latar belakang alami ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Tekstur halus grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {/* Gradien blob lembut */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-blue-200/30 blur-[90px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-indigo-200/25 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] rounded-full bg-teal-200/20 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 lg:px-10">
        {/* ── Header ── */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm mb-3">
              <ShieldCheck size={13} className="text-blue-600" />
              Administrator
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Halo, {name} 
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut size={15} />
            Logout
          </button>
        </header>

        {/* ── Banner selamat datang ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">
              Sistem Pembelajaran<br />
              <span className="text-blue-300">Bahasa Tonsea</span>
            </h2>
          </div>
        </div>
        {/* ── Kartu Menu ── */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {adminModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ring-1 ring-transparent ${mod.ring} flex flex-col justify-between`}
              >
                {/* Strip warna atas */}
                <div className={`absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r ${mod.accent}`} />

                <div>
                  {/* Badge kategori */}
                  <div className="flex items-center justify-between mb-5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                    <div className={`h-11 w-11 flex items-center justify-center rounded-2xl ${mod.iconBg}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {mod.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Buka halaman
                  <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
