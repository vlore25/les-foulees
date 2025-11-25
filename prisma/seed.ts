import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg';


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter })

async function main() {
  // User 1: Alice
  console.log('🌱 Début du seeding...')
  const user = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      lastname: 'Wonderland', // Required field based on your schema
      password: '987654',     // Required field
      role: 'ADMIN',
    },
    
  })
  console.log(`✅ Utilisateur créé avec l'id: ${user.id}`)
  console.log('🚀 Seeding terminé !')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })