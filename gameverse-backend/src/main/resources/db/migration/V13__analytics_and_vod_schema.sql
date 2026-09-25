-- Module 13: Analytics, Stream Annotations & VODs Schema

CREATE TABLE stream_annotations (
    annotation_id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    
    label ENUM('match_start', 'match_end', 'chicken_dinner', 'custom') NOT NULL,
    custom_label VARCHAR(100),
    
    stream_timestamp VARCHAR(50), -- Using VARCHAR(50) for interval representation
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE match_vod_links (
    vod_id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    linked_by VARCHAR(36) NOT NULL,
    
    vod_url VARCHAR(500) NOT NULL,
    start_offset VARCHAR(50), -- Using VARCHAR(50) for interval representation
    platform ENUM('youtube', 'twitch', 'custom') NOT NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (linked_by) REFERENCES users(user_id)
);
