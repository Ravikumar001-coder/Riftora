-- Module 02: Organization Management Schema

CREATE TABLE organizations (
    org_id VARCHAR(36) PRIMARY KEY,
    org_name VARCHAR(100) NOT NULL,
    org_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    primary_color VARCHAR(10),
    secondary_color VARCHAR(10),
    website_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    owner_user_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(user_id)
);

CREATE TABLE org_members (
    member_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('owner', 'admin', 'moderator', 'staff') NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_org_user (org_id, user_id),
    FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE org_invitations (
    invite_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('owner', 'admin', 'moderator', 'staff') NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('pending', 'accepted', 'expired') DEFAULT 'pending',
    invited_by VARCHAR(36) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    FOREIGN KEY (invited_by) REFERENCES users(user_id)
);
