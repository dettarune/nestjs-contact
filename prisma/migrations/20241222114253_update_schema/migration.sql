/*
  Warnings:

  - You are about to alter the column `saldo` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - A unique constraint covering the columns `[id]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `saldo` INTEGER NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `contacts_id_key` ON `contacts`(`id`);
