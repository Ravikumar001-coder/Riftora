CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
    snapshot_id VARCHAR(36) NOT NULL PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    snapshot_name VARCHAR(100) NOT NULL,
    snapshot_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

ALTER TABLE tournaments ADD COLUMN is_leaderboard_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE tournaments ADD COLUMN leaderboard_config JSON;
