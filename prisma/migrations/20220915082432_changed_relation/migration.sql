-- DropIndex
DROP INDEX `Leave_approvedByUserId_fkey` ON `leave`;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_approvedByUserId_fkey` FOREIGN KEY (`approvedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
