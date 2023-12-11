-- CreateTable
CREATE TABLE "Tapis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tapis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TapisImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tapisId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TapisImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TapisImage" ADD CONSTRAINT "TapisImage_tapisId_fkey" FOREIGN KEY ("tapisId") REFERENCES "Tapis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
