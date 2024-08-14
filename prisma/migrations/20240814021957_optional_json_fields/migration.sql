-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ipassets" ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "licenses" ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "nfts" ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "additional_info" DROP NOT NULL;
