import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg';
import * as crypto from 'crypto';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter })

async function hashScrypt(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            // Store the hash along with the salt and parameters in a single string format
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
    return hash as string;
}
async function main() {
  // User 1: Alice
  console.log('🌱 Début du seeding...')
  const plainPassword = '987654'; 
  const hashedPassword = await hashScrypt(plainPassword);
  const user = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      lastname: 'Wonderland', // Required field based on your schema
      password: hashedPassword,     // Required field
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