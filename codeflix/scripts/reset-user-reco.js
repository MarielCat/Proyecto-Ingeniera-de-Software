// scripts/reset-user-reco.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function resetUserReco(userId) {
  await prisma.$transaction([
    prisma.userClick.deleteMany({ where: { userId } }),
    prisma.userSearch.deleteMany({ where: { userId } }),
  ]);
  console.log(`Señales reseteadas para userId=${userId}`);
}

const userId = Number(process.argv[2]);
if (!Number.isFinite(userId)) {
  console.error("Uso: npm run reset:reco -- <userId>");
  process.exit(1);
}

resetUserReco(userId)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
