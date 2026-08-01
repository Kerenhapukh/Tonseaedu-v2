import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

class LoginError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Identifier" },
        password: { label: "Password", type: "password" },
        role: { label: "Role" },
      },
      async authorize(credentials) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");
        const role = String(credentials?.role ?? "").trim().toLowerCase();

        if (!identifier || !password || !["admin", "guru", "siswa"].includes(role)) {
          throw new LoginError("Akun tidak ditemukan");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: { equals: identifier, mode: "insensitive" } },
              { email: { equals: identifier, mode: "insensitive" } },
              ...(role === "siswa"
                ? [{ namaLengkap: { equals: identifier, mode: "insensitive" as const } }]
                : []),
            ],
          },
        });

        if (!user) {
          throw new LoginError("Akun tidak ditemukan");
        }

        const userRole = String(user.role).toLowerCase();
        if (userRole !== role) {
          throw new LoginError(
            role === "siswa" ? "Akun ini bukan akun siswa" : "Peran tidak sesuai untuk akun ini"
          );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new LoginError(role === "siswa" ? "Password salah" : "Invalid credentials");
        }

        return {
          id: String(user.id),
          name: user.namaLengkap,
          username: user.username,
          role: user.role,
          kelas: user.kelas,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.username = user.username;
        token.kelas = user.kelas;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.username = token.username as string;
      session.user.kelas = token.kelas as string | null;
      return session;
    },
  },
});
