-- DropForeignKey
ALTER TABLE `reward_logs` DROP FOREIGN KEY `reward_logs_quest_log_id_fkey`;

-- DropIndex
DROP INDEX `reward_logs_quest_log_id_key` ON `reward_logs`;

-- AddForeignKey
ALTER TABLE `reward_logs` ADD CONSTRAINT `reward_logs_quest_log_id_fkey` FOREIGN KEY (`quest_log_id`) REFERENCES `quest_logs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
