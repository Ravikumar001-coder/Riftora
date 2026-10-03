ALTER TABLE tournaments 
ADD COLUMN master_access_code VARCHAR(50) UNIQUE;

ALTER TABLE tournaments 
DROP COLUMN director_access_code,
DROP COLUMN referee_access_code,
DROP COLUMN broadcaster_access_code;
