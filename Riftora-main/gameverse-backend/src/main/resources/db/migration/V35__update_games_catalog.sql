-- V35: Update Games Catalog for FR-03-001 to FR-03-004

-- 1. Add new columns
ALTER TABLE games
ADD COLUMN platform VARCHAR(20) DEFAULT 'MOBILE',
ADD COLUMN genre VARCHAR(50) NULL,
ADD COLUMN publisher VARCHAR(100) NULL,
ADD COLUMN format VARCHAR(30) DEFAULT 'BATTLE_ROYALE';

-- 2. Update existing and insert new games
INSERT INTO games (game_id, game_name, game_code, uid_label, uid_regex, uid_example, max_team_size, min_team_size, platform, genre, publisher, format, is_active)
VALUES
(UUID(), 'Battlegrounds Mobile India', 'bgmi', 'Character ID', '^[0-9]{8,12}$', '5123456789', 6, 4, 'MOBILE', 'Battle Royale', 'Krafton', 'BATTLE_ROYALE', true),
(UUID(), 'Free Fire MAX', 'free-fire-max', 'Player UID', '^[0-9]{8,10}$', '1234567890', 6, 4, 'MOBILE', 'Battle Royale', 'Garena', 'BATTLE_ROYALE', true),
(UUID(), 'PUBG Mobile', 'pubgm', 'Character ID', '^[0-9]{8,12}$', '5123456789', 6, 4, 'MOBILE', 'Battle Royale', 'Tencent', 'BATTLE_ROYALE', true),
(UUID(), 'Call of Duty Mobile', 'codm', 'OpenID', '^[0-9]{15,20}$', '1234567890123456789', 6, 4, 'MOBILE', 'Shooter', 'Activision', 'BATTLE_ROYALE', true),
(UUID(), 'Valorant', 'valorant', 'Riot ID', '^.{3,16}#[a-zA-Z0-9]{3,5}$', 'Player#NA1', 7, 5, 'PC', 'Tactical Shooter', 'Riot Games', 'TEAM_DEATHMATCH', true),
(UUID(), 'Counter-Strike 2', 'cs2', 'Steam ID', '^STEAM_[0-5]:[0-1]:[0-9]{1,10}$', 'STEAM_0:1:1234567', 7, 5, 'PC', 'Tactical Shooter', 'Valve', 'TEAM_DEATHMATCH', true)
ON DUPLICATE KEY UPDATE
    platform = VALUES(platform),
    genre = VALUES(genre),
    publisher = VALUES(publisher),
    format = VALUES(format);
