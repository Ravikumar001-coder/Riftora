-- Update enum for tournament status to rename 'scheduled' to 'published'
ALTER TABLE tournaments MODIFY COLUMN status ENUM('draft', 'published', 'registration_open', 'registration_closed', 'check_in', 'live', 'completed', 'cancelled') DEFAULT 'draft';

-- Add cancellation reason for FR-05-012
ALTER TABLE tournaments ADD COLUMN cancellation_reason TEXT;
