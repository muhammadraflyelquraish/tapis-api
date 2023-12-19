/*
  Warnings:

  - Added the required column `signification` to the `Tapis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utility` to the `Tapis` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tapis_name_description_idx";

-- AlterTable
ALTER TABLE "Tapis" ADD COLUMN     "signification" TEXT NOT NULL,
ADD COLUMN     "utility" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TapisArea" (
    "id" TEXT NOT NULL,
    "StoreName" TEXT NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TapisArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tapis_name_utility_signification_description_idx" ON "Tapis"("name", "utility", "signification", "description");
