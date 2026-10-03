ALTER TABLE organizations
ADD COLUMN country VARCHAR(100) AFTER description,
ADD COLUMN city VARCHAR(100) AFTER country,
ADD COLUMN instagram_handle VARCHAR(255) AFTER website_url,
ADD COLUMN youtube_url VARCHAR(255) AFTER instagram_handle,
ADD COLUMN discord_link VARCHAR(255) AFTER youtube_url;
