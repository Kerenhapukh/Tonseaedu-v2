"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, Volume2, PlayCircle, Trophy, User, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [username, setUsername] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("tonsea_user");
    if (savedUser) setUsername(savedUser);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("tonsea_user");
    localStorage.removeItem("tonsea_user_role");
    localStorage.removeItem("tonsea_admin");
    localStorage.removeItem("tonsea_admin_role");
    setUsername(null);
    setIsProfileOpen(false);
    router.replace("/");
  };

  const menuItems = useMemo(() => [
    { name: "Materi", href: "/materi", icon: BookOpen },
    { name: "Kosakata", href: "/kosakata", icon: Volume2 },
    { name: "Kuis", href: "/quiz", icon: PlayCircle },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ], []);

  return (
    <header className="w-full">
      <nav className="hidden md:block sticky top-0 z-50 w-full bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <Link href="/materi" className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">TonseaEdu</h1>
            </Link>

            <div className="flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                      isActive ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-blue-600"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative">
            {username ? (
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white"><User size={18} /></div>
                <span className="text-sm font-bold text-slate-700">{username}</span>
              </button>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold">Masuk</Link>
            )}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border rounded-2xl overflow-hidden z-[60]">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50"><LogOut size={16} /> Keluar</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/*MOBILE BOTTOM NAVBAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 h-20">
        <div className="flex justify-around items-center h-full">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                <div className={`p-2 rounded-xl ${isActive ? "bg-blue-50" : ""}`}><item.icon size={22} /></div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}