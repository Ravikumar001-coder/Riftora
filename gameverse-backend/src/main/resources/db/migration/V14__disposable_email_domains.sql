CREATE TABLE disposable_email_domains (
    id VARCHAR(36) PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    added_by VARCHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(user_id)
);

-- Seed initial disposable domains
INSERT INTO disposable_email_domains (id, domain, created_at) VALUES 
(UUID(), 'mailinator.com', CURRENT_TIMESTAMP),
(UUID(), 'guerrillamail.com', CURRENT_TIMESTAMP),
(UUID(), '10minutemail.com', CURRENT_TIMESTAMP),
(UUID(), 'tempmail.com', CURRENT_TIMESTAMP),
(UUID(), 'yopmail.com', CURRENT_TIMESTAMP),
(UUID(), 'throwawaymail.com', CURRENT_TIMESTAMP),
(UUID(), 'temp-mail.org', CURRENT_TIMESTAMP),
(UUID(), 'temp-mail.com', CURRENT_TIMESTAMP);
