-- Update RoomCredential Release Modes for FR-08-003

ALTER TABLE room_credentials 
MODIFY COLUMN release_mode ENUM('manual', 'scheduled', 'match_start_minus_x') NOT NULL;

ALTER TABLE room_credentials 
ADD COLUMN match_start_minus_x_minutes INT DEFAULT NULL AFTER scheduled_release_at;
