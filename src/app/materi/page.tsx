'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Materi {
  id: number;
  title: string;
  content: string;
  category: Category;
}

export default function UserMateriPage() {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateriWithKelas = async (kelasFilter: string | null) => {
      try {
        let url = '/api/materi';
        if (kelasFilter) {
          url += `?kelas=${kelasFilter}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setMateriList(data.data || data);
        }
      } catch (error) {
        console.error('Gagal mengambil materi:', error);
      } finally {
        setLoading(false);
      }
    };

    const initData = async () => {
      const savedUser = localStorage.getItem("tonsea_user");
      let userKelas = localStorage.getItem("tonsea_user_kelas");

      if (!userKelas && savedUser) {
        try {
          const res = await fetch('/api/admin/users');
          const users = await res.json();
          const currentUser = users.find((u: any) => u.username === savedUser);
          if (currentUser && currentUser.kelas) {
            userKelas = currentUser.kelas;
            localStorage.setItem("tonsea_user_kelas", userKelas);
          }
        } catch (e) {
          console.error("Gagal sinkronisasi data user");
        }
      }
      
      fetchMateriWithKelas(userKelas);
    };

    initData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="group inline-flex items-center text-blue-600 mb-8 font-medium hover:text-blue-700 transition-colors">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Beranda
        </Link>
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Materi Pembelajaran</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kumpulan materi edukasi bahasa Tonsea hasil unggahan untuk membantumu belajar.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Memuat materi...</div>
        ) : materiList.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Belum Ada Materi</h3>
            <p className="text-slate-500">Materi pembelajaran bahasa Tonsea akan segera hadir.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {materiList.map((materi) => (
              <div key={materi.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg mb-3">
                    {materi.category?.name || 'Umum'}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 line-clamp-2">{materi.title}</h2>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                  {materi.content}
                </p>
                
                <Link 
                  href={`/category/${materi.category?.slug || ''}`} 
                  className="mt-auto flex items-center text-blue-600 font-bold hover:text-blue-700 group"
                >
                  Baca Selengkapnya
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}