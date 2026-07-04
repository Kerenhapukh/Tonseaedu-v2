"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Kita buat interface untuk tipe data soal agar TypeScript tenang
interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  kelas?: string;
  category?: {
    name: string;
  };
}

export default function AdminQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data di Client Component
  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions'); // Pastikan endpoint API ini sesuai
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Gagal mengambil soal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('tonsea_admin')) {
      router.replace('/login');
      return;
    }

    fetchQuestions();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;

    try {
      const res = await fetch(`/api/questions/${id}`, { 
        method: 'DELETE' 
      });

      if (res.ok) {
        // Menghapus soal dari tampilan tanpa refresh halaman
        setQuestions(prev => prev.filter(q => q.id !== id));
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Gagal menghapus'}`);
      }
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan koneksi saat menghapus.");
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data soal Tonsea...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm w-fit">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Dasbor Admin
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Soal Tonsea</h1>
          <p className="text-gray-500 text-sm">Total: {questions.length} soal tersedia</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/materi" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center font-bold"
          >
            Kelola Materi
          </Link>
          <Link 
            href="/admin/questions/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 font-bold"
          >
            <span className="text-xl">+</span> Tambah Soal Baru
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pertanyaan</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelas</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jawaban Benar</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Belum ada soal. Silakan tambah soal baru.</td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium line-clamp-2">{q.question}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {q.category?.name || 'Umum'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                      {q.kelas ? `Kelas ${q.kelas}` : 'Menyeluruh'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-600 font-semibold">{q.correctAnswer}</span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap space-x-3">
                    <Link 
                      href={`/admin/questions/${q.id}/edit`}
                      className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}