import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';
import { PrismaClient } from '../prisma/generated/client'

const EventType = {
  TRAIL: 'TRAIL',
  COURSE_ROUTE: 'COURSE_ROUTE',
  ENTRAINEMENT: 'ENTRAINEMENT',
  VIE_DU_CLUB: 'VIE_DU_CLUB',
  SORTIE: 'SORTIE',
  AUTRE: 'AUTRE'
} as const;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Début du seeding...')


  // --- PARTIE 2 : ÉVÉNEMENTS ---
  const events = [
    {
      title: "Trail de l'apocalypse",
      dateStart: new Date('2025-11-15T20:00:00'),
      dateEnd: new Date('2025-11-15T23:30:00'),
      location: "Angers (49)",
      type: EventType.TRAIL,
      description: "Une course nocturne et urbaine légendaire à travers les rues d'Angers. Préparez-vous à affronter les marches, les pavés et l'ambiance apocalyptique !",
      imgUrl: "/uploads/apocalipsis.png", 
    },
    {
      title: "Téléthon défi 24h",
      dateStart: new Date('2025-12-05T18:00:00'), 
      dateEnd: new Date('2025-12-06T18:00:00'),  
      location: "Stade d'Avrillé",
      type: EventType.VIE_DU_CLUB,
      description: "Rejoignez-nous pour le grand défi du Téléthon ! 24 heures de course en relais pour la bonne cause. Venez courir ou marcher à n'importe quelle heure du jour ou de la nuit.",
      imgUrl: "/uploads/telethon.jpg",
    },
    {
      title: "Trail Cap Sizun",
      dateStart: new Date('2026-03-01T08:30:00'), 
      dateEnd: null,
      location: "Cléden-Cap-Sizun (29)",
      type: EventType.TRAIL,
      description: "Un parcours époustouflant à la pointe du Finistère. Découvrez des paysages sauvages entre terre et mer sur les sentiers côtiers du Cap Sizun.",
      imgUrl: "/uploads/capsizun.jpg",
    },
    {
      title: "Trail de la traversée de la baie",
      dateStart: new Date('2026-05-02T10:00:00'),
      dateEnd: null,
      location: "Saint-Brieuc (22)",
      type: EventType.TRAIL,
      description: "Une expérience unique : traverser la baie de Saint-Brieuc à marée basse. Attention à ne pas mouiller les chaussures... ou si, justement !",
      imgUrl: "/uploads/labaie.webp",
    }
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event
    })
  }
  console.log('✅ Événements créés.');

  
  // --- DOCUMENTS LÉGAUX ---
  const documents = [
    {
      title: "Autorisation Parentale 2024-2025",
      description: "Formulaire obligatoire à remplir pour l'inscription des mineurs aux activités du club.",
      Url: "/uploads/docs/Autorisation_parentale_2024_2025.pdf" 
    },
    {
      title: "Bulletin d'Adhésion 2025-2026",
      description: "Le formulaire complet pour votre inscription ou renouvellement pour la saison à venir.",
      Url: "/uploads/docs/Bulletin_d-adhésion_2025_2026.pdf"
    },
    {
      title: "Modèle de Certificat Médical",
      description: "Modèle type de certificat de non-contre-indication à la pratique de la course à pied en compétition.",
      Url: "/uploads/docs/Certificat_Medical.pdf"
    },
    {
      title: "Compte Rendu AG 2025",
      description: "Synthèse et décisions votées lors de l'Assemblée Générale du 10 octobre 2025.",
      Url: "/uploads/docs/Compte_rendu_AG_2025.pdf"
    },
    {
      title: "RIB - Les Foulées Avrillaises",
      description: "Coordonnées bancaires (IBAN) pour le règlement de votre cotisation par virement.",
      Url: "/uploads/docs/IBAN_LES_FOULEES_AVRILLAISES.pdf"
    },
    {
      title: "Statuts de l'Association",
      description: "Document officiel définissant l'objet, les règles et le fonctionnement interne du club (MAJ 2018).",
      Url: "/uploads/docs/Statuts20121218.pdf"
    }
  ]

  for (const doc of documents) {
    await prisma.legalDocs.create({
      data: doc
    })
  }
  console.log('✅ Documents légaux créés.');

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
      phone: "0612345678",
      address: "1 rue des Merveilles",
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