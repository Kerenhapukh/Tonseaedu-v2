"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Plus, Search, ShieldCheck, Trash2, User } from "lucide-react";
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

export default function GuruStudentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>(emptyForm);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "guru") {
      router.replace("/login");
      return;
    }
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      const siswa = Array.isArray(data) ? data.filter((u: any) => (u.role || "").toLowerCase() === "siswa") : [];
      setStudents(siswa);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (siswa: Siswa | null = null) => {
    setErrorMsg("");
    if (siswa) {
      setEditId(siswa.id);
      setFormData({ username: siswa.username, password: "", name: siswa.name || siswa.namaLengkap || "", kelas: siswa.kelas || "" });
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
      const payload: any = {
        username: formData.username.trim(),
        name: formData.name.trim(),
        role: "siswa",
        kelas: formData.kelas || null,
      };

      if (formData.password && formData.password.trim()) payload.password = formData.password.trim();
      else if (!editId) throw new Error("Password wajib diisi untuk siswa baru");

      const url = editId ? `/api/admin/users/${editId}` : "/api/admin/users";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan siswa");

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditId(null);
      await fetchStudents();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus akun siswa ini?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) await fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => students.filter((s) => {
    const username = s.username.toLowerCase();
    const name = (s.name || s.namaLengkap || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return username.includes(q) || name.includes(q);
  }), [students, searchQuery]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_24%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] px-4 py-6 md:px-8 md:py-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link href="/guru" className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <ShieldCheck size={14} />
                  Guru / Pengelola Pembelajaran
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">Kelola Siswa</h1>
                <p className="mt-3 max-w-2xl text-slate-600 leading-7">Tambah, ubah, dan hapus akun siswa untuk keperluan pembelajaran.</p>
              </div>
            </div>

           <button onClick={() => handleOpenForm(null)} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:bg-slate-800 transition-all">
              <Plus size={16} /> Tambah Siswa
            </button>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input type="text" placeholder="Cari username atau nama siswa..." className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        {isFormOpen && (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">{editId ? "Edit Siswa" : "Tambah Siswa"}</h2>
                <p className="text-sm text-slate-500">Buat akun siswa baru untuk diakses oleh peserta didik.</p>
              </div>
            </div>

            {errorMsg && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input required type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas</label>
                <select
                  required
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                >
                  <option value="">Pilih kelas siswa</option>
                  {KELAS_OPTIONS.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      Kelas {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 mt-2 flex flex-col gap-3 md:flex-row">
                <button type="submit" disabled={submitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60">{submitting ? "Menyimpan..." : (editId ? "Perbarui Siswa" : "Tambah Siswa")}</button>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditId(null); setFormData(emptyForm); }} className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200"><p className="text-slate-500">Belum ada siswa.</p></div>
            ) : (
              filtered.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border">
                  <div>
                    <div className="font-bold text-slate-800">{s.namaLengkap || s.name || s.username}</div>
                    <div className="text-sm text-slate-500">{s.username} {s.kelas ? `• Kelas ${s.kelas}` : null}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenForm(s)} className="p-2 rounded-md bg-slate-50 border hover:bg-slate-100"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-md bg-rose-50 border hover:bg-rose-100 text-rose-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
