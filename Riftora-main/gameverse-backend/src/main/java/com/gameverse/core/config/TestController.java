package com.gameverse.core.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
@RequestMapping("/v1/public")
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/seed")
    public String seed() {
        jdbcTemplate.update("INSERT IGNORE INTO users (user_id, username, display_name, email, password_hash, is_active, platform_role) VALUES ('test-user-id', 'test_user', 'Test User', '157cseravikumar@example.com', 'dummy_hash', TRUE, 'user')");
        jdbcTemplate.update("INSERT IGNORE INTO organizations (org_id, org_name, org_slug, owner_user_id) SELECT 'hydra-org-id', 'Hydra Esports', 'hydra-esports', user_id FROM users WHERE email = '157cseravikumar@example.com' LIMIT 1");
        return "Seeded test data successfully!";
    }
}
