-- CreateTable
CREATE TABLE `quest_bookmarks` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `quest_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `quest_bookmarks_user_id_quest_id_key`(`user_id`, `quest_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quest_bookmarks` ADD CONSTRAINT `quest_bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_bookmarks` ADD CONSTRAINT `quest_bookmarks_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
