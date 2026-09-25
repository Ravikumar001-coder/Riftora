INSERT INTO games (game_id, game_name, game_code, uid_label, uid_regex, uid_example, max_team_size, min_team_size) 
VALUES 
(UUID(), 'Battlegrounds Mobile India', 'bgmi', 'Character ID', '^[0-9]{8,12}$', '5123456789', 6, 4),
(UUID(), 'Free Fire MAX', 'free-fire-max', 'Player UID', '^[0-9]{8,10}$', '1234567890', 6, 4),
(UUID(), 'Valorant', 'valorant', 'Riot ID', '^.{3,16}#[a-zA-Z0-9]{3,5}$', 'Player#NA1', 7, 5)
ON DUPLICATE KEY UPDATE game_id=game_id;
