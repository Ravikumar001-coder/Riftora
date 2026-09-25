-- V11: Seed Team and Player Statistics

-- Wait for any previous teams and users to exist.
-- To avoid foreign key failures if teams/users don't exist, we will use INSERT IGNORE 
-- or just insert dummy data mapped to existing records. 
-- Assuming there is a game "BGMI" or some default game.
-- For local dev, a simple INSERT INTO SELECT is safer.

INSERT IGNORE INTO team_statistics (stat_id, team_id, game_id, total_tournaments, total_matches_played, total_kills, chicken_dinner_count, average_placement, average_kills_per_match, win_rate)
SELECT 
    UUID(),
    t.team_id,
    g.game_id,
    10, 
    50, 
    120, 
    5, 
    3.5, 
    2.4, 
    0.10
FROM teams t
CROSS JOIN (SELECT game_id FROM games LIMIT 1) g
LIMIT 5;

INSERT IGNORE INTO player_statistics (stat_id, user_id, game_id, total_matches_played, total_kills, total_damage, highest_kill_game, average_kills_per_match)
SELECT 
    UUID(),
    u.user_id,
    g.game_id,
    50, 
    120, 
    15400.50, 
    8, 
    2.4
FROM users u
CROSS JOIN (SELECT game_id FROM games LIMIT 1) g
WHERE u.onboarding_path = 'player'
LIMIT 10;
