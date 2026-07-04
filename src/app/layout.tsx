"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noNavbarPages = ["/", "/login", "/register"]; 
  const isAuthPage = noNavbarPages.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const showNavbar = !isAuthPage && !isAdminPage;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {showNavbar && <Navbar />}
        
        <main className="flex-1">
          {children}
        </main>

        {showNavbar && (
          <footer className="hidden md:block py-8 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
             TonseaEdu — Lestarikan Budaya Minahasa Utara
          </footer>
        )}
      </body>
    </html>
  );
}