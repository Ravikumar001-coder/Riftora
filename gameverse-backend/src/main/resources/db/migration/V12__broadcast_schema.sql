-- Module 12: Broadcast & Stream Control Schema

CREATE TABLE stream_configs (
    config_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL UNIQUE,
    configured_by VARCHAR(36) NOT NULL,
    
    platform ENUM('youtube', 'twitch', 'custom') NOT NULL,
    channel_id VARCHAR(200),
    stream_url VARCHAR(500),
    stream_key_enc BLOB,
    rtmp_url VARCHAR(500),
    
    obs_ws_url VARCHAR(200),
    obs_ws_pass_enc BLOB,
    obs_connected BOOLEAN DEFAULT FALSE,
    obs_scenes JSON,
    
    is_live BOOLEAN DEFAULT FALSE,
    stream_started_at DATETIME,
    stream_ended_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (configured_by) REFERENCES users(user_id)
);

CREATE TABLE overlay_configs (
    overlay_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    config_id VARCHAR(36) NOT NULL,
    
    overlay_type ENUM('leaderboard_full', 'top10', 'match_info_bar', 'sponsor_banner', 'result_splash', 'grand_finale') NOT NULL,
    overlay_url TEXT,
    token VARCHAR(36),
    is_visible BOOLEAN DEFAULT FALSE,
    
    position_cfg JSON,
    style_cfg JSON,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (config_id) REFERENCES stream_configs(config_id)
);
