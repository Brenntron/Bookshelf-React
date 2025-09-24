/*
  Warnings:

  - Added the required column `cover_i` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "cover_i" INTEGER NOT NULL;
