-- Add anomalies column to match_results for FR-10-024
ALTER TABLE match_results
ADD COLUMN anomalies JSON;

-- Create result_disputes table for FR-10-021, FR-10-022, FR-10-023
CREATE TABLE result_disputes (
    dispute_id VARCHAR(36) PRIMARY KEY,
    result_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    submitted_by VARCHAR(36) NOT NULL,
    claimed_placement INT,
    claimed_kills INT,
    evidence_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(36),
    resolution_notes TEXT,
    CONSTRAINT fk_dispute_result FOREIGN KEY (result_id) REFERENCES match_results(result_id),
    CONSTRAINT fk_dispute_team FOREIGN KEY (team_id) REFERENCES teams(team_id),
    CONSTRAINT fk_dispute_submitter FOREIGN KEY (submitted_by) REFERENCES users(user_id),
    CONSTRAINT fk_dispute_resolver FOREIGN KEY (resolved_by) REFERENCES users(user_id)
);
