import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/client'
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Démarrage du script de création d\'admin...');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(' Erreur : Les variables ADMIN_EMAIL et ADMIN_PASSWORD sont requises.');
    process.exit(1);
  }

  console.log(`Hashage du mot de passe pour ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 10);


  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      role: 'ADMIN',          
      password: hashedPassword, 
      status: 'ACTIVE',
    },
    create: {
      email: email,
      password: hashedPassword,
      name: 'Admin',
      lastname: 'System',
      role: 'ADMIN',
      status: 'ACTIVE',
      address: 'Siège Administratif',
      zipCode: '00000',
      city: 'AdminCity',
      phone: '0000000000',
      birthdate: new Date('2000-01-01'), 
      showPhoneDirectory: false,
      showEmailDirectory: false,
    },
  });

  console.log(`Succès ! L'utilisateur ${user.email} est maintenant ADMIN (ID: ${user.id}).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Une erreur est survenue :', e);
    await prisma.$disconnect();
    process.exit(1);
  });