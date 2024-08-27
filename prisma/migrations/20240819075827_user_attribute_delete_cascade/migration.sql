-- DropForeignKey
ALTER TABLE "user_attributes" DROP CONSTRAINT "user_attributes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_attributes" ADD CONSTRAINT "user_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
