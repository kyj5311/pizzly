-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `test_account_id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `interests` JSON NULL,
    `restrictions` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_test_account_id_key`(`test_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pizzlies` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `exp` INTEGER NOT NULL DEFAULT 0,
    `stage` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pizzlies_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quests` (
    `id` VARCHAR(191) NOT NULL,
    `quest_code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` ENUM('EYE', 'WRIST', 'NECK_SHOULDER', 'BREATH_REST') NOT NULL,
    `duration` ENUM('MIN_1', 'MIN_3', 'MIN_5') NOT NULL,
    `steps` JSON NOT NULL,
    `reps_sets` VARCHAR(191) NULL,
    `posture` JSON NOT NULL,
    `environment` VARCHAR(191) NULL,
    `guide_type` ENUM('PIZZLY_SIGNATURE', 'GENERAL', 'EITHER') NOT NULL,
    `difficulty` ENUM('LOW', 'MID', 'HIGH') NOT NULL DEFAULT 'LOW',
    `caution` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `exp_reward` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `quests_quest_code_key`(`quest_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quest_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `quest_id` VARCHAR(191) NOT NULL,
    `elapsed_seconds` INTEGER NOT NULL,
    `completed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quest_logs_user_id_completed_at_idx`(`user_id`, `completed_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `quest_log_id` VARCHAR(191) NOT NULL,
    `reward_type` VARCHAR(191) NOT NULL,
    `reward_value` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reward_logs_quest_log_id_key`(`quest_log_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pass_subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `plan_type` ENUM('FREE', 'PREMIUM') NOT NULL,
    `started_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NULL,
    `payment_ref` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pizzlies` ADD CONSTRAINT `pizzlies_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_logs` ADD CONSTRAINT `quest_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_logs` ADD CONSTRAINT `quest_logs_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_logs` ADD CONSTRAINT `reward_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_logs` ADD CONSTRAINT `reward_logs_quest_log_id_fkey` FOREIGN KEY (`quest_log_id`) REFERENCES `quest_logs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pass_subscriptions` ADD CONSTRAINT `pass_subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
