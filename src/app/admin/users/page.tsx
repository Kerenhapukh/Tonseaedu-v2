"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Pencil, Plus, Search, ShieldCheck, Trash2, UserCog } from "lucide-react";

type Guru = {
  id: number;
  username: string;
  name?: string;
  namaLengkap?: string;
  role?: string;
  kelas?: string | null;
};

const emptyForm = {
  username: "",
  password: "",
  name: "",
};

async function logoutAdmin() {
  await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => null);
  localStorage.removeItem("tonsea_user");
  localStorage.removeItem("tonsea_user_role");
  localStorage.removeItem("tonsea_admin");
  localStorage.removeItem("tonsea_user_name");
  localStorage.removeItem("tonsea_user_kelas");
}

export default function AdminGuruPage() {
  const router = useRouter();
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const role = (localStorage.getItem("tonsea_admin_role") || "").toLowerCase();
    if (!localStorage.getItem("tonsea_admin") || role !== "admin") {
      router.replace("/login");
      return;
    }

    fetchGurus();
  }, [router]);

  const fetchGurus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      const adminUsers = Array.isArray(data)
        ? data.filter((user: Guru) => user.role === "admin" || user.role === "guru")
        : [];
      setGurus(adminUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (guru: Guru | null = null) => {
    setErrorMsg("");
    if (guru) {
      setEditId(guru.id);
      setFormData({
        username: guru.username,
        password: "",
        name: guru.name || guru.namaLengkap || "",
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
      const payload: Record<string, string> = {
        username: formData.username.trim(),
        name: formData.name.trim(),
        role: "guru",
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      } else if (!editId) {
        throw new Error("Password wajib diisi untuk guru baru");
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
        throw new Error(data.error || "Gagal menyimpan guru");
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditId(null);
      await fetchGurus();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus akun guru ini?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchGurus();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredGurus = useMemo(
    () =>
      gurus.filter((guru) => {
        const username = guru.username.toLowerCase();
        const name = (guru.name || guru.namaLengkap || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return username.includes(query) || name.includes(query);
      }),
    [gurus, searchQuery]
  );

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace("/");
  };

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
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link href="/admin" className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <ShieldCheck size={14} />
                  Admin / Pengelola Sistem
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                  Kelola Guru
                </h1>
                <p className="mt-3 max-w-2xl text-slate-600 leading-7">
                  Tambah, ubah, dan hapus akun admin/guru yang berhak masuk ke area pengelola sistem.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
              <button
                onClick={() => handleOpenForm(null)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all"
              >
                <Plus size={16} />
                Tambah Guru
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari username atau nama guru..."
            className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isFormOpen && (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <UserCog size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editId ? "Edit Guru" : "Tambah Guru"}
                </h2>
                <p className="text-sm text-slate-500">Role default dibuat guru agar sesuai alur registrasi.</p>
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
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password {editId && <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  required={!editId}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Menyimpan..." : editId ? "Perbarui Guru" : "Simpan Guru"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-200/70">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Daftar Guru</h2>
              <p className="text-sm text-slate-500 mt-1">Total {filteredGurus.length} akun admin/guru</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Username</th>
                  <th className="px-6 py-4 font-semibold">Nama</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGurus.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      Belum ada guru ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredGurus.map((guru) => (
                    <tr key={guru.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-950">{guru.username}</td>
                      <td className="px-6 py-4 text-slate-600">{guru.name || guru.namaLengkap || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${guru.role === "admin" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"}`}>
                          {guru.role || "guru"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenForm(guru)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(guru.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Hapus"
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
