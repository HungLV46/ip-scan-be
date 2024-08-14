/*
  Warnings:

  - You are about to drop the column `product_id` on the `collections` table. All the data in the column will be lost.
  - Made the column `metadata` on table `collections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metadata` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_product_id_fkey";

-- DropIndex
DROP INDEX "collections_product_id_idx";

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "product_id",
ALTER COLUMN "metadata" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "metadata" SET NOT NULL;

-- CreateTable
CREATE TABLE "product_collections" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,

    CONSTRAINT "product_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_collections_product_id_idx" ON "product_collections"("product_id");

-- CreateIndex
CREATE INDEX "product_collections_collection_id_idx" ON "product_collections"("collection_id");

-- AddForeignKey
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
