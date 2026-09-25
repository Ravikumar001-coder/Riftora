-- Module 01: Email Verification Schema

ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

CREATE TABLE email_verifications (
    token VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
