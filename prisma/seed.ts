import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';
import { PrismaClient } from './generated/client';
import { Role, Status, EventType, MembershipStatus, MembershipType, PaymentMethod, PaymentStatus, Genre } from './generated/enums';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Début du seeding..');

  console.log('Nettoyage des anciennes données..');
  await prisma.payment.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.season.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.legalDocs.deleteMany();
  await prisma.user.deleteMany();

  console.log('Création des saisons..');
  const seasonPast = await prisma.season.create({
    data: {
      name: "Saison 2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-08-31"),
      isActive: false,
    }
  });

  const seasonCurrent = await prisma.season.create({
    data: {
      name: "Saison 2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-08-31"),
      isActive: true,
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
        membershipId: 'tmp', // Sera mis à jour
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

    await prisma.payment.update({
      where: { id: payment.id },
      data: { membershipId: membership.id }
    });
  }

  console.log(`✅ ${createdUsers.length} utilisateurs et leurs adhésions créés.`);

  // --- PARTIE 3 : ÉVÉNEMENTS ---
  console.log('📅 Création des événements...');
  const eventTypes = [EventType.TRAIL, EventType.COURSE_ROUTE, EventType.ENTRAINEMENT, EventType.VIE_DU_CLUB, EventType.SORTIE];
  const createdEvents = [];

  for (let i = 0; i < 10; i++) {
    const type = faker.helpers.arrayElement(eventTypes);
    const isPast = faker.datatype.boolean();
    const dateStart = isPast ? faker.date.past() : faker.date.future();
    
    const event = await prisma.event.create({
      data: {
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        location: `${faker.location.city()} (${faker.location.zipCode('##')})`,
        type: type,
        dateStart: dateStart,
        dateEnd: new Date(dateStart.getTime() + faker.number.int({ min: 2, max: 6 }) * 3600000),
        imgUrl: `https://loremflickr.com/800/600/running,marathon?lock=${i}`,
        distances: faker.helpers.arrayElements(["5km", "10km", "Semi-Marathon", "Marathon", "Trail 15km", "Trail 30km"], { min: 1, max: 3 }),
      }
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
          distance: faker.helpers.arrayElement(event.distances || ["Libre"]),
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