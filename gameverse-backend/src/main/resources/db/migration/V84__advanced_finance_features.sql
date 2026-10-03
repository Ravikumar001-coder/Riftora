-- V84__advanced_finance_features.sql
-- FR-16-009: Unclaimed prize tracking
-- FR-16-011: Atomic payout execution tracking
-- FR-16-013: Payout retry / manual payout marking
-- FR-16-015: Payment receipts for team captains
-- FR-16-016: Organizer payout release tracking
-- FR-16-017: Organization KYC documents
-- FR-16-019/020: Non-cash prize management
-- FR-16-021/022/023: Org financial dashboard / CSV export / monthly statements

-- ── FR-16-009: Unclaimed Prize Handling ─────────────────────────────────────
ALTER TABLE prize_positions
    ADD COLUMN unclaimed_hold_until DATETIME NULL,          -- 30-day extended hold deadline
    ADD COLUMN unclaimed_returned_at DATETIME NULL,          -- when returned to organizer
    ADD COLUMN admin_note TEXT NULL;                         -- administrative note for unclaimed return

-- ── FR-16-011 / FR-16-013: Payout Execution Tracking ────────────────────────
-- Add retry count, failure reason, manual payout tracking to transaction_ledgers
ALTER TABLE transaction_ledgers
    ADD COLUMN failure_reason TEXT NULL,                     -- reason for failed payout
    ADD COLUMN retry_count INT DEFAULT 0,                    -- number of retry attempts
    ADD COLUMN razorpay_payout_id VARCHAR(100) NULL,         -- Razorpay payout reference
    ADD COLUMN payout_mode VARCHAR(20) NULL,                 -- UPI, NEFT, IMPS, MANUAL
    ADD COLUMN is_manual_payout BOOLEAN DEFAULT FALSE,       -- FR-16-013: director marked as manual
    ADD COLUMN manual_payout_note TEXT NULL,                 -- director's note for manual payout
    ADD COLUMN completed_at DATETIME NULL;                   -- when payout actually completed

-- ── FR-16-015: Payment Receipts ─────────────────────────────────────────────
CREATE TABLE payment_receipts (
    receipt_id      VARCHAR(36)    NOT NULL PRIMARY KEY,
    transaction_id  VARCHAR(36)    NOT NULL,
    tournament_id   VARCHAR(36)    NOT NULL,
    team_id         VARCHAR(36)    NOT NULL,
    pos_id          VARCHAR(36)    NULL,                     -- prize position if prize payout
    receipt_number  VARCHAR(50)    NOT NULL UNIQUE,          -- e.g. RCPT-2026-0001
    amount          DECIMAL(12,2)  NOT NULL,
    currency        VARCHAR(3)     DEFAULT 'INR',
    payout_method   VARCHAR(20)    NULL,                     -- upi, bank_account
    payout_account  VARCHAR(255)   NULL,                     -- masked account/UPI
    transaction_ref VARCHAR(100)   NULL,                     -- Razorpay / reference
    generated_at    DATETIME       NOT NULL,
    CONSTRAINT fk_receipt_transaction FOREIGN KEY (transaction_id) REFERENCES transaction_ledgers(transaction_id),
    CONSTRAINT fk_receipt_tournament  FOREIGN KEY (tournament_id)  REFERENCES tournaments(tournament_id)
);

-- ── FR-16-016: Organizer Payout Release ─────────────────────────────────────
ALTER TABLE tournaments
    ADD COLUMN organizer_payout_released BOOLEAN DEFAULT FALSE,
    ADD COLUMN organizer_payout_released_at DATETIME NULL,
    ADD COLUMN organizer_payout_amount DECIMAL(12,2) NULL;

-- ── FR-16-017: Organization KYC Documents ───────────────────────────────────
CREATE TABLE org_kyc_documents (
    doc_id          VARCHAR(36)    NOT NULL PRIMARY KEY,
    org_id          VARCHAR(36)    NOT NULL,
    doc_type        VARCHAR(50)    NOT NULL,       -- pan, gst, aadhaar, passport, driving_license, bank_statement
    doc_number      VARCHAR(100)   NULL,            -- PAN number, GST number, etc.
    doc_url         VARCHAR(500)   NULL,            -- uploaded file URL
    status          VARCHAR(20)    DEFAULT 'pending',  -- pending, verified, rejected
    rejection_reason TEXT          NULL,
    verified_by     VARCHAR(36)    NULL,
    verified_at     DATETIME       NULL,
    submitted_at    DATETIME       NOT NULL,
    CONSTRAINT fk_kyc_org FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

-- ── FR-16-019/020: Non-Cash Prize Management ─────────────────────────────────
CREATE TABLE non_cash_prizes (
    prize_id        VARCHAR(36)    NOT NULL PRIMARY KEY,
    pos_id          VARCHAR(36)    NOT NULL,                   -- prize position reference
    tournament_id   VARCHAR(36)    NOT NULL,
    item_name       VARCHAR(255)   NOT NULL,
    item_description TEXT          NULL,
    item_category   VARCHAR(50)    NULL,                       -- merchandise, peripheral, ingame, voucher
    quantity        INT            DEFAULT 1,
    estimated_value DECIMAL(12,2)  NULL,
    -- Shipping details (for physical items)
    requires_shipping BOOLEAN      DEFAULT FALSE,
    winner_name     VARCHAR(200)   NULL,
    winner_address  TEXT           NULL,
    winner_phone    VARCHAR(20)    NULL,
    winner_pincode  VARCHAR(10)    NULL,
    -- Dispatch tracking
    dispatch_status VARCHAR(20)    DEFAULT 'pending',          -- pending, dispatched, delivered, failed
    dispatch_date   DATETIME       NULL,
    tracking_number VARCHAR(100)   NULL,
    courier_name    VARCHAR(100)   NULL,
    delivered_at    DATETIME       NULL,
    organizer_note  TEXT           NULL,
    created_at      DATETIME       NOT NULL,
    updated_at      DATETIME       NOT NULL,
    CONSTRAINT fk_nc_prize_pos        FOREIGN KEY (pos_id)        REFERENCES prize_positions(pos_id),
    CONSTRAINT fk_nc_prize_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
);

-- ── FR-16-023: Monthly Financial Statements ──────────────────────────────────
CREATE TABLE org_monthly_statements (
    statement_id    VARCHAR(36)    NOT NULL PRIMARY KEY,
    org_id          VARCHAR(36)    NOT NULL,
    year            INT            NOT NULL,
    month           INT            NOT NULL,                   -- 1-12
    total_revenue   DECIMAL(12,2)  DEFAULT 0.00,
    total_fees_paid DECIMAL(12,2)  DEFAULT 0.00,
    total_prizes    DECIMAL(12,2)  DEFAULT 0.00,
    total_earnings  DECIMAL(12,2)  DEFAULT 0.00,
    tournament_count INT           DEFAULT 0,
    registration_count INT         DEFAULT 0,
    generated_at    DATETIME       NOT NULL,
    CONSTRAINT fk_stmt_org FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    CONSTRAINT uq_org_year_month UNIQUE (org_id, year, month)
);
