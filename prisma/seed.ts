import { PrismaClient } from '@prisma/client';

// Kita paksa masukkan URL langsung ke dalam konstruktor dengan casting 'as any'
// agar tidak terkena validasi "Unknown Property" maupun "Empty Options"
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:priskila8@localhost:5432/tonsea?schema=public"
    }
  }
} as any);

async function main() {
  console.log("🚀 Menghubungkan langsung ke PostgreSQL...");

  const category = await prisma.category.upsert({
    where: { slug: "dasar" },
    update: {},
    create: {
      name: "Kosakata Dasar",
      slug: "dasar",
      description: "Belajar kata-kata sehari-hari bahasa Tonsea.",
    },
  });

  // ========== SEED MATERI ==========
  await prisma.materi.deleteMany({
    where: { categoryId: category.id }
  });

  const materiAngka = await prisma.materi.create({
    data: {
      judul: "Pengenalan Angka Dasar",
      konten: "Dalam bahasa Tonsea, angka mirip dengan bahasa-bahasa di rumpun Minahasa lainnya. Contoh: Esa (1), Zua (2), Telu (3), Epat (4), Lima (5).",
      categoryId: category.id,
      sequence: 1,
    }
  });

  const materiKerja = await prisma.materi.create({
    data: {
      judul: "Kata Kerja Sehari-hari",
      konten: "Beberapa kata kerja dasar yang sering digunakan: Kuman (Makan), Tudu (Tidur), Mangeran (Berjalan).",
      categoryId: category.id,
      sequence: 2,
    }
  });

  // ========== SEED KOSAKATA (Dengan Audio Placeholder) ==========
  await prisma.kosakata.deleteMany({
    where: { categoryId: category.id }
  });

  await prisma.kosakata.createMany({
    data: [
      {
        tonsea: "Esa",
        indonesia: "Satu",
        audioUrl: "/audio/esa.mp3",
        categoryId: category.id,
      },
      {
        tonsea: "Zua",
        indonesia: "Dua",
        audioUrl: "/audio/zua.mp3",
        categoryId: category.id,
      },
      {
        tonsea: "Kuman",
        indonesia: "Makan",
        audioUrl: "/audio/kuman.mp3",
        categoryId: category.id,
      },
      {
        tonsea: "Tudu",
        indonesia: "Tidur",
        audioUrl: "/audio/tudu.mp3",
        categoryId: category.id,
      },
      {
        tonsea: "Meimo",
        indonesia: "Mari / Ayo",
        audioUrl: "/audio/meimo.mp3",
        categoryId: category.id,
      }
    ]
  });

  // ========== SEED KUIS ==========
  await prisma.question.deleteMany({
    where: { categoryId: category.id }
  });

  await prisma.question.createMany({
    data: [
      {
        pertanyaan: "Esa",
        correctAnswer: "Satu",
        options: ["Satu", "Dua", "Tiga", "Empat"],
        categoryId: category.id,
        materiId: materiAngka.id,
      },
      {
        pertanyaan: "Kuman",
        correctAnswer: "Makan",
        options: ["Minum", "Makan", "Tidur", "Jalan"],
        categoryId: category.id,
        materiId: materiKerja.id,
      },
      {
        pertanyaan: "Tudu",
        correctAnswer: "Tidur",
        options: ["Mandi", "Duduk", "Tidur", "Berdiri"],
        categoryId: category.id,
        materiId: materiKerja.id,
      },
    ],
  });

  console.log("✅ SEED BERHASIL! Data sudah masuk.");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
