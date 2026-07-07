import StudentShell from "@/components/StudentShell";

export default function KosakataLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}