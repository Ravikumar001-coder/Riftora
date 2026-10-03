-- V87: Add Health Score Metrics to Analytics

ALTER TABLE tournament_analytics
ADD COLUMN on_time_match_delivery_rate DECIMAL(5, 2) DEFAULT 0.00,
ADD COLUMN scoring_error_rate DECIMAL(5, 2) DEFAULT 0.00,
ADD COLUMN check_in_rate DECIMAL(5, 2) DEFAULT 0.00,
ADD COLUMN organizer_health_score DECIMAL(5, 2) DEFAULT 0.00;
