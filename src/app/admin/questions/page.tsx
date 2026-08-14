"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus, Clock, Pencil, CheckCircle2, XCircle, Lock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  kelas?: string;
  materiId?: number | null;
  category?: {
    name: string;
  };
  materi?: {
    id: number;
    judul: string;
    quizStartAt?: string | null;
    quizEndAt?: string | null;
  };
}

const toDatetimeLocal = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatQuizSchedule = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d).replace('.', ':');
};

const inputBaseClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

export default function AdminQuestionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const role = session?.user?.role ?? '';
  const isGuru = role.toLowerCase() === 'guru';

  const [editingMateri, setEditingMateri] = useState<{ id: number; judul: string; quizStartAt?: string | null; quizEndAt?: string | null } | null>(null);
  const [quizStartAtInput, setQuizStartAtInput] = useState('');
  const [quizEndAtInput, setQuizEndAtInput] = useState('');
  const [savingSchedule, setSavingSchedule] = useState(false);

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
    if (status === 'loading') return;
    const isPrivileged = role === 'admin' || role === 'guru';
    if (!isPrivileged) {
      router.replace('/login');
      return;
    }

    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, role, router]);

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

  const handleOpenScheduleModal = (materi: { id: number; judul: string; quizStartAt?: string | null; quizEndAt?: string | null }) => {
    setEditingMateri(materi);
    setQuizStartAtInput(toDatetimeLocal(materi.quizStartAt));
    setQuizEndAtInput(toDatetimeLocal(materi.quizEndAt));
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMateri) return;

    setSavingSchedule(true);
    try {
      const formData = new FormData();
      formData.append('title', editingMateri.judul);
      formData.append('content', 'placeholder');
      formData.append('quizStartAt', quizStartAtInput || '');
      formData.append('quizEndAt', quizEndAtInput || '');

      const res = await fetch(`/api/materi/${editingMateri.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert('Batas waktu kuis berhasil diperbarui!');
        setEditingMateri(null);
        fetchQuestions();
      } else {
        alert('Gagal memperbarui batas waktu kuis');
      }
    } catch (err) {
      console.error('Gagal menyimpan jadwal:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSavingSchedule(false);
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link href={isGuru ? "/guru" : "/admin"} className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <BookOpen size={14} />
                  Guru / Pengelola Kuis &amp; Pembelajaran
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">Kelola Kuis Tonsea</h1>
                <p className="mt-3 max-w-2xl text-slate-600 leading-7">Total: {questions.length} Kuis tersedia &bull; Guru dapat menentukan batas waktu dibuka &amp; ditutup kuis.</p>
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Materi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Batas Waktu Kuis</th>
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
                  questions.map((q) => {
                    const now = new Date();
                    const startFormatted = formatQuizSchedule(q.materi?.quizStartAt);
                    const endFormatted = formatQuizSchedule(q.materi?.quizEndAt);
                    const isNotStarted = q.materi?.quizStartAt ? now < new Date(q.materi.quizStartAt) : false;
                    const isExpired = q.materi?.quizEndAt ? now > new Date(q.materi.quizEndAt) : false;

                    return (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900 font-medium line-clamp-2">{q.question}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md">
                            {q.kelas ? `Kelas ${q.kelas}` : 'Menyeluruh'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-full">
                            {q.materi?.judul || 'Umum'}
                          </span>
                          {q.category && (
                            <div className="text-xs text-slate-400 mt-1 max-w-[150px] truncate" title={q.category.name}>
                              Kategori: {q.category.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {q.materi ? (
                            <div className="space-y-1.5 min-w-[200px]">
                              <div className="flex items-center gap-1.5">
                                {isNotStarted ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                    <Lock size={10} /> Belum Dibuka
                                  </span>
                                ) : isExpired ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                                    <XCircle size={10} /> Ditutup
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 size={10} /> Aktif
                                  </span>
                                )}
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 space-y-0.5">
                                <p className="text-slate-600 font-medium">🗓️ <b>Dibuka:</b> {startFormatted || <span className="text-slate-400 italic">Langsung</span>}</p>
                                <p className="text-slate-600 font-medium">⏰ <b>Ditutup:</b> {endFormatted || <span className="text-slate-400 italic">Tanpa Batas</span>}</p>
                              </div>
                              <button
                                onClick={() => handleOpenScheduleModal(q.materi!)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <Pencil size={11} /> Ubah Batas Waktu
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Soal Umum (Tanpa Batas)</span>
                          )}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Edit Batas Waktu Kuis Guru */}
      {editingMateri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative animate-in zoom-in-95">
            <button
              onClick={() => setEditingMateri(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Atur Batas Waktu Kuis</h3>
                <p className="text-xs text-slate-500 font-semibold">{editingMateri.judul}</p>
              </div>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  🗓️ Tanggal &amp; Jam Kuis Dibuka
                </label>
                <input
                  type="datetime-local"
                  className={inputBaseClass}
                  value={quizStartAtInput}
                  onChange={(e) => setQuizStartAtInput(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Kosongkan jika kuis bisa langsung dibuka siswa kapan saja.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ⏰ Tanggal &amp; Jam Kuis Ditutup
                </label>
                <input
                  type="datetime-local"
                  className={inputBaseClass}
                  value={quizEndAtInput}
                  onChange={(e) => setQuizEndAtInput(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Setelah jam tersebut, kuis otomatis terkunci dan tidak bisa lagi dikerjakan siswa.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMateri(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingSchedule}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {savingSchedule ? 'Menyimpan...' : 'Simpan Batas Waktu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}