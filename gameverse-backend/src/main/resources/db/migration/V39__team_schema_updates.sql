-- Module 04 updates
ALTER TABLE teams
    ADD COLUMN banner_url VARCHAR(500),
    ADD COLUMN description VARCHAR(200),
    ADD COLUMN social_instagram VARCHAR(200),
    ADD COLUMN social_youtube VARCHAR(200);
