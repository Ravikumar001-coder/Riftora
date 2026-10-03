CREATE TABLE scoring_templates (
    template_id VARCHAR(36) NOT NULL PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    org_id VARCHAR(36) NULL,
    template_name VARCHAR(200) NOT NULL,
    template_code VARCHAR(50) NULL,
    kill_cap INT NULL,
    kill_pts_each NUMERIC(6,2) NOT NULL DEFAULT 1.00,
    tiebreaker_seq JSON NULL,
    is_system_tmpl BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

CREATE TABLE placement_points (
    pp_id VARCHAR(36) NOT NULL PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL,
    placement INT NOT NULL,
    points NUMERIC(6,2) NOT NULL,
    UNIQUE(template_id, placement),
    FOREIGN KEY (template_id) REFERENCES scoring_templates(template_id) ON DELETE CASCADE
);

-- Seed System Templates for BGMI
SET @bgmi_id = (SELECT game_id FROM games WHERE game_code = 'BGMI' LIMIT 1);
SET @bgis_tmpl_id = UUID();

INSERT INTO scoring_templates (template_id, game_id, org_id, template_name, template_code, kill_cap, kill_pts_each, tiebreaker_seq, is_system_tmpl)
SELECT 
    @bgis_tmpl_id, 
    @bgmi_id, 
    NULL, 
    'BGIS Official (15-12-10)', 
    'bgis_official', 
    NULL, 
    1.00, 
    JSON_ARRAY('CHICKEN_DINNERS', 'TOTAL_KILLS', 'BEST_PLACEMENT'),
    TRUE
WHERE @bgmi_id IS NOT NULL;

-- 15-12-10-8-6-4-2-1-1-1-1-1-0-0-0-0
INSERT INTO placement_points (pp_id, template_id, placement, points)
SELECT UUID(), @bgis_tmpl_id, 1, 15.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 2, 12.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 3, 10.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 4, 8.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 5, 6.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 6, 4.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 7, 2.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 8, 1.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 9, 1.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 10, 1.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 11, 1.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 12, 1.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 13, 0.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 14, 0.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 15, 0.00 WHERE @bgis_tmpl_id IS NOT NULL UNION ALL
SELECT UUID(), @bgis_tmpl_id, 16, 0.00 WHERE @bgis_tmpl_id IS NOT NULL;
