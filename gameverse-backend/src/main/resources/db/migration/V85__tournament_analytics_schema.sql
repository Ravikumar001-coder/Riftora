-- V85: Tournament Analytics Schema

CREATE TABLE tournament_analytics (
    analytics_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL UNIQUE,
    org_id VARCHAR(36) NOT NULL,
    
    total_participants INT DEFAULT 0,
    total_registrations INT DEFAULT 0,
    prize_pool_distributed DECIMAL(12, 2) DEFAULT 0.00,
    total_revenue DECIMAL(12, 2) DEFAULT 0.00,
    
    no_show_rate DECIMAL(5, 2) DEFAULT 0.00,
    disputes_raised INT DEFAULT 0,
    avg_match_duration_minutes INT DEFAULT 0,
    stream_peak_viewers INT DEFAULT 0,
    
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_analytics_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    CONSTRAINT fk_analytics_org FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE
);

CREATE INDEX idx_analytics_org ON tournament_analytics(org_id);
