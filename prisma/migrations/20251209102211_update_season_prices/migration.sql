/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expiresAt` on the `Invitation` table. All the data in the column will be lost.
  - The primary key for the `LegalDocs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_EventToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `imgUrl` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('TRAIL', 'COURSE_ROUTE', 'ENTRAINEMENT', 'VIE_DU_CLUB', 'SORTIE', 'AUTRE');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('STANDARD', 'COUPLE', 'YOUNG', 'FFA');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CHEQUE', 'VIREMENT', 'ESPECES', 'STRIPE', 'AUTRE');

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ADD COLUMN     "type" "EventType" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "imgUrl" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "expiresAt";

-- AlterTable
ALTER TABLE "LegalDocs" DROP CONSTRAINT "LegalDocs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LegalDocs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LegalDocs_id_seq";

-- AlterTable
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_EventToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 35.0,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL DEFAULT 'STANDARD',
    "licenseNumber" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "userId" TEXT NOT NULL,
    "licenseId" TEXT,
    "eventId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");

-- CreateIndex
CREATE UNIQUE INDEX "License_userId_seasonId_key" ON "License"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_key" ON "Invitation"("email");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
