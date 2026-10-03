-- Seed Matches and Match Slots for Tournament T-001 (Hydra BGMI Showdown)
-- Assumes Tournament T-001 and Teams TEAM-001, TEAM-002 exist.

INSERT INTO matches (match_id, tournament_id, match_number, round_number, match_label, scheduled_start, status)
VALUES 
('M-001', 'T-001', 1, 1, 'Group A - Match 1', '2026-09-23 10:00:00', 'scheduled'),
('M-002', 'T-001', 2, 1, 'Group A - Match 2', '2026-09-23 11:00:00', 'scheduled')
ON DUPLICATE KEY UPDATE match_label=VALUES(match_label);

INSERT INTO match_slots (slot_id, match_id, team_id, slot_number, slot_label, is_bye, no_show)
VALUES
('SLOT-001', 'M-001', 'TEAM-001', 1, 'Pochinki', FALSE, FALSE),
('SLOT-002', 'M-001', 'TEAM-002', 2, 'Yasnaya Polyana', FALSE, FALSE),
('SLOT-003', 'M-002', 'TEAM-001', 1, 'School', FALSE, FALSE),
('SLOT-004', 'M-002', 'TEAM-002', 2, 'Rozhok', FALSE, FALSE)
ON DUPLICATE KEY UPDATE slot_number=VALUES(slot_number);
