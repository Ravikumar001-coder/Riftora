-- Migration for FR-01-025: Shareable Join Links and Username Invites

-- Modify org_invitations to support username search invitations (target_user_id)
-- Also make email nullable, as targeted invites might not require an email if the user is identified by ID.
ALTER TABLE org_invitations MODIFY email VARCHAR(255) NULL;
ALTER TABLE org_invitations ADD COLUMN target_user_id VARCHAR(36) NULL;
ALTER TABLE org_invitations ADD CONSTRAINT fk_org_invitations_target_user FOREIGN KEY (target_user_id) REFERENCES users(user_id);

-- Create new table for shareable join links
CREATE TABLE org_join_links (
    link_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    max_uses INT NULL,
    current_uses INT DEFAULT 0,
    expires_at DATETIME NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
