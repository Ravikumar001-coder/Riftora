-- Migration for FR-02-010 and FR-02-011: House Rules and Fonts

ALTER TABLE organizations
ADD COLUMN house_rules TEXT,
ADD COLUMN primary_font VARCHAR(100),
ADD COLUMN secondary_font VARCHAR(100);
