-- Module 06: Registration Seed Data
-- ════════════════════════════════════════════════════════════════════════════
-- This script seeds mock registration data for existing tournaments and teams
-- It assumes the following exist from previous seed scripts:
-- Tournaments:
-- 1. tournament_id = 'T-001' (Hydra BGMI Showdown - LIVE)
-- 2. tournament_id = 'T-002' (CS2 Weekend Clash - SCHEDULED)
-- 3. tournament_id = 'T-003' (Valorant Challenger Cup - REGISTRATION_OPEN)
-- Teams: 
-- 1. team_id = 'TEAM-001' (Team Liquid)
-- 2. team_id = 'TEAM-002' (Hydra Esports)
-- Users:
-- 1. user_id = 'U-001' (Org Owner / Admin)
-- 2. user_id = 'U-002' (Captain Team Liquid)
-- 3. user_id = 'U-003' (Captain Hydra)
-- ════════════════════════════════════════════════════════════════════════════

-- Clear existing data (if any) in reverse order of foreign key constraints
DELETE FROM registration_rosters;
DELETE FROM check_ins;
DELETE FROM payment_transactions;
DELETE FROM registrations;

-- 1. TEAM LIQUID REGISTERED FOR VALORANT CHALLENGER CUP (T-003) - STATUS: APPROVED
INSERT INTO registrations (
    registration_id, tournament_id, team_id, captain_user_id,
    reference_number, status, payment_status, flag_score, slot_number,
    rules_agreed, rules_agreed_at, rules_agreed_ip,
    approved_by, approved_at, created_at, updated_at
) VALUES (
    'REG-001', 'T-003', 'TEAM-001', 'U-002',
    'GV-VALO-001', 'approved', 'not_required', 'green', 1,
    TRUE, CURRENT_TIMESTAMP, '192.168.1.100',
    'U-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Roster for Team Liquid (REG-001)
INSERT INTO registration_rosters (
    roster_id, registration_id, user_id, team_member_id,
    player_role, in_game_uid, in_game_name, is_active, activated_by
) VALUES 
('RST-001-1', 'REG-001', 'U-002', 'TM-001', 'player', 'LiquidCapt#NA1', 'Liquid Capt', TRUE, 'U-001'),
('RST-001-2', 'REG-001', 'U-004', 'TM-002', 'player', 'LiquidFragger#NA1', 'Liquid Fragger', TRUE, 'U-001'),
('RST-001-3', 'REG-001', 'U-005', 'TM-003', 'player', 'LiquidSupport#NA1', 'Liquid Support', TRUE, 'U-001'),
('RST-001-4', 'REG-001', 'U-006', 'TM-004', 'player', 'LiquidIGL#NA1', 'Liquid IGL', TRUE, 'U-001'),
('RST-001-5', 'REG-001', 'U-007', 'TM-005', 'player', 'LiquidFlex#NA1', 'Liquid Flex', TRUE, 'U-001');

-- 2. HYDRA ESPORTS REGISTERED FOR VALORANT CHALLENGER CUP (T-003) - STATUS: CORRECTION REQUESTED
INSERT INTO registrations (
    registration_id, tournament_id, team_id, captain_user_id,
    reference_number, status, payment_status, flag_score, 
    rules_agreed, rules_agreed_at, rules_agreed_ip,
    correction_notes, created_at, updated_at
) VALUES (
    'REG-002', 'T-003', 'TEAM-002', 'U-003',
    'GV-VALO-002', 'correction_requested', 'not_required', 'yellow',
    TRUE, CURRENT_TIMESTAMP, '192.168.1.101',
    'HydraSub#123 does not match Riot ID format.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Roster for Hydra Esports (REG-002)
INSERT INTO registration_rosters (
    roster_id, registration_id, user_id, team_member_id,
    player_role, in_game_uid, in_game_name, is_active, activated_by
) VALUES 
('RST-002-1', 'REG-002', 'U-003', 'TM-006', 'player', 'HydraCapt#IN1', 'Hydra Capt', TRUE, 'U-003'),
('RST-002-2', 'REG-002', 'U-008', 'TM-007', 'player', 'HydraAim#IN1', 'Hydra Aim', TRUE, 'U-003'),
('RST-002-3', 'REG-002', 'U-009', 'TM-008', 'player', 'HydraSmokes#IN1', 'Hydra Smokes', TRUE, 'U-003'),
('RST-002-4', 'REG-002', 'U-010', 'TM-009', 'player', 'HydraDuel#IN1', 'Hydra Duel', TRUE, 'U-003'),
('RST-002-5', 'REG-002', 'U-011', 'TM-010', 'substitute', 'HydraSub_INVALID', 'Hydra Sub', TRUE, 'U-003');

-- Update tournament count
UPDATE tournaments SET slots_filled = 1 WHERE tournament_id = 'T-003';
