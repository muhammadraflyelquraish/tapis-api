-- CreateIndex
CREATE INDEX "Tapis_name_description_idx" ON "Tapis"("name", "description");

-- CreateIndex
CREATE INDEX "TapisImage_tapisId_idx" ON "TapisImage"("tapisId");
