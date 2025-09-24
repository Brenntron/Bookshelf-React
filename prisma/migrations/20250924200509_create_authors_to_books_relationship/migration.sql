/*
  Warnings:

  - You are about to drop the column `authorIds` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `_AuthorToBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AuthorToBook" DROP CONSTRAINT "_AuthorToBook_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AuthorToBook" DROP CONSTRAINT "_AuthorToBook_B_fkey";

-- AlterTable
ALTER TABLE "public"."Book" DROP COLUMN "authorIds";

-- DropTable
DROP TABLE "public"."_AuthorToBook";

-- CreateTable
CREATE TABLE "public"."AuthorsOnBooks" (
    "authorId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "AuthorsOnBooks_pkey" PRIMARY KEY ("authorId","bookId")
);

-- AddForeignKey
ALTER TABLE "public"."AuthorsOnBooks" ADD CONSTRAINT "AuthorsOnBooks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthorsOnBooks" ADD CONSTRAINT "AuthorsOnBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
