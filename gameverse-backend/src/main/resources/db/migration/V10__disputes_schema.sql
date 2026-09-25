-- Module 10: Disputes Schema

CREATE TABLE disputes (
    dispute_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    submitted_by VARCHAR(36) NOT NULL,
    
    category ENUM('score_mismatch', 'rule_violation', 'toxic_behavior', 'hacker_suspected', 'other') NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSON,
    
    status ENUM('open', 'investigating', 'resolved', 'dismissed') DEFAULT 'open',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (submitted_by) REFERENCES users(user_id)
);

CREATE TABLE dispute_resolutions (
    resolution_id VARCHAR(36) PRIMARY KEY,
    dispute_id VARCHAR(36) NOT NULL UNIQUE,
    resolved_by VARCHAR(36) NOT NULL,
    
    resolution_notes TEXT NOT NULL,
    action_taken ENUM('score_corrected', 'team_disqualified', 'warning_issued', 'no_action') NOT NULL,
    
    resolved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dispute_id) REFERENCES disputes(dispute_id),
    FOREIGN KEY (resolved_by) REFERENCES users(user_id)
);
