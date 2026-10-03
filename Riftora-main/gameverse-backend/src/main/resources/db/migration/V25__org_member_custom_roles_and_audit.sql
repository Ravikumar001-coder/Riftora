ALTER TABLE org_members
ADD COLUMN custom_role_name VARCHAR(50) NULL;

CREATE TABLE org_role_audit_logs (
    log_id VARCHAR(36) NOT NULL,
    org_id VARCHAR(36) NOT NULL,
    target_user_id VARCHAR(36) NOT NULL,
    actor_user_id VARCHAR(36) NOT NULL,
    old_role VARCHAR(50) NULL,
    new_role VARCHAR(50) NOT NULL,
    old_custom_role_name VARCHAR(50) NULL,
    new_custom_role_name VARCHAR(50) NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id),
    CONSTRAINT fk_audit_org FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    CONSTRAINT fk_audit_target_user FOREIGN KEY (target_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_audit_actor_user FOREIGN KEY (actor_user_id) REFERENCES users(user_id)
);
