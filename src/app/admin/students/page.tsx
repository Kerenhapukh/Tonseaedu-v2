"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";

type Siswa = {
  id: number;
  username: string;
  name?: string;
  namaLengkap?: string;
  role?: string;
  kelas?: string | null;
};

const KELAS_OPTIONS = ["7", "8", "9"];

const emptyForm = {
  username: "",
  password: "",
  name: "",
  kelas: "",
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refreshStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      const siswaList = Array.isArray(data)
        ? (data as Siswa[]).filter((u) => (u.role || "").toLowerCase() === "siswa")
        : [];
      setStudents(siswaList);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "admin") {
      router.replace("/login");
      return;
    }

    let active = true;
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const siswaList = Array.isArray(data)
          ? (data as Siswa[]).filter((u) => (u.role || "").toLowerCase() === "siswa")
          : [];
        setStudents(siswaList);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Gagal mengambil data siswa:", err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status, session, router]);

  const handleOpenForm = (siswa: Siswa | null = null) => {
    setErrorMsg("");
    if (siswa) {
      setEditId(siswa.id);
      setFormData({
        username: siswa.username,
        password: "",
        name: siswa.name || siswa.namaLengkap || "",
        kelas: siswa.kelas || "",
      });
    } else {
      setEditId(null);
      setFormData(emptyForm);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        username: formData.username.trim(),
        name: formData.name.trim(),
        role: "siswa",
        kelas: formData.kelas || null,
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      } else if (!editId) {
        throw new Error("Password wajib diisi untuk siswa baru");
      }

      const url = editId ? `/api/admin/users/${editId}` : "/api/admin/users";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan akun siswa");
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditId(null);
      await refreshStudents();
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus akun siswa ini? Data nilai dan riwayat terkait akan terpengaruh.")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshStudents();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus siswa");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const username = s.username.toLowerCase();
      const name = (s.name || s.namaLengkap || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = username.includes(query) || name.includes(query);

      const matchesKelas =
        filterKelas === "all" ||
        (s.kelas && s.kelas.replace(/\D/g, "") === filterKelas);

      return matchesSearch && matchesKelas;
    });
  }, [students, searchQuery, filterKelas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_24%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] px-4 py-6 md:px-8 md:py-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link
                href="/admin"
                className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Kembali ke Dashboard Admin"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <ShieldCheck size={14} />
                  Admin / Pengelola Sistem
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                  Kelola Siswa
                </h1>
                <p className="mt-3 max-w-2xl text-slate-600 leading-7">
                  Tambah, ubah, dan hapus akun siswa serta tentukan kelas untuk keperluan pembelajaran dan kuis.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenForm(null)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all w-fit"
            >
              <Plus size={16} />
              Tambah Siswa
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari username atau nama siswa..."
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-2">Filter Kelas:</span>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:bg-white"
            >
              <option value="all">Semua Kelas</option>
              {KELAS_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editId ? "Edit Akun Siswa" : "Tambah Akun Siswa"}
                </h2>
                <p className="text-sm text-slate-500">
                  Akun siswa digunakan untuk mengakses materi, kosakata, dan kuis.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: siswa7_budi"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password {editId && <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  required={!editId}
                  type="password"
                  placeholder={editId ? "••••••••" : "Masukkan kata sandi..."}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas</label>
                <select
                  required
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white text-sm font-medium"
                >
                  <option value="">Pilih kelas siswa</option>
                  {KELAS_OPTIONS.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      Kelas {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditId(null);
                    setFormData(emptyForm);
                  }}
                  className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Menyimpan..." : editId ? "Perbarui Siswa" : "Simpan Siswa"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Student Table */}
        <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-200/70">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Daftar Siswa</h2>
              <p className="text-sm text-slate-500 mt-1">Total {filteredStudents.length} akun siswa terdaftar</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Username</th>
                  <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 font-semibold">Kelas</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                        <Users size={22} />
                      </div>
                      <p className="font-semibold text-slate-700">Belum ada akun siswa</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {searchQuery || filterKelas !== "all"
                          ? "Tidak ada siswa yang cocok dengan filter pencarian"
                          : "Klik tombol Tambah Siswa untuk membuat akun siswa baru"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-950">{s.username}</td>
                      <td className="px-6 py-4 text-slate-600">{s.namaLengkap || s.name || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {s.kelas ? `Kelas ${s.kelas.replace(/\D/g, "") || s.kelas}` : "Belum diatur"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenForm(s)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            title="Edit Akun Siswa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Hapus Akun Siswa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
