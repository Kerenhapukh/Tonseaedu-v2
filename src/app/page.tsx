"use client";

import Link from "next/link";
import 
{Mail, 
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
Flame
} from "lucide-react";

export default function LandingPage() {
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
    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 shrink-0 group">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
          <BookOpen size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">TonseaEdu</h1>
          <p className="text-[10px] items-center flex gap-1 font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
            <Globe size={10} className="text-blue-500" /> Lestarikan Budaya
          </p>
        </div>
      </Link>

      {/* Menus */}
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
      
      <div className="flex items-center gap-4 shrink-0">
         <Link href="/login" className="hidden md:flex items-center justify-center font-semibold text-slate-600 hover:text-blue-600 transition-colors text-sm">
            Masuk
         </Link>
      </div>
    </div>
  </header>

  {/* Hero Section */}
  <section id="beranda" className="relative flex-1 flex flex-col justify-center py-20 lg:py-32 px-6 overflow-hidden bg-white w-full">
     {/* Decorative Grid & Gradients */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
    <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]"></div>
    
    <div className="max-w-7xl mx-auto relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
      <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/50 text-blue-700 font-semibold mb-6 shadow-sm shadow-blue-100">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-sm tracking-wide">Platform Pembelajaran SMP</span>
        </div>
        
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Lestarikan <br className="hidden lg:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Bahasa Tonsea</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
          Jembatan teknologi untuk menghubungkan generasi muda Minahasa Utara dengan warisan budaya lewat cara yang seru, interaktif, dan modern.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
          >
            Mulai Petualangan 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a 
            href="#tentang" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            Pelajari Dulu
          </a>
        </div>
      </div>

      {/* Abstract Hero Image / Composition */}
      <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center">
        {/* Main Floating Card */}
        <div className="absolute z-20 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/50 w-72 animate-bounce flex flex-col gap-4" style={{animationDuration: '4s'}}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Flame className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Streak Belajar</p>
              <p className="text-sm text-slate-500">7 Hari Berturut-turut!</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[70%] rounded-full"></div>
          </div>
        </div>

        {/* Background Decorative Cards */}
        <div className="absolute right-0 top-10 z-10 bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-64 rotate-6 transform transition-transform hover:rotate-0 hover:z-30 cursor-default">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-2 rounded-xl"><Headphones className="text-orange-600" size={20} /></div>
            <p className="font-bold text-slate-700 text-sm">Pelafalan Tepat</p>
          </div>
          <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="h-1 bg-slate-200 w-full rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-10 z-10 bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-64 -rotate-3 transform transition-transform hover:rotate-0 hover:z-30 cursor-default">
           <div className="flex gap-4 items-center">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User+1&background=random" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User+2&background=random" alt="" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">500+</div>
              </div>
              <div className="text-xs font-bold text-slate-700">Telah bergabung</div>
           </div>
        </div>

        {/* Blur Circle Backdrop */}
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/20 to-indigo-300/20 rounded-full blur-3xl z-0"></div>
      </div>
    </div>
  </section>

  {/* Tentang Section */}
  <section id="tentang" className="py-24 px-6 bg-white w-full border-t border-slate-100 relative">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Images/Visuals */}
        <div className="relative order-2 lg:order-1">
          <div className="aspect-square bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-[3rem] overflow-hidden relative border-8 border-white shadow-2xl z-10 flex items-center justify-center">
            
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/20 rounded-full blur-[80px]"></div>
            
            {/* Central Illustration Composition */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Central Element: Buku (BookOpen) */}
              <div className="absolute z-20 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-8 rounded-3xl shadow-2xl shadow-blue-900/10 border border-white flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                   <BookOpen size={48} className="text-blue-600" strokeWidth={2} />
                </div>
                <div className="h-2.5 w-20 bg-slate-200 rounded-full"></div>
                <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
              </div>

              {/* Element 2: Siswa Belajar (GraduationCap & Users) */}
              <div className="absolute z-30 top-16 left-12 bg-white p-4 justify-center items-center flex rounded-2xl shadow-xl shadow-indigo-200/50 border border-white rotate-[-8deg] animate-[bounce_5s_infinite]">
                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                   <GraduationCap size={28} className="text-indigo-600" />
                 </div>
                 <div className="ml-3 font-bold text-slate-800 text-sm leading-tight text-left pr-2">
                   Siswa<br/><span className="text-indigo-600 font-normal">Belajar</span>
                 </div>
              </div>

              {/* Element 3: Budaya Lokal (Flame / Tumparik) */}
              <div className="absolute z-30 bottom-32 right-8 bg-white p-4 justify-center items-center flex rounded-[2rem] shadow-xl shadow-orange-200/50 border border-white rotate-[12deg] hover:rotate-0 transition-transform duration-300">
                 <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                   <Flame size={32} className="text-orange-600" />
                 </div>
                 <div className="ml-3 mr-3 font-bold text-slate-800 text-sm leading-tight text-left">
                   Budaya<br/><span className="text-orange-600 font-normal">Lokal</span>
                 </div>
              </div>
              
              {/* Additional accent graphics */}
              <div className="absolute top-24 right-20 grid grid-cols-2 gap-2 opacity-50">
                 <div className="w-3 h-3 rounded-full bg-blue-400"></div><div className="w-3 h-3 rounded-full bg-purple-400"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-rose-400"></div>
              </div>
              
              {/* Floating abstract rings */}
              <div className="absolute w-64 h-64 rounded-full border border-slate-300/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] -z-10"></div>
              <div className="absolute w-96 h-96 rounded-full border border-slate-300/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] -z-10"></div>

            </div>

            {/* Text Overlay Bottom */}
            <div className="absolute bottom-0 inset-x-0 pt-20 pb-8 bg-gradient-to-t from-blue-950 via-blue-900/80 to-transparent flex flex-col justify-end px-8 text-center z-40">
              <h3 className="text-2xl lg:text-3xl font-black mb-2 text-white drop-shadow-md">Misi Utama</h3>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed drop-shadow-sm max-w-sm mx-auto">
                Menjadikan bahasa daerah relevan dan menarik bagi pelajar SMP Minahasa Utara.
              </p>
            </div>
          </div>
          {/* Decorative elements behind */}
          <div className="absolute top-10 -left-10 w-full h-full border-2 border-blue-600/20 rounded-[3rem] -z-0"></div>
          <div className="absolute w-24 h-24 bg-yellow-400 rounded-full blur-2xl top-0 right-0 opacity-40"></div>
        </div>

        {/* Text description */}
        <div className="relative z-10 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold mb-6 text-sm">
            <Users size={16} /> Seputaran Pembelajaran
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Jembatan Teknologi <br/>Untuk <span className="text-blue-600">Warisan Leluhur</span>
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8 text-lg">
            Seiring berjalannya waktu, penggunaan bahasa daerah mulai memudar. 
            TonseaEdu hadir khususnya untuk siswa SMP di Minahasa Utara, merajut kembali keterikatan 
            kaum muda dengan identitas mereka melalui <strong className="text-slate-900">Bahasa Tonsea</strong>.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
             {[
              { title: "Kearifan Lokal", desc: "Melestarikan nilai luhur Minahasa Utara." },
              { title: "Identitas Budaya", desc: "Meningkatkan rasa bangga sejak usia remaja." },
              { title: "Kognitif Aktif", desc: "Mengasah otak melalui akuisisi bahasa baru." },
              { title: "Teknologi Modern", desc: "Pendekatan digital yang disukai pelajar." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 text-blue-600">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Fitur Section */}
  <section id="fitur" className="relative py-24 px-6 w-full overflow-hidden bg-[linear-gradient(to_bottom,#f8fafc_0%,#eef2ff_100%)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_22%)]"></div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-5">
          <Sparkles size={16} className="text-blue-600" />
          Fitur Utama
        </div>
      </div>
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <BookOpen size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Pengalaman belajar</p>
              <h4 className="text-2xl font-black text-slate-950 tracking-tight">Satu tampilan, banyak manfaat</h4>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed mb-8">
            TonseaEdu memadukan materi, audio, kuis, dan kompetisi.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Materi", value: "Interaktif" },
              { label: "Audio", value: "Pelafalan" },
              { label: "Kuis", value: "Real-time" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
          {[
            { icon: BookOpen, title: "Materi Interaktif", desc: "Modul teks adaptif yang disusun rapi, mudah dibaca, dan jauh dari kata membosankan.", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
            { icon: Headphones, title: "Audio Pembelajaran", desc: "Fitur putar audio untuk memastikan pelafalan kosakatamu tepat seperti penutur asli.", color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200" },
            { icon: Activity, title: "Kuis Menantang", desc: "Latihan soal dan kuis berbatas waktu yang menstimulasi adrenalin belajarmu.", color: "text-green-600", bg: "bg-green-100", border: "border-green-200" },
            { icon: Trophy, title: "Sistem Leaderboard", desc: "Kumpulkan poin setiap selesai kuis. Jadilah peringkat 1 di seluruh sekolah!", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" },
            { icon: Users, title: "Jejaring Kompetitif", desc: "Ajak dan tantang teman-teman sekelasmu untuk adu pengetahuan bahasa Tonsea.", color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200" }
          ].map((feature, i) => (
            <div key={i} className={`group rounded-[2rem] border ${feature.border} bg-white/95 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} flex items-center justify-center rounded-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon size={28} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-950 mb-2 leading-snug">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
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