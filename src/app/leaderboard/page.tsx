'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trophy, ArrowLeft, Medal, Crown } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [kelasOptions] = useState<string[]>(['Semua', '7', '8', '9']);
  const [filterKelas, setFilterKelas] = useState<string>('Semua');

  useEffect(() => {
    // Jika ada session user, set default filter sesuai kelasnya (bila ada)
    const userKelas = localStorage.getItem("tonsea_user_kelas");
    if (userKelas && !filterKelas) {
      setFilterKelas(userKelas);
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="animate-pulse font-bold text-slate-400">Memuat Peringkat...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 md:p-12 text-slate-900">
      <div className="max-w-xl mx-auto">
        
        {/* Header Navigasi */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/quiz" className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black tracking-tight">PAPAN PERINGKAT</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500">Kelas:</span>
              <select 
                className="bg-white border outline-none text-sm font-bold text-blue-600 rounded-lg px-2 py-1 shadow-sm"
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
              >
                {kelasOptions.map(opt => (
                  <option key={opt} value={opt}>{opt === 'Semua' ? 'Semua' : `Kelas ${opt}`}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Kartu Utama Juara 1 */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 mb-8 text-center text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <Crown className="absolute top-4 right-4 text-blue-400/30" size={120} />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
              <Trophy className="text-yellow-400" size={40} />
            </div>
            <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-1">Skor Tertinggi</p>
            <h2 className="text-3xl font-black mb-1">{leaders[0]?.name || '---'}</h2>
            <div className="text-5xl font-black">{leaders[0]?.score || 0}</div>
          </div>
        </div>

        {/* Daftar Peringkat */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {leaders.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex items-center justify-between p-6 ${index !== leaders.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    index === 1 ? 'bg-slate-100 text-slate-600' : 
                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">
                    {user.createdAt 
                      ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(user.createdAt)) 
                      : (user.date || '')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-blue-600">{user.score}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase">Pts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <Link href="/quiz" className="mt-8 flex items-center justify-center w-full bg-white border-2 border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all">
          <Medal className="mr-2" size={18} /> MAIN LAGI
        </Link>

      </div>
    </main>
  );
}