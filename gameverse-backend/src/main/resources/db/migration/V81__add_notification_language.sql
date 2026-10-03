ALTER TABLE user_notification_preferences ADD COLUMN preferred_language VARCHAR(20) DEFAULT 'en';
ALTER TABLE notification_templates ADD COLUMN language VARCHAR(20) DEFAULT 'en';
