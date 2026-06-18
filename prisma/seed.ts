import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';
import { PrismaClient } from './generated/client';
import { Role, Status, EventType, MembershipStatus, MembershipType, PaymentMethod, PaymentStatus, Genre } from './generated/enums';
import { Pool } from 'pg';

const connectionString = `${process.env.POSTGRES_DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Début du seeding..');

  console.log('Nettoyage des anciennes données..');
  // L'ordre est important à cause des clés étrangères
  await prisma.eventRegistration.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.event.deleteMany();
  await prisma.season.deleteMany();
  await prisma.legalDocs.deleteMany();

  console.log('Création des saisons..');
  const seasonPast = await prisma.season.create({
    data: {
      name: "Saison 2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-08-31"),
      isOpenForRegistration: false,
    }
  });

  const seasonCurrent = await prisma.season.create({
    data: {
      name: "Saison 2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-08-31"),
      isOpenForRegistration: true,
    }
  });

  console.log('Création des utilisateurs..');
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const createdUsers = [];

  const adminsData = [
    { email: 'jean.dupont@foulees.com', name: 'Jean', lastname: 'Dupont' },
    { email: 'marie.lefevre@foulees.com', name: 'Marie', lastname: 'Lefebvre' },
    { email: 'pierre.dubois@foulees.com', name: 'Pierre', lastname: 'Dubois' },
  ];

  for (const adm of adminsData) {
    const user = await prisma.user.create({
      data: {
        email: adm.email,
        name: adm.name,
        lastname: adm.lastname,
        password: hashedPassword,
        role: Role.ADMIN,
        status: Status.ACTIVE,
        genre: adm.name === 'Marie' ? Genre.FEMALE : Genre.MALE,
        phone: "0612345678",
        address: faker.location.streetAddress(),
        zipCode: "49240",
        city: "Avrillé",
        birthdate: new Date("1985-05-15"),
        profileImageUrl: `https://i.pravatar.cc/300?u=${adm.email}`
      },
    });
    createdUsers.push(user);
  }

  // 50 Utilisateurs fictifs
  for (let i = 0; i < 50; i++) {
    const gender = faker.helpers.arrayElement([Genre.MALE, Genre.FEMALE]);
    const firstName = faker.person.firstName(gender === Genre.MALE ? 'male' : 'female');
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    const user = await prisma.user.create({
      data: {
        email: email,
        name: firstName,
        lastname: lastName,
        genre: gender,
        password: hashedPassword,
        role: Role.USER,
        status: Status.ACTIVE,
        phone: faker.helpers.fromRegExp(/0[6-7][0-9]{8}/),
        birthdate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode('#####'),
        city: faker.location.city(),
        profileImageUrl: `https://i.pravatar.cc/300?u=${email}`
      },
    });
    createdUsers.push(user);

    // Création de memberships pour certains utilisateurs
    const hasPastMembership = faker.datatype.boolean(0.7);
    const hasCurrentMembership = faker.datatype.boolean(0.8);

    if (hasPastMembership) {
      await createMembershipWithPayment(user.id, seasonPast.id, MembershipStatus.VALIDATED);
    }
    if (hasCurrentMembership) {
      const status = faker.helpers.arrayElement([MembershipStatus.VALIDATED, MembershipStatus.PENDING]);
      await createMembershipWithPayment(user.id, seasonCurrent.id, status);
    }
  }

  async function createMembershipWithPayment(userId: string, seasonId: string, status: MembershipStatus) {
    const type = faker.helpers.arrayElement([MembershipType.INDIVIDUAL, MembershipType.YOUNG, MembershipType.LICENSE_RUNNING]);
    const method = faker.helpers.arrayElement([PaymentMethod.TRANSFER, PaymentMethod.CHECK, PaymentMethod.ONLINE]);
    const amount = type === MembershipType.YOUNG ? 25 : (type === MembershipType.LICENSE_RUNNING ? 98 : 35);

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        method,
        status: status === MembershipStatus.VALIDATED ? PaymentStatus.PAID : PaymentStatus.PENDING,
      }
    });

    const membership = await prisma.membership.create({
      data: {
        userId,
        seasonId,
        status,
        type,
        paymentId: payment.id,
        ffaLicenseNumber: type === MembershipType.LICENSE_RUNNING ? faker.string.numeric(10) : null,
      }
    });

  }

  console.log(`✅ ${createdUsers.length} utilisateurs et leurs adhésions créés.`);

  // --- PARTIE 3 : ÉVÉNEMENTS ---
  console.log('📅 Création des événements...');
  const realisticEvents = [
    {
      title: "Apocalypse Trail - La Course Nocturne",
      description: "Une expérience immersive unique au cœur de la nuit. Affrontez vos peurs sur un parcours technique semé d'embûches et d'animations terrifiantes. Lampes frontales obligatoires pour cette aventure hors du commun où le but n'est pas seulement de courir, mais de survivre jusqu'à l'arrivée !",
      location: "Forêt d'Avrillé, Maine-et-Loire",
      type: EventType.TRAIL,
      dateStart: new Date("2026-10-31T20:00:00"),
      dateEnd: new Date("2026-10-31T23:30:00"),
      imgUrl: "/uploads/apocalipsis.png",
      distances: ["13km (Le Survivant)", "6.66km (L'Initié)"],
      meals: ["Repas de clôture"],
      accommodations: ["Nuit en gymnase"],
    },
    {
      title: "Trail du Cap Sizun - Pointe du Raz",
      description: "Venez défier les éléments sur l'un des plus beaux parcours côtiers de France. Entre falaises escarpées, sentiers de douaniers (GR34) et landes sauvages, ce trail vous offre des panoramas spectaculaires sur l'Océan Atlantique et la majestueuse Pointe du Raz. Une immersion totale en terre bretonne.",
      location: "Audierne / Cap Sizun, Bretagne",
      type: EventType.TRAIL,
      dateStart: new Date("2026-04-12T08:30:00"),
      dateEnd: new Date("2026-04-12T16:00:00"),
      imgUrl: "/uploads/capsizun.jpg",
      distances: ["15km", "30km", "50km"],
      meals: [],
      accommodations: [],
    },
    {
      title: "Trail de la Baie - Entre Terre et Mer",
      description: "Le Trail de la Baie revient pour une édition printanière exceptionnelle. Le parcours alterne entre passages techniques en sous-bois, chemins creux et portions rapides sur le sable à marée basse. Un tracé exigeant mais gratifiant, idéal pour les amoureux de nature sauvage et d'air iodé.",
      location: "Baie de Saint-Brieuc / Hillion",
      type: EventType.TRAIL,
      dateStart: new Date("2026-06-14T09:00:00"),
      dateEnd: new Date("2026-06-14T14:00:00"),
      imgUrl: "/uploads/labaie.webp",
      distances: ["10km", "22km", "34km"],
      meals: [],
      accommodations: [],
    },
    {
      title: "Course de la Solidarité - Téléthon Avrillé",
      description: "Mobilisons-nous ensemble pour la recherche ! Comme chaque année, le club organise sa course caritative au profit de l'AFM-Téléthon. Un événement convivial et familial où le chronomètre passe au second plan derrière la solidarité. Ouvert aux marcheurs et aux coureurs de tous niveaux.",
      location: "Esplanade de l'Hôtel de Ville, Avrillé",
      type: EventType.COURSE_ROUTE,
      dateStart: new Date("2025-12-06T10:00:00"),
      dateEnd: new Date("2025-12-06T13:00:00"),
      imgUrl: "/uploads/telethon.jpg",
      distances: ["5km (Course)", "10km (Course)", "5km (Marche)"],
      meals: [],
      accommodations: [],
    },
  ];

  const createdEvents = [];
  for (const eventData of realisticEvents) {
    const event = await prisma.event.create({
      data: eventData
    });
    createdEvents.push(event);
  }

  // Inscriptions aux événements
  for (const event of createdEvents) {
    const participantsCount = faker.number.int({ min: 5, max: 25 });
    const participants = faker.helpers.arrayElements(createdUsers, participantsCount);
    
    for (const participant of participants) {
      await prisma.eventRegistration.create({
        data: {
          eventId: event.id,
          userId: participant.id,
          distance: event.distances && event.distances.length > 0 
            ? faker.helpers.arrayElement(event.distances) 
            : "Libre",
          meals: [],
          accommodations: [],
        }
      }).catch(() => {}); // Ignorer doublons potentiels
    }
  }

  // --- PARTIE 4 : DOCUMENTS LÉGAUX ---
  await prisma.legalDocs.createMany({
    data: [
      { title: "Statuts de l'association", description: "Les statuts officiels mis à jour.", Url: "/uploads/docs/statuts.pdf" },
      { title: "Règlement intérieur", description: "Règles de vie du club.", Url: "/uploads/docs/reglement.pdf" },
      { title: "Charte de l'adhérent", description: "Nos engagements communs.", Url: "/uploads/docs/charte.pdf" },
    ]
  });

  console.log('🚀 Seeding terminé avec succès !');
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