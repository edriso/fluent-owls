-- AlterTable
-- Adds the daily-reminder opt-out flag. IF NOT EXISTS (MariaDB) keeps it safe to
-- re-apply over a table that already has the column.
ALTER TABLE `learners` ADD COLUMN IF NOT EXISTS `reminders_on` BOOLEAN NOT NULL DEFAULT true;
