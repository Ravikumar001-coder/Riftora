-- FR-03-015: Blacklist UIDs table
CREATE TABLE blacklist_uids (
    blacklist_id VARCHAR(36) PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    uid VARCHAR(100) NOT NULL,
    reason VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    UNIQUE KEY uk_game_uid (game_id, uid),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

-- FR-03-018: Add matches_per_round to tournaments
ALTER TABLE tournaments
    ADD COLUMN matches_per_round INT DEFAULT 1;
