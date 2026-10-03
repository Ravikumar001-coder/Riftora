-- Module 06: Registration Schema

CREATE TABLE payment_transactions (
    txn_id VARCHAR(36) PRIMARY KEY,
    registration_id VARCHAR(36), -- FK added later
    user_id VARCHAR(36) NOT NULL,
    gateway VARCHAR(50) NOT NULL,
    gateway_order_id VARCHAR(200) UNIQUE NOT NULL,
    gateway_txn_id VARCHAR(200),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status ENUM('pending', 'captured', 'failed', 'refunded') NOT NULL,
    payment_method VARCHAR(50),
    captured_at DATETIME,
    refunded_at DATETIME,
    refund_id VARCHAR(200),
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE registrations (
    registration_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    captain_user_id VARCHAR(36) NOT NULL,
    
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM(
        'draft', 'submitted', 'under_review', 'correction_requested', 
        'correction_submitted', 'approved', 'rejected', 'waitlisted', 'withdrawn'
    ) DEFAULT 'draft',
    
    entry_fee_paid DECIMAL(10,2) DEFAULT 0,
    payment_status ENUM('not_required', 'pending', 'paid', 'refunded'),
    payment_txn_id VARCHAR(36),
    
    rules_agreed BOOLEAN DEFAULT FALSE,
    rules_agreed_at DATETIME,
    rules_agreed_ip VARCHAR(45),
    
    flag_score ENUM('green', 'yellow', 'red') DEFAULT 'green',
    rejection_reason TEXT,
    correction_notes TEXT,
    correction_deadline DATETIME,
    
    slot_number INT,
    approved_by VARCHAR(36),
    approved_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_tournament_team (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (captain_user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_txn_id) REFERENCES payment_transactions(txn_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

ALTER TABLE payment_transactions
ADD CONSTRAINT fk_payment_registration
FOREIGN KEY (registration_id) REFERENCES registrations(registration_id);

CREATE TABLE registration_rosters (
    roster_id VARCHAR(36) PRIMARY KEY,
    registration_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    team_member_id VARCHAR(36),
    
    player_role ENUM('player', 'substitute') NOT NULL,
    in_game_uid VARCHAR(100) NOT NULL,
    in_game_name VARCHAR(100),
    
    is_active BOOLEAN DEFAULT TRUE,
    activated_at DATETIME,
    activated_by VARCHAR(36),
    
    UNIQUE KEY uk_reg_user (registration_id, user_id),
    UNIQUE KEY uk_reg_uid (registration_id, in_game_uid),
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (team_member_id) REFERENCES team_members(member_id),
    FOREIGN KEY (activated_by) REFERENCES users(user_id)
);

CREATE TABLE check_ins (
    checkin_id VARCHAR(36) PRIMARY KEY,
    registration_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36) NOT NULL,
    checked_in_by VARCHAR(36) NOT NULL,
    checkin_type ENUM('self', 'manual') NOT NULL,
    checkin_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (checked_in_by) REFERENCES users(user_id)
);
