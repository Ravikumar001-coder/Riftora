-- Module 11: Add best single match points for tiebreaker FR-11-003

ALTER TABLE leaderboard_entries
ADD COLUMN best_single_match_points DECIMAL(10,2) DEFAULT 0;
