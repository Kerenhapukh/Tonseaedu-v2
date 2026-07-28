"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ShieldCheck, User, UserRound, Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "guru" | "siswa">("siswa");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialRole = searchParams.get("role");
    if (initialRole === "admin" || initialRole === "guru" || initialRole === "siswa") {
      setRole(initialRole);
    }

    const savedAdminRole = (localStorage.getItem("tonsea_admin_role") || "").toLowerCase();
    if (localStorage.getItem("tonsea_admin")) {
      if (savedAdminRole === "guru") {
        router.replace("/guru");
        return;
      }

      if (savedAdminRole === "admin") {
        router.replace("/admin");
        return;
      }
    }

    if (localStorage.getItem("tonsea_user")) {
      router.replace("/materi");
    }
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "siswa") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: identifier.trim(), password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Username / Password salah!");
        }

        localStorage.removeItem("tonsea_admin");
        localStorage.removeItem("tonsea_admin_role");
        localStorage.setItem("tonsea_user", data.user.username);
        localStorage.setItem("tonsea_user_role", data.user.role || "siswa");
        if (data.user.name) {
          localStorage.setItem("tonsea_user_name", data.user.name);
        }
        if (data.user.kelas) {
          localStorage.setItem("tonsea_user_kelas", data.user.kelas);
        }
        router.push("/materi");
        return;
      }

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Email / kata sandi ${role} salah!`);
      }

      localStorage.removeItem("tonsea_user");
      localStorage.removeItem("tonsea_user_role");
      localStorage.removeItem("tonsea_user_name");
      localStorage.removeItem("tonsea_user_kelas");
      localStorage.setItem("tonsea_admin", data.user.username || identifier.trim());
      localStorage.setItem("tonsea_admin_role", data.user.role || role);
      if (data.user.namaLengkap) {
        localStorage.setItem("tonsea_user_name", data.user.namaLengkap);
      }
      router.push(data.user.role === "guru" ? "/guru" : "/admin");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role === "siswa" ? "Siswa" : role === "guru" ? "Guru" : "Admin";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Gambar Background Foto Halaman Login */}
      <img 
        src="/images/login-bg.jpg" 
        alt="Latar Belakang Login TonseaEdu" 
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none scale-105 animate-[pulse_10s_infinite]"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Overlay Gradients & Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-950/60 to-slate-950/80 z-[1]" />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-[2]" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none z-[2]" />

      <div className="max-w-md w-full grid grid-cols-1 rounded-[2.5rem] overflow-hidden border border-white/20 bg-white/95 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] relative z-10">
        

        <div className="p-7 sm:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="bg-blue-600 w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">TonseaEdu</h1>
              {/* Deskripsi singkat mobile dihilangkan sesuai permintaan */}
            </div>
          </div>

          <div className="mb-8 grid grid-cols-3 rounded-[1.4rem] bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex items-center justify-center gap-2 rounded-[1rem] py-3 text-sm font-bold transition-all ${
                role === "admin" ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck size={16} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("guru")}
              className={`flex items-center justify-center gap-2 rounded-[1rem] py-3 text-sm font-bold transition-all ${
                role === "guru" ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserRound size={16} />
              Guru
            </button>
            <button
              type="button"
              onClick={() => setRole("siswa")}
              className={`flex items-center justify-center gap-2 rounded-[1rem] py-3 text-sm font-bold transition-all ${
                role === "siswa" ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User size={16} />
              Siswa
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                {role === "siswa" ? "Username / Nama Lengkap" : "Email / Username"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  role === "siswa"
                    ? "Masukkan username atau nama lengkap..."
                    : role === "guru"
                      ? "Masukkan email guru..."
                      : "Masukkan email atau username admin..."
                }
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-950 font-bold placeholder:text-slate-400"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={role === "siswa" ? "Masukkan kata sandi siswa..." : "Masukkan kata sandi akun..."}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-950 font-bold placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {role === "guru" && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-600">
                Belum punya akun guru? <Link href="/register" className="font-semibold text-blue-700 hover:text-blue-800">Daftar guru</Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !identifier || !password}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl font-extrabold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none flex justify-center items-center mt-4"
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : role === "siswa" ? (
                "Masuk Siswa"
              ) : role === "guru" ? (
                "Masuk Guru"
              ) : (
                "Masuk Admin"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
