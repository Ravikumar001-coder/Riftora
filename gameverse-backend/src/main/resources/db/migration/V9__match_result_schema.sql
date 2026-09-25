-- Module 09: Match Results Schema

CREATE TABLE match_results (
    result_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL UNIQUE,
    submitted_by VARCHAR(36) NOT NULL,
    
    screenshot_url VARCHAR(500),
    status ENUM('pending', 'verified', 'disputed', 'rejected') DEFAULT 'pending',
    
    verified_by VARCHAR(36),
    verified_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (submitted_by) REFERENCES users(user_id),
    FOREIGN KEY (verified_by) REFERENCES users(user_id)
);

CREATE TABLE team_match_scores (
    score_id VARCHAR(36) PRIMARY KEY,
    result_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    
    placement INT NOT NULL,
    placement_points INT DEFAULT 0,
    kill_points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    
    is_chicken_dinner BOOLEAN DEFAULT FALSE,
    
    UNIQUE KEY uk_result_team (result_id, team_id),
    FOREIGN KEY (result_id) REFERENCES match_results(result_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE player_match_scores (
    player_score_id VARCHAR(36) PRIMARY KEY,
    team_score_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    
    kills INT DEFAULT 0,
    assists INT DEFAULT 0,
    damage DECIMAL(10,2) DEFAULT 0,
    
    UNIQUE KEY uk_team_score_user (team_score_id, user_id),
    FOREIGN KEY (team_score_id) REFERENCES team_match_scores(score_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
