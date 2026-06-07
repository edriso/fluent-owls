-- CreateTable
-- IF NOT EXISTS makes this safe to apply even if the table already exists on the
-- server (e.g. from an earlier run); the column types map cleanly to the schema.
CREATE TABLE IF NOT EXISTS `learners` (
    `telegram_id` BIGINT NOT NULL,
    `level` VARCHAR(2) NOT NULL DEFAULT 'b1',
    `step` INTEGER NOT NULL DEFAULT 0,
    `cursors` TEXT NULL,
    `streak` INTEGER NOT NULL DEFAULT 0,
    `last_day` VARCHAR(10) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`telegram_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
