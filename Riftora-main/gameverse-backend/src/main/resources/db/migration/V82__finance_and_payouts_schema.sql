-- V82__finance_and_payouts_schema.sql
-- Adds support for Module 16: Prize Pool & Payment Management

CREATE TABLE team_payout_methods (
    method_id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL,
    method_type VARCHAR(20) NOT NULL, -- upi, bank_account
    account_details JSON NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE org_payout_methods (
    method_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    method_type VARCHAR(20) NOT NULL, -- upi, bank_account
    account_details JSON NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at DATETIME,
    kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    kyc_details JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

CREATE TABLE transaction_ledgers (
    transaction_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- entry_fee, refund, platform_fee, prize_payout, organizer_payout
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL, -- pending, queued, processing, completed, failed
    reference_id VARCHAR(100),
    target_type VARCHAR(20) NOT NULL, -- team, organization, platform
    target_id VARCHAR(36) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
);

ALTER TABLE prize_positions
ADD COLUMN payout_status VARCHAR(20) DEFAULT 'pending', -- pending, queued, processing, completed, failed, held, manual
ADD COLUMN payout_transaction_id VARCHAR(36) NULL,
ADD COLUMN winner_team_id VARCHAR(36) NULL,
ADD COLUMN team_payout_method_id VARCHAR(36) NULL,
ADD FOREIGN KEY (winner_team_id) REFERENCES teams(team_id),
ADD FOREIGN KEY (payout_transaction_id) REFERENCES transaction_ledgers(transaction_id),
ADD FOREIGN KEY (team_payout_method_id) REFERENCES team_payout_methods(method_id);
