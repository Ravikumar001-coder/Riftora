-- Youtube Integrations
CREATE TABLE youtube_integrations (
    integration_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL UNIQUE,
    youtube_channel_id VARCHAR(255) NOT NULL,
    youtube_channel_name VARCHAR(255),
    access_token_enc BLOB NOT NULL,
    refresh_token_enc BLOB,
    token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);
