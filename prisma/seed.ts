import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';

enum EventType {
  TRAIL = 'TRAIL',
  COURSE_ROUTE = 'COURSE_ROUTE',
  ENTRAINEMENT = 'ENTRAINEMENT',
  VIE_DU_CLUB = 'VIE_DU_CLUB',
  SORTIE = 'SORTIE',
  AUTRE = 'AUTRE'
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Début du seeding...')

  // --- PARTIE 1 : UTILISATEURS ---
  const plainPassword = '987654'; 
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 1. Admin Alice (Correction : Ajout des champs obligatoires)
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
      // 👇 AJOUTS OBLIGATOIRES (Données en dur pour l'admin)
      phone: "0612345678",
      address: "1 rue des Merveilles", // Attention à l'orthographe 'adress' vs 'address' selon ton schema
      zipCode: "49240",
      city: "Avrillé",
      birthdate: new Date("1990-01-01")
    },
  });
  console.log('✅ Admin Alice créé.');

  // 2. 50 Utilisateurs (Correction : Génération des champs manquants)
  console.log('... Génération de 50 utilisateurs fictifs');
  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
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
        birthdate: faker.date.past(),
        address: faker.location.streetAddress(), 
        zipCode: faker.location.zipCode('#####'),
        city: faker.location.city()
      },
    });
  }

  // --- PARTIE 2 : ÉVÉNEMENTS ---
  console.log('... Génération de 50 événements');

  const eventTypes = Object.values(EventType); 
  const pivotDate = new Date('2025-12-08T00:00:00.000Z'); 

  for (let i = 0; i < 50; i++) {
    let dateStart: Date;
    
    if (i < 30) {
        // 30 événements PASSÉS ou FUTURS PROCHES
        dateStart = faker.date.between({ 
            from: new Date('2024-01-01'), 
            to: pivotDate 
        });
    } else {
        // 20 événements FUTURS
        dateStart = faker.date.future({ 
            years: 1, 
            refDate: pivotDate 
        });
    }

    const dateEnd = new Date(dateStart);
    dateEnd.setHours(dateEnd.getHours() + faker.number.int({ min: 2, max: 5 }));

    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    await prisma.event.create({
      data: {
        title: faker.lorem.sentence(3),
        description: faker.lorem.paragraph(),
        imgUrl: faker.image.urlLoremFlickr({ category: 'sports' }), 
        location: faker.location.city(),
        type: randomType, // Assure-toi que ton Prisma Schema a bien cet Enum, sinon utilise type: "TRAIL"
        dateStart: dateStart,
        dateEnd: dateEnd,
        visibility: 'PUBLIC',
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