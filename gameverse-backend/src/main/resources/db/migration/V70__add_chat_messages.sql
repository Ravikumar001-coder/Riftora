CREATE TABLE chat_messages (
    message_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36) NOT NULL,
    channel_type ENUM('announcements', 'competitor', 'viewer') NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id)
);

CREATE INDEX idx_chat_tourney_channel ON chat_messages(tournament_id, channel_type, created_at DESC);
