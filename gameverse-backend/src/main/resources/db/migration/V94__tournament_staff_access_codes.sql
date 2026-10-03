ALTER TABLE tournaments 
ADD COLUMN director_access_code VARCHAR(20) UNIQUE,
ADD COLUMN referee_access_code VARCHAR(20) UNIQUE,
ADD COLUMN broadcaster_access_code VARCHAR(20) UNIQUE;
