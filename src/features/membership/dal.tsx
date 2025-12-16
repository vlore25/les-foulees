import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";


type AdhesionFilter = 'ALL' | 'VALIDATED' | 'PENDING_PAYMENT' | 'MISSING_CERTIF';

export default async function getAdhesions(filter: AdhesionFilter = 'ALL') {

    let whereCondition: any = {
        season: { isActive: true }
    };

    switch (filter) {
        case 'VALIDATED':
            whereCondition.status = 'VALIDATED';
            break;

        case 'PENDING_PAYMENT':
            whereCondition.payment = {
                status: 'PENDING'
            };
            whereCondition.status = {
                not: 'VALIDATED'
            };
            break;

        case 'MISSING_CERTIF':
            whereCondition.medicalCertificateVerified = false;
            whereCondition.type = { not: 'LICENSE_RUNNING' };
            break;

        case 'ALL':
        default:
            break;
    }


    const adhesions = await prisma.membership.findMany({
        where: whereCondition,
        include: {
            // 1. On inclut la saison (C'est ça qui manquait !)
            season: {
                select: {
                    name: true // On a juste besoin du nom pour l'afficher
                }
            },

            // 2. Ton user (Attention à la casse lastname vs lastName selon ton schema)
            user: {
                select: {
                    id: true,
                    name: true, // Vérifie si c'est firstName ou name dans ton schema
                    lastname: true,  // Vérifie si c'est lastName ou lastname dans ton schema
                    email: true,
                    phone: true,
                }
            },
            // 3. Le paiement
            payment: true
        },
        orderBy: {
            // Attention ici aussi à la casse
            user: { lastname: 'asc' }
        }
    })

    return adhesions;
}

export async function getAdhesionStats() {
    const activeSeasonWhere = { season: { isActive: true } };

    const [total, validated, pendingPayment, missingCertif] = await Promise.all([

        prisma.membership.count({
            where: activeSeasonWhere
        }),

        prisma.membership.count({
            where: { ...activeSeasonWhere, status: 'VALIDATED' }
        }),

        prisma.membership.count({
            where: {
                ...activeSeasonWhere,
                status: { not: 'VALIDATED' },
                payment: { status: 'PENDING' }
            }
        }),

        prisma.membership.count({
            where: {
                ...activeSeasonWhere,
                medicalCertificateVerified: false,
                type: { not: 'LICENSE_RUNNING' }
            }
        })
    ]);

    return { total, validated, pendingPayment, missingCertif };
}

export async function getUserMembershipForActiveSeason(userId: string) {
    const activeSeasonWhere = { season: { isActive: true } };
    try {
        const session = await getSession();

        if (!session || !session.isAuth || !session.userId) {
            return {
                isMember: false,
                status: null,
                message: "Utilisateur non connecté"
            };
        }

        const memberShip = await prisma.membership.findFirst({
            where: {
                userId: session.userId,
            },
            select: {
                status: true,
                type: true,
                ffaLicenseNumber: true,
            }
        })

        return memberShip

    }catch(e){
        return e;
    }
}