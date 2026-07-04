"use client";

import Link from "next/link";
import {
  Library,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Activity,
  Trophy,
  Headphones,
  MonitorPlay,
  Target,
  GraduationCap,
  Users,
  Globe,
} from "lucide-react";

const quickFacts = [
  { value: "20+", label: "Materi" },
  { value: "150+", label: "Soal Kuis" },
  { value: "500+", label: "Pengguna" },
];

const pillars = [
  {
    icon: BookOpen,
    title: "Materi terstruktur",
    description: "Urutan belajar dibuat bertahap agar siswa tidak lompat-lompat di tengah proses.",
  },
  {
    icon: Headphones,
    title: "Audio pelafalan",
    description: "Setiap kosakata bisa dipelajari lewat suara agar pengucapan lebih akurat.",
  },
  {
    icon: MonitorPlay,
    title: "Belajar visual",
    description: "Video dan ilustrasi membantu materi terasa lebih hidup dan mudah diingat.",
  },
  {
    icon: Target,
    title: "Evaluasi jelas",
    description: "Kuis dirancang untuk memberi umpan balik cepat atas pemahaman siswa.",
  },
];

const benefits = [
  {
    icon: GraduationCap,
    title: "Belajar fleksibel",
    description: "Bisa diakses kapan saja tanpa bergantung pada ruang kelas.",
  },
  {
    icon: Users,
    title: "Mudah dipakai",
    description: "Antarmuka sederhana agar fokus siswa tetap pada konten belajar.",
  },
  {
    icon: Activity,
    title: "Interaktif",
    description: "Materi, kuis, dan progres terasa satu alur, bukan halaman terpisah yang kaku.",
  },
  {
    icon: Globe,
    title: "Pelestarian bahasa",
    description: "Membantu menjaga Bahasa Tonsea tetap hidup di ruang digital.",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Materi Pembelajaran",
    description: "Pembahasan disusun dari dasar hingga lanjutan agar alurnya terasa natural.",
  },
  {
    icon: Headphones,
    title: "Audio Pelafalan",
    description: "Siswa dapat mendengar pengucapan yang benar pada setiap kosakata.",
  },
  {
    icon: MonitorPlay,
    title: "Video Pembelajaran",
    description: "Konten visual dipakai seperlunya untuk memperjelas konsep, bukan sekadar dekorasi.",
  },
  {
    icon: Library,
    title: "Kosakata",
    description: "Daftar kosakata dilengkapi arti dan konteks penggunaan yang mudah dibaca.",
  },
  {
    icon: Target,
    title: "Kuis Interaktif",
    description: "Latihan singkat untuk mengukur pemahaman tanpa membuat halaman terasa berat.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description: "Peringkat dibuat sebagai motivasi ringan, bukan elemen yang mendominasi halaman.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.09),_transparent_26%),linear-gradient(to_bottom,_#ffffff_0%,_#f8fafc_45%,_#f8fafc_100%)] text-slate-800">
      <div className="hidden md:block border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-6">
            <a href="mailto:tonseaedu@gmail.com" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <Mail size={15} />
              tonseaedu@gmail.com
            </a>
            <span className="flex items-center gap-2">
              <Phone size={15} />
              +62 898 003 5886
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} />
              Minahasa Utara
            </span>
          </div>
          <span>Bahasa Tonsea, dibuat lebih dekat untuk siswa SMP.</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm shadow-slate-900/10">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-950">
                TonseaEdu
              </h1>
              <p className="text-xs text-slate-500">
                Platform Edukasi Bahasa Tonsea
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-600">
            <a href="#beranda" className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-colors">
              Beranda
            </a>
            <a href="#tentang" className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-colors">
              Tentang
            </a>
            <a href="#fitur" className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-colors">
              Fitur
            </a>
            <a href="#statistik" className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-colors">
              Statistik
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:inline-flex text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">
              Masuk
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 transition-all">
              Mulai Belajar
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="beranda" className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(to_bottom,rgba(148,163,184,0.08),transparent)]" />
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 relative">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  <Sparkles size={15} />
                  Platform edukasi yang tenang, jelas, dan fokus
                </div>
                <h2 className="mt-6 text-5xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[0.95]">
                  Belajar
                  <br />
                  Bahasa Tonsea
                  <br />
                </h2>
                <p className="mt-7 text-lg leading-8 text-slate-600 max-w-xl">
                  TonseaEdu dirancang sebagai ruang belajar yang rapi untuk siswa SMP, dengan alur yang tidak memaksa, visual yang bersih, dan konten yang mudah dipahami melalui materi, audio, video, serta kuis interaktif.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                    Mulai Belajar
                    <ChevronRight size={18} />
                  </Link>
                  <a href="#tentang" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                    Pelajari Selengkapnya
                  </a>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-5 max-w-xl">
                  {quickFacts.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                      <div className="text-3xl font-black tracking-tight text-slate-950">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-10 hidden xl:block h-24 w-24 rounded-full bg-blue-100/70 blur-2xl" />
                <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr] items-stretch">
                    <div className="rounded-[1.5rem] bg-slate-950 text-white p-6 flex flex-col justify-between min-h-[520px]">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
                          <BookOpen size={14} />
                          Fokus belajar
                        </div>
                        <h3 className="mt-6 text-2xl font-bold leading-tight">
                          Konten yang tenang, tidak ramai, dan mudah dipindai.
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          Struktur visual dibuat seperti catatan belajar yang rapi, bukan dashboard yang penuh hiasan.
                        </p>
                      </div>
                      <div className="space-y-3 pt-8">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-200">
                            <Activity size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">Progress belajar</div>
                            <div className="text-xs text-slate-400">Alur yang jelas dan bertahap</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-200">
                            <Trophy size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">Motivasi kecil</div>
                            <div className="text-xs text-slate-400">Peringkat untuk dorongan, bukan distraksi</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_38%)]" />
                      <div className="relative">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
                          <div className="h-56 bg-[linear-gradient(145deg,#0f172a_0%,#1d4ed8_55%,#dbeafe_100%)] p-6 flex flex-col justify-between text-white">
                            <div className="flex items-center justify-between">
                              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-50">
                                <Sparkles size={14} />
                                Belajar lebih tenang
                              </div>
                              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                                TonseaEdu
                              </div>
                            </div>
                            <div>
                              <div className="text-sm uppercase tracking-[0.25em] text-blue-100/80">Preview materi</div>
                              <div className="mt-3 text-2xl font-black leading-tight max-w-xs">
                                Pelajari kosakata, dengar pelafalan, lalu lanjut ke kuis.
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-0 border-t border-slate-200">
                            <div className="p-4 border-r border-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Audio</div>
                              <div className="mt-2 font-semibold text-slate-950">Jelas</div>
                            </div>
                            <div className="p-4 border-r border-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Video</div>
                              <div className="mt-2 font-semibold text-slate-950">Ringkas</div>
                            </div>
                            <div className="p-4">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Kuis</div>
                              <div className="mt-2 font-semibold text-slate-950">Aktif</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Audio</div>
                            <div className="mt-2 font-semibold text-slate-950">Pelafalan jelas</div>
                            <div className="mt-1 text-sm text-slate-500">Mendengar lalu meniru dengan tepat.</div>
                          </div>
                          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Video</div>
                            <div className="mt-2 font-semibold text-slate-950">Belajar visual</div>
                            <div className="mt-1 text-sm text-slate-500">Materi dibaca lebih cepat oleh mata.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tentang" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.92fr_1.08fr] gap-14 items-start">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                Tentang Platform
              </p>
              <h3 className="mt-4 text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                Bukan sekadar aplikasi belajar, tapi ruang belajar yang lebih tertata.
              </h3>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                TonseaEdu dikembangkan untuk membantu siswa SMP mempelajari Bahasa Tonsea dengan cara yang lebih efektif melalui materi yang terstruktur, audio pelafalan, video pembelajaran, latihan soal, dan kuis interaktif.
              </p>
              <p className="mt-5 text-slate-600 leading-8">
                Alih-alih menumpuk elemen visual, pendekatan desainnya dibuat lebih tenang agar konten jadi pusat perhatian.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className={`rounded-[1.5rem] border p-6 shadow-sm ${index === 0 ? "bg-slate-950 text-white border-slate-950 sm:col-span-2" : "bg-white border-slate-200"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${index === 0 ? "bg-white/10 text-blue-200" : "bg-blue-50 text-blue-700"}`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold tracking-tight">{pillar.title}</h4>
                        <p className={`mt-2 text-sm leading-6 ${index === 0 ? "text-slate-300" : "text-slate-500"}`}>
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="fitur" className="py-28 lg:py-36 bg-white border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                Fitur Platform
              </p>
              <h3 className="mt-4 text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                Fitur yang terasa berguna, bukan hanya penuh kotak.
              </h3>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Setiap fitur diberi ruang yang cukup agar pengguna memahami manfaatnya tanpa harus membaca terlalu banyak elemen yang bersaing.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const featured = index === 0;
                return (
                  <article
                    key={feature.title}
                    className={`rounded-[1.75rem] border p-7 transition-all ${featured ? "md:col-span-2 xl:col-span-1 bg-slate-950 text-white border-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.15)]" : "bg-white border-slate-200 hover:border-slate-300 hover:-translate-y-1"}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${featured ? "bg-white/10 text-blue-200" : "bg-blue-50 text-blue-700"}`}>
                      <Icon size={26} />
                    </div>
                    <h4 className="mt-6 text-xl font-bold tracking-tight">{feature.title}</h4>
                    <p className={`mt-3 text-sm leading-7 ${featured ? "text-slate-300" : "text-slate-600"}`}>
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="statistik" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] text-white overflow-hidden">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-0">
                <div className="p-8 lg:p-12">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                    Statistik Platform
                  </p>
                  <h3 className="mt-4 text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Pembelajaran yang terasa hadir, bukan sekadar angka di halaman.
                  </h3>
                  <p className="mt-6 max-w-2xl text-slate-300 leading-8">
                    TonseaEdu terus berkembang sebagai media pembelajaran yang membantu siswa dan guru mengakses materi, kosakata, dan latihan dalam satu tempat.
                  </p>

                  <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      ["20+", "Materi"],
                      ["150+", "Soal Kuis"],
                      ["500+", "Pengguna"],
                      ["100%", "Berbasis Web"],
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur-sm">
                        <div className="text-3xl font-black tracking-tight text-white">{value}</div>
                        <div className="mt-1 text-sm text-slate-300">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t lg:border-t-0 lg:border-l border-white/10 p-8 lg:p-12 flex flex-col justify-between bg-white/5">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
                      <Sparkles size={14} />
                      Apa yang terasa beda
                    </div>
                    <div className="mt-8 space-y-5">
                      {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                          <div key={benefit.title} className="flex gap-4 rounded-2xl bg-white/5 p-4">
                            <div className="mt-0.5 w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-blue-200 shrink-0">
                              <Icon size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{benefit.title}</h4>
                              <p className="mt-1 text-sm leading-6 text-slate-300">{benefit.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-sm">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                  Mulai Belajar
                </p>
                <h3 className="mt-4 text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                  Mari lestarikan Bahasa Tonsea dengan pengalaman belajar yang lebih nyaman.
                </h3>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Bergabunglah bersama TonseaEdu dan gunakan platform yang dirancang untuk membuat materi terasa lebih mudah diikuti.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-white font-semibold hover:bg-slate-800 transition-colors">
                  Mulai Belajar
                </Link>
                <a href="#fitur" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Lihat Fitur
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white w-11 h-11 rounded-2xl flex items-center justify-center">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white">
                    TonseaEdu
                  </h2>
                  <p className="text-sm text-slate-400">
                    Platform Pembelajaran
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-md leading-8 text-slate-400">
                Platform pembelajaran Bahasa Tonsea berbasis web yang membantu siswa SMP mempelajari bahasa daerah secara lebih tertata, interaktif, dan mudah dipahami.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-5">Navigasi</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#tentang" className="hover:text-white transition-colors">Tentang</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#statistik" className="hover:text-white transition-colors">Statistik</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-5">Fitur</h3>
              <ul className="space-y-3 text-slate-400">
                <li>Materi</li>
                <li>Kosakata</li>
                <li>Video Pembelajaran</li>
                <li>Kuis Interaktif</li>
                <li>Leaderboard</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-5">Kontak</h3>
              <div className="space-y-4 text-slate-400">
                <a href="mailto:tonseaedu@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail size={18} className="text-blue-400" />
                  tonseaedu@gmail.com
                </a>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-400" />
                  <span>+62 898 003 5886</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-blue-400" />
                  <span>Minahasa Utara, Sulawesi Utara</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-white/10 pt-8 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-slate-500">
            <p>© {new Date().getFullYear()} TonseaEdu. Semua hak dilindungi.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
