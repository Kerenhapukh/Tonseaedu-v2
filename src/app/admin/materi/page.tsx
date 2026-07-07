"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

interface Materi {
  id: number;
  title: string;
  content: string;
  kelas?: string;
  category?: Category;
  categoryId: number;
}

export default function AdminMateriPage() {
  const router = useRouter();
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const isGuru = role.toLowerCase() === 'guru';
  
  // State form tambah materi
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', categoryId: '', kelas: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchMateri = async () => {
    try {
      const [resMateri, resCat] = await Promise.all([
        fetch('/api/materi'),
        fetch('/api/categories')
      ]);
      const dataMateri = await resMateri.json();
      const dataCat = await resCat.json();
      
      setMateriList(dataMateri.data || dataMateri);
      setCategories(dataCat.data || dataCat);
    } catch (error) {
      console.error("Gagal mengambil data materi:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.categoryId) {
      return alert("Mohon lengkapi semua kolom!");
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
          categoryId: formData.categoryId,
          kelas: formData.kelas
        })
      });
      
      if (res.ok) {
        alert(isEditing ? "Materi berhasil diperbarui!" : "Materi berhasil ditambahkan!");
        setFormData({ title: '', content: '', categoryId: '', kelas: '' });
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        fetchMateri(); // Refresh data
      } else {
        throw new Error(isEditing ? "Gagal memperbarui materi" : "Gagal menambah materi");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (materi: Materi) => {
    setFormData({
      title: materi.title,
      content: materi.content,
      categoryId: materi.categoryId.toString(),
      kelas: materi.kelas || '',
    });
    setEditId(materi.id);
    setIsEditing(true);
    setShowForm(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormData({ title: '', content: '', categoryId: '', kelas: '' });
      setIsEditing(false);
      setEditId(null);
    }
  };

  // Fitur hapus sementara (membutuhkan rute delete di API nanti)
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;
    try {
      const res = await fetch(`/api/materi/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Materi berhasil dihapus!");
        fetchMateri();
      } else {
        throw new Error("Gagal menghapus materi");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 mt-20">Memuat data materi...</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_42%,_#eef2ff_100%)] p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10">
          <Link
            href={isGuru ? "/guru" : "/admin"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit"
          >
            <ArrowLeft size={16} /> {isGuru ? "Kembali ke Dasbor Guru" : "Kembali ke Dasbor Admin"}
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                <BookOpen size={14} />
                Kelola Materi
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Kelola Materi Pembelajaran
              </h1>
              <p className="mt-2 text-slate-600">
                Total: {materiList.length} materi tersedia
              </p>
            </div>

            <button 
              onClick={resetForm}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 ${
                showForm 
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none" 
                  : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800"
              }`}
            >
              {showForm ? "Batal" : <><Plus size={18} /> Tambah Materi Baru</>}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total Materi</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{materiList.length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi pembelajaran yang tersimpan</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kategori</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{categories.length}</p>
            <p className="mt-1 text-sm text-slate-500">Pilihan kategori yang aktif</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Akses</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 capitalize">{role || 'Admin'}</p>
            <p className="mt-1 text-sm text-slate-500">Mode tampilan saat ini</p>
          </div>
        </div>

        {/* Form Tambah Materi */}
        {showForm && (
          <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_70px_rgba(15,23,42,0.08)] border border-slate-200 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-xl font-bold text-slate-900">{isEditing ? "Edit Materi" : "Buat Materi Baru"}</h2>
              <p className="text-sm text-slate-500">Isi data di bawah dengan format yang rapi agar materi mudah dibaca dan dikelola.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Judul Materi</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Contoh: Pengenalan Angka 1-10"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                  <select 
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kelas (Opsional)</label>
                  <select 
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.kelas}
                    onChange={e => setFormData({...formData, kelas: e.target.value})}
                  >
                    <option value="">-- Berlaku untuk Semua --</option>
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Isi Materi</label>
                <textarea 
                  className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[170px] transition-all"
                  placeholder="Tuliskan isi materi pelajaran di sini..."
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10"
                >
                  {submitting ? "Menyimpan..." : isEditing ? "Perbarui Materi" : "Simpan Materi"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Daftar Materi */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cuplikan Isi</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materiList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-600">Belum ada materi pembelajaran yang ditambahkan.</p>
                          <p className="text-sm text-slate-400 mt-1">Gunakan tombol Tambah Materi Baru untuk mulai mengisi daftar.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materiList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors align-top">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 leading-snug">{m.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">
                          {m.category?.name || 'Tidak ada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">
                          {m.kelas ? `Kelas ${m.kelas}` : 'Umum'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-500 line-clamp-2 max-w-md leading-relaxed">
                          {m.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleEditClick(m)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2.5 rounded-xl transition-colors"
                            title="Edit Materi"
                          >
                            <BookOpen size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(m.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl transition-colors"
                            title="Hapus Materi"
                          >
                            <Trash2 size={18} />
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
