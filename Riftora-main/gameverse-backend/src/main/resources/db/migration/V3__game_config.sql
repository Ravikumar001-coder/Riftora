-- Module 03: Game Configuration Management Schema

CREATE TABLE games (
    game_id VARCHAR(36) PRIMARY KEY,
    game_name VARCHAR(100) NOT NULL,
    game_code VARCHAR(20) UNIQUE NOT NULL,
    icon_url VARCHAR(500),
    cover_url VARCHAR(500),
    uid_label VARCHAR(50) NOT NULL,
    uid_regex VARCHAR(200) NOT NULL,
    uid_example VARCHAR(100),
    max_team_size INT NOT NULL,
    min_team_size INT NOT NULL,
    max_substitutes INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scoring_templates (
    template_id VARCHAR(36) PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    org_id VARCHAR(36),
    template_name VARCHAR(100) NOT NULL,
    template_code ENUM('bgis_standard', 'bmps_classic', 'community_cup', 'kill_heavy', 'custom') NOT NULL,
    kill_cap INT,
    kill_pts_each DECIMAL(6,2),
    tiebreaker_seq JSON,
    is_system_tmpl BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

CREATE TABLE placement_points (
    pp_id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL,
    placement INT NOT NULL,
    points DECIMAL(6,2) NOT NULL,
    UNIQUE KEY uk_template_placement (template_id, placement),
    FOREIGN KEY (template_id) REFERENCES scoring_templates(template_id)
);

CREATE TABLE linked_game_accounts (
    linked_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    in_game_uid VARCHAR(100) NOT NULL,
    in_game_name VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_game_uid (user_id, game_id, in_game_uid),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);
