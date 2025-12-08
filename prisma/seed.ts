import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';

// On importe les types si nécessaire, ou on les définit en dur pour le seed
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

  // Admin Alice
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

  // 50 Utilisateurs
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
        birthdate: faker.date.past()
      },
    });
  }

  // --- PARTIE 2 : ÉVÉNEMENTS ---
  console.log('... Génération de 50 événements');

  const eventTypes = Object.values(EventType); // Récupère ['TRAIL', 'COURSE_ROUTE', ...]
  const pivotDate = new Date('2025-12-08T00:00:00.000Z'); // Date pivot demandée

  for (let i = 0; i < 50; i++) {
    // Logique de date : 30 avant le 08/12/25, 20 après
    let dateStart: Date;
    
    if (i < 30) {
        // 30 événements PASSÉS ou FUTURS PROCHES (Avant le 08/12/2025)
        // On génère une date entre il y a 1 an et le pivot
        dateStart = faker.date.between({ 
            from: new Date('2024-01-01'), 
            to: pivotDate 
        });
    } else {
        // 20 événements FUTURS (Après le 08/12/2025)
        dateStart = faker.date.future({ 
            years: 1, 
            refDate: pivotDate 
        });
    }

    // On crée une date de fin (ex: 2 à 5 heures après le début)
    const dateEnd = new Date(dateStart);
    dateEnd.setHours(dateEnd.getHours() + faker.number.int({ min: 2, max: 5 }));

    // Choix d'un type aléatoire
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    await prisma.event.create({
      data: {
        title: faker.lorem.sentence(3), // Ex: "Course du Dimanche"
        description: faker.lorem.paragraph(),
        // On utilise une image LoremFlickr de sport pour faire joli
        imgUrl: faker.image.urlLoremFlickr({ category: 'sports' }), 
        location: faker.location.city(),
        type: randomType,
        dateStart: dateStart,
        dateEnd: dateEnd,
        visibility: 'PUBLIC', // Par défaut
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