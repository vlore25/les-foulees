/*
  Warnings:

  - You are about to drop the column `price` on the `Season` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "price",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priceCouple" DOUBLE PRECISION NOT NULL DEFAULT 60.0,
ADD COLUMN     "priceFfa" DOUBLE PRECISION NOT NULL DEFAULT 98.0,
ADD COLUMN     "priceStandard" DOUBLE PRECISION NOT NULL DEFAULT 35.0,
ADD COLUMN     "priceYoung" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
