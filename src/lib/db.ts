import { PrismaClient } from '@prisma/client';

// 1. Manual Injection DATABASE_URL
// Memastikan koneksi tersedia bahkan jika Turbopack/Next.js gagal membaca file .env
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:priskila8@localhost:5432/tonsea?schema=public";
}

// 2. Singleton Pattern
// Mencegah "Too many connections" pada PostgreSQL saat Hot Reload di mode development
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// 3. Global Type Definition
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// 4. Inisialisasi Instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// 5. Simpan instance ke Global Object (khusus development)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}