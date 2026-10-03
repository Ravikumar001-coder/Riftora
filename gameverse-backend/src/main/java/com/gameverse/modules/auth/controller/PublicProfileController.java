package com.gameverse.modules.auth.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.auth.dto.PublicProfileDto;
import com.gameverse.modules.auth.service.UserProfileService;
import com.gameverse.modules.game.dto.PublicLinkedAccountDto;
import com.gameverse.modules.game.service.LinkedGameAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/public/users")
@RequiredArgsConstructor
public class PublicProfileController {

    private final UserProfileService userProfileService;
    private final LinkedGameAccountService linkedGameAccountService;

    @GetMapping("/{username}/profile")
    public ResponseEntity<ApiResponse<PublicProfileDto>> getPublicProfile(@PathVariable String username) {
        try {
            // Get user profile
            PublicProfileDto profile = userProfileService.getPublicProfile(username);
            
            // Get linked accounts
            List<PublicLinkedAccountDto> accounts = linkedGameAccountService.getVerifiedPublicAccountsByUsername(username);
            profile.setGameAccounts(accounts);
            
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("USER_NOT_FOUND", e.getMessage()));
        }
    }
}
