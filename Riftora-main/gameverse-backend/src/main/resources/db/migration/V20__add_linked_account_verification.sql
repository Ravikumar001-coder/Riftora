ALTER TABLE linked_game_accounts
ADD COLUMN verification_method ENUM('manual', 'challenge') DEFAULT NULL,
ADD COLUMN verification_code VARCHAR(20) DEFAULT NULL;
