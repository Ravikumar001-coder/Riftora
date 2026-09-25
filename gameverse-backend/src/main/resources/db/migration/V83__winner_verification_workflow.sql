-- V83__winner_verification_workflow.sql
-- FR-16-005: Confirm Winners flag on tournament
-- FR-16-007: Winner payout submission window tracking on prize_positions
-- FR-16-008: UPI VPA validation status on team_payout_methods

-- FR-16-005: Add winners_confirmed tracking to tournaments
ALTER TABLE tournaments
    ADD COLUMN winners_confirmed BOOLEAN DEFAULT FALSE,
    ADD COLUMN winners_confirmed_at DATETIME NULL,
    ADD COLUMN winners_confirmed_by VARCHAR(36) NULL;

-- FR-16-007: Add winner verification workflow fields to prize_positions
ALTER TABLE prize_positions
    ADD COLUMN payout_window_deadline DATETIME NULL,
    ADD COLUMN payout_details_submitted_at DATETIME NULL,
    ADD COLUMN winner_verified BOOLEAN DEFAULT FALSE;

-- FR-16-008: Add UPI VPA validation tracking to team_payout_methods
ALTER TABLE team_payout_methods
    ADD COLUMN vpa_validation_status VARCHAR(20) DEFAULT 'pending',   -- pending, valid, invalid, skipped
    ADD COLUMN vpa_validated_at DATETIME NULL,
    ADD COLUMN vpa_name VARCHAR(200) NULL;                              -- account holder name returned from VPA check
