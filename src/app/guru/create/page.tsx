"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function GuruCreateQuiz() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [kelas, setKelas] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user?.role !== 'guru') {
      router.replace('/login');
      return;
    }

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.data || []))
      .catch(() => setCategories([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return alert('Pilih kategori/materi');
    if (!question || !correctAnswer) return alert('Pertanyaan dan jawaban benar wajib diisi');

    try {
      setSubmitting(true);
      const body = {
        question,
        correct_answer: correctAnswer,
        options,
        categoryId,
        kelas: kelas || null,
      };
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan kuis');
      alert('Kuis berhasil dibuat');
      // Reset
      setQuestion(''); setCorrectAnswer(''); setOptions(["", "", "", ""]);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally { setSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Buat Kuis</h1>
        <form onSubmit={submitQuestion} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pilih Kategori / Materi</label>
            <select value={categoryId || ''} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-md border p-3">
              <option value="">-- Pilih --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pertanyaan</label>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full rounded-md border p-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => (
              <input key={idx} value={opt} onChange={(e) => { const copy = [...options]; copy[idx] = e.target.value; setOptions(copy); }} placeholder={`Pilihan ${idx+1}`} className="rounded-md border p-3" />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Jawaban Benar</label>
            <input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full rounded-md border p-3" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kelas (opsional, 7 / 8 / 9)</label>
            <select value={kelas} onChange={(e) => setKelas(e.target.value)} className="w-full rounded-md border p-3 bg-white">
              <option value="">-- Berlaku untuk semua kelas --</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="px-6 py-3 rounded-full bg-slate-900 text-white">{submitting ? 'Menyimpan...' : 'Simpan Kuis'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
