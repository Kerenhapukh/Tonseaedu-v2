import StudentShell from "@/components/StudentShell";

export default function MateriLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}