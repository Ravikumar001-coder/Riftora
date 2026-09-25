-- Add postponement tracking fields for FR-05-013
ALTER TABLE tournaments ADD COLUMN is_postponed BOOLEAN DEFAULT FALSE;
ALTER TABLE tournaments ADD COLUMN original_start_date DATE;
ALTER TABLE tournaments ADD COLUMN original_end_date DATE;
ALTER TABLE tournaments ADD COLUMN postponement_reason TEXT;
