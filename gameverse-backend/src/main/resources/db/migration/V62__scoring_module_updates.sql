-- Module 10: Live Scoring & Points Engine Updates

-- Add publication mode and draft status to match_results
ALTER TABLE match_results 
ADD COLUMN is_draft BOOLEAN DEFAULT FALSE,
ADD COLUMN publication_mode ENUM('auto_publish', 'director_verify') DEFAULT 'auto_publish';

-- Add additional scoring metrics to team_match_scores
ALTER TABLE team_match_scores
ADD COLUMN raw_kills INT DEFAULT 0,
ADD COLUMN effective_kills INT DEFAULT 0,
ADD COLUMN bonus_points INT DEFAULT 0,
ADD COLUMN is_disqualified BOOLEAN DEFAULT FALSE,
ADD COLUMN dq_reason TEXT;

-- Create score_corrections audit log table
CREATE TABLE score_corrections (
    correction_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    field_changed VARCHAR(50) NOT NULL,
    old_value INT,
    new_value INT,
    reason TEXT NOT NULL,
    corrected_by VARCHAR(36) NOT NULL,
    corrected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (corrected_by) REFERENCES users(user_id)
);
