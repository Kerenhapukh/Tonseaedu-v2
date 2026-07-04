import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.materi.findMany().then(console.log).finally(() => prisma.$disconnect());