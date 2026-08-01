"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ShieldCheck, User, UserRound, Eye, EyeOff } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "guru" | "siswa">("siswa");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialRole = searchParams.get("role");
    if (initialRole === "admin" || initialRole === "guru" || initialRole === "siswa") {
      setRole(initialRole);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.role) return;
    const currentRole = session.user.role;
    router.replace(currentRole === "admin" ? "/admin" : currentRole === "guru" ? "/guru" : "/materi");
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier: identifier.trim(),
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        alert(result.code || "Terjadi kesalahan.");
        return;
      }

      // Hard navigation: memastikan halaman tujuan mengambil session yang baru
      // dari server, bukan cache useSession() lama sebelum login.
      window.location.href = role === "siswa" ? "/materi" : role === "guru" ? "/guru" : "/admin";
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role === "siswa" ? "Siswa" : role === "guru" ? "Guru" : "Admin";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-center items-center bg-slate-950 px-4 py-8 sm:py-12 relative overflow-x-hidden">
      {/* Gambar Background Foto Halaman Login (Fixed inset-0 agar tidak terpotong di layar HP maupun laptop) */}
      <img 
        src="/images/login-bg.jpg" 
        alt="Latar Belakang Login TonseaEdu" 
        className="fixed inset-0 w-full h-[100dvh] object-cover object-center opacity-40 pointer-events-none scale-100 sm:scale-105 transition-all duration-700"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Overlay Gradients & Glow (Fixed 100dvh) */}
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-950/95 via-slate-950/70 to-slate-950/85 pointer-events-none z-[1]" />
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-[2]" />
      <div className="fixed bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-[2]" />

      <div className="max-w-sm sm:max-w-md w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/20 bg-white/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] relative z-10 my-auto">
        <div className="p-5 sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-blue-600 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">TonseaEdu</h1>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">Masuk ke platform pembelajaran</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 rounded-2xl bg-slate-100 p-1 gap-1">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all ${
                role === "admin" ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck size={15} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("guru")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all ${
                role === "guru" ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserRound size={15} />
              Guru
            </button>
            <button
              type="button"
              onClick={() => setRole("siswa")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all ${
                role === "siswa" ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User size={15} />
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
