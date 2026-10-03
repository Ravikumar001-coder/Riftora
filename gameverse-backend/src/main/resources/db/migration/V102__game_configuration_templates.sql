-- V102__game_configuration_templates.sql

CREATE TABLE IF NOT EXISTS game_configuration_templates (
    template_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    version INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'DRAFT',
    
    match_format JSON,
    tournament_structure JSON,
    scoring_system JSON,
    tiebreakers JSON,
    map_pool JSON,
    map_rotation JSON,
    stage_configuration JSON,
    
    in_game_rules JSON,
    roster_rules JSON,
    lobby_rules JSON,
    advancement_rules JSON,
    result_rules JSON,
    dispute_rules JSON,
    
    champion_rush JSON, -- Free Fire specific
    
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_gct_org FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    CONSTRAINT fk_gct_game FOREIGN KEY (game_id) REFERENCES games(game_id),
    CONSTRAINT fk_gct_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Also add a reference to tournaments so we know which template was used
ALTER TABLE tournaments
ADD COLUMN game_config_template_id VARCHAR(36) NULL,
ADD CONSTRAINT fk_tourn_gct FOREIGN KEY (game_config_template_id) REFERENCES game_configuration_templates(template_id);
