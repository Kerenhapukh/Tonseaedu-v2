"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

interface Kosakata {
  id: number;
  tonsea: string;
  indonesia: string;
  audioUrl?: string | null;
  category?: Category;
  categoryId: number;
}

export default function AdminKosakataPage() {
  const router = useRouter();
  const [kosakataList, setKosakataList] = useState<Kosakata[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State form
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Mengosongkan audio_url karena kita beralih ke upload file mentah
  const [formData, setFormData] = useState({ tonsea: '', indonesia: '', categoryName: '' });
  // State baru khusus menyimpan file audio fisik
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => null);
    localStorage.removeItem('tonsea_user');
    localStorage.removeItem('tonsea_admin');
    router.replace('/');
  };

  const fetchData = async () => {
    try {
      const resKosakata = await fetch('/api/kosakata');
      const dataKosakata = await resKosakata.json();
      
      setKosakataList(dataKosakata);
    } catch (error) {
      console.error("Gagal mengambil data kosakata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('tonsea_admin')) {
      router.replace('/login');
      return;
    }

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tonsea || !formData.indonesia || !formData.categoryName) {
      return alert("Mohon lengkapi Bahasa Tonsea, Bahasa Indonesia, dan Kategori!");
    }
    
    setSubmitting(true);
    try {
      const url = isEditing && editId ? `/api/kosakata/${editId}` : '/api/kosakata';
      const method = isEditing && editId ? 'PUT' : 'POST';

      // 1. GANTI CONVERSION JSON MENJADI FORMDATA
      const dataToSend = new FormData();
      dataToSend.append('tonsea', formData.tonsea);
      dataToSend.append('indonesia', formData.indonesia);
      dataToSend.append('categoryName', formData.categoryName);
      
      // Masukkan file audio jika guru/admin memilih berkas file baru
      if (audioFile) {
        dataToSend.append('audio', audioFile);
      }

      const res = await fetch(url, {
        method,
        // PENTING: Jangan gunakan headers 'Content-Type': 'application/json'
        body: dataToSend
      });
      
      if (res.ok) {
        alert(isEditing ? "Kosakata berhasil diperbarui!" : "Kosakata berhasil ditambahkan!");
        setFormData({ tonsea: '', indonesia: '', categoryName: '' });
        setAudioFile(null); // Reset input file audio
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        fetchData(); // Refresh data halaman
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || (isEditing ? "Gagal memperbarui kosakata" : "Gagal menambah kosakata"));
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (k: Kosakata) => {
    setFormData({
      tonsea: k.tonsea,
      indonesia: k.indonesia,
      categoryName: k.category?.name || '',
    });
    setAudioFile(null); // Kosongkan pilihan file audio sebelumnya
    setEditId(k.id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormData({ tonsea: '', indonesia: '', categoryName: '' });
      setAudioFile(null);
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kosakata ini?')) return;
    try {
      const res = await fetch(`/api/kosakata/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Kosakata berhasil dihapus!");
        fetchData();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus kosakata");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 mt-20">Memuat data kosakata...</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Dasbor Admin
        </Link>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Volume2 className="text-blue-600" />
            Kelola Kosakata
          </h1>
          <p className="text-slate-500 mt-1">Total: {kosakataList.length} kosakata tersedia</p>
        </div>
        
        <button 
          onClick={resetForm}
          className={`px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 ${
            showForm 
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          }`}
        >
          {showForm ? "Batal" : <><Plus size={20} /> Tambah Kosakata</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{isEditing ? "Edit Kosakata" : "Tambah Kosakata Baru"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bahasa Tonsea</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Kuman"
                  value={formData.tonsea}
                  onChange={e => setFormData({...formData, tonsea: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bahasa Indonesia</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Makan"
                  value={formData.indonesia}
                  onChange={e => setFormData({...formData, indonesia: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Hewan, Anggota Tubuh"
                  value={formData.categoryName}
                  onChange={e => setFormData({...formData, categoryName: e.target.value})}
                />
              </div>

              {/* 2. UBAH DARI INPUT TEKS MENJADI INPUT FILE AUDIO */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {isEditing ? "Ganti File Audio (.mp3 - Opsional)" : "File Audio (.mp3 - Opsional)"}
                </label>
                <input 
                  type="file" 
                  accept="audio/mp3, audio/mpeg" 
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setAudioFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : isEditing ? "Perbarui Kosakata" : "Simpan Kosakata"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Daftar Kosakata */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Bahasa Tonsea</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Bahasa Indonesia</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Audio</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kosakataList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Belum ada kosakata yang ditambahkan.
                  </td>
                </tr>
              ) : (
                kosakataList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{k.tonsea}</td>
                    <td className="px-6 py-4 text-slate-600">{k.indonesia}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">
                        {k.category?.name || 'Tidak ada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {k.audioUrl ? "Ada" : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(k)}
                          className="p-2 bg-amber-100 text-amber-600 hover:bg-amber-200 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(k.id)}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
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
  );
}