"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Materi {
  id: number;
  title: string;
  content: string;
  bab?: string | null;
  ringkasan?: string | null;
  kelas?: string | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

const KELAS_ORDER = ['7', '8', '9', 'umum'];

const normalizeKelas = (kelas?: string | null) => {
  if (!kelas) return 'umum';
  const onlyNumber = kelas.replace(/\D/g, '');
  return onlyNumber || 'umum';
};

export default function AdminMateriPage() {
  const router = useRouter();
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const isGuru = role.toLowerCase() === 'guru';

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kelas: '',
    bab: '',
    title: '',
    ringkasan: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => null);
    localStorage.removeItem('tonsea_admin');
    localStorage.removeItem('tonsea_admin_role');
    localStorage.removeItem('tonsea_user');
    localStorage.removeItem('tonsea_user_role');
    localStorage.removeItem('tonsea_user_kelas');
    router.replace('/');
  };

 const fetchMateri = async () => {
  try {
    const resMateri = await fetch('/api/materi');
    const dataMateri = await resMateri.json();
    const list = Array.isArray(dataMateri?.data)
      ? dataMateri.data
      : Array.isArray(dataMateri)
      ? dataMateri
      : [];
    setMateriList(list);
  } catch (error) {
    console.error('Gagal mengambil data materi:', error);
    setMateriList([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const currentRole = (localStorage.getItem('tonsea_admin_role') || '').toLowerCase();
    setRole(currentRole);
    const isPrivileged = !!localStorage.getItem('tonsea_admin') && (currentRole === 'admin' || currentRole === 'guru');
    if (!isPrivileged) {
      router.replace('/login');
      return;
    }

    fetchMateri();
  }, [router]);

  const groupedMateri = useMemo(() => {
    const groups: Record<string, Materi[]> = {
      '7': [],
      '8': [],
      '9': [],
      umum: [],
    };

    materiList.forEach((materi) => {
      const key = normalizeKelas(materi.kelas);
      if (!groups[key]) {
        groups.umum.push(materi);
        return;
      }
      groups[key].push(materi);
    });

    return groups;
  }, [materiList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kelas || !formData.bab || !formData.title || !formData.ringkasan || !formData.content) {
      return alert('Mohon lengkapi kelas, bab, judul, ringkasan, dan isi materi!');
    }

    setSubmitting(true);
    try {
      const url = isEditing && editId ? `/api/materi/${editId}` : '/api/materi';
      const method = isEditing && editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: formData.title,
          konten: formData.content,
          kelas: formData.kelas,
          bab: formData.bab,
          ringkasan: formData.ringkasan,
        }),
      });

      if (res.ok) {
        alert(isEditing ? 'Materi berhasil diperbarui!' : 'Materi berhasil ditambahkan!');
        setFormData({ kelas: '', bab: '', title: '', ringkasan: '', content: '' });
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        fetchMateri();
      } else {
        throw new Error(isEditing ? 'Gagal memperbarui materi' : 'Gagal menambah materi');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (materi: Materi) => {
    setFormData({
      kelas: materi.kelas || '',
      bab: materi.bab || '',
      title: materi.title,
      ringkasan: materi.ringkasan || materi.content,
      content: materi.content,
    });
    setEditId(materi.id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormData({ kelas: '', bab: '', title: '', ringkasan: '', content: '' });
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;
    try {
      const res = await fetch(`/api/materi/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Materi berhasil dihapus!');
        fetchMateri();
      } else {
        throw new Error('Gagal menghapus materi');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renderMateriCard = (materi: Materi) => (
    <article key={materi.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          Kelas {normalizeKelas(materi.kelas) === 'umum' ? 'Umum' : normalizeKelas(materi.kelas)}
        </span>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          {materi.bab || 'BAB belum diisi'}
        </span>
      </div>

      <h3 className="text-lg font-black text-slate-950 leading-tight">{materi.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4">
        {materi.ringkasan || materi.content}
      </p>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          onClick={() => handleEditClick(materi)}
          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={() => handleDelete(materi.id)}
          className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
          Hapus
        </button>
      </div>
    </article>
  );

  if (loading) return <div className="p-8 text-center text-slate-500 mt-20">Memuat data materi...</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_42%,_#eef2ff_100%)] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Link
                href={isGuru ? '/guru' : '/admin'}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit"
              >
                <ArrowLeft size={16} /> {isGuru ? 'Kembali ke Dasbor Guru' : 'Kembali ke Dasbor Admin'}
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                  <BookOpen size={14} />
                  Kelola Materi
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                  Materi per Kelas
                </h1>
                <p className="mt-2 text-slate-600">
                  Setiap materi diatur per kelas, bab, judul, dan ringkasan singkat.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={resetForm}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 ${
                  showForm
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none'
                    : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800'
                }`}
              >
                <Plus size={18} />
                {showForm ? 'Tutup Form' : 'Tambah Materi Baru'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total Materi</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{materiList.length}</p>
            <p className="mt-1 text-sm text-slate-500">Semua materi yang tersimpan</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kelas 7</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{groupedMateri['7'].length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi khusus kelas 7</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kelas 8</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{groupedMateri['8'].length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi khusus kelas 8</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kelas 9</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{groupedMateri['9'].length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi khusus kelas 9</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_70px_rgba(15,23,42,0.08)] border border-slate-200 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Materi' : 'Buat Materi Baru'}</h2>
              <p className="text-sm text-slate-500">Isi data materi per kelas agar mudah dipisahkan saat ditampilkan ke siswa.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  >
                    <option value="">-- Pilih Kelas --</option>
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Bab</label>
                  <input
                    type="text"
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Contoh: BAB 4"
                    value={formData.bab}
                    onChange={(e) => setFormData({ ...formData, bab: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Judul Materi</label>
                <input
                  type="text"
                  className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Contoh: Pengantar Sistem Komputer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all"
                  placeholder="Tuliskan ringkasan singkat materi di sini..."
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Isi Materi</label>
                <textarea
                  className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[170px] transition-all"
                  placeholder="Tuliskan isi materi pelajaran di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10"
                >
                  {submitting ? 'Menyimpan...' : isEditing ? 'Perbarui Materi' : 'Simpan Materi'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {KELAS_ORDER.map((kelasKey) => {
            const items = groupedMateri[kelasKey] || [];
            const label = kelasKey === 'umum' ? 'Materi Umum' : `Kelas ${kelasKey}`;

            return (
              <section key={kelasKey} className="rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">{label}</h2>
                    <p className="text-sm text-slate-500">{items.length} materi tersedia</p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {kelasKey === 'umum' ? 'Tidak terikat kelas' : `Filter ${label}`}
                  </span>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                  {items.length === 0 ? (
                    <div className="col-span-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                      Belum ada materi untuk {label}.
                    </div>
                  ) : (
                    items.map(renderMateriCard)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
