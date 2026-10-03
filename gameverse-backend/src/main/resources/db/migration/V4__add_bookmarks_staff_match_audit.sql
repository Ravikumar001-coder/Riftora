-- V4__add_bookmarks_staff_match_audit.sql

CREATE TABLE tournament_bookmarks (
    bookmark_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tb_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_tb_tourney FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    CONSTRAINT uq_tb_user_tourney UNIQUE (user_id, tournament_id)
);

CREATE TABLE tournament_staff (
    staff_id VARCHAR(36) PRIMARY KEY,
    tourney_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    staff_role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ts_tourney FOREIGN KEY (tourney_id) REFERENCES tournaments(tournament_id),
    CONSTRAINT fk_ts_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT uq_ts_user_role UNIQUE (tourney_id, user_id, staff_role)
);

CREATE TABLE matches (
    match_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    assigned_referee VARCHAR(36),
    match_number INT NOT NULL,
    round_number INT NOT NULL,
    match_label VARCHAR(100),
    scheduled_start TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    void_reason TEXT,
    voided_by VARCHAR(36),
    voided_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_match_tourney FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    CONSTRAINT fk_match_referee FOREIGN KEY (assigned_referee) REFERENCES users(user_id),
    CONSTRAINT fk_match_voided_by FOREIGN KEY (voided_by) REFERENCES users(user_id),
    CONSTRAINT uq_match_number UNIQUE (tournament_id, match_number)
);

CREATE TABLE audit_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    actor_user_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36),
    match_id VARCHAR(36),
    entity_type VARCHAR(50),
    action_code VARCHAR(100) NOT NULL,
    action_details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_al_actor FOREIGN KEY (actor_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_al_tourney FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    CONSTRAINT fk_al_match FOREIGN KEY (match_id) REFERENCES matches(match_id)
);
