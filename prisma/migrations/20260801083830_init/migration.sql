-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "kelas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "namaSekolah" TEXT,
    "nomorTelepon" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materi" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kelas" TEXT,
    "bab" TEXT,
    "ringkasan" TEXT,
    "videoUrl" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "materi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kosakata" (
    "id" SERIAL NOT NULL,
    "tonsea" TEXT NOT NULL,
    "indonesia" TEXT NOT NULL,
    "audioUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kelas" TEXT,

    CONSTRAINT "kosakata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "options" TEXT[],
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kelas" TEXT,
    "materiId" INTEGER,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "kelas" TEXT,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materi_progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "materiId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "quizScore" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materi_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "questions_materiId_idx" ON "questions"("materiId");

-- CreateIndex
CREATE INDEX "scores_username_idx" ON "scores"("username");

-- CreateIndex
CREATE INDEX "materi_progress_userId_idx" ON "materi_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "materi_progress_userId_materiId_key" ON "materi_progress"("userId", "materiId");

-- AddForeignKey
ALTER TABLE "materi" ADD CONSTRAINT "materi_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kosakata" ADD CONSTRAINT "kosakata_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "materi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi_progress" ADD CONSTRAINT "materi_progress_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "materi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi_progress" ADD CONSTRAINT "materi_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
