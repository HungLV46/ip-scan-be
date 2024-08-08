-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "collections_name_idx" ON "collections"("name");
