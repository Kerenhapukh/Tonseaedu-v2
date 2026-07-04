"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScoreData {
  id: number;
  username: string;
  namaSiswa: string;
  kelas: string | null;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

const KELAS_OPTIONS = ['Semua', '7A', '7B', '8A', '8B', '9A', '9B'];

export default function RekapNilaiPage() {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasFilter, setKelasFilter] = useState('Semua');

  useEffect(() => {
    if (!localStorage.getItem('tonsea_admin')) {
      router.replace('/login');
      return;
    }

    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kelasFilter, router]);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const query = kelasFilter !== 'Semua' ? `?kelas=${kelasFilter}` : '';
      const res = await fetch(`/api/admin/scores${query}`);
      const json = await res.json();
      if (json.success) {
        setScores(json.data);
      }
    } catch (error) {
      console.error("Gagal mengambil rekap nilai:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm w-fit">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Dasbor Admin
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Trophy className="text-amber-500" />
            Rekap Nilai Siswa
          </h1>
          <p className="text-slate-500 mt-1">Daftar nilai kuis yang telah dikerjakan oleh siswa</p>
        </div>
        
        {/* Dropdown Filter Kelas */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
          <Filter size={18} className="text-slate-500" />
          <span className="text-sm font-bold text-slate-700">Filter Kelas:</span>
          <select 
            className="bg-transparent border-none outline-none font-medium text-blue-700 cursor-pointer ml-2"
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
          >
            {KELAS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Data Nilai */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori Kuis</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Skor</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mx-auto mb-2"></div>
                    Memuat data nilai...
                  </td>
                </tr>
              ) : scores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Belum ada data nilai kuis untuk kelas ini.
                  </td>
                </tr>
              ) : (
                scores.map((score, index) => (
                  <tr key={score.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{score.namaSiswa}</div>
                      <div className="text-xs text-slate-400">@{score.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">
                        {score.kelas || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {/* Karena schema Score tidak memiliki relasi langsung ke Kategori Kuis, 
                          kita berikan label default berdasarkan jumlah soal sementara */}
                      {score.totalQuestions > 0 ? "Umum" : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 text-sm font-black rounded-lg ${
                        score.score >= 80 ? 'bg-green-100 text-green-700' :
                        score.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {score.score} / 100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">
                      {formatDate(score.createdAt)}
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
