"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Settings2, ShieldCheck, Users } from "lucide-react";

const adminModules = [
  {
    href: "/admin/kosakata",
    icon: BookOpen,
    title: "Kelola Kosakata",
    description: "Tambah, ubah, dan hapus kosakata beserta audio pelafalan.",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    href: "/admin/guru",
    icon: Users,
    title: "Kelola Guru",
    description: "Atur akun admin/guru yang punya akses ke sistem.",
    accent: "from-slate-900 to-slate-700",
  },
];

async function logoutAdmin() {
  await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => null);
  localStorage.removeItem("tonsea_user");
  localStorage.removeItem("tonsea_admin");
  localStorage.removeItem("tonsea_user_name");
  localStorage.removeItem("tonsea_user_kelas");
}

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("tonsea_admin")) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace("/");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] text-slate-800 px-6 py-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="flex flex-col gap-6 p-8 lg:p-10 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/70">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck size={14} />
                Admin / Pengelola Sistem
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="p-8 lg:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              {adminModules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.href}
                    href={module.href}
                    className="group rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.accent} text-white flex items-center justify-center shadow-lg shadow-slate-900/10`}>
                      <Icon size={26} />
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      <Settings2 size={14} />
                      Akses Admin
                    </div>
                    <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                      {module.title}
                    </h2>
                    <p className="mt-3 text-slate-600 leading-7">
                      {module.description}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
                      Buka halaman
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
