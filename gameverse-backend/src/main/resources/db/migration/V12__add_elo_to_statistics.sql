-- V12: Add Elo Rating to Team Statistics

ALTER TABLE team_statistics
ADD COLUMN elo_rating INT NOT NULL DEFAULT 1000;

-- Optional index for faster leaderboard lookups
CREATE INDEX idx_team_stats_game_elo ON team_statistics (game_id, elo_rating DESC);
