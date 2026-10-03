-- Drop the old table created in V25 if it exists
DROP TABLE IF EXISTS org_role_audit_logs;

-- FR-02-020: Org Plans
CREATE TABLE org_plans (
    plan_id VARCHAR(36) PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_code ENUM('free', 'starter', 'pro', 'elite', 'enterprise') NOT NULL,
    max_tournaments INT NULL,
    max_teams_per_tournament INT NOT NULL,
    max_active_members INT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    features JSON
);

-- Seed plans
INSERT INTO org_plans (plan_id, plan_name, plan_code, max_tournaments, max_teams_per_tournament, max_active_members, price_monthly, features) VALUES
(UUID(), 'Free', 'free', 4, 32, 3, 0.00, '{"basic_registration": true, "manual_scoring": true}'),
(UUID(), 'Starter', 'starter', 12, 64, 8, 999.00, '{"room_management": true, "live_leaderboard": true}'),
(UUID(), 'Pro', 'pro', NULL, 128, 20, 2999.00, '{"broadcast_overlays": true, "analytics": true}'),
(UUID(), 'Elite', 'elite', NULL, 256, NULL, 7999.00, '{"white_label": true, "sponsor_tools": true, "priority_support": true}'),
(UUID(), 'Enterprise', 'enterprise', NULL, 500, NULL, 15000.00, '{"custom_integrations": true, "dedicated_support": true, "sla": true}');

-- Add plan_id to organizations and set default to Free
ALTER TABLE organizations ADD COLUMN plan_id VARCHAR(36) NULL AFTER owner_user_id;
UPDATE organizations SET plan_id = (SELECT plan_id FROM org_plans WHERE plan_code = 'free' LIMIT 1);
ALTER TABLE organizations MODIFY COLUMN plan_id VARCHAR(36) NOT NULL;
ALTER TABLE organizations ADD CONSTRAINT fk_org_plan FOREIGN KEY (plan_id) REFERENCES org_plans(plan_id);

-- FR-02-019: Audit Logs for all events
CREATE TABLE org_audit_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    actor_user_id VARCHAR(36) NOT NULL,
    target_user_id VARCHAR(36) NULL,
    event_type ENUM('INVITATION_SENT', 'INVITATION_ACCEPTED', 'INVITATION_DECLINED', 'ROLE_CHANGED', 'MEMBER_REMOVED', 'OWNERSHIP_TRANSFERRED', 'MEMBER_LEFT') NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    FOREIGN KEY (actor_user_id) REFERENCES users(user_id),
    FOREIGN KEY (target_user_id) REFERENCES users(user_id)
);
