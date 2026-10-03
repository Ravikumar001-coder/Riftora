-- V100: Add scheduled_publish_date to tournaments and cancellation notification template

ALTER TABLE tournaments ADD COLUMN scheduled_publish_date DATETIME;

INSERT INTO notification_templates (template_id, template_code, title_template, body_template, channels, priority, is_system_tmpl) VALUES
(UUID(), 'NOTIF_TOURNAMENT_CANCELLED', 'Tournament Cancelled', 'The tournament {tournament_name} has been cancelled. Reason: {reason}', '["in_app", "email"]', 'high', TRUE),
(UUID(), 'NOTIF_TOURNAMENT_POSTPONED', 'Tournament Postponed', 'The tournament {tournament_name} has been postponed. Please check the tournament page for new dates.', '["in_app", "email"]', 'high', TRUE);
