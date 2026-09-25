-- Add primary_game_id to organizations
ALTER TABLE organizations
ADD COLUMN primary_game_id VARCHAR(36) AFTER org_slug;

-- Wait, what if there are existing organizations? We need to handle that, but since it's dev we'll allow nullable during ALTER then maybe make it NOT NULL, or just leave it nullable in DB but enforce in app. Let's make it nullable in DB for safety if there are rows, or we can just make it NOT NULL if we assume we'll truncate or default. Actually, let's leave it nullable in the schema update to prevent migration failures if data exists, but enforce via JPA.

ALTER TABLE organizations
ADD CONSTRAINT fk_org_primary_game FOREIGN KEY (primary_game_id) REFERENCES games(game_id);
