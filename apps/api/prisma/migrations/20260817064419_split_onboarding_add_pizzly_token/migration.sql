/*
  Warnings:

  - You are about to drop the column `interests` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `restrictions` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pizzlies` ADD COLUMN `token` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `interests`,
    DROP COLUMN `restrictions`;

-- CreateTable
CREATE TABLE `onboardings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `interests` JSON NULL,
    `restrictions` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `onboardings_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `onboardings` ADD CONSTRAINT `onboardings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
