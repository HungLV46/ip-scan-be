/*
  Warnings:

  - You are about to drop the column `token_id` on the `ipassets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chain_id,contract_address]` on the table `ipassets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chain_id,contract_address,token_id]` on the table `nfts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chain_id` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_address` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ipassets_chain_id_contract_address_token_id_key";

-- AlterTable
ALTER TABLE "ipassets" DROP COLUMN "token_id";

-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "chain_id" TEXT NOT NULL,
ADD COLUMN     "contract_address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ipassets_chain_id_contract_address_key" ON "ipassets"("chain_id", "contract_address");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_chain_id_contract_address_token_id_key" ON "nfts"("chain_id", "contract_address", "token_id");
