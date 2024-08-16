/*
  Warnings:

  - A unique constraint covering the columns `[product_id,collection_id]` on the table `product_collections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "user_attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_attributes_name_value_idx" ON "user_attributes"("name", "value");

-- CreateIndex
CREATE INDEX "user_attributes_user_id_idx" ON "user_attributes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_attributes_name_value_user_id_key" ON "user_attributes"("name", "value", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_collections_product_id_collection_id_key" ON "product_collections"("product_id", "collection_id");

-- AddForeignKey
ALTER TABLE "user_attributes" ADD CONSTRAINT "user_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
