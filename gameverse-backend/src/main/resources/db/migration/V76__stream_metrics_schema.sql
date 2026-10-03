CREATE TABLE stream_metrics (
    metric_id VARCHAR(36) NOT NULL PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    viewer_count INT DEFAULT 0,
    bitrate_kbps INT NULL,
    fps INT NULL,
    dropped_frames_pct DECIMAL(5,2) NULL,
    cpu_usage_pct DECIMAL(5,2) NULL,
    CONSTRAINT fk_stream_metrics_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
);

CREATE INDEX idx_stream_metrics_tournament_recorded ON stream_metrics(tournament_id, recorded_at);
