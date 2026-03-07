/*
  Warnings:

  - You are about to drop the column `imageRights` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `medicalCertificateVerified` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `shareEmail` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `sharePhone` on the `Membership` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_membershipId_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "imageRights",
DROP COLUMN "medicalCertificateVerified",
DROP COLUMN "shareEmail",
DROP COLUMN "sharePhone",
ADD COLUMN     "certificateUrl" TEXT,
ADD COLUMN     "paymentId" TEXT;

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
