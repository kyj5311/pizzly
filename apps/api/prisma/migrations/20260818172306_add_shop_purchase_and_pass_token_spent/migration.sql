-- AlterTable
ALTER TABLE `pass_subscriptions` ADD COLUMN `token_spent` INTEGER NULL;

-- CreateTable
CREATE TABLE `shop_purchases` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,
    `token_spent` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_purchases_user_id_item_id_key`(`user_id`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shop_purchases` ADD CONSTRAINT `shop_purchases_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
