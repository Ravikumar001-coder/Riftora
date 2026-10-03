-- V34: Organization Followers and Billing Status

-- 1. Add billing status and cycle end date to organizations
ALTER TABLE organizations
ADD COLUMN current_period_end DATETIME NULL,
ADD COLUMN next_plan_id VARCHAR(36) NULL,
ADD COLUMN billing_status VARCHAR(20) DEFAULT 'ACTIVE',
ADD CONSTRAINT fk_org_next_plan FOREIGN KEY (next_plan_id) REFERENCES org_plans(plan_id);

-- 2. Create organization followers table
CREATE TABLE org_followers (
    follower_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    followed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_follower_org FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
    CONSTRAINT fk_follower_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_org_user (org_id, user_id)
);
