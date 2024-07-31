-- CreateTable
CREATE TABLE "licenses" (
    "id" SERIAL NOT NULL,
    "chain_id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "ipasset_id" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "licenses_chain_id_contract_address_token_id_key" ON "licenses"("chain_id", "contract_address", "token_id");

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_ipasset_id_fkey" FOREIGN KEY ("ipasset_id") REFERENCES "ipassets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
