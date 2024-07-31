-- DropForeignKey
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
