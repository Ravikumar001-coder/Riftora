-- V10: Create Team and Player Statistics Tables

CREATE TABLE team_statistics (
    stat_id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    total_tournaments INT DEFAULT 0,
    total_matches_played INT DEFAULT 0,
    total_kills INT DEFAULT 0,
    chicken_dinner_count INT DEFAULT 0,
    average_placement DECIMAL(5,2) DEFAULT 0.00,
    average_kills_per_match DECIMAL(5,2) DEFAULT 0.00,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_team_game (team_id, game_id),
    CONSTRAINT fk_team_stat_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_stat_game FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

CREATE TABLE player_statistics (
    stat_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    total_matches_played INT DEFAULT 0,
    total_kills INT DEFAULT 0,
    total_damage DECIMAL(10,2) DEFAULT 0.00,
    highest_kill_game INT DEFAULT 0,
    average_kills_per_match DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_player_game (user_id, game_id),
    CONSTRAINT fk_player_stat_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_player_stat_game FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
