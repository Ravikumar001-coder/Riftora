-- Add raw bonus flag tracking to team_match_scores to satisfy FR-10-011

ALTER TABLE team_match_scores
ADD COLUMN got_first_blood BOOLEAN DEFAULT FALSE,
ADD COLUMN team_wipes INT DEFAULT 0,
ADD COLUMN got_mvp BOOLEAN DEFAULT FALSE,
ADD COLUMN got_winner_bonus BOOLEAN DEFAULT FALSE;
