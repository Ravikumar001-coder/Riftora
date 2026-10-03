-- Module 04: Team & Player Management Schema

CREATE TABLE teams (
    team_id VARCHAR(36) PRIMARY KEY,
    captain_user_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    team_tag VARCHAR(10) NOT NULL,
    team_slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    country VARCHAR(2),
    is_active BOOLEAN DEFAULT TRUE,
    total_matches INT DEFAULT 0,
    total_wins INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (captain_user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE team_members (
    member_id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    role ENUM('captain', 'player', 'substitute') NOT NULL,
    in_game_uid VARCHAR(100) NOT NULL,
    in_game_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME,
    UNIQUE KEY uk_team_user (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE team_invitations (
    invite_id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL,
    invited_by VARCHAR(36) NOT NULL,
    invited_email VARCHAR(255),
    invited_user_id VARCHAR(36),
    in_game_uid VARCHAR(100),
    role ENUM('player', 'substitute') NOT NULL,
    status ENUM('pending', 'accepted', 'declined', 'expired') DEFAULT 'pending',
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (invited_by) REFERENCES users(user_id),
    FOREIGN KEY (invited_user_id) REFERENCES users(user_id)
);
