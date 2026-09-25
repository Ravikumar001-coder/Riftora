-- Module 11: Leaderboard Engine Seed Data
-- ════════════════════════════════════════════════════════════════════════════
-- Seeds mock leaderboard data for testing live updates in the frontend.
-- Assumes T-003, REG-001 (Team Liquid), and REG-002 (Hydra Esports) exist.
-- ════════════════════════════════════════════════════════════════════════════

-- Team Liquid (TEAM-001) in T-003
INSERT INTO leaderboard_entries (
    entry_id, tournament_id, registration_id, team_id,
    current_rank, previous_rank, rank_change,
    total_points, total_kills, total_matches, chicken_dinners,
    avg_placement, highest_kill_game, is_eliminated, last_updated_at
) VALUES (
    'LDB-ENTRY-001', 'T-003', 'REG-001', 'TEAM-001',
    1, 2, 1,
    50.00, 30, 3, 1,
    2.50, 15, FALSE, CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE current_rank=VALUES(current_rank);

-- Hydra Esports (TEAM-002) in T-003
INSERT INTO leaderboard_entries (
    entry_id, tournament_id, registration_id, team_id,
    current_rank, previous_rank, rank_change,
    total_points, total_kills, total_matches, chicken_dinners,
    avg_placement, highest_kill_game, is_eliminated, last_updated_at
) VALUES (
    'LDB-ENTRY-002', 'T-003', 'REG-002', 'TEAM-002',
    2, 1, -1,
    45.00, 25, 3, 0,
    3.00, 12, FALSE, CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE current_rank=VALUES(current_rank);
