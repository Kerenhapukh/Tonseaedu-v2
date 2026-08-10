"use client";

import Link from "next/link";
import {
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  MapPin, 
  Headphones, 
  Target, 
  Activity,
  Trophy, 
  Users, 
  FileText, 
  Sparkles, 
  Globe, 
  ArrowRight,
  Flame,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang", href: "#tentang" },
    { label: "Fitur", href: "#fitur" },
    { label: "Kontak Kami", href: "#kontak" },
  ];

  return (<div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 scroll-smooth selection:bg-blue-200">

  {/* Top Bar - Simplified & Sleek */}
  <div className="bg-slate-900 text-slate-300 py-2.5 text-xs font-medium hidden md:block w-full border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex gap-8">
        <a href="mailto:tonseaedu@gmail.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
          <Mail size={14} className="text-blue-500" /> tonseaedu@gmail.com
        </a>
        <span className="flex items-center gap-2">
          <Phone size={14} className="text-blue-500" /> +62 898 003 5886
        </span>
        <span className="flex items-center gap-2">
          <MapPin size={14} className="text-blue-500" /> Minahasa Utara
        </span>
      </div>
    </div>
  </div>

  {/* Navigation Bar */}
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
          <BookOpen size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">TonseaEdu</h1>
          <p className="text-[9px] sm:text-[10px] items-center flex gap-1 font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
            <Globe size={10} className="text-blue-500" /> Lestarikan Budaya
          </p>
        </div>
      </Link>

      {/* Desktop Menus */}
      <nav className="hidden md:flex gap-1 items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-white px-5 py-2 rounded-full transition-all duration-300"
          >
            {item.label}
          </a>
        ))}
      </nav>
      
      {/* Desktop Login Button */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
          Masuk
        </Link>
      </div>

      {/* Mobile Actions & Hamburger Toggle */}
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/login" className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm">
          Masuk
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </div>

    {/* Mobile Navigation Drawer */}
    {mobileMenuOpen && (
      <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 py-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-3">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {item.label}
          </a>
        ))}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-center text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all"
          >
            Masuk Akun
          </Link>
        </div>
      </div>
    )}
  </header>

  {/* Hero Section */}
  <section id="beranda" className="relative flex-1 flex flex-col justify-center py-14 sm:py-20 lg:py-32 px-4 sm:px-6 overflow-hidden bg-slate-950 w-full text-white">
    {/* Gambar Background Animasi Anak-Anak Belajar Bahasa Tonsea */}
    <img 
      src="/images/hero-kids-bg.jpg" 
      alt="Anak-Anak Belajar Bahasa Tonsea" 
      className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none scale-105 animate-[pulse_8s_infinite]"
      onError={(e) => {
        (e.target as HTMLElement).style.display = 'none';
      }}
    />

    {/* Overlay Gradients & Decorative Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40 z-[1]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] z-[2]"></div>
    <div className="absolute left-0 right-0 top-0 z-[2] m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-30 blur-[100px]"></div>
    <div className="absolute bottom-0 right-10 z-[2] h-[350px] w-[350px] rounded-full bg-cyan-400 opacity-20 blur-[120px]"></div>
    
    <div className="max-w-7xl mx-auto relative z-10 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 font-bold mb-6 shadow-lg backdrop-blur-md">
          <Sparkles size={16} className="text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs sm:text-sm tracking-wide">Platform Pembelajaran SMP</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
          Lestarikan <br className="hidden lg:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Bahasa Tonsea</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-xl leading-relaxed font-medium drop-shadow-sm">
          Jembatan teknologi untuk menghubungkan generasi muda Minahasa Utara dengan warisan budaya lewat cara yang seru, interaktif, dan modern.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/materi" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg transition-all shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
          >
            Mulai Petualangan 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a 
            href="#tentang" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-extrabold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            Pelajari Dulu
          </a>
        </div>
      </div>

      {/* Abstract Hero Image / Composition */}
      <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center">
        
        {/* Floating Decorative Elements / Playful Bubbles */}
        <div className="absolute top-4 left-10 z-30 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
          <span>⭐</span> 100% Interaktif
        </div>

        <div className="absolute bottom-8 right-12 z-30 bg-blue-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 animate-pulse">
          <Sparkles size={14} /> Belajar Seru!
        </div>

        {/* Main Floating Card - Streak */}
        <div className="absolute z-20 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl shadow-indigo-500/15 border border-white w-72 animate-bounce flex flex-col gap-4 transition-all hover:scale-105" style={{ animationDuration: '4.5s' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shadow-inner">
              <Flame className="text-amber-500 animate-pulse" size={26} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Streak Belajar</p>
              <p className="text-xs text-slate-500 font-bold">7 Hari Berturut-turut! 🔥</p>
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full w-full overflow-hidden p-0.5 border border-slate-200/60">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[75%] rounded-full"></div>
          </div>
        </div>

        {/* Background Decorative Card - Audio */}
        <div className="absolute right-2 top-8 z-10 bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 w-64 rotate-6 transform transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-30 cursor-default animate-[pulse_4s_infinite]">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-2.5 rounded-2xl text-orange-600"><Headphones size={22} /></div>
            <div>
              <p className="font-extrabold text-slate-800 text-sm">Pelafalan Tepat</p>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Audio Penutur Asli</p>
            </div>
          </div>
          <div className="w-full h-10 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-4 gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 w-full rounded-full"></div>
          </div>
        </div>
        
        {/* Background Decorative Card - Siswa */}
        <div className="absolute bottom-6 left-6 z-10 bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 w-64 -rotate-6 transform transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-30 cursor-default">
           <div className="flex gap-3.5 items-center">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" src="https://ui-avatars.com/api/?name=Siswa+1&background=2563eb&color=fff" alt="Siswa 1" />
                <img className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" src="https://ui-avatars.com/api/?name=Siswa+2&background=7c3aed&color=fff" alt="Siswa 2" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xs font-black text-white shadow-sm">500+</div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">Siswa Aktif</p>
                <p className="text-[11px] font-bold text-blue-600">Telah Bergabung 🚀</p>
              </div>
           </div>
        </div>

        {/* Blur Circle Backdrop */}
        <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-blue-400/25 via-indigo-400/20 to-purple-300/20 rounded-full blur-3xl z-0 animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>
    </div>
  </section>

  {/* Tentang Section */}
  <section id="tentang" className="py-14 sm:py-24 px-4 sm:px-6 bg-slate-950 text-white w-full border-t border-slate-800/80 relative overflow-hidden">
    {/* Gambar Background Khusus Section Tentang */}
    <img 
      src="/images/tentang-bg.jpg" 
      alt="Latar Belakang Tentang TonseaEdu" 
      className="absolute inset-0 w-full h-full object-cover object-center opacity-25 pointer-events-none scale-105 animate-[pulse_10s_infinite]"
      onError={(e) => {
        (e.target as HTMLElement).style.display = 'none';
      }}
    />

    {/* Background Overlay Gradients & Glow */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 z-[1]" />
    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-[2]" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none z-[2]" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Images/Visuals */}
        <div className="relative order-2 lg:order-1">
          <div className="aspect-square bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 rounded-[3rem] overflow-hidden relative border-8 border-slate-800 shadow-2xl z-10 flex items-center justify-center group">
            
            {/* Layer Gambar Misi Utama */}
            <img 
              src="/images/misi-utama.jpg" 
              alt="Gambar Misi Utama TonseaEdu" 
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
            />

            {/* Background Decorative Blur & Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/25 rounded-full blur-[80px] pointer-events-none" />

            {/* Badge Siswa Belajar Floating Top-Left dengan Animasi Bounce */}
            <div className="absolute z-20 top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-inner">
                <GraduationCap size={22} className="text-blue-600" />
              </div>
              <div className="font-bold text-slate-800 text-xs leading-tight">
                Siswa<br/><span className="text-blue-600 font-normal">Belajar 🎓</span>
              </div>
            </div>

            {/* Badge Budaya Lokal Floating Top-Right dengan Animasi Pulse */}
            <div className="absolute z-20 top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-pulse" style={{ animationDuration: '2.5s' }}>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shadow-inner">
                <Flame size={22} className="text-orange-600" />
              </div>
              <div className="font-bold text-slate-800 text-xs leading-tight">
                Budaya<br/><span className="text-orange-600 font-normal">Lokal 🔥</span>
              </div>
            </div>

            {/* Overlay Gradient agar Teks Selalu Jelas */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-[15]" />

            {/* Text Overlay Bottom */}
            <div className="absolute bottom-0 inset-x-0 pt-20 pb-8 flex flex-col justify-end px-8 text-center z-20">
              <h3 className="text-2xl lg:text-3xl font-black mb-2 text-white drop-shadow-md">Misi Utama</h3>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed drop-shadow-sm max-w-sm mx-auto font-medium">
                Menjadikan bahasa daerah relevan dan menarik bagi pelajar SMP Minahasa Utara.
              </p>
            </div>
          </div>
          {/* Decorative elements behind */}
          <div className="absolute top-10 -left-10 w-full h-full border-2 border-blue-500/20 rounded-[3rem] -z-0"></div>
          <div className="absolute w-24 h-24 bg-cyan-400 rounded-full blur-2xl top-0 right-0 opacity-30"></div>
        </div>

        {/* Text description */}
        <div className="relative z-10 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold mb-6 text-sm backdrop-blur-md shadow-md">
            <Users size={16} className="text-indigo-400" /> Seputaran Pembelajaran
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
            Jembatan Teknologi <br/>Untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Warisan Leluhur</span>
          </h2>
          <p className="text-slate-200 leading-relaxed mb-8 text-lg font-medium drop-shadow-sm">
            Seiring berjalannya waktu, penggunaan bahasa daerah mulai memudar. 
            TonseaEdu hadir khususnya untuk siswa SMP di Minahasa Utara, merajut kembali keterikatan 
            kaum muda dengan identitas mereka melalui <strong className="text-cyan-300">Bahasa Tonsea</strong>.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
             {[
              { title: "Kearifan Lokal", desc: "Melestarikan nilai luhur Minahasa Utara." },
              { title: "Identitas Budaya", desc: "Meningkatkan rasa bangga sejak usia remaja." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 group cursor-default bg-white/5 backdrop-blur-md p-4.5 rounded-2xl border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all hover:-translate-y-1 shadow-lg">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-cyan-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Fitur Section */}
  <section id="fitur" className="relative py-14 sm:py-24 px-4 sm:px-6 w-full overflow-hidden bg-slate-950 text-white border-t border-slate-800">
    {/* Gambar Background Khusus Section Fitur */}
    <img 
      src="/images/fitur-bg.jpg" 
      alt="Latar Belakang Fitur TonseaEdu" 
      className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none scale-105 animate-[pulse_12s_infinite]"
      onError={(e) => {
        (e.target as HTMLElement).style.display = 'none';
      }}
    />

    {/* Background Overlay Gradients & Glow */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/80 to-slate-950 z-[1]" />
    <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-[2]" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 backdrop-blur-md px-4 py-2 text-sm font-extrabold text-cyan-300 shadow-lg mb-5">
          <Sparkles size={16} className="text-cyan-400" />
          Fitur Utama
        </div>
      </div>
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur-xl p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-cyan-300 flex items-center justify-center shadow-lg">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Pengalaman Belajar</p>
                <h4 className="text-2xl font-black text-white tracking-tight leading-snug">Satu Tampilan, Banyak Manfaat</h4>
              </div>
            </div>
            <p className="text-blue-100/90 leading-relaxed mb-8 font-medium">
              TonseaEdu memadukan modul materi interaktif, pelafalan audio penutur asli, kuis realtime, dan papan peringkat kompetitif.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            {[
              { label: "Materi", value: "Interaktif" },
              { label: "Audio", value: "Pelafalan" },
              { label: "Kuis", value: "Real-time" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">{item.label}</p>
                <p className="mt-1 text-sm font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
          {[
            { icon: BookOpen, title: "Materi", desc: "Modul teks adaptif yang disusun rapi, mudah dibaca, dan jauh dari kata membosankan.", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-400/30" },
            { icon: Headphones, title: "Audio", desc: "Fitur putar audio untuk memastikan pelafalan kosakatamu tepat seperti penutur asli.", color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-400/30" },
            { icon: Activity, title: "Kuis", desc: "Latihan soal dan kuis berbatas waktu yang menstimulasi adrenalin belajarmu.", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-400/30" },
            { icon: Trophy, title: "Leaderboard", desc: "Kumpulkan poin setiap selesai kuis. Jadilah peringkat 1 di seluruh sekolah!", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-400/30" }
          ].map((feature, i) => (
            <div key={i} className={`group rounded-[2.5rem] border ${feature.border} bg-white/10 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/15 hover:border-white/40`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} border border-white/10 flex items-center justify-center rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={26} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-white mb-1.5 leading-snug">{feature.title}</h3>
                  <p className="text-blue-100/80 leading-relaxed text-xs font-medium">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>


  {/* Footer */}
  <footer id="kontak" className="bg-white text-slate-900 pt-20 pb-10 px-6 w-full mt-auto border-t border-slate-200">
    <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 mb-16">
      
      <div className="md:col-span-12 lg:col-span-4">
        <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">TonseaEdu</h1>
        </Link>
        <p className="text-slate-500 leading-relaxed mb-8 sm:pr-4">
          Platform modern pembelajaran Bahasa Tonsea khusus untuk generasi muda Minahasa Utara guna menjaga dan melestarikan kekayaan budaya leluhur di era digital.
        </p>
      </div>
      <div className="md:col-span-5 lg:col-span-3 lg:col-start-6">
        <h3 className="text-lg font-bold mb-6 text-slate-900">Jelajahi</h3>
        <ul className="space-y-4 text-slate-600 font-medium text-sm">
          <li><a href="#beranda" className="hover:text-blue-600 transition-colors flex items-center gap-2 w-max"><ArrowRight size={14}/> Beranda</a></li>
          <li><a href="#tentang" className="hover:text-blue-600 transition-colors flex items-center gap-2 w-max"><ArrowRight size={14}/> Seputaran Pembelajaran</a></li>
          <li><a href="#fitur" className="hover:text-blue-600 transition-colors flex items-center gap-2 w-max"><ArrowRight size={14}/> Fitur Belajar</a></li>
        </ul>
      </div>
      <div className="md:col-span-7 lg:col-span-4">
        <h3 className="text-lg font-bold mb-6 text-slate-900">Hubungi</h3>
        <ul className="space-y-5 text-slate-600 text-sm font-medium">
          <li className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 border border-blue-100"><MapPin size={18} /></div>
            <span className="leading-relaxed">Jl. Arnold Mononutu, Desa Lembean, Kec. Kauditan, Kab. Minahasa Utara, Sulawesi Utara</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 border border-blue-100"><Phone size={18} /></div>
            <span>+62 898 003 5886</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 border border-blue-100"><Mail size={18} /></div>
            <a href="mailto:tonseaedu@gmail.com" className="hover:text-blue-600 transition-colors">tonseaedu@gmail.com</a>
          </li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto border-t border-slate-200 pt-8 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4 font-medium">
      <p>&copy; {new Date().getFullYear()} TonseaEdu. Hak Cipta Dilindungi.</p>
      <div className="flex items-center gap-2">
      </div>
    </div>
  </footer>
</div>

);}