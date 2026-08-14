"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { useSession } from "next-auth/react";

interface MateriItem {
  id: number;
  judul: string;
  categoryId: number;
  kelas?: string | null;
  quizStartAt?: string | null;
  quizEndAt?: string | null;
}

const toDatetimeLocal = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function NewQuestionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [materiList, setMateriList] = useState<MateriItem[]>([]);
  const role = session?.user?.role ?? '';
  const isGuru = role.toLowerCase() === 'guru';
  
  const [formData, setFormData] = useState({
    question: "",
    correct_answer: "",
    options: ["", "", "", ""],
    categoryId: "",
    kelas: "",
    materiId: "",
  });
  const [quizStartAt, setQuizStartAt] = useState('');
  const [quizEndAt, setQuizEndAt] = useState('');

  // Ambil kategori dan materi dari database saat halaman dimuat
  useEffect(() => {
    if (status === 'loading') return;
    const isPrivileged = role === 'admin' || role === 'guru';
    if (!isPrivileged) {
      router.replace('/login');
      return;
    }

    const fetchCategoriesAndMateri = async () => {
      try {
        const [catRes, materiRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/materi"),
        ]);
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data);
        }
        if (materiRes.ok) {
          const resJson = await materiRes.json();
          setMateriList(resJson.data || []);
        }
      } catch (error) {
        console.error("Gagal memuat kategori atau materi:", error);
      }
    };
    fetchCategoriesAndMateri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materiId) return alert("Pilih materi dulu!");
    
    setLoading(true);
    try {
      // Simpan kuis baru
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Update batas waktu kuis materi jika diisi
        const selectedMateri = materiList.find(m => m.id === parseInt(formData.materiId, 10));
        if (selectedMateri) {
          const updateData = new FormData();
          updateData.append('title', selectedMateri.judul);
          updateData.append('content', 'placeholder');
          updateData.append('quizStartAt', quizStartAt || '');
          updateData.append('quizEndAt', quizEndAt || '');
          await fetch(`/api/materi/${selectedMateri.id}`, {
            method: 'PUT',
            body: updateData,
          });
        }

        router.push(isGuru ? "/guru" : "/admin/questions");
        router.refresh();
      } else {
        alert("Gagal menyimpan kuis");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_24%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] px-4 py-6 md:px-8 md:py-8 text-slate-800">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <Link href={isGuru ? "/guru" : "/admin/questions"} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-4">
            <ArrowLeft size={16} /> {isGuru ? "Kembali ke Dashboard Guru" : "Kembali ke Daftar Kuis"}
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <BookOpen size={14} />
            Guru / Pengelola Kuis &amp; Pembelajaran
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">Tambah Kuis Tonsea</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Materi dan Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Materi</label>
            <select
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.materiId}
              onChange={(e) => {
                const selectedMateriId = e.target.value;
                const selectedMateri = materiList.find(m => m.id === parseInt(selectedMateriId, 10));
                setFormData({
                  ...formData,
                  materiId: selectedMateriId,
                  categoryId: selectedMateri ? selectedMateri.categoryId.toString() : "",
                  kelas: selectedMateri && selectedMateri.kelas ? selectedMateri.kelas : ""
                });
                if (selectedMateri) {
                  setQuizStartAt(toDatetimeLocal(selectedMateri.quizStartAt));
                  setQuizEndAt(toDatetimeLocal(selectedMateri.quizEndAt));
                } else {
                  setQuizStartAt('');
                  setQuizEndAt('');
                }
              }}
            >
              <option value="">-- Pilih Materi --</option>
              {materiList.map((m) => (
                <option key={m.id} value={m.id}>{m.judul} (Kelas {m.kelas || 'Umum'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Kelas (Otomatis dari Materi)</label>
            <select
              className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
              value={formData.kelas}
              disabled
            >
              <option value="">-- Berlaku untuk Semua --</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          </div>
        </div>

        {/* Batas Waktu Kuis (Schedule) */}
        {formData.materiId && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Clock size={16} className="text-blue-600" />
              Jadwal &amp; Batas Waktu Pengerjaan Kuis Modul Ini (Buka / Tutup)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">🗓️ Tanggal &amp; Jam Dibuka</label>
                <input
                  type="datetime-local"
                  className="w-full p-2.5 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={quizStartAt}
                  onChange={(e) => setQuizStartAt(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">⏰ Tanggal &amp; Jam Ditutup</label>
                <input
                  type="datetime-local"
                  className="w-full p-2.5 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={quizEndAt}
                  onChange={(e) => setQuizEndAt(e.target.value)}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Guru dapat mengatur tanggal kuis dibuka &amp; ditutup di sini. Setelah jam ditutup, siswa tidak dapat mengerjakan kuis ini lagi.
            </p>
          </div>
        )}

        {/* Pertanyaan */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Pertanyaan</label>
          <textarea
            required
            placeholder="Contoh: Apa arti dari kata 'Esa'?"
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          />
        </div>

        {/* Pilihan Jawaban */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.options.map((option, index) => (
            <div key={index}>
              <label className="block text-xs font-medium mb-1 text-gray-500">Pilihan {index + 1}</label>
              <input
                type="text"
                required
                placeholder={`Opsi ${index + 1}`}
                className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none"
                value={option}
                onChange={(e) => {
                  const newOptions = [...formData.options];
                  newOptions[index] = e.target.value;
                  setFormData({ ...formData, options: newOptions });
                }}
              />
            </div>
          ))}
        </div>

        {/* Jawaban Benar */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Jawaban yang Benar</label>
          <select
            required
            className="w-full p-2.5 border rounded-lg bg-green-50 border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.correct_answer}
            onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
          >
            <option value="">-- Tentukan Jawaban Benar --</option>
            {formData.options.map((opt, i) => (
              opt && <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-900 text-white py-3.5 font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all disabled:bg-slate-300"
            >
              {loading ? "Sedang Menyimpan..." : "Simpan Kuis Sekarang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}