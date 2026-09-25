-- Module 11: Leaderboard Engine Schema

CREATE TABLE leaderboard_entries (
    entry_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    registration_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    
    current_rank INT NOT NULL,
    previous_rank INT,
    rank_change INT,
    
    total_points DECIMAL(10,2) DEFAULT 0,
    total_kills INT DEFAULT 0,
    total_matches INT DEFAULT 0,
    chicken_dinners INT DEFAULT 0,
    avg_placement DECIMAL(5,2),
    highest_kill_game INT DEFAULT 0,
    
    is_eliminated BOOLEAN DEFAULT FALSE,
    last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_leaderboard_reg (tournament_id, registration_id),
    INDEX idx_leaderboard_rank (tournament_id, current_rank),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE leaderboard_snapshots (
    snapshot_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    triggered_by_match VARCHAR(36),
    
    snapshot_data JSON NOT NULL,
    snapshot_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    round_number INT,
    match_number INT,
    
    INDEX idx_snapshot_time (tournament_id, snapshot_at),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (triggered_by_match) REFERENCES matches(match_id)
);
