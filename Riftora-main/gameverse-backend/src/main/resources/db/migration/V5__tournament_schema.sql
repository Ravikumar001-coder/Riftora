-- Module 05: Tournament Management Schema

CREATE TABLE tournaments (
    tournament_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    scoring_template_id VARCHAR(36) NOT NULL,
    created_by VARCHAR(36) NOT NULL,

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    short_description VARCHAR(500),
    banner_url VARCHAR(500),
    rules_text TEXT,
    rulebook_url VARCHAR(500),

    format_type ENUM('league', 'group_stage_finals', 'multi_day'),
    teams_per_match INT NOT NULL,
    total_team_slots INT NOT NULL,
    total_rounds INT NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_open DATETIME NOT NULL,
    registration_close DATETIME NOT NULL,

    entry_fee DECIMAL(10,2) DEFAULT 0,
    min_team_size INT NOT NULL,
    max_team_size INT NOT NULL,
    max_substitutes INT DEFAULT 0,
    approval_mode ENUM('auto', 'manual', 'invite_only'),
    waitlist_enabled BOOLEAN DEFAULT FALSE,
    checkin_required BOOLEAN DEFAULT TRUE,
    checkin_open_mins INT,
    checkin_close_mins INT,

    prize_pool_total DECIMAL(12,2) DEFAULT 0,
    prize_currency VARCHAR(3) DEFAULT 'INR',
    prize_funded_by ENUM('entry_fees', 'sponsor', 'org') DEFAULT 'entry_fees',

    status ENUM(
        'draft',
        'scheduled',
        'registration_open',
        'registration_closed',
        'check_in',
        'live',
        'completed',
        'cancelled'
    ) DEFAULT 'draft',
    published_at DATETIME,
    completed_at DATETIME,

    stream_url VARCHAR(500),
    stream_platform ENUM('youtube', 'twitch', 'custom'),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (scoring_template_id) REFERENCES scoring_templates(template_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE tournament_staff (
    staff_id VARCHAR(36) PRIMARY KEY,
    tourney_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    staff_role ENUM('tournament_dir', 'referee', 'broadcast_prod') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tourney_user_role (tourney_id, user_id, staff_role),
    FOREIGN KEY (tourney_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE prize_positions (
    pos_id VARCHAR(36) PRIMARY KEY,
    tourney_id VARCHAR(36) NOT NULL,
    position INT NOT NULL,
    label TEXT,
    amount DECIMAL(12,2),
    percentage DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tourney_position (tourney_id, position),
    FOREIGN KEY (tourney_id) REFERENCES tournaments(tournament_id)
);

CREATE TABLE tournament_messages (
    msg_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    message_type ENUM('announcement', 'pre_tournament', 'match_day') NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
