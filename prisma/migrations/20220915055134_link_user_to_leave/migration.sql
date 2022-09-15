/*
  Warnings:

  - You are about to drop the column `userId` on the `leave` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[approvedByUserId]` on the table `Leave` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appliedByUserId` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approvedByUserId` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leave` DROP FOREIGN KEY `Leave_userId_fkey`;

-- AlterTable
ALTER TABLE `leave` DROP COLUMN `userId`,
    ADD COLUMN `appliedByUserId` INTEGER NOT NULL,
    ADD COLUMN `approvedByUserId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Leave_approvedByUserId_key` ON `Leave`(`approvedByUserId`);

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_appliedByUserId_fkey` FOREIGN KEY (`appliedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_approvedByUserId_fkey` FOREIGN KEY (`approvedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
