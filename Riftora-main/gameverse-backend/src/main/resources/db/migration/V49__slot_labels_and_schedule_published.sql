ALTER TABLE match_slots ADD COLUMN slot_label VARCHAR(100);
ALTER TABLE tournaments ADD COLUMN schedule_published BOOLEAN DEFAULT false;
