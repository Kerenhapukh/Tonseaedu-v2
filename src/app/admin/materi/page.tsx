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
    if (!localStorage.getItem('tonsea_admin')) {
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
    <div className="p-6 md:p-10 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-6">
        <Link href="/admin/questions" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Dasbor Admin
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-blue-600" />
            Kelola Materi Pembelajaran
          </h1>
          <p className="text-slate-500 mt-1">Total: {materiList.length} materi tersedia</p>
        </div>
        
        <button 
          onClick={resetForm}
          className={`px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 ${
            showForm 
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          }`}
        >
          {showForm ? "Batal" : <><Plus size={20} /> Tambah Materi Baru</>}
        </button>
      </div>

      {/* Form Tambah Materi */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{isEditing ? "Edit Materi" : "Buat Materi Baru"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Judul Materi</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contoh: Pengenalan Angka 1-10"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
                placeholder="Tuliskan isi materi pelajaran di sini..."
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : isEditing ? "Perbarui Materi" : "Simpan Materi"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Daftar Materi */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Belum ada materi pembelajaran yang ditambahkan.
                  </td>
                </tr>
              ) : (
                materiList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{m.title}</div>
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
                      <div className="text-sm text-slate-500 line-clamp-2 max-w-xs">
                        {m.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(m)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit Materi"
                        >
                          <BookOpen size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
  );
}