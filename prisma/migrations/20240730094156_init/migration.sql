-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "avatar_img" TEXT NOT NULL,
    "banner_img" TEXT NOT NULL,
    "additional_info" JSONB NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar_img" TEXT NOT NULL,
    "banner_img" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "chain_id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" SERIAL NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "token_id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ipassets" (
    "id" SERIAL NOT NULL,
    "chain_id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "parent_ipasset_id" INTEGER,
    "nft_id" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "ipassets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_wallet_address_idx" ON "users"("wallet_address");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_owner_id_idx" ON "products"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "product_attributes_name_value_idx" ON "product_attributes"("name", "value");

-- CreateIndex
CREATE INDEX "product_attributes_product_id_idx" ON "product_attributes"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_name_value_product_id_key" ON "product_attributes"("name", "value", "product_id");

-- CreateIndex
CREATE INDEX "collections_product_id_idx" ON "collections"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "collections_chain_id_contract_address_key" ON "collections"("chain_id", "contract_address");

-- CreateIndex
CREATE INDEX "nfts_collection_id_idx" ON "nfts"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_collection_id_token_id_key" ON "nfts"("collection_id", "token_id");

-- CreateIndex
CREATE INDEX "ipassets_parent_ipasset_id_idx" ON "ipassets"("parent_ipasset_id");

-- CreateIndex
CREATE UNIQUE INDEX "ipassets_chain_id_contract_address_token_id_key" ON "ipassets"("chain_id", "contract_address", "token_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ipassets" ADD CONSTRAINT "ipassets_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ipassets" ADD CONSTRAINT "ipassets_parent_ipasset_id_fkey" FOREIGN KEY ("parent_ipasset_id") REFERENCES "ipassets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
