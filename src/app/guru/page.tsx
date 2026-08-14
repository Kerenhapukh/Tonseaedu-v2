"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  LogOut,
  ShieldCheck,
  Users,
  Clock,
  Pencil,
  CheckCircle2,
  Lock,
  XCircle,
  X
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface MateriSchedule {
  id: number;
  judul: string;
  kelas?: string | null;
  bab?: string | null;
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

export default function GuruDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isGuru = status === "authenticated" && session?.user?.role === "guru";

  const [materiList, setMateriList] = useState<MateriSchedule[]>([]);
  const [loadingMateri, setLoadingMateri] = useState(true);
  const [editingMateri, setEditingMateri] = useState<MateriSchedule | null>(null);
  const [quizStartAtInput, setQuizStartAtInput] = useState('');
  const [quizEndAtInput, setQuizEndAtInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!isGuru) {
      router.replace("/login");
      return;
    }
    fetchMateriList();
  }, [status, isGuru, router]);

  const fetchMateriList = async () => {
    try {
      const res = await fetch("/api/materi");
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      setMateriList(list);
    } catch (err) {
      console.error("Gagal mengambil data materi:", err);
    } finally {
      setLoadingMateri(false);
    }
  };

  const handleOpenScheduleModal = (materi: MateriSchedule) => {
    setEditingMateri(materi);
    setQuizStartAtInput(toDatetimeLocal(materi.quizStartAt));
    setQuizEndAtInput(toDatetimeLocal(materi.quizEndAt));
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMateri) return;

    setSaving(true);
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
        fetchMateriList();
      } else {
        alert('Gagal memperbarui batas waktu kuis');
      }
    } catch (err) {
      console.error('Gagal menyimpan jadwal:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_40%,_#f8fafc_100%)] px-6 py-10 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                <ShieldCheck size={14} />
                Guru / Pengelola Pembelajaran
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Dashboard Guru
              </h1>
              <p className="mt-2 max-w-xl text-slate-600">
                Kelola siswa, tentukan batas waktu pengerjaan kuis, lihat hasil kuis, dan atur materi pembelajaran dari satu tempat.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all w-fit"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Bento Grid Menu */}
        <div className="grid gap-5 md:grid-cols-3">

          {/* Featured / Card besar */}
          <Link
            href="/admin/scores"
            className="group relative md:col-span-2 md:row-span-2 overflow-hidden rounded-[2rem] bg-slate-900 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-1"
          >
            {/* Dekorasi blob */}
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between min-h-[260px] md:min-h-[340px]">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 mb-6">
                  <FileText size={28} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                  Lihat Hasil Kuis Siswa
                </h3>
                <p className="mt-3 max-w-md text-slate-300 leading-relaxed">
                  Pantau skor dan rekap nilai siswa secara real-time setelah mereka mengerjakan kuis, difilter per kelas.
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 group-hover:gap-3 transition-all">
                Buka rekap nilai
                <ArrowUpRight size={16} />
              </div>
            </div>
          </Link>

          {/* Kelola Siswa */}
          <Link
            href="/guru/students"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600 rounded-r-full" />
            <div className="pl-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-black text-slate-950">Kelola Siswa</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Tambahkan, edit, atau hapus akun siswa.
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                Kelola
                <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Kelola Kuis */}
          <Link
            href="/admin/questions"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500 rounded-r-full" />
            <div className="pl-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
                <BookOpen size={22} />
              </div>
              <h3 className="text-lg font-black text-slate-950">Kelola Kuis</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Tambah, ubah, dan hapus kuis yang digunakan siswa.
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                Kelola
                <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Kelola Materi & Batas Waktu */}
          <Link
            href="/admin/materi"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:col-span-3 md:flex md:items-center md:justify-between"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-orange-500 rounded-b-full md:hidden" />
            <div className="absolute inset-y-0 left-0 hidden w-1.5 bg-orange-500 rounded-r-full md:block" />
            <div className="pl-2 flex items-center gap-5">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">Kelola Materi &amp; Modul Kuis</h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                  Atur materi pembelajaran serta tentukan batas waktu pengerjaan kuis per modul.
                </p>
              </div>
            </div>
            <div className="mt-4 pl-2 md:mt-0 md:pl-0 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 group-hover:gap-2.5 transition-all shrink-0">
              Kelola
              <ArrowUpRight size={14} />
            </div>
          </Link>
        </div>

        {/* Seksi Khusus Pengaturan Batas Waktu Pengerjaan Kuis Guru */}
        <div className="rounded-[2rem] border border-blue-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
                <Clock size={14} />
                Fitur Baru Guru
              </div>
              <h2 className="text-2xl font-black text-slate-950">⏰ Pengaturan Batas Waktu Kuis</h2>
              <p className="text-sm text-slate-500 mt-1">
                Tentukan tanggal &amp; jam dibuka serta ditutup untuk setiap kuis materi agar siswa mengerjakan tepat waktu.
              </p>
            </div>
          </div>

          {loadingMateri ? (
            <div className="py-8 text-center text-slate-400 text-sm font-semibold">Memuat daftar kuis materi...</div>
          ) : materiList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Belum ada materi kuis.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {materiList.map((materi) => {
                const now = new Date();
                const startFormatted = formatQuizSchedule(materi.quizStartAt);
                const endFormatted = formatQuizSchedule(materi.quizEndAt);
                const isNotStarted = materi.quizStartAt ? now < new Date(materi.quizStartAt) : false;
                const isExpired = materi.quizEndAt ? now > new Date(materi.quizEndAt) : false;

                return (
                  <div key={materi.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700">
                          {materi.kelas ? `Kelas ${materi.kelas}` : 'Umum'}
                        </span>
                        {isNotStarted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <Lock size={12} /> Belum Dibuka
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            <XCircle size={12} /> Ditutup
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} /> Aktif
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{materi.judul}</h3>
                      {materi.bab && <p className="text-xs text-slate-400 mt-0.5">{materi.bab}</p>}

                      <div className="mt-3 text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200/80">
                        <p className="text-slate-600 font-medium">
                          🗓️ <b>Dibuka:</b> {startFormatted || <span className="text-slate-400 italic">Tanpa Batas (Bisa Langsung Dikerjakan)</span>}
                        </p>
                        <p className="text-slate-600 font-medium">
                          ⏰ <b>Ditutup:</b> {endFormatted || <span className="text-slate-400 italic">Tanpa Batas Ditutup</span>}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenScheduleModal(materi)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 transition-colors shadow-sm"
                    >
                      <Pencil size={14} /> Atur Batas Waktu Kuis
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Batas Waktu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
