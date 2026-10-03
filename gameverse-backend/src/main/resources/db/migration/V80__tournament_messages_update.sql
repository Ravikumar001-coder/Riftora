-- Update tournament_messages for Module 14 (Announcement Composer)
ALTER TABLE tournament_messages
ADD COLUMN recipient_scope ENUM('all_registered', 'all_checked_in', 'specific_match', 'specific_round', 'specific_teams', 'status_based') NULL,
ADD COLUMN scope_target_id VARCHAR(36) NULL,
ADD COLUMN scope_teams JSON NULL,
ADD COLUMN channels JSON NULL,
ADD COLUMN is_scheduled BOOLEAN DEFAULT FALSE,
ADD COLUMN scheduled_at DATETIME NULL,
ADD COLUMN status ENUM('draft', 'scheduled', 'sending', 'sent', 'cancelled') DEFAULT 'draft',
ADD COLUMN recipient_count INT DEFAULT 0,
ADD COLUMN delivered_count INT DEFAULT 0,
ADD COLUMN failed_count INT DEFAULT 0;

-- Optional: update existing rows
UPDATE tournament_messages SET status = 'sent' WHERE sent_at IS NOT NULL;
