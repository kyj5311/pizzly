/*
  Warnings:

  - You are about to drop the column `stage` on the `pizzlies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pizzlies` DROP COLUMN `stage`,
    ADD COLUMN `growth_stage` INTEGER NOT NULL DEFAULT 1;
