"use server"

import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as definePostgresConfig, prisma7Schema } from "@prisma/orm-postgres/config";

console.log(process.env["DATABASE_URL"])
export default definePrismaConfig({
    orm: definePostgresConfig({
        contract: prisma7Schema("prisma/schema.prisma"),
        output: "prisma/prisma8",
        db: {
            connection: process.env["DATABASE_URL"]!,
        },
    }),
});

