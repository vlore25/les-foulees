/*
  Warnings:

  - You are about to drop the column `membershipId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[partnerId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Payment_membershipId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "accommodations" TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meals" TEXT[];

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN     "accommodations" TEXT[],
ADD COLUMN     "carpooling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meals" TEXT[];

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "partnerId" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "membershipId";

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "isActive",
ADD COLUMN     "isOpenForRegistration" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deactivatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroDesktopUrl" TEXT,
    "heroMobileUrl" TEXT,
    "privacyPolicy" TEXT,
    "legalNotice" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSchedule" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "imgUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrainingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_partnerId_key" ON "Membership"("partnerId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
