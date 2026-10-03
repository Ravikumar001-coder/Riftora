INSERT IGNORE INTO tournaments (
    tournament_id, org_id, game_id, name, slug, status, 
    start_date, end_date, timezone, format, 
    team_size, max_teams, slots_filled,
    created_by, created_at, updated_at
) VALUES (
    'e49b6e99-316a-4c41-bdce-7b2a41b85397', 'hydra-org-id', 'GAME-BGMI', 'User Custom Tournament', 'user-custom-tournament', 'published',
    CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY), 'Asia/Kolkata', 'bracket',
    4, 64, 1,
    'test-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

INSERT IGNORE INTO registrations (
    registration_id, tournament_id, team_id, captain_user_id,
    reference_number, status, payment_status, flag_score, slot_number,
    rules_agreed, rules_agreed_at, rules_agreed_ip,
    approved_by, approved_at, created_at, updated_at
) VALUES (
    'REG-USER-001', 'e49b6e99-316a-4c41-bdce-7b2a41b85397', 'TEAM-001', 'U-002',
    'GV-USER-001', 'under_review', 'not_required', 'yellow', 1,
    TRUE, CURRENT_TIMESTAMP, '192.168.1.100',
    NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

INSERT IGNORE INTO registration_rosters (
    roster_id, registration_id, user_id, team_member_id,
    player_role, in_game_uid, in_game_name, is_active, activated_by
) VALUES 
('RST-USER-001', 'REG-USER-001', 'U-002', 'TM-001', 'player', 'UserCapt#NA1', 'User Capt', TRUE, 'test-user-id'),
('RST-USER-002', 'REG-USER-001', 'U-004', 'TM-002', 'player', 'UserFragger#NA1', 'User Fragger', TRUE, 'test-user-id');
