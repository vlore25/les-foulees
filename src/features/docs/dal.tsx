// src/features/legal-docs/dal.tsx
import { prisma } from "@/src/lib/prisma";
import { cache } from "react";

export const getLegalDocs = cache(async () => {
  const docs = await prisma.legalDocs.findMany({
    orderBy: { title: 'asc' },
  });
  return docs;
});

export const getLegalDocById = cache(async (id: string) => {
  const doc = await prisma.legalDocs.findUnique({
    where: { id },
  });
  return doc;
});