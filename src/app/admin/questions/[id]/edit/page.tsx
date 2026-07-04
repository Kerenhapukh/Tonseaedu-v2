"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  
  const [formData, setFormData] = useState({
    question: "",
    correct_answer: "",
    options: ["", "", "", ""],
    categoryId: "",
    kelas: "",
  });

  useEffect(() => {
    if (!localStorage.getItem('tonsea_admin')) {
      router.replace('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Ambil data kategori dan daftar soal secara paralel
        const [catRes, questionRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/questions") // Menggunakan endpoint GET yang sudah kita gabung tadi
        ]);

        const cats = await catRes.json();
        const questions = await questionRes.json();
        
        setCategories(cats);

        // Cari soal yang spesifik berdasarkan ID
        const currentQ = questions.find((q: any) => q.id === parseInt(id));
        
        if (currentQ) {
          setFormData({
            question: currentQ.question,
            correct_answer: currentQ.correctAnswer, // Sesuaikan dengan schema baru camelCase
            options: currentQ.options,
            categoryId: currentQ.categoryId.toString(),
            kelas: currentQ.kelas || "",
          });
        } else {
          alert("Soal tidak ditemukan!");
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
        router.push("/admin/questions");
        router.refresh();
      } else {
        alert("Gagal memperbarui soal");
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
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/admin/questions" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
        ← Kembali ke Daftar Soal
      </Link>
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Soal Tonsea</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Kategori dan Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Kategori</label>
            <select
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Kelas (Opsional)</label>
            <select
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-300"
        >
          {submitting ? "Menyimpan Perubahan..." : "Update Soal"}
        </button>
      </form>
    </div>
  );
}