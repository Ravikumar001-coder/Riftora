ALTER TABLE stream_annotations MODIFY COLUMN label ENUM('match_start', 'match_end', 'chicken_dinner', 'notable_kill', 'technical_pause', 'custom') NOT NULL;
