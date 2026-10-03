-- Module 11: Add Custom Tiebreaker Configurations FR-11-004

ALTER TABLE tournaments
ADD COLUMN tiebreaker_sequence JSON;

ALTER TABLE leaderboard_entries
ADD COLUMN total_damage DECIMAL(10,2) DEFAULT 0,
ADD COLUMN best_single_match_rank INT,
ADD COLUMN last_place_finishes INT DEFAULT 0;
