-- Module 14: Notifications
CREATE TABLE notification_templates (
    template_id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36),
    template_code VARCHAR(50) NOT NULL,
    title_template VARCHAR(200) NOT NULL,
    body_template TEXT NOT NULL,
    channels JSON NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_system_tmpl BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

-- Seed System Notification Templates
INSERT INTO notification_templates (template_id, template_code, title_template, body_template, channels, priority, is_system_tmpl) VALUES
(UUID(), 'NOTIF_MATCH_START', 'Match is starting soon!', 'Your match {match_label} is starting in 15 minutes.', '["in_app", "push"]', 'high', TRUE),
(UUID(), 'NOTIF_RESULT_PUBLISHED', 'Match Results Published', 'Results for {match_label} are now available.', '["in_app", "push"]', 'medium', TRUE),
(UUID(), 'NOTIF_INVITATION', 'You are invited!', 'You have been invited to join {org_name}.', '["in_app", "email"]', 'high', TRUE);

-- Seed System Scoring Templates for BGMI
SET @bgmi_id = (SELECT game_id FROM games WHERE game_code = 'bgmi' LIMIT 1);
SET @bgis_tmpl_id = UUID();

-- Only insert if the BGMI game exists
INSERT INTO scoring_templates (template_id, game_id, template_name, template_code, kill_cap, kill_pts_each, tiebreaker_seq, is_system_tmpl) 
SELECT @bgis_tmpl_id, @bgmi_id, 'BGIS Standard', 'bgis_standard', NULL, 1.00, '["wwcd", "total_kills"]', TRUE
FROM DUAL WHERE @bgmi_id IS NOT NULL;

INSERT INTO placement_points (pp_id, template_id, placement, points) 
SELECT UUID(), @bgis_tmpl_id, 1, 15 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 2, 12 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 3, 10 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 4, 8 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 5, 6 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 6, 4 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 7, 2 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 8, 1 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 9, 1 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 10, 1 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 11, 0 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 12, 0 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 13, 0 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 14, 0 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 15, 0 FROM DUAL WHERE @bgmi_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 16, 0 FROM DUAL WHERE @bgmi_id IS NOT NULL;
