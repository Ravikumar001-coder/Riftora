-- Add result_publication_mode to tournaments to satisfy FR-10-013

ALTER TABLE tournaments
ADD COLUMN result_publication_mode VARCHAR(50) DEFAULT 'auto_publish';
