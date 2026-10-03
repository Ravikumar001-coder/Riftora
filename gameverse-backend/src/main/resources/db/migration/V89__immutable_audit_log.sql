CREATE TABLE immutable_audit_logs (
    event_id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    actor_id VARCHAR(36),
    actor_role VARCHAR(100),
    target_type VARCHAR(100),
    target_id VARCHAR(36),
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    previous_hash VARCHAR(64),
    hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE INDEX idx_ial_target ON immutable_audit_logs(target_type, target_id);
CREATE INDEX idx_ial_actor ON immutable_audit_logs(actor_id);
CREATE INDEX idx_ial_type ON immutable_audit_logs(event_type);
CREATE INDEX idx_ial_created ON immutable_audit_logs(created_at);
