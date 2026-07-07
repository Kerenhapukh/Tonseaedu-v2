import StudentShell from "@/components/StudentShell";

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}