-- Update tournaments table to support wizard fields

-- Rename short_description to description and change to TEXT
ALTER TABLE tournaments CHANGE COLUMN short_description description TEXT;

ALTER TABLE tournaments
ADD COLUMN tournament_type ENUM('single', 'league') DEFAULT 'single' AFTER slug,
ADD COLUMN edition_number INT AFTER tournament_type,
ADD COLUMN tournament_tier ENUM('community', 'invitational', 'open', 'pro') DEFAULT 'community' AFTER edition_number,
ADD COLUMN logo_url VARCHAR(500) AFTER description,
ADD COLUMN matches_per_round INT AFTER total_rounds,
ADD COLUMN map_pool JSON AFTER matches_per_round,
ADD COLUMN payment_methods JSON AFTER entry_fee,
ADD COLUMN waitlist_capacity INT AFTER waitlist_enabled;

-- Allow saving as draft by making certain fields nullable
ALTER TABLE tournaments
MODIFY COLUMN scoring_template_id VARCHAR(36) NULL,
MODIFY COLUMN teams_per_match INT NULL,
MODIFY COLUMN total_team_slots INT NULL,
MODIFY COLUMN total_rounds INT NULL,
MODIFY COLUMN start_date DATE NULL,
MODIFY COLUMN end_date DATE NULL,
MODIFY COLUMN registration_open DATETIME NULL,
MODIFY COLUMN registration_close DATETIME NULL,
MODIFY COLUMN min_team_size INT NULL,
MODIFY COLUMN max_team_size INT NULL;
