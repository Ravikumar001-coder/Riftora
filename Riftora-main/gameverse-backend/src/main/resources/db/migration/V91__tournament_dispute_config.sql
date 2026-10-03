ALTER TABLE tournaments ADD COLUMN dispute_submission_window_mins INT DEFAULT 30 AFTER dispute_sequence;
