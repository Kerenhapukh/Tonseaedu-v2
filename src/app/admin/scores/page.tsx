"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter, Trophy, FileSpreadsheet, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ScoreData {
  id: number;
  username: string;
  namaSiswa: string;
  kelas: string | null;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

const KELAS_OPTIONS = ['Semua', '7', '8', '9'];

export default function RekapNilaiPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasFilter, setKelasFilter] = useState('Semua');
  const role = session?.user?.role ?? '';
  const isGuru = role.toLowerCase() === 'guru';

  useEffect(() => {
    if (status === 'loading') return;
    const isPrivileged = role === 'admin' || role === 'guru';
    if (!isPrivileged) {
      router.replace('/login');
      return;
    }

    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, role, kelasFilter, router]);

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

  const handleExportCSV = () => {
    if (scores.length === 0) {
      alert("Tidak ada data nilai untuk diexport.");
      return;
    }

    const headers = [
      "No",
      "Nama Siswa",
      "Username",
      "Kelas",
      "Kategori Kuis",
      "Skor",
      "Total Soal",
      "Persentase (%)",
      "Tanggal Dikerjakan"
    ];

    const rows = scores.map((score, index) => {
      const percentage = score.totalQuestions > 0 
        ? Math.round((score.score / score.totalQuestions) * 100) 
        : 0;
      const kategori = score.totalQuestions > 0 ? "Umum" : "-";
      const formattedDate = formatDate(score.createdAt);
      
      return [
        index + 1,
        `"${(score.namaSiswa || '').replace(/"/g, '""')}"`,
        `"${(score.username || '').replace(/"/g, '""')}"`,
        `"${(score.kelas || '-').replace(/"/g, '""')}"`,
        `"${kategori.replace(/"/g, '""')}"`,
        score.score,
        score.totalQuestions,
        `"${percentage}%"`,
        `"${formattedDate.replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filename = `Rekap_Nilai_Siswa_${kelasFilter === 'Semua' ? 'Semua_Kelas' : `Kelas_${kelasFilter}`}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10 mb-8">
          <Link
            href={isGuru ? "/guru" : "/admin"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit"
          >
            <ArrowLeft size={16} /> {isGuru ? "Kembali ke Dasbor Guru" : "Kembali ke Dasbor Admin"}
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 mb-4">
                <Trophy size={14} />
                Rekap Nilai
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Rekap Nilai Siswa
              </h1>
              <p className="mt-2 text-slate-600">
                Daftar nilai kuis yang telah dikerjakan oleh siswa
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Dropdown Filter Kelas */}
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 border border-slate-200 rounded-full shadow-sm hover:border-blue-300 transition-colors">
                <Filter size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-700">Filter Kelas:</span>
                <select
                  className="bg-transparent border-none outline-none font-bold text-blue-700 cursor-pointer ml-1"
                  value={kelasFilter}
                  onChange={(e) => setKelasFilter(e.target.value)}
                >
                  {KELAS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt === 'Semua' ? 'Semua' : `Kelas ${opt}`}</option>
                  ))}
                </select>
              </div>

              {/* Tombol Export ke Excel / CSV */}
              <button
                onClick={handleExportCSV}
                disabled={loading || scores.length === 0}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed shadow-emerald-600/20"
                title="Unduh rekap nilai ke format Excel/CSV"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Data Nilai */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden">
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
                            kita berikan label default berdasarkan jumlah Kuis sementara */}
                        {score.totalQuestions > 0 ? "Umum" : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 text-sm font-black rounded-lg ${
                          score.score >= 80 ? 'bg-green-100 text-green-700' :
                          score.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {score.score} / {score.totalQuestions}
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
    </div>
  );
}
