    ALTER TABLE participants ADD COLUMN `email_sent` INT(11) NOT NULL DEFAULT 0;
    ALTER TABLE `site_configuration` ADD COLUMN `game_enabled` ENUM('0', '1') NOT NULL DEFAULT '0';