CREATE TABLE chat_settings (
    tournament_id VARCHAR(36) PRIMARY KEY,
    slow_mode_seconds INT DEFAULT 0,
    subscribers_only_mode BOOLEAN DEFAULT FALSE,
    competitor_only_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE chat_restrictions (
    id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    guest_name VARCHAR(100),
    restriction_type VARCHAR(20) NOT NULL, -- MUTE, BAN
    expires_at TIMESTAMP NULL, -- Null if permanent
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_moderation_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    moderator_id VARCHAR(36) NOT NULL,
    target_user_id VARCHAR(36),
    target_guest_name VARCHAR(100),
    action_type VARCHAR(50) NOT NULL, -- DELETE, WARN, MUTE, BAN
    message_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
