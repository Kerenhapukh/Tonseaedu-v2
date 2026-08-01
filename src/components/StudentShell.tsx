"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const ready = status === "authenticated" && session?.user?.role === "siswa";

  useEffect(() => {
    if (status === "loading") return;
    if (!ready) router.replace("/login?role=siswa");
  }, [status, ready, router]);

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
