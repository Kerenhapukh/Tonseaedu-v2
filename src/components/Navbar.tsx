"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Volume2, PlayCircle, Trophy, LogOut } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [username, setUsername] = useState<string | null>(null);
  const [userKelas, setUserKelas] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("tonsea_user");
    const savedKelas = localStorage.getItem("tonsea_user_kelas");

    if (savedUser) setUsername(savedUser);
    if (savedKelas) {
      const normalized = savedKelas.replace(/\D/g, "");
      setUserKelas(normalized ? `Kelas ${normalized}` : savedKelas);
    } else {
      setUserKelas(null);
    }
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("tonsea_user");
    localStorage.removeItem("tonsea_user_role");
    localStorage.removeItem("tonsea_user_name");
    localStorage.removeItem("tonsea_user_kelas");
    localStorage.removeItem("tonsea_admin");
    localStorage.removeItem("tonsea_admin_role");
    setUsername(null);
    setUserKelas(null);
    setIsProfileOpen(false);
    router.replace("/");
  };

  const menuItems = useMemo(() => [
    { name: "Materi", href: "/materi", icon: BookOpen },
    { name: "Kosakata", href: "/kosakata", icon: Volume2 },
    { name: "Latihan Kuis", href: "/quiz", icon: PlayCircle },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ], []);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:block w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-8 lg:gap-10">
            {/* Logo */}
            <Link href="/materi" className="flex items-center gap-3 group shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BookOpen size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Tonsea<span className="text-blue-600">Edu</span>
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Platform Pembelajaran</span>
              </div>
            </Link>

            {/* Menu Items */}
            <div className="flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/materi' && pathname.startsWith('/materi/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 lg:px-5 py-2 rounded-full text-xs font-black transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" 
                        : "text-slate-600 hover:text-blue-600 hover:bg-white/60"
                    }`}
                  >
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            {username ? (
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-2.5 bg-white hover:bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm font-black text-sm shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-800 max-w-[120px] truncate">{username}</span>
                  {userKelas && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full shrink-0">
                      {userKelas}
                    </span>
                  )}
                </div>
              </button>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                Masuk
              </Link>
            )}
            
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tersambung Sebagai</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black text-slate-900 truncate">{username}</p>
                    {userKelas && (
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                        {userKelas}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-extrabold text-xs rounded-2xl hover:bg-red-50 transition-colors mt-1"
                >
                  <LogOut size={16} /> Keluar akun
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE TOP HEADER */}
      <nav className="md:hidden w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm px-4 h-16 flex justify-between items-center">
        <Link href="/materi" className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-sm">
            <BookOpen size={18} strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            Tonsea<span className="text-blue-600">Edu</span>
          </h1>
        </Link>

        <div className="relative">
          {username ? (
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 bg-slate-100 p-1 pr-3 rounded-full border border-slate-200/80"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-extrabold text-slate-800 max-w-[80px] truncate">{username}</span>
              {userKelas && (
                <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                  {userKelas}
                </span>
              )}
            </button>
          ) : (
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-black text-xs shadow-sm"
            >
              Masuk
            </Link>
          )}

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-2xl p-2 z-[60]">
              <div className="px-3 py-2 border-b border-slate-100 space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tersambung Sebagai</p>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-black text-slate-900 truncate">{username}</p>
                  {userKelas && (
                    <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100 shrink-0">
                      {userKelas}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2.5 text-red-600 font-extrabold text-xs rounded-xl hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut size={15} /> Keluar akun
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVBAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 h-16 shadow-lg">
        <div className="flex justify-around items-center h-full px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/materi' && pathname.startsWith('/materi/'));
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-600" : ""}`}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}