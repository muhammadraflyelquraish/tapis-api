/*
  Warnings:

  - You are about to drop the column `Latitude` on the `TapisArea` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude` on the `TapisArea` table. All the data in the column will be lost.
  - You are about to drop the column `StoreName` on the `TapisArea` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `TapisArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `TapisArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeName` to the `TapisArea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TapisArea" DROP COLUMN "Latitude",
DROP COLUMN "Longitude",
DROP COLUMN "StoreName",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "storeName" TEXT NOT NULL;
