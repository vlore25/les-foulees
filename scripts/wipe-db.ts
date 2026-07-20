import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/client'
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Nettoyage des données...');
  await prisma.eventRegistration.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.event.deleteMany();
  await prisma.season.deleteMany();
  await prisma.legalDocs.deleteMany();
  console.log('Base de données remise à zéro (SiteConfig préservé).');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
