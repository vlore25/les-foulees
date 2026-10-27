
import { PrismaClient } from '@/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "../../prisma/prisma8/contract";
import contractJson from "../../prisma/prisma8/contract.json" with { type: "json" };
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

const pool = new Pool({ connectionString: connectionString })

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaPg(
            pool
        ),
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({ url: connectionString, contract }); 
