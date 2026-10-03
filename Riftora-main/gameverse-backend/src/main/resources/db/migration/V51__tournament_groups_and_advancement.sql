CREATE TABLE tournament_groups (
    group_id CHAR(36) NOT NULL PRIMARY KEY,
    tournament_id CHAR(36) NOT NULL,
    group_name VARCHAR(20) NOT NULL,
    group_code VARCHAR(5) NOT NULL,
    advancement_spots SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    UNIQUE KEY idx_tourney_group_name (tournament_id, group_name),
    UNIQUE KEY idx_tourney_group_code (tournament_id, group_code)
);

ALTER TABLE matches 
ADD COLUMN group_id CHAR(36) NULL,
ADD CONSTRAINT fk_match_group FOREIGN KEY (group_id) REFERENCES tournament_groups(group_id) ON DELETE SET NULL;

ALTER TABLE tournaments
ADD COLUMN group_advancement_rule VARCHAR(30) DEFAULT 'TOTAL_POINTS',
ADD COLUMN wild_card_spots INT DEFAULT 0;
