const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error('Usage: node prisma/create_admin.js <email> <password>');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const username = String(email).trim().toLowerCase();
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        password: hashed,
        email: username,
        role: 'admin',
        namaLengkap: 'Admin TonseaEdu',
      },
      create: {
        namaLengkap: 'Admin TonseaEdu',
        username,
        email: username,
        password: hashed,
        role: 'admin',
      },
    });

    console.log('Admin account created/updated:', user.username);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
