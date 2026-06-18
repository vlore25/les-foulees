import 'server-only';
import { prisma } from '@/src/lib/prisma';
import { cache } from 'react';

export const getSiteConfig = cache(async () => {
    let config = await prisma.siteConfig.findUnique({
        where: { id: "default" }
    });
    if (!config) {
        config = await prisma.siteConfig.create({
            data: { id: "default" }
        });
    }
    return config;
});

export const getTrainingSchedules = cache(async () => {
    return await prisma.trainingSchedule.findMany({
        orderBy: { order: 'asc' }
    });
});
