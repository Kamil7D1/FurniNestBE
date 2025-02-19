/*
  Warnings:

  - You are about to drop the column `passwprd` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `password` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "passwprd",
ADD COLUMN     "password" TEXT NOT NULL;
