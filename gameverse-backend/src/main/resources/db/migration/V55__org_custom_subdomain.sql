ALTER TABLE organizations
ADD COLUMN custom_subdomain VARCHAR(100) UNIQUE;
