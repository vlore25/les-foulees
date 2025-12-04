import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker'; // On importe la version française directement

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Début du seeding...')

  // Mot de passe crypté unique pour tous les utilisateurs de test (pour se connecter facilement)
  const plainPassword = '987654'; 
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 1. Création de l'admin fixe (Alice)
  await prisma.user.upsert({
    where: { email: 'alice@foulees.com' },
    update: {},
    create: {
      email: 'alice@foulees.com',
      name: 'Alice',
      lastname: 'Wonderland',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin Alice créé.');

  // 2. Génération de 50 utilisateurs avec Faker
  console.log('... Génération de 50 utilisateurs fictifs');
  
  for (let i = 0; i < 50; i++) {
    // Générer un prénom et un nom en français
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    // Générer un email cohérent avec le nom/prénom
    const email = faker.internet.email({ firstName, lastName });

    await prisma.user.create({
      data: {
        email: email,
        name: firstName,
        lastname: lastName,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE',
        phone: faker.phone.number(),
        birthdate: faker.date.past()
      },
    });
  }

  console.log('🚀 Seeding terminé avec succès !')
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