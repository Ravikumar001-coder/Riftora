ALTER TABLE tournaments
ADD COLUMN auto_lock_credentials BOOLEAN DEFAULT TRUE,
ADD COLUMN auto_lock_mins_after_start INT DEFAULT 10;
