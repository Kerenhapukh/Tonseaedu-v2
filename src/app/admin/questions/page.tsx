"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [role, setRole] = useState('');
  const isGuru = role.toLowerCase() === 'guru';

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Gagal mengambil kuis:", error);
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

    fetchQuestions();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kuis ini?')) return;

    try {
      const res = await fetch(`/api/questions/${id}`, { 
        method: 'DELETE' 
      });

      if (res.ok) {
       
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
              <Link href={isGuru ? "/guru" : "/admin"} className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <BookOpen size={14} />
                  {isGuru ? "Guru / Pengelola Pembelajaran" : "Admin / Pengelola Sistem"}
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">Kelola Kuis Tonsea</h1>
                <p className="mt-3 max-w-2xl text-slate-600 leading-7">Total: {questions.length} Kuis tersedia</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/admin/materi" 
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Kelola Materi
              </Link>
              <Link 
                href="/admin/questions/new" 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all"
              >
                <Plus size={16} />
                Tambah Kuis Baru
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pertanyaan</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Jawaban Benar</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400">Belum ada kuis. Silakan tambah kuis baru.</td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 font-medium line-clamp-2">{q.question}</div>
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
                        <span className="text-sm text-emerald-600 font-semibold">{q.correctAnswer}</span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap space-x-3">
                        <Link 
                          href={`/admin/questions/${q.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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
      </div>
    </div>
  );
}