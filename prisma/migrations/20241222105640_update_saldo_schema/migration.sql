/*
  Warnings:

  - You are about to alter the column `saldo` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `saldo` DECIMAL(65, 30) NULL DEFAULT 0.00;
