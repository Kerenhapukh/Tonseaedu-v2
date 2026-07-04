"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Phone, School, User, Lock } from "lucide-react";

export default function RegisterGuruPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    namaSekolah: "",
    nomorTelepon: "",
    password: "",
    konfirmasiPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.konfirmasiPassword) {
      alert("Password dan konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Akun guru berhasil dibuat. Silakan login.");
        router.push("/login?role=guru");
      } else {
        alert(data.error || "Gagal membuat akun guru.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] px-4 py-10 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[520px] h-[520px] bg-blue-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[520px] h-[520px] bg-cyan-400 rounded-full blur-[120px] opacity-15 pointer-events-none" />

     <div className="w-full max-w-xl rounded-[2rem] overflow-hidden border border-white/10 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.35)] relative z-10">

        <div className="p-7 sm:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="bg-blue-600 w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">Registrasi Guru</h1>
              <p className="text-slate-500 text-sm">Lengkapi data untuk membuat akun</p>
            </div>
          </div>

          <div className="mb-8 rounded-[1.5rem] border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-600">
            Sudah punya akun? <Link href="/login?role=guru" className="font-semibold text-blue-700 hover:text-blue-800">Masuk di sini</Link>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-11 pr-4 py-4 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                  placeholder="Nama lengkap guru"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-11 pr-4 py-4 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2">Nama Sekolah</label>
              <div className="relative">
                <School size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.namaSekolah}
                  onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-11 pr-4 py-4 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                  placeholder="Nama sekolah"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2">Nomor Telepon <span className="font-normal normal-case tracking-normal">(opsional)</span></label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.nomorTelepon}
                  onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-11 pr-4 py-4 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                  placeholder="08xxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-11 pr-4 py-4 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="password"
                  value={formData.konfirmasiPassword}
                  onChange={(e) => setFormData({ ...formData, konfirmasiPassword: e.target.value })}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-11 pr-4 py-4 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            <div className="sm:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Daftar Guru"}
              </button>
              <Link
                href="/login?role=guru"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Kembali ke Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
