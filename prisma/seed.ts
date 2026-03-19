import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';
import { PrismaClient } from './generated/client'; // Assurez-vous du chemin
import { Role, Status, EventType } from './generated/enums'; // Assurez-vous du chemin

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début du seeding...');

  // --- OPTIONNEL : Nettoyage de la base de données ---
  // Attention : Ceci vide vos tables pour repartir à zéro.
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.legalDocs.deleteMany();
  await prisma.user.deleteMany();

  // --- PARTIE 1 : UTILISATEURS ---
  console.log('👥 Création des utilisateurs...');
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const createdUsers = [];

  // 1. Admin Alice
  const admin = await prisma.user.create({
    data: {
      email: 'alice@foulees.com',
      name: 'Alice',
      lastname: 'Wonderland',
      password: hashedPassword,
      role: Role.ADMIN,
      status: Status.ACTIVE,
      phone: "0612345678",
      address: "1 rue des Merveilles",
      zipCode: "49240",
      city: "Avrillé",
      birthdate: new Date("1990-01-01")
    },
  });
  createdUsers.push(admin);

  // 2. 50 Utilisateurs fictifs
  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        name: firstName,
        lastname: lastName,
        password: hashedPassword,
        role: Role.USER,
        status: Status.ACTIVE,
        phone: faker.phone.number(),
        birthdate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode('#####'),
        city: faker.location.city()
      },
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} utilisateurs créés.`);

  // --- PARTIE 2 : ÉVÉNEMENTS (Passés et Futurs) ---
  console.log('📅 Création des événements...');
  const eventsData = [
    // --- PASSÉS ---
    {
      title: "Marathon de la Loire 2023",
      dateStart: new Date('2023-05-14T08:00:00'),
      dateEnd: new Date('2023-05-14T14:00:00'),
      location: "Saumur (49)",
      type: EventType.COURSE_ROUTE,
      description: "Notre sortie club historique sur les bords de la Loire.",
      imgUrl: "/uploads/telethon.jpg", // Remplacez par une vraie image si besoin
      distances: ["10km", "Semi-Marathon", "Marathon"]
    },
    {
      title: "Trail de Noël 2024",
      dateStart: new Date('2024-12-20T19:00:00'),
      dateEnd: new Date('2024-12-20T21:30:00'),
      location: "Bois d'Avrillé",
      type: EventType.ENTRAINEMENT,
      description: "Dernier entraînement festif de l'année avec vin chaud à l'arrivée !",
      imgUrl: "/uploads/apocalipsis.png",
      distances: ["5km", "10km"]
    },
    // --- FUTURS PROCHES ---
    {
      title: "Sortie dominicale - Bords de Mayenne",
      dateStart: faker.date.soon({ days: 15 }), // Dans les 15 prochains jours
      dateEnd: null,
      location: "Cantenay-Épinard (49)",
      type: EventType.SORTIE,
      description: "Sortie longue de préparation. Allure footing.",
      imgUrl: "/uploads/labaie.webp",
      distances: ["15km", "22km"]
    },
    // --- FUTURS LOINTAINS ---
    {
      title: "Trail de l'apocalypse",
      dateStart: new Date('2025-11-15T20:00:00'),
      dateEnd: new Date('2025-11-15T23:30:00'),
      location: "Angers (49)",
      type: EventType.TRAIL,
      description: "Une course nocturne et urbaine légendaire à travers les rues d'Angers.",
      imgUrl: "/uploads/apocalipsis.png",
      distances: ["9km", "15km"]
    },
    {
      title: "Téléthon défi 24h",
      dateStart: new Date('2025-12-05T18:00:00'),
      dateEnd: new Date('2025-12-06T18:00:00'),
      location: "Stade d'Avrillé",
      type: EventType.VIE_DU_CLUB,
      description: "24 heures de course en relais pour la bonne cause.",
      imgUrl: "/uploads/telethon.jpg",
      distances: ["Libre"]
    },
    {
      title: "Trail Cap Sizun",
      dateStart: new Date('2026-03-01T08:30:00'),
      dateEnd: null,
      location: "Cléden-Cap-Sizun (29)",
      type: EventType.TRAIL,
      description: "Un parcours époustouflant à la pointe du Finistère.",
      imgUrl: "/uploads/capsizun.jpg",
      distances: ["14km", "28km", "50km"]
    }
  ];

  const createdEvents = [];
  for (const event of eventsData) {
    const newEvent = await prisma.event.create({ data: event });
    createdEvents.push(newEvent);
  }
  console.log(`✅ ${createdEvents.length} événements créés.`);

  // --- PARTIE 3 : INSCRIPTIONS AUX ÉVÉNEMENTS ---
  console.log('🏃‍♂️ Génération des inscriptions (EventRegistrations)...');
  
  for (const event of createdEvents) {
    // Choisir un nombre aléatoire de participants (entre 5 et 30)
    const numParticipants = faker.number.int({ min: 5, max: 30 });
    
    // Mélanger les utilisateurs et prendre les X premiers pour éviter les doublons sur un même événement
    const shuffledUsers = faker.helpers.shuffle(createdUsers);
    const participants = shuffledUsers.slice(0, numParticipants);

    for (const user of participants) {
      // Choisir une distance au hasard si l'événement en propose
      let selectedDistance = null;
      if (event.distances && event.distances.length > 0) {
        selectedDistance = faker.helpers.arrayElement(event.distances);
      }

      await prisma.eventRegistration.create({
        data: {
          eventId: event.id,
          userId: user.id,
          distance: selectedDistance,
        }
      });
    }
    console.log(`  -> ${numParticipants} inscrits pour "${event.title}"`);
  }

  // --- PARTIE 4 : DOCUMENTS LÉGAUX ---
  console.log('📄 Création des documents légaux...');
  const documents = [
    { title: "Autorisation Parentale 2024-2025", description: "Formulaire obligatoire pour l'inscription des mineurs.", Url: "/uploads/docs/Autorisation_parentale_2024_2025.pdf" },
    { title: "Bulletin d'Adhésion 2025-2026", description: "Le formulaire complet pour votre inscription.", Url: "/uploads/docs/Bulletin_d-adhésion_2025_2026.pdf" }
  ];

  for (const doc of documents) {
    await prisma.legalDocs.create({ data: doc });
  }

  console.log('🚀 Seeding terminé avec succès ! Votre base est riche et prête.');
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