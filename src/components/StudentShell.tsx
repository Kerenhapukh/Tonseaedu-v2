"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const adminRole = (localStorage.getItem("tonsea_admin_role") || "").toLowerCase();

    if (localStorage.getItem("tonsea_admin")) {
      router.replace(adminRole === "guru" ? "/guru" : "/admin");
      return;
    }

    const userRole = (localStorage.getItem("tonsea_user_role") || "siswa").toLowerCase();
    if (!localStorage.getItem("tonsea_user") || userRole !== "siswa") {
      router.replace("/login?role=siswa");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="hidden md:block py-8 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
        TonseaEdu — Lestarikan Budaya Minahasa Utara
      </footer>
    </>
  );
}