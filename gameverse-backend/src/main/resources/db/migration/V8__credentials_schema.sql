-- Module 08: Secure Room Credential Management Schema

CREATE TABLE room_credentials (
    credential_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    entered_by VARCHAR(36) NOT NULL,
    released_by VARCHAR(36),
    rotated_from VARCHAR(36),
    
    room_id_encrypted BLOB NOT NULL,
    password_encrypted BLOB NOT NULL,
    encryption_key_ref VARCHAR(100) NOT NULL,
    
    release_mode ENUM('instant', 'timed', 'manual') NOT NULL,
    scheduled_release_at DATETIME,
    released_at DATETIME,
    expires_at DATETIME,
    
    is_active BOOLEAN DEFAULT TRUE,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at DATETIME,
    revoke_reason VARCHAR(200),
    
    entry_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (entered_by) REFERENCES users(user_id),
    FOREIGN KEY (released_by) REFERENCES users(user_id),
    FOREIGN KEY (rotated_from) REFERENCES room_credentials(credential_id)
);

CREATE TABLE credential_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    credential_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    match_id VARCHAR(36) NOT NULL,
    
    action ENUM('entered', 'released', 'viewed', 'rotated', 'revoked', 'acknowledged') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_id VARCHAR(36),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (credential_id) REFERENCES room_credentials(credential_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (match_id) REFERENCES matches(match_id)
);
