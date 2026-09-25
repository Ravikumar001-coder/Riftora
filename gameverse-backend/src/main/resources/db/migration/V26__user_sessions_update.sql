ALTER TABLE user_sessions
ADD COLUMN last_active_at TIMESTAMP NULL,
ADD COLUMN device_type VARCHAR(50) NULL,
ADD COLUMN browser VARCHAR(50) NULL,
ADD COLUMN location VARCHAR(100) NULL;

UPDATE user_sessions SET last_active_at = created_at WHERE last_active_at IS NULL;
