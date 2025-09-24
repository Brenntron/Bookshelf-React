-- AlterTable
ALTER TABLE "public"."Author" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Book" ALTER COLUMN "description" DROP NOT NULL;
