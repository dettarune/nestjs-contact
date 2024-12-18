/*
  Warnings:

  - You are about to alter the column `token` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `isVerified` BOOLEAN NULL,
    MODIFY `token` INTEGER NULL;
