"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Pencil, Plus, Trash2, PlayCircle, Layers, Type, FileText, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Materi {
  id: number;
  title: string;
  content: string;
  bab?: string | null;
  ringkasan?: string | null;
  kelas?: string | null;
  videoUrl?: string | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

const KELAS_ORDER = ['7', '8', '9', 'umum'];

const normalizeKelas = (kelas?: string | null) => {
  if (!kelas) return 'umum';
  const onlyNumber = kelas.replace(/\D/g, '');
  return onlyNumber || 'umum';
};

// Mengubah link YouTube biasa (watch?v=, youtu.be/, shorts/) menjadi URL embed
const getYoutubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const inputBaseClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[0.98rem] font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

export default function AdminMateriPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const role = session?.user?.role ?? '';
  const isGuru = role.toLowerCase() === 'guru';

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kelas: '',
    bab: '',
    title: '',
    ringkasan: '',
    content: '',
    videoUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMateri = async () => {
    try {
      const resMateri = await fetch('/api/materi');
      const dataMateri = await resMateri.json();
      const list = Array.isArray(dataMateri?.data)
        ? dataMateri.data
        : Array.isArray(dataMateri)
        ? dataMateri
        : [];
      setMateriList(list);
    } catch (error) {
      console.error('Gagal mengambil data materi:', error);
      setMateriList([]);
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

    fetchMateri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, role, router]);

  const groupedMateri = useMemo(() => {
    const groups: Record<string, Materi[]> = {
      '7': [],
      '8': [],
      '9': [],
      umum: [],
    };

    materiList.forEach((materi) => {
      const key = normalizeKelas(materi.kelas);
      if (!groups[key]) {
        groups.umum.push(materi);
        return;
      }
      groups[key].push(materi);
    });

    return groups;
  }, [materiList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kelas || !formData.bab || !formData.title || !formData.ringkasan || !formData.content) {
      return alert('Mohon lengkapi kelas, bab, judul, ringkasan, dan isi materi!');
    }

    if (formData.videoUrl && !getYoutubeEmbedUrl(formData.videoUrl)) {
      return alert('Link YouTube tidak valid. Gunakan format seperti https://www.youtube.com/watch?v=xxxxx');
    }

    setSubmitting(true);
    try {
      const url = isEditing && editId ? `/api/materi/${editId}` : '/api/materi';
      const method = isEditing && editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: formData.title,
          konten: formData.content,
          kelas: formData.kelas,
          bab: formData.bab,
          ringkasan: formData.ringkasan,
          videoUrl: formData.videoUrl || null,
        }),
      });

      if (res.ok) {
        alert(isEditing ? 'Materi berhasil diperbarui!' : 'Materi berhasil ditambahkan!');
        setFormData({ kelas: '', bab: '', title: '', ringkasan: '', content: '', videoUrl: '' });
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        fetchMateri();
      } else {
        throw new Error(isEditing ? 'Gagal memperbarui materi' : 'Gagal menambah materi');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (materi: Materi) => {
    setFormData({
      kelas: materi.kelas || '',
      bab: materi.bab || '',
      title: materi.title,
      ringkasan: materi.ringkasan || materi.content,
      content: materi.content,
      videoUrl: materi.videoUrl || '',
    });
    setEditId(materi.id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormData({ kelas: '', bab: '', title: '', ringkasan: '', content: '', videoUrl: '' });
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;
    try {
      const res = await fetch(`/api/materi/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Materi berhasil dihapus!');
        fetchMateri();
      } else {
        throw new Error('Gagal menghapus materi');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renderMateriCard = (materi: Materi) => {
    const embedUrl = getYoutubeEmbedUrl(materi.videoUrl);

    return (
      <article key={materi.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            Kelas {normalizeKelas(materi.kelas) === 'umum' ? 'Umum' : normalizeKelas(materi.kelas)}
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {materi.bab || 'BAB belum diisi'}
          </span>
          {embedUrl && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
              <PlayCircle size={12} />
              Video
            </span>
          )}
        </div>

        <h3 className="text-lg font-black text-slate-950 leading-tight">{materi.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4">
          {materi.ringkasan || materi.content}
        </p>

        {embedUrl && (
          <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-slate-200">
            <iframe
              src={embedUrl}
              title={materi.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={() => handleEditClick(materi)}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(materi.id)}
            className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </article>
    );
  };

  if (loading) return <div className="p-8 text-center text-slate-500 mt-20">Memuat data materi...</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_28%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_42%,_#eef2ff_100%)] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Link
                href={isGuru ? '/guru' : '/admin'}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit"
              >
                <ArrowLeft size={16} /> {isGuru ? 'Kembali ke Dasbor Guru' : 'Kembali ke Dasbor Admin'}
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                  <BookOpen size={14} />
                  Kelola Materi
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                  Materi per Kelas
                </h1>
                <p className="mt-2 text-slate-600">
                  Setiap materi diatur per kelas, bab, judul, ringkasan, dan video pendukung.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 ${
                showForm
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none'
                  : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800'
              }`}
            >
              <Plus size={18} />
              {showForm ? 'Tutup Form' : 'Tambah Materi Baru'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total Materi</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{materiList.length}</p>
            <p className="mt-1 text-sm text-slate-500">Semua materi yang tersimpan</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kelas 7</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{groupedMateri['7'].length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi khusus kelas 7</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kelas 8</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{groupedMateri['8'].length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi khusus kelas 8</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kelas 9</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{groupedMateri['9'].length}</p>
            <p className="mt-1 text-sm text-slate-500">Materi khusus kelas 9</p>
          </div>
        </div>

        {showForm && (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] lg:p-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{isEditing ? 'Edit Materi' : 'Buat Materi Baru'}</h2>
                <p className="text-sm text-slate-500">Isi data materi per kelas agar mudah dipisahkan saat ditampilkan ke siswa.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <Layers size={14} className="text-slate-400" /> Kelas
                  </label>
                  <select
                    className={`${inputBaseClass} cursor-pointer`}
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  >
                    <option value="">-- Pilih Kelas --</option>
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <BookOpen size={14} className="text-slate-400" /> Bab
                  </label>
                  <input
                    type="text"
                    className={inputBaseClass}
                    placeholder="Contoh: BAB 4"
                    value={formData.bab}
                    onChange={(e) => setFormData({ ...formData, bab: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Type size={14} className="text-slate-400" /> Judul Materi
                </label>
                <input
                  type="text"
                  className={`${inputBaseClass} text-[1.05rem] font-semibold`}
                  placeholder="Contoh: Pengantar Sistem Komputer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Deskripsi Singkat</label>
                <textarea
                  className={`${inputBaseClass} min-h-[110px] resize-y leading-relaxed`}
                  placeholder="Tuliskan ringkasan singkat materi di sini..."
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Isi Materi</label>
                <textarea
                  className={`${inputBaseClass} min-h-[170px] resize-y leading-relaxed`}
                  placeholder="Tuliskan isi materi pelajaran di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Video size={14} className="text-slate-400" />
                  Link Video YouTube <span className="font-normal text-slate-400">(Opsional)</span>
                </label>
                <input
                  type="url"
                  className={inputBaseClass}
                  placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
                {formData.videoUrl && !getYoutubeEmbedUrl(formData.videoUrl) && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    Format link belum dikenali. Gunakan link youtube.com/watch?v=... atau youtu.be/...
                  </p>
                )}
                {formData.videoUrl && getYoutubeEmbedUrl(formData.videoUrl) && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <iframe
                      src={getYoutubeEmbedUrl(formData.videoUrl)!}
                      title="Pratinjau video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : isEditing ? 'Perbarui Materi' : 'Simpan Materi'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {KELAS_ORDER.map((kelasKey) => {
            const items = groupedMateri[kelasKey] || [];
            const label = kelasKey === 'umum' ? 'Materi Umum' : `Kelas ${kelasKey}`;

            return (
              <section key={kelasKey} className="rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">{label}</h2>
                    <p className="text-sm text-slate-500">{items.length} materi tersedia</p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {kelasKey === 'umum' ? 'Tidak terikat kelas' : `Filter ${label}`}
                  </span>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                  {items.length === 0 ? (
                    <div className="col-span-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                      Belum ada materi untuk {label}.
                    </div>
                  ) : (
                    items.map(renderMateriCard)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
