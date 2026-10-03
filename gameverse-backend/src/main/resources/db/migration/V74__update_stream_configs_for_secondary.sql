-- Add support for secondary streams
ALTER TABLE stream_configs DROP INDEX tournament_id;

ALTER TABLE stream_configs 
ADD COLUMN is_primary BOOLEAN DEFAULT TRUE,
ADD COLUMN language VARCHAR(50) DEFAULT 'en';
