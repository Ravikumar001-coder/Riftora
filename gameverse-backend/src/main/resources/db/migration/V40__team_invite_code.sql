-- V40: Add invite_code to teams table
ALTER TABLE teams
    ADD COLUMN invite_code VARCHAR(36) UNIQUE;
