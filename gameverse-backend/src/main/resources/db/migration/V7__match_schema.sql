-- Module 07: Match Scheduling Schema

CREATE TABLE matches (
    match_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    assigned_referee VARCHAR(36),
    
    match_number INT NOT NULL,
    round_number INT NOT NULL,
    match_label VARCHAR(100),
    
    scheduled_start DATETIME NOT NULL,
    actual_start DATETIME,
    actual_end DATETIME,
    
    status ENUM(
        'scheduled', 'lobby_open', 'in_progress', 'paused',
        'result_submitted', 'pending_verification', 'completed', 'voided', 'rescheduled'
    ) DEFAULT 'scheduled',
    
    void_reason TEXT,
    voided_by VARCHAR(36),
    voided_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_tournament_match_num (tournament_id, match_number),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (assigned_referee) REFERENCES users(user_id),
    FOREIGN KEY (voided_by) REFERENCES users(user_id)
);

CREATE TABLE match_slots (
    slot_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    registration_id VARCHAR(36),
    team_id VARCHAR(36),
    
    slot_number INT NOT NULL,
    is_bye BOOLEAN DEFAULT FALSE,
    no_show BOOLEAN DEFAULT FALSE,
    no_show_at DATETIME,
    
    UNIQUE KEY uk_match_slot_num (match_id, slot_number),
    UNIQUE KEY uk_match_registration (match_id, registration_id),
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE technical_pauses (
    pause_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    declared_by VARCHAR(36) NOT NULL,
    resolved_by VARCHAR(36),
    
    reason ENUM('game_crash', 'unauthorized_player', 'network_issue', 'observer_issue', 'other') NOT NULL,
    reason_notes TEXT,
    
    paused_at DATETIME NOT NULL,
    est_resume_at DATETIME,
    resumed_at DATETIME,
    
    resolution ENUM('resumed', 'voided'),
    
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (declared_by) REFERENCES users(user_id),
    FOREIGN KEY (resolved_by) REFERENCES users(user_id)
);
