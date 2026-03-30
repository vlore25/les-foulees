-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "genre" "Genre" NOT NULL DEFAULT 'OTHER';
