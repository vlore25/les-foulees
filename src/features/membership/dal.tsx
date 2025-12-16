import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";


type AdhesionFilter = 'ALL' | 'VALIDATED' | 'TO_HANDLE';

export default async function getAdhesions(
    filter: 'ALL' | 'VALIDATED' | 'TO_HANDLE' = 'ALL', 
    seasonId?: string 
) {

    let whereCondition: any = {};

    if (seasonId) {
        whereCondition.seasonId = seasonId;
    } else {
        whereCondition.season = { isActive: true };
    }

    // 2. Application des filtres de statut (inchangé)
    switch (filter) {
        case 'VALIDATED':
            whereCondition.status = 'VALIDATED';
            break;
        case 'TO_HANDLE':
            whereCondition.status = { not: 'VALIDATED' };
            break;
        case 'ALL':
        default:
            break;
    }

    const adhesions = await prisma.membership.findMany({
        where: whereCondition,
        include: {
            season: { select: { name: true } },
            user: {
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    phone: true,
                    birthdate: true, 
                    address: true,   
                    city: true,     
                    zipCode: true  
                }
            },
            payment: true
        },
        orderBy: {
            createdAt: 'desc' 
        }
    })

    return adhesions;
}

export async function getAdhesionStats() {
    const activeSeasonWhere = { season: { isActive: true } };

    const [total, validated, toHandle] = await Promise.all([

        prisma.membership.count({
            where: activeSeasonWhere
        }),
        prisma.membership.count({
            where: { ...activeSeasonWhere, status: 'VALIDATED' }
        }),
        prisma.membership.count({
            where: { 
                ...activeSeasonWhere, 
                status: { not: 'VALIDATED' } 
            }
        })
    ]);

    return { total, validated, toHandle };
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
        })

        return memberShip

    }catch(e){
        return e;
    }
}