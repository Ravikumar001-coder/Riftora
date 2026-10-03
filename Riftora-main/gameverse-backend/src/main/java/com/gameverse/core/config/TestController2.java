package com.gameverse.core.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
@RequestMapping("/v1/public")
public class TestController2 {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/seed-update")
    public String seedUpdate() {
        jdbcTemplate.update("UPDATE organizations SET kyc_status='pending', billing_status='ACTIVE', visibility='PUBLIC', is_verified=true WHERE org_slug='hydra-esports'");
        return "Updated test data successfully!";
    }
}
