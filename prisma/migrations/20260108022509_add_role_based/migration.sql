-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'VIP');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'GUEST';
