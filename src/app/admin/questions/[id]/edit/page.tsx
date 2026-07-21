"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [role, setRole] = useState('');
  const isGuru = role.toLowerCase() === 'guru';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [materiList, setMateriList] = useState<{ id: number; judul: string; categoryId: number; kelas?: string | null }[]>([]);
  
  const [formData, setFormData] = useState({
    question: "",
    correct_answer: "",
    options: ["", "", "", ""],
    categoryId: "",
    kelas: "",
    materiId: "",
  });

  useEffect(() => {
    const currentRole = (localStorage.getItem('tonsea_admin_role') || '').toLowerCase();
    setRole(currentRole);
    const isPrivileged = !!localStorage.getItem('tonsea_admin') && (currentRole === 'admin' || currentRole === 'guru');
    if (!isPrivileged) {
      router.replace('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [catRes, questionRes, materiRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/questions"),
          fetch("/api/materi")
        ]);

        const cats = await catRes.json();
        const questions = await questionRes.json();
        const materiJson = await materiRes.json();
        
        setCategories(cats);
        setMateriList(materiJson.data || []);

        const currentQ = questions.find((q: any) => q.id === parseInt(id));
        
        if (currentQ) {
          setFormData({
            question: currentQ.question,
            correct_answer: currentQ.correctAnswer, 
            options: currentQ.options,
            categoryId: currentQ.categoryId.toString(),
            kelas: currentQ.kelas || "",
            materiId: currentQ.materiId ? currentQ.materiId.toString() : "",
          });
        } else {
          alert("Kuis tidak ditemukan!");
          router.push("/admin/questions");
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(isGuru ? "/guru" : "/admin/questions");
        router.refresh();
      } else {
        alert("Gagal memperbarui kuis");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_24%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] px-4 py-6 md:px-8 md:py-8 text-slate-800">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 md:p-8">
          <Link href={isGuru ? "/guru" : "/admin/questions"} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-4">
            <ArrowLeft size={16} /> {isGuru ? "Kembali ke Dashboard Guru" : "Kembali ke Daftar Kuis"}
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <BookOpen size={14} />
            {isGuru ? "Guru / Pengelola Pembelajaran" : "Admin / Pengelola Sistem"}
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">Edit Kuis Tonsea</h1>

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

        {/* Pertanyaan */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Pertanyaan</label>
          <textarea
            required
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
              disabled={submitting}
              className="w-full rounded-full bg-slate-900 text-white py-3.5 font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all disabled:bg-slate-300"
            >
              {submitting ? "Menyimpan Perubahan..." : "Update Kuis"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}