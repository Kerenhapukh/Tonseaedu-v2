'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trophy, Crown, Sparkles, Award, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [kelasOptions] = useState<string[]>(['Semua', '7', '8', '9']);
  const [filterKelas, setFilterKelas] = useState<string>('Semua');
  const [isSiswa, setIsSiswa] = useState(false);
  const [siswaKelasLabel, setSiswaKelasLabel] = useState<string>('');

  useEffect(() => {
    const adminRole = (localStorage.getItem('tonsea_admin_role') || '').toLowerCase();
    const isAdminOrGuru = !!localStorage.getItem('tonsea_admin') && (adminRole === 'admin' || adminRole === 'guru');

    if (isAdminOrGuru) {
      setIsSiswa(false);
      setFilterKelas('Semua');
      return;
    }

    const savedUser = localStorage.getItem('tonsea_user');
    const userKelas = localStorage.getItem('tonsea_user_kelas');

    if (savedUser) {
      setIsSiswa(true);
      if (userKelas) {
        const normalized = userKelas.replace(/\D/g, '');
        if (normalized) {
          setFilterKelas(normalized);
          setSiswaKelasLabel(`Kelas ${normalized}`);
          return;
        }
      }

      // Ambil data user jika kelas belum ada di localStorage
      api.get('/admin/users')
        .then(res => {
          if (Array.isArray(res.data)) {
            const current = res.data.find((u: any) => u.username === savedUser);
            if (current && current.kelas) {
              const normalized = String(current.kelas).replace(/\D/g, '');
              if (normalized) {
                localStorage.setItem('tonsea_user_kelas', current.kelas);
                setFilterKelas(normalized);
                setSiswaKelasLabel(`Kelas ${normalized}`);
              }
            }
          }
        })
        .catch(() => {});
    } else {
      setIsSiswa(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = '/leaderboard';
    if (filterKelas && filterKelas !== 'Semua') {
      url += `?kelas=${filterKelas}`;
    }
    
    api.get(url)
      .then(res => {
        setLeaders(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filterKelas]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="font-bold text-slate-500 text-sm">Menyiapkan Papan Peringkat...</p>
    </div>
  );

  const champion = leaders[0];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_50%,#FFFFFF_100%)] py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(29,78,216,0.35)]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-200 border border-white/20 shadow-inner">
                <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                Kompetisi Pembelajaran Bahasa
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Papan <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-white bg-clip-text text-transparent">Peringkat</span>
              </h1>

              <p className="text-blue-100/90 leading-relaxed text-base md:text-lg">
                Jadilah siswa berprestasi nomor 1 dengan menyelesaikan kuis materi secara maksimal.
              </p>
            </div>

            {/* Champion Badge Banner */}
            {champion && (
              <div className="relative overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl flex flex-col items-center text-center min-w-[240px]">
                <Crown size={32} className="text-yellow-300 animate-bounce mb-2" />
                <div className="text-xs font-black uppercase tracking-wider text-blue-200">Juara 1 Peringkat</div>
                <h3 className="text-2xl font-black text-white mt-1">{champion.name}</h3>
                <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1 bg-yellow-400/20 text-yellow-300 rounded-full font-black text-lg border border-yellow-300/30">
                  <Trophy size={18} /> {champion.score} Pts
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Class Selector Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">
            <Award size={18} className="text-blue-600" /> Filter Peringkat:
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {isSiswa ? (
              <span className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20">
                {siswaKelasLabel}
              </span>
            ) : (
              kelasOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterKelas(opt)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                    filterKelas === opt
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt === 'Semua' ? 'Semua Kelas' : `Kelas ${opt}`}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-slate-200/90 overflow-hidden">
          {leaders.length === 0 ? (
            <div className="text-center py-16">
              <Trophy size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-xl font-bold text-slate-800">Belum Ada Peringkat</h3>
              <p className="text-slate-500 text-sm mt-1">Selesaikan kuis untuk menjadi siswa pertama di papan peringkat!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {leaders.map((user, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-6 transition-colors hover:bg-blue-50/40 ${
                      isFirst ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-sm ${
                        isFirst ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 shadow-amber-300/50' : 
                        isSecond ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 shadow-slate-300/50' : 
                        isThird ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-orange-300/50' : 
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {isFirst ? <Crown size={22} /> : index + 1}
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                          {user.name}
                          {isFirst && <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold border border-yellow-200">Teratas</span>}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {user.createdAt 
                            ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(user.createdAt)) 
                            : (user.date || '')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
                      <span className="text-2xl font-black text-blue-700">{user.score}</span>
                      <span className="text-xs font-bold text-blue-500 uppercase">Pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link 
          href="/quiz" 
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-black text-base transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          <PlayCircle size={20} />
          Ikuti Kuis & Tingkatkan Peringkat
        </Link>

      </div>
    </main>
  );
}

