CREATE TABLE chat_message_reactions (
    reaction_id VARCHAR(36) NOT NULL,
    message_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    emoji VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reaction_id),
    CONSTRAINT fk_chat_reaction_message FOREIGN KEY (message_id) REFERENCES chat_messages(message_id) ON DELETE CASCADE,
    UNIQUE KEY uk_message_user_emoji (message_id, user_id, emoji)
);
