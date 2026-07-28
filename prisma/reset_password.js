const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  const newPassword = process.argv[3];

  if (!username || !newPassword) {
    console.log('Usage: node prisma/reset-password.js <username> <password_baru>');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.user.update({
    where: { username },
    data: { password: hashedPassword },
  });

  console.log(`Password untuk user "${updated.username}" berhasil diperbarui.`);
}

main()
  .catch((e) => {
    console.error('Gagal update password:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
