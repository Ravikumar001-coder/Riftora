-- FR-03-009: Add bonus points to scoring templates
ALTER TABLE scoring_templates
    ADD COLUMN first_blood_pts DECIMAL(6, 2) DEFAULT NULL,
    ADD COLUMN team_wipe_pts DECIMAL(6, 2) DEFAULT NULL,
    ADD COLUMN mvp_pts DECIMAL(6, 2) DEFAULT NULL,
    ADD COLUMN winner_bonus_pts DECIMAL(6, 2) DEFAULT NULL;
