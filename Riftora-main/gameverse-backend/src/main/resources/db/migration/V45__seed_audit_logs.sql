-- V45__seed_audit_logs.sql
INSERT INTO audit_logs (log_id, actor_user_id, tournament_id, entity_type, action_code, action_details, ip_address, created_at)
SELECT UUID(), (SELECT user_id FROM users LIMIT 1), 'tourney-1', 'Match', 'MATCH_CREATED', '{"details": "Match created for tournament 1"}', '127.0.0.1', NOW()
FROM tournaments WHERE tournament_id = 'tourney-1'
ON DUPLICATE KEY UPDATE log_id=log_id;

INSERT INTO audit_logs (log_id, actor_user_id, tournament_id, entity_type, action_code, action_details, ip_address, created_at)
SELECT UUID(), (SELECT user_id FROM users LIMIT 1), 'tourney-1', 'Tournament', 'TOURNAMENT_STARTED', '{"details": "Tournament 1 has been started"}', '127.0.0.1', NOW()
FROM tournaments WHERE tournament_id = 'tourney-1'
ON DUPLICATE KEY UPDATE log_id=log_id;

INSERT INTO audit_logs (log_id, actor_user_id, tournament_id, entity_type, action_code, action_details, ip_address, created_at)
SELECT UUID(), (SELECT user_id FROM users LIMIT 1), 'tourney-1', 'Scoring', 'SCORE_CORRECTION_MADE', '{"details": "Corrected score for match 1"}', '127.0.0.1', NOW()
FROM tournaments WHERE tournament_id = 'tourney-1'
ON DUPLICATE KEY UPDATE log_id=log_id;
