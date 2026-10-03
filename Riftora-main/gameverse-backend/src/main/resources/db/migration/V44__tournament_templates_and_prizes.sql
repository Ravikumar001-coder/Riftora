-- V44__tournament_templates_and_prizes.sql
-- Adds support for Reusable Tournament Templates (FR-05-017) and Split Prize Structures (FR-05-020).

ALTER TABLE tournaments 
ADD COLUMN is_template BOOLEAN DEFAULT FALSE;

ALTER TABLE prize_positions 
ADD COLUMN category VARCHAR(100) NULL;
