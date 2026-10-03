INSERT IGNORE INTO users (user_id, username, display_name, email, password_hash, is_active, platform_role)
VALUES ('test-user-id', 'test_user', 'Test User', '157cseravikumar@example.com', 'dummy_hash', TRUE, 'user');

INSERT IGNORE INTO organizations (org_id, org_name, org_slug, owner_user_id)
SELECT 'hydra-org-id', 'Hydra Esports', 'hydra-esports', user_id FROM users WHERE email = '157cseravikumar@example.com' LIMIT 1;
