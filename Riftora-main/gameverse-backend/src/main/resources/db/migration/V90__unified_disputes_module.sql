-- Update tournaments to keep track of dispute sequence
ALTER TABLE tournaments ADD COLUMN dispute_sequence INT DEFAULT 0;

-- Update disputes table for Module 20
ALTER TABLE disputes
MODIFY COLUMN match_id VARCHAR(36) NULL, -- Can be null for general tournament disputes
ADD COLUMN tournament_id VARCHAR(36) AFTER match_id,
ADD COLUMN reference_number VARCHAR(50) AFTER dispute_id,
ADD COLUMN requested_resolution TEXT AFTER description,
ADD COLUMN team_id VARCHAR(36) AFTER submitted_by,
MODIFY COLUMN category VARCHAR(100) NOT NULL;

-- Populate tournament_id for existing disputes via match_id
UPDATE disputes d
JOIN matches m ON d.match_id = m.match_id
SET d.tournament_id = m.tournament_id
WHERE d.tournament_id IS NULL;

-- Make tournament_id NOT NULL if we assume every dispute belongs to a tournament
-- ALTER TABLE disputes MODIFY COLUMN tournament_id VARCHAR(36) NOT NULL;

-- Add Foreign Keys
ALTER TABLE disputes ADD CONSTRAINT fk_disputes_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id);
ALTER TABLE disputes ADD CONSTRAINT fk_disputes_team FOREIGN KEY (team_id) REFERENCES teams(team_id);
ALTER TABLE disputes ADD CONSTRAINT uq_disputes_ref UNIQUE (reference_number);

-- Update dispute_resolutions
ALTER TABLE dispute_resolutions
MODIFY COLUMN action_taken VARCHAR(100) NOT NULL;
